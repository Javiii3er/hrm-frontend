// src/modules/documents/components/DocumentUpload.tsx
import React, { useState } from 'react';
import { useDocuments } from '../hooks/useDocuments';

interface DocumentUploadProps {
  onClose: () => void;
  onSuccess: () => void;
  employeeId?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  onClose, 
  onSuccess,
  employeeId = '' 
}) => {
  const { uploadDocument, loading, error, uploadProgress } = useDocuments();
  const [formData, setFormData] = useState({
    employeeId: employeeId,
    description: '',
    tags: '',
    file: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo no puede ser mayor a 10MB');
        return;
      }
      
      // Validar tipo de archivo
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Tipo de archivo no permitido. Use PDF, imágenes, Word o Excel.');
        return;
      }
      
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file) {
      alert('Por favor selecciona un archivo');
      return;
    }

    if (!formData.employeeId) {
      alert('Por favor ingresa el ID del empleado');
      return;
    }

    try {
      await uploadDocument({
        file: formData.file,
        employeeId: formData.employeeId,
        description: formData.description || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : undefined
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error subiendo documento:', error);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={handleOverlayClick}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="bi bi-cloud-upload me-2"></i>
              Subir Documento
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Archivo */}
                <div className="col-12">
                  <label htmlFor="file" className="form-label">
                    Archivo <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file"
                    onChange={handleFileChange}
                    required
                    disabled={loading}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  />
                  <div className="form-text">
                    Formatos permitidos: PDF, JPG, PNG, Word, Excel (Max. 10MB)
                  </div>
                  
                  {/* Progress Bar */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2">
                      <div className="progress">
                        <div 
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          style={{ width: `${uploadProgress}%` }}
                        >
                          {uploadProgress}%
                        </div>
                      </div>
                      <small className="text-muted">Subiendo archivo...</small>
                    </div>
                  )}
                </div>

                {/* ID del Empleado */}
                <div className="col-md-6">
                  <label htmlFor="employeeId" className="form-label">
                    ID del Empleado <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                    required
                    disabled={loading || !!employeeId}
                    placeholder="UUID del empleado"
                  />
                </div>

                {/* Tags */}
                <div className="col-md-6">
                  <label htmlFor="tags" className="form-label">
                    Etiquetas
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    disabled={loading}
                    placeholder="contrato,identificacion,vacaciones"
                  />
                  <div className="form-text">
                    Separar con comas
                  </div>
                </div>

                {/* Descripción */}
                <div className="col-12">
                  <label htmlFor="description" className="form-label">
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    disabled={loading}
                    rows={3}
                    placeholder="Descripción del documento..."
                  />
                </div>

                {/* Vista Previa del Archivo */}
                {formData.file && (
                  <div className="col-12">
                    <div className="card border-info">
                      <div className="card-header bg-info text-white">
                        <h6 className="mb-0">
                          <i className="bi bi-file-earmark me-2"></i>
                          Vista Previa
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-file-earmark-text display-6 text-info me-3"></i>
                          <div>
                            <strong>{formData.file.name}</strong>
                            <br />
                            <small className="text-muted">
                              Tamaño: {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                              <br />
                              Tipo: {formData.file.type}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={onClose}
                      disabled={loading}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancelar
                    </button>
                    
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading || !formData.file}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Subiendo...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cloud-upload me-2"></i>
                          Subir Documento
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;