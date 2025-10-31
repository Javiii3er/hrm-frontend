import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useToast } from '@/core/contexts/ToastContext';
import { useTheme } from '@/core/hooks/useTheme';

const ProfileForm: React.FC = () => {
  const { updateProfile, loading } = useProfile();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      showToast('success', 'Perfil actualizado correctamente.');
      navigate('/profile');
    } catch {
      showToast('danger', 'Error al actualizar el perfil.');
    }
  };

  return (
    <div className="container-fluid mt-3">
      {/* 🔹 Encabezado principal */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate('/profile')}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Volver
          </button>

          <h2 className="mb-0 fw-bold" style={{ color: theme.primaryDark }}>
            <i className="bi bi-person-gear me-2 text-primary"></i>
            Editar Perfil de Usuario
          </h2>
        </div>
      </div>

      {/* 🔧 Contenedor del formulario */}
      <div
        className="card shadow-sm border-light mx-auto"
        style={{
          maxWidth: '600px',
          boxShadow: theme.shadow,
        }}
      >
        <div
          className="card-header text-white"
          style={{ backgroundColor: theme.primary }}
        >
          <h5 className="mb-0">
            <i className="bi bi-pencil-square me-2"></i>
            Actualización de Datos
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Campo Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Nuevo correo electrónico"
                disabled={loading}
              />
            </div>

            {/* Campo Nueva contraseña */}
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label fw-semibold">
                Nueva contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="form-control"
                placeholder="********"
                disabled={loading}
              />
              <small className="text-muted">
                Deja este campo vacío si no deseas cambiar la contraseña.
              </small>
            </div>

            {/* Botones de acción */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/profile')}
                disabled={loading}
              >
                <i className="bi bi-x-circle me-1"></i>
                Cancelar
              </button>
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: theme.primary,
                  color: '#fff',
                  borderColor: theme.primary,
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
