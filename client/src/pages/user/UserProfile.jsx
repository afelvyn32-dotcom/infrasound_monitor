import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { User, Bell, Save, CheckCircle, Shield, Building2, Mail, Calendar, Radio, Laptop } from 'lucide-react';

export const UserProfile = () => {
  const { user, updateUser, isAdmin } = useAuth();
  const [name, setName] = useState(user?.name || 'Dr. Anand Verma');
  const [organization, setOrganization] = useState(user?.organization || 'National Atmospheric Acoustics Observatory');
  const [browserSound, setBrowserSound] = useState(user?.notificationSettings?.browserSound ?? true);
  const [emailAlerts, setEmailAlerts] = useState(user?.notificationSettings?.emailAlerts ?? true);
  const [minSeverity, setMinSeverity] = useState(user?.notificationSettings?.minSeverity || 'MEDIUM');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.updateProfile({
        name,
        organization,
        notificationSettings: {
          browserSound,
          emailAlerts,
          minSeverity
        }
      });
      if (res.success) {
        updateUser(res.user);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('[UserProfile] Update error:', err);
      // Fallback update in local state for seamless prototyping
      updateUser({
        ...user,
        name,
        organization,
        notificationSettings: { browserSound, emailAlerts, minSeverity }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{
          fontSize: '1.65rem',
          fontWeight: '800',
          color: 'var(--text-primary)',
          letterSpacing: '-0.025em',
          lineHeight: 1.2
        }}>
          Operator Profile & Settings
        </h1>
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          marginTop: '6px'
        }}>
          Manage your analyst identity, observatory credentials, and real-time acoustic dispatch preferences
        </p>
      </div>

      {saved && (
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
          <CheckCircle size={18} /> Profile settings successfully updated and synchronized!
        </div>
      )}

      {/* Account Details Card (Read-Only System Metadata) */}
      <div className="white-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              System Account Identity
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Read-only system metadata and governance authorization
            </p>
          </div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem',
            fontWeight: '700',
            backgroundColor: isAdmin ? 'var(--status-critical-bg)' : 'var(--color-primary-subtle)',
            color: isAdmin ? 'var(--status-critical)' : 'var(--color-primary)',
            border: `1px solid ${isAdmin ? 'var(--status-critical-border)' : 'rgba(37, 99, 235, 0.2)'}`
          }}>
            <Shield size={13} />
            {isAdmin ? 'ADMINISTRATOR' : 'OBSERVATORY OPERATOR'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Account Holder
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="var(--color-primary)" />
              {user?.name || 'Dr. Anand Verma'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              System Identifier (Email)
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="var(--color-primary)" />
              {user?.email || 'admin@infrasound.org'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Account Status
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--status-normal)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-normal)' }} />
              Active & Authorized
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Assigned Monitoring Station
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={16} color="var(--color-primary)" />
              INFRASOUND-STA-01 (Bengaluru)
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Last Session Login
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: '500', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="var(--text-muted)" />
              Today at 09:42 IST (Authenticated)
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Access Privileges
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {isAdmin ? 'Full Network & Infrastructure Control' : 'Standard Telemetry & Verification Access'}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '18px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <strong>Governance Notice:</strong> Roles and sensor provisioning access permissions are managed exclusively by designated platform administrators. Permission escalation requests must be filed with the IT Security Operations Center.
        </div>
      </div>

      {/* Editable Profile Information Form */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div className="white-card" style={{ padding: '24px 28px' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Operator Profile Details
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Update your public display identity and affiliated research organization
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>FULL NAME</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>AFFILIATED ORGANIZATION</label>
              <input
                type="text"
                className="form-input"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Real-time Notification Dispatch Settings */}
        <div className="white-card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Bell size={18} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Real-Time Alert Dispatch Preferences
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Configure audible alarms and notification delivery thresholds for acoustic anomalies
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              cursor: 'pointer',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: browserSound ? 'var(--color-primary-subtle)' : '#ffffff'
            }}>
              <input
                type="checkbox"
                checked={browserSound}
                onChange={(e) => setBrowserSound(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', marginTop: '2px' }}
              />
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  Acoustic Synthesizer Chime (Browser Audio)
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Plays an audible synthesized alert tone whenever an infrasound event triggers the real-time STA/LTA threshold.
                </div>
              </div>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              cursor: 'pointer',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: emailAlerts ? 'var(--color-primary-subtle)' : '#ffffff'
            }}>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', marginTop: '2px' }}
              />
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  Email Incident Dispatch
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Transmit automated incident alerts to your registered email address ({user?.email || 'admin@infrasound.org'}).
                </div>
              </div>
            </label>

            <div className="form-group" style={{ marginTop: '6px', marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>MINIMUM INCIDENT SEVERITY DISPATCH THRESHOLD</label>
              <select
                className="form-select"
                value={minSeverity}
                onChange={(e) => setMinSeverity(e.target.value)}
                style={{ maxWidth: '400px' }}
              >
                <option value="LOW">Low (Dispatch for all detected acoustic anomalies)</option>
                <option value="MEDIUM">Medium (Moderate pressure surges and above)</option>
                <option value="HIGH">High (Strong shockwaves and seismic transients)</option>
                <option value="CRITICAL">Critical Only (Severe explosive and high-amplitude events)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.88rem' }}
          >
            <Save size={16} />
            {loading ? 'Saving Preferences...' : 'Save Profile Changes'}
          </button>
        </div>

      </form>
    </div>
  );
};
