import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@modules/employees/hooks/useEmployees';
import { Employee } from '@modules/employees/types/employee';

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchEmployee, loading, error } = useEmployees();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (id) {
      loadEmployee();
    }
  }, [id]);

  const loadEmployee = async () => {
    try {
      const employeeData = await fetchEmployee(id!);
      setEmployee(employeeData);
    } catch (error) {
      console.error('Error cargando empleado:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/employees/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/employees');
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger mt-3">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
        <button className="btn btn-secondary mt-3" onClick={handleBack}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver a la lista
        </button>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container-fluid">
        <div className="alert alert-warning mt-3">
          <i className="bi bi-person-x-fill me-2"></i>
          Empleado no encontrado
        </div>
        <button className="btn btn-secondary mt-3" onClick={handleBack}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button className="btn btn-outline-secondary me-3" onClick={handleBack}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </button>
          <h2 className="d-inline-block mb-0">
            <i className="bi bi-person-badge me-2"></i>
            Detalles del Empleado
          </h2>
        </div>
        <button className="btn btn-primary" onClick={handleEdit}>
          <i className="bi bi-pencil-square me-2"></i>
          Editar Empleado
        </button>
      </div>

      <div className="row">
        {/* Información Principal */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Información Personal
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Cédula</label>
                  <p className="form-control-plaintext">{employee.nationalId}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Email</label>
                  <p className="form-control-plaintext">{employee.email}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Nombres</label>
                  <p className="form-control-plaintext">{employee.firstName}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Apellidos</label>
                  <p className="form-control-plaintext">{employee.lastName}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Teléfono</label>
                  <p className="form-control-plaintext">
                    {employee.phone || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información Laboral */}
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-briefcase me-2"></i>
                Información Laboral
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Departamento</label>
                  <p className="form-control-plaintext">
                    {employee.department?.name || 'No asignado'}
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Posición</label>
                  <p className="form-control-plaintext">
                    {employee.position || 'No especificado'}
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Fecha de Contratación</label>
                  <p className="form-control-plaintext">
                    {employee.hireDate 
                      ? new Date(employee.hireDate).toLocaleDateString('es-ES')
                      : 'No especificada'
                    }
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Estado</label>
                  <span className={`badge ${
                    employee.status === 'ACTIVE' ? 'bg-success' :
                    employee.status === 'INACTIVE' ? 'bg-secondary' :
                    employee.status === 'SUSPENDED' ? 'bg-warning' : 'bg-info'
                  } fs-6`}>
                    {employee.status === 'ACTIVE' ? 'Activo' :
                     employee.status === 'INACTIVE' ? 'Inactivo' :
                     employee.status === 'SUSPENDED' ? 'Suspendido' : 'Vacaciones'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Información Adicional */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Información del Sistema
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">ID del Empleado</label>
                <p className="form-control-plaintext small font-monospace">
                  {employee.id}
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Fecha de Creación</label>
                <p className="form-control-plaintext">
                  {new Date(employee.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Última Actualización</label>
                <p className="form-control-plaintext">
                  {new Date(employee.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="card mt-4">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Acciones Rápidas
              </h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Ver Documentos
                </button>
                <button className="btn btn-outline-success">
                  <i className="bi bi-cash-coin me-2"></i>
                  Ver Nóminas
                </button>
                <button className="btn btn-outline-info">
                  <i className="bi bi-envelope me-2"></i>
                  Enviar Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;