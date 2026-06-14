import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = useState<string>('10');
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Category State
  const [activeTab, setActiveTab] = useState<'languages' | 'provinces' | 'skills' | 'tour_categories'>('provinces');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  
  // Create/Edit Form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchGlobalSettings();
  }, []);

  useEffect(() => {
    fetchCategories(activeTab);
  }, [activeTab]);

  async function fetchGlobalSettings() {
    try {
      setLoadingConfig(true);
      const res = await adminApi.getSetting('commission_rate');
      setCommissionRate(res.setting_value);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingConfig(false);
    }
  }

  const saveCommissionRate = async () => {
    try {
      setLoadingConfig(true);
      await adminApi.updateSetting('commission_rate', commissionRate);
      alert('Lưu cấu hình thành công!');
    } catch (e) {
      alert('Có lỗi xảy ra');
    } finally {
      setLoadingConfig(false);
    }
  };

  async function fetchCategories(type: string) {
    try {
      setLoadingCats(true);
      const res = await adminApi.getCategories(type);
      setCategories(Array.isArray(res) ? res : res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCats(false);
    }
  }

  const handleSaveCategory = async () => {
    if (!formData.name) return;
    try {
      setLoadingCats(true);
      if (editingId) {
        await adminApi.updateCategory(activeTab, editingId, formData);
      } else {
        await adminApi.createCategory(activeTab, formData);
      }
      setShowForm(false);
      setFormData({ name: '', description: '' });
      setEditingId(null);
      fetchCategories(activeTab);
    } catch (e) {
      alert('Có lỗi xảy ra khi lưu');
    } finally {
      setLoadingCats(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
    try {
      await adminApi.deleteCategory(activeTab, id);
      fetchCategories(activeTab);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Có lỗi xảy ra, danh mục có thể đang được sử dụng.');
    }
  };

  return (
    <div style={{ padding: 'var(--tc-spacing-6)', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--tc-spacing-8)' }}>
        <h1 style={{ margin: 0, fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: '#1e293b' }}>
          Cấu hình Hệ thống (Global Settings)
        </h1>
        <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-sm)', marginTop: '4px' }}>
          Quản lý các thông số vận hành và danh mục hệ thống
        </p>
      </div>

      {/* Global Config Section */}
      <section style={{
        backgroundColor: 'white',
        padding: 'var(--tc-spacing-6)',
        borderRadius: 'var(--tc-radius-xl)',
        border: '1px solid var(--tc-border)',
        boxShadow: 'var(--tc-shadow-sm)',
        marginBottom: 'var(--tc-spacing-8)'
      }}>
        <h2 style={{ fontSize: 'var(--tc-font-size-lg)', fontWeight: 700, color: '#1e293b', marginBottom: 'var(--tc-spacing-4)', borderBottom: '1px solid var(--tc-border)', paddingBottom: 'var(--tc-spacing-2)' }}>
          Thông số Vận hành
        </h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--tc-spacing-4)' }}>
          <div style={{ flex: 1, maxWidth: '300px' }}>
            <label style={{ display: 'block', fontSize: 'var(--tc-font-size-sm)', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
              Tỷ lệ hoa hồng / Phí nền tảng (%)
            </label>
            <input
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--tc-radius-lg)',
                border: '1px solid var(--tc-border)',
                fontSize: 'var(--tc-font-size-sm)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              min="0" max="100"
            />
          </div>
          <button
            onClick={saveCommissionRate}
            disabled={loadingConfig}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--tc-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--tc-radius-lg)',
              cursor: loadingConfig ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: 'var(--tc-font-size-sm)',
              opacity: loadingConfig ? 0.7 : 1,
              transition: 'background-color 0.2s'
            }}
          >
            {loadingConfig ? 'Đang lưu...' : 'Lưu thông số'}
          </button>
        </div>
        <p style={{ fontSize: 'var(--tc-font-size-sm)', color: '#64748b', marginTop: 'var(--tc-spacing-3)' }}>
          Phí này sẽ được áp dụng làm tỷ lệ chiết khấu cho mọi đơn đặt tour thành công trên hệ thống.
        </p>
      </section>

      {/* Categories Dictionary Section */}
      <section style={{
        backgroundColor: 'white',
        padding: 'var(--tc-spacing-6)',
        borderRadius: 'var(--tc-radius-xl)',
        border: '1px solid var(--tc-border)',
        boxShadow: 'var(--tc-shadow-sm)'
      }}>
        <h2 style={{ fontSize: 'var(--tc-font-size-lg)', fontWeight: 700, color: '#1e293b', marginBottom: 'var(--tc-spacing-4)', borderBottom: '1px solid var(--tc-border)', paddingBottom: 'var(--tc-spacing-2)' }}>
          Quản lý Danh mục (Dictionaries)
        </h2>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-2)', borderBottom: '1px solid var(--tc-border)', marginBottom: 'var(--tc-spacing-6)' }}>
          {[
            { id: 'provinces', label: 'Tỉnh / Thành phố' },
            { id: 'languages', label: 'Ngôn ngữ' },
            { id: 'skills', label: 'Kỹ năng HDV' },
            { id: 'tour_categories', label: 'Thể loại Tour' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setShowForm(false); }}
              style={{
                padding: '12px 20px',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--tc-primary)' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: activeTab === tab.id ? 'var(--tc-primary)' : '#64748b',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: 'var(--tc-font-size-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '-1px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Bar */}
        <div style={{ marginBottom: 'var(--tc-spacing-4)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', description: '' }); }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--tc-radius-md)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 'var(--tc-font-size-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>+</span> Thêm bản ghi mới
          </button>
        </div>

        {/* Form Modal/Inline */}
        {showForm && (
          <div style={{
            marginBottom: 'var(--tc-spacing-6)',
            padding: 'var(--tc-spacing-5)',
            border: '1px solid #bfdbfe',
            backgroundColor: '#eff6ff',
            borderRadius: 'var(--tc-radius-lg)'
          }}>
            <h3 style={{ fontSize: 'var(--tc-font-size-base)', fontWeight: 700, color: '#1e3a8a', marginBottom: 'var(--tc-spacing-4)' }}>
              {editingId ? 'Sửa thông tin danh mục' : 'Thêm danh mục mới'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--tc-spacing-4)', marginBottom: 'var(--tc-spacing-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--tc-font-size-sm)', fontWeight: 600, color: '#3b82f6', marginBottom: '8px' }}>Tên danh mục *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--tc-radius-md)',
                    border: '1px solid #bfdbfe',
                    fontSize: 'var(--tc-font-size-sm)',
                    outline: 'none',
                  }}
                  autoFocus
                />
              </div>
              {activeTab === 'tour_categories' && (
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--tc-font-size-sm)', fontWeight: 600, color: '#3b82f6', marginBottom: '8px' }}>Mô tả</label>
                  <input 
                    type="text" 
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--tc-radius-md)',
                      border: '1px solid #bfdbfe',
                      fontSize: 'var(--tc-font-size-sm)',
                      outline: 'none',
                    }}
                  />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 'var(--tc-spacing-3)' }}>
              <button 
                onClick={handleSaveCategory} 
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--tc-radius-md)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 'var(--tc-font-size-sm)'
                }}
              >
                Lưu lại
              </button>
              <button 
                onClick={() => setShowForm(false)} 
                style={{
                  padding: '8px 20px',
                  backgroundColor: 'white',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--tc-radius-md)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 'var(--tc-font-size-sm)'
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        {loadingCats ? (
          <div style={{ padding: 'var(--tc-spacing-10)', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</div>
        ) : (
          <div style={{ 
            borderRadius: 'var(--tc-radius-lg)', 
            border: '1px solid var(--tc-border)', 
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--tc-border)' }}>
                  <th style={{ padding: 'var(--tc-spacing-4)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em', width: '80px' }}>ID</th>
                  <th style={{ padding: 'var(--tc-spacing-4)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>Tên</th>
                  {activeTab === 'tour_categories' && <th style={{ padding: 'var(--tc-spacing-4)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>Mô tả</th>}
                  <th style={{ padding: 'var(--tc-spacing-4)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em', width: '120px', textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: 'var(--tc-spacing-4)', fontSize: 'var(--tc-font-size-sm)', color: '#64748b' }}>{cat.id}</td>
                    <td style={{ padding: 'var(--tc-spacing-4)', fontSize: 'var(--tc-font-size-sm)', fontWeight: 600, color: '#1e293b' }}>{cat.name}</td>
                    {activeTab === 'tour_categories' && <td style={{ padding: 'var(--tc-spacing-4)', fontSize: 'var(--tc-font-size-sm)', color: '#475569' }}>{cat.description}</td>}
                    <td style={{ padding: 'var(--tc-spacing-4)', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button 
                          onClick={() => { setEditingId(cat.id); setFormData({ name: cat.name, description: cat.description || '' }); setShowForm(true); }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#eff6ff',
                            color: '#3b82f6',
                            border: '1px solid #bfdbfe',
                            borderRadius: 'var(--tc-radius-md)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600
                          }}
                        >
                          Sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#fef2f2',
                            color: '#ef4444',
                            border: '1px solid #fecaca',
                            borderRadius: 'var(--tc-radius-md)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={activeTab === 'tour_categories' ? 4 : 3} style={{ padding: 'var(--tc-spacing-8)', textAlign: 'center', color: '#94a3b8' }}>
                      Chưa có dữ liệu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
