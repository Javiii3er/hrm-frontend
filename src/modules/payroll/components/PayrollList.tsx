import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayroll } from '../hooks/usePayroll';
import { PayrollQuery } from '../types/payroll';
import { useToast } from '@/core/contexts/ToastContext';

const PayrollList: React.FC = () => {
  const { payrolls, loading, error, fetchPayrolls, finalizePayroll } = usePayroll();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [query, setQuery] = useState<PayrollQuery>({
    page: 1,
    pageSize: 10,
    startDate: '',
    endDate: '',
    department: '',
    status: ''
  });

  useEffect(() => {
    fetchPayrolls(query);
    showToast('info', 'Lista de nóminas cargada correctamente.');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayrolls({ ...query, page: 1 });
    showToast('info', 'Búsqueda aplicada.');
  };

  const handleFinalize = async (payrollId: string) => {
    if (window.confirm('¿Estás seguro de que quieres finalizar esta nómina? No podrá ser editada después.')) {
      try {
        await finalizePayroll(payrollId);
        showToast('success', 'Nómina finalizada correctamente.');
      } catch (error) {
        console.error('Error finalizando nómina:', error);
        showToast('danger', 'Error al finalizar la nómina. Intente nuevamente.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { class: 'bg-secondary', text: 'Borrador' },
      FINALIZED: { class: 'bg-success', text: 'Finalizada' },
      PAID: { class: 'bg-info', text: 'Pagada' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(amount);
  };

  const calculateTotal = (payroll: any) => {
    if (!payroll.items) return 0;
    return payroll.items.reduce((sum: number, item: any) => sum + item.netAmount, 0);
  };

  if (loading && payrolls.length === 0) {
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              navigate('/');
              showToast('info', 'Regresando al inicio.');
            }}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Volver
          </button>

          <h2 className="mb-0">
            <i className="bi bi-cash-coin me-2"></i>
            Gestión de Nóminas
          </h2>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/payroll/new')}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Nueva Nómina
        </button>
      </div>

      <div className="alert alert-warning shadow-sm border-start border-4 border-warning mb-4" role="alert">
        <div className="d-flex align-items-center">
          <i className="bi bi-cash-stack fs-4 me-3 text-warning"></i>
          <div>
            <strong>Administración de Nóminas.</strong><br />
            Consulta, filtra o crea nuevas nóminas desde esta sección.
          </div>
        </div>
      </div>

      <div className="card mb-4 shadow-sm border-light">
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
              <div className="col-md-3">
                <label htmlFor="status" className="form-label">Estado</label>
                <select
                  className="form-select"
                  id="status"
                  value={query.status}
                  onChange={(e) => setQuery(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">Todos</option>
                  <option value="DRAFT">Borrador</option>
                  <option value="FINALIZED">Finalizada</option>
                  <option value="PAID">Pagada</option>
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="department" className="form-label">Departamento</label>
                <input
                  type="text"
                  className="form-control"
                  id="department"
                  placeholder="Departamento..."
                  value={query.department}
                  onChange={(e) => setQuery(prev => ({ ...prev, department: e.target.value }))}
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-outline-primary">
                  <i className="bi bi-search me-2"></i>
                  Buscar Nóminas
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm border-start border-4 border-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => {}}></button>
        </div>
      )}

      <div className="card shadow-sm border-light">
        <div className="card-body">
          {payrolls.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-cash-coin display-1 text-muted"></i>
              <h4 className="mt-3">No hay nóminas</h4>
              <p className="text-muted">Comienza creando la primera nómina.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Periodo</th>
                    <th>Descripción</th>
                    {/*  Nuevo: tipo de nómina */}
                    <th>Tipo</th>
                    <th>Departamento / Empleado</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th>Empleados</th>
                    <th>Fecha Creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map((payroll) => (
                    <tr key={payroll.id}>
                      <td>
                        <div className="fw-bold">
                          {new Date(payroll.periodStart).toLocaleDateString('es-ES')}
                        </div>
                        <div className="text-muted small">
                          al {new Date(payroll.periodEnd).toLocaleDateString('es-ES')}
                        </div>
                      </td>
                      <td>{payroll.description || 'Nómina regular'}</td>

                      {/* 🔹 Mostrar tipo */}
                      <td>
                        {payroll.employeeId ? (
                          <span className="badge bg-info">Individual</span>
                        ) : (
                          <span className="badge bg-secondary">General</span>
                        )}
                      </td>

                      {/* 🔹 Mostrar nombre del empleado o departamento */}
                      <td>
                        {payroll.employee
                          ? `${payroll.employee.firstName} ${payroll.employee.lastName}`
                          : payroll.department?.name || 'Todos'}
                      </td>

                      <td>{getStatusBadge(payroll.status)}</td>
                      <td className="fw-bold text-success">{formatCurrency(calculateTotal(payroll))}</td>
                      <td>
                        <span className="badge bg-primary">
                          {payroll.items?.length || 0} empleados
                        </span>
                      </td>
                      <td>{new Date(payroll.createdAt).toLocaleDateString('es-ES')}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate(`/payroll/${payroll.id}`)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          {payroll.status === 'DRAFT' && (
                            <>
                              <button className="btn btn-outline-secondary">
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-outline-success"
                                onClick={() => handleFinalize(payroll.id)}
                                title="Finalizar Nómina"
                              >
                                <i className="bi bi-check-lg"></i>
                              </button>
                            </>
                          )}
                          {payroll.status === 'FINALIZED' && (
                            <button className="btn btn-outline-info">
                              <i className="bi bi-printer"></i>
                            </button>
                          )}
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

      {payrolls.length > 0 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className="page-item disabled">
              <a className="page-link" href="#">Anterior</a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="#">1</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">Siguiente</a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default PayrollList;