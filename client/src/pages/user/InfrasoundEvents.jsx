import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Drawer } from '../../components/common/Drawer';
import { LiveWaveformChart } from '../../components/charts/LiveWaveformChart';
import { AlertTriangle, Filter, Search, RefreshCw, Calendar, Clock, Activity, Radio } from 'lucide-react';

export const InfrasoundEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classificationFilter, setClassificationFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.getAll({
        classification: classificationFilter || undefined,
        severity: severityFilter || undefined
      });
      if (res.success) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error('[InfrasoundEvents] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [classificationFilter, severityFilter]);

  const columns = [
    {
      header: 'Event ID',
      accessor: 'eventId',
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedEvent(row)}
          style={{
            fontWeight: '700',
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-mono)',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          {row.eventId}
        </button>
      )
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
      header: 'Start Time',
      accessor: 'startTime',
      render: (row) => <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{row.startTime}</span>
    },
    {
      header: 'Duration',
      accessor: 'duration',
      render: (row) => <span style={{ color: 'var(--text-secondary)' }}>{row.duration}</span>
    },
    {
      header: 'Dominant Freq',
      accessor: 'dominantFrequency',
      render: (row) => <span style={{ fontWeight: '600', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>{row.dominantFrequency} Hz</span>
    },
    {
      header: 'Peak Amplitude',
      accessor: 'peakAmplitude',
      render: (row) => <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{row.peakAmplitude} Pa</span>
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
        <span style={{
          fontSize: '0.719rem',
          fontWeight: '700',
          color: row.status === 'VERIFIED' ? 'var(--status-normal)' : row.status === 'PENDING_REVIEW' ? 'var(--status-warning)' : 'var(--status-critical)',
          backgroundColor: row.status === 'VERIFIED' ? 'var(--status-normal-bg)' : row.status === 'PENDING_REVIEW' ? 'var(--status-warning-bg)' : 'var(--status-critical-bg)',
          border: `1px solid ${row.status === 'VERIFIED' ? 'var(--status-normal-border)' : row.status === 'PENDING_REVIEW' ? 'var(--status-warning-border)' : 'var(--status-critical-border)'}`,
          padding: '2px 8px',
          borderRadius: '4px'
        }}>
          {row.status}
        </span>
      )
    }
  ];

  const filteredEvents = events.filter(e =>
    !searchTerm ||
    e.eventId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.classification && e.classification.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <AlertTriangle size={28} color="var(--color-primary)" />
            Infrasound Event Catalog & Transient Archive
          </h1>
          <p className="page-subtitle">
            Anomalous low-frequency wave packets detected by automated Short-Term/Long-Term Average energy algorithms
          </p>
        </div>

        <button
          onClick={fetchEvents}
          className="btn btn-secondary"
          style={{ padding: '8px 14px' }}
        >
          <RefreshCw size={15} /> Refresh Catalog
        </button>
      </div>

      {/* Filter Bar Card */}
      <div className="white-card" style={{ padding: '22px 28px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          alignItems: 'flex-end'
        }}>
          {/* Classification Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Classification
            </label>
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
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
              <option value="">All Classifications</option>
              <option value="ATMOSPHERIC_VORTEX">Atmospheric Vortex / Gust</option>
              <option value="SEISMIC_ACOUSTIC">Seismic Acoustic Wave</option>
              <option value="MICROBAROM">Marine Microbarom</option>
              <option value="SUPERSONIC_SHOCKWAVE">Aerospace Shockwave</option>
              <option value="INDUSTRIAL_NOISE">Industrial Acoustic Noise</option>
            </select>
          </div>

          {/* Severity Filter */}
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
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Search Event Catalog
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-light)' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Event ID, Station, Classification..."
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

      {/* Events Table */}
      <div className="white-card" style={{ padding: '24px 28px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Detected Infrasound Transients ({filteredEvents.length})
          </h3>
          <p style={{ fontSize: '0.781rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Click any Event ID to inspect the full waveform snapshot, spectral distribution, and sensor diagnostics
          </p>
        </div>

        <DataTable
          columns={columns}
          data={filteredEvents}
          pageSize={8}
        />
      </div>

      {/* Event Detail Drawer */}
      {selectedEvent && (
        <Drawer
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={`Event Inspection: ${selectedEvent.eventId}`}
          subtitle={`${selectedEvent.station} · ${selectedEvent.sensorName}`}
          footer={
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="btn btn-secondary"
            >
              Close Inspector
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Metric KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.719rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Peak Amplitude</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {selectedEvent.peakAmplitude} Pa
                </div>
              </div>
              <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.719rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dominant Frequency</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-primary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {selectedEvent.dominantFrequency} Hz
                </div>
              </div>
              <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.719rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duration</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {selectedEvent.duration}
                </div>
              </div>
            </div>

            {/* Event Waveform Snapshot */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Waveform Transient Signature
              </h4>
              <div style={{ padding: '14px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                <LiveWaveformChart
                  data={selectedEvent.waveformSnapshot || []}
                  height={190}
                  upperThreshold={0.35}
                  lowerThreshold={-0.35}
                />
              </div>
            </div>

            {/* Timeline & Energy Metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.844rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-divider)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Start Timestamp</span>
                <span style={{ fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{selectedEvent.startTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-divider)' }}>
                <span style={{ color: 'var(--text-muted)' }}>End Timestamp</span>
                <span style={{ fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{selectedEvent.endTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-divider)' }}>
                <span style={{ color: 'var(--text-muted)' }}>STA/LTA Energy Peak</span>
                <span style={{ fontWeight: '700', color: 'var(--status-critical)', fontFamily: 'var(--font-mono)' }}>
                  {selectedEvent.staLtaRatio} (Calibrated Trigger: {selectedEvent.thresholdRatio})
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-divider)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Classification</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{selectedEvent.classification}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-divider)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Scientific Status</span>
                <StatusBadge status={selectedEvent.status} />
              </div>
            </div>

            {/* Analyst Review Notes */}
            <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase' }}>
                Scientific Observation Notes
              </div>
              <p style={{ fontSize: '0.844rem', color: '#1e3a8a', marginTop: '6px', lineHeight: 1.5 }}>
                {selectedEvent.analystNotes || 'Automated STA/LTA acoustic anomaly signature logged.'}
              </p>
            </div>

          </div>
        </Drawer>
      )}

    </div>
  );
};
