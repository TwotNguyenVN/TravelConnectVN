import React from 'react';
import './LoadingBlock.css';

export interface LoadingBlockProps {
  height?: string | number;
  width?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export const LoadingBlock: React.FC<LoadingBlockProps> = ({
  height = '100px',
  width = '100%',
  borderRadius = '8px',
  className = '',
}) => {
  const style = {
    height: typeof height === 'number' ? `${height}px` : height,
    width: typeof width === 'number' ? `${width}px` : width,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
  };

  return <div className={`tc-loading-block ${className}`} style={style} />;
};
