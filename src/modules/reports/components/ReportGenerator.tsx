// src/modules/reports/components/ReportGenerator.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../hooks/useReports';
import { ReportRequest, ReportTemplate } from '../types/report';
import { useToast } from '@/core/contexts/ToastContext'; 

const ReportGenerator: React.FC = () => {
  const { generateReport, downloadReport, getReportTemplates, loading, generating, error } = useReports();
  const { showToast } = useToast();
  const navigate = useNavigate();

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
      showToast('info', 'Plantillas de reporte cargadas correctamente.');
    } catch (error) {
      console.error('Error cargando plantillas:', error);
      showToast('danger', 'No se pudieron cargar las plantillas de reportes.');
    }
  };

  const handleTemplateChange = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setFormData(prev => ({ 
      ...prev, 
      type: template.type as any,
      format: template.availableFormats[0] as any
    }));
    showToast('info', `Plantilla seleccionada: ${template.name}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await generateReport(formData);
      
      if (response.success && response.data.downloadUrl) {
        await downloadReport(response.data.downloadUrl, response.data.filename);
        showToast('success', 'Reporte generado y descargado correctamente.');
      } else {
        showToast('warning', 'No se encontró un archivo para descargar.');
      }
    } catch (error) {
      console.error('Error generando reporte:', error);
      showToast('danger', 'Error al generar el reporte. Intente nuevamente.');
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
      {/* 🔙 Encabezado principal con botón de regreso */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Volver
          </button>

          <h2 className="mb-0">
            <i className="bi bi-graph-up me-2"></i>
            Generador de Reportes
          </h2>
        </div>
      </div>

      {/* 🔧 Indicador visual de desarrollo */}
      <div className="alert alert-warning shadow-sm border-start border-4 border-warning mb-4" role="alert">
        <div className="d-flex align-items-center">
          <i className="bi bi-tools fs-4 me-3 text-warning"></i>
          <div>
            <strong>⚠️ Esta interfaz aún está en implementación.</strong><br />
            Algunas funcionalidades pueden no estar disponibles o encontrarse en desarrollo.
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm border-light">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-layout-text-window me-2"></i>
                  Configuración del Generador
                </h4>
              </div>
            </div>
            
            <div className="card-body">
              {/* ⚠️ Error global */}
              {error && (
                <div className="alert alert-danger shadow-sm border-start border-4 border-danger mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              {/* 📁 Plantillas de Reportes */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="border-bottom pb-2 mb-3">
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Seleccionar Tipo de Reporte
                  </h5>
                  
                  {templates.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-inbox display-1 text-muted"></i>
                      <h4 className="mt-3">No hay plantillas disponibles</h4>
                      <p className="text-muted">Por favor, verifique la conexión o intente recargar.</p>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {templates.map((template) => (
                        <div key={template.id} className="col-md-4">
                          <div 
                            className={`card cursor-pointer ${
                              selectedTemplate?.id === template.id 
                                ? 'border-primary shadow-sm' 
                                : 'border-light'
                            }`}
                            onClick={() => handleTemplateChange(template)}
                            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
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
                  )}
                </div>
              </div>

              {/* ⚙️ Formulario de Reporte */}
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
                      <label htmlFor="type" className="form-label fw-semibold">
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
                      <label htmlFor="format" className="form-label fw-semibold">
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
                      <label htmlFor="startDate" className="form-label fw-semibold">
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
                      <label htmlFor="endDate" className="form-label fw-semibold">
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
                      <label htmlFor="department" className="form-label fw-semibold">
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

                    {/* 👁️ Vista Previa */}
                    <div className="col-12">
                      <div className="card border-info mt-4 shadow-sm">
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
                                : 'Todo el periodo'}
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
                          className="btn btn-primary shadow-sm"
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
