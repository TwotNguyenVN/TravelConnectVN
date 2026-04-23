import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tourService } from '../../services/tourService';
import { Button } from '../../components/common/Button/Button';
import { useToast } from '../../contexts/ToastContext';
import './TourFormPage.css';

interface Category {
  id: string;
  name: string;
}

const TourFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    province: '',
    district: '',
    startDate: '',
    endDate: '',
    price: 0,
    maxParticipants: 10,
    meetPoint: '',
    description: '',
    participantRequirements: '',
    businessStatus: 'draft',
    visibilityStatus: 'visible'
  });

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchTourDetail();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await tourService.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTourDetail = async () => {
    try {
      setLoading(true);
      const tour = await tourService.getTourDetail(id!);
      
      // Map API response to form data
      setFormData({
        title: tour.title || '',
        categoryId: tour.categoryId || '',
        province: tour.location || '', // Backend map location to province in detail API
        district: tour.district || '',
        startDate: tour.startDate ? new Date(tour.startDate).toISOString().split('T')[0] : '',
        endDate: tour.endDate ? new Date(tour.endDate).toISOString().split('T')[0] : '',
        price: tour.price || 0,
        maxParticipants: tour.maxParticipants || 10,
        meetPoint: tour.meetPoint || '',
        description: tour.description || '',
        participantRequirements: tour.participantRequirements || '',
        businessStatus: tour.businessStatus || 'draft',
        visibilityStatus: tour.visibilityStatus || 'visible'
      });
    } catch (error) {
      console.error('Failed to fetch tour detail:', error);
      toast.error('Không tìm thấy thông tin tour');
      navigate('/guide/tours');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'maxParticipants' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (isEditMode) {
        await tourService.updateTour(id!, formData);
        toast.success('Cập nhật tour thành công!');
      } else {
        await tourService.createTour(formData);
        toast.success('Tạo tour thành công!');
      }
      navigate('/guide/tours');
    } catch (error) {
      console.error('Failed to save tour:', error);
      toast.error('Có lỗi xảy ra khi lưu thông tin tour');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="tc-loading">Đang tải thông tin...</div>;

  const provinces = [
    'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
    'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
    'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
    'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
    'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
    'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Quảng Bình',
    'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng',
    'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa',
    'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long',
    'Vĩnh Phúc', 'Yên Bái', 'Phú Yên'
  ].sort();

  return (
    <div className="tc-tour-form">
      <div className="tc-tour-form__header">
        <h1>{isEditMode ? 'Chỉnh sửa tour' : 'Tạo tour mới'}</h1>
        <p>Điền đầy đủ thông tin để bắt đầu kết nối với khách du lịch</p>
      </div>

      <form className="tc-tour-form__container" onSubmit={handleSubmit}>
        <div className="tc-tour-form__section">
          <h2 className="tc-tour-form__section-title">Thông tin cơ bản</h2>
          
          <div className="tc-form-group">
            <label htmlFor="title">Tiêu đề tour <span>*</span></label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              className="tc-form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="VD: Khám phá ẩm thực Sài Gòn về đêm"
              required 
            />
          </div>

          <div className="tc-tour-form__grid">
            <div className="tc-form-group">
              <label htmlFor="categoryId">Loại tour <span>*</span></label>
              <select 
                id="categoryId" 
                name="categoryId" 
                className="tc-form-select"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Chọn loại tour</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="tc-form-group">
              <label htmlFor="price">Giá tour (VND) <span>*</span></label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                className="tc-form-input"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="1000"
                required 
              />
            </div>
          </div>
        </div>

        <div className="tc-tour-form__section">
          <h2 className="tc-tour-form__section-title">Địa điểm & Thời gian</h2>
          
          <div className="tc-tour-form__grid">
            <div className="tc-form-group">
              <label htmlFor="province">Tỉnh / Thành phố <span>*</span></label>
              <select 
                id="province" 
                name="province" 
                className="tc-form-select"
                value={formData.province}
                onChange={handleChange}
                required
              >
                <option value="">Chọn Tỉnh / Thành phố</option>
                {provinces.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="tc-form-group">
              <label htmlFor="district">Quận / Huyện</label>
              <input 
                type="text" 
                id="district" 
                name="district" 
                className="tc-form-input"
                value={formData.district}
                onChange={handleChange}
                placeholder="VD: Quận 1, Tp. Thủ Đức..."
              />
            </div>

            <div className="tc-form-group">
              <label htmlFor="startDate">Ngày bắt đầu <span>*</span></label>
              <input 
                type="date" 
                id="startDate" 
                name="startDate" 
                className="tc-form-input"
                value={formData.startDate}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="tc-form-group">
              <label htmlFor="endDate">Ngày kết thúc <span>*</span></label>
              <input 
                type="date" 
                id="endDate" 
                name="endDate" 
                className="tc-form-input"
                value={formData.endDate}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="tc-form-group">
            <label htmlFor="meetPoint">Điểm hẹn <span>*</span></label>
            <input 
              type="text" 
              id="meetPoint" 
              name="meetPoint" 
              className="tc-form-input"
              value={formData.meetPoint}
              onChange={handleChange}
              placeholder="VD: Cổng chính Chợ Bến Thành"
              required 
            />
          </div>
        </div>

        <div className="tc-tour-form__section">
          <h2 className="tc-tour-form__section-title">Chi tiết tour</h2>
          
          <div className="tc-form-group">
            <label htmlFor="maxParticipants">Số người tối đa <span>*</span></label>
            <input 
              type="number" 
              id="maxParticipants" 
              name="maxParticipants" 
              className="tc-form-input"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="1"
              required 
            />
          </div>

          <div className="tc-form-group">
            <label htmlFor="description">Mô tả chi tiết <span>*</span></label>
            <textarea 
              id="description" 
              name="description" 
              className="tc-form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả các hoạt động nổi bật, trải nghiệm của tour..."
              required
            ></textarea>
          </div>

          <div className="tc-form-group">
            <label htmlFor="participantRequirements">Yêu cầu đối với người tham gia</label>
            <textarea 
              id="participantRequirements" 
              name="participantRequirements" 
              className="tc-form-textarea"
              value={formData.participantRequirements}
              onChange={handleChange}
              placeholder="VD: Sức khỏe tốt, không bị dị ứng hải sản..."
            ></textarea>
          </div>
        </div>

        <div className="tc-tour-form__section">
          <h2 className="tc-tour-form__section-title">Trạng thái</h2>
          <div className="tc-tour-form__status-box">
            <div className="tc-tour-form__grid">
              <div className="tc-form-group">
                <label htmlFor="businessStatus">Trạng thái nghiệp vụ</label>
                <select 
                  id="businessStatus" 
                  name="businessStatus" 
                  className="tc-form-select"
                  value={formData.businessStatus}
                  onChange={handleChange}
                >
                  <option value="draft">Bản nháp (Chỉ bạn thấy)</option>
                  <option value="published">Công khai (Khách du lịch có thể thấy)</option>
                  <option value="closed">Đóng tour (Ngừng nhận khách)</option>
                </select>
              </div>

              <div className="tc-form-group">
                <label htmlFor="visibilityStatus">Trạng thái hiển thị</label>
                <select 
                  id="visibilityStatus" 
                  name="visibilityStatus" 
                  className="tc-form-select"
                  value={formData.visibilityStatus}
                  onChange={handleChange}
                >
                  <option value="visible">Hiển thị</option>
                  <option value="hidden">Ẩn</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="tc-tour-form__actions">
          <Button variant="outline" type="button" onClick={() => navigate('/guide/tours')}>
            Hủy bỏ
          </Button>
          <Button variant="primary" type="submit" isLoading={submitting}>
            {isEditMode ? 'Cập nhật tour' : 'Tạo tour ngay'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TourFormPage;
