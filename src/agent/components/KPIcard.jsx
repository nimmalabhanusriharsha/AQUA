import React from 'react';

const KPIcard = ({ value, label, colorClass }) => {
  // Map color class to actual CSS variable for the border
  const getBorderColor = () => {
    switch (colorClass) {
      case 'blue': return 'var(--color-primary)';
      case 'green': return 'var(--status-green)';
      case 'yellow': return 'var(--status-yellow)';
      case 'red': return 'var(--status-red)';
      case 'orange': return 'var(--status-orange)';
      default: return 'var(--color-primary)';
    }
  };

  const style = {
    ...styles.card,
    borderRight: `4px solid ${getBorderColor()}`, // Assuming Figma uses a side accent (right or left, let's use right based on standard look)
  };

  return (
    <div style={style} className="card">
      <div style={styles.value}>{value}</div>
      <div style={styles.label}>{label}</div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '16px',
    height: '90px',
  },
  value: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    marginBottom: '4px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
  }
};

export default KPIcard;
