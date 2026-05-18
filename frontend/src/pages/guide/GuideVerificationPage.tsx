import React, { useState, useEffect } from 'react';
import { 
  PageContainer, 
  Card, 
  Button, 
  Badge, 
  LoadingBlock
} from '../../components/common';
import { verificationService } from '../../services/verificationService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import './GuideVerificationPage.css';

interface VerificationStatus {
  profileStatus: string;
  latestRequest: any;
}

export const GuideVerificationPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  
  // Form state
  const [submissionNote, setSubmissionNote] = useState('');
  const [files, setFiles] = useState<{ [key: string]: any }>({
    national_id_front: null,
    national_id_back: null,
    tour_guide_card: null,
    certificate: [],
  });
  const [previews, setPreviews] = useState<{ [key: string]: any }>({
    certificate: [],
  });

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response: any = await verificationService.getStatus();
      if (response.success) {
        setStatus(response.data);
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles(prev => ({ ...prev, [type]: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => ({ ...prev, [type]: [...(prev[type] || []), ...newFiles] }));
      
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => ({ 
            ...prev, 
            [type]: [...(prev[type] || []), reader.result as string] 
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!files.national_id_front || !files.national_id_back || !files.tour_guide_card || files.certificate.length === 0) {
      toast.error('Vui lòng tải lên đầy đủ CCCD (2 mặt), Thẻ HDV và Chứng chỉ ngoại ngữ/khác');
      return;
    }

    if (!user) {
      toast.error('Bạn cần đăng nhập để thực hiện tác vụ này');
      return;
    }

    try {
      setSubmitting(true);
      
      const uploadedDocs = [];
      
      // Map display types to readable names for toast
      const typeLabels: { [key: string]: string } = {
        national_id_front: 'CCCD (Mặt trước)',
        national_id_back: 'CCCD (Mặt sau)',
        tour_guide_card: 'Thẻ HDV',
        certificate: 'Chứng chỉ'
      };
      
      // Upload files to Supabase
      for (const [type, fileOrFiles] of Object.entries(files)) {
        if (Array.isArray(fileOrFiles)) {
          for (const file of fileOrFiles) {
            toast.info(`Đang tải lên ${typeLabels[type] || type}...`);
            const url = await verificationService.uploadDocument(file, user.id);
            uploadedDocs.push({
              documentType: type,
              fileUrl: url,
            });
          }
        } else if (fileOrFiles) {
          toast.info(`Đang tải lên ${typeLabels[type] || type}...`);
          const url = await verificationService.uploadDocument(fileOrFiles as File, user.id);
          uploadedDocs.push({
            documentType: type,
            fileUrl: url,
          });
        }
      }

      const response: any = await verificationService.submitRequest({
        submissionNote,
        documents: uploadedDocs,
      });

      if (response.success) {
        toast.success('Yêu cầu xác minh của bạn đã được gửi thành công!');
        fetchStatus();
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi gửi yêu cầu');
      }
    } catch (error: any) {
      console.error('Error submitting verification:', error);
      toast.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (statusStr: string) => {
    switch (statusStr) {
      case 'approved':
        return <Badge variant="success">Đã xác minh</Badge>;
      case 'pending':
        return <Badge variant="warning">Đang chờ xử lý</Badge>;
      case 'rejected':
        return <Badge variant="danger">Bị từ chối</Badge>;
      default:
        return <Badge variant="secondary">Chưa xác minh</Badge>;
    }
  };

  if (loading) return <PageContainer><LoadingBlock /></PageContainer>;

  const canSubmit = !status?.latestRequest || (status.latestRequest.status !== 'pending' && status.profileStatus !== 'approved');

  return (
    <PageContainer>
      <div className="verification-header">
        <h1>Xác minh Hướng dẫn viên</h1>
        <p>
          Gửi hồ sơ để nhận huy hiệu "Đã xác minh" và tăng uy tín với khách
          hàng.
        </p>
      </div>

      <div className="verification-layout">
        <div className="verification-main">
          <Card className="status-card">
            <div className="status-content">
              <div className="status-info">
                <h3>Trạng thái hiện tại</h3>
                <div className="status-badge-container">
                  {getStatusBadge(status?.profileStatus || "unverified")}
                </div>
              </div>
              {status?.latestRequest &&
                status.latestRequest.status === "rejected" && (
                  <div className="rejection-note">
                    <strong>Lý do từ chối:</strong>{" "}
                    {status.latestRequest.result_note ||
                      "Hồ sơ không đạt yêu cầu."}
                  </div>
                )}
            </div>
          </Card>

          {canSubmit ? (
            <Card className="submission-card">
              <h3>Gửi hồ sơ xác minh mới</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      CCCD / Hộ chiếu (Mặt trước){" "}
                      <span className="required">*</span>
                    </label>
                    <div
                      className={`file-upload-wrapper ${previews.national_id_front ? "has-file" : ""}`}
                    >
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          handleFileChange(e, "national_id_front")
                        }
                        required
                      />
                      {previews.national_id_front ? (
                        <div className="file-preview">
                          <img
                            src={previews.national_id_front}
                            alt="CCCD Front Preview"
                          />
                          <div className="file-status">✅ Đã chọn</div>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <span>📁 Nhấp để chọn ảnh</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      CCCD / Hộ chiếu (Mặt sau){" "}
                      <span className="required">*</span>
                    </label>
                    <div
                      className={`file-upload-wrapper ${previews.national_id_back ? "has-file" : ""}`}
                    >
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          handleFileChange(e, "national_id_back")
                        }
                        required
                      />
                      {previews.national_id_back ? (
                        <div className="file-preview">
                          <img
                            src={previews.national_id_back}
                            alt="CCCD Back Preview"
                          />
                          <div className="file-status">✅ Đã chọn</div>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <span>📁 Nhấp để chọn ảnh</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Thẻ Hướng dẫn viên du lịch{" "}
                    <span className="required">*</span>
                  </label>
                  <div
                    className={`file-upload-wrapper ${previews.tour_guide_card ? "has-file" : ""}`}
                  >
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, "tour_guide_card")}
                      required
                    />
                    {previews.tour_guide_card ? (
                      <div className="file-preview">
                        <img
                          src={previews.tour_guide_card}
                          alt="Guide Card Preview"
                        />
                        <div className="file-status">✅ Đã chọn</div>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <span>📁 Nhấp để chọn ảnh</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Chứng chỉ ngoại ngữ / Chứng chỉ khác{" "}
                    <span className="required">*</span>
                  </label>
                  <div className="certificates-grid-upload">
                    {previews.certificate?.map(
                      (preview: string, index: number) => (
                        <div key={index} className="certificate-preview-item">
                          <img src={preview} alt={`Certificate ${index + 1}`} />
                          <button
                            type="button"
                            className="remove-cert-btn"
                            onClick={() => {
                              setFiles((prev) => ({
                                ...prev,
                                certificate: prev.certificate.filter(
                                  (_: any, i: number) => i !== index,
                                ),
                              }));
                              setPreviews((prev) => ({
                                ...prev,
                                certificate: prev.certificate.filter(
                                  (_: any, i: number) => i !== index,
                                ),
                              }));
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ),
                    )}
                    <div
                      className="add-cert-box"
                      onClick={() =>
                        document.getElementById("cert-input")?.click()
                      }
                    >
                      <span>+ Thêm ảnh</span>
                    </div>
                    <input
                      id="cert-input"
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={(e) =>
                        handleMultipleFileChange(e, "certificate")
                      }
                      style={{ display: "none" }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Ghi chú (Note)</label>
                  <textarea
                    rows={3}
                    style={{ width: '100%', borderRadius: '12px', padding: '12px' }}
                    placeholder="Thông tin bổ sung cho người kiểm duyệt..."
                    value={submissionNote}
                    onChange={(e) => setSubmissionNote(e.target.value)}
                  />
                </div>

                <div className="submission-actions">
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    isLoading={submitting}
                    disabled={submitting}
                  >
                    Gửi yêu cầu xác minh
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="pending-card">
              <div className="pending-content">
                <div className="pending-icon">
                  {status?.profileStatus === "approved" ? "✅" : "⏳"}
                </div>
                <h3>
                  {status?.profileStatus === "approved"
                    ? "Tài khoản đã được xác minh"
                    : "Yêu cầu của bạn đang được xử lý"}
                </h3>
                <p>
                  {status?.profileStatus === "approved"
                    ? "Hồ sơ của bạn đã được kiểm duyệt và xác minh thành công. Chúc bạn có những chuyến đi tuyệt vời!"
                    : "Chúng tôi đã nhận được hồ sơ của bạn và đang tiến hành kiểm tra. Quá trình này thường mất từ 1-3 ngày làm việc."}
                </p>

                {status?.latestRequest && (
                  <>
                    <div className="submitted-docs-preview">
                      <h4>Tài liệu đã gửi:</h4>
                      <div className="docs-grid">
                        {status.latestRequest.guide_verification_documents?.map(
                          (doc: any) => (
                            <div key={doc.id} className="doc-item">
                              <img src={doc.file_url} alt={doc.document_type} />
                              <span>
                                {doc.document_type === "national_id_front"
                                  ? "CCCD (Trước)"
                                  : doc.document_type === "national_id_back"
                                    ? "CCCD (Sau)"
                                    : doc.document_type === "tour_guide_card"
                                      ? "Thẻ HDV"
                                      : "Chứng chỉ"}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="pending-details">
                      <div>
                        <strong>Mã yêu cầu:</strong> {status.latestRequest.id}
                      </div>
                      <div>
                        <strong>Ngày gửi:</strong>{" "}
                        {status.latestRequest.submitted_at
                          ? new Date(
                              status.latestRequest.submitted_at,
                            ).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>

        <aside className="verification-sidebar">
          <Card className="info-card">
            <h4>Tại sao cần xác minh?</h4>
            <ul>
              <li>Nhận huy hiệu xanh "Verified" trên hồ sơ.</li>
              <li>Được ưu tiên hiển thị trên trang tìm kiếm.</li>
              <li>Tăng tỷ lệ khách hàng tin tưởng và đặt tour.</li>
              <li>
                Tham gia được vào các chiến dịch quảng bá của TravelConnectVN.
              </li>
            </ul>
          </Card>

          <Card className="info-card">
            <h4>Yêu cầu hồ sơ</h4>
            <ul>
              <li>Ảnh chụp rõ nét, không bị lóa hoặc mờ.</li>
              <li>Các giấy tờ phải còn hiệu lực.</li>
              <li>
                Thông tin trên giấy tờ phải khớp với thông tin hồ sơ cá nhân.
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
};
