import React, { useEffect } from 'react';
import './Modal.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="tc-modal-backdrop" onClick={handleBackdropClick}>
      <div className={`tc-modal tc-modal--${size}`} role="dialog" aria-modal="true">
        {title && (
          <div className="tc-modal-header">
            <h3 className="tc-modal-title">{title}</h3>
            <button className="tc-modal-close" onClick={onClose} aria-label="Close">
              &times;
            </button>
          </div>
        )}
        
        {!title && (
          <button className="tc-modal-close tc-modal-close--absolute" onClick={onClose} aria-label="Close">
            &times;
          </button>
        )}

        <div className="tc-modal-body">
          {children}
        </div>

        {footer && (
          <div className="tc-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
