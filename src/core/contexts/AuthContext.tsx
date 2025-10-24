// src/core/contexts/AuthContext.tsx
import React, { useReducer, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType } from './auth-types.js';
import { User, LoginRequest, AuthResponse, ApiError } from '../types/global.js';
import { apiClient } from '../api/client.js';
import { AxiosError } from 'axios';

/* -------------------------------------------------------------
   🔹 Tipos de estado y acciones
------------------------------------------------------------- */
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

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/* -------------------------------------------------------------
   🔹 Reducer de autenticación
------------------------------------------------------------- */
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };

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
      return { ...initialState };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

/* -------------------------------------------------------------
   🔹 AuthProvider
------------------------------------------------------------- */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /* ---------------------------------------------------------
     ✅ Verificación inicial de sesión (CheckAuth)
  --------------------------------------------------------- */
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return; // No hay token, salir sin intentar nada.

      try {
        dispatch({ type: 'AUTH_START' });
        // ❗️Quitar la barra inicial evita rutas mal formadas: //auth/me
        const response = await apiClient.get<User>('auth/me');

        if (response && response.success && response.data) {
          dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
        } else {
          dispatch({ type: 'AUTH_FAILURE', payload: 'No se pudo verificar la autenticación' });
        }
      } catch (error) {
        console.error('⚠️ Error verificando autenticación:', error);
        dispatch({ type: 'AUTH_FAILURE', payload: 'Sesión expirada o inválida' });
      }
    };

    checkAuth();
    // Solo correr una vez al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------------------------------------
     ✅ Login
  --------------------------------------------------------- */
  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });

      // ❗️Eliminar "/" para evitar doble barra en URL
      const response = await apiClient.post<AuthResponse>('auth/login', credentials);

      if (response.success && response.data) {
        const { accessToken, refreshToken, user } = response.data;

        // Guardar tokens
        apiClient.setToken(accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else {
        throw new Error('Credenciales inválidas o respuesta inesperada del servidor.');
      }
    } catch (error: unknown) {
      let errorMessage = 'Error de conexión. Intenta de nuevo.';

      if (error && (error as AxiosError<ApiError>).response) {
        const apiError = (error as AxiosError<ApiError>).response?.data?.error;
        errorMessage = apiError?.message || 'Error de servidor desconocido.';
      }

      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error; // Re-lanzamos el error para que el componente (LoginForm) lo capture
    }
  };

  /* ---------------------------------------------------------
     ✅ Logout
  --------------------------------------------------------- */
  const logout = () => {
    apiClient.removeToken();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  /* ---------------------------------------------------------
     ✅ Roles y errores
  --------------------------------------------------------- */
  const hasRole = (roles: string[]): boolean => {
    return state.user ? roles.includes(state.user.role) : false;
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  /* ---------------------------------------------------------
     ✅ Valor del contexto
  --------------------------------------------------------- */
  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
