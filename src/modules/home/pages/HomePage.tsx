// src/modules/home/pages/HomePage.tsx
import React from 'react';
import { useAuth } from '@core/contexts/useAuth';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getWelcomeMessage = () => {
    if (!user) return 'Bienvenido al Sistema HRM';
    
    const name = user.employee?.firstName || user.email.split('@')[0];
    return `¡Bienvenido de vuelta, ${name}!`;
  };

  const getRoleBasedContent = () => {
    if (!user) return null;

    switch (user.role) {
      case 'ADMIN':
        return {
          title: 'Panel de Administración',
          description: 'Tienes acceso completo al sistema',
          quickActions: [
            { label: 'Gestión de Empleados', path: '/employees', icon: 'bi-people' },
            { label: 'Control de Nóminas', path: '/payroll', icon: 'bi-cash-coin' },
            { label: 'Documentos', path: '/documents', icon: 'bi-folder' },
            { label: 'Reportes', path: '/reports', icon: 'bi-graph-up' }
          ]
        };
      
      case 'RRHH':
        return {
          title: 'Recursos Humanos',
          description: 'Gestiona empleados y nóminas',
          quickActions: [
            { label: 'Empleados', path: '/employees', icon: 'bi-people' },
            { label: 'Nóminas', path: '/payroll', icon: 'bi-cash-coin' },
            { label: 'Documentos', path: '/documents', icon: 'bi-folder' },
            { label: 'Mi Perfil', path: '/profile', icon: 'bi-person' }
          ]
        };
      
      case 'EMPLEADO':
        return {
          title: 'Mi Espacio Personal',
          description: 'Consulta tu información y documentos',
          quickActions: [
            { label: 'Mi Perfil', path: '/profile', icon: 'bi-person' },
            { label: 'Mis Documentos', path: '/documents', icon: 'bi-folder' },
            { label: 'Última Nómina', path: '/payroll', icon: 'bi-cash-coin' }
          ]
        };
      
      default:
        return null;
    }
  };

  const roleContent = getRoleBasedContent();

  return (
    <div className="container-fluid">
      {/* Hero Section */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-10">
          <div className="card bg-primary text-white">
            <div className="card-body text-center py-5">
              <h1 className="display-4 fw-bold mb-3">
                <i className="bi bi-building me-3"></i>
                {getWelcomeMessage()}
              </h1>
              <p className="lead mb-4">
                Sistema Integral de Gestión de Recursos Humanos
              </p>
              {roleContent && (
                <div className="mt-4">
                  <h3>{roleContent.title}</h3>
                  <p className="mb-0">{roleContent.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {roleContent && (
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <h3 className="mb-4">
              <i className="bi bi-lightning me-2"></i>
              Acciones Rápidas
            </h3>
            <div className="row g-4">
              {roleContent.quickActions.map((action, index) => (
                <div key={index} className="col-md-6 col-lg-3">
                  <div 
                    className="card h-100 cursor-pointer hover-shadow"
                    onClick={() => navigate(action.path)}
                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  >
                    <div className="card-body text-center">
                      <i className={`bi ${action.icon} display-4 text-primary mb-3`}></i>
                      <h5 className="card-title">{action.label}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="row g-4">
            {/* Estadísticas dinámicas según rol */}
            {user?.role === 'ADMIN' && (
              <>
                <div className="col-md-3">
                  <div className="card border-success">
                    <div className="card-body text-center">
                      <i className="bi bi-people display-6 text-success mb-2"></i>
                      <h3>156</h3>
                      <p className="text-muted mb-0">Empleados Activos</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-info">
                    <div className="card-body text-center">
                      <i className="bi bi-cash-coin display-6 text-info mb-2"></i>
                      <h3>Q 245,680</h3>
                      <p className="text-muted mb-0">Nómina del Mes</p>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {user?.role === 'EMPLEADO' && (
              <>
                <div className="col-md-4">
                  <div className="card border-warning">
                    <div className="card-body text-center">
                      <i className="bi bi-calendar-check display-6 text-warning mb-2"></i>
                      <h3>15</h3>
                      <p className="text-muted mb-0">Días de Vacaciones</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-success">
                    <div className="card-body text-center">
                      <i className="bi bi-file-earmark-text display-6 text-success mb-2"></i>
                      <h3>8</h3>
                      <p className="text-muted mb-0">Mis Documentos</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;