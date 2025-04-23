import React, { useState } from 'react';
import { Upload, FileJson, X } from 'lucide-react';
import Papa from 'papaparse';
import { Dataset, ColumnDefinition } from '../types';

interface DataLoaderProps {
  onDataLoaded: (dataset: Dataset) => void;
  onClose: () => void;
}

const DataLoader: React.FC<DataLoaderProps> = ({ onDataLoaded, onClose }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setFile(file);
      setDatasetName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
      setDatasetName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!datasetName.trim()) {
      setError('Please provide a dataset name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      parseFile(file, (result) => {
        if (result.data.length === 0) {
          setError('The file appears to be empty');
          setLoading(false);
          return;
        }

        // Infer column types from the first row of data
        const columns = inferColumnTypes(result.data);

        const dataset: Dataset = {
          id: generateId(),
          name: datasetName,
          data: result.data,
          columns
        };

        onDataLoaded(dataset);
        setLoading(false);
      });
    } catch (err) {
      setError('Failed to parse file: ' + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Import Data</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 ${
            dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mb-3 flex justify-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileJson className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <p className="mb-2 text-sm text-gray-700">
            {file ? file.name : 'Drag & drop a CSV or JSON file here'}
          </p>
          
          <p className="text-xs text-gray-500 mb-4">
            Supported file types: .csv, .json
          </p>
          
          <label className="cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition-colors inline-flex items-center gap-1">
            <Upload className="h-4 w-4" />
            <span>Browse files</span>
            <input 
              type="file" 
              className="hidden" 
              accept=".csv,.json"
              onChange={handleFileChange} 
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dataset Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="My Dataset"
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Import Data'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Utility functions
const parseFile = (file: File, callback: (result: Papa.ParseResult<Record<string, any>>) => void) => {
  if (file.name.endsWith('.csv')) {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: callback
    });
  } else if (file.name.endsWith('.json')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = JSON.parse(e.target?.result as string);
        const data = Array.isArray(result) ? result : [result];
        callback({ data, errors: [], meta: {} as Papa.ParseMeta });
      } catch (error) {
        throw new Error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  } else {
    throw new Error('Unsupported file type');
  }
};

const inferColumnTypes = (data: Record<string, any>[]): ColumnDefinition[] => {
  if (data.length === 0) return [];
  
  const firstRow = data[0];
  return Object.entries(firstRow).map(([key, value]) => {
    let type: 'string' | 'number' | 'boolean' | 'date' = 'string';
    
    if (typeof value === 'number') {
      type = 'number';
    } else if (typeof value === 'boolean') {
      type = 'boolean';
    } else if (typeof value === 'string') {
      // Check if it could be a date
      const datePattern = /^\d{4}-\d{2}-\d{2}T?\d{2}?:?\d{2}?:?\d{2}?/;
      if (datePattern.test(value)) {
        type = 'date';
      }
    }
    
    return {
      field: key,
      type,
      displayName: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
    };
  });
};

const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export default DataLoader;