import { useState } from 'react';
import { adminApi } from '../../api/admin.api';

interface ReconciliationResult {
  totalProcessed: number;
  matchedCount: number;
  unmatchedCount: number;
  discrepancyCount: number;
  matched: any[];
  unmatched: any[];
  discrepancies: any[];
}

export function FinanceReconciliationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ReconciliationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'discrepancies' | 'unmatched' | 'matched'>('discrepancies');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleReconcile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.reconcileTransactions(formData);
      if (res?.success) {
        setResult(res.data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Có lỗi xảy ra trong quá trình đối soát.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 'var(--tc-spacing-6)' }}>
      <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', margin: '0 0 var(--tc-spacing-2) 0' }}>🔍 Công Cụ Đối Soát Dữ Liệu Tự Động</h1>
      <p style={{ color: 'var(--tc-text-secondary)', marginBottom: 'var(--tc-spacing-6)', fontSize: 'var(--tc-font-size-sm)' }}>
        Tải lên file sao kê ngân hàng (CSV/Excel) để tự động đối soát với các giao dịch trên hệ thống.
      </p>

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

      {/* Upload Section */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid var(--tc-border)',
        borderRadius: 'var(--tc-radius-lg)',
        padding: 'var(--tc-spacing-6)',
        marginBottom: 'var(--tc-spacing-6)',
        boxShadow: 'var(--tc-shadow-sm)'
      }}>
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-4)', alignItems: 'center' }}>
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileChange}
            disabled={loading}
            style={{
              padding: '10px',
              border: '1px solid var(--tc-border)',
              borderRadius: 'var(--tc-radius-md)',
              flex: 1
            }}
          />
          <button
            onClick={handleReconcile}
            disabled={!file || loading}
            style={{
              padding: '10px 24px',
              backgroundColor: 'var(--tc-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--tc-radius-md)',
              fontWeight: 'bold',
              cursor: !file || loading ? 'not-allowed' : 'pointer',
              opacity: !file || loading ? 0.6 : 1
            }}
          >
            {loading ? 'Đang đối soát...' : 'Bắt đầu Đối soát'}
          </button>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--tc-spacing-4)', marginBottom: 'var(--tc-spacing-6)' }}>
            <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-4)', borderRadius: 'var(--tc-radius-md)', border: '1px solid var(--tc-border)' }}>
              <div style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-text-secondary)' }}>Tổng xử lý</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{result.totalProcessed}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-4)', borderRadius: 'var(--tc-radius-md)', border: '1px solid var(--tc-border)' }}>
              <div style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-success)' }}>Khớp 100%</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--tc-success)' }}>{result.matchedCount}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-4)', borderRadius: 'var(--tc-radius-md)', border: '1px solid var(--tc-border)' }}>
              <div style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-warning)' }}>Không tìm thấy (Unmatched)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--tc-warning)' }}>{result.unmatchedCount}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-4)', borderRadius: 'var(--tc-radius-md)', border: '1px solid var(--tc-border)' }}>
              <div style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-danger)' }}>Lệch dữ liệu (Discrepancies)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--tc-danger)' }}>{result.discrepancyCount}</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-lg)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--tc-border)' }}>
              <button
                onClick={() => setActiveTab('discrepancies')}
                style={{
                  flex: 1, padding: '12px', border: 'none', background: activeTab === 'discrepancies' ? 'var(--tc-danger-bg)' : 'transparent',
                  color: activeTab === 'discrepancies' ? 'var(--tc-danger)' : 'inherit', fontWeight: activeTab === 'discrepancies' ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                Lệch Dữ Liệu ({result.discrepancyCount})
              </button>
              <button
                onClick={() => setActiveTab('unmatched')}
                style={{
                  flex: 1, padding: '12px', border: 'none', background: activeTab === 'unmatched' ? 'var(--tc-warning-light)' : 'transparent',
                  color: activeTab === 'unmatched' ? 'var(--tc-warning)' : 'inherit', fontWeight: activeTab === 'unmatched' ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                Không Tìm Thấy ({result.unmatchedCount})
              </button>
              <button
                onClick={() => setActiveTab('matched')}
                style={{
                  flex: 1, padding: '12px', border: 'none', background: activeTab === 'matched' ? 'var(--tc-success-bg)' : 'transparent',
                  color: activeTab === 'matched' ? 'var(--tc-success)' : 'inherit', fontWeight: activeTab === 'matched' ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                Khớp ({result.matchedCount})
              </button>
            </div>

            <div style={{ padding: 'var(--tc-spacing-5)' }}>
              {activeTab === 'discrepancies' && (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--tc-font-size-sm)' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--tc-border)', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>Mã Giao Dịch</th>
                      <th style={{ padding: '8px' }}>Ghi nhận Hệ thống</th>
                      <th style={{ padding: '8px' }}>Ghi nhận Ngân hàng</th>
                      <th style={{ padding: '8px' }}>Chênh lệch</th>
                      <th style={{ padding: '8px' }}>Nguyên nhân (Gợi ý)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.discrepancies.length === 0 ? (
                      <tr><td colSpan={5} style={{ padding: '16px', textAlign: 'center' }}>Không có dữ liệu</td></tr>
                    ) : (
                      result.discrepancies.map((d: any) => (
                        <tr key={d.id} style={{ borderBottom: '1px solid var(--tc-border)' }}>
                          <td style={{ padding: '8px', fontFamily: 'monospace' }}>{d.id.substring(0, 8)}...</td>
                          <td style={{ padding: '8px' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.systemAmount)}</td>
                          <td style={{ padding: '8px' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.bankAmount)}</td>
                          <td style={{ padding: '8px', color: 'var(--tc-danger)', fontWeight: 'bold' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.abs(d.systemAmount - d.bankAmount))}
                          </td>
                          <td style={{ padding: '8px' }}>{d.reason}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'unmatched' && (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--tc-font-size-sm)' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--tc-border)', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>Mã Giao Dịch</th>
                      <th style={{ padding: '8px' }}>Số tiền</th>
                      <th style={{ padding: '8px' }}>Loại</th>
                      <th style={{ padding: '8px' }}>Lý do</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.unmatched.length === 0 ? (
                      <tr><td colSpan={4} style={{ padding: '16px', textAlign: 'center' }}>Không có dữ liệu</td></tr>
                    ) : (
                      result.unmatched.map((d: any) => (
                        <tr key={d.id} style={{ borderBottom: '1px solid var(--tc-border)' }}>
                          <td style={{ padding: '8px', fontFamily: 'monospace' }}>{d.id.substring(0, 8)}...</td>
                          <td style={{ padding: '8px' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.amount)}</td>
                          <td style={{ padding: '8px' }}>{d.type}</td>
                          <td style={{ padding: '8px', color: 'var(--tc-warning)' }}>{d.reason}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'matched' && (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--tc-font-size-sm)' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--tc-border)', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>Mã Giao Dịch</th>
                      <th style={{ padding: '8px' }}>Số tiền</th>
                      <th style={{ padding: '8px' }}>Loại</th>
                      <th style={{ padding: '8px' }}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.matched.length === 0 ? (
                      <tr><td colSpan={4} style={{ padding: '16px', textAlign: 'center' }}>Không có dữ liệu</td></tr>
                    ) : (
                      result.matched.map((d: any) => (
                        <tr key={d.id} style={{ borderBottom: '1px solid var(--tc-border)' }}>
                          <td style={{ padding: '8px', fontFamily: 'monospace' }}>{d.id.substring(0, 8)}...</td>
                          <td style={{ padding: '8px' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.amount)}</td>
                          <td style={{ padding: '8px' }}>{d.type}</td>
                          <td style={{ padding: '8px', color: 'var(--tc-success)' }}>{d.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
