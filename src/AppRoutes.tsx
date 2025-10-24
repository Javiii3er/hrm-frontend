// src/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@modules/auth/hooks/useAuth';
import ProtectedRoute from '@core/utils/routes/ProtectedRoute';

// Layouts
import DashboardLayout from '@/layout/DashboardLayout';
import AuthLayout from '@/layout/AuthLayout';

// 🧩 Importaciones de páginas wrapper actualizadas
import HomePage from '@modules/home/pages/HomePage';
import LoginPage from '@modules/auth/pages/LoginPage';
import EmployeeListPage from '@modules/employees/pages/EmployeeListPage';
import EmployeeDetailPage from '@modules/employees/pages/EmployeeDetailPage';
import PayrollListPage from '@modules/payroll/pages/PayrollListPage';
import PayrollDetailPage from '@modules/payroll/pages/PayrollDetailPage';
import DocumentListPage from '@modules/documents/pages/DocumentListPage';
import ReportGeneratorPage from '@modules/reports/pages/ReportGeneratorPage';

// 🧱 Componentes que ya usabas
import EmployeeForm from '@modules/employees/components/EmployeeForm';
import PayrollForm from '@modules/payroll/components/PayrollForm';
import Dashboard from '@modules/dashboard/components/Dashboard';

// 🧰 Página 404 simple
const NotFoundPage = () => (
  <div className="container mt-5">
    <div className="alert alert-warning text-center">
      <h4>⚠️ Página No Encontrada</h4>
      <p>La página que buscas no existe o fue movida.</p>
    </div>
  </div>
);

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

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
      {/* 🔓 Rutas Públicas */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* 🏠 Página principal (Home) */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH', 'EMPLEADO']}>
            <DashboardLayout>
              <HomePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 📊 Dashboard (mantienes tu ruta actual) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH', 'EMPLEADO']}>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 👥 Empleados */}
      <Route
        path="/employees"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH']}>
            <DashboardLayout>
              <EmployeeListPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees/new"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH']}>
            <DashboardLayout>
              <EmployeeForm
                onSuccess={() => window.history.back()}
                onCancel={() => window.history.back()}
              />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

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

      <Route
        path="/employees/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH']}>
            <DashboardLayout>
              <EmployeeDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 💰 Nómina */}
      <Route
        path="/payroll"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH']}>
            <DashboardLayout>
              <PayrollListPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/payroll/new"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH']}>
            <DashboardLayout>
              <PayrollForm />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/payroll/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH']}>
            <DashboardLayout>
              <PayrollDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 📁 Documentos */}
      <Route
        path="/documents"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH', 'EMPLEADO']}>
            <DashboardLayout>
              <DocumentListPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 📈 Reportes */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'RRHH']}>
            <DashboardLayout>
              <ReportGeneratorPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 🔄 Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />

      {/* 🚫 Página 404 */}
      <Route path="/404" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
