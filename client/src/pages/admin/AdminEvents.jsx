import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Drawer } from '../../components/common/Drawer';
import {
  AlertTriangle,
  Edit,
  Save,
  Download,
  Search,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  Activity,
  Layers,
  Clock,
  Eye
} from 'lucide-react';

export const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [stationFilter, setStationFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState('');

  // Audit state
  const [status, setStatus] = useState('DETECTED');
  const [classification, setClassification] = useState('UNCLASSIFIED');
  const [notes, setNotes] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await eventService.getAll();
      if (res.data) setEvents(res.data);
    } catch (err) {
      console.error('[AdminEvents] Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAudit = (evt) => {
    setSelectedEvent(evt);
    setStatus(evt.status || 'DETECTED');
    setClassification(evt.classification || 'UNCLASSIFIED');
    setNotes(evt.notes || evt.analystNotes || '');
  };

  const handleAuditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;
    const eId = selectedEvent.eventId || selectedEvent.id;
    try {
      await eventService.updateStatus(eId, {
        status,
        classification,
        notes
      });
      setNotice(`Event ${eId} scientific verification saved!`);
      setSelectedEvent(null);
      fetchEvents();
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      console.error('[AdminEvents] Audit save error:', err);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Event ID', 'Station', 'Timestamp', 'Peak Amplitude (Pa)', 'Dominant Freq (Hz)', 'Classification', 'Severity', 'Status', 'Notes'];
    const rows = filteredEvents.map(e => [
      e.eventId || e.id,
      e.sensorId || e.station,
      e.startTime || e.time,
      e.peakAmplitudePa || e.amplitude,
      e.dominantFrequencyHz || e.frequency,
      e.classification,
      e.severity,
      e.status,
      `"${(e.notes || e.analystNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `infrasound_events_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEvents = events.filter((evt) => {
    const sId = evt.sensorId || evt.station || '';
    const matchesStation = !stationFilter || sId.toLowerCase().includes(stationFilter.toLowerCase());
    const matchesClass = !classFilter || (evt.classification || '').toLowerCase() === classFilter.toLowerCase();
    const matchesSeverity = !severityFilter || (evt.severity || '').toLowerCase() === severityFilter.toLowerCase();
    const matchesSearch =
      (evt.eventId || evt.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      sId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStation && matchesClass && matchesSeverity && matchesSearch;
  });

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
            Infrasound Event Audit & Verification Console
          </h1>
          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            marginTop: '4px'
          }}>
            Scientific verification, classification review, false-positive filtering, and acoustic forensics
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn btn-secondary" style={{ padding: '9px 18px' }}>
          <Download size={15} /> Export Audit CSV
        </button>
      </div>

      {notice && (
        <div style={{
          padding: '12px 18px',
          background: 'var(--status-normal-bg)',
          border: '1px solid var(--status-normal-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--status-normal)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          fontWeight: '600'
        }}>
          <CheckCircle size={18} /> {notice}
        </div>
      )}

      {/* Filter Bar */}
      <div className="white-card" style={{ padding: '16px 22px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search event ID, sensor, or description..."
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
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          style={{ width: '160px', fontSize: '0.82rem' }}
        >
          <option value="">All Classifications</option>
          <option value="EXPLOSION">Explosion</option>
          <option value="SEISMIC">Seismic</option>
          <option value="SEVERE_WEATHER">Severe Weather</option>
          <option value="VOLCANIC">Volcanic</option>
          <option value="EQUIPMENT_NOISE">Equipment Noise</option>
        </select>

        <select
          className="form-select"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          style={{ width: '140px', fontSize: '0.82rem' }}
        >
          <option value="">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Events Registry Table Card */}
      <div className="white-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Scientific Event Registry
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Showing {filteredEvents.length} events logged across sensor network
            </p>
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-subtle)', padding: '4px 10px', borderRadius: '4px' }}>
            {filteredEvents.length} Records
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ height: '40px', borderBottom: '1px solid var(--border-divider)' }}>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Event ID</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Station</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Timestamp</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Peak ΔP</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Dominant Freq</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Classification</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Verification Status</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((evt) => {
                const eId = evt.eventId || evt.id;
                const peakAmp = evt.peakAmplitudePa || evt.amplitude || 0;
                const freq = evt.dominantFrequencyHz || evt.frequency || 0;
                const timeStr = evt.startTime || evt.time || 'Recent';

                return (
                  <tr key={eId} style={{ height: '54px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-primary)' }}>
                      {eId}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {evt.sensorId || evt.station}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {timeStr}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: peakAmp > 10 ? 'var(--status-critical)' : 'var(--text-primary)' }}>
                      {peakAmp} Pa
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {freq} Hz
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                        {evt.classification}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <StatusBadge status={evt.status} />
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => openAudit(evt)}
                        className="btn btn-primary"
                        style={{ padding: '5px 12px', fontSize: '0.76rem' }}
                      >
                        <Edit size={12} /> Audit & Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-in Detail & Audit Drawer */}
      <Drawer
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={`Event Audit: ${selectedEvent?.eventId || selectedEvent?.id}`}
        subtitle={`Station: ${selectedEvent?.sensorId || selectedEvent?.station} · Recorded: ${selectedEvent?.startTime || selectedEvent?.time}`}
        width="560px"
      >
        {selectedEvent && (
          <form onSubmit={handleAuditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Waveform Snapshot Visualizer */}
            <div style={{
              padding: '16px',
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              border: '1px solid #1e293b',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '10px' }}>
                <span>ACOUSTIC WAVEFORM SNAPSHOT (TRANSIENT PROFILE)</span>
                <span style={{ color: 'var(--color-primary-light)', fontFamily: 'var(--font-mono)' }}>
                  ΔP: {selectedEvent.peakAmplitudePa || selectedEvent.amplitude} Pa · {selectedEvent.dominantFrequencyHz || selectedEvent.frequency} Hz
                </span>
              </div>
              <div style={{ height: '90px', width: '100%', position: 'relative' }}>
                <svg width="100%" height="90" viewBox="0 0 500 90" preserveAspectRatio="none">
                  <line x1="0" y1="45" x2="500" y2="45" stroke="#334155" strokeDasharray="4 4" />
                  <path
                    d="M 0 45 Q 40 45, 80 43 Q 120 48, 160 44 Q 200 45, 220 20 Q 240 78, 260 10 Q 280 72, 300 25 Q 320 60, 350 40 Q 380 48, 420 44 L 500 45"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                <span>T - 15s</span>
                <span>Peak Trigger</span>
                <span>T + 15s</span>
              </div>
            </div>

            {/* Event Scientific Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>DURATION</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {selectedEvent.durationSeconds || '14.2'} s
                </div>
              </div>

              <div style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>STA/LTA RATIO</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--status-warning)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {selectedEvent.staLtaRatio || '5.8'}
                </div>
              </div>

              <div style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>SEVERITY LEVEL</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--status-critical)', marginTop: '2px' }}>
                  {selectedEvent.severity || 'HIGH'}
                </div>
              </div>
            </div>

            {/* Audit Form Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>VERIFICATION AUDIT STATUS</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="DETECTED">DETECTED (Unverified)</option>
                  <option value="VERIFIED">VERIFIED (Confirmed Acoustic Transient)</option>
                  <option value="FALSE_POSITIVE">FALSE_POSITIVE (Atmospheric Noise / Wind)</option>
                  <option value="RESOLVED">RESOLVED (Audit Closed)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>ACOUSTIC CLASSIFICATION</label>
                <select
                  className="form-select"
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                >
                  <option value="UNCLASSIFIED">UNCLASSIFIED</option>
                  <option value="EXPLOSION">EXPLOSION (Blast / Transient Shockwave)</option>
                  <option value="SEISMIC">SEISMIC (Earthquake / Ground-coupled Infrasound)</option>
                  <option value="SEVERE_WEATHER">SEVERE_WEATHER (Storm Front / Atmospheric Vortex)</option>
                  <option value="VOLCANIC">VOLCANIC (Eruption Plume Acoustic)</option>
                  <option value="EQUIPMENT_NOISE">EQUIPMENT_NOISE (Local Artifact)</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>ANALYST SCIENTIFIC VERIFICATION NOTES</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Document multi-station triangulation findings, geological cross-checks, or signature rationale..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={() => setSelectedEvent(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Save size={15} /> Save Scientific Audit
              </button>
            </div>

          </form>
        )}
      </Drawer>

    </div>
  );
};
