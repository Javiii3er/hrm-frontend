import React from 'react';
import { useAuth } from '@modules/auth/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-layout">
      {/* Navbar simple por ahora */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand">
            <i className="bi bi-person-badge me-2"></i>
            HRM System
          </span>
          
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <button 
                className="btn btn-outline-light dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle me-2"></i>
                {user?.email}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={logout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="container-fluid mt-3">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;