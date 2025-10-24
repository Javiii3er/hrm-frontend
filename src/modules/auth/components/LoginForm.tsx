import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@core/contexts/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const LoginSchema = z.object({
  email: z.string().email('Formato de correo inválido').min(1, 'El correo es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof LoginSchema>;

const LoginForm: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: 'onTouched',
  });

  useEffect(() => {
    if (isAuthenticated) {
      const state = (location.state || {}) as LocationState;
      const from = state.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [ isAuthenticated, navigate, location ]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('➡️ Enviando credenciales:', data);
      await login(data);
      console.log('✅ Login exitoso');
    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center bg-light"
      style={{
        margin: 0,
        padding: '20px',
        width: '100vw',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <div className="card shadow-lg border-0 rounded-4" style={{ width: '100%', maxWidth: '420px', backgroundColor: 'white' }}>
        <div className="card-body p-5">
          {/* Logo y título */}
          <div className="text-center mb-4">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: '70px',
                height: '70px',
                backgroundColor: '#0d6efd15',
              }}
            >
              <i className="bi bi-person-badge text-primary fs-1"></i>
            </div>
            <h2 className="fw-bold text-primary mb-1">HRM System</h2>
            <p className="text-muted small mb-0">Gestión de Recursos Humanos</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                placeholder="usuario@empresa.com"
                disabled={isSubmitting}
                {...register('email')}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>

            {/* Contraseña */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                disabled={isSubmitting}
                {...register('password')}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fs-5 fw-semibold rounded-3"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Iniciando Sesión...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Línea divisoria */}
          <div className="text-center my-4">
            <hr className="my-3" />
            <small className="text-muted">Acceso exclusivo al personal autorizado</small>
          </div>

          {/* Pie */}
          <div className="text-center">
            <small className="text-secondary">© {new Date().getFullYear()} Recursos Humanos - HRM</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;