import React, { useState, useEffect } from 'react';
import { sensorService } from '../../services/sensorService';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Radio, Plus, Edit2, Trash2, CheckCircle, Save, Power, Activity, Settings2 } from 'lucide-react';

export const SensorManagement = () => {
  const [sensors, setSensors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeSensor, setActiveSensor] = useState(null);
  const [notice, setNotice] = useState('');

  // Form states
  const [sensorId, setSensorId] = useState('');
  const [name, setName] = useState('');
  const [locName, setLocName] = useState('');
  const [samplingRateHz, setSamplingRateHz] = useState(20);
  const [triggerRatio, setTriggerRatio] = useState(3.5);
  const [staWindowSec, setStaWindowSec] = useState(2);
  const [ltaWindowSec, setLtaWindowSec] = useState(20);
  const [maxPressurePa, setMaxPressurePa] = useState(15.0);

  const fetchSensors = async () => {
    try {
      const res = await sensorService.getAll();
      if (res.data) setSensors(res.data);
    } catch (err) {
      console.error('[SensorManagement] Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await sensorService.create({
        sensorId,
        name,
        location: { name: locName },
        samplingRateHz: Number(samplingRateHz),
        thresholds: {
          triggerRatio: Number(triggerRatio),
          staWindowSec: Number(staWindowSec),
          ltaWindowSec: Number(ltaWindowSec),
          maxPressurePa: Number(maxPressurePa)
        }
      });
      setNotice(`Sensor ${sensorId} registered successfully in the network!`);
      setShowAddModal(false);
      resetForm();
      fetchSensors();
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!activeSensor) return;
    const sId = activeSensor.sensorId || activeSensor.id;
    try {
      await sensorService.update(sId, {
        name,
        location: { name: locName },
        samplingRateHz: Number(samplingRateHz),
        thresholds: {
          triggerRatio: Number(triggerRatio),
          staWindowSec: Number(staWindowSec),
          ltaWindowSec: Number(ltaWindowSec),
          maxPressurePa: Number(maxPressurePa)
        }
      });
      setNotice(`Station ${sId} calibration parameters updated!`);
      setShowEditModal(false);
      fetchSensors();
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleToggleActive = (sensor) => {
    const sId = sensor.sensorId || sensor.id;
    const newStatus = (sensor.status || '').toLowerCase() === 'online' ? 'Offline' : 'Online';
    setSensors(prev => prev.map(s => {
      if ((s.sensorId || s.id) === sId) {
        return { ...s, status: newStatus };
      }
      return s;
    }));
    setNotice(`Station ${sId} status switched to ${newStatus}.`);
    setTimeout(() => setNotice(''), 3500);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to decommission and remove station ${id}?`)) return;
    try {
      await sensorService.delete(id);
      setNotice(`Station ${id} successfully removed.`);
      fetchSensors();
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      console.error('[SensorManagement] Delete error:', err);
    }
  };

  const openEdit = (sensor) => {
    setActiveSensor(sensor);
    setName(sensor.name || '');
    setLocName(sensor.location?.name || sensor.location || '');
    setSamplingRateHz(sensor.samplingRateHz || 20);
    setTriggerRatio(sensor.thresholds?.triggerRatio || 3.5);
    setStaWindowSec(sensor.thresholds?.staWindowSec || 2);
    setLtaWindowSec(sensor.thresholds?.ltaWindowSec || 20);
    setMaxPressurePa(sensor.thresholds?.maxPressurePa || 15.0);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setSensorId('');
    setName('');
    setLocName('');
    setSamplingRateHz(20);
    setTriggerRatio(3.5);
    setStaWindowSec(2);
    setLtaWindowSec(20);
    setMaxPressurePa(15.0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{
            fontSize: '1.65rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '-0.025em',
            lineHeight: 1.2
          }}>
            Sensor Station Network Management
          </h1>
          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            marginTop: '4px'
          }}>
            Provision ESP32 microcontrollers, calibrate STA/LTA acoustic triggers, and manage regional nodes
          </p>
        </div>

        <button onClick={() => { resetForm(); setShowAddModal(true); }} className="btn btn-primary" style={{ padding: '9px 18px' }}>
          <Plus size={16} /> Register New Station
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

      {/* Main Sensor Registry Table Card */}
      <div className="white-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Provisioned Infrasound Stations
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Real-time connectivity status, ping frequencies, and detector calibration
            </p>
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-subtle)', padding: '4px 10px', borderRadius: '4px' }}>
            {sensors.length} Stations Active
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ height: '40px', borderBottom: '1px solid var(--border-divider)' }}>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Station ID</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Station Name</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Location</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Sampling Rate</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>STA/LTA Config</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Battery / Power</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.74rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sensors.map((s) => {
                const sId = s.sensorId || s.id;
                const isOnline = (s.status || '').toLowerCase() === 'online';
                return (
                  <tr key={sId} style={{ height: '54px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-primary)' }}>
                      {sId}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {s.name}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                      {s.location?.name || s.location || 'Regional Array'}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                      {s.samplingRateHz || 20} Hz
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--status-warning)', fontWeight: '600' }}>
                      Ratio ≥ {s.thresholds?.triggerRatio || 3.5} ({s.thresholds?.staWindowSec || 2}s/{s.thresholds?.ltaWindowSec || 20}s)
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {s.battery || '98% (Mains)'}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <StatusBadge status={s.status} />
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleToggleActive(s)}
                          className="btn btn-secondary"
                          style={{ padding: '5px 8px', fontSize: '0.74rem' }}
                          title={isOnline ? 'Deactivate Sensor' : 'Activate Sensor'}
                        >
                          <Power size={13} color={isOnline ? 'var(--status-warning)' : 'var(--status-normal)'} />
                        </button>
                        <button
                          onClick={() => openEdit(s)}
                          className="btn btn-secondary"
                          style={{ padding: '5px 8px', fontSize: '0.74rem' }}
                          title="Calibrate Thresholds"
                        >
                          <Settings2 size={13} color="var(--color-primary)" />
                        </button>
                        <button
                          onClick={() => handleDelete(sId)}
                          className="btn btn-secondary"
                          style={{ padding: '5px 8px', fontSize: '0.74rem', color: 'var(--status-critical)' }}
                          title="Decommission Station"
                        >
                          <Trash2 size={13} />
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

      {/* Add / Register Sensor Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Infrasound Station"
        subtitle="Provision a new ESP32 barometric monitoring station into the network"
        maxWidth="560px"
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>STATION / SENSOR ID (e.g. ESP32-INFRA-06)</label>
            <input
              type="text"
              className="form-input"
              value={sensorId}
              onChange={(e) => setSensorId(e.target.value)}
              placeholder="ESP32-INFRA-06"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>STATION DISPLAY NAME</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chennai Coastal Observatory"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>GEOGRAPHIC REGION</label>
              <input
                type="text"
                className="form-input"
                value={locName}
                onChange={(e) => setLocName(e.target.value)}
                placeholder="e.g. Tamil Nadu, India"
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>SAMPLING RATE (HZ)</label>
              <input
                type="number"
                className="form-input"
                value={samplingRateHz}
                onChange={(e) => setSamplingRateHz(e.target.value)}
              />
            </div>
          </div>

          {/* STA/LTA Calibration Box */}
          <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--status-warning)', marginBottom: '10px', textTransform: 'uppercase' }}>
              STA/LTA Trigger Thresholds
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">TRIGGER RATIO</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={triggerRatio}
                  onChange={(e) => setTriggerRatio(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">MAX PRESSURE REF (PA)</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={maxPressurePa}
                  onChange={(e) => setMaxPressurePa(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={15} /> Save & Register Station
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit / Calibrate Station Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Calibrate Station: ${activeSensor?.sensorId || activeSensor?.id}`}
        subtitle="Adjust sampling parameters, station naming, and acoustic anomaly detection windows"
        maxWidth="560px"
      >
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>STATION DISPLAY NAME</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>GEOGRAPHIC REGION</label>
              <input
                type="text"
                className="form-input"
                value={locName}
                onChange={(e) => setLocName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>SAMPLING RATE (HZ)</label>
              <input
                type="number"
                className="form-input"
                value={samplingRateHz}
                onChange={(e) => setSamplingRateHz(e.target.value)}
              />
            </div>
          </div>

          {/* STA/LTA Threshold Calibration Section */}
          <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--status-warning)', marginBottom: '10px', textTransform: 'uppercase' }}>
              STA/LTA Signal Trigger Calibration
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">TRIGGER RATIO (STA/LTA)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={triggerRatio}
                  onChange={(e) => setTriggerRatio(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">MAX PRESSURE REF (PA)</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={maxPressurePa}
                  onChange={(e) => setMaxPressurePa(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">STA WINDOW (SECONDS)</label>
                <input
                  type="number"
                  className="form-input"
                  value={staWindowSec}
                  onChange={(e) => setStaWindowSec(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">LTA WINDOW (SECONDS)</label>
                <input
                  type="number"
                  className="form-input"
                  value={ltaWindowSec}
                  onChange={(e) => setLtaWindowSec(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={15} /> Apply Calibration
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
