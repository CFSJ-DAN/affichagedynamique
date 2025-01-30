import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useScheduleStore } from '../../stores/scheduleStore';
import { usePlaylistStore } from '../../stores/playlistStore';
import { useMediaStore } from '../../stores/mediaStore';
import Modal from '../common/Modal';
import PlaylistPreviewModal from './PlaylistPreviewModal';

interface ScreenCalendarModalProps {
  screenId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ScreenCalendarModal: React.FC<ScreenCalendarModalProps> = ({
  screenId,
  isOpen,
  onClose,
}) => {
  const { slots } = useScheduleStore();
  const { playlists } = usePlaylistStore();
  const { items: mediaItems } = useMediaStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [previewPlaylist, setPreviewPlaylist] = useState<string | null>(null);

  const screenSlots = slots.filter(slot => slot.screenId === screenId && slot.isActive);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isSlotActiveOnDay = (slot: typeof slots[0], day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
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

  const getContentForDay = (day: number) => {
    return screenSlots.filter(slot => isSlotActiveOnDay(slot, day));
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Calendrier des diffusions" size="xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {dayNames.map(day => (
              <div
                key={day}
                className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700"
              >
                {day}
              </div>
            ))}
            
            {Array.from({ length: 42 }, (_, i) => {
              const day = i - firstDayOfMonth + 1;
              const isCurrentMonth = day > 0 && day <= daysInMonth;
              const dayContent = isCurrentMonth ? getContentForDay(day) : [];

              return (
                <div
                  key={i}
                  className={`min-h-[150px] p-3 ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {isCurrentMonth && (
                    <>
                      <div className="text-right text-sm text-gray-500 mb-2">
                        {day}
                      </div>
                      <div className="space-y-2">
                        {dayContent.map(slot => {
                          const playlist = playlists.find(p => p.id === slot.playlistId);
                          const media = mediaItems.find(m => m.id === slot.playlistId);
                          const content = playlist || media;
                          
                          if (!content) return null;

                          return (
                            <div
                              key={slot.id}
                              className="flex items-center justify-between p-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                            >
                              <span className="truncate flex-1">
                                {content.name}
                              </span>
                              {playlist && (
                                <button
                                  onClick={() => setPreviewPlaylist(playlist.id)}
                                  className="ml-2 p-1 hover:bg-blue-200 rounded"
                                >
                                  <Eye size={14} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      {previewPlaylist && (
        <PlaylistPreviewModal
          playlistId={previewPlaylist}
          isOpen={true}
          onClose={() => setPreviewPlaylist(null)}
        />
      )}
    </>
  );
};

export default ScreenCalendarModal;