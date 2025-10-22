// src/modules/auth/components/LoginForm.tsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // Asegúrate que la ruta a useAuth sea correcta si la moviste
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const LoginSchema = z.object({
  email: z.string().email('Formato de correo electrónico inválido').min(1, 'El correo es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof LoginSchema>;

const LoginForm: React.FC = () => {
  // Nota: Asumo que 'error' y 'clearError' fueron removidos de useAuth, 
  // ya que la nueva versión del AuthContext no los tiene. 
  // Si los necesitas, deben ser reintroducidos en useAuth.
  const { login, isAuthenticated } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    // Eliminamos watch y los useEffect asociados a errores si ya no son manejados por el contexto
    // watch, 
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: 'onTouched',
  });

  // Si decides reintroducir la limpieza de errores al cambiar campos, mantén este useEffect:
  /*
  const watchedFields = watch(['email', 'password']);
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [watchedFields, clearError, error]);
  */

// --- 4. useEffect de Redirección Actualizado con Log ---
  useEffect(() => {
    // Log de depuración
    console.log('🔄 Verificando autenticación...', isAuthenticated);
    
    if (isAuthenticated) {
      const state = (location.state || {}) as LocationState;
      // Corregimos la forma de acceder al estado para que coincida con tu solicitud de log
      const from = state.from?.pathname || '/dashboard'; 
      
      // Log de depuración
      console.log('🎯 Redirigiendo a:', from);
      
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

// --- 3. Función onSubmit Actualizada con Logs y manejo de envío ---
  const onSubmit = async (data: LoginFormData) => {
    // clearError(); // Descomentar si decides reintroducir la función clearError en useAuth
    try {
      // Log de depuración
      console.log('🎯 Iniciando login...');
      
      await login(data);
      
      // Log de depuración (solo se ejecuta si 'login' fue exitoso y no lanzó error)
      console.log('✅ Login exitoso en el hook');
      
      // Nota: La redirección se maneja automáticamente por el useEffect de arriba.
      
    } catch (error) {
      // Log de depuración
      console.error('❌ Error en el formulario:', error);
      
      // Aquí podrías agregar lógica para mostrar el error al usuario si el AuthContext no lo hace
      // Por ejemplo: setError('password', { type: 'manual', message: 'Credenciales inválidas' });
      
    } 
    // Nota: react-hook-form maneja isSubmitting automáticamente con la llamada a handleSubmit(onSubmit)
  };

  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="card-title text-primary">
                  <i className="bi bi-person-badge me-2"></i>
                  HRM System
                </h2>
                <p className="text-muted">Ingresa a tu cuenta</p>
              </div>

              {/* Formulario */}
              {/* Nota: handleSubmit toma la función onSubmit */}
              <form onSubmit={handleSubmit(onSubmit)} noValidate> 
                
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    // Nota: Si 'error' no existe en useAuth, debes removerlo de la validación
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    placeholder="usuario@empresa.com"
                    disabled={isSubmitting}
                    {...register('email')}
                  />
                  {/* Error de validación de React Hook Form */}
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email.message}</div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    // Nota: Si 'error' no existe en useAuth, debes removerlo de la validación
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    {...register('password')}
                  />
                  {/* Error de validación de React Hook Form */}
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password.message}</div>
                  )}
                </div>

                {/* Mensaje de Error del Backend */}
                {/* Si usas react-hook-form para mostrar errores de backend, esta sección cambiaría */}
                {/* {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{error}</div>
                  </div>
                )} */}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
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

              {/* Info adicional */}
              <div className="mt-4 text-center">
                <small className="text-muted">
                  Sistema de Gestión de Recursos Humanos
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;