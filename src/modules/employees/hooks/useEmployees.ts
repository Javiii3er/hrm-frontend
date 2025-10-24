// src/modules/employees/hooks/useEmployees.ts
import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { apiClient } from '@/core/api/client.js'; 
import { ApiError, ApiResponse } from '@/core/types/global.js';
import { 
  Employee, 
  EmployeeCreate, 
  EmployeeUpdate, 
  EmployeeQuery,
  // CORRECCIÓN ESLINT/TS6133: Quitamos 'EmployeeResponse' que no se usaba.
} from '../types/employee.js'; // Aseguramos el .js en ES Modules

// Hook similar a tu EmployeeService
export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función auxiliar para manejar la extracción segura del mensaje de error
  const getErrorMessage = (err: unknown): string => {
    if (err && (err as AxiosError<ApiError>).response) {
      // Intentamos acceder al mensaje de error de la API tipado por ApiError
      return (err as AxiosError<ApiError>).response?.data?.error?.message || 'Error de servidor desconocido.';
    }
    return 'Error de conexión o red.';
  };

  // GET Employees - como tu employee.controller.ts getEmployees
  const fetchEmployees = useCallback(async (query: EmployeeQuery = {}) => {
  setLoading(true);
  setError(null);

  try {
    const response = await apiClient.get<Employee[], EmployeeQuery>(`employees`, query);

    if (response.success) {
      setEmployees(response.data);
      return response as ApiResponse<Employee[]>;
    }

    throw new Error('Error al cargar empleados: Respuesta inesperada del servidor.');
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err);
    setError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
}, []);

  // GET Employee by ID - como tu getEmployeeById
  const fetchEmployee = useCallback(async (id: string): Promise<Employee> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<Employee>(`employees/${id}`);
      
      if (response.success) {
        return response.data;
      }
      throw new Error('Error al cargar empleado: Respuesta inesperada del servidor.');
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // CREATE Employee - como tu createEmployee
  const createEmployee = useCallback(async (employeeData: EmployeeCreate): Promise<Employee> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post<Employee>('employees', employeeData);
      
      if (response.success) {
        setEmployees(prev => [...prev, response.data]);
        return response.data;
      }
      throw new Error('Error al crear empleado: Respuesta inesperada del servidor.');
    } catch (err: unknown) { 
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // UPDATE Employee - como tu updateEmployee
  const updateEmployee = useCallback(async (id: string, employeeData: EmployeeUpdate): Promise<Employee> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.put<Employee>(`employees/${id}`, employeeData);
      
      if (response.success) {
        setEmployees(prev => prev.map(emp => 
          emp.id === id ? response.data : emp
        ));
        return response.data;
      }
      throw new Error('Error al actualizar empleado: Respuesta inesperada del servidor.');
    } catch (err: unknown) { 
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // DELETE Employee - como tu deleteEmployee
  const deleteEmployee = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // El tipo T en ApiResponse<T> para DELETE se establece en un objeto vacío o null.
      const response = await apiClient.delete<object>(`employees/${id}`);
      
      if (response.success) {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
      } else {
        throw new Error('Error al eliminar empleado: Respuesta inesperada del servidor.');
      }
    } catch (err: unknown) { 
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    fetchEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    clearError,
  };
};