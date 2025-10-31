// src/modules/users/pages/UsersListPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';
import { UserTable } from '../components/UserTable';
import DeleteUserModal from '../components/DeleteUserModal';

export const UsersListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: users, isLoading, error, refetch } = useUsers();

  const [selectedUser, setSelectedUser] = useState<{ id: string; email?: string } | null>(null);

  if (isLoading) return <p className="text-center mt-4">Cargando usuarios...</p>;
  if (error) return <p className="text-center text-danger mt-4">Error al cargar usuarios</p>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="text-xl font-semibold mb-0">Gestión de Usuarios</h1>
        <button className="btn btn-primary" onClick={() => navigate('/users/new')}>
          <i className="bi bi-person-plus me-2"></i>
          Nuevo Usuario
        </button>
      </div>

      <UserTable
        users={users || []}
        onDelete={(user) => setSelectedUser({ id: user.id, email: user.email })}
      />

      {/* Modal de confirmación */}
      {selectedUser && (
        <DeleteUserModal
          show={!!selectedUser}
          userId={selectedUser.id}
          userEmail={selectedUser.email}
          onClose={() => setSelectedUser(null)}
          onDeleted={() => {
            refetch();
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};