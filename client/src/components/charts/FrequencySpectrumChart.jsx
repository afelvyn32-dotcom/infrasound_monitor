import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MOCK_FREQUENCY_SPECTRUM } from '../../data/mockReadings';

export const FrequencySpectrumChart = ({ data = MOCK_FREQUENCY_SPECTRUM, height = 220 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 12, left: -14, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

          <XAxis
            dataKey="freq"
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            minTickGap={20}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            domain={[0, 1.0]}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              boxShadow: 'var(--shadow-md)',
              color: '#0f172a'
            }}
            formatter={(val, name, item) => [
              `${val} PSD ${item.payload.isDominant ? '★ DOMINANT' : ''}`,
              'Spectral Energy'
            ]}
            labelFormatter={(label) => `Infrasound Frequency: ${label}`}
          />

          <Bar
            dataKey="psd"
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
            animationDuration={600}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isDominant ? '#2563eb' : '#93c5fd'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Subtext Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '8px',
        paddingTop: '6px',
        borderTop: '1px solid var(--border-divider)',
        fontSize: '0.719rem',
        color: 'var(--text-muted)'
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#2563eb' }} />
          <span>Dominant Acoustic Frequency (2.8 Hz)</span>
        </span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>Bandwidth: 0.1 – 20.0 Hz</span>
      </div>
    </div>
  );
};
