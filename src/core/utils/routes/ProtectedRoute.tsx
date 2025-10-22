import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

// Props que reflejan tu authorize middleware
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

// Componente que protege rutas como tu middleware
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { isAuthenticated, user, hasRole } = useAuth();
  const location = useLocation();

  // No autenticado - redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar roles - igual que tu authorize middleware
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Acceso Denegado</h4>
          <p>
            No tienes permisos para acceder a esta página. 
            Rol requerido: {requiredRoles.join(', ')}
          </p>
          <p className="mb-0">
            Tu rol actual: <strong>{user?.role}</strong>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;