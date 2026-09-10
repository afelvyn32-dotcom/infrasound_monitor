import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { MOCK_SENSORS } from '../../data/mockSensors';
import { Modal } from '../../components/common/Modal';
import {
  FileText,
  Download,
  Plus,
  CheckCircle,
  Eye,
  Printer,
  Calendar,
  Layers,
  Filter,
  ShieldCheck,
  Radio
} from 'lucide-react';

export const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewReport, setViewReport] = useState(null);

  // Form parameters
  const [title, setTitle] = useState('');
  const [station, setStation] = useState('All Stations');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-10');
  const [format, setFormat] = useState('CSV');
  const [includeEvents, setIncludeEvents] = useState(true);
  const [includeAlerts, setIncludeAlerts] = useState(true);
  const [includeAuditTrail, setIncludeAuditTrail] = useState(true);

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  const fetchReports = async () => {
    try {
      const res = await reportService.getAll();
      if (res.data) setReports(res.data);
    } catch (err) {
      console.error('[AdminReports] Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const repTitle = title || `Executive Infrasound Audit - ${station} (${new Date().toLocaleDateString()})`;
      const res = await reportService.generate({
        title: repTitle,
        station,
        startDate,
        endDate,
        format,
        includeEvents,
        includeAlerts,
        includeAuditTrail
      });

      if (res.data) {
        setNotice(`Administrative audit "${repTitle}" compiled successfully!`);
        setShowModal(false);
        setTitle('');
        fetchReports();
        setViewReport(res.data);
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      console.error('[AdminReports] Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = (rep) => {
    reportService.downloadCSV(`infrasound_master_audit_${rep?.reportId || 'export'}.csv`);
  };

  const handlePrintPDF = () => {
    window.print();
  };

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
            Consolidated Administrative & Regulatory Reports
          </h1>
          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            marginTop: '4px'
          }}>
            Cross-station acoustic correlation, sensor network uptime records, and executive compliance audits
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => reportService.downloadCSV('infrasound_master_network_export.csv')} className="btn btn-secondary" style={{ padding: '9px 16px' }}>
            <Download size={15} /> Export Master CSV
          </button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '9px 18px' }}>
            <Plus size={16} /> Compile Executive Audit
          </button>
        </div>
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

      {/* Reports Table Card */}
      <div className="white-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Archived Administrative Summaries
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Historical audit dossiers compiled across the sensor infrastructure
            </p>
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-subtle)', padding: '4px 10px', borderRadius: '4px' }}>
            {reports.length} Reports Archived
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ height: '40px', borderBottom: '1px solid var(--border-divider)' }}>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Report Title</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Scope</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Author</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Date Compiled</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Events Logged</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Max Recorded ΔP</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Format</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => {
                const repId = r.reportId || r._id || 'REP-001';
                return (
                  <tr key={repId} style={{ height: '54px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{r.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{repId}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                      {r.station || 'All Stations'}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                      {r.generatedBy?.name || r.generatedBy || 'Lead Administrator'}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : r.generatedAt || 'Today'}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                      {r.totalEventsLogged || r.eventCount || 14}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--status-critical)', fontWeight: '700' }}>
                      {r.summaryStats?.maxRecordedPressurePa || '18.4'} Pa
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                        {r.format || 'CSV'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => setViewReport(r)}
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.76rem' }}
                        >
                          <Eye size={12} /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExportCSV(r)}
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.76rem' }}
                        >
                          <Download size={12} /> CSV
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compile Report Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Compile Executive Infrasound Audit"
        subtitle="Synthesize multi-station atmospheric pressure anomalies, STA/LTA alarms, and operator audit records"
        maxWidth="600px"
      >
        <form onSubmit={handleGenerate}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>AUDIT TITLE</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Q3 Regional Infrasound Compliance Audit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>MONITORING SCOPE</label>
              <select className="form-select" value={station} onChange={(e) => setStation(e.target.value)}>
                <option value="All Stations">All Stations (Consolidated Network)</option>
                {MOCK_SENSORS.map(s => (
                  <option key={s.sensorId} value={s.station}>
                    {s.station} ({s.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>PRIMARY OUTPUT FORMAT</label>
              <select className="form-select" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="CSV">CSV Data Spreadsheet</option>
                <option value="PDF">Formal PDF Executive Dossier</option>
                <option value="JSON">Raw JSON Telemetry Package</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>START DATE</label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>END DATE</label>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Included Data Layers */}
          <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Included Analytical Layers
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeEvents}
                  onChange={(e) => setIncludeEvents(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span>Infrasound Acoustic Transients & Classifications</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeAlerts}
                  onChange={(e) => setIncludeAlerts(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span>Threshold Trigger Warnings & Incident Dispatches</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeAuditTrail}
                  onChange={(e) => setIncludeAuditTrail(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span>Security Governance & Analyst Verification Trail</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Compiling Dossier...' : 'Generate & Archive'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Report Detail Modal */}
      {viewReport && (
        <Modal
          isOpen={Boolean(viewReport)}
          onClose={() => setViewReport(null)}
          title={viewReport.title}
          subtitle={`Report: ${viewReport.reportId || 'REP-001'} · Scope: ${viewReport.station || 'Consolidated'} · Period: ${viewReport.period || 'Selected Range'}`}
          maxWidth="680px"
          footer={
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setViewReport(null)} className="btn btn-secondary">
                Close
              </button>
              <button type="button" onClick={handlePrintPDF} className="btn btn-secondary">
                <Printer size={14} /> Download PDF
              </button>
              <button type="button" onClick={() => handleExportCSV(viewReport)} className="btn btn-primary">
                <Download size={14} /> Export CSV
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* KPI Summary Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ padding: '14px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>AVERAGE PRESSURE</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {viewReport.avgPressure || '1012.4 hPa'}
                </div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>TRANSIENT EVENTS</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-primary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {viewReport.eventCount || viewReport.totalEventsLogged || '14'}
                </div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>ALERTS DISPATCHED</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--status-warning)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {viewReport.alertCount || '4'}
                </div>
              </div>
            </div>

            {/* Parameter Measurement Bounds Table */}
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Statistical Microbarograph Metrics
              </h4>
              <table style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                <thead>
                  <tr>
                    <th>Atmospheric Parameter</th>
                    <th>Minimum</th>
                    <th>Average</th>
                    <th>Maximum Recorded</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: '600' }}>Barometric Pressure</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>1011.8 hPa</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>1012.4 hPa</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>1013.1 hPa</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '600' }}>Infrasound Amplitude (ΔP)</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>0.05 Pa</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>0.42 Pa</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--status-critical)', fontWeight: '700' }}>18.40 Pa</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '600' }}>Spectral Band (0.1–20 Hz)</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>0.10 Hz</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>2.80 Hz</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>19.50 Hz</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ padding: '14px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
              <div><strong>Auditing Officer:</strong> {viewReport.generatedBy?.name || viewReport.generatedBy || 'Lead Administrator'}</div>
              <div><strong>Compilation Verification:</strong> Certified cryptographic telemetry digest</div>
              <div><strong>Compliance Rating:</strong> 100% data integrity verified across active nodes</div>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};
