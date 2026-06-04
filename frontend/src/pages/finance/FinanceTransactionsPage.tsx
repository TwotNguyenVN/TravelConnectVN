/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';
import { useToast } from '../../contexts/ToastContext';
import * as XLSX from 'xlsx';

interface Transaction {
  id: string;
  transaction_code: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  currency_code: string;
  gateway_response: unknown;
  provider_transaction_code: string | null;
  users?: {
    id: string;
    full_name: string;
    email: string;
  };
  tour_requests?: {
    id: string;
    tours?: {
      id: string;
      title: string;
    };
  };
}

interface MatchResult {
  statementCode: string;
  statementAmount: number;
  systemTx?: Transaction;
}

export const FinanceTransactionsPage: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Reconciliation States
  const [isReconModalOpen, setIsReconModalOpen] = useState(false);
  const [reconLoading, setReconLoading] = useState(false);
  const [reconFile, setReconFile] = useState<File | null>(null);
  const [reconHeaders, setReconHeaders] = useState<string[]>([]);
  const [reconRows, setReconRows] = useState<unknown[][]>([]);
  const [codeColIdx, setCodeColIdx] = useState<number>(0);
  const [amountColIdx, setAmountColIdx] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'matched' | 'mismatched' | 'missing_system' | 'missing_statement' | 'unknown'>('matched');

  const [results, setResults] = useState<{
    matched: MatchResult[];
    mismatched: MatchResult[];
    missingSystem: MatchResult[];
    missingStatement: Transaction[];
    unknown: MatchResult[];
  } | null>(null);

  const limit = 10;

  const fetchTransactions = async () => {
    try {
      Promise.resolve().then(() => setLoading(true));
      const skip = (currentPage - 1) * limit;
      const res = await adminApi.getTransactions({
        skip,
        take: limit,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery ? searchQuery : undefined,
      });

      if (res.success) {
        setTransactions(res.data?.items || []);
        setTotal(res.data?.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch transactions', err);
      toast.error('Không thể tải lịch sử giao dịch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTransactions();
  };

  const getStatusBadgeStyle = (status: string) => {
    const base = {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
    };

    switch (status) {
      case 'paid':
      case 'success':
        return { ...base, backgroundColor: '#d1fae5', color: '#065f46' };
      case 'pending':
        return { ...base, backgroundColor: '#fef3c7', color: '#92400e' };
      case 'refund_pending':
        return { ...base, backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'refunded':
        return { ...base, backgroundColor: '#f3e8ff', color: '#6b21a8' };
      case 'refund_rejected':
        return { ...base, backgroundColor: '#fee2e2', color: '#991b1b' };
      case 'failed':
        return { ...base, backgroundColor: '#fee2e2', color: '#991b1b' };
      default:
        return { ...base, backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
      case 'success':
        return 'Thành công';
      case 'pending':
        return 'Chờ thanh toán';
      case 'refund_pending':
        return 'Chờ hoàn tiền';
      case 'refunded':
        return 'Đã hoàn tiền';
      case 'refund_rejected':
        return 'Từ chối hoàn';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReconFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });

        if (data.length > 0) {
          const headers = data[0] as string[];
          setReconHeaders(headers);
          setReconRows(data.slice(1));

          // Auto detect column indexes
          let codeIdx = 0;
          let amountIdx = 1;
          headers.forEach((h: string, idx: number) => {
            const lowH = h.toString().toLowerCase();
            if (lowH.includes('mã') || lowH.includes('code') || lowH.includes('ref') || lowH.includes('id') || lowH.includes('mô tả') || lowH.includes('description')) {
              codeIdx = idx;
            }
            if (lowH.includes('tiền') || lowH.includes('amount') || lowH.includes('số tiền') || lowH.includes('value')) {
              amountIdx = idx;
            }
          });
          setCodeColIdx(codeIdx);
          setAmountColIdx(amountIdx);
        }
      } catch (err) {
        toast.error('Lỗi khi đọc file Excel. Vui lòng kiểm tra lại định dạng.');
        console.error(err);
      }
    };
    reader.readAsBinaryString(file);
  };

  const runReconciliation = async () => {
    if (reconRows.length === 0) return;
    setReconLoading(true);
    try {
      // Fetch 1000 latest transactions for reconciliation
      const res = await adminApi.getTransactions({ take: 1000 });
      if (!res.success) {
        toast.error('Không thể lấy danh sách giao dịch từ hệ thống');
        return;
      }
      const systemTxs: Transaction[] = res.data?.items || [];

      const matched: MatchResult[] = [];
      const mismatched: MatchResult[] = [];
      const missingSystem: MatchResult[] = [];
      const unknown: MatchResult[] = [];

      const matchedSystemIds = new Set<string>();

      reconRows.forEach((row) => {
        if (row.length === 0) return;
        const codeVal = row[codeColIdx]?.toString().trim();
        const amountVal = parseFloat(row[amountColIdx]?.toString().replace(/[^0-9.-]+/g, '') || '0');

        if (!codeVal) return;

        // Try to match in system transactions
        const systemTx = systemTxs.find((tx) => 
          tx.transaction_code.toLowerCase() === codeVal.toLowerCase() ||
          tx.id.toLowerCase() === codeVal.toLowerCase()
        );

        if (systemTx) {
          matchedSystemIds.add(systemTx.id);
          const diff = Math.abs(Number(systemTx.amount) - amountVal);

          if (diff > 1) { // Difference larger than 1 VND
            mismatched.push({ statementCode: codeVal, statementAmount: amountVal, systemTx });
          } else if (systemTx.status === 'paid' || systemTx.status === 'success') {
            matched.push({ statementCode: codeVal, statementAmount: amountVal, systemTx });
          } else if (systemTx.status === 'pending') {
            missingSystem.push({ statementCode: codeVal, statementAmount: amountVal, systemTx });
          } else {
            unknown.push({ statementCode: codeVal, statementAmount: amountVal, systemTx });
          }
        } else {
          unknown.push({ statementCode: codeVal, statementAmount: amountVal });
        }
      });

      // Find system transactions that are paid but missing from statement
      const missingStatement = systemTxs.filter((tx) => 
        (tx.status === 'paid' || tx.status === 'success') && !matchedSystemIds.has(tx.id)
      );

      setResults({
        matched,
        mismatched,
        missingSystem,
        missingStatement,
        unknown,
      });

      // Set initial tab to first one with items
      if (missingSystem.length > 0) setActiveTab('missing_system');
      else if (mismatched.length > 0) setActiveTab('mismatched');
      else setActiveTab('matched');

      toast.success('Đối soát hoàn tất!');
    } catch (err) {
      toast.error('Lỗi khi thực hiện đối soát.');
      console.error(err);
    } finally {
      setReconLoading(false);
    }
  };

  const handleQuickApprove = async (txId: string) => {
    try {
      const res = await adminApi.updateTransactionStatus(txId, 'paid');
      if (res.success) {
        toast.success('Đã cập nhật trạng thái giao dịch sang THÀNH CÔNG');
        // Update local results state
        if (results) {
          const itemIdx = results.missingSystem.findIndex(m => m.systemTx?.id === txId);
          if (itemIdx > -1) {
            const oldItem = results.missingSystem[itemIdx];
            const item = {
              ...oldItem,
              systemTx: oldItem.systemTx ? {
                ...oldItem.systemTx,
                status: 'paid',
                paid_at: new Date().toISOString(),
              } : undefined,
            };
            const updatedMissing = [...results.missingSystem];
            updatedMissing.splice(itemIdx, 1);
            
            setResults({
              ...results,
              missingSystem: updatedMissing,
              matched: [...results.matched, item],
            });
          }
        }
        fetchTransactions();
      } else {
        toast.error(res.message || 'Lỗi cập nhật trạng thái');
      }
    } catch (err) {
      toast.error('Lỗi cập nhật trạng thái giao dịch');
      console.error(err);
    }
  };

  const resetRecon = () => {
    setReconFile(null);
    setReconHeaders([]);
    setReconRows([]);
    setResults(null);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ padding: 'var(--tc-spacing-2)' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', margin: 0, fontWeight: 700 }}>Lịch sử Giao dịch</h1>
          <p style={{ color: 'var(--tc-text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--tc-font-size-sm)' }}>
            Xem, tra cứu và đối soát toàn bộ các giao dịch tài chính đặt tour trên hệ thống.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setIsReconModalOpen(true)}
            style={{ 
              padding: '8px 16px', 
              background: 'var(--tc-primary)', 
              color: 'white',
              border: 'none', 
              borderRadius: 'var(--tc-radius-md)', 
              cursor: 'pointer', 
              fontSize: 'var(--tc-font-size-sm)',
              fontWeight: 600,
              boxShadow: 'var(--tc-shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📊 Đối soát thông minh
          </button>
          <button 
            onClick={fetchTransactions} 
            style={{ 
              padding: '8px 16px', 
              background: 'white', 
              border: '1px solid var(--tc-border)', 
              borderRadius: 'var(--tc-radius-md)', 
              cursor: 'pointer', 
              fontSize: 'var(--tc-font-size-sm)',
              fontWeight: 500,
            }}
          >
            🔄 Làm mới
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: 'var(--tc-radius-lg)',
        border: '1px solid var(--tc-border)'
      }}>
        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'paid', 'pending', 'refund_pending', 'refunded', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid ' + (statusFilter === status ? 'var(--tc-primary)' : 'var(--tc-border)'),
                backgroundColor: statusFilter === status ? 'var(--tc-primary)' : 'transparent',
                color: statusFilter === status ? 'white' : 'var(--tc-text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {status === 'all' ? 'Tất cả' : getStatusLabel(status)}
            </button>
          ))}
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', minWidth: '300px' }}>
          <input
            type="text"
            placeholder="Tìm mã giao dịch, tên, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--tc-radius-md)',
              border: '1px solid var(--tc-border)',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--tc-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--tc-radius-md)',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
            }}
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Main Ledger Table */}
      <div style={{ backgroundColor: 'white', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px 0' }}><LoadingBlock height={300} /></div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--tc-bg-subtle)', borderBottom: '1px solid var(--tc-border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Mã giao dịch</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Khách hàng</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Tour liên kết</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Số tiền</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Thời gian tạo</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Trạng thái</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)', textAlign: 'right' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>
                      Không tìm thấy giao dịch nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--tc-border)', verticalAlign: 'middle' }}>
                      <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--tc-text-primary)' }}>
                        {tx.transaction_code}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tx.users?.full_name || 'Hệ thống'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--tc-text-secondary)' }}>{tx.users?.email || ''}</div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--tc-text-secondary)' }}>
                        {tx.tour_requests?.tours?.title || 'Tour không tìm thấy'}
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.95rem', fontWeight: 700, color: tx.status === 'paid' ? '#10b981' : 'var(--tc-text-primary)' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: tx.currency_code || 'VND' }).format(tx.amount)}
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>
                        {new Date(tx.created_at).toLocaleString('vi-VN')}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={getStatusBadgeStyle(tx.status)}>
                          {getStatusLabel(tx.status)}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedTransaction(tx)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: 'white',
                            border: '1px solid var(--tc-border)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '0.85rem',
                          }}
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderTop: '1px solid var(--tc-border)'
              }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>
                  Hiển thị {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, total)} trên tổng số {total} giao dịch
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: '1px solid var(--tc-border)',
                      backgroundColor: 'white',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1,
                      fontSize: '0.85rem',
                    }}
                  >
                    Trước
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: '1px solid ' + (currentPage === i + 1 ? 'var(--tc-primary)' : 'var(--tc-border)'),
                        backgroundColor: currentPage === i + 1 ? 'var(--tc-primary)' : 'white',
                        color: currentPage === i + 1 ? 'white' : 'var(--tc-text-primary)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: '1px solid var(--tc-border)',
                      backgroundColor: 'white',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      fontSize: '0.85rem',
                    }}
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Smart Reconciliation Modal */}
      {isReconModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '850px',
            maxHeight: '90vh',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--tc-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--tc-bg-subtle)'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--tc-text-primary)' }}>📊 Đối soát Tự động thông minh</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Tải lên sao kê ngân hàng (Excel/CSV) để so sánh tự động với dữ liệu hệ thống.</p>
              </div>
              <button 
                onClick={() => { setIsReconModalOpen(false); resetRecon(); }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--tc-text-secondary)',
                  padding: '4px'
                }}
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {!reconFile ? (
                // File Upload Area
                <div style={{
                  border: '2px dashed var(--tc-border)',
                  borderRadius: '12px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  backgroundColor: 'var(--tc-bg-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📥</div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 600 }}>Kéo thả hoặc Nhấp để tải lên sao kê</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Hỗ trợ định dạng Excel (.xlsx, .xls) hoặc CSV</p>
                </div>
              ) : (
                // File Config and Trigger Area
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  padding: '16px',
                  border: '1px solid var(--tc-border)',
                  borderRadius: '12px',
                  backgroundColor: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.5rem' }}>📄</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{reconFile.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--tc-text-secondary)' }}>{(reconFile.size / 1024).toFixed(1)} KB • {reconRows.length} dòng dữ liệu</div>
                      </div>
                    </div>
                    <button 
                      onClick={resetRecon}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'transparent',
                        color: 'var(--tc-danger)',
                        border: '1px solid var(--tc-danger-bg)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 500
                      }}
                    >
                      Chọn file khác
                    </button>
                  </div>

                  {!results && (
                    <>
                      <hr style={{ border: 'none', borderTop: '1px solid var(--tc-border)', margin: 0 }} />
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--tc-text-secondary)', marginBottom: '6px' }}>Cột chứa Mã giao dịch</label>
                          <select 
                            value={codeColIdx}
                            onChange={(e) => setCodeColIdx(parseInt(e.target.value))}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid var(--tc-border)',
                              fontSize: '0.9rem',
                              outline: 'none'
                            }}
                          >
                            {reconHeaders.map((header, idx) => (
                              <option key={idx} value={idx}>{header || `Cột ${idx + 1}`}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--tc-text-secondary)', marginBottom: '6px' }}>Cột chứa Số tiền</label>
                          <select 
                            value={amountColIdx}
                            onChange={(e) => setAmountColIdx(parseInt(e.target.value))}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid var(--tc-border)',
                              fontSize: '0.9rem',
                              outline: 'none'
                            }}
                          >
                            {reconHeaders.map((header, idx) => (
                              <option key={idx} value={idx}>{header || `Cột ${idx + 1}`}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={runReconciliation}
                        disabled={reconLoading}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: 'var(--tc-primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          marginTop: '8px'
                        }}
                      >
                        {reconLoading ? '🔄 Đang đối soát và so khớp...' : '⚡ Bắt đầu Đối soát'}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Reconciliation Results Display */}
              {results && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Summary Bar */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                      { key: 'missing_system', label: 'Chưa duyệt', count: results.missingSystem.length, color: '#f59e0b', bg: '#fef3c7' },
                      { key: 'mismatched', label: 'Lệch tiền', count: results.mismatched.length, color: '#ef4444', bg: '#fee2e2' },
                      { key: 'matched', label: 'Khớp', count: results.matched.length, color: '#10b981', bg: '#d1fae5' },
                      { key: 'missing_statement', label: 'Thiếu trong sao kê', count: results.missingStatement.length, color: '#3b82f6', bg: '#dbeafe' },
                      { key: 'unknown', label: 'Mã lạ', count: results.unknown.length, color: '#6b7280', bg: '#f3f4f6' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as 'matched' | 'mismatched' | 'missing_system' | 'missing_statement' | 'unknown')}
                        style={{
                          flex: 1,
                          padding: '12px 8px',
                          borderRadius: '8px',
                          border: '1px solid ' + (activeTab === tab.key ? tab.color : 'var(--tc-border)'),
                          backgroundColor: activeTab === tab.key ? tab.bg : 'white',
                          color: tab.color,
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s ease',
                          minWidth: '120px'
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{tab.label}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px' }}>{tab.count}</div>
                      </button>
                    ))}
                  </div>

                  {/* List/Table of specific tab */}
                  <div style={{ border: '1px solid var(--tc-border)', borderRadius: '8px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--tc-bg-subtle)', borderBottom: '1px solid var(--tc-border)' }}>
                          <th style={{ padding: '10px 12px', fontWeight: 600 }}>Mã đối chiếu</th>
                          <th style={{ padding: '10px 12px', fontWeight: 600 }}>Số tiền Sao kê</th>
                          <th style={{ padding: '10px 12px', fontWeight: 600 }}>Số tiền Hệ thống</th>
                          <th style={{ padding: '10px 12px', fontWeight: 600 }}>Trạng thái HT</th>
                          {activeTab === 'missing_system' && <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Hành động</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {activeTab === 'matched' && (
                          results.matched.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>Không có giao dịch khớp.</td></tr>
                          ) : (
                            results.matched.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid var(--tc-border)' }}>
                                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.statementCode}</td>
                                <td style={{ padding: '10px 12px' }}>{item.statementAmount.toLocaleString()} đ</td>
                                <td style={{ padding: '10px 12px' }}>{Number(item.systemTx?.amount).toLocaleString()} đ</td>
                                <td style={{ padding: '10px 12px', color: '#10b981', fontWeight: 600 }}>Đã thanh toán</td>
                              </tr>
                            ))
                          )
                        )}

                        {activeTab === 'mismatched' && (
                          results.mismatched.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>Không phát hiện lệch tiền.</td></tr>
                          ) : (
                            results.mismatched.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid var(--tc-border)' }}>
                                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.statementCode}</td>
                                <td style={{ padding: '10px 12px', color: '#ef4444', fontWeight: 600 }}>{item.statementAmount.toLocaleString()} đ</td>
                                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{Number(item.systemTx?.amount).toLocaleString()} đ</td>
                                <td style={{ padding: '10px 12px' }}>
                                  <span style={getStatusBadgeStyle(item.systemTx?.status || '')}>{getStatusLabel(item.systemTx?.status || '')}</span>
                                </td>
                              </tr>
                            ))
                          )
                        )}

                        {activeTab === 'missing_system' && (
                          results.missingSystem.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>Không có giao dịch chờ duyệt khớp.</td></tr>
                          ) : (
                            results.missingSystem.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid var(--tc-border)' }}>
                                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.statementCode}</td>
                                <td style={{ padding: '10px 12px' }}>{item.statementAmount.toLocaleString()} đ</td>
                                <td style={{ padding: '10px 12px' }}>{Number(item.systemTx?.amount).toLocaleString()} đ</td>
                                <td style={{ padding: '10px 12px' }}>
                                  <span style={getStatusBadgeStyle(item.systemTx?.status || '')}>{getStatusLabel(item.systemTx?.status || '')}</span>
                                </td>
                                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                  <button
                                    onClick={() => handleQuickApprove(item.systemTx?.id || '')}
                                    style={{
                                      padding: '4px 10px',
                                      backgroundColor: '#10b981',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontWeight: 600,
                                      fontSize: '0.8rem'
                                    }}
                                  >
                                    ✓ Duyệt nhanh
                                  </button>
                                </td>
                              </tr>
                            ))
                          )
                        )}

                        {activeTab === 'missing_statement' && (
                          results.missingStatement.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>Không có giao dịch nào thiếu.</td></tr>
                          ) : (
                            results.missingStatement.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid var(--tc-border)' }}>
                                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.transaction_code}</td>
                                <td style={{ padding: '10px 12px', color: 'var(--tc-text-secondary)' }}>N/A (Không có)</td>
                                <td style={{ padding: '10px 12px' }}>{Number(item.amount).toLocaleString()} đ</td>
                                <td style={{ padding: '10px 12px', color: '#10b981', fontWeight: 600 }}>Đã thanh toán</td>
                              </tr>
                            ))
                          )
                        )}

                        {activeTab === 'unknown' && (
                          results.unknown.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>Không có mã lạ.</td></tr>
                          ) : (
                            results.unknown.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid var(--tc-border)' }}>
                                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.statementCode}</td>
                                <td style={{ padding: '10px 12px' }}>{item.statementAmount.toLocaleString()} đ</td>
                                <td style={{ padding: '10px 12px', color: 'var(--tc-text-secondary)' }}>N/A (Không thấy trong hệ thống)</td>
                                <td style={{ padding: '10px 12px', color: 'var(--tc-text-secondary)' }}>Không xác định</td>
                              </tr>
                            ))
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--tc-border)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              backgroundColor: 'var(--tc-bg-subtle)'
            }}>
              {results && (
                <button
                  onClick={resetRecon}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    border: '1px solid var(--tc-border)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                  }}
                >
                  Reset đối soát
                </button>
              )}
              <button
                onClick={() => { setIsReconModalOpen(false); resetRecon(); }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  border: '1px solid var(--tc-border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--tc-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Chi tiết Giao dịch</h3>
              <button 
                onClick={() => setSelectedTransaction(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--tc-text-secondary)'
                }}
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Status Banner */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: 'var(--tc-bg-subtle)',
                border: '1px solid var(--tc-border)'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Mã giao dịch</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>{selectedTransaction.transaction_code}</div>
                </div>
                <span style={getStatusBadgeStyle(selectedTransaction.status)}>
                  {getStatusLabel(selectedTransaction.status)}
                </span>
              </div>

              {/* Grid Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Số tiền giao dịch</span>
                  <div style={{ fontWeight: 700, marginTop: '4px' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: selectedTransaction.currency_code }).format(selectedTransaction.amount)}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Phương thức thanh toán</span>
                  <div style={{ fontWeight: 600, marginTop: '4px', textTransform: 'uppercase' }}>{selectedTransaction.payment_method}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Mã tham chiếu cổng</span>
                  <div style={{ marginTop: '4px' }}>{selectedTransaction.provider_transaction_code || 'N/A'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Thời điểm thanh toán</span>
                  <div style={{ marginTop: '4px' }}>
                    {selectedTransaction.paid_at ? new Date(selectedTransaction.paid_at).toLocaleString('vi-VN') : 'Chưa hoàn tất'}
                  </div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--tc-border)', margin: 0 }} />

              {/* Customer and Tour Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Khách hàng</span>
                  <div style={{ fontWeight: 600, marginTop: '4px' }}>{selectedTransaction.users?.full_name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>{selectedTransaction.users?.email}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Tour du lịch</span>
                  <div style={{ fontWeight: 600, marginTop: '4px', color: 'var(--tc-primary)' }}>{selectedTransaction.tour_requests?.tours?.title || 'Tour không tìm thấy'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)', marginTop: '2px' }}>Mã đặt tour: {selectedTransaction.tour_requests?.id}</div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--tc-border)', margin: 0 }} />

              {/* Gateway response raw JSON */}
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Dữ liệu phản hồi từ Cổng thanh toán (Gateway JSON)</span>
                <pre style={{
                  marginTop: '8px',
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: '#1e293b',
                  color: '#f8fafc',
                  fontSize: '0.8rem',
                  overflowX: 'auto',
                  maxHeight: '200px',
                  whiteSpace: 'pre-wrap',
                }}>
                  {JSON.stringify(selectedTransaction.gateway_response, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--tc-border)',
              display: 'flex',
              justifyContent: 'flex-end',
              backgroundColor: 'var(--tc-bg-subtle)',
              borderRadius: '0 0 12px 12px'
            }}>
              <button
                onClick={() => setSelectedTransaction(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  border: '1px solid var(--tc-border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
