import React from 'react';
import { Upload, Filter } from 'lucide-react';

interface MediaHeaderProps {
  onUpload: () => void;
  onFilter: () => void;
}

const MediaHeader: React.FC<MediaHeaderProps> = ({ onUpload, onFilter }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">Médiathèque</h1>
      <div className="flex space-x-4">
        <button
          onClick={onFilter}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          <Filter size={20} className="mr-2" />
          Filtrer
        </button>
        <button
          onClick={onUpload}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Upload size={20} className="mr-2" />
          Importer
        </button>
      </div>
    </div>
  );
};

export default MediaHeader;