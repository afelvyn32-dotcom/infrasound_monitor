import React, { useState, useEffect } from 'react';

export const SpectrumVisualizer = ({ isAnomalyActive }) => {
  const [bars, setBars] = useState(() => Array(20).fill(10));

  useEffect(() => {
    const updateSpectrum = () => {
      const nextBars = [];
      const barCount = 20;

      for (let i = 0; i < barCount; i++) {
        let height = 0;
        if (isAnomalyActive) {
          // Elevated energy in 3 - 6 Hz bins (indices 5 to 10)
          if (i >= 5 && i <= 10) {
            height = 65 + Math.random() * 30;
          } else {
            height = 15 + Math.random() * 20;
          }
        } else {
          // Typical oceanic microbaroms peak at 0.2 - 2 Hz (lowest bins)
          if (i <= 3) {
            height = 45 + Math.random() * 20;
          } else {
            height = 8 + Math.random() * 14;
          }
        }
        nextBars.push(Math.round(height));
      }

      setBars(nextBars);
    };

    updateSpectrum();
    const interval = setInterval(updateSpectrum, 600);
    return () => clearInterval(interval);
  }, [isAnomalyActive]);

  return (
    <div className="tech-panel" style={{
      padding: '10px 12px',
      borderRadius: 'var(--radius-sm)',
      background: '#090f19',
      border: '1px solid #162032',
      fontFamily: 'var(--font-mono)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.66rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          FREQUENCY SPECTRUM (FFT 0.1 – 20 Hz)
        </span>
        <span style={{ color: isAnomalyActive ? '#fb7185' : 'var(--accent-cyan)' }}>
          {isAnomalyActive ? 'TRANSIENT SPIKE' : 'POWER DENSITY'}
        </span>
      </div>

      {/* Discrete 20-band Spectrum Visualizer */}
      <div style={{
        height: '64px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '3px',
        padding: '3px 6px',
        backgroundColor: '#05080e',
        borderRadius: '2px',
        border: '1px solid #0e1625'
      }}>
        {bars.map((height, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: `${height}%`,
              backgroundColor: isAnomalyActive ? '#f43f5e' : '#00f0ff',
              borderRadius: '1px 1px 0 0',
              opacity: isAnomalyActive ? 0.9 : 0.85,
              transition: 'height 300ms ease-out',
              boxShadow: isAnomalyActive ? '0 0 4px rgba(244, 63, 94, 0.4)' : '0 0 4px rgba(0, 240, 255, 0.3)'
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px' }}>
        <span>0.1 Hz</span>
        <span>5.0 Hz</span>
        <span>10.0 Hz</span>
        <span>20.0 Hz</span>
      </div>
    </div>
  );
};
