import React from 'react';
import { Plus } from 'lucide-react';

interface ScreenHeaderProps {
  onNewScreen: () => void;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ onNewScreen }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">Écrans</h1>
      <button
        onClick={onNewScreen}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <Plus size={20} className="mr-2" />
        Nouvel écran
      </button>
    </div>
  );
};

export default ScreenHeader;