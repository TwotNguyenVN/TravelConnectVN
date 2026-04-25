import React from 'react';
import { Card, Badge } from '../common';
import './GuideCard.css';

export interface GuideListItem {
  id: string;
  name: string;
  avatar: string;
  workingArea: string;
  yearsOfExperience: number;
  rating: number;
  verificationStatus: string;
  languages: string[];
  skills: string[];
  coverUrl?: string;
}

interface GuideCardProps {
  guide: GuideListItem;
  onClick?: () => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide, onClick }) => {
  return (
    <Card className="guide-card" padding="none" onClick={onClick}>
      <div className="guide-card-header">
        <div className="guide-card-cover-wrapper">
          <img 
            src={guide.coverUrl || 'https://via.placeholder.com/600x240?text=TravelConnectVN'} 
            alt="Cover" 
            className="guide-card-cover"
          />
        </div>
        <div className="guide-card-avatar-wrapper">
          <img 
            src={guide.avatar || 'https://via.placeholder.com/100?text=Avatar'} 
            alt={guide.name} 
            className="guide-card-avatar"
          />
        </div>
        {(guide.verificationStatus === 'verified' || guide.verificationStatus === 'approved') && (
          <div className="guide-card-status">
            <Badge variant="success">Đã xác minh</Badge>
          </div>
        )}
      </div>
      
      <div className="guide-card-content">
        <h3 className="guide-card-name">
          {guide.name}
          {(guide.verificationStatus === 'verified' || guide.verificationStatus === 'approved') && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="var(--color-success)"/>
            </svg>
          )}
        </h3>
        
        <div className="guide-card-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {guide.workingArea}
        </div>
        
        <div className="guide-card-info">
          {guide.languages.slice(0, 2).map((lang, index) => (
            <span key={index} className="guide-card-tag">{lang}</span>
          ))}
          {guide.skills.length > 0 && (
            <span className="guide-card-tag">+{guide.skills.length} kỹ năng</span>
          )}
        </div>
        
        <div className="guide-card-footer">
          <div className="guide-card-rating">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
            </svg>
            {guide.rating.toFixed(1)}
          </div>
          <div className="guide-card-experience">
            {guide.yearsOfExperience} năm kinh nghiệm
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GuideCard;
