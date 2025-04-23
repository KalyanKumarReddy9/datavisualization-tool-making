import React from 'react';
import { BarChart, LineChart, PieChart, ScatterChart as ScatterPlot, Table, Gauge, SlidersHorizontal as SliderHorizontal, Calendar, List, Filter, Plus } from 'lucide-react';
import { VisualizationType, SlicerType } from '../../types';

interface SidebarProps {
  onAddVisualization: (type: VisualizationType) => void;
  onAddSlicer: (type: SlicerType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddVisualization, onAddSlicer }) => {
  return (
    <div className="bg-white border-r border-gray-200 w-56 px-2 py-4 h-[calc(100vh-3.5rem)] overflow-y-auto flex flex-col">
      <div className="mb-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">Visualizations</h2>
        <div className="space-y-1">
          <SidebarItem 
            icon={<BarChart className="w-4 h-4" />} 
            label="Bar Chart" 
            onClick={() => onAddVisualization('bar')} 
          />
          <SidebarItem 
            icon={<LineChart className="w-4 h-4" />} 
            label="Line Chart" 
            onClick={() => onAddVisualization('line')} 
          />
          <SidebarItem 
            icon={<LineChart className="w-4 h-4" />} 
            label="Area Chart" 
            onClick={() => onAddVisualization('area')} 
          />
          <SidebarItem 
            icon={<PieChart className="w-4 h-4" />} 
            label="Pie Chart" 
            onClick={() => onAddVisualization('pie')} 
          />
          <SidebarItem 
            icon={<ScatterPlot className="w-4 h-4" />} 
            label="Scatter Plot" 
            onClick={() => onAddVisualization('scatter')} 
          />
          <SidebarItem 
            icon={<Table className="w-4 h-4" />} 
            label="Table" 
            onClick={() => onAddVisualization('table')} 
          />
          <SidebarItem 
            icon={<Gauge className="w-4 h-4" />} 
            label="Gauge" 
            onClick={() => onAddVisualization('gauge')} 
          />
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">Filters & Slicers</h2>
        <div className="space-y-1">
          <SidebarItem 
            icon={<SliderHorizontal className="w-4 h-4" />} 
            label="Range Slicer" 
            onClick={() => onAddSlicer('range')} 
          />
          <SidebarItem 
            icon={<List className="w-4 h-4" />} 
            label="Dropdown Slicer" 
            onClick={() => onAddSlicer('dropdown')} 
          />
          <SidebarItem 
            icon={<List className="w-4 h-4" />} 
            label="List Slicer" 
            onClick={() => onAddSlicer('list')} 
          />
          <SidebarItem 
            icon={<Calendar className="w-4 h-4" />} 
            label="Date Slicer" 
            onClick={() => onAddSlicer('date')} 
          />
          <SidebarItem 
            icon={<Filter className="w-4 h-4" />} 
            label="Advanced Filter" 
            onClick={() => onAddSlicer('dropdown')} 
          />
        </div>
      </div>

      <div className="mt-auto">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">Data</h2>
        <button className="w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Data Source</span>
        </button>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, onClick }) => {
  return (
    <button 
      className="w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors"
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default Sidebar;