import React, { useState } from 'react';
import { Plus, Calendar, Monitor } from 'lucide-react';
import { useScheduleStore } from '../../stores/scheduleStore';
import { useScreenStore } from '../../stores/screenStore';
import Modal from '../common/Modal';
import SchedulingForm from '../scheduling/SchedulingForm';

interface PlaylistScheduleProps {
  playlistId: string;
}

const PlaylistSchedule: React.FC<PlaylistScheduleProps> = ({ playlistId }) => {
  const { slots, addTimeSlot, deleteTimeSlot, updateTimeSlot } = useScheduleStore();
  const { screens } = useScreenStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const playlistSlots = slots.filter(slot => slot.playlistId === playlistId);

  const handleSubmit = (data: any) => {
    addTimeSlot({
      ...data,
      playlistId,
    });
    setIsModalOpen(false);
  };

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return 'Pas de limite de dates';
    if (startDate && !endDate) return `À partir du ${new Date(startDate).toLocaleDateString()}`;
    if (!startDate && endDate) return `Jusqu'au ${new Date(endDate).toLocaleDateString()}`;
    return `Du ${new Date(startDate).toLocaleDateString()} au ${new Date(endDate).toLocaleDateString()}`;
  };

  const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Planification</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={16} className="mr-1" />
          Ajouter
        </button>
      </div>

      <div className="space-y-3">
        {playlistSlots.map((slot) => {
          const screen = screens.find(s => s.id === slot.screenId);
          if (!screen) return null;

          return (
            <div
              key={slot.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-white"
            >
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Monitor size={16} className="mr-2" />
                  <span>{screen.name}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar size={14} className="mr-2" />
                  <span>{formatDateRange(slot.startDate, slot.endDate)}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {slot.days.map(day => (
                    <span key={day} className="px-2 py-0.5 bg-gray-100 rounded text-sm text-gray-600">
                      {daysOfWeek[day]}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  {slot.startTime} - {slot.endTime}
                </div>
              </div>
            </div>
          );
        })}
        {playlistSlots.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Aucune planification configurée
          </p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvelle planification"
      >
        <SchedulingForm
          screens={screens}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default PlaylistSchedule;