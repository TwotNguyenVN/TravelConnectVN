import React, { type SelectHTMLAttributes } from 'react';
import './Select.css';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const containerClass = `tc-select-container ${fullWidth ? 'tc-select-container--full-width' : ''} ${className}`;
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={containerClass}>
      {label && (
        <label htmlFor={selectId} className="tc-select-label">
          {label}
        </label>
      )}
      <div className="tc-select-wrapper">
        <select
          id={selectId}
          className={`tc-select-field ${error ? 'tc-select-field--error' : ''}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="tc-select-icon">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {error && <span className="tc-select-error">{error}</span>}
    </div>
  );
};
