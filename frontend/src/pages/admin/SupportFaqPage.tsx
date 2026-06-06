import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  created_at: string;
  creator?: {
    full_name: string;
  };
}

export function SupportFaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('Chung');

  async function fetchFaqs() {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getFaqItems();
      if (res?.success) {
        setFaqs(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách FAQ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  function resetForm() {
    setQuestion('');
    setAnswer('');
    setCategory('Chung');
    setEditingId(null);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    try {
      setError(null);
      if (editingId) {
        // Edit Mode
        const res = await adminApi.updateFaqItem(editingId, { question, answer, category });
        if (res?.success) {
          setFaqs(faqs.map(faq => faq.id === editingId ? { ...faq, question, answer, category } : faq));
          resetForm();
        }
      } else {
        // Add Mode
        const res = await adminApi.createFaqItem({ question, answer, category });
        if (res?.success) {
          fetchFaqs();
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra khi lưu FAQ.');
    }
  };

  function handleEdit(faq: FaqItem) {
    setEditingId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || 'Chung');
  };

  async function handleDelete(id: string) {
    if (!window.confirm('Bạn có chắc chắn muốn xoá câu hỏi thường gặp này?')) return;
    try {
      setError(null);
      const res = await adminApi.deleteFaqItem(id);
      if (res?.success) {
        setFaqs(faqs.filter(faq => faq.id !== id));
      }
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra khi xoá FAQ.');
    }
  };

  if (loading && faqs.length === 0) return <LoadingBlock height={400} />;

  return (
    <div style={{ padding: 'var(--tc-spacing-6)', display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--tc-spacing-6)' }}>
      {/* FAQ List */}
      <div>
        <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', marginBottom: 'var(--tc-spacing-6)' }}>💬 Quản Lý Câu Hỏi Thường Gặp (FAQ) & Soạn Thảo Phản Hồi Nhanh</h1>

        {error && (
          <div style={{
            backgroundColor: 'var(--tc-danger-bg)',
            color: 'var(--tc-danger)',
            padding: 'var(--tc-spacing-4)',
            borderRadius: 'var(--tc-radius-md)',
            marginBottom: 'var(--tc-spacing-6)'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-4)' }}>
          {faqs.length === 0 ? (
            <div style={{ padding: 'var(--tc-spacing-8)', textAlign: 'center', backgroundColor: 'white', border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-lg)', color: 'var(--tc-text-secondary)' }}>
              Chưa có câu hỏi thường gặp nào được tạo.
            </div>
          ) : (
            faqs.map(faq => (
              <div key={faq.id} style={{
                backgroundColor: 'white',
                border: '1px solid var(--tc-border)',
                borderRadius: 'var(--tc-radius-lg)',
                padding: 'var(--tc-spacing-5)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{
                    backgroundColor: 'var(--tc-primary-bg)',
                    color: 'var(--tc-primary)',
                    padding: '2px 8px',
                    borderRadius: 'var(--tc-radius-full)',
                    fontSize: 'var(--tc-font-size-xs)',
                    fontWeight: 'bold'
                  }}>
                    {faq.category || 'Chung'}
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(faq)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--tc-primary)',
                        cursor: 'pointer',
                        fontSize: 'var(--tc-font-size-sm)'
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--tc-danger)',
                        cursor: 'pointer',
                        fontSize: 'var(--tc-font-size-sm)'
                      }}
                    >
                      Xoá
                    </button>
                  </div>
                </div>

                <h3 style={{ margin: '0 0 8px 0', fontSize: 'var(--tc-font-size-md)' }}>Q: {faq.question}</h3>
                <p style={{ margin: 0, color: 'var(--tc-text-secondary)', fontSize: 'var(--tc-font-size-sm)', whiteSpace: 'pre-wrap' }}>
                  A: {faq.answer}
                </p>

                <div style={{ borderTop: '1px solid var(--tc-border)', marginTop: '12px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>
                  <span>Tạo bởi: {faq.creator?.full_name || 'Hệ thống'}</span>
                  <span>{new Date(faq.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FAQ Form */}
      <div>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid var(--tc-border)',
          borderRadius: 'var(--tc-radius-lg)',
          padding: 'var(--tc-spacing-5)',
          position: 'sticky',
          top: '20px'
        }}>
          <h3 style={{ margin: '0 0 var(--tc-spacing-4) 0' }}>{editingId ? 'Chỉnh Sửa FAQ' : 'Tạo FAQ Mới'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--tc-spacing-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--tc-font-size-sm)', fontWeight: 'bold', marginBottom: '6px' }}>Danh mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid var(--tc-border)',
                  borderRadius: 'var(--tc-radius-md)'
                }}
              >
                <option value="Chung">Chung</option>
                <option value="Tours">Tours</option>
                <option value="Thanh toán & Hoàn tiền">Thanh toán & Hoàn tiền</option>
                <option value="Tài khoản & Bảo mật">Tài khoản & Bảo mật</option>
                <option value="Hành trình đồng hành">Hành trình đồng hành</option>
              </select>
            </div>

            <div style={{ marginBottom: 'var(--tc-spacing-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--tc-font-size-sm)', fontWeight: 'bold', marginBottom: '6px' }}>Câu hỏi</label>
              <input
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Câu hỏi thường gặp là gì?"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--tc-border)',
                  borderRadius: 'var(--tc-radius-md)'
                }}
              />
            </div>

            <div style={{ marginBottom: 'var(--tc-spacing-5)' }}>
              <label style={{ display: 'block', fontSize: 'var(--tc-font-size-sm)', fontWeight: 'bold', marginBottom: '6px' }}>Câu trả lời (Mẫu soạn sẵn)</label>
              <textarea
                required
                rows={6}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Nhập nội dung trả lời chi tiết. Nội dung này cũng có thể dùng làm mẫu soạn sẵn cho nhân viên hỗ trợ."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--tc-border)',
                  borderRadius: 'var(--tc-radius-md)',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: 'var(--tc-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--tc-radius-md)',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Lưu
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '10px',
                    backgroundColor: 'var(--tc-neutral-light)',
                    color: 'var(--tc-text-secondary)',
                    border: '1px solid var(--tc-border)',
                    borderRadius: 'var(--tc-radius-md)',
                    cursor: 'pointer'
                  }}
                >
                  Huỷ
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
