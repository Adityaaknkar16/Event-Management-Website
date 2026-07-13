import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-alert-message ${type}`} style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 1000,
      display: 'flex',
      align-items: 'center',
      gap: '12px',
      padding: '16px 24px',
      borderRadius: '8px',
      background: 'var(--bg-secondary)',
      border: `1px solid ${type === 'success' ? 'var(--lux-gold)' : 'var(--danger)'}`,
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      animation: 'slide-up-fade 0.3s ease forwards'
    }}>
      {type === 'success' ? (
        <CheckCircle2 size={18} style={{ color: 'var(--lux-gold)' }} />
      ) : (
        <AlertCircle size={18} style={{ color: 'var(--danger)' }} />
      )}
      <span style={{ fontSize: '14px', color: 'var(--lux-text-light)' }}>{message}</span>
      <button onClick={onClose} style={{
        background: 'transparent',
        border: 'none',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        display: 'flex',
        padding: 0
      }}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
