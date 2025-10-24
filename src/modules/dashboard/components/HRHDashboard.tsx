import React from 'react';

const HRHDashboard: React.FC = () => {
  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard - Recursos Humanos
        </h2>
        <div className="text-muted">
          <i className="bi bi-calendar me-2"></i>
          {new Date().toLocaleDateString('es-ES')}
        </div>
      </div>

      {/* KPIs para RRHH */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title text-muted">Empleados Activos</h6>
                  <h3 className="text-primary">142</h3>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-person-check display-6 text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-success">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title text-muted">Contrataciones Mes</h6>
                  <h3 className="text-success">5</h3>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-person-plus display-6 text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-warning">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title text-muted">Documentos Pendientes</h6>
                  <h3 className="text-warning">18</h3>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-file-earmark-text display-6 text-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-info">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title text-muted">Vacaciones</h6>
                  <h3 className="text-info">7</h3>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-airplane display-6 text-info"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido específico para RRHH */}
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Actividad Reciente
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Nuevo empleado registrado</h6>
                    <small className="text-muted">Hace 2 horas</small>
                  </div>
                  <p className="mb-1">María González - Departamento: Ventas</p>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Documento cargado</h6>
                    <small className="text-muted">Hace 4 horas</small>
                  </div>
                  <p className="mb-1">Contrato de Carlos López</p>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Nómina generada</h6>
                    <small className="text-muted">Ayer</small>
                  </div>
                  <p className="mb-1">Periodo Noviembre 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-list-task me-2"></i>
                Tareas Pendientes
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="task1" />
                    <label className="form-check-label" htmlFor="task1">
                      Revisar documentos de nuevos empleados
                    </label>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="task2" />
                    <label className="form-check-label" htmlFor="task2">
                      Preparar nómina de diciembre
                    </label>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="task3" />
                    <label className="form-check-label" htmlFor="task3">
                      Programar evaluaciones de desempeño
                    </label>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="task4" />
                    <label className="form-check-label" htmlFor="task4">
                      Actualizar políticas de la empresa
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRHDashboard;