import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChangePassword } from '../hooks/useUsers';
import { useToast } from '@/core/contexts/ToastContext';

const ChangePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(50, 'La contraseña es demasiado larga'),
});

type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>;

interface Props {
  userId: string;
  onSuccess?: () => void;
}

const ChangePasswordForm: React.FC<Props> = ({ userId, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { newPassword: '' },
  });

  const changePassword = useChangePassword();
  const { showToast } = useToast();

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await changePassword.mutateAsync({ id: userId, payload: values });
      reset();
      onSuccess?.();

      showToast('success', 'Contraseña actualizada correctamente');
    } catch (err) {
      console.error('Error al cambiar la contraseña:', err);

      showToast('danger', 'Ocurrió un error al cambiar la contraseña');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card shadow-sm p-4 mt-4">
      <h5 className="mb-3">
        <i className="bi bi-shield-lock me-2"></i>
        Cambiar Contraseña
      </h5>

      {/* Nueva contraseña */}
      <div className="mb-3">
        <label className="form-label">Nueva Contraseña</label>
        <input
          type="password"
          className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
          {...register('newPassword')}
          placeholder="********"
        />
        {errors.newPassword && (
          <div className="invalid-feedback">{errors.newPassword.message}</div>
        )}
      </div>

      <div className="d-flex justify-content-end mt-3">
        <button
          type="submit"
          className="btn btn-warning"
          disabled={isSubmitting || changePassword.isPending}
        >
          {isSubmitting || changePassword.isPending ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Guardando...
            </>
          ) : (
            <>
              <i className="bi bi-key me-2"></i>Cambiar Contraseña
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
