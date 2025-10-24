import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

const Table: React.FC<TableProps> = ({ headers, children, className = '' }) => {
  return (
    <div className={`table-responsive ${className}`}>
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
