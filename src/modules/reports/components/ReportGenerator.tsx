import React, { useState, useEffect } from 'react';
import { useReports } from '../hooks/useReports';
import { ReportRequest, ReportTemplate } from '../types/report';

const ReportGenerator: React.FC = () => {
  const { generateReport, downloadReport, getReportTemplates, loading, generating, error } = useReports();
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [formData, setFormData] = useState<ReportRequest>({
    type: 'PAYROLL',
    format: 'PDF',
    startDate: '',
    endDate: '',
    department: ''
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const templatesData = await getReportTemplates();
      setTemplates(templatesData);
      if (templatesData.length > 0) {
        setSelectedTemplate(templatesData[0]);
        setFormData(prev => ({ 
          ...prev, 
          type: templatesData[0].type as any 
        }));
      }
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    }
  };

  const handleTemplateChange = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setFormData(prev => ({ 
      ...prev, 
      type: template.type as any,
      format: template.availableFormats[0] as any
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await generateReport(formData);
      
      if (response.success && response.data.downloadUrl) {
        await downloadReport(response.data.downloadUrl, response.data.filename);
      }
    } catch (error) {
      console.error('Error generando reporte:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Generador de Reportes
              </h4>
            </div>
            
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              {/* Plantillas de Reportes */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="border-bottom pb-2 mb-3">
                    <i className="bi bi-layout-text-window me-2"></i>
                    Seleccionar Tipo de Reporte
                  </h5>
                  
                  <div className="row g-3">
                    {templates.map((template) => (
                      <div key={template.id} className="col-md-4">
                        <div 
                          className={`card cursor-pointer ${
                            selectedTemplate?.id === template.id 
                              ? 'border-primary shadow' 
                              : 'border-light'
                          }`}
                          onClick={() => handleTemplateChange(template)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="card-body text-center">
                            <i className="bi bi-file-earmark-text display-6 text-primary mb-3"></i>
                            <h6 className="card-title">{template.name}</h6>
                            <p className="card-text small text-muted">
                              {template.description}
                            </p>
                            <div className="mt-2">
                              {template.availableFormats.map(format => (
                                <span key={format} className="badge bg-secondary me-1">
                                  {format}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Formulario de Reporte */}
              {selectedTemplate && (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <h5 className="border-bottom pb-2 mb-3">
                        <i className="bi bi-gear me-2"></i>
                        Configuración del Reporte
                      </h5>
                    </div>

                    {/* Tipo y Formato */}
                    <div className="col-md-6">
                      <label htmlFor="type" className="form-label">
                        Tipo de Reporte
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedTemplate.name}
                        disabled
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="format" className="form-label">
                        Formato <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="format"
                        name="format"
                        value={formData.format}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      >
                        {selectedTemplate.availableFormats.map(format => (
                          <option key={format} value={format}>
                            {format}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Fechas */}
                    <div className="col-md-6">
                      <label htmlFor="startDate" className="form-label">
                        Fecha Inicio
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="endDate" className="form-label">
                        Fecha Fin
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>

                    {/* Departamento */}
                    <div className="col-12">
                      <label htmlFor="department" className="form-label">
                        Departamento (Opcional)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Filtrar por departamento..."
                      />
                    </div>

                    {/* Vista Previa de Configuración */}
                    <div className="col-12">
                      <div className="card border-info">
                        <div className="card-header bg-info text-white">
                          <h6 className="mb-0">
                            <i className="bi bi-eye me-2"></i>
                            Resumen del Reporte
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-4">
                              <strong>Tipo:</strong><br />
                              {selectedTemplate.name}
                            </div>
                            <div className="col-md-4">
                              <strong>Formato:</strong><br />
                              {formData.format}
                            </div>
                            <div className="col-md-4">
                              <strong>Periodo:</strong><br />
                              {formData.startDate && formData.endDate 
                                ? `${formData.startDate} a ${formData.endDate}`
                                : 'Todo el periodo'
                              }
                            </div>
                          </div>
                          {formData.department && (
                            <div className="mt-2">
                              <strong>Departamento:</strong><br />
                              {formData.department}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="d-flex gap-2 justify-content-end">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading || generating}
                        >
                          {generating ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Generando...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-download me-2"></i>
                              Generar y Descargar Reporte
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;