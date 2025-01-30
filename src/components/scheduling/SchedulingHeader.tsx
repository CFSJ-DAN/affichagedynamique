import React from 'react';
import { Plus } from 'lucide-react';

interface SchedulingHeaderProps {
  onNewSchedule: () => void;
}

const SchedulingHeader: React.FC<SchedulingHeaderProps> = ({ onNewSchedule }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">Planification</h1>
      <button
        onClick={onNewSchedule}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <Plus size={20} className="mr-2" />
        Nouvelle planification
      </button>
    </div>
  );
};

export default SchedulingHeader;