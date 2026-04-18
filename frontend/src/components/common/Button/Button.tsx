import React, { type ButtonHTMLAttributes } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClass = 'tc-btn';
  const variantClass = `${baseClass}--${variant}`;
  const sizeClass = `${baseClass}--size-${size}`;
  const loadingClass = isLoading ? `${baseClass}--loading` : '';
  const disabledClass = disabled ? `${baseClass}--disabled` : '';

  return (
    <button
      className={[baseClass, variantClass, sizeClass, loadingClass, disabledClass, className].filter(Boolean).join(' ')}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="tc-btn-spinner"></span> : null}
      {children}
    </button>
  );
};
