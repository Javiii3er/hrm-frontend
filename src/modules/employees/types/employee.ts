// Basado en tu Prisma schema y api.gen.ts
export interface Employee {
  id: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId: string;
  department?: Department;
  position?: string;
  hireDate?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'VACATION';
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface EmployeeCreate {
  nationalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId: string;
  position?: string;
  hireDate?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'VACATION';
}

// CORRECCIÓN ESLint: Eliminamos la interfaz redundante.
// En su lugar, usa Partial<EmployeeCreate> directamente donde sea necesario,
// o si es *absolutamente* necesario, usa un type alias:
export type EmployeeUpdate = Partial<EmployeeCreate>;


export interface EmployeeQuery {
  page?: number;
  pageSize?: number;
  q?: string;
  department?: string;
  status?: string;

  [key: string]: string | number | boolean | undefined;
}

export interface EmployeeResponse {
  data: Employee[];
  meta?: {
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Tipos auxiliares (de tu backend)
interface Department {
  id: string;
  name: string;
  description?: string;
}

interface User {
  id: string;
  email: string;
  role: string;
}