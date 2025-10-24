export interface ReportRequest {
  type: 'PAYROLL' | 'EMPLOYEES' | 'DOCUMENTS';
  format: 'PDF' | 'EXCEL' | 'CSV';
  startDate?: string;
  endDate?: string;
  department?: string;
  filters?: Record<string, any>;
}

export interface ReportResponse {
  success: boolean;
  data: {
    downloadUrl: string;
    filename: string;
    generatedAt: string;
    recordCount: number;
  };
  message?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  availableFormats: string[];
}