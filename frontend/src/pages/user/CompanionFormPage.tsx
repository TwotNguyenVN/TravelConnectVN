import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PageContainer, Card, Button, Input, Select, LoadingBlock 
} from '../../components/common';
import { useToast } from '../../contexts/ToastContext';
import { companionService } from '../../services/companionService';
import './CompanionFormPage.css';

const CompanionFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    estimated_cost: 0,
    currency_code: 'VND',
    expected_members: 2,
    description: '',
    requirements: '',
    business_status: 'open',
    visibility_status: 'visible'
  });

  useEffect(() => {
    if (isEdit) {
      fetchDetail();
    }
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await companionService.getPostDetail(id!);
      if (response.success) {
        const data = response.data;
        setFormData({
          title: data.title,
          destination: data.destination,
          start_date: data.start_date.split('T')[0],
          end_date: data.end_date.split('T')[0],
          estimated_cost: data.estimated_cost,
          currency_code: data.currency_code,
          expected_members: data.expected_members,
          description: data.description,
          requirements: data.requirements || '',
          business_status: data.business_status,
          visibility_status: data.visibility_status
        });
      }
    } catch (error) {
      console.error('Error fetching detail:', error);
      toast.error('Không thể tải thông tin bài đăng');
      navigate('/user/companion-posts');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimated_cost' || name === 'expected_members' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEdit) {
        await companionService.updatePost(id!, formData);
      } else {
        await companionService.createPost(formData);
        toast.success('Tạo bài đăng thành công!');
      }
      navigate('/user/companion-posts');
      if (isEdit) toast.success('Cập nhật bài đăng thành công!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu bài đăng');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingBlock />;

  return (
    <PageContainer className="companion-form-page">
      <div className="form-header">
        <Button variant="outline" size="small" onClick={() => navigate(-1)}>← Quay lại</Button>
        <h1>{isEdit ? 'Chỉnh sửa bài đăng' : 'Tạo bài đăng tìm bạn đồng hành'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-layout">
          <div className="form-main">
            <Card className="form-card">
              <div className="form-section">
                <h3>Thông tin chung</h3>
                <Input
                  label="Tiêu đề bài đăng"
                  name="title"
                  placeholder="Ví dụ: Tìm bạn đồng hành đi Đà Lạt 3 ngày 2 đêm"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Điểm đến"
                  name="destination"
                  placeholder="Ví dụ: Đà Lạt, Lâm Đồng"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-section">
                <h3>Lịch trình và Chi phí</h3>
                <div className="form-row">
                  <Input
                    label="Ngày bắt đầu"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Ngày kết thúc"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <Input
                    label="Chi phí dự kiến (VND)"
                    name="estimated_cost"
                    type="number"
                    value={formData.estimated_cost}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Số lượng thành viên cần tìm"
                    name="expected_members"
                    type="number"
                    min={1}
                    value={formData.expected_members}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Mô tả chi tiết</h3>
                <div className="input-group">
                  <label className="input-label">Lịch trình dự kiến</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows={8}
                    placeholder="Hãy mô tả chi tiết lịch trình, phương tiện di chuyển, chỗ ở..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="input-group mt-4">
                  <label className="input-label">Yêu cầu (Không bắt buộc)</label>
                  <textarea
                    name="requirements"
                    className="form-control"
                    rows={4}
                    placeholder="Ví dụ: Biết lái xe, thích chụp ảnh, không hút thuốc..."
                    value={formData.requirements}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </Card>
          </div>

          <aside className="form-side">
            <Card className="settings-card">
              <h3>Thiết lập bài đăng</h3>
              <Select
                label="Trạng thái tuyển"
                name="business_status"
                options={[
                  { value: 'open', label: 'Đang mở (Nhận yêu cầu)' },
                  { value: 'closed', label: 'Đã đóng (Đủ người)' },
                ]}
                value={formData.business_status}
                onChange={handleChange}
              />
              <Select
                label="Chế độ hiển thị"
                name="visibility_status"
                options={[
                  { value: 'visible', label: 'Công khai' },
                  { value: 'hidden', label: 'Ẩn bài đăng' },
                ]}
                value={formData.visibility_status}
                onChange={handleChange}
              />
              
              <div className="form-actions mt-6">
                <Button variant="primary" fullWidth type="submit" isLoading={submitting}>
                  {isEdit ? 'Lưu thay đổi' : 'Đăng bài ngay'}
                </Button>
                <Button variant="outline" fullWidth type="button" onClick={() => navigate('/user/companion-posts')}>
                  Hủy bỏ
                </Button>
              </div>
            </Card>
          </aside>
        </div>
      </form>
    </PageContainer>
  );
};

export default CompanionFormPage;
