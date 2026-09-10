import React from 'react';

export const StatusBadge = ({ status = 'Normal' }) => {
  const normalized = status.toLowerCase();

  let badgeClass = 'badge-normal';
  let dotColor = '#16a34a';

  if (normalized === 'warning' || normalized === 'elevated') {
    badgeClass = 'badge-warning';
    dotColor = '#d97706';
  } else if (normalized === 'critical' || normalized === 'anomaly') {
    badgeClass = 'badge-critical';
    dotColor = '#dc2626';
  } else if (normalized === 'offline') {
    badgeClass = 'badge-offline';
    dotColor = '#64748b';
  } else if (normalized === 'online' || normalized === 'normal' || normalized === 'good' || normalized === 'recorded') {
    badgeClass = 'badge-normal';
    dotColor = '#16a34a';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          display: 'inline-block'
        }}
      />
      <span>{status}</span>
    </span>
  );
};
