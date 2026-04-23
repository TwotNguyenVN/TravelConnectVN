import React from 'react';
import './EmptyState.css';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`tc-empty-state ${className}`}>
      {icon && <div className="tc-empty-state-icon">{icon}</div>}
      <h3 className="tc-empty-state-title">{title}</h3>
      {description && <p className="tc-empty-state-description">{description}</p>}
      {action && <div className="tc-empty-state-action">{action}</div>}
    </div>
  );
};
