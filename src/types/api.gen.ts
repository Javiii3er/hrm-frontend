/* eslint-disable */
// =============================================
// TIPOS PARA FRONTEND - GENERADOS RÁPIDAMENTE
// Basados en la estructura actual del backend
// =============================================

// Utilizamos 'unknown' en lugar de 'any' para mejor tipado, aunque se sigue silenciando el error.
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
    // Usamos 'unknown' en lugar de 'any' aquí
    details?: unknown; 
  };
}

// ==================== AUTENTICACIÓN ====================
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

// ==================== EMPLEADOS ====================
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

// NUEVO TIPO REQUERIDO: Si la API devuelve una estructura con paginación
export interface EmployeeListResponse {
  employees: Employee[];
  // Los metadatos de paginación pueden estar aquí o en el ApiResponse.meta
  meta?: {
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
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

export interface EmployeeUpdate extends Partial<EmployeeCreate> {}

export interface EmployeeQuery {
  page?: number;
  pageSize?: number;
  q?: string;
  department?: string;
  status?: string;
}

// ==================== DEPARTAMENTOS ====================
export interface Department {
  id: string;
  name: string;
  description?: string;
}


export interface Payroll {
  id: string;
  periodStart: string;
  periodEnd: string;
  description?: string;
  departmentId?: string;
  department?: Department;
  status: 'DRAFT' | 'FINALIZED' | 'PAID';
  items?: PayrollItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PayrollCreate {
  periodStart: string;
  periodEnd: string;
  departmentId?: string;
  description?: string;
}

export interface PayrollItem {
  id: string;
  payrollId: string;
  employeeId: string;
  employee?: Employee;
  grossAmount: number;
  netAmount: number;
  // Usamos Record<string, number> para tipar el objeto de deducciones
  deductions: Record<string, number>; 
  createdAt: string;
}

export interface PayrollQuery {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  department?: string;
  status?: string;
}

// ==================== DOCUMENTOS ====================
export interface Document {
  id: string;
  employeeId: string;
  filename: string;
  storageKey: string;
  mimeType?: string;
  size?: number;
  tags?: string[];
  description?: string;
  uploadedBy: string;
  uploader?: User;
  createdAt: string;
  updatedAt: string;
}

// ==================== USUARIOS ====================
export interface UserQuery {
  page?: number;
  pageSize?: number;
  q?: string;
  role?: string;
}

// ==================== CLIENTE API ====================
export interface ApiClientConfig {
  baseURL: string;
  token?: string;
}

export class ApiClient {
  private baseURL: string;
  private token?: string;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.token = config.token;
  }

  // CORRECCIÓN CLAVE: setToken ahora acepta string | undefined
  setToken(token: string | undefined) {
    this.token = token;
  }

  // FUNCIÓN REQUEST AJUSTADA PARA SOLUCIONAR EL ERROR 7053
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Usamos Record<string, string> para permitir indexación y luego convertimos a HeadersInit
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json',
      // Copiamos los headers existentes, forzando el tipo para evitar el error TS7053
      ...(options.headers as Record<string, string> || {}), 
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: headers as HeadersInit, // Pasamos el objeto ajustado a fetch
    });

    const data = await response.json();

    if (!response.ok) {
      // Lanzamos un error con un mensaje útil
      throw new Error(data.error?.message || `Request failed with status ${response.status}`);
    }

    return data;
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  // Employee methods
  // CAMBIO EN LA RESPUESTA: Usamos EmployeeListResponse para manejar paginación
  async getEmployees(params?: EmployeeQuery): Promise<ApiResponse<EmployeeListResponse>> {
    // AJUSTE: Usamos Record<string, any> para que URLSearchParams pueda manejar el objeto
    const query = new URLSearchParams(params as Record<string, any>).toString(); 
    return this.request<EmployeeListResponse>('/employees' + (query ? `?${query}` : ''));
  }

  async getEmployee(id: string): Promise<ApiResponse<Employee>> {
    return this.request<Employee>(`/employees/${id}`);
  }

  async createEmployee(data: EmployeeCreate): Promise<ApiResponse<Employee>> {
    return this.request<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEmployee(id: string, data: EmployeeUpdate): Promise<ApiResponse<Employee>> {
    return this.request<Employee>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEmployee(id: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return this.request(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // Payroll methods
  async getPayrolls(params?: PayrollQuery): Promise<ApiResponse<Payroll[]>> {
    // AJUSTE: Usamos Record<string, any>
    const query = new URLSearchParams(params as Record<string, any>).toString();
    return this.request<Payroll[]>(`/payroll${query ? `?${query}` : ''}`);
  }

  async createPayroll(data: PayrollCreate): Promise<ApiResponse<Payroll>> {
    return this.request<Payroll>('/payroll', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // User methods
  async getUsers(params?: UserQuery): Promise<ApiResponse<User[]>> {
    // AJUSTE: Usamos Record<string, any>
    const query = new URLSearchParams(params as Record<string, any>).toString();
    return this.request<User[]>(`/users${query ? `?${query}` : ''}`);
  }
}