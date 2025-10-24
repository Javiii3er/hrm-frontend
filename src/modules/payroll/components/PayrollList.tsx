import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayroll } from '../hooks/usePayroll';
import { PayrollQuery } from '../types/payroll';

const PayrollList: React.FC = () => {
  const { payrolls, loading, error, fetchPayrolls, finalizePayroll } = usePayroll();
  const navigate = useNavigate();
  const [query, setQuery] = useState<PayrollQuery>({
    page: 1,
    pageSize: 10,
    startDate: '',
    endDate: '',
    department: '',
    status: ''
  });

  // Cargar nóminas al montar
  useEffect(() => {
    fetchPayrolls(query);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayrolls({ ...query, page: 1 });
  };

  const handleFinalize = async (payrollId: string) => {
    if (window.confirm('¿Estás seguro de que quieres finalizar esta nómina? No podrá ser editada después.')) {
      try {
        await finalizePayroll(payrollId);
      } catch (error) {
        console.error('Error finalizando nómina:', error);
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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-cash-coin me-2"></i>
          Gestión de Nóminas
        </h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/payroll/new')}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Nueva Nómina
        </button>
      </div>

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

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => {}}></button>
        </div>
      )}

      {/* Payroll Table */}
      <div className="card">
        <div className="card-body">
          {payrolls.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-cash-coin display-1 text-muted"></i>
              <h4 className="mt-3">No hay nóminas</h4>
              <p className="text-muted">Comienza creando la primera nómina.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Periodo</th>
                    <th>Descripción</th>
                    <th>Departamento</th>
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
                      <td>{payroll.department?.name || 'Todos'}</td>
                      <td>{getStatusBadge(payroll.status)}</td>
                      <td className="fw-bold text-success">
                        {formatCurrency(calculateTotal(payroll))}
                      </td>
                      <td>
                        <span className="badge bg-primary">
                          {payroll.items?.length || 0} empleados
                        </span>
                      </td>
                      <td>
                        {new Date(payroll.createdAt).toLocaleDateString('es-ES')}
                      </td>
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

      {/* Pagination */}
      {payrolls.length > 0 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className="page-item disabled">
              <a className="page-link" href="#" tabIndex={-1}>Anterior</a>
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