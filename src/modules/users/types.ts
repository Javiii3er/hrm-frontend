// src/modules/users/types.ts
export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'RRHH' | 'EMPLEADO';
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    position?: string;
    department?: { name: string };
  };
}

export interface UserStats {
  total: number;
  byRole: { role: string; count: number }[];
  withEmployee: number;
  withoutEmployee: number;
}

export interface UserFormValues {
  email: string;
  password?: string;
  role: 'ADMIN' | 'RRHH' | 'EMPLEADO';
  employeeId?: string | null;
}

export interface ChangePasswordDTO {
  newPassword: string;
}
