// src/core/contexts/AlertContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import AlertMessage from '@/components/AlertMessage';

type AlertType = 'success' | 'danger' | 'warning' | 'info';

interface Alert {
  id: number;
  type: AlertType;
  message: string;
}

interface AlertContextType {
  showAlert: (type: AlertType, message: string) => void;
}

const AlertContext = createContext<AlertContextType>({
  showAlert: () => {},
});

let nextId = 0;

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (type: AlertType, message: string) => {
    const id = nextId++;
    setAlerts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setAlerts(prev => prev.filter(alert => alert.id !== id)), 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
        {alerts.map(alert => (
          <AlertMessage
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
          />
        ))}
      </div>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
