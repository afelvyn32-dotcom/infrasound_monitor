import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export const StaLtaChart = ({ data, triggerThreshold = 3.5, height = 170 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" vertical={false} />

          <XAxis
            dataKey="time"
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={false}
            minTickGap={35}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
            domain={[0, 'auto']}
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
            formatter={(value) => [`${value}x`, 'STA/LTA Energy Ratio']}
          />

          {/* Trigger Threshold Reference Line */}
          <ReferenceLine
            y={triggerThreshold}
            stroke="#dc2626"
            strokeWidth={1.2}
            strokeDasharray="3 3"
            label={{ value: `Ratio Trigger ≥ ${triggerThreshold}`, fill: '#dc2626', fontSize: 9, position: 'insideTopRight', fontFamily: 'monospace' }}
          />
          <ReferenceLine y={1.0} stroke="#cbd5e1" />

          <Line
            type="monotone"
            dataKey="ratio"
            stroke="#d97706"
            strokeWidth={1.6}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
