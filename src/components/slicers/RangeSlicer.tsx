import React, { useState, useEffect } from 'react';
import { SlicerConfig, DataPoint } from '../../types';
import VisualizationWrapper from '../visualizations/VisualizationWrapper';

interface RangeSlicerProps {
  config: SlicerConfig;
  data: DataPoint[];
  onEdit: () => void;
  onRemove: () => void;
  onFilterChange: (field: string, range: [number, number]) => void;
}

const RangeSlicer: React.FC<RangeSlicerProps> = ({ 
  config, 
  data, 
  onEdit, 
  onRemove,
  onFilterChange 
}) => {
  const { title, field } = config;
  
  // Find min and max values in the data
  const { min, max } = React.useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    
    data.forEach(item => {
      const value = Number(item[field]);
      if (!isNaN(value)) {
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    });
    
    return { min: min === Infinity ? 0 : min, max: max === -Infinity ? 100 : max };
  }, [data, field]);
  
  const [range, setRange] = useState<[number, number]>([min, max]);
  const [minInput, setMinInput] = useState<string>(min.toString());
  const [maxInput, setMaxInput] = useState<string>(max.toString());
  
  // Update range when min/max changes due to data updates
  useEffect(() => {
    setRange([min, max]);
    setMinInput(min.toString());
    setMaxInput(max.toString());
  }, [min, max]);
  
  // Update filter when range changes
  useEffect(() => {
    onFilterChange(field, range);
  }, [field, range, onFilterChange]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const value = Number(e.target.value);
    const newRange: [number, number] = [...range] as [number, number];
    newRange[index] = value;
    
    // Ensure min <= max
    if (index === 0 && value > range[1]) {
      newRange[1] = value;
      setMaxInput(value.toString());
    } else if (index === 1 && value < range[0]) {
      newRange[0] = value;
      setMinInput(value.toString());
    }
    
    setRange(newRange);
    if (index === 0) {
      setMinInput(value.toString());
    } else {
      setMaxInput(value.toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const value = e.target.value;
    if (index === 0) {
      setMinInput(value);
    } else {
      setMaxInput(value);
    }
  };

  const handleInputBlur = (index: 0 | 1) => {
    const value = index === 0 ? Number(minInput) : Number(maxInput);
    if (isNaN(value)) {
      // Reset to current range value if invalid
      if (index === 0) {
        setMinInput(range[0].toString());
      } else {
        setMaxInput(range[1].toString());
      }
      return;
    }
    
    const newRange: [number, number] = [...range] as [number, number];
    newRange[index] = value;
    
    // Ensure min <= max
    if (index === 0 && value > range[1]) {
      newRange[1] = value;
      setMaxInput(value.toString());
    } else if (index === 1 && value < range[0]) {
      newRange[0] = value;
      setMinInput(value.toString());
    }
    
    setRange(newRange);
  };

  return (
    <VisualizationWrapper title={title} onEdit={onEdit} onRemove={onRemove}>
      <div className="p-4 flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="w-20">
            <input
              type="text"
              className="w-full px-2 py-1 border border-gray-300 rounded text-center"
              value={minInput}
              onChange={(e) => handleInputChange(e, 0)}
              onBlur={() => handleInputBlur(0)}
            />
          </div>
          <div className="w-20">
            <input
              type="text"
              className="w-full px-2 py-1 border border-gray-300 rounded text-center"
              value={maxInput}
              onChange={(e) => handleInputChange(e, 1)}
              onBlur={() => handleInputBlur(1)}
            />
          </div>
        </div>
        
        <div className="relative pt-1">
          <div className="flex h-2 mb-4 overflow-hidden bg-gray-200 rounded-full">
            <div
              className="bg-blue-500 absolute h-full rounded-full"
              style={{
                left: `${((range[0] - min) / (max - min)) * 100}%`,
                width: `${((range[1] - range[0]) / (max - min)) * 100}%`
              }}
            ></div>
          </div>
          
          <input
            type="range"
            min={min}
            max={max}
            step={(max - min) / 100}
            value={range[0]}
            onChange={(e) => handleSliderChange(e, 0)}
            className="absolute w-full h-2 -mt-6 opacity-0 cursor-pointer"
          />
          
          <input
            type="range"
            min={min}
            max={max}
            step={(max - min) / 100}
            value={range[1]}
            onChange={(e) => handleSliderChange(e, 1)}
            className="absolute w-full h-2 -mt-6 opacity-0 cursor-pointer"
          />
          
          <div className="relative">
            <div
              className="absolute w-4 h-4 -mt-3 bg-white border-2 border-blue-500 rounded-full cursor-grab"
              style={{
                left: `calc(${((range[0] - min) / (max - min)) * 100}% - 0.5rem)`
              }}
            ></div>
            
            <div
              className="absolute w-4 h-4 -mt-3 bg-white border-2 border-blue-500 rounded-full cursor-grab"
              style={{
                left: `calc(${((range[1] - min) / (max - min)) * 100}% - 0.5rem)`
              }}
            ></div>
          </div>
        </div>
      </div>
    </VisualizationWrapper>
  );
};

export default RangeSlicer;