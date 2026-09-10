import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { Play, Pause, Maximize2, Minimize2, Radio } from 'lucide-react';

export const LiveWaveformChart = ({
  data = [],
  upperThreshold = 0.35,
  lowerThreshold = -0.35,
  height = 420,
  activeWindow = '30s',
  onWindowChange,
  isPaused = false,
  onTogglePause
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const containerStyle = isFullscreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    zIndex: 9999,
    padding: '32px',
    display: 'flex',
    flexDirection: 'column'
  } : {
    width: '100%',
    position: 'relative'
  };

  return (
    <div className={isFullscreen ? 'white-card' : ''} style={containerStyle}>
      {/* Waveform Header & Controls Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Title & Live Indicator */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Live Infrasound Waveform
            </h3>

            {/* LIVE / PAUSED Status Badge */}
            {isPaused ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.719rem',
                fontWeight: '700',
                backgroundColor: 'var(--status-warning-bg)',
                color: 'var(--status-warning)',
                border: '1px solid var(--status-warning-border)',
                padding: '2px 8px',
                borderRadius: '9999px',
                letterSpacing: '0.04em'
              }}>
                <span>&#10074;&#10074;</span> PAUSED
              </span>
            ) : (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.719rem',
                fontWeight: '700',
                backgroundColor: 'var(--status-normal-bg)',
                color: 'var(--status-normal)',
                border: '1px solid var(--status-normal-border)',
                padding: '2px 9px',
                borderRadius: '9999px',
                letterSpacing: '0.04em'
              }}>
                <span className="pulse-dot-green" /> LIVE
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.813rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Continuous atmospheric micro-pressure variation (&plusmn;0.35 Pa safety envelope)
          </p>
        </div>

        {/* Chart Actions & Time Window Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Pause / Resume button */}
          {onTogglePause && (
            <button
              type="button"
              onClick={onTogglePause}
              className="btn btn-secondary"
              style={{
                fontSize: '0.781rem',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title={isPaused ? 'Resume live streaming' : 'Pause live streaming'}
            >
              {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          )}

          {/* Time Window Switcher */}
          {onWindowChange && (
            <div style={{
              display: 'flex',
              backgroundColor: '#f1f5f9',
              borderRadius: '8px',
              padding: '2px',
              gap: '2px'
            }}>
              {['30s', '1m', '5m'].map((win) => (
                <button
                  key={win}
                  type="button"
                  onClick={() => onWindowChange(win)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: activeWindow === win ? '700' : '500',
                    color: activeWindow === win ? 'var(--color-primary)' : 'var(--text-muted)',
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

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="btn btn-secondary"
            style={{ padding: '6px 10px' }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ width: '100%', height: isFullscreen ? 'calc(100vh - 120px)' : height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 16, left: -6, bottom: 0 }}>
            <defs>
              <linearGradient id="liveWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.16} />
                <stop offset="90%" stopColor="#2563eb" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'var(--font-mono)' }}
              tickLine={false}
              minTickGap={45}
            />

            <YAxis
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'var(--font-mono)' }}
              domain={[-1.0, 1.0]}
              unit=" Pa"
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#cbd5e1',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                boxShadow: 'var(--shadow-md)',
                color: '#0f172a'
              }}
              formatter={(value) => [`${value} Pa`, 'Acoustic ΔP']}
              labelFormatter={(label) => `Timestamp: ${label}`}
            />

            {/* Configurable Alert Threshold Boundaries */}
            <ReferenceLine
              y={upperThreshold}
              stroke="#dc2626"
              strokeDasharray="4 3"
              strokeWidth={1.4}
              label={{ value: `+${upperThreshold} Pa Trigger`, fill: '#dc2626', fontSize: 10, position: 'right' }}
            />
            <ReferenceLine
              y={lowerThreshold}
              stroke="#dc2626"
              strokeDasharray="4 3"
              strokeWidth={1.4}
              label={{ value: `${lowerThreshold} Pa Trigger`, fill: '#dc2626', fontSize: 10, position: 'right' }}
            />
            <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />

            <Area
              type="monotone"
              dataKey="amplitude"
              stroke="#2563eb"
              strokeWidth={2.4}
              fill="url(#liveWaveGrad)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend / Status Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid var(--border-divider)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', backgroundColor: '#2563eb', borderRadius: '2px' }} />
            <span>Acoustic ΔP (Pa)</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '2px', backgroundColor: '#dc2626', borderTop: '2px dashed #dc2626' }} />
            <span>Alert Threshold (&plusmn;{upperThreshold} Pa)</span>
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.719rem' }}>
          Sampling Rate: 20 Hz &middot; Sliding Window: {activeWindow}
        </div>
      </div>
    </div>
  );
};
