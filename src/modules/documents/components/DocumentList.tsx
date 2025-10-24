// src/modules/documents/components/DocumentList.tsx
import React, { useState, useEffect } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { DocumentQuery } from '../types/document';
import DocumentUpload from './DocumentUpload.tsx';

const DocumentList: React.FC = () => {
  const { documents, loading, error, fetchDocuments, downloadDocument, deleteDocument } = useDocuments();
  const [query, setQuery] = useState<DocumentQuery>({
    page: 1,
    pageSize: 10,
    startDate: '',
    endDate: '',
    employeeId: ''
  });
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchDocuments(query);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments({ ...query, page: 1 });
  };

  const handleDownload = async (documentId: string, filename: string) => {
    try {
      await downloadDocument(documentId, filename);
    } catch (error) {
      console.error('Error descargando documento:', error);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      try {
        await deleteDocument(documentId);
      } catch (error) {
        console.error('Error eliminando documento:', error);
      }
    }
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string | undefined) => {
    if (!mimeType) return 'bi-file-earmark';
    
    if (mimeType.includes('pdf')) return 'bi-file-pdf';
    if (mimeType.includes('image')) return 'bi-file-image';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'bi-file-word';
    if (mimeType.includes('excel') || mimeType.includes('sheet')) return 'bi-file-excel';
    return 'bi-file-earmark';
  };

  if (loading && documents.length === 0) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-folder me-2"></i>
          Gestión de Documentos
        </h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowUpload(true)}
        >
          <i className="bi bi-cloud-upload me-2"></i>
          Subir Documento
        </button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <DocumentUpload 
          onClose={() => setShowUpload(false)}
          onSuccess={() => {
            setShowUpload(false);
            fetchDocuments(query);
          }}
        />
      )}

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-3">
                <label htmlFor="startDate" className="form-label">Desde</label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  value={query.startDate}
                  onChange={(e) => setQuery(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="endDate" className="form-label">Hasta</label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  value={query.endDate}
                  onChange={(e) => setQuery(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="employeeId" className="form-label">Empleado</label>
                <input
                  type="text"
                  className="form-control"
                  id="employeeId"
                  placeholder="ID del empleado..."
                  value={query.employeeId}
                  onChange={(e) => setQuery(prev => ({ ...prev, employeeId: e.target.value }))}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-outline-primary w-100">
                  <i className="bi bi-search me-2"></i>
                  Buscar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => {}}></button>
        </div>
      )}

      {/* Documents Table */}
      <div className="card">
        <div className="card-body">
          {documents.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-folder display-1 text-muted"></i>
              <h4 className="mt-3">No hay documentos</h4>
              <p className="text-muted">Comienza subiendo el primer documento.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Documento</th>
                    <th>Empleado</th>
                    <th>Descripción</th>
                    <th>Tamaño</th>
                    <th>Subido por</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((document) => (
                    <tr key={document.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className={`bi ${getFileIcon(document.mimeType)} text-primary me-2 fs-5`}></i>
                          <div>
                            <div className="fw-bold">{document.filename}</div>
                            <small className="text-muted">
                              {document.mimeType || 'Tipo desconocido'}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        {document.employee ? (
                          <div>
                            {document.employee.firstName} {document.employee.lastName}
                            <br />
                            <small className="text-muted">{document.employee.nationalId}</small>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>{document.description || 'Sin descripción'}</td>
                      <td>{formatFileSize(document.size)}</td>
                      <td>{document.uploader?.email || 'Sistema'}</td>
                      <td>
                        {new Date(document.createdAt).toLocaleDateString('es-ES')}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => handleDownload(document.id, document.filename)}
                            title="Descargar"
                          >
                            <i className="bi bi-download"></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(document.id)}
                            title="Eliminar"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentList;