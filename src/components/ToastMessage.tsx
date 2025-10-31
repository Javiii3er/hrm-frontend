// src/components/ToastMessage.tsx
import React, { useEffect, useState } from 'react';

interface ToastMessageProps {
  type?: 'success' | 'danger' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const iconMap: Record<string, string> = {
  success: 'bi-check-circle-fill',
  danger: 'bi-x-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
};

const ToastMessage: React.FC<ToastMessageProps> = ({
  type = 'info',
  message,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(showTimer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose?.(), 350);
  };

  return (
    <div
      className={`toast align-items-center text-bg-${type} border-0 shadow-lg toast-glass ${
        visible ? 'slide-in show' : 'slide-out'
      }`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        transition: 'transform 0.35s ease, opacity 0.35s ease',
        minWidth: '260px',
      }}
    >
      <div className="d-flex">
        <div className="toast-body d-flex align-items-center">
          <i className={`bi ${iconMap[type]} me-2 fs-5`}></i>
          <span>{message}</span>
        </div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          onClick={handleClose}
          aria-label="Cerrar"
        ></button>
      </div>
    </div>
  );
};

export default ToastMessage;