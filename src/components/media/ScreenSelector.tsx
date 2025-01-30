import React from 'react';
import { Monitor } from 'lucide-react';
import type { Screen } from '../../types/screen';

interface ScreenSelectorProps {
  screens: Screen[];
  selectedScreens: string[];
  onSelect: (screenIds: string[]) => void;
}

const ScreenSelector: React.FC<ScreenSelectorProps> = ({
  screens,
  selectedScreens,
  onSelect,
}) => {
  const toggleScreen = (screenId: string) => {
    onSelect(
      selectedScreens.includes(screenId)
        ? selectedScreens.filter(id => id !== screenId)
        : [...selectedScreens, screenId]
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Écrans de diffusion
      </label>
      <div className="grid grid-cols-2 gap-2">
        {screens.map((screen) => (
          <button
            key={screen.id}
            type="button"
            onClick={() => toggleScreen(screen.id)}
            className={`p-3 rounded-lg border text-left ${
              selectedScreens.includes(screen.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Monitor size={16} className="mr-2 text-gray-500" />
              <div>
                <div className="font-medium">{screen.name}</div>
                <div className="text-sm text-gray-500">{screen.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScreenSelector;