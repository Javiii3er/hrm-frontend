import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ------------------------------------
// Componente de Navegación Lateral (Sidebar)
// ------------------------------------
const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null; // No mostrar si no hay usuario

  // Lógica de navegación basada en roles
  const navItems = [
    { name: 'Dashboard', path: '/', roles: ['ADMIN', 'RRHH', 'EMPLEADO'] },
    // Módulos específicos para RRHH y ADMIN
    ...(user.role === 'ADMIN' || user.role === 'RRHH' ? [
      { name: 'Empleados', path: '/employees', roles: ['ADMIN', 'RRHH'] },
      { name: 'Nóminas', path: '/payroll', roles: ['ADMIN', 'RRHH'] },
      { name: 'Documentos', path: '/documents', roles: ['ADMIN', 'RRHH'] },
    ] : []),
    // Módulo exclusivo para ADMIN
    ...(user.role === 'ADMIN' ? [
      { name: 'Administración de Usuarios', path: '/users', roles: ['ADMIN'] },
    ] : []),
    // Módulo para todos (Ver perfil propio)
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

// ------------------------------------
// Layout Principal
// ------------------------------------
const AppLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="content">
        <header className="header">
          {/* CORRECCIÓN: Accedemos al nombre a través de 'employee' */}
          <h2>Bienvenido, {useAuth().user?.employee?.firstName || 'Usuario'}</h2>
        </header>
        {/* El Outlet renderiza el componente de la ruta activa (Dashboard, Employees, etc.) */}
        <div className="page-content">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default AppLayout;