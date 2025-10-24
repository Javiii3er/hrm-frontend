import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayroll } from '../hooks/usePayroll';
import { PayrollCreate } from '../types/payroll';

const PayrollForm: React.FC = () => {
  const navigate = useNavigate();
  const { createPayroll, loading, error } = usePayroll();
  const [formData, setFormData] = useState<PayrollCreate>({
    periodStart: '',
    periodEnd: '',
    departmentId: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.periodStart || !formData.periodEnd) {
      alert('Por favor completa las fechas del periodo');
      return;
    }

    if (new Date(formData.periodStart) > new Date(formData.periodEnd)) {
      alert('La fecha de inicio no puede ser mayor a la fecha de fin');
      return;
    }

    try {
      await createPayroll(formData);
      navigate('/payroll');
    } catch (error) {
      console.error('Error creando nómina:', error);
    }
  };

  const handleCancel = () => {
    navigate('/payroll');
  };

  // Generar descripción automática basada en las fechas
  const generateDescription = () => {
    if (formData.periodStart && formData.periodEnd) {
      const start = new Date(formData.periodStart);
      const end = new Date(formData.periodEnd);
      
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
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
  React.useEffect(() => {
    if (!formData.description) {
      const autoDescription = generateDescription();
      if (autoDescription) {
        setFormData(prev => ({ ...prev, description: autoDescription }));
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
                  {/* Periodo de Nómina */}
                  <div className="col-12">
                    <h5 className="border-bottom pb-2 mb-3">
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
                    <div className="form-text">
                      Primera día del periodo a pagar
                    </div>
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
                    <div className="form-text">
                      Último día del periodo a pagar
                    </div>
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
                      disabled={loading}
                      placeholder="ID del departamento"
                    />
                    <div className="form-text">
                      Dejar vacío para incluir todos los departamentos
                    </div>
                  </div>

                  {/* Resumen */}
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
                              <strong>Periodo:</strong><br />
                              {formData.periodStart && (
                                <>
                                  {new Date(formData.periodStart).toLocaleDateString('es-ES', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </>
                              )}
                              {formData.periodEnd && (
                                <>
                                  {' al '}
                                  {new Date(formData.periodEnd).toLocaleDateString('es-ES', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </>
                              )}
                            </div>
                            <div className="col-md-6">
                              <strong>Días:</strong><br />
                              {formData.periodStart && formData.periodEnd && (
                                <>
                                  {Math.ceil(
                                    (new Date(formData.periodEnd).getTime() - 
                                     new Date(formData.periodStart).getTime()) / 
                                    (1000 * 60 * 60 * 24)
                                  ) + 1} días
                                </>
                              )}
                            </div>
                          </div>
                          {formData.description && (
                            <div className="mt-2">
                              <strong>Descripción:</strong><br />
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
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
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