import React, { useState, useEffect } from 'react';
import { alertService } from '../../services/alertService';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Radio, Search, Filter, Check, CheckCheck, RefreshCw, ShieldAlert, AlertCircle } from 'lucide-react';

export const UserAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await alertService.getAll({
        severity: severityFilter || undefined
      });
      if (res.success) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.error('[UserAlerts] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [severityFilter]);

  const handleAcknowledge = async (id) => {
    await alertService.acknowledge(id);
    setAlerts(prev => prev.map(a => a.alertId === id ? { ...a, status: 'RESOLVED', resolved: true } : a));
  };

  const handleAcknowledgeAll = async () => {
    await alertService.acknowledgeAll();
    setAlerts(prev => prev.map(a => ({ ...a, status: 'RESOLVED', resolved: true })));
  };

  const columns = [
    {
      header: 'Alert ID',
      accessor: 'alertId',
      render: (row) => <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{row.alertId}</span>
    },
    {
      header: 'Time',
      accessor: 'time',
      render: (row) => <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{row.time}</span>
    },
    {
      header: 'Station',
      accessor: 'station',
      render: (row) => <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.station}</span>
    },
    {
      header: 'Sensor',
      accessor: 'sensorId',
      render: (row) => <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.781rem' }}>{row.sensorId}</span>
    },
    {
      header: 'Alert Type',
      accessor: 'title',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.title}</div>
          <div style={{ fontSize: '0.719rem', color: 'var(--text-muted)', marginTop: '2px' }}>{row.message}</div>
        </div>
      )
    },
    {
      header: 'Frequency',
      accessor: 'frequency',
      render: (row) => <span style={{ color: 'var(--color-primary)', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{row.frequency}</span>
    },
    {
      header: 'Amplitude',
      accessor: 'amplitude',
      render: (row) => <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{row.amplitude}</span>
    },
    {
      header: 'Severity',
      accessor: 'severity',
      render: (row) => <StatusBadge status={row.severity} />
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.719rem',
            fontWeight: '700',
            color: row.resolved ? 'var(--status-normal)' : 'var(--status-critical)',
            backgroundColor: row.resolved ? 'var(--status-normal-bg)' : 'var(--status-critical-bg)',
            border: `1px solid ${row.resolved ? 'var(--status-normal-border)' : 'var(--status-critical-border)'}`,
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            {row.status}
          </span>
          {!row.resolved && (
            <button
              onClick={() => handleAcknowledge(row.alertId)}
              className="btn btn-secondary"
              style={{ padding: '3px 8px', fontSize: '0.719rem', gap: '3px' }}
              title="Acknowledge alert"
            >
              <Check size={11} /> Read
            </button>
          )}
        </div>
      )
    }
  ];

  const filteredAlerts = alerts.filter(a =>
    !searchTerm ||
    a.alertId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unackCount = alerts.filter(a => !a.resolved).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header & Mark All as Read */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Radio size={28} color="var(--color-primary)" />
            Acoustic Incident Alert Center
          </h1>
          <p className="page-subtitle">
            Automated notifications triggered by micro-pressure threshold crossings and acoustic energy ratios
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={fetchAlerts}
            className="btn btn-secondary"
            style={{ padding: '8px 14px' }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
          {unackCount > 0 && (
            <button
              type="button"
              onClick={handleAcknowledgeAll}
              className="btn btn-primary"
              style={{ padding: '8px 16px' }}
            >
              <CheckCheck size={16} /> Mark All as Read ({unackCount})
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="white-card" style={{ padding: '22px 28px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Severity Level
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#ffffff',
                fontSize: '0.844rem',
                color: 'var(--text-primary)'
              }}
            >
              <option value="">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Search Alerts
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-light)' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Alert ID, Station, Incident..."
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

      {/* Alerts Table */}
      <div className="white-card" style={{ padding: '24px 28px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            System Alerts Archive ({filteredAlerts.length})
          </h3>
          <p style={{ fontSize: '0.781rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Observers can review incident parameters and acknowledge alerts. System thresholds can only be calibrated by administrators.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={filteredAlerts}
          pageSize={8}
        />
      </div>

    </div>
  );
};
