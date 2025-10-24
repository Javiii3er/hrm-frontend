// src/modules/payroll/hooks/usePayroll.ts
import { useState, useCallback } from 'react';
import { apiClient } from '@core/api/client';
import { 
  Payroll, 
  PayrollCreate, 
  PayrollQuery,
  PayrollResponse 
} from '../types/payroll';

export const usePayroll = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET Payrolls
  const fetchPayrolls = useCallback(async (query: PayrollQuery = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // pass query as request params and cast to any to satisfy apiClient signature
      const response = await apiClient.get<PayrollResponse>('payroll', { params: query } as any);
      
      if (response.success) {
        setPayrolls(response.data.data); // 👈 cambio aquí
        return response;
      } else {
        throw new Error('Error al cargar nóminas');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Error de conexión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // GET Payroll by ID
  const fetchPayroll = useCallback(async (id: string): Promise<Payroll> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<Payroll>(`payroll/${id}`);
      if (response.success) {
        return response.data;
      } else {
        throw new Error('Error al cargar nómina');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Error de conexión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // CREATE Payroll
  const createPayroll = useCallback(async (payrollData: PayrollCreate): Promise<Payroll> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post<Payroll>('payroll', payrollData);
      if (response.success) {
        setPayrolls(prev => [...prev, response.data]);
        return response.data;
      } else {
        throw new Error('Error al crear nómina');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Error de conexión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // GENERATE Payroll Items
  const generatePayrollItems = useCallback(async (payrollId: string): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post(`payroll/${payrollId}/generate`);
      if (response.success) {
        return response.data;
      } else {
        throw new Error('Error al generar items de nómina');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Error de conexión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // FINALIZE Payroll
  const finalizePayroll = useCallback(async (payrollId: string): Promise<Payroll> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post<Payroll>(`payroll/${payrollId}/finalize`);
      if (response.success) {
        setPayrolls(prev => prev.map(payroll => 
          payroll.id === payrollId ? response.data : payroll
        ));
        return response.data;
      } else {
        throw new Error('Error al finalizar nómina');
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
    payrolls,
    loading,
    error,
    fetchPayrolls,
    fetchPayroll,
    createPayroll,
    generatePayrollItems,
    finalizePayroll,
    clearError,
  };
};