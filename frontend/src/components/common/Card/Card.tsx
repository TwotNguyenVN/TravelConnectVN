import React from 'react';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'medium',
  shadow = 'small',
  onClick,
  ...props
}) => {
  const baseClass = 'tc-card';
  const paddingClass = `${baseClass}--pad-${padding}`;
  const shadowClass = `${baseClass}--shadow-${shadow}`;
  const clickableClass = onClick ? `${baseClass}--clickable` : '';

  return (
    <div 
      className={[baseClass, paddingClass, shadowClass, clickableClass, className].filter(Boolean).join(' ')} 
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
