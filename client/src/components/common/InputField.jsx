import React from 'react';

export const InputField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  autoComplete,
  disabled = false,
  icon: Icon,
  helperText
}) => {
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
        {Icon && (
          <div style={{
            position: 'absolute',
            left: '12px',
            color: error ? 'var(--state-critical-text)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <Icon size={16} strokeWidth={2} />
          </div>
        )}

        <input
          id={id}
          name={id}
          type={type}
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
            padding: Icon ? '9px 14px 9px 36px' : '9px 14px',
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
      </div>

      {error && (
        <div style={{
          fontSize: '0.72rem',
          color: 'var(--state-critical-text)',
          marginTop: '5px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
