import React from 'react';
import type { Screen } from '../../types/screen';
import ScreenCard from './ScreenCard';

interface ScreenGridProps {
  screens: Screen[];
  onEdit: (screen: Screen) => void;
  onDelete: (id: string) => void;
}

const ScreenGrid: React.FC<ScreenGridProps> = ({
  screens,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {screens.map((screen) => (
        <ScreenCard
          key={screen.id}
          screen={screen}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      {screens.length === 0 && (
        <div className="col-span-full text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Aucun écran configuré</p>
        </div>
      )}
    </div>
  );
};

export default ScreenGrid;