// src/components/AlertMessage.tsx
import React from 'react';

interface AlertMessageProps {
  type?: 'success' | 'danger' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  type = 'info',
  message,
  onClose,
}) => {
  const alertClass = `alert alert-${type} alert-dismissible fade show`;

  return (
    <div className={alertClass} role="alert">
      {message}
      {onClose && (
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
};

export default AlertMessage;