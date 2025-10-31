import React from 'react';
import { useAuth } from '@core/contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import '@/styles/home.css'; 

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
            { label: 'Reportes', path: '/reports', icon: 'bi-graph-up' },
            { label: 'Usuarios', path: '/users', icon: 'bi-person-gear' },
            { label: 'Mi Perfile', path: '/profile', icon: 'bi-person-circle' },

          ],
        };

      case 'RRHH':
        return {
          title: 'Recursos Humanos',
          description: 'Gestiona empleados y nóminas',
          quickActions: [
            { label: 'Empleados', path: '/employees', icon: 'bi-people' },
            { label: 'Nóminas', path: '/payroll', icon: 'bi-cash-coin' },
            { label: 'Documentos', path: '/documents', icon: 'bi-folder' },
            { label: 'Mi Perfil', path: '/profile', icon: 'bi-person' },

          ],
        };

      case 'EMPLEADO':
        return {
          title: 'Mi Espacio Personal',
          description: 'Consulta tu información y documentos',
          quickActions: [
            { label: 'Mi Perfil', path: '/profile', icon: 'bi-person' },
            { label: 'Mis Documentos', path: '/documents', icon: 'bi-folder' },
            { label: 'Última Nómina', path: '/payroll', icon: 'bi-cash-coin' },
          ],
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
          <div className="card home-hero text-center py-5 px-4">
            <h1 className="display-5 fw-bold mb-3">
              <i className="bi bi-building me-3"></i>
              {getWelcomeMessage()}
            </h1>
            <p className="lead opacity-75 mb-4">
              Sistema Integral de Gestión de Recursos Humanos
            </p>
            {roleContent && (
              <div className="mt-3">
                <h3 className="fw-semibold">{roleContent.title}</h3>
                <p className="opacity-75 mb-0">{roleContent.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      {roleContent && (
        <div className="row justify-content-center mb-5 quick-actions">
          <div className="col-lg-10">
            <h3 className="mb-4 fw-bold text-purple">
              <i className="bi bi-lightning-charge-fill me-2 text-purple"></i>
              Acciones Rápidas
            </h3>
            <div className="row g-4">
              {roleContent.quickActions.map((action, index) => (
                <div key={index} className="col-md-6 col-lg-3">
                  <div
                    className="card h-100 cursor-pointer"
                    onClick={() => navigate(action.path)}
                  >
                    <div className="card-body text-center py-4">
                      <i className={`bi ${action.icon} display-5 mb-3`}></i>
                      <h5 className="fw-semibold">{action.label}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="row g-4">
            {user?.role === 'ADMIN' && (
              <>
                <div className="col-md-3">
                  <div className="card stats-card text-center">
                    <div className="card-body">
                      <i className="bi bi-people display-6 mb-2"></i>
                      <h3 className="fw-bold">156</h3>
                      <p className="text-muted mb-0">Empleados Activos</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card stats-card text-center">
                    <div className="card-body">
                      <i className="bi bi-cash-coin display-6 mb-2"></i>
                      <h3 className="fw-bold">Q 245,680</h3>
                      <p className="text-muted mb-0">Nómina del Mes</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {user?.role === 'EMPLEADO' && (
              <>
                <div className="col-md-4">
                  <div className="card stats-card text-center">
                    <div className="card-body">
                      <i className="bi bi-calendar-check display-6 mb-2"></i>
                      <h3 className="fw-bold">15</h3>
                      <p className="text-muted mb-0">Días de Vacaciones</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card stats-card text-center">
                    <div className="card-body">
                      <i className="bi bi-file-earmark-text display-6 mb-2"></i>
                      <h3 className="fw-bold">8</h3>
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
