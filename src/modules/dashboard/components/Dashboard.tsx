import React from 'react';
import { useAuth } from '@modules/auth/hooks/useAuth';
import AdminDashboard from './AdminDashboard';
import HRHDashboard from './HRHDashboard';
import EmployeeDashboard from './EmployeeDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Renderizar dashboard según el rol
  const renderDashboard = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'RRHH':
        return <HRHDashboard />;
      case 'EMPLEADO':
        return <EmployeeDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="dashboard">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;