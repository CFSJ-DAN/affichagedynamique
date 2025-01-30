import React from 'react';
import { Calendar, Clock, Monitor, Tag } from 'lucide-react';
import { useScheduleStore } from '../../stores/scheduleStore';
import { usePlaylistStore } from '../../stores/playlistStore';
import { useMediaStore } from '../../stores/mediaStore';
import Modal from '../common/Modal';
import { formatDuration } from '../../utils/mediaUtils';

interface ScheduleModalProps {
  screenId: string;
  isOpen: boolean;
  onClose: () => void;
}

const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  screenId,
  isOpen,
  onClose,
}) => {
  const { slots } = useScheduleStore();
  const { playlists } = usePlaylistStore();
  const { items: mediaItems } = useMediaStore();

  const screenSlots = slots.filter(slot => slot.screenId === screenId);

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return 'Pas de limite de dates';
    if (startDate && !endDate) return `À partir du ${new Date(startDate).toLocaleDateString()}`;
    if (!startDate && endDate) return `Jusqu'au ${new Date(endDate).toLocaleDateString()}`;
    return `Du ${new Date(startDate).toLocaleDateString()} au ${new Date(endDate).toLocaleDateString()}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Planification de l'écran">
      <div className="space-y-6">
        {screenSlots.map((slot) => {
          const playlist = playlists.find(p => p.id === slot.playlistId);
          const media = mediaItems.find(m => m.id === slot.playlistId);
          const content = playlist || media;

          if (!content) return null;

          return (
            <div
              key={slot.id}
              className={`rounded-lg border overflow-hidden ${
                slot.isActive ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              {/* Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {content.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {playlist ? 'Liste de lecture' : 'Média'} • {formatDuration(content.duration)}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      slot.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {slot.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm font-medium text-gray-700">
                      <Calendar size={16} className="mr-2" />
                      Période
                    </div>
                    <div className="text-gray-600">
                      {formatDateRange(slot.startDate, slot.endDate)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-sm font-medium text-gray-700">
                      <Clock size={16} className="mr-2" />
                      Horaires
                    </div>
                    <div className="text-gray-600">
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <Monitor size={16} className="mr-2" />
                    Jours de diffusion
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {slot.days.map((day) => (
                      <span
                        key={day}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                      >
                        {daysOfWeek[day]}
                      </span>
                    ))}
                  </div>
                </div>

                {'tags' in content && content.tags?.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium text-gray-700">
                      <Tag size={16} className="mr-2" />
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {content.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {screenSlots.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
            <p className="text-gray-500">
              Aucune planification configurée pour cet écran
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ScheduleModal;