// src/core/contexts/useAuth.ts
import { useContext } from 'react';
import { AuthContext, AuthContextType } from './auth-types.js';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};