import React from 'react';
import { ChartConfig, DataPoint } from '../../types';
import VisualizationWrapper from './VisualizationWrapper';

interface DataTableProps {
  config: ChartConfig;
  data: DataPoint[];
  onEdit: () => void;
  onRemove: () => void;
}

const DataTable: React.FC<DataTableProps> = ({ config, data, onEdit, onRemove }) => {
  const { title } = config;

  // Apply any filtering from the config
  const filteredData = applyFilters(data, config.filters);
  
  // If no data, show placeholder
  if (!filteredData.length) {
    return (
      <VisualizationWrapper title={title} onEdit={onEdit} onRemove={onRemove}>
        <div className="flex h-full items-center justify-center text-gray-500">
          No data available
        </div>
      </VisualizationWrapper>
    );
  }

  // Get columns from first data item
  const columns = Object.keys(filteredData[0]);

  return (
    <VisualizationWrapper title={title} onEdit={onEdit} onRemove={onRemove}>
      <div className="overflow-auto h-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.map(column => (
                <th 
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map(column => (
                  <td 
                    key={`${rowIndex}-${column}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {formatCellValue(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VisualizationWrapper>
  );
};

// Format cell values for display
const formatCellValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  
  return String(value);
};

// Apply filters to data
const applyFilters = (data: DataPoint[], filters: any[]) => {
  // Implementation of filtering would go here
  // For now, just return the original data
  return data;
};

export default DataTable;