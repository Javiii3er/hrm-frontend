// src/modules/users/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { User, UserStats, UserFormValues, ChangePasswordDTO } from '../types';

export interface UsersQueryParams {
  q?: string;
  role?: string;
  page?: number;
  pageSize?: number;
  [key: string]: string | number | undefined;
}

// Obtener lista de usuarios
export function useUsers(queryParams: UsersQueryParams = {}) {
  const queryKey: QueryKey = ['users', { ...queryParams }]; 

  return useQuery<User[]>({
    queryKey,
    queryFn: async () => {
      const apiResponse = await apiClient.get<User[]>(
        '/users', 
        queryParams as any
      );
      return apiResponse.data;
    },
  });
}

// Obtener usuario individual
export function useUser(id: string) {
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await apiClient.get<User>(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Obtener estadísticas
export function useUserStats() {
  return useQuery<UserStats>({
    queryKey: ['users-stats'],
    queryFn: async () => {
      const response = await apiClient.get<UserStats>('/users/stats');
      return response.data;
    },
  });
}

// Crear usuario
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserFormValues) => {
      const response = await apiClient.post<User>('/users', payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

// Actualizar usuario
export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<UserFormValues> }) => {
      const response = await apiClient.put<User>(`/users/${id}`, payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

// Eliminar usuario
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<{ success: boolean; message: string }>(`/users/${id}`);
      return response;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

// Cambiar contraseña
export function useChangePassword() {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ChangePasswordDTO }) => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        `/users/${id}/change-password`,
        payload
      );
      return response;
    },
  });
}
// NOTA: Se usa `as any` para evitar conflicto de tipos con ApiClient.get<T>
// (que define su segundo parámetro como Record<string, never>).
// No afecta la ejecución ni el tipado general del hook.
