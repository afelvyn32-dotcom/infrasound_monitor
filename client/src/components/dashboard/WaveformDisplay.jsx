import React from 'react';
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
import { Activity, Radio, Pause, Play } from 'lucide-react';

export const WaveformDisplay = ({
  data,
  currentAmplitude,
  isPaused,
  onTogglePause,
  height = 320
}) => {
  return (
    <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
      {/* Waveform Card Header */}
      <div className="card-header" style={{ marginBottom: '14px' }}>
        <div>
          <div className="card-title" style={{ fontSize: '1.05rem' }}>
            <Activity size={18} color="var(--color-trace-cyan)" />
            <span>Live Infrasound Waveform</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Real-time differential acoustic pressure (ΔP in Pascals) across the sub-audible infrasonic spectrum (&lt; 20 Hz)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Real-time Peak Readout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-primary-subtle)',
            border: '1px solid var(--color-primary-border)',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)'
          }}>
            <span style={{ color: 'var(--color-primary)' }}>Peak ΔP:</span>
            <strong style={{ color: 'var(--color-primary)' }}>
              {currentAmplitude >= 0 ? `+${currentAmplitude.toFixed(2)}` : currentAmplitude.toFixed(2)} Pa
            </strong>
          </div>

          {/* Pause / Resume Live Streaming */}
          <button
            type="button"
            onClick={onTogglePause}
            className="btn btn-secondary"
            style={{ fontSize: '0.74rem', padding: '5px 10px' }}
            title={isPaused ? 'Resume live stream updates' : 'Pause live stream'}
          >
            {isPaused ? (
              <>
                <Play size={12} /> Resume
              </>
            ) : (
              <>
                <Pause size={12} /> Pause
              </>
            )}
          </button>

          {/* Live Badge */}
          <span className="badge badge-cyan" style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
            <span className={isPaused ? 'pulse-dot pulse-dot-red' : 'pulse-dot'} />
            {isPaused ? 'PAUSED' : 'LIVE 20 Hz'}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 16, left: -5, bottom: 5 }}>
            <defs>
              <linearGradient id="waveformGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              minTickGap={30}
            />

            <YAxis
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
              domain={[-2.5, 2.5]}
              unit=" Pa"
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#cbd5e1',
                borderRadius: '6px',
                fontSize: '11px',
                fontFamily: 'monospace',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                color: '#0f172a'
              }}
              formatter={(value) => [`${Number(value).toFixed(3)} Pa`, 'Amplitude (ΔP)']}
              labelFormatter={(label) => `Time: ${label}`}
            />

            {/* Alarm Trigger Threshold Reference Lines */}
            <ReferenceLine
              y={2.0}
              stroke="#dc2626"
              strokeDasharray="3 3"
              label={{
                value: '+2.00 Pa (Trigger)',
                fill: '#dc2626',
                fontSize: 9,
                position: 'insideTopRight',
                fontFamily: 'monospace'
              }}
            />
            <ReferenceLine
              y={-2.0}
              stroke="#dc2626"
              strokeDasharray="3 3"
              label={{
                value: '-2.00 Pa (Trigger)',
                fill: '#dc2626',
                fontSize: 9,
                position: 'insideBottomRight',
                fontFamily: 'monospace'
              }}
            />
            <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />

            {/* Smooth Monotone Line with Gradient Area */}
            <Area
              type="monotone"
              dataKey="pressurePa"
              stroke="#0284c7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#waveformGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
