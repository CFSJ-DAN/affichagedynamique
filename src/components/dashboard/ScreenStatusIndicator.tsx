import React, { useMemo } from 'react';
import { Monitor } from 'lucide-react';
import type { Screen } from '../../types/screen';

interface ScreenStatusIndicatorProps {
  screens: Screen[];
}

const ScreenStatusIndicator: React.FC<ScreenStatusIndicatorProps> = ({ screens }) => {
  // Calculer la largeur minimale basée sur le nom le plus long
  const minWidth = useMemo(() => {
    const longestName = screens.reduce((longest, screen) => 
      screen.name.length > longest.length ? screen.name : longest
    , '');
    // Ajouter un peu d'espace supplémentaire pour la marge
    return `${longestName.length * 0.7}rem`;
  }, [screens]);

  return (
    <div className="flex flex-wrap gap-3">
      {screens.map((screen) => (
        <div
          key={screen.id}
          style={{ minWidth }}
          className={`flex flex-col items-center p-3 rounded-lg border-2 ${
            screen.status === 'online'
              ? 'border-blue-200 bg-blue-50'
              : 'border-red-200 bg-red-50'
          }`}
        >
          <Monitor
            className={`w-6 h-6 mb-2 ${
              screen.status === 'online' ? 'text-green-500' : 'text-red-500'
            }`}
          />
          <span className="text-sm font-medium text-gray-700 text-center whitespace-nowrap">
            {screen.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ScreenStatusIndicator;