import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  History,
  AlertTriangle,
  FileText,
  User,
  Radio,
  Users,
  Sliders,
  LogOut,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ role = 'USER', mobileOpen = false, onCloseMobile }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userNavItems = [
    { label: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { label: 'Live Monitoring', path: '/user/live', icon: Activity },
    { label: 'History', path: '/user/historical', icon: History },
    { label: 'Infrasound Events', path: '/user/events', icon: AlertTriangle },
    { label: 'Alerts', path: '/user/alerts', icon: Radio },
    { label: 'Reports', path: '/user/reports', icon: FileText },
    { label: 'Profile', path: '/user/profile', icon: User }
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Sensor Network', path: '/admin/sensors', icon: Radio },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Infrasound Events', path: '/admin/events', icon: AlertTriangle },
    { label: 'Alerts', path: '/admin/alerts', icon: Activity },
    { label: 'Reports', path: '/admin/reports', icon: FileText },
    { label: 'System Settings', path: '/admin/settings', icon: Sliders },
    { label: 'Profile', path: '/user/profile', icon: User }
  ];

  const items = role === 'ADMIN' ? adminNavItems : userNavItems;

  return (
    <aside className={`app-sidebar ${mobileOpen ? 'open' : ''}`}>
      {/* 1. Top Brand Logo Header (Fixed 72px) */}
      <div className="sidebar-brand-header">
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          onClick={onCloseMobile}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.12)',
            flexShrink: 0
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{
              fontSize: '0.94rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              letterSpacing: '0.06em'
            }}>
              INFRASOUND
            </span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              color: 'var(--color-primary)',
              letterSpacing: '0.2em'
            }}>
              MONITOR
            </span>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="sidebar-mobile-close-btn"
          title="Close Navigation Menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* 2. Middle: Scrollable Navigation Links */}
      <div className="sidebar-nav-container">
        {/* Navigation Category Label */}
        <div style={{
          padding: '0 10px 14px',
          fontSize: '0.688rem',
          fontWeight: '700',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em'
        }}>
          {role === 'ADMIN' ? 'Network Administration' : 'Monitoring Navigation'}
        </div>

        {/* Navigation Item Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                  transition: 'all var(--transition-fast)'
                })}
              >
                <Icon size={18} strokeWidth={2} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* 3. Bottom: Operator Session Info & Sign Out (Fixed footer) */}
      <div className="sidebar-footer">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 10px',
          backgroundColor: '#f8fafc',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '10px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.813rem',
            border: '1px solid var(--color-primary-border)',
            flexShrink: 0
          }}>
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OP'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontSize: '0.813rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.name || 'Operator'}
            </div>
            <div style={{
              fontSize: '0.688rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {role === 'ADMIN' ? (
                <>
                  <ShieldCheck size={11} color="var(--status-critical)" />
                  <span style={{ color: 'var(--status-critical)', fontWeight: '600' }}>Admin Console</span>
                </>
              ) : (
                <span>Observer Role</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-secondary"
          style={{
            width: '100%',
            padding: '9px',
            color: 'var(--status-critical)',
            borderColor: 'var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.813rem'
          }}
          title="Sign out of the observatory terminal"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
