import React from 'react';
import type { MediaItem } from '../../../types/media';

interface TransitionSelectorProps {
  value: NonNullable<MediaItem['transition']>;
  onChange: (transition: NonNullable<MediaItem['transition']>) => void;
}

const TransitionSelector: React.FC<TransitionSelectorProps> = ({ value, onChange }) => {
  const transitions = [
    { type: 'none', label: 'Aucune' },
    { type: 'fade', label: 'Fondu' },
    { type: 'slide', label: 'Glissement' },
    { type: 'zoom', label: 'Zoom' },
  ] as const;

  const durations = [
    { value: 300, label: '0.3s' },
    { value: 500, label: '0.5s' },
    { value: 1000, label: '1s' },
    { value: 1500, label: '1.5s' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type de transition
        </label>
        <div className="grid grid-cols-4 gap-2">
          {transitions.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ ...value, type })}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                value.type === type
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {value.type !== 'none' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Durée de la transition
          </label>
          <div className="grid grid-cols-4 gap-2">
            {durations.map(({ value: duration, label }) => (
              <button
                key={duration}
                type="button"
                onClick={() => onChange({ ...value, duration })}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  value.duration === duration
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransitionSelector;