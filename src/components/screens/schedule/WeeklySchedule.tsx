import React from 'react';
import { Eye } from 'lucide-react';
import { useScheduleStore } from '../../../stores/scheduleStore';
import { usePlaylistStore } from '../../../stores/playlistStore';
import { useMediaStore } from '../../../stores/mediaStore';
import { formatDuration } from '../../../utils/mediaUtils';

interface WeeklyScheduleProps {
  screenId: string;
  startDate: Date;
  onPreviewPlaylist: (playlistId: string) => void;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  screenId,
  startDate,
  onPreviewPlaylist,
}) => {
  const { slots } = useScheduleStore();
  const { playlists } = usePlaylistStore();
  const { items: mediaItems } = useMediaStore();

  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const isSlotActiveOnDay = (slot: typeof slots[0], date: Date) => {
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

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() - date.getDay() + i);
    return date;
  });

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
      {dayNames.map(day => (
        <div key={day} className="bg-gray-50 p-3 text-center font-medium">
          {day}
        </div>
      ))}
      
      {weekDays.map((date, index) => {
        const daySlots = slots
          .filter(slot => slot.screenId === screenId && slot.isActive && isSlotActiveOnDay(slot, date))
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        return (
          <div
            key={index}
            className="bg-white p-3 min-h-[200px] relative"
          >
            <div className="text-right text-sm text-gray-500 mb-2">
              {date.getDate()}
            </div>
            <div className="space-y-2">
              {daySlots.map(slot => {
                const playlist = playlists.find(p => p.id === slot.playlistId);
                const media = mediaItems.find(m => m.id === slot.playlistId);
                const content = playlist || media;
                
                if (!content) return null;

                return (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{content.name}</div>
                      <div className="text-xs text-blue-600">
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </div>
                    {playlist && (
                      <button
                        onClick={() => onPreviewPlaylist(playlist.id)}
                        className="ml-2 p-1 hover:bg-blue-200 rounded"
                        title="Voir les médias"
                      >
                        <Eye size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklySchedule;