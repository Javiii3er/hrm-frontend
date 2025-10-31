// src/modules/profile/hooks/useProfile.ts
import { useState, useCallback } from 'react';
import { apiClient } from '@/core/api/client';
import { ApiError, User } from '@/core/types/global';
import { AxiosError } from 'axios';

export interface UpdateProfileDTO {
  email?: string;
  newPassword?: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (err: unknown): string => {
    if ((err as AxiosError<ApiError>).response) {
      return (
        (err as AxiosError<ApiError>).response?.data?.error?.message ||
        'Error desconocido del servidor.'
      );
    }
    return 'Error de conexión o red.';
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<User>('profile');
      if (response.success) {
        setProfile(response.data);
        return response.data;
      }
      throw new Error('Respuesta inesperada del servidor.');
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileDTO) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.put<User>('profile', data);
      if (response.success) {
        setProfile(response.data);
        return response.data;
      }
      throw new Error('Respuesta inesperada del servidor.');
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, loading, error, fetchProfile, updateProfile };
};
