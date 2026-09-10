import React, { useState } from 'react';
import { useAlerts } from '../../context/AlertContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  Activity,
  Check,
  CheckCheck,
  Search,
  Filter,
  AlertTriangle,
  Radio,
  Clock,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminAlerts = () => {
  const { alerts, unreadCount, acknowledgeAlert, acknowledgeAll } = useAlerts();
  const [severityFilter, setSeverityFilter] = useState('');
  const [stationFilter, setStationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAlert, setActiveAlert] = useState(null);

  const filtered = alerts.filter(a => {
    const matchesSeverity = !severityFilter || a.severity === severityFilter;
    const sId = a.sensorId || a.station || '';
    const matchesStation = !stationFilter || sId.toLowerCase().includes(stationFilter.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'UNRESOLVED' && !a.isAcknowledged) ||
      (statusFilter === 'RESOLVED' && a.isAcknowledged);
    const matchesSearch =
      (a.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.message || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      sId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.alertId || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSeverity && matchesStation && matchesStatus && matchesSearch;
  });

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{
            fontSize: '1.65rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '-0.025em',
            lineHeight: 1.2
          }}>
            Global Alert Dispatcher & Oversight
          </h1>
          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            marginTop: '4px'
          }}>
            System-wide acoustic anomaly alarms, automated notifications, and operational incident resolution
          </p>
        </div>

        <button
          onClick={acknowledgeAll}
          disabled={unreadCount === 0}
          className="btn btn-primary"
          style={{ padding: '9px 18px' }}
        >
          <CheckCheck size={16} /> Mark All Acknowledged ({unreadCount})
        </button>
      </div>

      {/* 3 Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="white-card" style={{ padding: '20px 24px', borderLeft: '4px solid var(--color-primary)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            TOTAL SYSTEM ALERTS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {alerts.length}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Dispatched across all sensor arrays
          </div>
        </div>

        <div className="white-card" style={{ padding: '20px 24px', borderLeft: unreadCount > 0 ? '4px solid var(--status-critical)' : '4px solid var(--status-normal)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            UNRESOLVED INCIDENTS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: unreadCount > 0 ? 'var(--status-critical)' : 'var(--status-normal)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {unreadCount}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Awaiting operator acknowledgement
          </div>
        </div>

        <div className="white-card" style={{ padding: '20px 24px', borderLeft: '4px solid var(--status-warning)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            CRITICAL SEVERITY INCIDENTS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--status-warning)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {criticalCount}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Pressure surge exceeding safety margins
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="white-card" style={{ padding: '16px 22px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search alert title, station ID, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px', fontSize: '0.84rem' }}
          />
        </div>

        <select
          className="form-select"
          value={stationFilter}
          onChange={(e) => setStationFilter(e.target.value)}
          style={{ width: '160px', fontSize: '0.82rem' }}
        >
          <option value="">All Stations</option>
          <option value="INS-001">INS-001 (Bengaluru)</option>
          <option value="INS-002">INS-002 (Hyderabad)</option>
          <option value="INS-003">INS-003 (New Delhi)</option>
          <option value="INS-004">INS-004 (Pune)</option>
          <option value="INS-005">INS-005 (Mumbai)</option>
        </select>

        <select
          className="form-select"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          style={{ width: '150px', fontSize: '0.82rem' }}
        >
          <option value="">All Severities</option>
          <option value="CRITICAL">Critical Alerts</option>
          <option value="HIGH">High Alerts</option>
          <option value="MEDIUM">Medium Alerts</option>
          <option value="LOW">Low Alerts</option>
        </select>

        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: '150px', fontSize: '0.82rem' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="UNRESOLVED">Unresolved</option>
          <option value="RESOLVED">Acknowledged</option>
        </select>
      </div>

      {/* Alert Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map((alert) => {
          const isCrit = alert.severity === 'CRITICAL';
          const isWarn = alert.severity === 'HIGH';
          const borderColor = isCrit ? 'var(--status-critical)' : isWarn ? 'var(--status-warning)' : 'var(--color-primary)';

          return (
            <div
              key={alert.alertId}
              className="white-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 24px',
                borderLeft: `4px solid ${borderColor}`,
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                    {alert.title}
                  </span>
                  <StatusBadge status={alert.severity} />
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: alert.isAcknowledged ? 'var(--status-normal-bg)' : 'var(--color-primary-subtle)',
                    color: alert.isAcknowledged ? 'var(--status-normal)' : 'var(--color-primary)'
                  }}>
                    {alert.isAcknowledged ? 'ACKNOWLEDGED' : 'PENDING ACTION'}
                  </span>
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                  {alert.message}
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
                  <span>Station: <strong style={{ color: 'var(--text-primary)' }}>{alert.sensorId || alert.station}</strong></span>
                  <span>Incident ID: {alert.alertId}</span>
                  <span>Trigger Time: {new Date(alert.createdAt || alert.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setActiveAlert(alert)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  <ExternalLink size={13} /> Incident Details
                </button>

                {!alert.isAcknowledged ? (
                  <button
                    onClick={() => acknowledgeAlert(alert.alertId)}
                    className="btn btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  >
                    <Check size={14} /> Resolve Incident
                  </button>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: 'var(--status-normal)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                    <Check size={14} /> Resolved
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="white-card" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No incident alerts found matching the active filters.
          </div>
        )}
      </div>

      {/* Incident Drill-down Modal */}
      <Modal
        isOpen={Boolean(activeAlert)}
        onClose={() => setActiveAlert(null)}
        title={`Incident Drill-Down: ${activeAlert?.alertId}`}
        subtitle="Forensic trace correlating alert triggers with physical stations and event records"
        maxWidth="540px"
      >
        {activeAlert && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                INCIDENT SUMMARY
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
                {activeAlert.title}
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {activeAlert.message}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '12px', background: '#ffffff', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>MONITORING NODE</div>
                <div style={{ fontSize: '0.94rem', fontWeight: '700', color: 'var(--color-primary)', marginTop: '2px' }}>
                  {activeAlert.sensorId || activeAlert.station}
                </div>
              </div>

              <div style={{ padding: '12px', background: '#ffffff', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>ASSOCIATED EVENT</div>
                <div style={{ fontSize: '0.94rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {activeAlert.eventId || 'EVT-9821'}
                </div>
              </div>

              <div style={{ padding: '12px', background: '#ffffff', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>SEVERITY LEVEL</div>
                <div style={{ fontSize: '0.94rem', fontWeight: '700', color: activeAlert.severity === 'CRITICAL' ? 'var(--status-critical)' : 'var(--status-warning)', marginTop: '2px' }}>
                  {activeAlert.severity}
                </div>
              </div>

              <div style={{ padding: '12px', background: '#ffffff', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>DISPATCH TIME</div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {new Date(activeAlert.createdAt || activeAlert.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-divider)' }}>
              <Link
                to="/admin/events"
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem' }}
                onClick={() => setActiveAlert(null)}
              >
                Inspect Associated Event →
              </Link>

              <button
                type="button"
                onClick={() => {
                  if (!activeAlert.isAcknowledged) acknowledgeAlert(activeAlert.alertId);
                  setActiveAlert(null);
                }}
                className="btn btn-primary"
              >
                {activeAlert.isAcknowledged ? 'Close' : 'Acknowledge & Close'}
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
