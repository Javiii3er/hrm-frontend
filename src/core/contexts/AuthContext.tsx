// src/core/contexts/AuthContext.tsx

import React, { useReducer, useEffect, ReactNode } from 'react';

// Importamos el Contexto y su Tipo desde el archivo auth-types
import { AuthContext, AuthContextType } from './auth-types.js'; 

// Importamos los tipos de datos necesarios
import { User, LoginRequest, AuthResponse, ApiError } from '../types/global.js'; 
import { apiClient } from '../api/client.js';
import { AxiosError } from 'axios'; 

// ------------------------------------------------------------------
// 1. Tipos de Acciones y Estado (Movidos a auth-types.ts, solo quedan los que usa el reducer)
// ------------------------------------------------------------------

// NOTA: AuthState y AuthContextType se movieron a auth-types.ts
// Solo el reducer y el initial state se mantienen aquí.

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };


// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Reducer 
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// ------------------------------------------------------------------
// 2. AuthProvider Component (ÚNICA exportación para Fast Refresh)
// ------------------------------------------------------------------

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await apiClient.get<User>('/auth/me'); 
          
          if (response.success) {
            dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
          } else {
            throw new Error('No se pudo verificar la autenticación'); 
          }
        } catch (error) {
          console.error('Error verificando autenticación:', error);
          dispatch({ type: 'AUTH_FAILURE', payload: 'Sesión expirada o inválida' });
        }
      }
      if (state.isLoading) {
          dispatch({ type: 'CLEAR_ERROR' }); 
      }
    };

    checkAuth();
  }, [state.isLoading]);

  // Login
  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      if (response.success) {
        const { accessToken, user } = response.data;
        apiClient.setToken(accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken); 
        
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } 
    } catch (error: unknown) {
      let errorMessage = 'Error de conexión. Intenta de nuevo.';

      if (error && (error as AxiosError<ApiError>).response) {
        const apiError = (error as AxiosError<ApiError>).response?.data?.error;
        errorMessage = apiError?.message || 'Error de servidor desconocido.';
      }
      
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Logout
  const logout = () => {
    apiClient.removeToken();
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  // Verificar roles
  const hasRole = (roles: string[]): boolean => {
    // Aquí usamos state.user de AuthState que fue definido localmente
    if (!state.user) return false; 
    return roles.includes(state.user.role); 
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};