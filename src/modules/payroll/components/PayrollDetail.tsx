import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePayroll } from '../hooks/usePayroll';
import { Payroll } from '../types/payroll';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PayrollDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchPayroll, generatePayrollItems, finalizePayroll, loading, error } = usePayroll();
  const [payroll, setPayroll] = useState<Payroll | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      loadPayroll();
    }
  }, [id]);

  const loadPayroll = async () => {
    try {
      const payrollData = await fetchPayroll(id!);
      setPayroll(payrollData);
    } catch (error) {
      console.error('Error cargando nómina:', error);
    }
  };

  const handleGenerateItems = async () => {
    if (!payroll) return;
    
    if (window.confirm('¿Generar items de nómina para este periodo? Esto calculará los salarios de todos los empleados activos.')) {
      try {
        await generatePayrollItems(payroll.id);
        await loadPayroll();
      } catch (error) {
        console.error('Error generando items:', error);
      }
    }
  };

  const handleFinalize = async () => {
    if (!payroll) return;
    
    if (window.confirm('¿Finalizar esta nómina? Una vez finalizada no podrá ser editada.')) {
      try {
        await finalizePayroll(payroll.id);
        await loadPayroll(); 
      } catch (error) {
        console.error('Error finalizando nómina:', error);
      }
    }
  };

  const handleBack = () => {
    navigate('/payroll');
  };

  const handlePrint = async () => {
    if (!reportRef.current) return;

    const element = reportRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(`Nomina_${payroll?.id || 'reporte'}.pdf`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { class: 'bg-secondary', text: 'Borrador' },
      FINALIZED: { class: 'bg-success', text: 'Finalizada' },
      PAID: { class: 'bg-info', text: 'Pagada' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return <span className={`badge ${config.class} fs-6`}>{config.text}</span>;
  };

  const calculateTotals = () => {
    if (!payroll?.items) return { gross: 0, net: 0, deductions: 0, employees: 0 };
    
    return payroll.items.reduce((acc, item) => ({
      gross: acc.gross + item.grossAmount,
      net: acc.net + item.netAmount,
      deductions: acc.deductions + (item.grossAmount - item.netAmount),
      employees: acc.employees + 1
    }), { gross: 0, net: 0, deductions: 0, employees: 0 });
  };

  if (loading && !payroll) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !payroll) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger mt-3">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error || 'Nómina no encontrada'}
        </div>
        <button className="btn btn-secondary mt-3" onClick={handleBack}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver a la lista
        </button>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="container-fluid" ref={reportRef}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button className="btn btn-outline-secondary me-3" onClick={handleBack}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </button>
          <h2 className="d-inline-block mb-0">
            <i className="bi bi-cash-coin me-2"></i>
            Detalles de Nómina
          </h2>
        </div>
        <div className="d-flex gap-2">
          {payroll.status === 'DRAFT' && (
            <>
              <button 
                className="btn btn-warning"
                onClick={handleGenerateItems}
                disabled={loading}
              >
                <i className="bi bi-calculator me-2"></i>
                Generar Items
              </button>
              <button 
                className="btn btn-success"
                onClick={handleFinalize}
                disabled={loading || !payroll.items || payroll.items.length === 0}
              >
                <i className="bi bi-check-lg me-2"></i>
                Finalizar Nómina
              </button>
            </>
          )}
          {payroll.status === 'FINALIZED' && (
            <button className="btn btn-info" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i>
              Imprimir Reporte
            </button>
          )}
        </div>
      </div>

      <div className="row">
        {/* Información Principal */}
        <div className="col-lg-8">
          {/* Resumen de Nómina */}
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Información de la Nómina
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Periodo</label>
                  <p className="form-control-plaintext">
                    {new Date(payroll.periodStart).toLocaleDateString('es-ES')} 
                    {' al '}
                    {new Date(payroll.periodEnd).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Estado</label>
                  <div>{getStatusBadge(payroll.status)}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Descripción</label>
                  <p className="form-control-plaintext">
                    {payroll.description || 'Nómina regular'}
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Departamento</label>
                  <p className="form-control-plaintext">
                    {payroll.department?.name || 'Todos los departamentos'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items de Nómina */}
          <div className="card">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-list-check me-2"></i>
                Detalle de Pagos ({payroll.items?.length || 0} empleados)
              </h5>
              {totals.net > 0 && (
                <span className="badge bg-light text-dark fs-6">
                  Total: {formatCurrency(totals.net)}
                </span>
              )}
            </div>
            <div className="card-body">
              {!payroll.items || payroll.items.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-calculator display-4 text-muted mb-3"></i>
                  <h5>No hay items de nómina</h5>
                  <p className="text-muted">
                    Genera los items de nómina para calcular los pagos de los empleados.
                  </p>
                  {payroll.status === 'DRAFT' && (
                    <button 
                      className="btn btn-primary"
                      onClick={handleGenerateItems}
                    >
                      <i className="bi bi-calculator me-2"></i>
                      Generar Items
                    </button>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Empleado</th>
                        <th>Cédula</th>
                        <th>Posición</th>
                        <th>Bruto</th>
                        <th>Deducciones</th>
                        <th>Neto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payroll.items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="fw-bold">
                              {item.employee?.firstName} {item.employee?.lastName}
                            </div>
                          </td>
                          <td>{item.employee?.nationalId}</td>
                          <td>{item.employee?.position || 'N/A'}</td>
                          <td className="text-success fw-bold">
                            {formatCurrency(item.grossAmount)}
                          </td>
                          <td className="text-danger">
                            {formatCurrency(item.grossAmount - item.netAmount)}
                          </td>
                          <td className="text-primary fw-bold fs-6">
                            {formatCurrency(item.netAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-dark">
                      <tr>
                        <th colSpan={3}>TOTALES</th>
                        <th>{formatCurrency(totals.gross)}</th>
                        <th>{formatCurrency(totals.deductions)}</th>
                        <th>{formatCurrency(totals.net)}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Estadísticas y Acciones */}
        <div className="col-lg-4">
          {/* Resumen Financiero */}
          <div className="card mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Resumen Financiero
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Total Bruto</label>
                <p className="form-control-plaintext fs-5 text-success">
                  {formatCurrency(totals.gross)}
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Total Deducciones</label>
                <p className="form-control-plaintext fs-6 text-danger">
                  {formatCurrency(totals.deductions)}
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Total Neto</label>
                <p className="form-control-plaintext fs-4 fw-bold text-primary">
                  {formatCurrency(totals.net)}
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Empleados</label>
                <p className="form-control-plaintext">
                  {totals.employees} empleados
                </p>
              </div>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="card">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Información del Sistema
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">ID de Nómina</label>
                <p className="form-control-plaintext small font-monospace">
                  {payroll.id}
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Creada</label>
                <p className="form-control-plaintext">
                  {new Date(payroll.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Actualizada</label>
                <p className="form-control-plaintext">
                  {new Date(payroll.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetail;