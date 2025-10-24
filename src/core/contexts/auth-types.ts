// src/core/contexts/auth-types.ts
import React from 'react';
import { User, LoginRequest } from '../types/global.js';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  hasRole: (roles: string[]) => boolean;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);