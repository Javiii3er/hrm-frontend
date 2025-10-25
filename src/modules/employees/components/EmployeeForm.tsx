import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@modules/employees/hooks/useEmployees';
import { Employee, EmployeeCreate, EmployeeUpdate } from '@modules/employees/types/employee';
import { apiClient } from '@/core/api/client'; // 👈 Importamos para llamar al backend


interface EmployeeFormProps {
  employee?: Employee; 
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean; 
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  employee, 
  onSuccess, 
  onCancel,
  isModal = false 
}) => {

  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const { fetchEmployee, createEmployee, updateEmployee, loading, error } = useEmployees();

  // Estado principal del formulario
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
  
  const [isEdit, setIsEdit] = useState(false);

  // 👇 Nuevo estado para departamentos
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);

  // 🔹 Cargar departamentos al iniciar
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await apiClient.get<{ id: string; name: string }[]>('departments');
        if (res.success) setDepartments(res.data);
      } catch (error) {
        console.error('Error cargando departamentos:', error);
      }
    };
    fetchDepartments();
  }, []);

  // 🔹 Cargar datos del empleado si estamos en modo edición
  useEffect(() => {
    const loadEmployeeData = async () => {
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
            hireDate: employeeData.hireDate?.split('T')[0] || '', 
            status: employeeData.status
          });
          setIsEdit(true);
        } catch (loadError) {
          console.error('Error cargando empleado para edición:', loadError);
          if (!isModal) navigate('/employees'); 
        }
      } else if (employee) {
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
  }, [id, employee, fetchEmployee, isModal, navigate]); 

  // 🔹 Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔹 Enviar el formulario (crear o actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple antes de enviar
    if (!formData.departmentId) {
      alert('Por favor, seleccione un departamento.');
      return;
    }
    
    try {
      if (isEdit) {
        const employeeId = id || employee?.id;
        if (employeeId) {
          await updateEmployee(employeeId, formData as EmployeeUpdate);
        }
      } else {
        await createEmployee(formData as EmployeeCreate);
      }
      
      if (onSuccess) {
        onSuccess();
      } else if (!isModal) {
        navigate('/employees');
      }
    } catch (submitError) {
      console.error('Error guardando empleado:', submitError);
    }
  };

  // 🔹 Cancelar o volver atrás
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (!isModal) {
      navigate('/employees');
    }
  };

  // =============================================
  // Render del componente
  // =============================================
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-10"> 
          <div className="card">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className={`bi ${isEdit ? 'bi-pencil-square' : 'bi-person-plus-fill'} me-2`}></i>
                  {isEdit ? 'Editar Empleado' : 'Nuevo Empleado'}
                </h4>

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

                  {/* =====================
                      INFORMACIÓN PERSONAL
                  ====================== */}
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
                      disabled={loading || isEdit} 
                    />
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

                  {/* =====================
                      INFORMACIÓN LABORAL
                  ====================== */}
                  <div className="col-12 mt-4">
                    <h5 className="border-bottom pb-2 mb-3">
                      <i className="bi bi-briefcase me-2"></i>
                      Información Laboral
                    </h5>
                  </div>

                  {/* 👇 AQUÍ CAMBIAMOS EL INPUT POR UN SELECT */}
                  <div className="col-md-6">
                    <label htmlFor="departmentId" className="form-label">
                      Departamento <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="departmentId"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Seleccione un departamento</option>
                      {departments.map(dep => (
                        <option key={dep.id} value={dep.id}>
                          {dep.name}
                        </option>
                      ))}
                    </select>
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

                {/* BOTONES */}
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
