import React from 'react';
import { Eye } from 'lucide-react';
import { useScheduleStore } from '../../../stores/scheduleStore';
import { usePlaylistStore } from '../../../stores/playlistStore';
import { useMediaStore } from '../../../stores/mediaStore';
import { formatDuration } from '../../../utils/mediaUtils';

interface DailyScheduleProps {
  screenId: string;
  date: Date;
  onPreviewPlaylist: (playlistId: string) => void;
}

const DailySchedule: React.FC<DailyScheduleProps> = ({
  screenId,
  date,
  onPreviewPlaylist,
}) => {
  const { slots } = useScheduleStore();
  const { playlists } = usePlaylistStore();
  const { items: mediaItems } = useMediaStore();

  const isSlotActiveOnDay = (slot: typeof slots[0]) => {
    const dayOfWeek = date.getDay();
    if (!slot.days.includes(dayOfWeek)) return false;

    if (slot.startDate) {
      const startDate = new Date(slot.startDate);
      if (date < startDate) return false;
    }

    if (slot.endDate) {
      const endDate = new Date(slot.endDate);
      if (date > endDate) return false;
    }

    return true;
  };

  const activeSlots = slots
    .filter(slot => slot.screenId === screenId && slot.isActive && isSlotActiveOnDay(slot))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-4">
      {activeSlots.map(slot => {
        const playlist = playlists.find(p => p.id === slot.playlistId);
        const media = mediaItems.find(m => m.id === slot.playlistId);
        const content = playlist || media;
        
        if (!content) return null;

        return (
          <div
            key={slot.id}
            className="flex items-center p-4 bg-white rounded-lg border"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{content.name}</h3>
                  <span className="text-sm text-gray-500">
                    {playlist ? 'Liste de lecture' : 'Média'} • {formatDuration(content.duration)}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {slot.startTime} - {slot.endTime}
                </div>
              </div>
            </div>
            {playlist && (
              <button
                onClick={() => onPreviewPlaylist(playlist.id)}
                className="ml-4 p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                title="Voir les médias"
              >
                <Eye size={16} />
              </button>
            )}
          </div>
        );
      })}

      {activeSlots.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <p className="text-gray-500">
            Aucune diffusion programmée pour cette journée
          </p>
        </div>
      )}
    </div>
  );
};

export default DailySchedule;