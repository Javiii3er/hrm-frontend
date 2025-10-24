// src/modules/documents/hooks/useDocuments.ts
import { useState, useCallback } from 'react';
import { apiClient } from '@core/api/client';
import {
  Document,
  DocumentUpload,
  DocumentQuery,
  DocumentResponse
} from '../types/document';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchDocuments = useCallback(async (query: DocumentQuery = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<DocumentResponse>('/documents', { params: query } as any);

      if (response.success) {
        setDocuments(response.data.data);
        return response;
      } else {
        throw new Error('Error al cargar documentos');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Error de conexión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ UPLOAD Document
  const uploadDocument = useCallback(async (documentData: DocumentUpload): Promise<Document> => {
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('document', documentData.file);
    formData.append('employeeId', documentData.employeeId);
    if (documentData.description) formData.append('description', documentData.description);
    if (documentData.tags) formData.append('tags', JSON.stringify(documentData.tags));

    try {
      const response = await apiClient.post<Document>(
        `/employees/${documentData.employeeId}/documents`,
        formData
      );

      if (response.success) {
        setDocuments(prev => [...prev, response.data]);
      }

      setUploadProgress(0);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Error al subir documento';
      setError(errorMessage);
      setUploadProgress(0);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ DOWNLOAD Document
  const downloadDocument = useCallback(async (documentId: string, filename: string): Promise<void> => {
    try {
      const response = await apiClient.get(`/documents/${documentId}/download`, {
        responseType: 'blob'
      } as any);

      const blob = new Blob([response.data as Blob]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Error descargando documento';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // ✅ DELETE Document
  const deleteDocument = useCallback(async (documentId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.delete(`/documents/${documentId}`);

      if (response.success) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      } else {
        throw new Error('Error al eliminar documento');
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
    documents,
    loading,
    error,
    uploadProgress,
    fetchDocuments,
    uploadDocument,
    downloadDocument,
    deleteDocument,
    clearError,
  };
};