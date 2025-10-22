import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@modules/auth/hooks/useAuth';
import ProtectedRoute from '@core/utils/routes/ProtectedRoute';

// Layouts
import DashboardLayout from '@modules/auth/components/layout/DashboardLayout';
import AuthLayout from '@modules/auth/components/layout/AuthLayout';

// Auth Pages
import LoginForm from '@modules/auth/components/LoginForm';

// Importamos los componentes reales de Employees
import EmployeeList from '@modules/employees/components/EmployeeList';
import EmployeeForm from '@modules/employees/components/EmployeeForm';
// Agregamos esta importación para la nueva ruta de detalle
import EmployeeDetail from '@modules/employees/components/EmployeeDetail'; 

// Placeholder components para los próximos módulos
const DashboardPage = () => (
  <div className="container-fluid">
    <h2>Dashboard Principal</h2>
    <p>Bienvenido al sistema de Gestión de Recursos Humanos</p>
    {/* Aquí irán los KPIs por rol */}
  </div>
);

const PayrollPage = () => <div>Nómina - Próximamente</div>;
const DocumentsPage = () => <div>Documentos - Próximamente</div>;

// NUEVAS PÁGINAS PARA EMPLEADOS
const EmployeesPage = () => <EmployeeList />;

const CreateEmployeePage = () => (
  <EmployeeForm
    onSuccess={() => window.history.back()}
    onCancel={() => window.history.back()}
  />
);

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Loading state similar a tu backend startup
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route 
        path="/login" 
        element={
          !isAuthenticated ? (
            <AuthLayout>
              <LoginForm />
            </AuthLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } 
      />

      {/* Rutas Protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH', 'EMPLEADO']}>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* RUTAS DE EMPLEADOS */}
      <Route
        path="/employees"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH']}>
            <DashboardLayout>
              <EmployeesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees/new"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH']}>
            <DashboardLayout>
              <CreateEmployeePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 🟩 NUEVA RUTA DE EDICIÓN DE EMPLEADO */}
      <Route
        path="/employees/edit/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH']}>
            <DashboardLayout>
              <EmployeeForm />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* RUTA DINÁMICA DE DETALLE DE EMPLEADO */}
      <Route
        path="/employees/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH']}>
            <DashboardLayout>
              <EmployeeDetail />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Nómina */}
      <Route
        path="/payroll"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH']}>
            <DashboardLayout>
              <PayrollPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Documentos */}
      <Route
        path="/documents"
        element={
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <DashboardLayout>
              <DocumentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Ruta por defecto */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="container mt-5">
            <div className="alert alert-warning text-center">
              <h4>Página No Encontrada</h4>
              <p>La página que buscas no existe.</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
