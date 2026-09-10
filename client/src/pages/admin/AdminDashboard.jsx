import React, { useState, useEffect } from 'react';
import { sensorService } from '../../services/sensorService';
import { eventService } from '../../services/eventService';
import { alertService } from '../../services/alertService';
import { userService } from '../../services/userService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { Link } from 'react-router-dom';
import {
  Radio,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Users,
  Settings,
  Activity,
  CheckCircle2,
  XCircle,
  FileText,
  Sliders,
  Bell
} from 'lucide-react';

export const AdminDashboard = () => {
  const [sensors, setSensors] = useState([]);
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [sensorRes, eventRes, alertRes, userRes] = await Promise.all([
          sensorService.getAll(),
          eventService.getAll(),
          alertService.getAll(),
          userService.getAll()
        ]);
        if (sensorRes.data) setSensors(sensorRes.data);
        if (eventRes.data) setEvents(eventRes.data);
        if (alertRes.data) setAlerts(alertRes.data);
        if (userRes.data) setUsers(userRes.data);
      } catch (err) {
        console.error('[AdminDashboard] Load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const totalSensors = sensors.length || 5;
  const onlineSensors = sensors.filter(s => (s.status || '').toLowerCase() === 'online').length || 4;
  const offlineSensors = totalSensors - onlineSensors;
  const activeAlerts = alerts.filter(a => !a.isAcknowledged).length || alerts.length;
  const totalEvents = events.length || 6;
  const totalUsers = users.length || 4;

  const activities = [
    { id: 1, time: '10:42:15', text: 'Station INS-001 (Bengaluru) telemetry verified at 20 Hz rate', type: 'info' },
    { id: 2, time: '10:39:04', text: 'Infrasound anomaly auto-classified: EVT-9821 as EXPLOSION (ΔP: 18.4 Pa)', type: 'warning' },
    { id: 3, time: '10:15:22', text: 'Hardware heartbeat timeout on INS-003 (New Delhi)', type: 'critical' },
    { id: 4, time: '09:55:00', text: 'Daily baseline calibration completed across 4 active nodes', type: 'info' },
    { id: 5, time: '09:20:11', text: 'Operator session authenticated: Priya Sharma (user@infrasound.org)', type: 'info' }
  ];

  const sensorColumns = [
    {
      header: 'Station ID',
      accessor: 'sensorId',
      render: (row) => (
        <span style={{ fontWeight: '700', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
          {row.sensorId || row.id}
        </span>
      )
    },
    {
      header: 'Station Name & Location',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.name}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            {row.location?.name || row.location || 'India'}
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Sampling Rate',
      accessor: 'samplingRateHz',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--text-primary)' }}>
          {row.samplingRateHz || 20} Hz
        </span>
      )
    },
    {
      header: 'Hardware Health',
      accessor: 'health',
      render: (row) => {
        const isOffline = (row.status || '').toLowerCase() === 'offline';
        return (
          <span style={{ fontWeight: '600', color: isOffline ? 'var(--status-critical)' : 'var(--status-normal)' }}>
            {row.health || (isOffline ? 'Unreachable' : 'Optimal (98%)')}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <Link
          to="/admin/sensors"
          style={{
            color: 'var(--color-primary)',
            fontSize: '0.78rem',
            fontWeight: '600',
            textDecoration: 'none',
            padding: '4px 10px',
            borderRadius: '4px',
            backgroundColor: 'var(--color-primary-subtle)'
          }}
        >
          Calibrate
        </Link>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Title & Top Context Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{
            fontSize: '1.65rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '-0.025em',
            lineHeight: 1.2
          }}>
            Network Operations Center (NOC)
          </h1>
          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            marginTop: '4px'
          }}>
            Global administrative supervision of all regional infrasound sensor arrays, telemetry feeds, and accounts
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.84rem',
            color: 'var(--text-secondary)',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-normal)' }} />
            <span>Overall Network Health: <strong style={{ color: 'var(--status-normal)' }}>80% Operational</strong></span>
          </div>

          <Link to="/admin/settings" className="btn btn-secondary" style={{ padding: '8px 14px' }}>
            <Sliders size={15} /> Prototype Settings
          </Link>
        </div>
      </div>

      {/* 1. 6 KPI Summary Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px'
      }}>
        {/* Card 1: Total Sensors */}
        <div className="white-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Sensors
            </span>
            <Radio size={16} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
            {totalSensors}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Regional monitoring array
          </div>
        </div>

        {/* Card 2: Online Sensors */}
        <div className="white-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Online Sensors
            </span>
            <CheckCircle2 size={16} color="var(--status-normal)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--status-normal)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
            {onlineSensors}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--status-normal)', marginTop: '4px', fontWeight: '500' }}>
            Active 20 Hz streaming
          </div>
        </div>

        {/* Card 3: Offline Sensors */}
        <div className="white-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Offline Sensors
            </span>
            <XCircle size={16} color="var(--status-critical)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--status-critical)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
            {offlineSensors}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--status-critical)', marginTop: '4px', fontWeight: '500' }}>
            INS-003 unreachable
          </div>
        </div>

        {/* Card 4: Active Alerts */}
        <div className="white-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Alerts
            </span>
            <Bell size={16} color="var(--status-warning)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--status-warning)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
            {activeAlerts}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--status-warning)', marginTop: '4px', fontWeight: '500' }}>
            Requires operator review
          </div>
        </div>

        {/* Card 5: Total Events */}
        <div className="white-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Events
            </span>
            <Activity size={16} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
            {totalEvents}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Detections recorded
          </div>
        </div>

        {/* Card 6: Total Users */}
        <div className="white-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Users
            </span>
            <Users size={16} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
            {totalUsers}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Authorized operators
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="white-card" style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          Direct Administrative Operations:
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/admin/sensors" className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
            <Radio size={14} color="var(--color-primary)" /> Manage Sensors
          </Link>
          <Link to="/admin/alerts" className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
            <Bell size={14} color="var(--status-warning)" /> View Alert Queue
          </Link>
          <Link to="/admin/events" className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
            <Activity size={14} color="var(--color-primary)" /> Audit Acoustic Events
          </Link>
          <Link to="/admin/users" className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
            <Users size={14} color="var(--color-primary)" /> Manage User Access
          </Link>
          <Link to="/admin/reports" className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
            <FileText size={14} color="var(--text-secondary)" /> System Reports
          </Link>
        </div>
      </div>

      {/* 2. Sensor Network Topology & System Activity (Split Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Sensor Network Visualization */}
        <div className="white-card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Sensor Network Topology
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Regional monitoring stations across the Indian subcontinent
              </p>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-subtle)', padding: '4px 10px', borderRadius: '4px' }}>
              {sensors.length || 5} Stations Provisioned
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {sensors.map((station) => {
              const isOffline = (station.status || '').toLowerCase() === 'offline';
              return (
                <div
                  key={station.sensorId || station.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isOffline ? 'var(--status-critical-bg)' : 'var(--bg-app)',
                    border: `1px solid ${isOffline ? 'var(--status-critical-border)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: '700', color: isOffline ? 'var(--status-critical)' : 'var(--color-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
                      {station.sensorId || station.id}
                    </span>
                    <StatusBadge status={station.status} />
                  </div>

                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {station.name}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {station.location?.name || station.location || 'India'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <span>Rate: {station.samplingRateHz || 20} Hz</span>
                    <span>Battery: {station.battery || '98%'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Activity Feed */}
        <div className="white-card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                System Activity Feed
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Chronological operational telemetry events and security audit trail
              </p>
            </div>
            <span style={{ fontSize: '0.76rem', color: 'var(--status-normal)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--status-normal)' }} />
              Live Stream
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activities.map((act) => (
              <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: act.type === 'critical' ? 'var(--status-critical)' : 'var(--text-muted)',
                  paddingTop: '2px',
                  minWidth: '60px'
                }}>
                  {act.time}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.84rem',
                    color: act.type === 'critical' ? 'var(--status-critical)' : 'var(--text-secondary)',
                    fontWeight: act.type === 'critical' ? '600' : '400',
                    lineHeight: '1.4'
                  }}>
                    {act.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Sensor Status Table */}
      <DataTable
        title="Sensor Status Overview"
        subtitle="Operational metrics, sampling frequencies, and hardware diagnostics across all provisioned nodes"
        columns={sensorColumns}
        data={sensors}
      />

    </div>
  );
};
