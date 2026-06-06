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
      setCategories(res);
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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cấu hình Hệ thống (Global Settings)</h1>

      {/* Global Config Section */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Thông số Vận hành</h2>
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tỷ lệ hoa hồng / Phí nền tảng (%)
            </label>
            <input
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              min="0" max="100"
            />
          </div>
          <button
            onClick={saveCommissionRate}
            disabled={loadingConfig}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingConfig ? 'Đang lưu...' : 'Lưu thông số'}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Phí này sẽ được áp dụng làm tỷ lệ chiết khấu cho mọi đơn đặt tour thành công trên hệ thống.
        </p>
      </section>

      {/* Categories Dictionary Section */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Quản lý Danh mục (Dictionaries)</h2>
        
        {/* Tabs */}
        <div className="flex gap-2 border-b mb-4">
          {[
            { id: 'provinces', label: 'Tỉnh / Thành phố' },
            { id: 'languages', label: 'Ngôn ngữ' },
            { id: 'skills', label: 'Kỹ năng HDV' },
            { id: 'tour_categories', label: 'Thể loại Tour' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setShowForm(false); }}
              className={`px-4 py-2 -mb-px border-b-2 font-medium ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Bar */}
        <div className="mb-4">
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', description: '' }); }}
            className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
          >
            + Thêm mới
          </button>
        </div>

        {/* Form Modal/Inline */}
        {showForm && (
          <div className="mb-6 p-4 border border-blue-100 bg-blue-50 rounded-md">
            <h3 className="font-semibold mb-3">{editingId ? 'Sửa thông tin' : 'Thêm bản ghi mới'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tên danh mục *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded"
                  autoFocus
                />
              </div>
              {activeTab === 'tour_categories' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Mô tả</label>
                  <input 
                    type="text" 
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveCategory} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Lưu lại</button>
              <button onClick={() => setShowForm(false)} className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300">Hủy</button>
            </div>
          </div>
        )}

        {/* Data Table */}
        {loadingCats ? (
          <div className="py-8 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left border-b border-gray-200">
                  <th className="p-3 text-sm font-medium text-gray-600 w-16">ID</th>
                  <th className="p-3 text-sm font-medium text-gray-600">Tên</th>
                  {activeTab === 'tour_categories' && <th className="p-3 text-sm font-medium text-gray-600">Mô tả</th>}
                  <th className="p-3 text-sm font-medium text-gray-600 w-32 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-500">{cat.id}</td>
                    <td className="p-3 text-sm font-medium text-gray-800">{cat.name}</td>
                    {activeTab === 'tour_categories' && <td className="p-3 text-sm text-gray-600">{cat.description}</td>}
                    <td className="p-3 text-sm text-right flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingId(cat.id); setFormData({ name: cat.name, description: cat.description || '' }); setShowForm(true); }}
                        className="text-blue-600 hover:underline"
                      >
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-600 hover:underline"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">Chưa có dữ liệu.</td>
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
