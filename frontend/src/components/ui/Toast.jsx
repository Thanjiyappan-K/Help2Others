import React from 'react';
import { useToast } from '../../context/ToastContext';

const ICONS = {
  success: 'check_circle',
  error:   'error',
  warning: 'warning',
  info:    'info',
};

const Toast = ({ toast, onRemove }) => (
  <div className={`toast toast-${toast.type}`} role="alert" aria-live="polite">
    <div className="toast-icon">
      <span className="material-icons-round">{ICONS[toast.type]}</span>
    </div>
    <div className="toast-content">
      {toast.title && <div className="toast-title">{toast.title}</div>}
      {toast.message && <div className="toast-message">{toast.message}</div>}
    </div>
    <button className="toast-close" onClick={() => onRemove(toast.id)} aria-label="Close notification">
      <span className="material-icons-round icon-sm">close</span>
    </button>
  </div>
);

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
