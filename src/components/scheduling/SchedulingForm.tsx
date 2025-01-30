import React, { useState } from 'react';
import { Calendar, Clock, RefreshCw } from 'lucide-react';
import type { Screen } from '../../types/screen';
import type { ScheduleFormData } from '../../types/schedule';

interface SchedulingFormProps {
  screens: Screen[];
  onSubmit: (data: ScheduleFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ScheduleFormData>;
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

const recurrenceTypes = [
  { value: 'day', label: 'Jour(s)' },
  { value: 'week', label: 'Semaine(s)' },
  { value: 'month', label: 'Mois' },
  { value: 'year', label: 'Année(s)' },
];

const SchedulingForm: React.FC<SchedulingFormProps> = ({
  screens,
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    screenIds: initialData?.screenIds || [],
    startDate: initialData?.startDate,
    endDate: initialData?.endDate,
    startTime: initialData?.startTime || '00:00',
    endTime: initialData?.endTime || '23:59',
    days: initialData?.days || [0, 1, 2, 3, 4, 5, 6],
  });

  const [hasRecurrence, setHasRecurrence] = useState(!!initialData?.recurrence);
  const [recurrence, setRecurrence] = useState(initialData?.recurrence || {
    type: 'day',
    interval: 1,
  });

  const toggleScreen = (screenId: string) => {
    setFormData(prev => ({
      ...prev,
      screenIds: prev.screenIds.includes(screenId)
        ? prev.screenIds.filter(id => id !== screenId)
        : [...prev.screenIds, screenId],
    }));
  };

  const toggleDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day].sort(),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.screenIds.length === 0) return;
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      alert('La date de fin doit être postérieure à la date de début');
      return;
    }
    
    onSubmit({
      ...formData,
      recurrence: hasRecurrence ? recurrence : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Écrans
        </label>
        <div className="grid grid-cols-2 gap-2">
          {screens.map((screen) => (
            <button
              key={screen.id}
              type="button"
              onClick={() => toggleScreen(screen.id)}
              className={`p-3 rounded-lg border text-left ${
                formData.screenIds.includes(screen.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{screen.name}</div>
              <div className="text-sm text-gray-500">{screen.description}</div>
            </button>
          ))}
        </div>
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
              value={formData.startDate || ''}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value || undefined })}
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
              value={formData.endDate || ''}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value || undefined })}
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
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
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
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
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
                formData.days.includes(value)
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={hasRecurrence}
            onChange={(e) => setHasRecurrence(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">
            Activer la récurrence
          </span>
        </label>

        {hasRecurrence && (
          <div className="flex items-center space-x-4 pl-6">
            <div className="flex items-center">
              <RefreshCw size={16} className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Tous les</span>
            </div>
            <input
              type="number"
              min="1"
              value={recurrence.interval}
              onChange={(e) => setRecurrence({
                ...recurrence,
                interval: parseInt(e.target.value) || 1,
              })}
              className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <select
              value={recurrence.type}
              onChange={(e) => setRecurrence({
                ...recurrence,
                type: e.target.value as typeof recurrence.type,
              })}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {recurrenceTypes.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          disabled={formData.screenIds.length === 0}
        >
          Planifier
        </button>
      </div>
    </form>
  );
};

export default SchedulingForm;