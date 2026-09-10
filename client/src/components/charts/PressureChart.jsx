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

export const PressureChart = ({ data = [], height = 240, nominalPressure = 1013.25 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: -6, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

          <XAxis
            dataKey="time"
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'var(--font-mono)' }}
            domain={['dataMin - 0.4', 'dataMax + 0.4']}
            unit=" hPa"
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
            formatter={(value) => [`${value} hPa`, 'Atmospheric Pressure']}
            labelFormatter={(label) => `Time: ${label}`}
          />

          {/* Standard Barometric Baseline Reference */}
          <ReferenceLine
            y={nominalPressure}
            stroke="#94a3b8"
            strokeDasharray="4 3"
            strokeWidth={1.2}
            label={{ value: `Standard (1013.25 hPa)`, fill: '#64748b', fontSize: 10, position: 'insideTopRight' }}
          />

          <Line
            type="monotone"
            dataKey="pressure"
            stroke="#0ea5e9"
            strokeWidth={2.4}
            dot={{ r: 3, fill: '#ffffff', stroke: '#0ea5e9', strokeWidth: 2 }}
            activeDot={{ r: 5, fill: '#0ea5e9', stroke: '#ffffff', strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
