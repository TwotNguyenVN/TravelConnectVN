import React, { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import walletService, { Wallet, WalletTransaction } from '../../services/walletService';
import './WalletPage.css';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const WalletPage: React.FC = () => {
  const { toast } = useToast();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [walletRes, txRes] = await Promise.all([
        walletService.getMyWallet(),
        walletService.getTransactions()
      ]);
      setWallet(walletRes.data);
      setTransactions(txRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải dữ liệu ví');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount);
    if (val < 1000) {
      return toast.error('Số tiền tối thiểu là 1,000 VND');
    }
    try {
      setActionLoading(true);
      await walletService.deposit(val, description || 'Nạp tiền vào ví');
      toast.success('Nạp tiền thành công!');
      setShowDeposit(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi nạp tiền');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount);
    if (val < 1000) {
      return toast.error('Số tiền tối thiểu là 1,000 VND');
    }
    if (wallet && val > wallet.balance) {
      return toast.error('Số dư không đủ');
    }
    try {
      setActionLoading(true);
      await walletService.withdraw(val, description || 'Yêu cầu rút tiền về tài khoản ngân hàng');
      toast.success('Gửi yêu cầu rút tiền thành công!');
      setShowWithdraw(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi rút tiền');
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
  };

  const getTxDetails = (tx: WalletTransaction) => {
    switch (tx.transaction_type) {
      case 'deposit': return { label: 'Nạp tiền', icon: 'fa-arrow-down', colorClass: 'icon-deposit', isPositive: true };
      case 'withdraw': return { label: 'Rút tiền', icon: 'fa-building-columns', colorClass: 'icon-withdraw', isPositive: false };
      case 'payment': return { label: 'Thanh toán', icon: 'fa-cart-shopping', colorClass: 'icon-payment', isPositive: false };
      case 'refund': return { label: 'Hoàn tiền', icon: 'fa-rotate-left', colorClass: 'icon-refund', isPositive: true };
      default: return { label: 'Giao dịch', icon: 'fa-exchange-alt', colorClass: '', isPositive: true };
    }
  };

  if (loading && !wallet) return <div className="p-5 text-center"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="wallet-page-container">
      <div className="wallet-header">
        <h1>Ví Của Tôi</h1>
        <p>Quản lý số dư, thanh toán và lịch sử giao dịch của bạn một cách an toàn</p>
      </div>

      <div className="wallet-cards">
        <div className="wallet-card">
          <div className="card-title">Số Dư Hiện Tại</div>
          <div className="card-amount">{formatCurrency(wallet?.balance || 0)}</div>
          <div className="wallet-actions">
            <button className="btn-wallet btn-deposit" onClick={() => setShowDeposit(true)}>
              <i className="fa-solid fa-plus"></i> Nạp tiền
            </button>
            <button className="btn-wallet btn-withdraw" onClick={() => setShowWithdraw(true)}>
              <i className="fa-solid fa-building-columns"></i> Rút tiền
            </button>
          </div>
        </div>

        <div className="wallet-card spent">
          <div className="card-title">Tổng Tiền Đã Chi Tiêu</div>
          <div className="card-amount">{formatCurrency(wallet?.total_spent || 0)}</div>
          <p className="mb-0 opacity-75"><i className="fa-regular fa-calendar-check"></i> Cập nhật liên tục từ hệ thống</p>
        </div>
      </div>

      <div className="transactions-section">
        <div className="transactions-header">
          <h3>Lịch Sử Giao Dịch</h3>
        </div>
        
        {transactions.length === 0 ? (
          <div className="text-center p-4 text-muted">
            <i className="fa-solid fa-receipt fa-3x mb-3 opacity-50"></i>
            <p>Chưa có giao dịch nào.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Loại giao dịch</th>
                  <th>Mô tả</th>
                  <th>Thời gian</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => {
                  const details = getTxDetails(tx);
                  return (
                    <tr key={tx.id}>
                      <td>
                        <div className="tx-type">
                          <div className={`tx-icon ${details.colorClass}`}>
                            <i className={`fa-solid ${details.icon}`}></i>
                          </div>
                          {details.label}
                        </div>
                      </td>
                      <td>{tx.description}</td>
                      <td>{formatDate(tx.created_at)}</td>
                      <td className={`tx-amount ${details.isPositive ? 'amount-positive' : 'amount-negative'}`}>
                        {details.isPositive ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                      </td>
                      <td>
                        <span className={`tx-status status-${tx.status}`}>
                          {tx.status === 'completed' ? 'Thành công' : tx.status === 'pending' ? 'Chờ duyệt' : 'Thất bại'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="wallet-modal-overlay">
          <div className="wallet-modal">
            <div className="modal-header">
              <h3>Nạp tiền vào ví</h3>
              <button className="btn-close" onClick={() => {setShowDeposit(false); resetForm();}}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleDeposit}>
              <div className="form-group">
                <label>Số tiền (VND)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="Nhập số tiền..."
                  min="1000"
                  required
                />
              </div>
              <div className="form-group">
                <label>Ghi chú (Không bắt buộc)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Vd: Nạp tiền để đặt tour..."
                />
              </div>
              <button type="submit" className="btn-submit" disabled={actionLoading || !amount}>
                {actionLoading ? 'Đang xử lý...' : 'Xác nhận Nạp Tiền'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="wallet-modal-overlay">
          <div className="wallet-modal">
            <div className="modal-header">
              <h3>Rút tiền về ngân hàng</h3>
              <button className="btn-close" onClick={() => {setShowWithdraw(false); resetForm();}}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleWithdraw}>
              <div className="form-group">
                <label>Số dư khả dụng: <strong className="text-primary">{formatCurrency(wallet?.balance || 0)}</strong></label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="Nhập số tiền cần rút..."
                  min="1000"
                  max={wallet?.balance}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ghi chú / Thông tin tài khoản</label>
                <textarea 
                  className="form-control" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Vd: STK 123456789 - VCB - NGUYEN VAN A"
                  rows={3}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn-submit" disabled={actionLoading || !amount}>
                {actionLoading ? 'Đang xử lý...' : 'Gửi Yêu Cầu Rút Tiền'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
