import React, { useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useToast } from '@/core/contexts/ToastContext';
import { useAuth } from '@/core/contexts/useAuth';
import { useNavigate } from 'react-router-dom';

const ProfileView: React.FC = () => {
  const { profile, fetchProfile, loading, error } = useProfile();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile()
      .then(() => showToast('info', 'Perfil cargado correctamente.'))
      .catch(() => showToast('danger', 'No se pudo cargar el perfil.'));
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger shadow-sm border-start border-4 border-danger">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="alert alert-warning shadow-sm border-start border-4 border-warning">
        <i className="bi bi-person-x-fill me-2"></i>
        No se encontró la información del perfil.
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h2 className="mb-0">
          <i className="bi bi-person-circle me-2 text-primary"></i>
          Perfil de Usuario
        </h2>
        {user?.role === 'ADMIN' && (
          <button
            className="btn btn-primary"
            onClick={() => navigate('/profile/edit')}
          >
            <i className="bi bi-pencil-square me-2"></i>Editar Perfil
          </button>
        )}
      </div>

      <div className="row">
        <div className="col-lg-6">
          <div className="card shadow-sm border-light mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i> Información del Usuario
              </h5>
            </div>
            <div className="card-body">
              <p><strong>ID:</strong> {profile.id}</p>
              <p><strong>Correo:</strong> {profile.email}</p>
              <p><strong>Rol:</strong> {profile.role}</p>
              <p>
                <strong>Creado:</strong>{' '}
                {new Date(profile.createdAt).toLocaleString('es-ES')}
              </p>
              <p>
                <strong>Actualizado:</strong>{' '}
                {new Date(profile.updatedAt).toLocaleString('es-ES')}
              </p>
            </div>
          </div>
        </div>

        {profile.employee && (
          <div className="col-lg-6">
            <div className="card shadow-sm border-light">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-briefcase me-2"></i> Información del Empleado
                </h5>
              </div>
              <div className="card-body">
                <p><strong>Nombre:</strong> {profile.employee.firstName} {profile.employee.lastName}</p>
                <p><strong>Cédula:</strong> {profile.employee.nationalId}</p>
                <p><strong>Departamento:</strong> {profile.employee.department?.name || 'No asignado'}</p>
                <p><strong>Puesto:</strong> {profile.employee.position || 'No especificado'}</p>
                <p><strong>Estado:</strong> {profile.employee.status}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
