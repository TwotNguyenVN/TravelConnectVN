import React, { type InputHTMLAttributes } from 'react';
import './Input.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const containerClass = `tc-input-container ${fullWidth ? 'tc-input--full-width' : ''} ${className}`;
  const fieldClass = `tc-input-field ${error ? 'tc-input-field--error' : ''}`;

  return (
    <div className={containerClass}>
      {label && (
        <label htmlFor={inputId} className="tc-input-label">
          {label}
        </label>
      )}
      <input id={inputId} className={fieldClass} {...props} />
      {error && <span className="tc-input-error">{error}</span>}
      {!error && helperText && <span className="tc-input-helper">{helperText}</span>}
    </div>
  );
};
