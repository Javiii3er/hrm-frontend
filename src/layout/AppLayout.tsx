// src/layout/AppLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@core/contexts/useAuth';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', path: '/', roles: ['ADMIN', 'RRHH', 'EMPLEADO'] },

    ...(user.role === 'ADMIN' || user.role === 'RRHH' ? [
      { name: 'Empleados', path: '/employees', roles: ['ADMIN', 'RRHH'] },
      { name: 'Nóminas', path: '/payroll', roles: ['ADMIN', 'RRHH'] },
      { name: 'Documentos', path: '/documents', roles: ['ADMIN', 'RRHH'] },
    ] : []),

    ...(user.role === 'ADMIN' ? [
      { name: 'Administración de Usuarios', path: '/users', roles: ['ADMIN'] },
    ] : []),
    { name: 'Mi Perfil', path: '/profile', roles: ['ADMIN', 'RRHH', 'EMPLEADO'] },
  ];

  return (
    <nav className="sidebar">
      <h3>HRM System</h3>
      <p className="user-role">{user.role}</p>
      <ul>
        {navItems.map((item, index) => (
          <li key={index} className="nav-item">
            <a href={item.path}>{item.name}</a>
          </li>
        ))}
      </ul>
      <button onClick={logout} className="logout-button">Cerrar Sesión</button>
    </nav>
  );
};

const AppLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="content">
        <header className="header">

          <h2>Bienvenido, {useAuth().user?.employee?.firstName || 'Usuario'}</h2>
        </header>
    
        <div className="page-content">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default AppLayout;