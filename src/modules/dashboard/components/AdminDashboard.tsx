import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard - Administrador
        </h2>
        <div className="text-muted">
          <i className="bi bi-calendar me-2"></i>
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* KPIs */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title text-muted">Total Empleados</h6>
                  <h3 className="text-primary">156</h3>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-people display-6 text-primary"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="badge bg-success">
                  <i className="bi bi-arrow-up me-1"></i>
                  12% vs mes anterior
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-success">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title text-muted">Nómina del Mes</h6>
                  <h3 className="text-success">Q 245,680</h3>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-cash-coin display-6 text-success"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="badge bg-warning text-dark">
                  <i className="bi bi-clock me-1"></i>
                  Pendiente de pago
                </span>
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
                  <h3 className="text-warning">23</h3>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-folder display-6 text-warning"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="badge bg-danger">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  5 urgentes
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-info">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title text-muted">Departamentos</h6>
                  <h3 className="text-info">8</h3>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-building display-6 text-info"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="badge bg-primary">
                  <i className="bi bi-check-circle me-1"></i>
                  Todos activos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficas y Tablas */}
      <div className="row">
        {/* Nóminas Recientes */}
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-cash-stack me-2"></i>
                Nóminas Recientes
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Nómina Octubre 2023</h6>
                    <small className="text-muted">01 Oct - 31 Oct 2023</small>
                  </div>
                  <span className="badge bg-success rounded-pill">Finalizada</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Nómina Noviembre 2023</h6>
                    <small className="text-muted">01 Nov - 30 Nov 2023</small>
                  </div>
                  <span className="badge bg-warning text-dark rounded-pill">En Proceso</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Nómina Diciembre 2023</h6>
                    <small className="text-muted">01 Dic - 31 Dic 2023</small>
                  </div>
                  <span className="badge bg-secondary rounded-pill">Borrador</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
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
                    <i className="bi bi-plus-circle d-block mb-2 fs-4"></i>
                    Nuevo Empleado
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-outline-success w-100 h-100 py-3">
                    <i className="bi bi-calculator d-block mb-2 fs-4"></i>
                    Generar Nómina
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-outline-info w-100 h-100 py-3">
                    <i className="bi bi-graph-up d-block mb-2 fs-4"></i>
                    Ver Reportes
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-outline-warning w-100 h-100 py-3">
                    <i className="bi bi-people d-block mb-2 fs-4"></i>
                    Gestión Usuarios
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

export default AdminDashboard;