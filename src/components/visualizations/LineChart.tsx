import React from 'react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { ChartConfig, DataPoint } from '../../types';
import VisualizationWrapper from './VisualizationWrapper';

interface LineChartProps {
  config: ChartConfig;
  data: DataPoint[];
  onEdit: () => void;
  onRemove: () => void;
}

const colors = [
  '#2563EB', '#0D9488', '#7C3AED', '#F59E0B', '#EC4899', 
  '#10B981', '#EF4444', '#6366F1', '#8B5CF6', '#F97316'
];

const LineChartVisualization: React.FC<LineChartProps> = ({ config, data, onEdit, onRemove }) => {
  const { dimensions, title } = config;

  // Ensure we have the required dimensions
  if (!dimensions.x || !dimensions.y) {
    return (
      <VisualizationWrapper title={title} onEdit={onEdit} onRemove={onRemove}>
        <div className="flex h-full items-center justify-center text-gray-500">
          Configure X and Y axes in properties
        </div>
      </VisualizationWrapper>
    );
  }

  // Transform data for grouping if needed
  const transformedData = dimensions.group 
    ? transformDataWithGroups(data, dimensions.x, dimensions.y, dimensions.group)
    : transformSimpleData(data, dimensions.x, dimensions.y);

  return (
    <VisualizationWrapper title={title} onEdit={onEdit} onRemove={onRemove}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={transformedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {dimensions.group ? (
            <>
              <Legend />
              {Object.keys(transformedData[0] || {})
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Line 
                    key={key} 
                    type="monotone" 
                    dataKey={key} 
                    stroke={colors[index % colors.length]}
                    activeDot={{ r: 8 }}
                    animationDuration={500}
                  />
                ))
              }
            </>
          ) : (
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#2563EB"
              activeDot={{ r: 8 }}
              animationDuration={500}
            />
          )}
        </RechartsLineChart>
      </ResponsiveContainer>
    </VisualizationWrapper>
  );
};

// Transform data for simple line chart (no grouping)
const transformSimpleData = (data: DataPoint[], xField: string, yField: string) => {
  return data.map(item => ({
    name: String(item[xField]),
    value: Number(item[yField]) || 0
  }));
};

// Transform data with grouping
const transformDataWithGroups = (
  data: DataPoint[], 
  xField: string, 
  yField: string, 
  groupField: string
) => {
  const groups = new Map<string, Map<string, number>>();
  
  // Collect data by groups
  data.forEach(item => {
    const x = String(item[xField]);
    const y = Number(item[yField]) || 0;
    const group = String(item[groupField]);
    
    if (!groups.has(x)) {
      groups.set(x, new Map());
    }
    
    const groupMap = groups.get(x)!;
    groupMap.set(group, (groupMap.get(group) || 0) + y);
  });
  
  // Convert to the format needed by Recharts
  const result: Record<string, string | number>[] = [];
  
  groups.forEach((groupMap, x) => {
    const entry: Record<string, string | number> = { name: x };
    
    groupMap.forEach((value, group) => {
      entry[group] = value;
    });
    
    result.push(entry);
  });
  
  return result;
};

export default LineChartVisualization;