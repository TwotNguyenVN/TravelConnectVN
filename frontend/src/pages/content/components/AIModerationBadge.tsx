import React from 'react';

interface Props {
  isSafe: boolean;
  flags: string[];
}

export const AIModerationBadge: React.FC<Props> = ({ isSafe, flags }) => {
  if (isSafe || flags.length === 0) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '12px',
        backgroundColor: '#fee2e2',
        color: '#ef4444',
        fontSize: '11px',
        fontWeight: 600,
        boxShadow: 'var(--tc-shadow-sm)',
      }}
    >
      <span style={{ fontSize: '14px' }}>🤖</span> AI Cảnh báo: {flags.join(', ')}
    </div>
  );
};
