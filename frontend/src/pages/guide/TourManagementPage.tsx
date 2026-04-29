import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TourFormPage from './TourFormPage';
import { TourSchedulesTab } from './tabs/TourSchedulesTab';
import { TourReviewsTab } from './tabs/TourReviewsTab';
import './TourManagementPage.css';

const TourManagementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'details' | 'schedules' | 'reviews'>('details');

  if (!id) {
    navigate('/guide/tours');
    return null;
  }

  return (
    <div className="tc-tour-management-page">
      <div className="tc-management-header">
        <div className="tc-management-header__actions">
          <button className="tc-btn-back-manage" onClick={() => navigate('/guide/tours')}>
            ← Quay lại danh sách
          </button>
        </div>
        
        <nav className="tc-management-tabs">
          <button 
            className={`tc-manage-tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Chi tiết
          </button>
          <button 
            className={`tc-manage-tab ${activeTab === 'schedules' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedules')}
          >
            Lịch Trình Tour
          </button>
          <button 
            className={`tc-manage-tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Đánh Giá
          </button>
        </nav>
      </div>

      <div className="tc-management-content">
        {activeTab === 'details' && <TourFormPage />}
        {activeTab === 'schedules' && <TourSchedulesTab tourId={id} />}
        {activeTab === 'reviews' && <TourReviewsTab tourId={id} />}
      </div>
    </div>
  );
};

export default TourManagementPage;
