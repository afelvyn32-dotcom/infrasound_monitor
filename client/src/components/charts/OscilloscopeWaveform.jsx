import React, { useRef, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

export const OscilloscopeWaveform = ({
  points,
  isAnomalyActive,
  onToggleAnomaly
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const midY = canvas.height / 2;
    const maxAmplitudePa = 2.2;
    const scaleY = (canvas.height / 2) / maxAmplitudePa;

    // Clear
    ctx.fillStyle = '#05080e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Lines
    ctx.strokeStyle = '#0e1625';
    ctx.lineWidth = 1;

    // Horizontal pressure grid (-2.0, -1.0, 0.0, 1.0, 2.0 Pa)
    for (let yPa = -2.0; yPa <= 2.0; yPa += 1.0) {
      const yPos = midY - (yPa * scaleY);
      ctx.beginPath();
      ctx.moveTo(0, yPos);
      ctx.lineTo(canvas.width, yPos);
      ctx.stroke();
    }

    // Vertical time grid (8 subdivisions)
    const stepX = canvas.width / 8;
    for (let x = 0; x < canvas.width; x += stepX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Alarm Trigger Threshold Reference Lines (±1.50 Pa)
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
    ctx.setLineDash([4, 4]);
    const upperTriggerY = midY - (1.5 * scaleY);
    const lowerTriggerY = midY - (-1.5 * scaleY);
    ctx.beginPath();
    ctx.moveTo(0, upperTriggerY);
    ctx.lineTo(canvas.width, upperTriggerY);
    ctx.moveTo(0, lowerTriggerY);
    ctx.lineTo(canvas.width, lowerTriggerY);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Zero Baseline Center Line
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(canvas.width, midY);
    ctx.stroke();

    // Render Oscilloscope Phosphor Trace
    if (points && points.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = isAnomalyActive ? '#f43f5e' : '#00f0ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = isAnomalyActive ? 'rgba(244, 63, 94, 0.6)' : 'rgba(0, 240, 255, 0.5)';
      ctx.shadowBlur = 6;

      const pointSpacing = canvas.width / (points.length - 1);

      for (let i = 0; i < points.length; i++) {
        const x = i * pointSpacing;
        const val = typeof points[i] === 'object' ? points[i].pressurePa : points[i];
        const y = midY - (val * scaleY);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Active Scan-Head Indicator
      const lastIndex = points.length - 1;
      const lastX = lastIndex * pointSpacing;
      const lastVal = typeof points[lastIndex] === 'object' ? points[lastIndex].pressurePa : points[lastIndex];
      const lastY = midY - (lastVal * scaleY);

      ctx.fillStyle = isAnomalyActive ? '#f43f5e' : '#ffffff';
      ctx.beginPath();
      ctx.arc(lastX, lastY, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [points, isAnomalyActive]);

  return (
    <div className="tech-panel" style={{
      borderRadius: 'var(--radius-sm)',
      border: '1px solid #192438',
      background: '#080d16',
      padding: '10px 12px',
      marginBottom: '10px'
    }}>
      {/* Waveform Header with Oscilloscope Coordinates & Simulation Trigger */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        borderBottom: '1px solid #141c2c',
        paddingBottom: '8px',
        marginBottom: '8px',
        fontSize: '0.74rem',
        fontFamily: 'var(--font-mono)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: isAnomalyActive ? '#f43f5e' : '#00f0ff',
            boxShadow: isAnomalyActive ? '0 0 8px #f43f5e' : '0 0 8px #00f0ff'
          }} />
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f8fafc', letterSpacing: '0.04em' }}>
            LIVE INFRASOUND WAVEFORM
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>
            [CHANNEL: INS-01-DIFF-CH1]
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Coordinates HUD */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.68rem',
            color: 'var(--text-dim)',
            background: '#0b101b',
            padding: '2px 8px',
            borderRadius: '2px',
            border: '1px solid #1e293b'
          }}>
            <span>SCALE: <strong style={{ color: '#e2e8f0' }}>±2.0 Pa</strong></span>
            <span style={{ color: '#334155' }}>|</span>
            <span>RATE: <strong style={{ color: 'var(--accent-cyan)' }}>20 S/s</strong></span>
            <span style={{ color: '#334155' }}>|</span>
            <span>WINDOW: <strong style={{ color: '#e2e8f0' }}>30 sec</strong></span>
          </div>

          {/* Interactive Anomaly Test Button */}
          {onToggleAnomaly && (
            <button
              type="button"
              onClick={onToggleAnomaly}
              style={{
                fontSize: '0.68rem',
                padding: '3px 8px',
                borderRadius: '2px',
                fontFamily: 'var(--font-mono)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: isAnomalyActive ? 'rgba(244, 63, 94, 0.2)' : 'rgba(245, 158, 11, 0.15)',
                color: isAnomalyActive ? '#fda4af' : '#fcd34d',
                border: `1px solid ${isAnomalyActive ? 'rgba(244, 63, 94, 0.5)' : 'rgba(245, 158, 11, 0.4)'}`
              }}
              title="Test dynamic high-energy transient anomaly"
            >
              {isAnomalyActive ? (
                <>
                  <RefreshCw size={11} className="spin" /> RESET NOMINAL
                </>
              ) : (
                <>
                  <Sparkles size={11} /> TEST ANOMALY SPIKE
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* HTML5 Canvas Oscilloscope Canvas */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '310px',
        backgroundColor: '#05080e',
        borderRadius: '2px',
        border: '1px solid #111927',
        overflow: 'hidden'
      }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        {/* On-Canvas Technical Coordinate Overlays */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '10px',
          pointerEvents: 'none',
          fontSize: '0.62rem',
          fontFamily: 'var(--font-mono)',
          color: 'rgba(0, 240, 255, 0.65)',
          lineHeight: '1.4'
        }}>
          <div>+1.50 Pa --- TRIGGER UPPER</div>
          <div style={{ color: '#475569' }}> 0.00 Pa --- ZERO BASELINE</div>
          <div>-1.50 Pa --- TRIGGER LOWER</div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '6px',
          right: '10px',
          pointerEvents: 'none',
          fontSize: '0.62rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)'
        }}>
          T-0s (REALTIME)
        </div>
      </div>
    </div>
  );
};
