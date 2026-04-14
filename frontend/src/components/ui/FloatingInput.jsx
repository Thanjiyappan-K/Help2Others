import React, { forwardRef } from 'react';

const FloatingInput = forwardRef(({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  success,
  icon,
  required = false,
  disabled = false,
  className = '',
  helpText,
  ...props
}, ref) => {
  const hasValue = value && value.toString().length > 0;
  const inputClass = [
    'floating-input',
    error && 'has-error',
    success && 'has-success',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="form-group">
      <div className="floating-input-wrapper" style={{ position: 'relative' }}>
        {icon && (
          <span className="material-icons-round" style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)', fontSize: 18, pointerEvents: 'none', zIndex: 1,
          }}>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder=" "
          required={required}
          disabled={disabled}
          className={inputClass}
          style={icon ? { paddingLeft: 42 } : {}}
          {...props}
        />
        <label htmlFor={name} className="floating-label" style={icon ? { left: 42 } : {}}>
          {label}{required && ' *'}
        </label>
      </div>
      {error   && <div className="field-error"><span className="material-icons-round" style={{fontSize:14}}>error_outline</span>{error}</div>}
      {success && <div className="field-success"><span className="material-icons-round" style={{fontSize:14}}>check_circle_outline</span>{success}</div>}
      {helpText && !error && !success && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{helpText}</div>}
    </div>
  );
});

FloatingInput.displayName = 'FloatingInput';

export const FloatingTextarea = forwardRef(({
  label, name, value, onChange, error, required = false, rows = 4, className = '', ...props
}, ref) => {
  const textareaClass = ['textarea-styled', error && 'has-error', className].filter(Boolean).join(' ');
  return (
    <div className="form-group">
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
        {label}{required && ' *'}
      </label>
      <textarea ref={ref} id={name} name={name} value={value} onChange={onChange} rows={rows} required={required} className={textareaClass} {...props} />
      {error && <div className="field-error"><span className="material-icons-round" style={{fontSize:14}}>error_outline</span>{error}</div>}
    </div>
  );
});
FloatingTextarea.displayName = 'FloatingTextarea';

export const FloatingSelect = forwardRef(({
  label, name, value, onChange, error, required = false, children, className = '', ...props
}, ref) => {
  return (
    <div className="form-group">
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
        {label}{required && ' *'}
      </label>
      <div style={{ position: 'relative' }}>
        <select
          ref={ref} id={name} name={name} value={value} onChange={onChange}
          required={required} className={['select-styled', error && 'has-error', className].filter(Boolean).join(' ')} {...props}
        >
          {children}
        </select>
        <span className="material-icons-round" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none', fontSize: 18 }}>expand_more</span>
      </div>
      {error && <div className="field-error"><span className="material-icons-round" style={{fontSize:14}}>error_outline</span>{error}</div>}
    </div>
  );
});
FloatingSelect.displayName = 'FloatingSelect';

export default FloatingInput;
