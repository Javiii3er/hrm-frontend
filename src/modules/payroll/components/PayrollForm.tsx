import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayroll } from '../hooks/usePayroll';
import { PayrollCreate } from '../types/payroll';
import { useEmployees } from '../../employees/hooks/useEmployees';

const PayrollForm: React.FC = () => {
  const navigate = useNavigate();
  const { createPayroll, createIndividualPayroll, loading, error } = usePayroll(); 
  const { employees, fetchEmployees } = useEmployees(); 
  const [formData, setFormData] = useState<PayrollCreate>({
    periodStart: '',
    periodEnd: '',
    departmentId: '',
    description: '',
  });


  const [payrollType, setPayrollType] = useState<'GENERAL' | 'INDIVIDUAL'>('GENERAL');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  useEffect(() => {
    if (payrollType === 'INDIVIDUAL') {
      fetchEmployees();
    }
  }, [payrollType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as 'GENERAL' | 'INDIVIDUAL';
    setPayrollType(newType);
    if (newType === 'GENERAL') {
      setSelectedEmployee('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.periodStart || !formData.periodEnd) {
      alert('Por favor completa las fechas del periodo');
      return;
    }

    if (new Date(formData.periodStart) > new Date(formData.periodEnd)) {
      alert('La fecha de inicio no puede ser mayor a la fecha de fin');
      return;
    }

    try {
      if (payrollType === 'INDIVIDUAL' && selectedEmployee) {
        await createIndividualPayroll(selectedEmployee, formData);
      } else {
        await createPayroll(formData);
      }

      navigate('/payroll');
    } catch (error) {
      console.error('Error creando nómina:', error);
    }
  };

  const handleCancel = () => {
    navigate('/payroll');
  };

  const generateDescription = () => {
    if (formData.periodStart && formData.periodEnd) {
      const start = new Date(formData.periodStart);
      const end = new Date(formData.periodEnd);

      const monthNames = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ];

      if (start.getMonth() === end.getMonth()) {
        // Mismo mes
        return `Nómina ${monthNames[start.getMonth()]} ${start.getFullYear()}`;
      } else {
        // Periodo entre meses
        return `Nómina ${monthNames[start.getMonth()]}-${monthNames[end.getMonth()]} ${start.getFullYear()}`;
      }
    }
    return '';
  };

  // Actualizar descripción cuando cambien las fechas
  useEffect(() => {
    if (!formData.description) {
      const autoDescription = generateDescription();
      if (autoDescription) {
        setFormData((prev) => ({ ...prev, description: autoDescription }));
      }
    }
  }, [formData.periodStart, formData.periodEnd]);

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-plus-circle me-2"></i>
                  Crear Nueva Nómina
                </h4>
                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  onClick={handleCancel}
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Volver
                </button>
              </div>
            </div>

            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* 🔹 NUEVO: Tipo de nómina */}
                  <div className="col-12">
                    <h5 className="border-bottom pb-2 mb-3">
                      <i className="bi bi-gear me-2"></i>
                      Tipo de Nómina
                    </h5>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="payrollType" className="form-label">
                      Selecciona tipo
                    </label>
                    <select
                      id="payrollType"
                      className="form-select"
                      value={payrollType}
                      onChange={handleTypeChange}
                      disabled={loading}
                    >
                      <option value="GENERAL">General</option>
                      <option value="INDIVIDUAL">Individual (por empleado)</option>
                    </select>
                    <div className="form-text">
                      Selecciona “Individual” para generar nómina de un solo empleado
                    </div>
                  </div>

                  {/* 🔹 NUEVO: Selección de empleado */}
                  {payrollType === 'INDIVIDUAL' && (
                    <div className="col-md-6">
                      <label htmlFor="selectedEmployee" className="form-label">
                        Empleado
                      </label>
                      <select
                        id="selectedEmployee"
                        className="form-select"
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        disabled={loading}
                        required
                      >
                        <option value="">Seleccione un empleado...</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName} ({emp.department?.name || 'Sin dpto'})
                          </option>
                        ))}
                      </select>
                      <div className="form-text">
                        Solo aparecerán empleados activos
                      </div>
                    </div>
                  )}

                  {/* Periodo de Nómina */}
                  <div className="col-12">
                    <h5 className="border-bottom pb-2 mb-3 mt-4">
                      <i className="bi bi-calendar-range me-2"></i>
                      Periodo de Nómina
                    </h5>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="periodStart" className="form-label">
                      Fecha Inicio <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="periodStart"
                      name="periodStart"
                      value={formData.periodStart}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    <div className="form-text">Primer día del periodo a pagar</div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="periodEnd" className="form-label">
                      Fecha Fin <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="periodEnd"
                      name="periodEnd"
                      value={formData.periodEnd}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    <div className="form-text">Último día del periodo a pagar</div>
                  </div>

                  {/* Información Adicional */}
                  <div className="col-12 mt-4">
                    <h5 className="border-bottom pb-2 mb-3">
                      <i className="bi bi-info-circle me-2"></i>
                      Información Adicional
                    </h5>
                  </div>

                  <div className="col-12">
                    <label htmlFor="description" className="form-label">
                      Descripción
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      disabled={loading}
                      rows={3}
                      placeholder="Descripción de la nómina..."
                    />
                    <div className="form-text">
                      Descripción automática generada basada en las fechas
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="departmentId" className="form-label">
                      Departamento (Opcional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="departmentId"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                      disabled={loading || payrollType === 'INDIVIDUAL'} 
                      placeholder="ID del departamento"
                    />
                    <div className="form-text">
                      Dejar vacío para incluir todos los departamentos
                    </div>
                  </div>

                  {/* Vista Previa */}
                  {(formData.periodStart || formData.periodEnd) && (
                    <div className="col-12 mt-3">
                      <div className="card border-info">
                        <div className="card-header bg-info text-white">
                          <h6 className="mb-0">
                            <i className="bi bi-eye me-2"></i>
                            Vista Previa
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <strong>Periodo:</strong>
                              <br />
                              {formData.periodStart && (
                                <>
                                  {new Date(
                                    formData.periodStart
                                  ).toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </>
                              )}
                              {formData.periodEnd && (
                                <>
                                  {' al '}
                                  {new Date(
                                    formData.periodEnd
                                  ).toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </>
                              )}
                            </div>
                            <div className="col-md-6">
                              <strong>Días:</strong>
                              <br />
                              {formData.periodStart && formData.periodEnd && (
                                <>
                                  {Math.ceil(
                                    (new Date(formData.periodEnd).getTime() -
                                      new Date(formData.periodStart).getTime()) /
                                      (1000 * 60 * 60 * 24)
                                  ) + 1}{' '}
                                  días
                                </>
                              )}
                            </div>
                          </div>
                          {formData.description && (
                            <div className="mt-2">
                              <strong>Descripción:</strong>
                              <br />
                              {formData.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botones */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Creando Nómina...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Crear Nómina
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollForm;