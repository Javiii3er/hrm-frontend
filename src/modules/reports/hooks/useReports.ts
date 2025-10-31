// src/modules/reports/hooks/useReports.ts
import { useState, useCallback } from 'react';
import { apiClient } from '@core/api/client';
import { ReportRequest, ReportResponse, ReportTemplate } from '../types/report';
import type { ApiResponse } from '@core/types/api.gen.ts';

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  //  GENERATE Report
  const generateReport = useCallback(async (reportRequest: ReportRequest): Promise<ReportResponse> => {
    setLoading(true);
    setGenerating(true);
    setError(null);

    try {
      const response: ApiResponse<ReportResponse> = await apiClient.post('/reports/generate', reportRequest);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error generando reporte');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Error de conexión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  }, []);

  // DOWNLOAD Report
  const downloadReport = useCallback(async (downloadUrl: string, filename: string): Promise<void> => {
    try {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      const errorMessage = 'Error descargando reporte';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // GET Report Templates
  const getReportTemplates = useCallback(async (): Promise<ReportTemplate[]> => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<ReportTemplate[]> = await apiClient.get('/reports/templates');

      if (response.success) {
        return response.data;
      } else {
        throw new Error('Error cargando plantillas de reportes');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Error de conexión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    loading,
    generating,
    error,
    generateReport,
    downloadReport,
    getReportTemplates,
    clearError,
  };
};
