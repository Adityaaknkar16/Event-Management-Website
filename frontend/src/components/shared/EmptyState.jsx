import React from 'react';
import { Calendar } from 'lucide-react';

const EmptyState = ({ message = 'No items found.', icon }) => {
  return (
    <div className="empty-state" style={{ background: 'var(--bg-secondary)' }}>
      {icon ? icon : <Calendar size={48} className="empty-icon" style={{ color: 'var(--lux-gold)' }} />}
      <p style={{ color: 'var(--lux-text-dim)', fontSize: '15px' }}>{message}</p>
    </div>
  );
};

export default EmptyState;
