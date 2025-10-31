// src/modules/employees/components/EmployeeList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';
import { EmployeeQuery, Employee } from '../types/employee';
import { useToast } from '@/core/contexts/ToastContext';

const CustomAlert = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <div className="alert alert-warning d-flex align-items-center" role="alert">
    <i className="bi bi-exclamation-triangle-fill me-2"></i>
    <div>{message}</div>
    <button type="button" className="btn-close ms-auto" onClick={onClose} aria-label="Close"></button>
  </div>
);

const EmployeeList: React.FC = () => {
  const { employees, loading, error, fetchEmployees, deleteEmployee, clearError } = useEmployees();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [query, setQuery] = useState<EmployeeQuery>({
    page: 1,
    pageSize: 10,
    q: '',
    status: '',
    department: ''
  });

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees(query);
    showToast('info', 'Lista de empleados cargada correctamente.');
  }, []);

  useEffect(() => {
    fetchEmployees(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(prev => ({ ...prev, page: 1 }));
    showToast('info', 'Búsqueda aplicada.');
  };

  const initiateDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await deleteEmployee(confirmDeleteId);
      showToast('success', 'Empleado eliminado correctamente.');
    } catch (error) {
      console.error('Error eliminando empleado:', error);
      showToast('danger', 'Error al eliminar el empleado. Inténtalo nuevamente.');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  if (loading && employees.length === 0) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              navigate('/');
              showToast('info', 'Regresando al inicio.');
            }}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Volver
          </button>

          <h2 className="mb-0">
            <i className="bi bi-people-fill me-2"></i>
            Gestión de Empleados
          </h2>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/employees/new')}
          disabled={loading}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Empleado
        </button>
      </div>

      <div
        className="alert alert-warning shadow-sm border-start border-4 border-warning mb-4"
        role="alert"
      >
        <div className="d-flex align-items-center">
          <i className="bi bi-people text-warning fs-4 me-3"></i>
          <div>
            <strong>Visualizando todos los empleados registrados.</strong><br />
            Puedes buscar, filtrar o agregar nuevos empleados fácilmente.
          </div>
        </div>
      </div>

      <div className="card mb-4 shadow-sm border-light">
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="search" className="form-label">Buscar</label>
                <input
                  type="text"
                  className="form-control"
                  id="search"
                  placeholder="Nombre, cédula, email..."
                  value={query.q}
                  onChange={(e) => setQuery(prev => ({ ...prev, q: e.target.value }))}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="status" className="form-label">Estado</label>
                <select
                  className="form-select"
                  id="status"
                  value={query.status}
                  onChange={(e) => setQuery(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">Todos</option>
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                  <option value="SUSPENDED">Suspendido</option>
                  <option value="VACATION">Vacaciones</option>
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="department" className="form-label">Departamento</label>
                <input
                  type="text"
                  className="form-control"
                  id="department"
                  placeholder="Departamento..."
                  value={query.department}
                  onChange={(e) => setQuery(prev => ({ ...prev, department: e.target.value }))}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-outline-primary w-100" disabled={loading}>
                  <i className="bi bi-search me-2"></i>
                  Buscar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm border-start border-4 border-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={clearError} aria-label="Cerrar"></button>
        </div>
      )}

      {confirmDeleteId && (
        <div className="alert alert-warning alert-dismissible fade show shadow-sm border-start border-4 border-warning" role="alert">
          <CustomAlert
            message={`¿Estás seguro de que quieres eliminar al empleado con ID: ${confirmDeleteId}? Esta acción no se puede deshacer.`}
            onClose={() => setConfirmDeleteId(null)}
          />
          <div className="d-flex justify-content-end gap-2 mt-2">
            <button className="btn btn-danger btn-sm" onClick={confirmDelete} disabled={loading}>
              Sí, Eliminar
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setConfirmDeleteId(null)} disabled={loading}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="card shadow-sm border-light">
        <div className="card-body">
          {employees.length === 0 && !loading ? (
            <div className="text-center py-5">
              <i className="bi bi-people display-1 text-muted"></i>
              <h4 className="mt-3">No hay empleados</h4>
              <p className="text-muted">Comienza agregando el primer empleado.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Cédula</th>
                    <th>Nombre Completo</th>
                    <th>Email</th>
                    <th>Departamento</th>
                    <th>Posición</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee: Employee) => (
                    <tr key={employee.id}>
                      <td>{employee.nationalId}</td>
                      <td>{employee.firstName} {employee.lastName}</td>
                      <td>{employee.email}</td>
                      <td>{employee.department?.name || employee.departmentId || 'N/A'}</td>
                      <td>{employee.position || 'N/A'}</td>
                      <td>
                        <span
                          className={`badge ${
                            employee.status === 'ACTIVE' ? 'bg-success' :
                            employee.status === 'INACTIVE' ? 'bg-secondary' :
                            employee.status === 'SUSPENDED' ? 'bg-warning text-dark' : 'bg-info'
                          }`}
                        >
                          {employee.status === 'ACTIVE' ? 'Activo' :
                            employee.status === 'INACTIVE' ? 'Inactivo' :
                            employee.status === 'SUSPENDED' ? 'Suspendido' : 'Vacaciones'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" onClick={() => navigate(`/employees/${employee.id}`)}>
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className="btn btn-outline-secondary" onClick={() => navigate(`/employees/edit/${employee.id}`)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-outline-danger" onClick={() => initiateDelete(employee.id)} disabled={loading}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {employees.length > 0 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className="page-item disabled">
              <a className="page-link" href="#">Anterior</a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="#">1</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">Siguiente</a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default EmployeeList;
