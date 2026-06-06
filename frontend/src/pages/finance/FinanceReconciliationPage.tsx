import { useState } from 'react';
import { financeApi } from '../../api/finance.api';
import Papa from 'papaparse';

interface ReconciliationResult {
  summary: {
    totalRows: number;
    matched: number;
    mismatched: number;
    notFound: number;
    extra: number;
  };
  matched: any[];
  notFound: any[];
  mismatched: any[];
  extra: any[];
}

export function FinanceReconciliationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ReconciliationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'mismatched' | 'notFound' | 'matched'>('mismatched');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  async function handleReconcile() {
    if (!file) return;

    setLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const parsedData = results.data.map((row: any) => ({
            transactionCode: row['Mã GD'] || row['Transaction Code'] || row['transactionCode'],
            amount: row['Số tiền'] ? parseFloat(String(row['Số tiền']).replace(/,/g, '')) : row['amount'],
            date: row['Ngày'] || row['date'],
            description: row['Nội dung'] || row['description']
          }));

          const res = await financeApi.reconcileTransactions(parsedData);
          if (res?.data) {
            setResult(res.data);
          } else if (res) {
            setResult(res as any);
          }
        } catch (err: any) {
          console.error(err);
          setError(err?.response?.data?.message || 'Có lỗi xảy ra trong quá trình đối soát.');
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        setError('Lỗi đọc file: ' + error.message);
        setLoading(false);
      }
    });
  }

  return (
    <div style={{ padding: 'var(--tc-spacing-6)' }}>
      <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', margin: '0 0 var(--tc-spacing-2) 0' }}>🔍 Công Cụ Đối Soát Dữ Liệu Tự Động</h1>
      <p style={{ color: 'var(--tc-text-secondary)', marginBottom: 'var(--tc-spacing-6)', fontSize: 'var(--tc-font-size-sm)' }}>
        Tải lên file sao kê ngân hàng (CSV) để tự động đối soát với các giao dịch trên hệ thống. (Lưu ý file CSV cần có cột "Mã GD" và "Số tiền").
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
            accept=".csv"
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
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{result.summary.totalRows}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-4)', borderRadius: 'var(--tc-radius-md)', border: '1px solid var(--tc-border)' }}>
              <div style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-success)' }}>Khớp</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--tc-success)' }}>{result.summary.matched}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-4)', borderRadius: 'var(--tc-radius-md)', border: '1px solid var(--tc-border)' }}>
              <div style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-warning)' }}>Không tìm thấy (Not Found)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--tc-warning)' }}>{result.summary.notFound}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-4)', borderRadius: 'var(--tc-radius-md)', border: '1px solid var(--tc-border)' }}>
              <div style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-danger)' }}>Lệch dữ liệu (Mismatched)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--tc-danger)' }}>{result.summary.mismatched}</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-lg)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--tc-border)' }}>
              <button
                onClick={() => setActiveTab('mismatched')}
                style={{
                  flex: 1, padding: '12px', border: 'none', background: activeTab === 'mismatched' ? 'var(--tc-danger-bg)' : 'transparent',
                  color: activeTab === 'mismatched' ? 'var(--tc-danger)' : 'inherit', fontWeight: activeTab === 'mismatched' ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                Lệch Dữ Liệu ({result.summary.mismatched})
              </button>
              <button
                onClick={() => setActiveTab('notFound')}
                style={{
                  flex: 1, padding: '12px', border: 'none', background: activeTab === 'notFound' ? 'var(--tc-warning-light)' : 'transparent',
                  color: activeTab === 'notFound' ? 'var(--tc-warning)' : 'inherit', fontWeight: activeTab === 'notFound' ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                Không Tìm Thấy ({result.summary.notFound})
              </button>
              <button
                onClick={() => setActiveTab('matched')}
                style={{
                  flex: 1, padding: '12px', border: 'none', background: activeTab === 'matched' ? 'var(--tc-success-bg)' : 'transparent',
                  color: activeTab === 'matched' ? 'var(--tc-success)' : 'inherit', fontWeight: activeTab === 'matched' ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                Khớp ({result.summary.matched})
              </button>
            </div>

            <div style={{ padding: 'var(--tc-spacing-5)' }}>
              {activeTab === 'mismatched' && (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--tc-font-size-sm)' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--tc-border)', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>Mã Giao Dịch</th>
                      <th style={{ padding: '8px' }}>Ghi nhận Hệ thống</th>
                      <th style={{ padding: '8px' }}>Ghi nhận Ngân hàng</th>
                      <th style={{ padding: '8px' }}>Chênh lệch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.mismatched.length === 0 ? (
                      <tr><td colSpan={4} style={{ padding: '16px', textAlign: 'center' }}>Không có dữ liệu</td></tr>
                    ) : (
                      result.mismatched.map((d: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--tc-border)' }}>
                          <td style={{ padding: '8px', fontFamily: 'monospace' }}>{d.row?.transactionCode}</td>
                          <td style={{ padding: '8px' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.tx?.amount || 0)}</td>
                          <td style={{ padding: '8px' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.row?.amount || 0)}</td>
                          <td style={{ padding: '8px', color: 'var(--tc-danger)', fontWeight: 'bold' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.abs(d.diff || 0))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'notFound' && (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--tc-font-size-sm)' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--tc-border)', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>Mã Giao Dịch (File)</th>
                      <th style={{ padding: '8px' }}>Số tiền (File)</th>
                      <th style={{ padding: '8px' }}>Ngày (File)</th>
                      <th style={{ padding: '8px' }}>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.notFound.length === 0 ? (
                      <tr><td colSpan={4} style={{ padding: '16px', textAlign: 'center' }}>Không có dữ liệu</td></tr>
                    ) : (
                      result.notFound.map((row: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--tc-border)' }}>
                          <td style={{ padding: '8px', fontFamily: 'monospace' }}>{row.transactionCode}</td>
                          <td style={{ padding: '8px' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.amount || 0)}</td>
                          <td style={{ padding: '8px' }}>{row.date}</td>
                          <td style={{ padding: '8px', color: 'var(--tc-warning)' }}>{row.description}</td>
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
                    </tr>
                  </thead>
                  <tbody>
                    {result.matched.length === 0 ? (
                      <tr><td colSpan={2} style={{ padding: '16px', textAlign: 'center' }}>Không có dữ liệu</td></tr>
                    ) : (
                      result.matched.map((d: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--tc-border)' }}>
                          <td style={{ padding: '8px', fontFamily: 'monospace' }}>{d.row?.transactionCode}</td>
                          <td style={{ padding: '8px' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.tx?.amount || 0)}</td>
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
