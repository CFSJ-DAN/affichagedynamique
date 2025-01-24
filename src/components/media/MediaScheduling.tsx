import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { Screen } from '../../types/screen';

interface MediaSchedulingProps {
  screens: Screen[];
  selectedScreens: string[];
  onSelect: (screenIds: string[]) => void;
}

const daysOfWeek = [
  { value: 0, label: 'Dim' },
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mer' },
  { value: 4, label: 'Jeu' },
  { value: 5, label: 'Ven' },
  { value: 6, label: 'Sam' },
];

const MediaScheduling: React.FC<MediaSchedulingProps> = ({
  screens,
  selectedScreens,
  onSelect,
}) => {
  const [isSchedulingEnabled, setIsSchedulingEnabled] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');

  const toggleScreen = (screenId: string) => {
    onSelect(
      selectedScreens.includes(screenId)
        ? selectedScreens.filter(id => id !== screenId)
        : [...selectedScreens, screenId]
    );
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort((a, b) => a - b)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isSchedulingEnabled}
            onChange={(e) => {
              setIsSchedulingEnabled(e.target.checked);
              if (!e.target.checked) {
                onSelect([]);
              }
            }}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">
            Programmer la diffusion sur des écrans
          </span>
        </label>

        {isSchedulingEnabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                  <div className="font-medium">{screen.name}</div>
                  <div className="text-sm text-gray-500">{screen.description}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début (optionnelle)
                </label>
                <div className="flex items-center">
                  <Calendar size={16} className="text-gray-400 mr-2" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin (optionnelle)
                </label>
                <div className="flex items-center">
                  <Calendar size={16} className="text-gray-400 mr-2" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de début
                </label>
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-400 mr-2" />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de fin
                </label>
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-400 mr-2" />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jours de diffusion
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleDay(value)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                      selectedDays.includes(value)
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaScheduling;