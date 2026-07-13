import React from 'react';

const LoadingSpinner = ({ fullPage = false }) => {
  return (
    <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
      <div className="premium-spinner"></div>
      <p className="loader-text" style={{ color: 'var(--lux-gold)', fontFamily: 'var(--font-serif)', letterSpacing: '2px' }}>
        LOADING EXPERIENCE...
      </p>
    </div>
  );
};

export default LoadingSpinner;
