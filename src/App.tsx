import React, { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/Dashboard';
import DataLoader from './components/DataLoader';
import { Dataset, VisualizationType, SlicerType } from './types';
import { generateSampleData } from './utils/sampleData';

function App() {
  const [datasets, setDatasets] = useState<Dataset[]>(generateSampleData());
  const [showDataLoader, setShowDataLoader] = useState(false);

  const handleAddVisualization = (type: VisualizationType) => {
    // This is handled in the Dashboard component
  };

  const handleAddSlicer = (type: SlicerType) => {
    // This is handled in the Dashboard component
  };

  const handleDataLoaded = (dataset: Dataset) => {
    setDatasets([...datasets, dataset]);
    setShowDataLoader(false);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          onAddVisualization={handleAddVisualization}
          onAddSlicer={handleAddSlicer}
        />
        <Dashboard datasets={datasets} />
      </div>

      {showDataLoader && (
        <DataLoader 
          onDataLoaded={handleDataLoaded}
          onClose={() => setShowDataLoader(false)}
        />
      )}
    </div>
  );
}

export default App;