import React from 'react';

const EmployeeDashboard: React.FC = () => {
  return (
    <div className="container-fluid">
      {/* Header Personalizado */}
      <div className="card bg-primary text-white mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="card-title">
                <i className="bi bi-person-circle me-2"></i>
                ¡Bienvenido, Carlos López!
              </h2>
              <p className="card-text mb-0">
                Departamento: Ventas | Posición: Ejecutivo de Ventas
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className="bg-light text-primary rounded p-3">
                <h4 className="mb-0">Q 8,500.00</h4>
                <small>Salario Base Mensual</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información del Empleado */}
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card border-info">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-cash-coin me-2"></i>
                Última Nómina
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center">
                <h4 className="text-success">Q 8,250.00</h4>
                <p className="text-muted">Noviembre 2023</p>
                <div className="row text-start small">
                  <div className="col-6">Bruto:</div>
                  <div className="col-6 text-end">Q 9,000.00</div>
                  <div className="col-6">Deducciones:</div>
                  <div className="col-6 text-end text-danger">Q 750.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card border-warning">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">
                <i className="bi bi-calendar-check me-2"></i>
                Vacaciones
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center">
                <h4 className="text-warning">15 días</h4>
                <p className="text-muted">Disponibles</p>
                <div className="progress mb-2">
                  <div 
                    className="progress-bar bg-warning" 
                    style={{ width: '60%' }}
                  ></div>
                </div>
                <small>9 días utilizados de 24 totales</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card border-success">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-file-earmark-text me-2"></i>
                Mis Documentos
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center">
                <h4 className="text-success">8</h4>
                <p className="text-muted">Documentos en expediente</p>
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-success btn-sm">
                    <i className="bi bi-download me-1"></i>
                    Ver Contrato
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-clock me-2"></i>
                Próximos Eventos
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Evaluación de Desempeño</h6>
                    <span className="badge bg-warning text-dark">15 Dic</span>
                  </div>
                  <p className="mb-1 text-muted">Reunión con supervisor</p>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Pago de Nómina</h6>
                    <span className="badge bg-success">30 Nov</span>
                  </div>
                  <p className="mb-1 text-muted">Depósito bancario</p>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Capacitación</h6>
                    <span className="badge bg-info">5 Dic</span>
                  </div>
                  <p className="mb-1 text-muted">Nuevas herramientas de ventas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Acciones Rápidas
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-2">
                <div className="col-6">
                  <button className="btn btn-outline-primary w-100 h-100 py-3">
                    <i className="bi bi-download d-block mb-2 fs-4"></i>
                    Descargar Nómina
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-outline-info w-100 h-100 py-3">
                    <i className="bi bi-file-text d-block mb-2 fs-4"></i>
                    Mis Documentos
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-outline-warning w-100 h-100 py-3">
                    <i className="bi bi-calendar-plus d-block mb-2 fs-4"></i>
                    Solicitar Vacaciones
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-outline-secondary w-100 h-100 py-3">
                    <i className="bi bi-person d-block mb-2 fs-4"></i>
                    Mi Perfil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;