import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { MOCK_SENSORS } from '../../data/mockSensors';
import { Modal } from '../../components/common/Modal';
import { FileText, Download, Printer, Eye, CheckCircle2, Calendar, Filter, Radio } from 'lucide-react';

export const UserReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedStation, setSelectedStation] = useState('Station A');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-10');
  const [includeEvents, setIncludeEvents] = useState(true);
  const [includeAlerts, setIncludeAlerts] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Active Report View Modal
  const [viewReport, setViewReport] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    reportService.getAll().then(res => {
      if (res.success) setReports(res.data);
    });
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setSuccessMessage('');

    try {
      const res = await reportService.generate({
        title: `Observation Audit: ${selectedStation}`,
        station: selectedStation,
        startDate,
        endDate,
        includeEvents,
        includeAlerts
      });

      if (res.success) {
        setReports(prev => [res.data, ...prev]);
        setSuccessMessage(`Report ${res.data.reportId} generated successfully.`);
        setViewReport(res.data);
      }
    } catch (err) {
      console.error('[UserReports] Error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportCSV = (report) => {
    reportService.downloadCSV(`infrasound_report_${report.reportId || 'export'}.csv`);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileText size={28} color="var(--color-primary)" />
            Infrasound Observatory Reports & Environmental Audits
          </h1>
          <p className="page-subtitle">
            Synthesize atmospheric micro-pressure records, acoustic anomaly statistics, and station health metrics
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div style={{
          padding: '12px 18px',
          backgroundColor: 'var(--status-normal-bg)',
          border: '1px solid var(--status-normal-border)',
          borderRadius: '8px',
          color: 'var(--status-normal)',
          fontSize: '0.844rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Report Generator Configuration Card */}
      <div className="white-card" style={{ padding: '28px 32px' }}>
        <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
          Configure Analytical Report
        </h3>
        <p style={{ fontSize: '0.813rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Select time periods, station parameters, and data layers to compile a standardized scientific report
        </p>

        <form onSubmit={handleGenerate}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {/* Station Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Observatory Station
              </label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
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
                <option value="All Stations">All Stations (Consolidated)</option>
                {MOCK_SENSORS.map(s => (
                  <option key={s.sensorId} value={s.station}>
                    {s.station} ({s.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: '#ffffff',
                  fontSize: '0.844rem',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* End Date */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: '#ffffff',
                  fontSize: '0.844rem',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Data Layer Checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.813rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeEvents}
                  onChange={(e) => setIncludeEvents(e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: 'var(--color-primary)' }}
                />
                <span>Include Infrasound Events Catalog</span>
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.813rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeAlerts}
                  onChange={(e) => setIncludeAlerts(e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: 'var(--color-primary)' }}
                />
                <span>Include Acoustic Threshold Alerts</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="submit"
              disabled={generating}
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.875rem' }}
            >
              {generating ? 'Compiling Report...' : 'Generate Report'}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Reports Archive */}
      <div className="white-card" style={{ padding: '24px 28px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Available Observatory Reports ({reports.length})
          </h3>
          <p style={{ fontSize: '0.781rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            View completed environmental reports, export telemetry tables, or print PDF audits
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {reports.map((rep) => (
            <div
              key={rep.reportId}
              style={{
                padding: '18px 20px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                transition: 'box-shadow var(--transition-fast)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-primary-subtle)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileText size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.938rem', color: 'var(--text-primary)' }}>
                      {rep.title}
                    </span>
                    <span style={{ fontSize: '0.719rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {rep.reportId}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.781rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Period: {rep.period} &middot; Station: {rep.station} &middot; Compiled: {rep.generatedAt}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setViewReport(rep)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.781rem', padding: '6px 12px' }}
                >
                  <Eye size={13} /> View Report
                </button>
                <button
                  type="button"
                  onClick={() => handleExportCSV(rep)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.781rem', padding: '6px 12px' }}
                >
                  <Download size={13} /> Export Data
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report View Modal */}
      {viewReport && (
        <Modal
          isOpen={!!viewReport}
          onClose={() => setViewReport(null)}
          title={viewReport.title}
          subtitle={`Report ID: ${viewReport.reportId} · Period: ${viewReport.period}`}
          maxWidth="700px"
          footer={
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setViewReport(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrintPDF}
                className="btn btn-secondary"
              >
                <Printer size={14} /> Download PDF
              </button>
              <button
                type="button"
                onClick={() => handleExportCSV(viewReport)}
                className="btn btn-primary"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Metadata Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.719rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Average Pressure</span>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {viewReport.avgPressure || '1012.4 hPa'}
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.719rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Events Logged</span>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-primary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {viewReport.eventCount || '14'}
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.719rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Alerts Triggered</span>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--status-warning)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {viewReport.alertCount || '4'}
                </div>
              </div>
            </div>

            {/* Parameter Range Table */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Statistical Measurement Bounds
              </h4>
              <table style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Minimum</th>
                    <th>Average</th>
                    <th>Maximum</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: '600' }}>Atmospheric Pressure</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{viewReport.minPressure || '1011.8 hPa'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{viewReport.avgPressure || '1012.4 hPa'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{viewReport.maxPressure || '1012.9 hPa'}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '600' }}>Core Temperature</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>25.1 °C</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{viewReport.avgTemp || '27.2 °C'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>28.6 °C</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '600' }}>Infrasound Frequency</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>0.1 Hz</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>2.8 Hz</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>18.5 Hz</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Audit Authentication Footnote */}
            <div style={{ padding: '14px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.813rem' }}>
              <div><strong>Auditor:</strong> {viewReport.generatedBy || 'Active Session Analyst'}</div>
              <div><strong>Compilation Timestamp:</strong> {viewReport.generatedAt || new Date().toLocaleString()}</div>
              <div><strong>Network Quality Rating:</strong> {viewReport.dataQuality || '99.8% nominal'}</div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
