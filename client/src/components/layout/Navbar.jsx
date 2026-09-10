import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../../context/AlertContext';
import { Activity, Bell, User, LogOut, ChevronDown, Check, Shield } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { alerts, unreadCount, acknowledgeAlert } = useAlerts();
  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [utcTime, setUtcTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setUtcTime(now.toTimeString().split(' ')[0]);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: '48px',
      backgroundColor: '#070b13',
      borderBottom: '1px solid #141d2d',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      userSelect: 'none'
    }}>
      {/* Left: Brand & Station Callsign */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '2px',
            backgroundColor: '#082f49',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <Activity size={13} strokeWidth={2.5} />
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            fontWeight: '700',
            letterSpacing: '0.06em',
            color: '#f8fafc'
          }}>
            INFRASOUND MONITOR
          </span>
          <span style={{
            fontSize: '0.62rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            padding: '1px 5px',
            border: '1px solid #1e293b',
            borderRadius: '2px',
            backgroundColor: '#0b101a'
          }}>
            v2.4-SCI
          </span>
        </div>

        <div style={{ height: '16px', width: '1px', backgroundColor: '#1e293b' }} />

        {/* Current Monitoring Station */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            STATION:
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#0d1422',
            border: '1px solid #1b273d',
            padding: '2px 8px',
            borderRadius: '2px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-cyan)'
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)' }} />
            <span style={{ fontWeight: '600' }}>INS-001</span>
            <span style={{ color: 'var(--text-muted)' }}>[ALPINE-ARRAY]</span>
          </div>
        </div>
      </div>

      {/* Right: Connection Status, Mission Clock & Operator Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* System Link Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#09121c',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '2px 9px',
          borderRadius: '2px',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          color: '#34d399'
        }}>
          <div className="pulse-dot-green" />
          <span style={{ fontWeight: '700' }}>ONLINE</span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ color: 'var(--text-dim)' }}>20 Hz</span>
        </div>

        {/* Live Mission Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.74rem',
          fontFamily: 'var(--font-mono)',
          backgroundColor: '#0b101a',
          padding: '2px 8px',
          borderRadius: '2px',
          border: '1px solid #1e293b'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>UTC:</span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: '600' }}>{utcTime}</span>
        </div>

        {/* Role Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '2px 8px',
          borderRadius: '2px',
          background: isAdmin ? 'rgba(244, 63, 94, 0.15)' : 'rgba(0, 240, 255, 0.1)',
          border: `1px solid ${isAdmin ? 'rgba(244, 63, 94, 0.4)' : 'rgba(0, 240, 255, 0.3)'}`,
          color: isAdmin ? '#fca5a5' : '#7dd3fc',
          fontSize: '0.68rem',
          fontWeight: '700',
          fontFamily: 'var(--font-mono)'
        }}>
          <Shield size={11} />
          <span>{isAdmin ? 'ADMIN' : 'OPERATOR'}</span>
        </div>

        {/* Alerts Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowAlertMenu(!showAlertMenu)}
            style={{
              position: 'relative',
              width: '28px',
              height: '28px',
              borderRadius: '2px',
              background: '#0a0f18',
              border: '1px solid #162032',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)'
            }}
            title="Acoustic Incident Alerts"
          >
            <Bell size={14} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                background: 'var(--status-red)',
                color: '#fff',
                fontSize: '0.6rem',
                fontWeight: '700',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showAlertMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '36px',
              width: '320px',
              background: '#090f19',
              border: '1px solid #1b273d',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              padding: '10px',
              zIndex: 50
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid #162032' }}>
                <span style={{ fontWeight: '700', fontSize: '0.76rem', color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>ACOUSTIC ALERTS</span>
                <Link to={isAdmin ? '/admin/alerts' : '/user/alerts'} onClick={() => setShowAlertMenu(false)} style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  VIEW ALL
                </Link>
              </div>

              <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                {alerts.length === 0 ? (
                  <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.76rem', fontFamily: 'var(--font-mono)' }}>
                    No pending alerts.
                  </div>
                ) : (
                  alerts.slice(0, 4).map(a => (
                    <div key={a.alertId} style={{
                      padding: '8px',
                      background: a.isAcknowledged ? 'transparent' : 'rgba(244, 63, 94, 0.1)',
                      border: `1px solid ${a.isAcknowledged ? '#162032' : 'rgba(244, 63, 94, 0.3)'}`,
                      borderRadius: '2px',
                      marginBottom: '6px',
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontWeight: '600' }}>
                        <span>{a.sensorId}</span>
                        <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                          {new Date(a.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{a.title}</div>
                      {!a.isAcknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(a.alertId)}
                          style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}
                        >
                          <Check size={11} /> Acknowledge
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Operator Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 6px',
              borderRadius: '2px',
              background: '#090e18',
              border: '1px solid #162032',
              color: 'var(--text-main)'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '2px',
              background: '#1e293b',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)'
            }}>
              OP
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
              {user?.name ? user.name.split(' ')[0].toUpperCase() : 'ANALYST'}
            </span>
            <ChevronDown size={11} color="var(--text-muted)" />
          </button>

          {showUserMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '36px',
              width: '160px',
              background: '#090f19',
              border: '1px solid #1b273d',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              padding: '4px',
              zIndex: 50,
              fontFamily: 'var(--font-mono)'
            }}>
              <Link
                to="/user/profile"
                onClick={() => setShowUserMenu(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 8px',
                  borderRadius: '2px',
                  fontSize: '0.74rem',
                  color: 'var(--text-main)'
                }}
              >
                <User size={12} /> Profile
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 8px',
                  borderRadius: '2px',
                  fontSize: '0.74rem',
                  color: '#fb7185',
                  marginTop: '2px'
                }}
              >
                <LogOut size={12} /> Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
