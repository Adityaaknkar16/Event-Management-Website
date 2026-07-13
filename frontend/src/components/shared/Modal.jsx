import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="luxury-modal-backdrop" onClick={onClose}>
      <div 
        className="luxury-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px' }}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="luxury-modal-close" style={{ top: '24px', right: '24px' }}>
            <X size={20} />
          </button>
        </div>
        <div className="luxury-modal-body" style={{ padding: '32px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
