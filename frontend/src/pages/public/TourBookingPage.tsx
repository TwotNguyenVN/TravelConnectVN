import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { tourService } from '../../services/tourService';
import tourRequestService from '../../services/tourRequestService';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import './TourBookingPage.css';

interface Passenger {
  id: number;
  fullName: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  phone: string;
}

const TourBookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const scheduleId = searchParams.get('scheduleId');
  const initialParticipants = parseInt(searchParams.get('participants') || '1', 10);

  const [tour, setTour] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1); // Changed from union to number to avoid OXC issues
  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Contact Info State
  const [contactInfo, setContactInfo] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notes: ''
  });

  // Passengers State
  const [participantCount, setParticipantCount] = useState(initialParticipants);
  const [passengers, setPassengers] = useState<Passenger[]>(
    Array.from({ length: initialParticipants }).map((_, i) => ({
      id: i,
      fullName: i === 0 && user?.full_name ? user.full_name : '',
      gender: 'male',
      birthDate: '',
      phone: i === 0 && user?.phone ? user.phone : ''
    }))
  );

  useEffect(() => {
    const fetchTour = async () => {
      try {
        if (!id) return;
        const res = await tourService.getTourDetail(id);
        if (res.success && res.data) {
          setTour(res.data);
          if (scheduleId && res.data.schedules) {
            const selected = res.data.schedules.find((s: any) => s.id === scheduleId);
            setSchedule(selected);
          }
        }
      } catch (error) {
        console.error("Error fetching tour:", error);
        toast.error("Không thể lấy thông tin tour.");
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
    window.scrollTo(0, 0);
  }, [id, scheduleId]);

  // Adjust passengers array when count changes
  useEffect(() => {
    setPassengers(prev => {
      if (participantCount > prev.length) {
        const added = Array.from({ length: participantCount - prev.length }).map((_, i) => ({
          id: prev.length + i,
          fullName: '',
          gender: 'male' as const,
          birthDate: '',
          phone: ''
        }));
        return [...prev, ...added];
      } else if (participantCount < prev.length) {
        return prev.slice(0, participantCount);
      }
      return prev;
    });
  }, [participantCount]);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const formatDate = (date: any) => {
    if (!date) return 'Linh hoạt';
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const calculateTotal = () => {
    const price = schedule ? schedule.price : (tour?.price || 0);
    return price * participantCount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.phone) {
      toast.warning("Vui lòng nhập đầy đủ thông tin liên hệ (Họ tên, Email, Số điện thoại)");
      return;
    }

    const hasEmptyPassenger = passengers.some(p => !p.fullName.trim() || !p.birthDate);
    if (hasEmptyPassenger) {
      toast.warning("Vui lòng điền đầy đủ họ tên và ngày sinh cho tất cả hành khách");
      return;
    }

    // Instead of submitting, transition to selection step (Step 1.5)
    setCurrentStep(1.5);
    window.scrollTo(0, 0);
  };

  const proceedToPayment = async () => {
    setShowConfirmModal(false);
    let popup: Window | null = null;
    try {
      setIsSubmitting(true);

      const noteText = `THÔNG TIN ĐẶT TOUR:
- Liên hệ: ${contactInfo.fullName} | ${contactInfo.phone} | ${contactInfo.email}
- Ghi chú: ${contactInfo.notes || 'Không có'}
- Danh sách khách (${participantCount} người):
${passengers.map((p, i) => `  ${i + 1}. ${p.fullName} (${p.gender === 'male' ? 'Nam' : p.gender === 'female' ? 'Nữ' : 'Khác'}) - NS: ${p.birthDate ? new Date(p.birthDate).toLocaleDateString('vi-VN') : ''} ${p.phone ? '- SĐT: ' + p.phone : ''}`).join('\n')}`;

      // --- SỬA LỖI MỞ TAB MỚI: Mở popup NGAY LẬP TỨC (đồng bộ) để trình duyệt không chặn ---
      const width = 800;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      popup = window.open(
        '', // Mở trang trống trước
        'vnpay_popup',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
      );

      if (popup) {
        popup.document.write('<div style="font-family: sans-serif; text-align: center; margin-top: 20%;"><h2>Đang kết nối an toàn với VNPAY...</h2><p>Vui lòng không đóng cửa sổ này.</p></div>');
      }

      // 1. Create Tour Request
      const requestRes = await tourRequestService.createRequest({
        tourId: tour.id,
        scheduleId: schedule?.id,
        participantCount: participantCount,
        note: noteText
      });

      if (!requestRes.success || !requestRes.data) {
        throw new Error("Không thể tạo yêu cầu đặt tour");
      }

      const tourRequestId = requestRes.data.id;

      // 2. Generate Payment URL (VNPAY)
      toast.info("Đang chuyển hướng đến cổng thanh toán...");
      const paymentRes = await paymentService.createVnpayUrl(tourRequestId, paymentType);
      
      if (paymentRes.success && paymentRes.data?.paymentUrl) {
        
        if (popup) {
          popup.location.href = paymentRes.data.paymentUrl;
          setCurrentStep(2); 
        } else {
          window.location.href = paymentRes.data.paymentUrl;
          return;
        }

        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data?.type === 'VNPAY_RETURN') {
            window.removeEventListener('message', handleMessage);
            if (event.data.status === 'success') {
              toast.success('Thanh toán thành công!');
              setCurrentStep(3); 
              setIsSubmitting(false);
            } else {
              toast.error('Giao dịch thanh toán thất bại hoặc đã bị hủy.');
              setIsSubmitting(false);
              setCurrentStep(1); 
            }
          }
        };
        
        window.addEventListener('message', handleMessage);
        
        const checkClosed = setInterval(() => {
          if (!popup || popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', handleMessage);
            if (currentStep === 2) {
               setIsSubmitting(false);
               setCurrentStep(1);
            }
          }
        }, 1000);

      } else {
        throw new Error("Không thể tạo liên kết thanh toán");
      }

    } catch (error: any) {
      console.error("Booking submission error:", error);
      const msg = error.response?.data?.message || error.message || "Có lỗi xảy ra trong quá trình xử lý.";
      toast.error(msg);
      setIsSubmitting(false);
      if (popup && !popup.closed) {
        popup.close();
      }
    }
  };

  if (loading) {
    return <div className="tc-booking-loader"><div className="tc-spinner"></div>Đang tải thông tin...</div>;
  }

  if (!tour) {
    return <div className="tc-booking-not-found">Tour không tồn tại</div>;
  }

  const pricePerPerson = schedule ? schedule.price : tour.price;

  return (
    <div className="tc-booking-page">
      <div className="tc-booking-header">
        <div className="tc-booking-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Nhập thông tin</div>
          <div className={`step-line ${currentStep >= 1.5 ? 'active' : ''}`}></div>
          <div className={`step ${currentStep >= 1.5 ? 'active' : ''}`}>2. Chọn thanh toán</div>
          <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>3. Thanh toán</div>
          <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>4. Hoàn thành</div>
        </div>
      </div>

      <div className="tc-booking-content">
        {currentStep === 1 && (
          <>
            <form className="tc-booking-form-section" onSubmit={handleSubmit}>
              <div className="tc-booking-card">
                <h2 className="tc-card-title">Thông tin liên lạc</h2>
                <div className="tc-form-grid">
                  <div className="tc-form-group full-width">
                    <label>Họ và Tên *</label>
                    <input type="text" name="fullName" value={contactInfo.fullName} onChange={handleContactChange} required placeholder="Nhập họ tên người đặt" />
                  </div>
                  <div className="tc-form-group half-width">
                    <label>Email *</label>
                    <input type="email" name="email" value={contactInfo.email} onChange={handleContactChange} required placeholder="Nhập email" />
                  </div>
                  <div className="tc-form-group half-width">
                    <label>Số điện thoại *</label>
                    <input type="tel" name="phone" value={contactInfo.phone} onChange={handleContactChange} required placeholder="Nhập số điện thoại" />
                  </div>
                  <div className="tc-form-group full-width">
                    <label>Ghi chú thêm</label>
                    <textarea name="notes" value={contactInfo.notes} onChange={handleContactChange} placeholder="Yêu cầu đặc biệt, dị ứng thực phẩm..."></textarea>
                  </div>
                </div>
              </div>

              <div className="tc-booking-card">
                <div className="tc-passenger-header">
                  <h2 className="tc-card-title">Hành khách</h2>
                  <div className="tc-passenger-counter">
                    <button type="button" onClick={() => setParticipantCount(Math.max(1, participantCount - 1))}>-</button>
                    <span>{participantCount}</span>
                    <button type="button" onClick={() => setParticipantCount(Math.min(tour.maxParticipants, participantCount + 1))}>+</button>
                  </div>
                </div>

                <div className="tc-passengers-list">
                  {passengers.map((passenger, index) => (
                    <div key={passenger.id} className="tc-passenger-item">
                      <div className="tc-passenger-index">Khách {index + 1}</div>
                      <div className="tc-passenger-form-content">
                        <div className="tc-passenger-row">
                          <div className="tc-form-group flex-2">
                            <label>Họ và Tên *</label>
                            <input 
                              type="text" 
                              value={passenger.fullName} 
                              onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value)} 
                              placeholder="VD: Nguyễn Văn A" 
                              required 
                            />
                          </div>
                          <div className="tc-form-group flex-1">
                            <label>Giới tính</label>
                            <select 
                              value={passenger.gender} 
                              onChange={(e) => handlePassengerChange(index, 'gender', e.target.value as any)}
                            >
                              <option value="male">Nam</option>
                              <option value="female">Nữ</option>
                            </select>
                          </div>
                        </div>
                        <div className="tc-passenger-row">
                          <div className="tc-form-group flex-1">
                            <label>Ngày sinh *</label>
                            <input 
                              type="date" 
                              value={passenger.birthDate} 
                              onChange={(e) => handlePassengerChange(index, 'birthDate', e.target.value)} 
                              required 
                            />
                          </div>
                          <div className="tc-form-group flex-1">
                            <label>Số điện thoại</label>
                            <input 
                              type="tel" 
                              value={passenger.phone} 
                              onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)} 
                              placeholder="Bỏ trống nếu là trẻ em"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>

            <aside className="tc-booking-summary-section">
              <div className="tc-summary-card">
                <h2 className="tc-summary-title">Tóm tắt chuyến đi</h2>
                <div className="tc-summary-tour-info">
                  {tour.images && tour.images.length > 0 && (
                    <img src={tour.images[0]} alt={tour.title} className="tc-summary-image" />
                  )}
                  <h3 className="tc-summary-tour-name">{tour.title}</h3>
                </div>
                <div className="tc-summary-details">
                  <div className="tc-summary-row">
                    <span className="icon">📍</span>
                    <div className="info">
                      <span className="label">Khởi hành từ</span>
                      <span className="value">{tour.location}</span>
                    </div>
                  </div>
                  <div className="tc-summary-row">
                    <span className="icon">📅</span>
                    <div className="info">
                      <span className="label">Ngày khởi hành</span>
                      <span className="value">{schedule ? formatDate(schedule.startDate) : 'Chưa chọn'}</span>
                    </div>
                  </div>
                  <div className="tc-summary-row">
                    <span className="icon">🕒</span>
                    <div className="info">
                      <span className="label">Thời gian</span>
                      <span className="value">{tour.numDays} ngày {tour.numNights} đêm</span>
                    </div>
                  </div>
                  <div className="tc-summary-row">
                    <span className="icon">👥</span>
                    <div className="info">
                      <span className="label">Số hành khách</span>
                      <span className="value">{participantCount} người</span>
                    </div>
                  </div>
                </div>
                <div className="tc-summary-price">
                  <div className="tc-price-row">
                    <span>Giá mỗi khách</span>
                    <span>{pricePerPerson.toLocaleString()} đ</span>
                  </div>
                  <div className="tc-total-row">
                    <span>Tổng cộng</span>
                    <span className="tc-total-amount">{calculateTotal().toLocaleString()} đ</span>
                  </div>
                </div>
                <button 
                  className="tc-btn-checkout" 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
                </button>
                <p className="tc-checkout-note">
                  Bạn sẽ được chuyển hướng sang VNPAY để hoàn tất thanh toán an toàn.
                </p>
              </div>
            </aside>
          </>
        )}

        {currentStep === 1.5 && (
          <div className="tc-payment-selection">
            <h2 className="tc-selection-title">Chọn hình thức thanh toán</h2>
            <p className="tc-selection-subtitle">Vui lòng chọn hình thức thanh toán phù hợp với bạn</p>
            <div className="tc-payment-options">
              <div className={`tc-payment-option-card ${paymentType === 'deposit' ? 'selected' : ''}`} onClick={() => { setPaymentType('deposit'); setShowConfirmModal(true); }}>
                <div className="tc-option-header">
                  <span className="tc-option-tag">Cọc trước</span>
                  <h3 className="tc-option-name">Thanh toán trước 50%</h3>
                </div>
                <div className="tc-option-amount">{(calculateTotal() * 0.5).toLocaleString()} đ</div>
                <p className="tc-option-desc">
                  Thanh toán khoản còn lại trước ngày khởi hành 7 ngày (tour ngày thường), trước ngày khởi hành 15 ngày (tour lễ tết).
                </p>
                <div className="tc-option-check"></div>
              </div>
              <div className={`tc-payment-option-card ${paymentType === 'full' ? 'selected' : ''}`} onClick={() => { setPaymentType('full'); setShowConfirmModal(true); }}>
                <div className="tc-option-header">
                  <span className="tc-option-tag primary">Phổ biến</span>
                  <h3 className="tc-option-name">Thanh toán 100%</h3>
                </div>
                <div className="tc-option-amount">{calculateTotal().toLocaleString()} đ</div>
                <p className="tc-option-desc">
                  Thanh toán toàn bộ số tiền tour một lần duy nhất để giữ chỗ chắc chắn và không cần lo lắng về sau.
                </p>
                <div className="tc-option-check"></div>
              </div>
            </div>
            <button className="tc-btn-back" onClick={() => setCurrentStep(1)}>
              ← Quay lại chỉnh sửa thông tin
            </button>
          </div>
        )}

        {showConfirmModal && (
          <div className="tc-modal-overlay">
            <div className="tc-confirm-modal">
              <div className="tc-modal-icon">⚠️</div>
              <h3>Xác nhận lựa chọn</h3>
              <p> Bạn đã chọn hình thức: <strong>{paymentType === 'deposit' ? 'Thanh toán trước 50%' : 'Thanh toán 100%'}</strong></p>
              <p className="tc-modal-amount">Số tiền cần thanh toán ngay: <span>{(paymentType === 'deposit' ? calculateTotal() * 0.5 : calculateTotal()).toLocaleString()} đ</span></p>
              <div className="tc-modal-actions">
                <button className="tc-btn-cancel" onClick={() => setShowConfirmModal(false)}>Hủy bỏ</button>
                <button className="tc-btn-confirm" onClick={proceedToPayment}>Xác nhận & Thanh toán</button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="tc-booking-waiting-payment">
            <div className="tc-spinner large" style={{ width: 60, height: 60, borderWidth: 6, marginBottom: 20 }}></div>
            <h2>Đang chờ thanh toán...</h2>
            <p style={{ color: 'var(--tc-text-secondary)', marginTop: 10 }}>Vui lòng hoàn tất giao dịch trên cửa sổ VNPAY vừa được mở.</p>
            <p style={{ color: 'var(--tc-danger)', marginTop: 5, fontSize: '0.9rem' }}>Lưu ý: Không đóng tab trình duyệt này trong quá trình thanh toán.</p>
          </div>
        )}

        {currentStep === 3 && (
          <div className="tc-booking-success">
            <div className="tc-success-icon" style={{ fontSize: 60, color: 'var(--tc-success)', marginBottom: 20 }}>✅</div>
            <h2 style={{ color: 'var(--tc-success)' }}>Đặt Tour và Thanh Toán Thành Công!</h2>
            <p style={{ color: 'var(--tc-text-secondary)', marginTop: 10, marginBottom: 30 }}>
              Cảm ơn bạn đã tin tưởng TravelConnect. Yêu cầu đặt tour của bạn đã được xác nhận.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className="tc-btn-checkout" 
                onClick={() => navigate('/user/requests')}
                style={{ maxWidth: 250 }}
              >
                Xem Đơn Yêu Cầu Của Bạn
              </button>
              <button 
                className="tc-btn-secondary" 
                onClick={() => navigate('/user/payments')}
                style={{ maxWidth: 250, padding: '12px 24px', borderRadius: '8px', border: '2px solid var(--tc-primary)', color: 'var(--tc-primary)', backgroundColor: 'transparent', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}
              >
                Xem Lịch Sử Thanh Toán
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourBookingPage;
