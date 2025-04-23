import React from 'react';
import { Edit, Trash2, Maximize2 } from 'lucide-react';

interface VisualizationWrapperProps {
  title: string;
  children: React.ReactNode;
  onEdit: () => void;
  onRemove: () => void;
}

const VisualizationWrapper: React.FC<VisualizationWrapperProps> = ({
  title,
  children,
  onEdit,
  onRemove
}) => {
  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-700 truncate">{title}</h3>
        <div className="flex gap-1">
          <button 
            className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-colors"
            onClick={onEdit}
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button 
            className="text-gray-500 hover:text-red-600 p-1 rounded hover:bg-gray-200 transition-colors"
            onClick={onRemove}
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-2">
        {children}
      </div>
    </div>
  );
};

export default VisualizationWrapper;