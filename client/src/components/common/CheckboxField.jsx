import React from 'react';

export const CheckboxField = ({ id, label, checked, onChange, disabled = false }) => {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        fontSize: '0.813rem',
        color: 'var(--text-secondary)'
      }}
    >
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: '15px',
          height: '15px',
          accentColor: 'var(--color-primary)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          borderRadius: '3px'
        }}
      />
      <span>{label}</span>
    </label>
  );
};
