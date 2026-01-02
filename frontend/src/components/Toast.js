import React from 'react';
import './Toast.css';

const Toast = ({ show, message, type }) => {
  if (!show) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
      </div>
      <div className="toast-message">{message}</div>
    </div>
  );
};

export default Toast;
