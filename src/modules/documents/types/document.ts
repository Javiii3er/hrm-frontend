// src/modules/documents/types/document.ts
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
  employee?: Employee;
}

export interface DocumentUpload {
  file: File;
  employeeId: string;
  description?: string;
  tags?: string[];
}

export interface DocumentQuery {
  page?: number;
  pageSize?: number;
  employeeId?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
}

export interface DocumentResponse {
  data: Document[];
  meta?: {
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Tipos auxiliares
interface User {
  id: string;
  email: string;
  role: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
}