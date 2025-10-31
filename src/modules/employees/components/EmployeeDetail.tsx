// src/modules/employees/components/EmployeeDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@modules/employees/hooks/useEmployees';
import { Employee } from '@modules/employees/types/employee';
import { useToast } from '@/core/contexts/ToastContext';
import { usePayroll } from '@modules/payroll/hooks/usePayroll';

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchEmployee, loading, error } = useEmployees();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const { showToast } = useToast();
  const { createIndividualPayroll } = usePayroll();

  // Estado del modal y formulario
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    periodStart: '',
    periodEnd: '',
    description: ''
  });

  useEffect(() => {
    if (id) loadEmployee();
  }, [id]);

  const loadEmployee = async () => {
    try {
      const employeeData = await fetchEmployee(id!);
      setEmployee(employeeData);
      showToast('info', 'Detalles del empleado cargados correctamente.');
    } catch (error) {
      console.error('Error cargando empleado:', error);
      showToast('danger', 'No se pudo cargar la información del empleado.');
    }
  };

  const handleEdit = () => {
    navigate(`/employees/edit/${id}`);
    showToast('info', 'Abriendo modo de edición del empleado.');
  };

  const handleBack = () => {
    navigate('/employees');
    showToast('info', 'Regresando a la lista de empleados.');
  };

  // 🧩 Nueva función: generar nómina individual
  const handleGeneratePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await createIndividualPayroll(id, formData);
      showToast('success', 'Nómina individual generada correctamente.');
      setShowModal(false);
      setFormData({ periodStart: '', periodEnd: '', description: '' });
    } catch (err: any) {
      console.error(err);
      showToast('danger', 'Error al generar nómina individual.');
    }
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
    showToast('danger', 'Ocurrió un error al obtener los datos del empleado.');
    return (
      <div className="container-fluid">
        <div className="alert alert-danger mt-3 shadow-sm border-start border-4 border-danger">
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
    showToast('warning', 'Empleado no encontrado o eliminado.');
    return (
      <div className="container-fluid">
        <div className="alert alert-warning mt-3 shadow-sm border-start border-4 border-warning">
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
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleBack}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Volver
          </button>
          <h2 className="mb-0">
            <i className="bi bi-person-badge me-2 text-primary"></i>
            Detalles del Empleado
          </h2>
        </div>
        <button className="btn btn-primary" onClick={handleEdit}>
          <i className="bi bi-pencil-square me-2"></i>
          Editar Empleado
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Información Personal */}
          <div className="card mb-4 shadow-sm border-light">
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
          <div className="card shadow-sm border-light">
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
                      : 'No especificada'}
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Estado</label>
                  <span
                    className={`badge ${
                      employee.status === 'ACTIVE'
                        ? 'bg-success'
                        : employee.status === 'INACTIVE'
                        ? 'bg-secondary'
                        : employee.status === 'SUSPENDED'
                        ? 'bg-warning text-dark'
                        : 'bg-info'
                    } fs-6`}
                  >
                    {employee.status === 'ACTIVE'
                      ? 'Activo'
                      : employee.status === 'INACTIVE'
                      ? 'Inactivo'
                      : employee.status === 'SUSPENDED'
                      ? 'Suspendido'
                      : 'Vacaciones'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel lateral derecho */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-light">
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
                    minute: '2-digit',
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
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="card mt-4 shadow-sm border-light">
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
                <button
                  className="btn btn-success text-white"
                  onClick={() => setShowModal(true)}
                >
                  <i className="bi bi-cash-stack me-2"></i>
                  Generar Nómina Individual
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

      {/* Modal para crear nómina individual */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="bi bi-cash-stack me-2"></i>
                  Generar Nómina Individual
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleGeneratePayroll}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Fecha de inicio</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={formData.periodStart}
                      onChange={(e) => setFormData(prev => ({ ...prev, periodStart: e.target.value }))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fecha de fin</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={formData.periodEnd}
                      onChange={(e) => setFormData(prev => ({ ...prev, periodEnd: e.target.value }))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción (opcional)</label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength={200}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    <i className="bi bi-check-lg me-2"></i>
                    Generar Nómina
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;
