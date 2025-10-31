// src/modules/users/components/UserForm.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserFormValues } from '../types';
import { useCreateUser, useUpdateUser } from '../hooks/useUsers';
import { useToast } from '@/core/contexts/ToastContext';

const UserFormSchema = z.object({
  email: z.string().email('Correo inválido').max(100),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .optional(),
  role: z.enum(['ADMIN', 'RRHH', 'EMPLEADO']),
  employeeId: z.string().uuid('ID inválido').optional().nullable(),
});

type Props = {
  defaultValues?: UserFormValues;
  userId?: string;
  onSuccess?: () => void;
};

const UserForm: React.FC<Props> = ({ defaultValues, userId, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: defaultValues ?? {
      email: '',
      password: '',
      role: 'EMPLEADO',
      employeeId: '',
    },
  });

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const { showToast } = useToast(); 

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      if (userId) {
        await updateUser.mutateAsync({ id: userId, payload: values });
        showToast('success', 'Usuario actualizado correctamente');
      } else {
        await createUser.mutateAsync(values);
        showToast('success', 'Usuario creado correctamente');
      }
      onSuccess?.();
    } catch (err: any) {
      console.error('Error guardando usuario:', err);
      showToast('danger', 'Error al guardar el usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card shadow-sm p-4">
      <h4 className="mb-3">
        <i className="bi bi-person-plus me-2"></i>
        {userId ? 'Editar Usuario' : 'Crear Usuario'}
      </h4>

      {/* Email */}
      <div className="mb-3">
        <label className="form-label">Correo Electrónico</label>
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          {...register('email')}
          placeholder="usuario@empresa.com"
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      {/* Contraseña (solo para creación) */}
      {!userId && (
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className={`form-control ${
              errors.password ? 'is-invalid' : ''
            }`}
            {...register('password')}
            placeholder="********"
          />
          {errors.password && (
            <div className="invalid-feedback">
              {errors.password.message}
            </div>
          )}
        </div>
      )}

      {/* Rol */}
      <div className="mb-3">
        <label className="form-label">Rol</label>
        <select className="form-select" {...register('role')}>
          <option value="ADMIN">Administrador</option>
          <option value="RRHH">Recursos Humanos</option>
          <option value="EMPLEADO">Empleado</option>
        </select>
      </div>

      {/* Empleado vinculado */}
      <div className="mb-3">
        <label className="form-label">ID de Empleado (opcional)</label>
        <input
          type="text"
          className={`form-control ${
            errors.employeeId ? 'is-invalid' : ''
          }`}
          {...register('employeeId')}
          placeholder="UUID del empleado"
        />
        {errors.employeeId && (
          <div className="invalid-feedback">
            {errors.employeeId.message}
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end mt-3">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={
            isSubmitting || createUser.isPending || updateUser.isPending
          }
        >
          {isSubmitting || createUser.isPending || updateUser.isPending ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Guardando...
            </>
          ) : userId ? (
            <>
              <i className="bi bi-save me-2"></i>Actualizar
            </>
          ) : (
            <>
              <i className="bi bi-plus-circle me-2"></i>Crear
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
