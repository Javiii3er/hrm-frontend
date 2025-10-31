// src/modules/users/components/UserTable.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface Props {
  users: User[];
  onDelete?: (user: User) => void;
}

export const UserTable: React.FC<Props> = ({ users, onDelete }) => {
  const navigate = useNavigate();

  return (
    <table className="table table-bordered table-hover align-middle">
      <thead className="table-light">
        <tr>
          <th>Email</th>
          <th>Rol</th>
          <th>Empleado</th>
          <th className="text-center" style={{ width: '150px' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td className="text-capitalize">{u.role}</td>
              <td>
                {u.employee
                  ? `${u.employee.firstName} ${u.employee.lastName}`
                  : '—'}
              </td>
              <td className="text-center">
                <button
                  onClick={() => navigate(`/users/${u.id}/edit`)}
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  onClick={() => onDelete?.(u)}
                  className="btn btn-sm btn-outline-danger"
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center text-muted py-3">
              No hay usuarios registrados.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
