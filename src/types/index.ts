export type DataPoint = Record<string, string | number | boolean | null>;

export type Dataset = {
  id: string;
  name: string;
  data: DataPoint[];
  columns: ColumnDefinition[];
};

export type ColumnDefinition = {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  displayName: string;
};

export type VisualizationType = 
  | 'bar'
  | 'line'
  | 'area'
  | 'pie'
  | 'scatter'
  | 'table'
  | 'gauge'
  | 'card';

export type SlicerType = 
  | 'dropdown'
  | 'list'
  | 'range'
  | 'date';

export type FilterCondition = {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'between';
  value: string | number | boolean | [number, number] | string[];
};

export type ChartConfig = {
  id: string;
  type: VisualizationType;
  title: string;
  datasetId: string;
  dimensions: {
    x?: string;
    y?: string;
    group?: string;
    size?: string;
    color?: string;
  };
  filters: FilterCondition[];
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  options: Record<string, any>;
};

export type SlicerConfig = {
  id: string;
  type: SlicerType;
  title: string;
  datasetId: string;
  field: string;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  options: Record<string, any>;
};

export type DashboardItem = ChartConfig | SlicerConfig;

export type Dashboard = {
  id: string;
  name: string;
  items: DashboardItem[];
};