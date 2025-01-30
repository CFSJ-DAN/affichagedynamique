import React from 'react';
import { Calendar, Monitor, Edit, Trash2 } from 'lucide-react';
import type { TimeSlot } from '../../types/schedule';
import type { Playlist } from '../../types/playlist';
import type { Screen } from '../../types/screen';

interface SchedulingListProps {
  slots: TimeSlot[];
  playlists: Playlist[];
  screens: Screen[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SchedulingList: React.FC<SchedulingListProps> = ({
  slots,
  playlists,
  screens,
  onEdit,
  onDelete,
}) => {
  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return 'Pas de limite de dates';
    if (startDate && !endDate) return `À partir du ${new Date(startDate).toLocaleDateString()}`;
    if (!startDate && endDate) return `Jusqu'au ${new Date(endDate).toLocaleDateString()}`;
    return `Du ${new Date(startDate).toLocaleDateString()} au ${new Date(endDate).toLocaleDateString()}`;
  };

  return (
    <div className="space-y-4">
      {slots.map((slot) => {
        const playlist = playlists.find(p => p.id === slot.playlistId);
        const screen = screens.find(s => s.id === slot.screenId);
        
        if (!playlist || !screen) return null;

        return (
          <div
            key={slot.id}
            className="bg-white rounded-lg shadow-sm border p-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {playlist.name}
                </h3>
                
                <div className="flex items-center text-gray-600">
                  <Monitor size={16} className="mr-2" />
                  <span>{screen.name}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>{formatDateRange(slot.startDate, slot.endDate)}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(slot.id)}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(slot.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      {slots.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500">Aucune planification configurée</p>
        </div>
      )}
    </div>
  );
};

export default SchedulingList;