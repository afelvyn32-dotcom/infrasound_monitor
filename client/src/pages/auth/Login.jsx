import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Shield,
  User,
  HelpCircle,
  X,
  CheckCircle2,
  Info,
  Sliders,
  Radio,
  Network
} from 'lucide-react';

/**
 * Infrasound Brand Logo Component
 * Combines a circular atmospheric monitoring symbol with an infrasound wave
 */
export const InfrasoundLogo = ({ size = 40 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      border: '1px solid #bfdbfe',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.12)',
      flexShrink: 0
    }}>
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none">
        {/* Concentric atmospheric pressure rings */}
        <circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.4" />
        <circle cx="12" cy="12" r="6.5" stroke="#2563eb" strokeWidth="1.4" opacity="0.6" />
        {/* Continuous infrasound harmonic wave */}
        <path
          d="M2 12C4 12 5 8 7 8C9 8 10 16 12 16C14 16 15 6 17 6C19 6 20 12 22 12"
          stroke="#2563eb"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
      <span style={{
        fontSize: '1.05rem',
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: '0.06em',
        fontFamily: 'var(--font-sans)'
      }}>
        INFRASOUND
      </span>
      <span style={{
        fontSize: '0.78rem',
        fontWeight: '700',
        color: '#2563eb',
        letterSpacing: '0.22em',
        fontFamily: 'var(--font-sans)'
      }}>
        MONITOR
      </span>
    </div>
  </div>
);

/**
 * Clean scientific atmospheric monitoring station & microbarometer illustration
 * Blends subtly into the white/light-blue background
 */
const AtmosphericObservatoryIllustration = () => (
  <div style={{
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '18px 22px',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
    marginTop: '24px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          fontSize: '0.7rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: '700',
          color: '#475569',
          letterSpacing: '0.05em'
        }}>
          MICROBAROMETER OBSERVATORY // ARRAY TELEMETRY
        </span>
        <span style={{
          fontSize: '0.625rem',
          fontFamily: 'var(--font-mono)',
          color: '#64748b',
          backgroundColor: '#f1f5f9',
          padding: '1px 6px',
          borderRadius: '3px'
        }}>
          0.1 – 20.0 Hz BAND
        </span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '0.688rem',
        color: '#16a34a',
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        padding: '2px 8px',
        borderRadius: '4px',
        fontWeight: '600'
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
        STA/LTA CALIBRATED
      </div>
    </div>

    {/* Technical SVG schematic */}
    <div style={{ position: 'relative', width: '100%', height: '135px', overflow: 'hidden' }}>
      <svg width="100%" height="100%" viewBox="0 0 640 135" preserveAspectRatio="none" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="waveFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* Faint technical coordinate grid */}
        <line x1="0" y1="20" x2="640" y2="20" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="0" y1="67" x2="640" y2="67" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="0" y1="115" x2="640" y2="115" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="160" y1="0" x2="160" y2="135" stroke="#f8fafc" strokeWidth="1" />
        <line x1="320" y1="0" x2="320" y2="135" stroke="#f8fafc" strokeWidth="1" />
        <line x1="480" y1="0" x2="480" y2="135" stroke="#f8fafc" strokeWidth="1" />

        {/* Transducer Station Mast (Left Vector) */}
        <g transform="translate(40, 15)">
          {/* Base */}
          <rect x="18" y="95" width="24" height="4" fill="#94a3b8" rx="1" />
          {/* Mast struts */}
          <line x1="22" y1="95" x2="28" y2="30" stroke="#64748b" strokeWidth="2" />
          <line x1="38" y1="95" x2="32" y2="30" stroke="#64748b" strokeWidth="2" />
          <line x1="24" y1="75" x2="36" y2="75" stroke="#94a3b8" strokeWidth="1.2" />
          <line x1="26" y1="55" x2="34" y2="55" stroke="#94a3b8" strokeWidth="1.2" />
          <line x1="28" y1="35" x2="32" y2="35" stroke="#94a3b8" strokeWidth="1.2" />
          {/* Mast center shaft */}
          <line x1="30" y1="95" x2="30" y2="22" stroke="#2563eb" strokeWidth="1.8" />
          {/* Sensor Port Dome */}
          <circle cx="30" cy="20" r="8" fill="#eff6ff" stroke="#2563eb" strokeWidth="2" />
          <circle cx="30" cy="20" r="3" fill="#2563eb" />
          {/* Propagating Acoustic Radar Rings */}
          <circle cx="30" cy="20" r="16" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="30" cy="20" r="26" stroke="#2563eb" strokeWidth="1" strokeDasharray="2 3" opacity="0.3" />
        </g>

        {/* Secondary Sub-harmonic Wave (Cyan dashed) */}
        <path
          d="M 100,67 C 140,50 180,85 220,67 C 260,48 300,88 340,67 C 380,45 420,85 460,67 C 500,48 540,88 580,67 L 640,67"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.75"
        />

        {/* Primary Infrasonic Waveform (Area Fill) */}
        <path
          d="M 100,67 C 130,28 170,105 210,67 C 250,22 280,112 320,67 C 360,18 390,116 430,67 C 470,25 510,108 550,67 C 580,35 610,95 640,67 L 640,135 L 100,135 Z"
          fill="url(#waveFill)"
        />

        {/* Primary Infrasonic Waveform (Stroke) */}
        <path
          d="M 100,67 C 130,28 170,105 210,67 C 250,22 280,112 320,67 C 360,18 390,116 430,67 C 470,25 510,108 550,67 C 580,35 610,95 640,67"
          fill="none"
          stroke="url(#strokeGradient)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Triangulation telemetry nodes */}
        <circle cx="210" cy="67" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
        <circle cx="320" cy="67" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
        <circle cx="430" cy="67" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
        <circle cx="550" cy="67" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
      </svg>
    </div>

    {/* Metric Footer Sub-labels */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '8px',
      paddingTop: '8px',
      borderTop: '1px solid #f1f5f9',
      fontSize: '0.688rem',
      fontFamily: 'var(--font-mono)',
      color: '#64748b'
    }}>
      <span>STATION: INS-BLR-01</span>
      <span>SENSITIVITY: 50 mV/Pa</span>
      <span>PEAK: 0.42 Pa @ 2.8 Hz</span>
      <span>LATENCY: 42 ms</span>
    </div>
  </div>
);

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Validation & Submit states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Load remembered credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('infrasound_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Form validation logic
  const validate = () => {
    const newErrors = {};

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@infrasound.org).';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validationErrors = validate();
    setErrors(validationErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    setTouched({ email: true, password: true });
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const res = await login(email, password);

      if (rememberMe) {
        localStorage.setItem('infrasound_remember_email', email.trim());
      } else {
        localStorage.removeItem('infrasound_remember_email');
      }

      if (res.success) {
        if (res.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Preset handler
  const handleQuickFill = (role) => {
    if (role === 'ADMIN') {
      setEmail('admin@infrasound.org');
      setPassword('Admin@123');
    } else {
      setEmail('user@infrasound.org');
      setPassword('User@123');
    }
    setErrors({});
    setAuthError('');
  };

  return (
    <div className="login-page-wrapper">
      {/* 2-Column Full-Screen Viewport Container */}
      <div className="login-viewport-container">
        
        {/* ================================================================ */}
        {/* LEFT COLUMN: HERO & SCIENTIFIC IDENTITY (~55% width)            */}
        {/* ================================================================ */}
        <div className="login-hero-container">
          
          {/* Top: Branding Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <InfrasoundLogo size={44} />
              <div style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: '#64748b',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '4px 10px',
                borderRadius: '6px',
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
              }}>
                NETWORK PROTOCOL v2.4
              </div>
            </div>

            <p style={{
              fontSize: '0.85rem',
              color: '#64748b',
              marginTop: '8px',
              fontWeight: '500'
            }}>
              Real-time atmospheric pressure & infrasound monitoring
            </p>
          </div>

          {/* Center: Main Statement & Supporting Text */}
          <div style={{ marginTop: '28px', marginBottom: '20px' }}>
            <h1 style={{
              fontSize: '2.45rem',
              fontWeight: '800',
              color: '#0f172a',
              lineHeight: '1.18',
              letterSpacing: '-0.025em',
              fontFamily: 'var(--font-sans)',
              maxWidth: '620px'
            }}>
              Listening to what the atmosphere can't say.
            </h1>

            <p style={{
              fontSize: '1.03rem',
              color: '#475569',
              lineHeight: '1.6',
              marginTop: '16px',
              maxWidth: '600px'
            }}>
              Monitor atmospheric pressure variations, analyze low-frequency signals, and identify potential infrasound events through a unified monitoring platform.
            </p>

            {/* 4 Compact Scientific Feature Cards (2x2 Grid) */}
            <div className="hero-features-grid">
              
              {/* Feature 1 */}
              <div className="hero-feature-card">
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '6px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Activity size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: '0.781rem', fontWeight: '700', color: '#0f172a', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                    Real-Time Monitoring
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', lineHeight: '1.35' }}>
                    Continuous monitoring of sensor measurements.
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="hero-feature-card">
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '6px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Sliders size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: '0.781rem', fontWeight: '700', color: '#0f172a', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                    Signal Analysis
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', lineHeight: '1.35' }}>
                    Visualize pressure variations and frequency info.
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="hero-feature-card">
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '6px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Radio size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: '0.781rem', fontWeight: '700', color: '#0f172a', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                    Event Detection
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', lineHeight: '1.35' }}>
                    Identify potential abnormal low-frequency events.
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="hero-feature-card">
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '6px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Network size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: '0.781rem', fontWeight: '700', color: '#0f172a', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                    Multi-Station Monitoring
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', lineHeight: '1.35' }}>
                    Monitor connected observation stations.
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Lower: Atmospheric Microbarometer Observatory Vector Visual */}
          <div className="login-hero-visual">
            <AtmosphericObservatoryIllustration />
          </div>

        </div>

        {/* ================================================================ */}
        {/* RIGHT COLUMN: LARGE PROFESSIONAL LOGIN PANEL (~45% width)        */}
        {/* ================================================================ */}
        <div className="login-panel-container">
          <div className="login-panel-card">
            
            <div>
              {/* Header Badge & Title */}
              <div style={{ marginBottom: '22px' }}>
                <span style={{
                  fontSize: '0.719rem',
                  fontWeight: '700',
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  display: 'inline-block'
                }}>
                  WELCOME BACK
                </span>

                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  marginTop: '10px',
                  marginBottom: '4px'
                }}>
                  Sign in to your account
                </h2>

                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b'
                }}>
                  Access the Infrasound Monitoring System
                </p>
              </div>

              {/* Global Error Banner */}
              {authError && (
                <div style={{
                  padding: '12px 14px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#dc2626',
                  marginBottom: '20px',
                  fontSize: '0.813rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  lineHeight: '1.4'
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{authError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} noValidate>
                
                {/* Email Field */}
                <div style={{ marginBottom: '18px' }}>
                  <label
                    htmlFor="login-email"
                    style={{
                      display: 'block',
                      fontSize: '0.813rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '6px'
                    }}
                  >
                    Email Address <span style={{ color: '#dc2626' }}>*</span>
                  </label>

                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      position: 'absolute',
                      left: '14px',
                      color: touched.email && errors.email ? '#dc2626' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none'
                    }}>
                      <Mail size={17} strokeWidth={2} />
                    </div>

                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (touched.email) {
                          setErrors(prev => ({ ...prev, email: '' }));
                        }
                      }}
                      onBlur={() => handleBlur('email')}
                      placeholder="operator@infrasound.org"
                      required
                      autoComplete="email"
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '10px 14px 10px 42px',
                        backgroundColor: '#ffffff',
                        border: `1px solid ${touched.email && errors.email ? '#dc2626' : '#cbd5e1'}`,
                        borderRadius: '8px',
                        color: '#0f172a',
                        fontSize: '0.938rem',
                        outline: 'none',
                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
                      }}
                    />
                  </div>

                  {touched.email && errors.email && (
                    <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '5px', fontWeight: '500' }}>
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div style={{ marginBottom: '18px' }}>
                  <label
                    htmlFor="login-password"
                    style={{
                      display: 'block',
                      fontSize: '0.813rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '6px'
                    }}
                  >
                    Password <span style={{ color: '#dc2626' }}>*</span>
                  </label>

                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      position: 'absolute',
                      left: '14px',
                      color: touched.password && errors.password ? '#dc2626' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none'
                    }}>
                      <Lock size={17} strokeWidth={2} />
                    </div>

                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (touched.password) {
                          setErrors(prev => ({ ...prev, password: '' }));
                        }
                      }}
                      onBlur={() => handleBlur('password')}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '10px 42px 10px 42px',
                        backgroundColor: '#ffffff',
                        border: `1px solid ${touched.password && errors.password ? '#dc2626' : '#cbd5e1'}`,
                        borderRadius: '8px',
                        color: '#0f172a',
                        fontSize: '0.938rem',
                        outline: 'none',
                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                    </button>
                  </div>

                  {touched.password && errors.password && (
                    <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '5px', fontWeight: '500' }}>
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '22px'
                }}>
                  <label
                    htmlFor="remember-session"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      fontSize: '0.813rem',
                      color: '#475569'
                    }}
                  >
                    <input
                      id="remember-session"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#2563eb',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(true);
                      setResetSent(false);
                    }}
                    style={{
                      fontSize: '0.813rem',
                      color: '#2563eb',
                      fontWeight: '600',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Main Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.85 : 1,
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.28)',
                    transition: 'background-color 0.15s ease, transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={18} className="spin" /> Verifying Credentials...
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Sign In <ArrowRight size={17} />
                    </span>
                  )}
                </button>
              </form>

              {/* DEMO ACCESS: Secondary Outlined Cards */}
              <div style={{ marginTop: '26px' }}>
                <div style={{
                  position: 'relative',
                  textAlign: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: '1px',
                    backgroundColor: '#e2e8f0'
                  }} />
                  <span style={{
                    position: 'relative',
                    backgroundColor: '#ffffff',
                    padding: '0 12px',
                    fontSize: '0.719rem',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    fontWeight: '600'
                  }}>
                    Demo Account Access
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  
                  {/* ADMIN Demo Button */}
                  <button
                    type="button"
                    onClick={() => handleQuickFill('ADMIN')}
                    className="demo-access-btn"
                    title="Pre-fill Administrator credentials"
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Shield size={16} strokeWidth={2.2} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.813rem', fontWeight: '700', color: '#0f172a' }}>
                        ADMIN
                      </div>
                      <div style={{ fontSize: '0.719rem', color: '#64748b' }}>
                        System Administration
                      </div>
                    </div>
                  </button>

                  {/* USER Demo Button */}
                  <button
                    type="button"
                    onClick={() => handleQuickFill('USER')}
                    className="demo-access-btn"
                    title="Pre-fill Operator credentials"
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <User size={16} strokeWidth={2.2} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.813rem', fontWeight: '700', color: '#0f172a' }}>
                        USER
                      </div>
                      <div style={{ fontSize: '0.719rem', color: '#64748b' }}>
                        Monitoring Dashboard
                      </div>
                    </div>
                  </button>

                </div>
              </div>

              {/* PROTOTYPE INFORMATION PANEL */}
              <div style={{
                marginTop: '22px',
                padding: '11px 14px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <Info size={17} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.781rem', color: '#1e40af', lineHeight: '1.45' }}>
                  This is a project prototype. Sensor readings may use simulated data during demonstration.
                </span>
              </div>
            </div>

            {/* Panel Footer */}
            <div style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#94a3b8'
            }}>
              &copy; 2026 Infrasound Monitor &middot; Prototype v1.0
            </div>

          </div>
        </div>

      </div>

      {/* ================================================================ */}
      {/* FORGOT PASSWORD MODAL                                            */}
      {/* ================================================================ */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div
            className="white-card"
            style={{
              width: '100%',
              maxWidth: '440px',
              padding: '28px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-modal)',
              border: '1px solid #cbd5e1'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                <HelpCircle size={18} color="#2563eb" />
                Credential Recovery Protocol
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                style={{
                  color: '#94a3b8',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {!resetSent ? (
              <div>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.5', marginBottom: '16px' }}>
                  Infrasound Observatory security policy requires administrator identity verification or contacting your regional <strong>Network Operations Center (NOC)</strong>.
                </p>

                <div style={{
                  padding: '14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.781rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#334155',
                  marginBottom: '20px',
                  lineHeight: '1.6'
                }}>
                  <div><strong>NOC Security Desk:</strong> noc@infrasound.org</div>
                  <div><strong>Central Admin:</strong> admin@infrasound.org</div>
                  <div><strong>Default Demo Password:</strong> Admin@123 / User@123</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.813rem', padding: '8px 14px' }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetSent(true)}
                    className="btn btn-primary"
                    style={{ fontSize: '0.813rem', padding: '8px 16px' }}
                  >
                    Dispatch Reset Ticket
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ color: '#16a34a', display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                  <CheckCircle2 size={40} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>Reset Ticket Dispatched</h3>
                <p style={{ fontSize: '0.813rem', color: '#64748b', marginTop: '6px', lineHeight: '1.45' }}>
                  A security ticket has been transmitted to NOC operations for {email || 'your registered address'}.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="btn btn-secondary"
                  style={{ marginTop: '18px', fontSize: '0.813rem', padding: '8px 18px' }}
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
