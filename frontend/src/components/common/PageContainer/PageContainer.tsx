import React from 'react';
import './PageContainer.css';

export interface PageContainerProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  size = 'large',
  className = '',
}) => {
  const containerClass = `tc-page-container tc-page-container--${size} ${className}`;

  return <div className={containerClass}>{children}</div>;
};
