import React, { useState, useEffect } from 'react';
import { sensorService } from '../../services/sensorService';
import { reportService } from '../../services/reportService';
import { MOCK_SENSORS } from '../../data/mockSensors';
import { MOCK_EVENTS } from '../../data/mockEvents';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { History, Download, RefreshCw, Filter, Search, Calendar, Sliders } from 'lucide-react';

export const HistoricalData = () => {
  const [selectedStation, setSelectedStation] = useState('Station A');
  const [selectedSensorId, setSelectedSensorId] = useState('INS-BLR-01');
  const [selectedParameter, setSelectedParameter] = useState('pressure'); // pressure, temp, frequency, amplitude
  const [timeRange, setTimeRange] = useState('24h');
  const [searchTerm, setSearchTerm] = useState('');
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Summary statistics
  const [stats, setStats] = useState({
    min: '1011.8',
    max: '1012.9',
    avg: '1012.4',
    variance: '0.12'
  });

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await sensorService.getReadings(selectedSensorId, 24);
      if (res.success) {
        const formatted = res.data.map((r, idx) => {
          const d = new Date(r.timestamp);
          const tStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const p = r.stats?.avgPressure || 1012.4;
          const temp = Number((27.4 + Math.sin(idx * 0.4) * 1.5).toFixed(1));
          const freq = Number((2.8 + Math.cos(idx * 0.5) * 0.4).toFixed(1));
          const amp = Number((0.07 + Math.abs(Math.sin(idx * 0.8)) * 0.15).toFixed(2));
          return {
            time: tStr,
            fullDate: d.toLocaleDateString(),
            pressure: p,
            temperature: temp,
            frequency: freq,
            amplitude: amp,
            status: 'NORMAL'
          };
        });
        setReadings(formatted);

        // Compute statistics based on selected parameter
        let vals = formatted.map(f => f[selectedParameter]);
        let minVal = Math.min(...vals);
        let maxVal = Math.max(...vals);
        let sum = vals.reduce((a, b) => a + b, 0);
        let avg = sum / (vals.length || 1);

        setStats({
          min: minVal.toFixed(2),
          max: maxVal.toFixed(2),
          avg: avg.toFixed(2),
          variance: (maxVal - minVal).toFixed(2)
        });
      }
    } catch (err) {
      console.error('[HistoricalData] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedSensorId, selectedParameter, timeRange]);

  const handleExportCSV = () => {
    const rows = readings.map(r => [
      r.fullDate + ' ' + r.time,
      selectedSensorId,
      r.pressure,
      r.temperature,
      r.frequency,
      r.amplitude,
      r.status
    ]);
    reportService.downloadCSV(`historical_telemetry_${selectedSensorId}_${selectedParameter}.csv`, rows);
  };

  const parameterConfig = {
    pressure: { label: 'Atmospheric Pressure', unit: 'hPa', color: '#2563eb' },
    temperature: { label: 'Core Temperature', unit: '°C', color: '#0ea5e9' },
    frequency: { label: 'Infrasound Frequency', unit: 'Hz', color: '#d97706' },
    amplitude: { label: 'Acoustic Amplitude', unit: 'Pa', color: '#dc2626' }
  };

  const currentParam = parameterConfig[selectedParameter];

  const tableColumns = [
    {
      header: 'Timestamp',
      accessor: 'time',
      render: (row) => <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{row.time}</span>
    },
    {
      header: 'Pressure',
      accessor: 'pressure',
      render: (row) => <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{row.pressure} hPa</span>
    },
    {
      header: 'Temperature',
      accessor: 'temperature',
      render: (row) => <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{row.temperature} °C</span>
    },
    {
      header: 'Frequency',
      accessor: 'frequency',
      render: (row) => <span style={{ color: 'var(--color-primary)', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{row.frequency} Hz</span>
    },
    {
      header: 'Amplitude',
      accessor: 'amplitude',
      render: (row) => <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{row.amplitude} Pa</span>
    },
    {
      header: 'Integrity',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  const filteredReadings = readings.filter(r =>
    !searchTerm || r.time.includes(searchTerm) || String(r.pressure).includes(searchTerm)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header & Export Action */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <History size={28} color="var(--color-primary)" />
            Historical Telemetry & Scientific Signal Analysis
          </h1>
          <p className="page-subtitle">
            Query long-term atmospheric pressure trends, parameter correlations, and past acoustic transients
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={fetchHistory}
            className="btn btn-secondary"
            style={{ padding: '8px 14px' }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn btn-primary"
            style={{ padding: '8px 16px' }}
          >
            <Download size={15} /> Export Dataset (CSV)
          </button>
        </div>
      </div>

      {/* Analytical Filter Console Card */}
      <div className="white-card" style={{ padding: '24px 28px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          alignItems: 'flex-end'
        }}>
          {/* Station Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Station Array
            </label>
            <select
              value={selectedSensorId}
              onChange={(e) => setSelectedSensorId(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#ffffff',
                fontSize: '0.844rem',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}
            >
              {MOCK_SENSORS.map(s => (
                <option key={s.sensorId} value={s.sensorId}>
                  {s.station} ({s.location})
                </option>
              ))}
            </select>
          </div>

          {/* Parameter Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Primary Parameter
            </label>
            <select
              value={selectedParameter}
              onChange={(e) => setSelectedParameter(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#ffffff',
                fontSize: '0.844rem',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}
            >
              <option value="pressure">Atmospheric Pressure (hPa)</option>
              <option value="temperature">Enclosure Temperature (°C)</option>
              <option value="frequency">Dominant Frequency (Hz)</option>
              <option value="amplitude">Acoustic Amplitude (Pa)</option>
            </select>
          </div>

          {/* Time Window Range */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Time Range
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#ffffff',
                fontSize: '0.844rem',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}
            >
              <option value="1h">Last 1 Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours (Standard)</option>
              <option value="7d">Last 7 Days (Consolidated)</option>
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Search Records
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-light)' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter timestamp / value..."
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 32px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: '#ffffff',
                  fontSize: '0.844rem',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid-4" style={{ gap: '20px' }}>
        <div className="white-card" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Minimum {currentParam.label}
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            {stats.min} <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{currentParam.unit}</span>
          </div>
        </div>

        <div className="white-card" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Maximum {currentParam.label}
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            {stats.max} <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{currentParam.unit}</span>
          </div>
        </div>

        <div className="white-card" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Average Mean
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--color-primary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            {stats.avg} <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{currentParam.unit}</span>
          </div>
        </div>

        <div className="white-card" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Dynamic Range
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            {stats.variance} <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>&Delta;{currentParam.unit}</span>
          </div>
        </div>
      </div>

      {/* Large Historical Time-Series Chart */}
      <div className="white-card" style={{ padding: '28px 32px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            Historical Trend Curve: {currentParam.label}
          </h3>
          <p style={{ fontSize: '0.813rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Continuous observation history across {selectedStation} ({selectedSensorId})
          </p>
        </div>

        <div style={{ width: '100%', height: 380 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={readings} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
                unit={` ${currentParam.unit}`}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px'
                }}
                formatter={(val) => [`${val} ${currentParam.unit}`, currentParam.label]}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey={selectedParameter}
                name={currentParam.label}
                stroke={currentParam.color}
                strokeWidth={2.4}
                dot={{ r: 3, fill: '#ffffff', stroke: currentParam.color, strokeWidth: 2 }}
                activeDot={{ r: 6, fill: currentParam.color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Data Records Table */}
      <div className="white-card" style={{ padding: '24px 28px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Telemetry Measurement Log
          </h3>
          <p style={{ fontSize: '0.781rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Sampled parameter values stored in the time-series archive
          </p>
        </div>

        <DataTable
          columns={tableColumns}
          data={filteredReadings}
          pageSize={10}
        />
      </div>

    </div>
  );
};
