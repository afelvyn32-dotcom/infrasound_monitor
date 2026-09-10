import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export const PasswordInputField = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  autoComplete,
  disabled = false,
  helperText
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-group" style={{ marginBottom: '16px' }}>
      {label && (
        <label
          htmlFor={id}
          className="form-label"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.74rem',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}
        >
          <span>
            {label} {required && <span style={{ color: 'var(--state-critical-text)' }}>*</span>}
          </span>
          {helperText && !error && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'none', fontWeight: '400' }}>
              {helperText}
            </span>
          )}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute',
          left: '12px',
          color: error ? 'var(--state-critical-text)' : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <Lock size={16} strokeWidth={2} />
        </div>

        <input
          id={id}
          name={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className="form-input"
          style={{
            width: '100%',
            padding: '9px 40px 9px 36px',
            background: '#ffffff',
            border: `1px solid ${error ? 'var(--status-critical)' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
            boxShadow: 'var(--shadow-xs)',
            transition: 'border-color var(--transition-fast)'
          }}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute',
            right: '10px',
            padding: '4px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            transition: 'color var(--transition-fast)'
          }}
        >
          {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
        </button>
      </div>

      {error && (
        <div style={{
          fontSize: '0.72rem',
          color: 'var(--state-critical-text)',
          marginTop: '5px',
          fontWeight: '500'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};
