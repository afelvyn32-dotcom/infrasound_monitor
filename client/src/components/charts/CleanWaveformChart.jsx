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

export const CleanWaveformChart = ({ data = [], height = '100%' }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '260px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 16, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="cleanWaveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.14} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

          <XAxis
            dataKey="time"
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'ui-monospace, monospace' }}
            tickLine={false}
            minTickGap={40}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'ui-monospace, monospace' }}
            domain={[-1.8, 1.8]}
            unit=" Pa"
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.08)',
              color: '#0f172a'
            }}
            formatter={(value) => [`${Number(value).toFixed(3)} Pa`, 'Micro-Pressure (ΔP)']}
            labelFormatter={(label) => `Timestamp: ${label}`}
          />

          {/* Threshold Lines */}
          <ReferenceLine
            y={1.2}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{ value: '+1.20 Pa Alert Threshold', fill: '#d97706', fontSize: 10, position: 'insideTopRight' }}
          />
          <ReferenceLine
            y={-1.2}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{ value: '-1.20 Pa Alert Threshold', fill: '#d97706', fontSize: 10, position: 'insideBottomRight' }}
          />
          <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />

          {/* Smooth Blue Line with Subtle Gradient Fill */}
          <Area
            type="monotone"
            dataKey="amplitude"
            stroke="#2563eb"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#cleanWaveFill)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
