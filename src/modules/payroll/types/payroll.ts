// Basado en tu Prisma schema
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

export interface PayrollItem {
  id: string;
  payrollId: string;
  employeeId: string;
  employee?: Employee;
  grossAmount: number;
  netAmount: number;
  deductions: Record<string, number>;
  createdAt: string;
}

export interface PayrollCreate {
  periodStart: string;
  periodEnd: string;
  departmentId?: string;
  description?: string;
}

export interface PayrollQuery {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  department?: string;
  status?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface PayrollResponse {
  data: Payroll[];
  meta?: {
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Tipos auxiliares
interface Department {
  id: string;
  name: string;
  description?: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  position?: string;
}