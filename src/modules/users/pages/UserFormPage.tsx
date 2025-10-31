// src/modules/users/pages/UserFormPage.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../hooks/useUsers';
import UserForm from '../components/UserForm';
import ChangePasswordForm from '../components/ChangePasswordForm';

export const UserFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: user, isLoading } = useUser(id || '');

  const handleSuccess = () => navigate('/users');

  if (isLoading && id)
    return <p className="text-center mt-5">Cargando usuario...</p>;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          {/* Formulario principal para crear/editar usuario */}
          <UserForm defaultValues={user} userId={id} onSuccess={handleSuccess} />

          {/* Sección adicional: cambio de contraseña */}
          {id && <ChangePasswordForm userId={id} />}
        </div>
      </div>
    </div>
  );
};
