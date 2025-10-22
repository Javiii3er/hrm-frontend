import { useAuth as useCoreAuth } from '../../../core/contexts/useAuth';

// Hook específico del módulo auth que extiende el core
export const useAuth = () => {
  const auth = useCoreAuth();
  
  // Aquí puedes agregar lógica específica del módulo auth
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