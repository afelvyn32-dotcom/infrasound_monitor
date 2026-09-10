import React from 'react';
import { Activity } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Activity,
  title = 'No Records Found',
  description = 'No telemetry data or events recorded for the selected monitoring criteria.',
  action
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      minHeight: '220px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '10px',
        backgroundColor: '#f8fafc',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        marginBottom: '16px'
      }}>
        <Icon size={24} strokeWidth={1.8} />
      </div>
      <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.844rem', color: 'var(--text-muted)', marginTop: '6px', maxWidth: '420px', lineHeight: 1.5 }}>
        {description}
      </p>
      {action && (
        <div style={{ marginTop: '18px' }}>
          {action}
        </div>
      )}
    </div>
  );
};
