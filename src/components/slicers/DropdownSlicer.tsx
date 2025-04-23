import React, { useState, useEffect } from 'react';
import { SlicerConfig, DataPoint } from '../../types';
import VisualizationWrapper from '../visualizations/VisualizationWrapper';

interface DropdownSlicerProps {
  config: SlicerConfig;
  data: DataPoint[];
  onEdit: () => void;
  onRemove: () => void;
  onFilterChange: (field: string, values: string[]) => void;
}

const DropdownSlicer: React.FC<DropdownSlicerProps> = ({ 
  config, 
  data, 
  onEdit, 
  onRemove,
  onFilterChange 
}) => {
  const { title, field } = config;
  const [selectedValue, setSelectedValue] = useState<string>('');
  
  // Extract unique values for the field
  const uniqueValues = React.useMemo(() => {
    const values = new Set<string>();
    
    data.forEach(item => {
      if (item[field] !== null && item[field] !== undefined) {
        values.add(String(item[field]));
      }
    });
    
    return Array.from(values).sort();
  }, [data, field]);
  
  // Update the filter when selection changes
  useEffect(() => {
    if (selectedValue) {
      onFilterChange(field, [selectedValue]);
    } else {
      onFilterChange(field, []);
    }
  }, [selectedValue, field, onFilterChange]);

  return (
    <VisualizationWrapper title={title} onEdit={onEdit} onRemove={onRemove}>
      <div className="p-2">
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="">All Values</option>
          {uniqueValues.map(value => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </VisualizationWrapper>
  );
};

export default DropdownSlicer;