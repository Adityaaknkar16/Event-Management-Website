import React from 'react';

const Loader = ({ fullPage = false }) => {
  return (
    <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
      <div className="premium-spinner"></div>
      <p className="loader-text">Loading...</p>
    </div>
  );
};

export default Loader;
