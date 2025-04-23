import React from 'react';
import { X } from 'lucide-react';
import { ChartConfig, SlicerConfig, Dataset, ColumnDefinition } from '../../types';

interface PropertyPanelProps {
  selectedItem: ChartConfig | SlicerConfig | null;
  datasets: Dataset[];
  onClose: () => void;
  onUpdate: (updatedItem: ChartConfig | SlicerConfig) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ 
  selectedItem, 
  datasets, 
  onClose, 
  onUpdate 
}) => {
  if (!selectedItem) return null;

  const dataset = datasets.find(d => d.id === selectedItem.datasetId);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedItem) {
      onUpdate({
        ...selectedItem,
        title: e.target.value
      });
    }
  };

  const handleDatasetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedItem) {
      onUpdate({
        ...selectedItem,
        datasetId: e.target.value
      });
    }
  };

  const handleFieldChange = (dimensionKey: string, value: string) => {
    if ('dimensions' in selectedItem) {
      onUpdate({
        ...selectedItem,
        dimensions: {
          ...selectedItem.dimensions,
          [dimensionKey]: value
        }
      });
    } else if ('field' in selectedItem) {
      onUpdate({
        ...selectedItem,
        field: value
      });
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 w-72 p-4 h-[calc(100vh-3.5rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Properties</h2>
        <button 
          className="text-gray-500 hover:text-gray-700 transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={selectedItem.title}
            onChange={handleTitleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dataset</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={selectedItem.datasetId}
            onChange={handleDatasetChange}
          >
            {datasets.map(dataset => (
              <option key={dataset.id} value={dataset.id}>{dataset.name}</option>
            ))}
          </select>
        </div>

        {dataset && 'dimensions' in selectedItem && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">X Axis</label>
              <FieldSelect 
                columns={dataset.columns} 
                value={selectedItem.dimensions.x || ''} 
                onChange={(value) => handleFieldChange('x', value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Y Axis</label>
              <FieldSelect 
                columns={dataset.columns} 
                value={selectedItem.dimensions.y || ''} 
                onChange={(value) => handleFieldChange('y', value)}
              />
            </div>
            
            {['scatter', 'bubble'].includes(selectedItem.type) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <FieldSelect 
                  columns={dataset.columns.filter(c => c.type === 'number')} 
                  value={selectedItem.dimensions.size || ''} 
                  onChange={(value) => handleFieldChange('size', value)}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
              <FieldSelect 
                columns={dataset.columns} 
                value={selectedItem.dimensions.group || ''} 
                onChange={(value) => handleFieldChange('group', value)}
              />
            </div>
          </>
        )}

        {dataset && 'field' in selectedItem && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
            <FieldSelect 
              columns={dataset.columns} 
              value={selectedItem.field} 
              onChange={(value) => handleFieldChange('field', value)}
            />
          </div>
        )}
        
        {/* Add more properties based on visualization type */}
      </div>
    </div>
  );
};

interface FieldSelectProps {
  columns: ColumnDefinition[];
  value: string;
  onChange: (value: string) => void;
}

const FieldSelect: React.FC<FieldSelectProps> = ({ columns, value, onChange }) => {
  return (
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select a field</option>
      {columns.map(column => (
        <option key={column.field} value={column.field}>
          {column.displayName}
        </option>
      ))}
    </select>
  );
};

export default PropertyPanel;