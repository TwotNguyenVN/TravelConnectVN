import React from 'react';
import './Badge.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'neutral';
  size?: 'small' | 'medium';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'medium',
  className = '',
}) => {
  const baseClass = 'tc-badge';
  const variantClass = `${baseClass}--${variant}`;
  const sizeClass = `${baseClass}--size-${size}`;

  return (
    <span className={[baseClass, variantClass, sizeClass, className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
};
