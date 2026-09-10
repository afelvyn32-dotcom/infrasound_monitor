import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Brush,
  Legend
} from 'recharts';

export const HistoricalTrendChart = ({ data, height = 340 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" vertical={false} />

          <XAxis
            dataKey="time"
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={false}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
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
          />

          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

          <Line
            type="monotone"
            dataKey="maxPressure"
            name="Max Peak (Pa)"
            stroke="#dc2626"
            strokeWidth={1.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="avgPressure"
            name="Average ΔP (Pa)"
            stroke="#0284c7"
            strokeWidth={1.8}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="minPressure"
            name="Min Rarefaction (Pa)"
            stroke="#7c3aed"
            strokeWidth={1.5}
            dot={false}
          />

          <Brush
            dataKey="time"
            height={26}
            stroke="#0284c7"
            fill="#f8fafc"
            tickFormatter={() => ''}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
