// src/core/contexts/auth-types.ts

import React from 'react';
// Importamos los tipos reales desde tu archivo de tipos global
import { User, LoginRequest } from '../types/global.js'; 

// ------------------------------------------------------------------
// TIPOS DE ESTADO Y CONTEXTO
// ------------------------------------------------------------------

interface AuthState {
  // CORREGIDO: Usamos User | null
  user: User | null; 
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Define AuthContextType y expórtalo
export interface AuthContextType extends AuthState {
  // CORREGIDO: Usamos LoginRequest
  login: (credentials: LoginRequest) => Promise<void>; 
  logout: () => void;
  clearError: () => void;
  hasRole: (roles: string[]) => boolean;
}

// Define y exporta el objeto AuthContext
export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);