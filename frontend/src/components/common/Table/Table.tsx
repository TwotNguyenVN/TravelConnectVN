import React from 'react';
import './Table.css';

export interface Column<T> {
  key: string | keyof T;
  title: string | React.ReactNode;
  render?: (record: T, index: number) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (record: T) => string;
  isLoading?: boolean;
  emptyText?: string;
  className?: string;
}

export const Table = <T,>({
  data,
  columns,
  rowKey,
  isLoading = false,
  emptyText = 'No data available',
  className = '',
}: TableProps<T>) => {
  return (
    <div className={`tc-table-wrapper ${className}`}>
      <table className="tc-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={String(col.key) || index}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="tc-table-loading">
                Loading data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="tc-table-empty">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((record, rowIndex) => (
              <tr key={rowKey(record)}>
                {columns.map((col, colIndex) => (
                  <td key={String(col.key) || colIndex}>
                    {col.render
                      ? col.render(record, rowIndex)
                      : (record[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
