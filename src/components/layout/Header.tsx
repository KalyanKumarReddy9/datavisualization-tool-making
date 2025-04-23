import React from 'react';
import { File, Save, FileBarChart2, Settings, HelpCircle, Plus } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileBarChart2 className="h-6 w-6 text-blue-600" />
          <h1 className="text-lg font-semibold">DataViz Studio</h1>
        </div>
        
        <div className="flex gap-3">
          <button className="py-1.5 px-3 text-sm rounded hover:bg-gray-100 flex items-center gap-1.5 transition-colors">
            <File className="h-4 w-4" />
            <span>New</span>
          </button>
          
          <button className="py-1.5 px-3 text-sm rounded hover:bg-gray-100 flex items-center gap-1.5 transition-colors">
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>

          <div className="h-6 border-r border-gray-300 mx-1"></div>
          
          <button className="py-1.5 px-3 text-sm rounded hover:bg-gray-100 flex items-center gap-1.5 transition-colors">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
          
          <button className="py-1.5 px-3 text-sm rounded hover:bg-gray-100 flex items-center gap-1.5 transition-colors">
            <HelpCircle className="h-4 w-4" />
            <span>Help</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;