import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@modules/employees/hooks/useEmployees';
import { Employee, EmployeeCreate, EmployeeUpdate } from '@modules/employees/types/employee';

// Hemos añadido 'isModal' para manejar diferentes comportamientos de redirección/cancelación
interface EmployeeFormProps {
  employee?: Employee; // Para edición cuando el formulario es un subcomponente (ej: en un modal)
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean; // Si se usa en modal (controla el botón 'Volver' y la redirección)
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  employee, 
  onSuccess, 
  onCancel,
  isModal = false 
}) => {
  // 1. Hook para obtener el ID de la URL si estamos en /employees/edit/:id
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  // Incluimos fetchEmployee del hook para cargar datos por URL
  const { fetchEmployee, createEmployee, updateEmployee, loading, error } = useEmployees();

  const [formData, setFormData] = useState<EmployeeCreate | EmployeeUpdate>({
    nationalId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    position: '',
    hireDate: '',
    status: 'ACTIVE'
  });
  
  // 2. Nuevo estado para manejar si el formulario está en modo edición
  const [isEdit, setIsEdit] = useState(false);

  // 3. Lógica de carga de datos unificada (por URL o por props)
  useEffect(() => {
    const loadEmployeeData = async () => {
      // Caso A: Edición por URL (Ej: /employees/edit/123)
      if (id && !employee) {
        try {
          const employeeData = await fetchEmployee(id);
          setFormData({
            nationalId: employeeData.nationalId,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            phone: employeeData.phone || '',
            departmentId: employeeData.departmentId,
            position: employeeData.position || '',
            // Aseguramos que hireDate sea un string en formato de fecha (YYYY-MM-DD)
            hireDate: employeeData.hireDate?.split('T')[0] || '', 
            status: employeeData.status
          });
          setIsEdit(true);
        } catch (loadError) {
          console.error('Error cargando empleado para edición:', loadError);
          // Opcional: Redirigir a 404 o a la lista si no se encuentra
          if (!isModal) navigate('/employees'); 
        }
      } 
      // Caso B: Edición por props (Para uso en modales o subcomponentes)
      else if (employee) {
        setFormData({
          nationalId: employee.nationalId,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone || '',
          departmentId: employee.departmentId,
          position: employee.position || '',
          hireDate: employee.hireDate?.split('T')[0] || '',
          status: employee.status
        });
        setIsEdit(true);
      }
    };

    loadEmployeeData();
    
    // Dependencias: id (URL), employee (props), fetchEmployee (hook memoizado)
  }, [id, employee, fetchEmployee, isModal, navigate]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEdit) {
        // Editar: Usar id de URL (prioridad) o de props
        const employeeId = id || employee?.id;
        if (employeeId) {
          await updateEmployee(employeeId, formData as EmployeeUpdate);
        }
      } else {
        // Crear: Asegurar que es EmployeeCreate
        await createEmployee(formData as EmployeeCreate);
      }
      
      // Manejo de éxito
      if (onSuccess) {
        onSuccess();
      } else if (!isModal) {
        // Redirigir a la lista si no es un modal y no hay callback de éxito
        navigate('/employees');
      }
    } catch (submitError) {
      console.error('Error guardando empleado:', submitError);
    }
  };

  // 4. Nueva función para manejar la cancelación/volver
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (!isModal) {
      // Vuelve a la lista de empleados si no está en modo modal
      navigate('/employees');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        {/* Se amplía el contenedor a col-lg-10 para mejor visualización */}
        <div className="col-lg-10"> 
          <div className="card">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  {/* Icono y título dinámico */}
                  <i className={`bi ${isEdit ? 'bi-pencil-square' : 'bi-person-plus-fill'} me-2`}></i>
                  {isEdit ? 'Editar Empleado' : 'Nuevo Empleado'}
                </h4>
                {/* Botón Volver solo visible si NO es modal */}
                {!isModal && (
                  <button 
                    type="button" 
                    className="btn btn-light btn-sm"
                    onClick={handleCancel}
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Volver
                  </button>
                )}
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
                  {/* Título de sección agregado */}
                  <div className="col-12">
                    <h5 className="border-bottom pb-2 mb-3">
                      <i className="bi bi-person me-2"></i>
                      Información Personal
                    </h5>
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="nationalId" className="form-label">
                      Cédula <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nationalId"
                      name="nationalId"
                      value={formData.nationalId}
                      onChange={handleChange}
                      required
                      // 🎯 Deshabilitar en modo edición
                      disabled={loading || isEdit} 
                    />
                    {/* Mensaje de apoyo para edición */}
                    {isEdit && (
                      <div className="form-text text-muted">
                        La cédula no se puede modificar
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">
                      Nombres <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">
                      Apellidos <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  {/* Se movió Teléfono aquí para agrupar mejor la Info Personal */}
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>


                  {/* Información Laboral - Título de sección agregado */}
                  <div className="col-12 mt-4">
                    <h5 className="border-bottom pb-2 mb-3">
                      <i className="bi bi-briefcase me-2"></i>
                      Información Laboral
                    </h5>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="departmentId" className="form-label">
                      Departamento <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="departmentId"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="ID del departamento"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="position" className="form-label">
                      Posición
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Cargo del empleado"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="hireDate" className="form-label">
                      Fecha de Contratación
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="hireDate"
                      name="hireDate"
                      value={formData.hireDate}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="status" className="form-label">
                      Estado <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="ACTIVE">Activo</option>
                      <option value="INACTIVE">Inactivo</option>
                      <option value="SUSPENDED">Suspendido</option>
                      <option value="VACATION">Vacaciones</option>
                    </select>
                  </div>
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
                        {isModal ? 'Cancelar' : 'Volver'}
                      </button>
                      
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            {isEdit ? 'Actualizar' : 'Crear'} Empleado
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

export default EmployeeForm;