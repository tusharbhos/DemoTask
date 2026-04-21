import React from 'react';

const Spinner = ({ text = 'Loading...' }) => (
  <div className="d-flex align-items-center justify-content-center py-5">
    <div className="spinner-border text-purple me-2" role="status" style={{ color: '#7b1fa2' }}>
      <span className="visually-hidden">{text}</span>
    </div>
    <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>{text}</span>
  </div>
);

export default Spinner;
