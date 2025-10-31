import { useState, useCallback } from 'react';
import { apiClient } from '@core/api/client';
import { Payroll, PayrollCreate, PayrollQuery } from '../types/payroll';

export const usePayroll = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayrolls = useCallback(async (query: PayrollQuery = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<Payroll[], PayrollQuery>('payroll', query);
      if (response.success) {
        setPayrolls(response.data || []);
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
      const errorMessage =
        err.response?.data?.error?.message || 'Error de conexión al crear nómina';
      setError(errorMessage);
      console.error(' Error creando nómina general:', errorMessage); 
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createIndividualPayroll = useCallback(
    async (employeeId: string, data: PayrollCreate): Promise<Payroll> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.post<Payroll>(
          `payroll/employee/${employeeId}`,
          data
        );

        if (response.success) {
          setPayrolls(prev => [...prev, response.data]);
          console.info('Nómina individual creada para empleado:', employeeId);
          return response.data;
        } else {
          throw new Error('Error al crear nómina individual');
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error?.message ||
          'Error de conexión al crear nómina individual';
        setError(errorMessage);
        console.error(' Error creando nómina individual:', errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generatePayrollItems = useCallback(async (payrollId: string): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(`payroll/${payrollId}/generate`);
      if (response.success) {
        console.info(`🔹 Items generados para nómina ${payrollId}`);
        return response.data;
      } else {
        throw new Error('Error al generar items de nómina');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message || 'Error de conexión al generar items';
      setError(errorMessage);
      console.error('Error generando items de nómina:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const finalizePayroll = useCallback(async (payrollId: string): Promise<Payroll> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<Payroll>(`payroll/${payrollId}/finalize`);
      if (response.success) {
        setPayrolls(prev =>
          prev.map(payroll => (payroll.id === payrollId ? response.data : payroll))
        );
        console.info(`Nómina ${payrollId} finalizada correctamente.`);
        return response.data;
      } else {
        throw new Error('Error al finalizar nómina');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message || 'Error de conexión al finalizar nómina';
      setError(errorMessage);
      console.error(' Error finalizando nómina:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    console.debug('🧹 Error limpiado desde usePayroll');
  }, []);

  return {
    payrolls,
    loading,
    error,
    fetchPayrolls,
    fetchPayroll,
    createPayroll,
    createIndividualPayroll,
    generatePayrollItems,
    finalizePayroll,
    clearError,
  };
};
