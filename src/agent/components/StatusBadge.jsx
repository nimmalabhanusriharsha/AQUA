import React from 'react';

const StatusBadge = ({ status }) => {
  let bgColor, textColor, borderColor;

  switch (status.toLowerCase()) {
    case 'completed':
      bgColor = '#ecfdf5';
      textColor = 'var(--status-green)';
      borderColor = 'var(--status-green)';
      break;
    case 'due':
      bgColor = '#fef3c7';
      textColor = '#d97706'; // darker yellow for contrast
      borderColor = 'var(--status-yellow)';
      break;
    case 'overdue':
      bgColor = '#fef2f2';
      textColor = 'var(--status-red)';
      borderColor = 'var(--status-red)';
      break;
    default:
      bgColor = '#f3f4f6';
      textColor = 'var(--color-text-muted)';
      borderColor = 'var(--color-border)';
  }

  return (
    <span style={{
      backgroundColor: bgColor,
      color: textColor,
      border: `1px solid ${borderColor}`,
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      display: 'inline-block'
    }}>
      {status}
    </span>
  );
};

export default StatusBadge;
