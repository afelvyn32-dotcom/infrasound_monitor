import React, { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export const ChartCard = ({
  title,
  subtitle,
  children,
  activeWindow = '30s',
  onWindowChange,
  liveIndicator = true
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className="white-card"
      style={{
        padding: '24px 26px',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 100 : 'auto',
        borderRadius: isFullscreen ? 0 : 'var(--radius-lg)',
        height: isFullscreen ? '100vh' : 'auto'
      }}
    >
      {/* Header with Title & Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-divider)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {liveIndicator && (
            <span
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.2)'
              }}
            />
          )}
          <div>
            <h2 style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em'
            }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Time-Window Selector */}
          {onWindowChange && (
            <div style={{
              display: 'inline-flex',
              backgroundColor: 'var(--bg-surface-subtle)',
              padding: '2px',
              borderRadius: 'var(--radius-md)'
            }}>
              {['30s', '1m', '5m'].map((win) => (
                <button
                  key={win}
                  type="button"
                  onClick={() => onWindowChange(win)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: activeWindow === win ? '600' : '500',
                    color: activeWindow === win ? 'var(--text-primary)' : 'var(--text-muted)',
                    backgroundColor: activeWindow === win ? '#ffffff' : 'transparent',
                    boxShadow: activeWindow === win ? 'var(--shadow-xs)' : 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {win}
                </button>
              ))}
            </div>
          )}

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div style={{ width: '100%', height: isFullscreen ? 'calc(100vh - 120px)' : '280px' }}>
        {children}
      </div>
    </div>
  );
};
