import React, { useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { ChartConfig, SlicerConfig, Dataset, DashboardItem, VisualizationType, SlicerType } from '../types';
import BarChartVisualization from './visualizations/BarChart';
import LineChartVisualization from './visualizations/LineChart';
import PieChartVisualization from './visualizations/PieChart';
import DataTable from './visualizations/DataTable';
import DropdownSlicer from './slicers/DropdownSlicer';
import RangeSlicer from './slicers/RangeSlicer';
import PropertyPanel from './layout/PropertyPanel';

interface DashboardProps {
  datasets: Dataset[];
}

const Dashboard: React.FC<DashboardProps> = ({ datasets }) => {
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ChartConfig | SlicerConfig | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  
  // Function to add a new visualization
  const addVisualization = (type: VisualizationType) => {
    if (datasets.length === 0) {
      alert('Please add at least one dataset first');
      return;
    }
    
    const newItem: ChartConfig = {
      id: `chart-${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      datasetId: datasets[0].id,
      dimensions: {},
      filters: [],
      layout: {
        x: 0,
        y: 0,
        w: 6,
        h: 8
      },
      options: {}
    };
    
    setItems([...items, newItem]);
  };
  
  // Function to add a new slicer
  const addSlicer = (type: SlicerType) => {
    if (datasets.length === 0) {
      alert('Please add at least one dataset first');
      return;
    }
    
    const dataset = datasets[0];
    
    const newItem: SlicerConfig = {
      id: `slicer-${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Slicer`,
      datasetId: dataset.id,
      field: dataset.columns.length > 0 ? dataset.columns[0].field : '',
      layout: {
        x: 0,
        y: 0,
        w: 3,
        h: 3
      },
      options: {}
    };
    
    setItems([...items, newItem]);
  };
  
  // Handle layout changes from the grid
  const onLayoutChange = (layout: Layout[]) => {
    const updatedItems = items.map(item => {
      const layoutItem = layout.find(l => l.i === item.id);
      if (layoutItem) {
        return {
          ...item,
          layout: {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h
          }
        };
      }
      return item;
    });
    
    setItems(updatedItems);
  };
  
  // Handle filter changes from slicers
  const handleFilterChange = (field: string, value: any) => {
    if (value && (Array.isArray(value) ? value.length > 0 : true)) {
      setActiveFilters(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      const newFilters = { ...activeFilters };
      delete newFilters[field];
      setActiveFilters(newFilters);
    }
  };
  
  // Apply filters to dataset
  const getFilteredData = (datasetId: string) => {
    const dataset = datasets.find(d => d.id === datasetId);
    if (!dataset) return [];
    
    return dataset.data.filter(item => {
      for (const [field, value] of Object.entries(activeFilters)) {
        if (Array.isArray(value)) {
          // For dropdown filters
          if (value.length > 0 && !value.includes(String(item[field]))) {
            return false;
          }
        } else if (Array.isArray(value) && value.length === 2) {
          // For range filters
          const itemValue = Number(item[field]);
          if (isNaN(itemValue) || itemValue < value[0] || itemValue > value[1]) {
            return false;
          }
        }
      }
      return true;
    });
  };
  
  // Update item properties
  const handleItemUpdate = (updatedItem: ChartConfig | SlicerConfig) => {
    const updatedItems = items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    
    setItems(updatedItems);
    setSelectedItem(updatedItem);
  };
  
  // Remove an item from the dashboard
  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem(null);
    }
  };
  
  // Convert items to layout format for react-grid-layout
  const layout = items.map(item => ({
    i: item.id,
    x: item.layout.x,
    y: item.layout.y,
    w: item.layout.w,
    h: item.layout.h,
    minW: 3,
    minH: 3
  }));

  return (
    <div className="flex flex-1 h-[calc(100vh-3.5rem)]">
      <div className="flex-1 p-4 bg-gray-50 overflow-auto">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={40}
          width={window.innerWidth - 350} // Adjust for sidebar and property panel
          onLayoutChange={onLayoutChange}
          draggableHandle=".drag-handle"
          compactType="vertical"
        >
          {items.map(item => {
            // Get the filtered data for this item
            const filteredData = getFilteredData(item.datasetId);
            
            if ('type' in item) {
              // Render a visualization
              switch (item.type) {
                case 'bar':
                  return (
                    <div key={item.id}>
                      <BarChartVisualization
                        config={item}
                        data={filteredData}
                        onEdit={() => setSelectedItem(item)}
                        onRemove={() => handleRemoveItem(item.id)}
                      />
                    </div>
                  );
                case 'line':
                  return (
                    <div key={item.id}>
                      <LineChartVisualization
                        config={item}
                        data={filteredData}
                        onEdit={() => setSelectedItem(item)}
                        onRemove={() => handleRemoveItem(item.id)}
                      />
                    </div>
                  );
                case 'pie':
                  return (
                    <div key={item.id}>
                      <PieChartVisualization
                        config={item}
                        data={filteredData}
                        onEdit={() => setSelectedItem(item)}
                        onRemove={() => handleRemoveItem(item.id)}
                      />
                    </div>
                  );
                case 'table':
                  return (
                    <div key={item.id}>
                      <DataTable
                        config={item}
                        data={filteredData}
                        onEdit={() => setSelectedItem(item)}
                        onRemove={() => handleRemoveItem(item.id)}
                      />
                    </div>
                  );
                default:
                  return (
                    <div key={item.id} className="bg-white p-4 border border-gray-200 rounded">
                      Unsupported visualization type
                    </div>
                  );
              }
            } else {
              // Render a slicer
              switch (item.type) {
                case 'dropdown':
                  return (
                    <div key={item.id}>
                      <DropdownSlicer
                        config={item}
                        data={filteredData}
                        onEdit={() => setSelectedItem(item)}
                        onRemove={() => handleRemoveItem(item.id)}
                        onFilterChange={handleFilterChange}
                      />
                    </div>
                  );
                case 'range':
                  return (
                    <div key={item.id}>
                      <RangeSlicer
                        config={item}
                        data={filteredData}
                        onEdit={() => setSelectedItem(item)}
                        onRemove={() => handleRemoveItem(item.id)}
                        onFilterChange={handleFilterChange}
                      />
                    </div>
                  );
                default:
                  return (
                    <div key={item.id} className="bg-white p-4 border border-gray-200 rounded">
                      Unsupported slicer type
                    </div>
                  );
              }
            }
          })}
        </GridLayout>
        
        {items.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="mb-4">Add visualizations and slicers from the sidebar</p>
              {datasets.length === 0 && (
                <p className="text-sm">Start by adding a dataset first</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {selectedItem && (
        <PropertyPanel
          selectedItem={selectedItem}
          datasets={datasets}
          onClose={() => setSelectedItem(null)}
          onUpdate={handleItemUpdate}
        />
      )}
    </div>
  );
};

export default Dashboard;