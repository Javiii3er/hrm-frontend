// src/modules/auth/hooks/useAuth.ts
import { useAuth as useCoreAuth } from '../../../core/contexts/useAuth';

export const useAuth = () => {
  const auth = useCoreAuth();
  

  const isAdmin = auth.hasRole(['ADMIN']);
  const isHR = auth.hasRole(['RRHH']);
  const isEmployee = auth.hasRole(['EMPLEADO']);
  
  return {
    ...auth,
    isAdmin,
    isHR,
    isEmployee,
  };
};