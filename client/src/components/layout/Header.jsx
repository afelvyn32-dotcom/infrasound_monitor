import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../../context/AlertContext';
import { Bell, Search, User, LogOut, ChevronDown, Check, Radio, Menu } from 'lucide-react';
import { MOCK_SENSORS } from '../../data/mockSensors';

export const Header = ({ onSelectStation, onToggleMobileSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const { alerts, unreadCount, acknowledgeAlert } = useAlerts();

  // Active Station selector state
  const [selectedStation, setSelectedStation] = useState(MOCK_SENSORS[0]);
  const [showStationDropdown, setShowStationDropdown] = useState(false);

  // Notifications & User menus
  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStationChange = (st) => {
    setSelectedStation(st);
    setShowStationDropdown(false);
    if (onSelectStation) onSelectStation(st);
  };

  const isOnline = selectedStation.status === 'ONLINE';

  return (
    <header className="app-header">
      {/* Left: Mobile Hamburger, Mobile Logo & Station Context Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="mobile-menu-btn"
          title="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* Mobile Brand Logo (hidden on desktop, visible on mobile <= 768px) */}
        <Link to="/" className="mobile-brand-logo">
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.4" />
              <circle cx="12" cy="12" r="6.5" stroke="#2563eb" strokeWidth="1.4" opacity="0.6" />
              <path
                d="M2 12C4 12 5 8 7 8C9 8 10 16 12 16C14 16 15 6 17 6C19 6 20 12 22 12"
                stroke="#2563eb"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
            INFRASOUND
          </span>
        </Link>

        {/* Selected Station Context Pill with Dropdown */}
        <div className="header-station-pill" style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowStationDropdown(!showStationDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.813rem',
              cursor: 'pointer',
              transition: 'border-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            title="Click to switch observation station"
          >
            <Radio size={15} color="var(--color-primary)" />
            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
              {selectedStation.station}
            </span>
            <span style={{ color: 'var(--text-light)' }}>·</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {selectedStation.location}
            </span>
            <span style={{ color: 'var(--text-light)' }}>·</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: isOnline ? 'var(--status-normal)' : 'var(--status-critical)',
              fontWeight: '600'
            }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: isOnline ? 'var(--status-normal)' : 'var(--status-critical)'
              }} />
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </span>
            <span style={{ color: 'var(--text-light)' }}>·</span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              {selectedStation.lastUpdate}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {/* Station Selection Menu */}
          {showStationDropdown && (
            <div style={{
              position: 'absolute',
              top: '44px',
              left: 0,
              width: '340px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              boxShadow: 'var(--shadow-lg)',
              padding: '8px',
              zIndex: 95
            }}>
              <div style={{
                padding: '8px 10px 6px',
                fontSize: '0.688rem',
                fontWeight: '700',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '1px solid var(--border-divider)'
              }}>
                Select Active Station
              </div>

              <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {MOCK_SENSORS.map((st) => (
                  <button
                    key={st.sensorId}
                    type="button"
                    onClick={() => handleStationChange(st)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      backgroundColor: selectedStation.sensorId === st.sensorId ? 'var(--color-primary-subtle)' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedStation.sensorId !== st.sensorId) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedStation.sensorId !== st.sensorId) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.813rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {st.name}
                      </div>
                      <div style={{ fontSize: '0.719rem', color: 'var(--text-muted)' }}>
                        {st.sensorId} · {st.sensorModel}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.688rem',
                      fontWeight: '700',
                      color: st.status === 'ONLINE' ? 'var(--status-normal)' : 'var(--status-critical)',
                      backgroundColor: st.status === 'ONLINE' ? 'var(--status-normal-bg)' : 'var(--status-critical-bg)',
                      border: `1px solid ${st.status === 'ONLINE' ? 'var(--status-normal-border)' : 'var(--status-critical-border)'}`,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {st.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="header-search-bar" style={{ display: 'flex', alignItems: 'center', width: '280px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-light)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stations, events, sensors..."
            style={{
              width: '100%',
              height: '36px',
              padding: '6px 12px 6px 36px',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              fontSize: '0.813rem',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'all var(--transition-fast)'
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.backgroundColor = '#ffffff'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.backgroundColor = '#f8fafc'; }}
          />
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        
        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowAlertMenu(!showAlertMenu)}
            style={{
              position: 'relative',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
            title="Acoustic Incident Alerts"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--status-critical)'
              }} />
            )}
          </button>

          {showAlertMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '44px',
              width: '320px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              boxShadow: 'var(--shadow-lg)',
              padding: '12px',
              zIndex: 95
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--border-divider)',
                marginBottom: '8px'
              }}>
                <span style={{ fontWeight: '700', fontSize: '0.813rem', color: 'var(--text-primary)' }}>
                  Acoustic Alerts
                </span>
                <Link
                  to={isAdmin ? '/admin/alerts' : '/user/alerts'}
                  onClick={() => setShowAlertMenu(false)}
                  style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: '600' }}
                >
                  View All
                </Link>
              </div>

              <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                {alerts.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    No unacknowledged alerts.
                  </div>
                ) : (
                  alerts.slice(0, 4).map(a => (
                    <div key={a.alertId} style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '6px',
                      fontSize: '0.78rem',
                      backgroundColor: '#fafbfd'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                        <span>{a.sensorId}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {new Date(a.createdAt || Date.now()).toLocaleTimeString()}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{a.title}</div>
                      {!a.isAcknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(a.alertId)}
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--color-primary)',
                            marginTop: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontWeight: '600'
                          }}
                        >
                          <Check size={12} /> Acknowledge
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: '#ffffff'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
          >
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              fontWeight: '700',
              fontSize: '0.781rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--color-primary-border)'
            }}>
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OP'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.813rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.2' }}>
                {user?.name || 'Operator'}
              </div>
              <div style={{ fontSize: '0.688rem', color: 'var(--text-muted)', lineHeight: '1.1' }}>
                {isAdmin ? 'System Admin' : 'Observer'}
              </div>
            </div>
            <ChevronDown size={13} color="var(--text-muted)" />
          </button>

          {showUserMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '44px',
              width: '180px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              boxShadow: 'var(--shadow-lg)',
              padding: '6px',
              zIndex: 95
            }}>
              <Link
                to="/user/profile"
                onClick={() => setShowUserMenu(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '0.813rem',
                  color: 'var(--text-primary)'
                }}
              >
                <User size={14} /> Profile
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '0.813rem',
                  color: 'var(--status-critical)',
                  textAlign: 'left'
                }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
