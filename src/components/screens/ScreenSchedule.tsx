import React, { useState } from 'react';
import { Plus, Calendar, Clock, Edit } from 'lucide-react';
import { useScheduleStore } from '../../stores/scheduleStore';
import { usePlaylistStore } from '../../stores/playlistStore';
import type { TimeSlot, TimeSlotFormData } from '../../types/schedule';

interface ScreenScheduleProps {
  screenId: string;
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

const defaultFormData: TimeSlotFormData = {
  startTime: '00:00',
  endTime: '23:59',
  days: [0, 1, 2, 3, 4, 5, 6], // Tous les jours par défaut
  playlistId: '',
};

const ScreenSchedule: React.FC<ScreenScheduleProps> = ({ screenId }) => {
  const { slots, addTimeSlot, deleteTimeSlot, toggleTimeSlot, updateTimeSlot } = useScheduleStore();
  const { playlists } = usePlaylistStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState<TimeSlotFormData>(defaultFormData);

  const screenSlots = slots.filter((slot) => slot.screenId === screenId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.days.length === 0 || !formData.playlistId) return;
    
    // Validation des dates
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      alert('La date de fin doit être postérieure à la date de début');
      return;
    }
    
    if (editingSlot) {
      updateTimeSlot(editingSlot.id, formData);
    } else {
      addTimeSlot(screenId, formData);
    }
    
    setIsAdding(false);
    setEditingSlot(null);
    setFormData(defaultFormData);
  };

  const handleEdit = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setFormData({
      startTime: slot.startTime,
      endTime: slot.endTime,
      startDate: slot.startDate,
      endDate: slot.endDate,
      days: slot.days,
      playlistId: slot.playlistId,
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingSlot(null);
    setFormData(defaultFormData);
  };

  const toggleDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return 'Pas de limite de dates';
    if (startDate && !endDate) return `À partir du ${new Date(startDate).toLocaleDateString()}`;
    if (!startDate && endDate) return `Jusqu'au ${new Date(endDate).toLocaleDateString()}`;
    return `Du ${new Date(startDate).toLocaleDateString()} au ${new Date(endDate).toLocaleDateString()}`;
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Planification</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={16} className="mr-1" />
            Ajouter un créneau
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début (optionnelle)
              </label>
              <input
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value || undefined })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin (optionnelle)
              </label>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value || undefined })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de début
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de fin
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Liste de diffusion
            </label>
            <select
              value={formData.playlistId}
              onChange={(e) => setFormData({ ...formData, playlistId: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Sélectionner une liste</option>
              {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={formData.days.length === 0 || !formData.playlistId}
            >
              {editingSlot ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {screenSlots.map((slot) => {
          const playlist = playlists.find((p) => p.id === slot.playlistId);
          return (
            <div
              key={slot.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                slot.isActive ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-600">
                    <Clock size={16} className="mr-2" />
                    <span>
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>
                      {slot.days.map((day) => daysOfWeek[day].label).join(', ')}
                    </span>
                  </div>
                  <span className="text-blue-600 font-medium">
                    {playlist?.name}
                  </span>
                </div>
                {(slot.startDate || slot.endDate) && (
                  <div className="text-sm text-gray-500">
                    {formatDateRange(slot.startDate, slot.endDate)}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleTimeSlot(slot.id)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    slot.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {slot.isActive ? 'Actif' : 'Inactif'}
                </button>
                <button
                  onClick={() => handleEdit(slot)}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteTimeSlot(slot.id)}
                  className="p-1 text-red-600 hover:text-red-700"
                >
                  <span className="sr-only">Supprimer</span>
                  ×
                </button>
              </div>
            </div>
          );
        })}
        {screenSlots.length === 0 && !isAdding && (
          <p className="text-center text-gray-500 py-4">
            Aucun créneau planifié
          </p>
        )}
      </div>
    </div>
  );
};

export default ScreenSchedule;