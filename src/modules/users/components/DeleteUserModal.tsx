// src/modules/users/components/DeleteUserModal.tsx
import React, { useState } from 'react';
import { useDeleteUser } from '../hooks/useUsers';
import AlertMessage from '@/components/AlertMessage';

interface Props {
  userId: string;
  userEmail?: string;
  show: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

const DeleteUserModal: React.FC<Props> = ({
  userId,
  userEmail,
  show,
  onClose,
  onDeleted,
}) => {
  const deleteUser = useDeleteUser();
  const [alert, setAlert] = useState<{
    type: 'success' | 'danger';
    message: string;
  } | null>(null);

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync(userId);
      setAlert({ type: 'success', message: 'Usuario eliminado correctamente.' });

      onDeleted?.();
      setTimeout(() => {
        setAlert(null);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setAlert({
        type: 'danger',
        message: 'Ocurrió un error al eliminar el usuario.',
      });
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          {/* Alerta visual dentro del modal */}
          {alert && (
            <div className="p-3 pt-3 pb-0">
              <AlertMessage
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Confirmar eliminación
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <p>
              ¿Estás seguro de que deseas eliminar al usuario{' '}
              <strong>{userEmail || 'seleccionado'}</strong>?
            </p>
            <p className="text-muted small">
              Esta acción no se puede deshacer. Si el usuario es administrador,
              asegúrate de no eliminar el último.
            </p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Eliminando...
                </>
              ) : (
                <>
                  <i className="bi bi-trash3 me-2"></i>Eliminar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;