import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees'; 
import { EmployeeQuery, Employee } from '../types/employee';

// Importamos el componente de Alerta de Bootstrap
// Nota: Se reemplazó window.confirm/alert por un placeholder
// En un entorno real, usaríamos un modal o toast.
const CustomAlert = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <div className="alert alert-warning d-flex align-items-center" role="alert">
    <i className="bi bi-exclamation-triangle-fill me-2"></i>
    <div>{message}</div>
    <button type="button" className="btn-close ms-auto" onClick={onClose} aria-label="Close"></button>
  </div>
);

const EmployeeList: React.FC = () => {

  const { employees, loading, error, fetchEmployees, deleteEmployee, clearError } = useEmployees();
  const navigate = useNavigate(); 
    
  const [query, setQuery] = useState<EmployeeQuery>({
    page: 1,
    pageSize: 10,
    q: '',
    status: '',
    department: ''
  });

  // Estado para manejar la confirmación de eliminación (reemplazando window.confirm)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // --- Lógica de Carga de Datos ---
  // Cargar empleados al montar el componente (para la carga inicial)
  useEffect(() => {
    fetchEmployees(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar empleados cada vez que el objeto 'query' cambia
  useEffect(() => {
    fetchEmployees(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  
  // --- Manejadores ---
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Siempre resetear a la página 1 cuando se ejecuta una nueva búsqueda/filtro
    setQuery(prev => ({ ...prev, page: 1 }));
  };

  const initiateDelete = (id: string) => {
    // Usamos el estado local para mostrar la confirmación personalizada
    setConfirmDeleteId(id);
  };
  
  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await deleteEmployee(confirmDeleteId);
      // En un entorno real, usarías un sistema de toast/notificación
      console.log('Empleado eliminado con éxito (placeholder de notificación).'); 
      // El hook 'useEmployees' debería encargarse de actualizar la lista automáticamente
    } catch (error) {
      console.error('Error eliminando empleado:', error);
    } finally {
      setConfirmDeleteId(null);
    }
  };


  // --- Renderizado Condicional: Spinner de Carga Inicial ---
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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-people-fill me-2"></i>
          Gestión de Empleados
        </h2>
        {/* Botón para crear nuevo empleado */}
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/employees/new')} 
          disabled={loading} // ✅ Deshabilita mientras carga
        >
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Empleado
        </button>
      </div>

      {/* Filtros de Búsqueda */}
      <div className="card mb-4">
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

      {/* Mensaje de Error del API */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          {/* ✅ Cierra el alert llamando a clearError del hook */}
          <button 
            type="button" 
            className="btn-close" 
            onClick={clearError}
            aria-label="Cerrar"
          ></button>
        </div>
      )}

      {/* Modal/Confirmación de Eliminación (Personalizada) */}
      {confirmDeleteId && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
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


      {/* Tabla de Empleados */}
      <div className="card">
        <div className="card-body">
          {/* ✅ Muestra el mensaje si no hay datos Y la carga ha terminado */}
          {employees.length === 0 && !loading ? (
            <div className="text-center py-5">
              <i className="bi bi-people display-1 text-muted"></i>
              <h4 className="mt-3">No hay empleados</h4>
              <p className="text-muted">Comienza agregando el primer empleado.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
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
                      <td>
                        {employee.firstName} {employee.lastName}
                      </td>
                      <td>{employee.email}</td>
                      {/* Asume que department es un objeto o tiene una propiedad name */}
                      <td>{employee.department?.name || employee.departmentId || 'N/A'}</td> 
                      <td>{employee.position || 'N/A'}</td>
                      <td>
                        <span className={`badge ${
                          employee.status === 'ACTIVE' ? 'bg-success' :
                          employee.status === 'INACTIVE' ? 'bg-secondary' :
                          employee.status === 'SUSPENDED' ? 'bg-warning text-dark' : 'bg-info'
                        }`}>
                          {employee.status === 'ACTIVE' ? 'Activo' :
                            employee.status === 'INACTIVE' ? 'Inactivo' :
                            employee.status === 'SUSPENDED' ? 'Suspendido' : 'Vacaciones'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          {/* ✅ Botón Ver (navega a detalle) - CAMBIO IMPLEMENTADO AQUÍ */}
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => navigate(`/employees/${employee.id}`)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          {/* Botón Editar (navega a edición) */}
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => navigate(`/employees/edit/${employee.id}`)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          {/* Botón Eliminar */}
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => initiateDelete(employee.id)} // Llama a la confirmación personalizada
                            disabled={loading} 
                          >
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

      {/* Paginación (placeholder) */}
      {employees.length > 0 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className="page-item disabled">
              <a className="page-link" href="#" tabIndex={-1}>Anterior</a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="#">1</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">2</a>
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
