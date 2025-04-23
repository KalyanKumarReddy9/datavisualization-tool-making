import React from 'react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { ChartConfig, DataPoint } from '../../types';
import VisualizationWrapper from './VisualizationWrapper';

interface PieChartProps {
  config: ChartConfig;
  data: DataPoint[];
  onEdit: () => void;
  onRemove: () => void;
}

const COLORS = [
  '#2563EB', '#0D9488', '#7C3AED', '#F59E0B', '#EC4899', 
  '#10B981', '#EF4444', '#6366F1', '#8B5CF6', '#F97316'
];

const PieChartVisualization: React.FC<PieChartProps> = ({ config, data, onEdit, onRemove }) => {
  const { dimensions, title } = config;

  // Ensure we have the required dimensions
  if (!dimensions.x || !dimensions.y) {
    return (
      <VisualizationWrapper title={title} onEdit={onEdit} onRemove={onRemove}>
        <div className="flex h-full items-center justify-center text-gray-500">
          Configure category and value fields in properties
        </div>
      </VisualizationWrapper>
    );
  }

  // Transform data for pie chart
  const transformedData = transformData(data, dimensions.x, dimensions.y);

  return (
    <VisualizationWrapper title={title} onEdit={onEdit} onRemove={onRemove}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={transformedData}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius="80%"
            labelLine={true}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            animationDuration={800}
          >
            {transformedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, 'Value']} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </VisualizationWrapper>
  );
};

// Transform data for pie chart
const transformData = (data: DataPoint[], categoryField: string, valueField: string) => {
  const aggregated = new Map<string, number>();
  
  data.forEach(item => {
    const category = String(item[categoryField]);
    const value = Number(item[valueField]) || 0;
    
    aggregated.set(category, (aggregated.get(category) || 0) + value);
  });
  
  return Array.from(aggregated.entries()).map(([name, value]) => ({
    name,
    value
  }));
};

export default PieChartVisualization;