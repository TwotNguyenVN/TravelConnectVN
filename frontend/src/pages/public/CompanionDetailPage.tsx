import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PageContainer, Card, Badge, Button, Modal, LoadingBlock, EmptyState 
} from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ReportModal } from '../../components/common/Report/ReportModal';
import { companionService } from '../../services/companionService';
import { expenseService } from '../../services/expenseService';
import chatService from '../../services/chatService';
import type { CompanionRequest } from '../../services/companionService';
import { DEFAULT_AVATAR } from '../../constants/images';
import './CompanionDetailPage.css';

interface CompanionDetailPageProps {
  isEmbedded?: boolean;
}

const CompanionDetailPage: React.FC<CompanionDetailPageProps> = ({ isEmbedded = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myRequest, setMyRequest] = useState<CompanionRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Expense Splitter States
  const [activeTab, setActiveTab] = useState<'info' | 'expenses'>(isEmbedded ? 'expenses' : 'info');
  const [expenseData, setExpenseData] = useState<any>(null);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedSettlement, setSelectedQrSettlement] = useState<any>(null);
  
  // Expense Form State
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [paidByUserId, setPaidByUserId] = useState('');
  const [splitMethod, setSplitMethod] = useState<'equally' | 'custom'>('equally');
  const [splitShares, setSplitShares] = useState<{ [key: string]: string }>({});

  // VietQR state for settlement modal (beneficiary info of creditor)
  const [qrBankId, setQrBankId] = useState('ICB');
  const [qrAccountNo, setQrAccountNo] = useState('');
  const [qrAccountName, setQrAccountName] = useState('');

  // Personal bank info for receiving payments
  const [myBankId, setMyBankId] = useState('ICB');
  const [myAccountNo, setMyAccountNo] = useState('');
  const [myAccountName, setMyAccountName] = useState('');
  const [savingBank, setSavingBank] = useState(false);

  const isOwner = user?.id === post?.user_id;
  const isApprovedMember = myRequest?.status === 'approved';
  const canAccessExpenses = isOwner || isApprovedMember;

  console.log('[DEBUG CompanionDetail]', {
    userId: user?.id,
    postUserId: post?.user_id,
    isOwner,
    isApprovedMember,
    canAccessExpenses,
    activeTab,
    isEmbedded
  });

  const fetchExpenses = useCallback(async () => {
    if (!id) return;
    console.log('[DEBUG CompanionDetail] fetchExpenses calling...');
    setExpensesLoading(true);
    try {
      const res = await expenseService.getExpenses(id);
      console.log('[DEBUG CompanionDetail] fetchExpenses response:', res);
      if (res.success) {
        setExpenseData(res.data);
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
      toast.error('Không thể tải thông tin chi tiêu');
    } finally {
      setExpensesLoading(false);
    }
  }, [id, toast]);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const postRes = await companionService.getPostDetail(id);
      if (postRes.success) {
        setPost(postRes.data);
      } else {
        setError('Không tìm thấy bài đăng hoặc bài đăng đã bị xóa.');
      }
      if (user) {
        const reqRes = await companionService.getMyRequestForPost(id);
        if (reqRes.success && reqRes.data) {
          setMyRequest(reqRes.data);
        }
      }

      // Set initial active image
      if (postRes.success && postRes.data.images?.length > 0) {
        const cover = postRes.data.images.find((img: any) => img.isCover);
        setActiveImage(cover?.imageUrl || postRes.data.images[0].imageUrl);
      }
    } catch (err: any) {
      console.error('Error fetching companion detail:', err);
      if (err.response?.status === 404) {
        setError('Bài đăng không tồn tại hoặc đã bị gỡ bỏ.');
      } else {
        setError('Đã xảy ra lỗi khi tải thông tin. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  useEffect(() => {
    if (!isEmbedded && post && user && post.user_id === user.id) {
      navigate(`/user/companion-posts/${post.id}/edit?tab=view`);
    }
  }, [post, user, isEmbedded, navigate]);

  useEffect(() => {
    if (id && canAccessExpenses && activeTab === 'expenses') {
      fetchExpenses();
    }
  }, [id, activeTab, canAccessExpenses, fetchExpenses]);

  useEffect(() => {
    if (expenseData?.members && user) {
      const myMember = expenseData.members.find((m: any) => m.id === user.id);
      if (myMember) {
        setMyBankId(myMember.bankId || 'ICB');
        setMyAccountNo(myMember.accountNo || '');
        setMyAccountName(myMember.accountName || user.user_metadata?.full_name?.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/Đ/g, "D") || '');
      }
    }
  }, [expenseData, user]);

  const handleSaveBankInfo = async () => {
    if (!id) return;
    if (!myAccountNo.trim()) {
      toast.error('Vui lòng nhập số tài khoản ngân hàng');
      return;
    }
    if (!myAccountName.trim()) {
      toast.error('Vui lòng nhập tên chủ tài khoản viết hoa không dấu');
      return;
    }
    setSavingBank(true);
    try {
      const res = await expenseService.updateMyBank(id, {
        bankId: myBankId,
        accountNo: myAccountNo,
        accountName: myAccountName,
      });
      if (res.success) {
        toast.success('Cập nhật tài khoản nhận tiền thành công!');
        fetchExpenses();
      }
    } catch (err) {
      toast.error('Không thể lưu thông tin ngân hàng');
    } finally {
      setSavingBank(false);
    }
  };

  const handleSendRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await companionService.sendRequest({
        postId: id!,
        message: requestMessage
      });
      if (response.success) {
        setMyRequest(response.data);
        setShowRequestModal(false);
        toast.success('Gửi yêu cầu thành công!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenGroupChat = async () => {
    if (!id) return;
    try {
      setChatLoading(true);
      const res = await chatService.createGroupCompanion(id);
      if (res.success && res.data) {
        navigate('/user/messages', { state: { conversationId: res.data.id } });
      } else {
        toast.error('Không thể mở nhóm chat.');
      }
    } catch (err: any) {
      console.error('Error opening group chat:', err);
      toast.error('Có lỗi xảy ra. Bạn chưa được duyệt hoặc nhóm chưa có đủ điều kiện.');
    } finally {
      setChatLoading(false);
    }
  };

  const openAddExpenseModal = () => {
    if (!expenseData?.members) return;
    const initialShares: { [key: string]: string } = {};
    expenseData.members.forEach((m: any) => {
      initialShares[m.id] = 'true'; // Checked by default for equally splitting
    });
    setSplitShares(initialShares);
    setPaidByUserId(user?.id || '');
    setExpenseTitle('');
    setExpenseAmount('');
    setExpenseDate(new Date().toISOString().split('T')[0]);
    setSplitMethod('equally');
    setShowAddExpenseModal(true);
  };

  const handleAddExpense = async () => {
    if (!id) return;
    if (!expenseTitle.trim()) {
      toast.error('Vui lòng nhập tên khoản chi');
      return;
    }
    const parsedAmount = Number(expenseAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    const selectedMembers = Object.keys(splitShares).filter(uid => splitShares[uid] !== 'false' && splitShares[uid] !== '');
    if (selectedMembers.length === 0) {
      toast.error('Vui lòng chọn ít nhất một người chia sẻ chi phí');
      return;
    }

    let splits: { userId: string; amount: number }[] = [];

    if (splitMethod === 'equally') {
      const shareAmount = parsedAmount / selectedMembers.length;
      splits = selectedMembers.map(uid => ({
        userId: uid,
        amount: Math.round(shareAmount),
      }));
    } else {
      let totalCustom = 0;
      for (const uid of selectedMembers) {
        const val = Number(splitShares[uid]);
        if (isNaN(val) || val <= 0) {
          toast.error('Vui lòng nhập số tiền chia sẻ hợp lệ cho các thành viên được chọn');
          return;
        }
        totalCustom += val;
        splits.push({
          userId: uid,
          amount: val,
        });
      }

      if (Math.abs(totalCustom - parsedAmount) > 10) {
        toast.error(`Tổng tiền chia (${totalCustom.toLocaleString()}đ) khác tổng chi tiêu (${parsedAmount.toLocaleString()}đ)`);
        return;
      }
    }

    try {
      const res = await expenseService.createExpense(id, {
        title: expenseTitle,
        amount: parsedAmount,
        paidByUserId,
        expenseDate,
        splits,
      });

      if (res.success) {
        toast.success('Thêm khoản chi tiêu thành công!');
        setShowAddExpenseModal(false);
        fetchExpenses();
      }
    } catch (err: any) {
      console.error('Error creating expense:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi tạo khoản chi');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!id) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa khoản chi này?')) return;
    try {
      const res = await expenseService.deleteExpense(id, expenseId);
      if (res.success) {
        toast.success('Xóa khoản chi thành công!');
        fetchExpenses();
      }
    } catch (err: any) {
      console.error('Error deleting expense:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi xóa khoản chi');
    }
  };

  const handleSettle = async (debtorId: string, creditorId: string) => {
    if (!id) return;
    if (!window.confirm('Xác nhận nợ đã được thanh toán và quyết toán sòng phẳng?')) return;
    try {
      const res = await expenseService.settleDebt(id, { debtorId, creditorId });
      if (res.success) {
        toast.success('Quyết toán nợ thành công!');
        setShowQrModal(false);
        fetchExpenses();
      } else {
        toast.error(res.message || 'Có lỗi xảy ra khi quyết toán');
      }
    } catch (err: any) {
      console.error('Error settling debt:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi quyết toán');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) return (
    <PageContainer>
      <LoadingBlock height={400} />
      <div style={{ marginTop: '20px' }}>
        <LoadingBlock height={200} />
      </div>
    </PageContainer>
  );

  if (error || !post) return (
    <PageContainer>
      <EmptyState 
        title="Không thể hiển thị bài đăng" 
        description={error || "Bài đăng này hiện không khả dụng."}
        action={<Button variant="primary" onClick={() => navigate('/companions')}>Quay lại danh sách</Button>}
      />
    </PageContainer>
  );

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Đang tuyển';
      case 'closed': return 'Đã đủ người';
      case 'completed': return 'Đã hoàn tất';
      default: return status;
    }
  };

  return (
    <PageContainer className="companion-detail-page" size={isEmbedded ? 'full' : 'large'}>
      {canAccessExpenses && !isEmbedded && (
        <div className="companion-detail-tabs">
          <button 
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <i className="fa-solid fa-circle-info"></i> Thông tin chuyến đi
          </button>
          <button 
            className={`tab-btn ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            <i className="fa-solid fa-calculator"></i> Chi tiêu nhóm
          </button>
        </div>
      )}

      {(activeTab === 'info' && !isEmbedded) || !canAccessExpenses ? (
        <div className="detail-layout">
          <div className="main-content">
            <Card className="detail-card">
              {post.images && post.images.length > 0 ? (
                <div className="detail-gallery">
                  <div className="main-image">
                    <img 
                      src={activeImage || (post.images.find((img: any) => img.isCover)?.imageUrl || post.images[0].imageUrl)} 
                      alt={post.title} 
                    />
                  </div>
                  {post.images.length > 1 && (
                    <div className="thumbnail-grid">
                      {post.images.map((img: any, idx: number) => (
                        <div 
                          key={idx} 
                          className={`thumbnail-item ${activeImage === img.imageUrl ? 'active' : ''}`}
                          onClick={() => setActiveImage(img.imageUrl)}
                        >
                          <img src={img.imageUrl} alt={`${post.title} ${idx + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="detail-no-image">
                  <div className="placeholder-image">
                     <i className="lucide-image"></i>
                     <span>Không có hình ảnh mô tả</span>
                  </div>
                </div>
              )}

              <div className="detail-header">
                <Badge variant={
                  post.business_status === 'open' ? 'success' : 
                  post.business_status === 'completed' ? 'primary' :
                  'secondary'
                }>
                  {getStatusLabel(post.business_status || '')}
                </Badge>
                <h1 className="detail-title">{post.title}</h1>
                <div className="detail-meta">
                  <span>Đăng bởi <strong>{post.users?.full_name}</strong></span>
                  <span> • </span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </div>

              <div className="companion-intro-box">
                <div className="intro-header">
                  <i className="fa-solid fa-map"></i>
                  <span>Mô tả chuyến đi</span>
                </div>
                <p>{post.description}</p>
              </div>

              <div className="detail-info-grid">
                <div className="info-box">
                  <span className="label">Điểm đến</span>
                  <span className="value">{post.destination}</span>
                </div>
                <div className="info-box">
                  <span className="label">Thời gian</span>
                  <span className="value">{formatDate(post.start_date)} - {formatDate(post.end_date)}</span>
                </div>
                <div className="info-box">
                  <span className="label">Chi phí dự kiến</span>
                  <span className="value">{formatCurrency(post.estimated_cost)}</span>
                </div>
                <div className="info-box">
                  <span className="label">Thành viên</span>
                  <span className="value">{post.companion_requests?.length || 0} / {post.expected_members} đã duyệt</span>
                </div>
              </div>

              {post.requirements && (
                <div className="detail-section highlight-section secondary">
                  <div className="section-header">
                    <i className="fa-solid fa-clipboard-check"></i>
                    <h3>Yêu cầu đối với bạn đồng hành</h3>
                  </div>
                  <div className="content-box requirements-box">
                    {post.requirements}
                  </div>
                </div>
              )}
            </Card>

            <Card className="members-card">
              <h3>Danh sách thành viên ({post.companion_requests?.length || 0})</h3>
              <div className="members-list">
                {post.companion_requests && post.companion_requests.length > 0 ? (
                  post.companion_requests.map((req: any) => (
                    <div key={req.id} className="member-item">
                      <img src={req.users_companion_requests_user_idTousers?.avatar_url || DEFAULT_AVATAR} alt="Avatar" />
                      <div className="member-info">
                        <span className="member-name">{req.users_companion_requests_user_idTousers?.full_name}</span>
                        <span className="member-tag">Thành viên</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-members">Chưa có thành viên nào được duyệt.</p>
                )}
              </div>
            </Card>
          </div>

          <aside className="side-content">
            <Card className="action-card">
              {isOwner ? (
                <div className="owner-actions">
                  <p>Đây là bài đăng của bạn</p>
                  {!isEmbedded && (
                    <>
                      <Button variant="primary" fullWidth onClick={() => navigate(`/user/companion-posts/${id}/requests`)}>
                        Quản lý yêu cầu
                      </Button>
                      <Button variant="outline" fullWidth onClick={() => navigate(`/user/companion-posts/${id}/edit`)}>
                        Chỉnh sửa bài đăng
                      </Button>
                    </>
                  )}
                  <Button variant="primary" fullWidth style={{ marginTop: isEmbedded ? '0px' : '12px' }} onClick={handleOpenGroupChat} isLoading={chatLoading}>
                    Mở Nhóm Chat (M30)
                  </Button>
                </div>
              ) : myRequest ? (
                <div className="request-status">
                  <p>Trạng thái yêu cầu của bạn:</p>
                  <Badge variant={
                    myRequest.status === 'approved' ? 'success' : 
                    myRequest.status === 'rejected' ? 'danger' : 
                    'warning'
                  }>
                    {myRequest.status === 'approved' ? 'Đã được duyệt' : 
                     myRequest.status === 'rejected' ? 'Đã bị từ chối' : 
                     'Đang chờ duyệt'}
                  </Badge>
                  {myRequest.status === 'pending' && (
                    <Button variant="outline" fullWidth className="mt-4" onClick={() => companionService.cancelRequest(myRequest.id).then(() => { toast.success('Đã hủy yêu cầu'); fetchData(); })}>
                      Hủy yêu cầu
                    </Button>
                  )}
                  {myRequest.status === 'approved' && (
                    <Button variant="primary" fullWidth className="mt-4" onClick={handleOpenGroupChat} isLoading={chatLoading}>
                      Mở Nhóm Chat
                    </Button>
                  )}
                </div>
              ) : (
                <div className="guest-actions">
                  <h3>Tham gia chuyến đi?</h3>
                  <p>Gửi yêu cầu để chủ bài đăng có thể duyệt bạn vào nhóm.</p>
                  <Button variant="primary" fullWidth onClick={() => setShowRequestModal(true)} disabled={post.business_status !== 'open'}>
                     {post.business_status === 'open' ? 'Gửi yêu cầu tham gia' : 'Đã đủ người'}
                  </Button>
                </div>
              )}
            </Card>

            <Card className="author-card">
              <h3>Về chủ bài đăng</h3>
              <div className="author-profile">
                <img src={post.users?.avatar_url || DEFAULT_AVATAR} alt="Author" />
                <div className="author-details">
                  <span className="author-name">{post.users?.full_name}</span>
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => navigate(`/profile/${post.user_id}`)}
                  >
                    Xem hồ sơ
                  </Button>
                </div>
              </div>
              {!isOwner && (
                <div className="report-container">
                  <button 
                    className="report-button"
                    onClick={() => setShowReportModal(true)}
                  >
                    <i className="lucide-flag"></i>
                    Báo cáo bài đăng
                  </button>
                </div>
              )}
            </Card>
          </aside>
        </div>
      ) : (
        <div className="expenses-layout">
          {expensesLoading && !expenseData ? (
            <LoadingBlock height={300} />
          ) : (
            <div className="expenses-grid">
              <div className="main-expenses-content">
                <div className="expense-overview">
                  <div className="overview-card">
                    <span className="card-label">Tổng chi tiêu cả nhóm</span>
                    <span className="card-value">{formatCurrency(expenseData?.summary?.totalAmount || 0)}</span>
                  </div>
                  {(() => {
                    const myBalance = expenseData?.summary?.memberBalances?.find((b: any) => b.userId === user?.id);
                    const val = myBalance?.netBalance || 0;
                    return (
                      <div className={`overview-card balance-card ${val > 0 ? 'positive' : val < 0 ? 'negative' : ''}`}>
                        <span className="card-label">Số dư nợ ròng của tôi</span>
                        <span className="card-value">
                          {val > 0 ? `+${formatCurrency(val)}` : formatCurrency(val)}
                        </span>
                        <span className="card-sub">
                          {val > 0 ? 'Bạn sẽ nhận lại' : val < 0 ? 'Bạn cần trả nợ' : 'Bạn đã sòng phẳng'}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                <Card className="settlements-card">
                  <div className="card-header-with-icon">
                    <i className="fa-solid fa-handshake"></i>
                    <h3>Bảng quyết toán nợ đề xuất (Tối ưu hóa)</h3>
                  </div>
                  <div className="settlements-list">
                    {expenseData?.summary?.suggestedSettlements?.length > 0 ? (
                      expenseData.summary.suggestedSettlements.map((s: any, idx: number) => {
                        const isMyDebt = s.debtorId === user?.id;
                        return (
                          <div key={idx} className="settlement-row">
                            <div className="settlement-details">
                              <span className={`name-span ${isMyDebt ? 'me-debtor' : ''}`}>{s.debtorName}</span>
                              <span className="action-span"> nợ </span>
                              <span className="name-span">{s.creditorName}</span>
                              <span className="amount-span"> {formatCurrency(s.amount)}</span>
                            </div>
                            <div className="settlement-actions">
                              {isMyDebt && (
                                <Button 
                                  variant="primary" 
                                  size="small"
                                  onClick={() => {
                                    setSelectedQrSettlement(s);
                                    setQrBankId(s.creditorBankId || 'ICB');
                                    setQrAccountNo(s.creditorAccountNo || '');
                                    setQrAccountName(s.creditorAccountName || s.creditorName.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/Đ/g, "D"));
                                    setShowQrModal(true);
                                  }}
                                >
                                  Quét VietQR Trả nợ
                                </Button>
                              )}
                              {s.creditorId === user?.id && (
                                <Button 
                                  variant="outline" 
                                  size="small"
                                  onClick={() => handleSettle(s.debtorId, s.creditorId)}
                                >
                                  Xác nhận đã nhận tiền
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="all-settled-message">
                        <i className="fa-regular fa-circle-check"></i>
                        <p>Tuyệt vời! Chuyến đi đã được sòng phẳng hoàn toàn.</p>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="ledger-card">
                  <div className="ledger-header">
                    <div className="ledger-title-group">
                      <i className="fa-solid fa-list-ol"></i>
                      <h3>Nhật ký chi tiêu ({expenseData?.expenses?.length || 0})</h3>
                    </div>
                    <Button variant="primary" size="small" onClick={openAddExpenseModal}>
                      + Thêm khoản chi mới
                    </Button>
                  </div>
                  <div className="table-responsive">
                    <table className="ledger-table">
                      <thead>
                        <tr>
                          <th>Ngày</th>
                          <th>Khoản chi</th>
                          <th>Người trả</th>
                          <th>Số tiền</th>
                          <th>Thành viên chia sẻ</th>
                          <th>Xóa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenseData?.expenses?.length > 0 ? (
                          expenseData.expenses.map((exp: any) => (
                            <tr key={exp.id}>
                              <td>{new Date(exp.expense_date).toLocaleDateString('vi-VN')}</td>
                              <td className="expense-title-col">
                                <strong>{exp.title}</strong>
                              </td>
                              <td>{exp.payer?.full_name}</td>
                              <td className="expense-amount-col">{formatCurrency(exp.amount)}</td>
                              <td>
                                <div className="split-chips">
                                  {exp.splits.map((sp: any) => (
                                    <span key={sp.user_id} className={`split-chip ${sp.status}`}>
                                      {sp.user?.full_name}: {formatCurrency(sp.amount)}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td>
                                {(exp.created_by_user_id === user?.id || isOwner) && (
                                  <button className="btn-delete-expense" onClick={() => handleDeleteExpense(exp.id)}>
                                    <i className="fa-solid fa-trash-can"></i>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="empty-ledger-row">
                              Chưa có khoản chi tiêu nào được tạo. Hãy nhấn "Thêm khoản chi mới"!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              <aside className="side-expenses-content">
                <Card className="balances-list-card">
                  <h3>Số dư toàn bộ thành viên</h3>
                  <div className="balances-list">
                    {expenseData?.summary?.memberBalances?.map((member: any) => (
                      <div key={member.userId} className="member-balance-row">
                        <div className="member-info">
                          <img src={member.avatarUrl || DEFAULT_AVATAR} alt="Avatar" />
                          <span className="name">{member.fullName}</span>
                        </div>
                        <div className="balance-info">
                          <span className="spent">Đã chi: {formatCurrency(member.paid)}</span>
                          <span className={`net ${member.netBalance > 0 ? 'positive' : member.netBalance < 0 ? 'negative' : ''}`}>
                            {member.netBalance > 0 ? `+${formatCurrency(member.netBalance)}` : 
                             member.netBalance < 0 ? formatCurrency(member.netBalance) : 'Sòng phẳng'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="my-bank-config-card" style={{ marginTop: '24px' }}>
                  <div className="card-header-with-icon" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--tc-border)', paddingBottom: '8px' }}>
                    <i className="fa-solid fa-building-columns" style={{ color: 'var(--tc-primary)' }}></i>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>VietQR nhận tiền của tôi</h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--tc-text-secondary)', marginBottom: '16px' }}>
                    Thiết lập tài khoản ngân hàng của bạn để các thành viên khác quét mã VietQR và trả nợ trực tiếp cho bạn.
                  </p>
                  <div className="bank-config-form">
                    <div className="form-group mb-3">
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Ngân hàng thụ hưởng</label>
                      <select 
                        className="form-control"
                        value={myBankId}
                        onChange={(e) => setMyBankId(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--tc-border)', fontSize: '0.9rem' }}
                      >
                        <option value="ICB">VietinBank</option>
                        <option value="VCB">Vietcombank</option>
                        <option value="TCB">Techcombank</option>
                        <option value="MB">MBBank</option>
                        <option value="BIDV">BIDV</option>
                        <option value="ACB">ACB</option>
                        <option value="VBA">Agribank</option>
                        <option value="VPB">VPBank</option>
                        <option value="TPB">TPBank</option>
                        <option value="HDB">HDBank</option>
                      </select>
                    </div>
                    <div className="form-group mb-3">
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Số tài khoản</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={myAccountNo}
                        onChange={(e) => setMyAccountNo(e.target.value)}
                        placeholder="Nhập số tài khoản ngân hàng..."
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--tc-border)', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Tên chủ tài khoản (Viết hoa không dấu)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={myAccountName}
                        onChange={(e) => setMyAccountName(e.target.value.toUpperCase())}
                        placeholder="Ví dụ: NGUYEN VAN A"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--tc-border)', fontSize: '0.9rem' }}
                      />
                    </div>
                    <Button 
                      variant="primary" 
                      size="small" 
                      fullWidth 
                      onClick={handleSaveBankInfo}
                      isLoading={savingBank}
                    >
                      Lưu tài khoản
                    </Button>
                  </div>
                </Card>
              </aside>
            </div>
          )}
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal 
          targetType="companion_post"
          targetId={id!}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Request Join Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Gửi yêu cầu tham gia"
      >
        <div className="request-form">
          <p className="mb-4">Hãy để lại lời nhắn cho chủ bài đăng về lý do bạn muốn tham gia hoặc kinh nghiệm của bạn.</p>
          <textarea
            className="form-control mb-4"
            rows={5}
            placeholder="Ví dụ: Mình rất muốn đi Hà Giang, mình có thể lái xe máy và chụp ảnh cho mọi người..."
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
          ></textarea>
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setShowRequestModal(false)}>Hủy</Button>
            <Button variant="primary" isLoading={submitting} onClick={handleSendRequest}>Gửi ngay</Button>
          </div>
        </div>
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        isOpen={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
        title="Thêm khoản chi tiêu mới"
      >
        <div className="add-expense-form">
          <div className="form-group mb-4">
            <label>Nội dung chi tiêu *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ví dụ: Tiền phòng khách sạn, Ăn sáng ngày 2..."
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
            />
          </div>

          <div className="form-group mb-4">
            <label>Số tiền (VND) *</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="Nhập số tiền..."
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
            />
          </div>

          <div className="form-group mb-4">
            <label>Ngày chi tiêu *</label>
            <input 
              type="date" 
              className="form-control" 
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
            />
          </div>

          <div className="form-group mb-4">
            <label>Người chi tiền trước *</label>
            <select 
              className="form-control"
              value={paidByUserId}
              onChange={(e) => setPaidByUserId(e.target.value)}
            >
              {expenseData?.members?.map((m: any) => (
                <option key={m.id} value={m.id}>{m.fullName} {m.id === user?.id ? '(Bạn)' : ''}</option>
              ))}
            </select>
          </div>

          <div className="form-group mb-4">
            <label>Phương thức chia sẻ chi phí</label>
            <div className="split-method-select">
              <button 
                type="button"
                className={`method-btn ${splitMethod === 'equally' ? 'active' : ''}`}
                onClick={() => setSplitMethod('equally')}
              >
                Chia đều
              </button>
              <button 
                type="button"
                className={`method-btn ${splitMethod === 'custom' ? 'active' : ''}`}
                onClick={() => setSplitMethod('custom')}
              >
                Chia tùy chỉnh
              </button>
            </div>
          </div>

          <div className="form-group mb-4">
            <label>Chia cho ai trong đoàn?</label>
            <div className="members-checkbox-list">
              {expenseData?.members?.map((m: any) => {
                const isSelected = splitShares[m.id] !== 'false' && splitShares[m.id] !== '';
                return (
                  <div key={m.id} className="member-checkbox-row">
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => {
                          setSplitShares(prev => ({
                            ...prev,
                            [m.id]: e.target.checked ? (splitMethod === 'custom' ? '' : 'true') : 'false'
                          }));
                        }}
                      />
                      <span className="checkmark"></span>
                      {m.fullName} {m.id === user?.id ? '(Bạn)' : ''}
                    </label>
                    {splitMethod === 'custom' && isSelected && (
                      <input 
                        type="number" 
                        className="custom-share-input" 
                        placeholder="Số tiền..."
                        value={splitShares[m.id] === 'true' ? '' : splitShares[m.id]}
                        onChange={(e) => {
                          setSplitShares(prev => ({
                            ...prev,
                            [m.id]: e.target.value
                          }));
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="modal-actions">
            <Button variant="outline" onClick={() => setShowAddExpenseModal(false)}>Hủy</Button>
            <Button variant="primary" onClick={handleAddExpense}>Lưu chi phí</Button>
          </div>
        </div>
      </Modal>

      {/* VietQR QR Code Settle Modal */}
      <Modal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        title="Quét mã VietQR chuyển khoản nhanh"
      >
        {selectedSettlement && (
          <div className="vietqr-modal-content">
            <p className="mb-4 text-center">
              Bạn đang trả nợ cho <strong>{selectedSettlement.creditorName}</strong> số tiền{' '}
              <strong className="text-primary">{formatCurrency(selectedSettlement.amount)}</strong>.
            </p>

            {!qrAccountNo && (
              <div style={{ color: '#856404', backgroundColor: '#fff3cd', borderColor: '#ffeeba', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.5 }}>
                ⚠️ <strong>{selectedSettlement.creditorName}</strong> chưa thiết lập thông tin tài khoản ngân hàng nhận tiền.
                Vui lòng điền tay số tài khoản của họ bên dưới để tạo nhanh mã VietQR, hoặc liên hệ nhắc họ tự cấu hình tài khoản nhận tiền.
              </div>
            )}

            <div className="vietqr-config-card mb-4">
              <h4>Cấu hình tài khoản nhận của chủ nợ</h4>
              <div className="form-group mb-2">
                <label>Ngân hàng nhận</label>
                <select 
                  className="form-control"
                  value={qrBankId}
                  onChange={(e) => setQrBankId(e.target.value)}
                >
                  <option value="ICB">VietinBank</option>
                  <option value="VCB">Vietcombank</option>
                  <option value="TCB">Techcombank</option>
                  <option value="MB">MBBank</option>
                  <option value="BIDV">BIDV</option>
                  <option value="ACB">ACB</option>
                  <option value="VBA">Agribank</option>
                  <option value="VPB">VPBank</option>
                  <option value="TPB">TPBank</option>
                  <option value="HDB">HDBank</option>
                </select>
              </div>
              <div className="form-group mb-2">
                <label>Số tài khoản chủ nợ</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={qrAccountNo}
                  onChange={(e) => setQrAccountNo(e.target.value)}
                  placeholder="Nhập số tài khoản ngân hàng..."
                />
              </div>
              <div className="form-group">
                <label>Tên viết hoa không dấu</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={qrAccountName}
                  onChange={(e) => setQrAccountName(e.target.value.toUpperCase())}
                  placeholder="Ví dụ: NGUYEN VAN A"
                />
              </div>
            </div>

            <div className="qr-container-box">
              {qrAccountNo ? (
                <>
                  <img 
                    src={`https://img.vietqr.io/image/${qrBankId}-${qrAccountNo}-compact.png?amount=${selectedSettlement.amount}&addInfo=TCVN%20CHITIEU%20${id?.substring(0,8)}&accountName=${encodeURIComponent(qrAccountName)}`} 
                    alt="VietQR code" 
                    className="vietqr-image"
                  />
                  <span className="qr-caption">Quét mã bằng bất kỳ App ngân hàng nào để thanh toán nhanh</span>
                </>
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', border: '1px dashed var(--tc-border)', borderRadius: '8px', color: 'var(--tc-text-secondary)', fontSize: '0.9rem' }}>
                  🏦 Vui lòng nhập số tài khoản để hiển thị mã VietQR chuyển khoản
                </div>
              )}
            </div>

            <div className="modal-actions mt-4">
              <Button variant="outline" onClick={() => setShowQrModal(false)}>Đóng</Button>
              <Button variant="primary" onClick={() => handleSettle(selectedSettlement.debtorId, selectedSettlement.creditorId)}>
                Tôi đã chuyển khoản xong
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default CompanionDetailPage;
