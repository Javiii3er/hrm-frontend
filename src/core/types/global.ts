// Tipos que reflejan EXACTAMENTE tus responses del backend
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    // CORRECCIÓN ESLINT/TS: unknown en lugar de any
    details?: unknown;
  };
}

// Auth Types (de tus schemas)
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'RRHH' | 'EMPLEADO';
  employee?: Employee;
  createdAt: string;
  updatedAt: string;
}

// Employee Types (de tu Prisma schema)
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

export interface Department {
  id: string;
  name: string;
  description?: string;
}