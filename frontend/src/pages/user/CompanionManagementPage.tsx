import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CompanionFormPage from './CompanionFormPage';
import CompanionRequestManagementPage from './CompanionRequestManagementPage';
import CompanionDetailPage from '../public/CompanionDetailPage';
import './CompanionManagementPage.css';

const CompanionManagementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const isRequestsRoute = location.pathname.endsWith('/requests');
  const getInitialTab = () => {
    if (isRequestsRoute) return 'requests';
    const tabParam = queryParams.get('tab');
    if (tabParam === 'requests' || tabParam === 'view') return tabParam;
    return 'details';
  };

  const [activeTab, setActiveTab] = useState<'details' | 'requests' | 'view'>(getInitialTab());

  useEffect(() => {
    const tab = getInitialTab();
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location.pathname, location.search]);

  const handleTabChange = (tab: 'details' | 'requests' | 'view') => {
    setActiveTab(tab);
    if (tab === 'requests') {
      navigate(`/user/companion-posts/${id}/requests`, { replace: true });
    } else {
      navigate(`/user/companion-posts/${id}/edit?tab=${tab}`, { replace: true });
    }
  };

  if (!id) {
    navigate('/user/companion-posts');
    return null;
  }

  return (
    <div className="tc-companion-management-page">
      <div className="tc-management-header">
        <div className="tc-management-header__actions">
          <button className="tc-btn-back-manage" onClick={() => navigate('/user/companion-posts')}>
            ← Quay lại danh sách của tôi
          </button>
        </div>
        
        <nav className="tc-management-tabs">
          <button 
            className={`tc-manage-tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => handleTabChange('details')}
          >
            Chỉnh sửa thông tin
          </button>
          <button 
            className={`tc-manage-tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => handleTabChange('requests')}
          >
            Yêu cầu thành viên
          </button>
          <button 
            className={`tc-manage-tab ${activeTab === 'view' ? 'active' : ''}`}
            onClick={() => handleTabChange('view')}
          >
            Xem chi tiết / Chi tiêu
          </button>
        </nav>
      </div>

      <div className="tc-management-content">
        {activeTab === 'details' && <CompanionFormPage />}
        {activeTab === 'requests' && <CompanionRequestManagementPage />}
        {activeTab === 'view' && <CompanionDetailPage isEmbedded={true} />}
      </div>
    </div>
  );
};

export default CompanionManagementPage;
