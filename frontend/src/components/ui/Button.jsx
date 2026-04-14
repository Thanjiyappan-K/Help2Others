import React, { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = '',
  full = false,
  icon = null,
  iconEnd = null,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}, ref) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    size && `btn-${size}`,
    full && 'btn-full',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="spinner" style={variant === 'secondary' || variant === 'ghost' ? { borderColor: 'var(--border)', borderTopColor: 'var(--color-primary)' } : {}} />
      ) : icon ? (
        <span className="material-icons-round icon-sm">{icon}</span>
      ) : null}
      {children}
      {!loading && iconEnd && (
        <span className="material-icons-round icon-sm">{iconEnd}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
