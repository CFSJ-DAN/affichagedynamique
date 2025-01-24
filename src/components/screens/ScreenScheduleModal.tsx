import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useScheduleStore } from '../../stores/scheduleStore';
import { usePlaylistStore } from '../../stores/playlistStore';
import { useMediaStore } from '../../stores/mediaStore';
import Modal from '../common/Modal';
import PlaylistPreviewModal from './PlaylistPreviewModal';
import DailySchedule from './schedule/DailySchedule';
import WeeklySchedule from './schedule/WeeklySchedule';

interface ScreenScheduleModalProps {
  screenId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ScreenScheduleModal: React.FC<ScreenScheduleModalProps> = ({
  screenId,
  isOpen,
  onClose,
}) => {
  const [view, setView] = useState<'daily' | 'weekly'>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [previewPlaylist, setPreviewPlaylist] = useState<string | null>(null);

  const handlePrevious = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'daily') {
        newDate.setDate(prev.getDate() - 1);
      } else {
        newDate.setDate(prev.getDate() - 7);
      }
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'daily') {
        newDate.setDate(prev.getDate() + 1);
      } else {
        newDate.setDate(prev.getDate() + 7);
      }
      return newDate;
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Planification de l'écran" size="xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setView('daily')}
                className={`px-4 py-2 rounded-md ${
                  view === 'daily'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => setView('weekly')}
                className={`px-4 py-2 rounded-md ${
                  view === 'weekly'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Cette semaine
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevious}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-lg font-medium">
                {view === 'daily' 
                  ? currentDate.toLocaleDateString('fr-FR', { 
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })
                  : `Semaine du ${new Date(currentDate.getTime() - (currentDate.getDay() * 24 * 60 * 60 * 1000)).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long'
                    })}`
                }
              </span>
              <button
                onClick={handleNext}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {view === 'daily' ? (
            <DailySchedule
              screenId={screenId}
              date={currentDate}
              onPreviewPlaylist={setPreviewPlaylist}
            />
          ) : (
            <WeeklySchedule
              screenId={screenId}
              startDate={currentDate}
              onPreviewPlaylist={setPreviewPlaylist}
            />
          )}
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

export default ScreenScheduleModal;