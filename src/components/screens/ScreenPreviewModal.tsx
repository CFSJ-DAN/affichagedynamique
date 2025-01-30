import React, { useState, useEffect } from 'react';
import { X, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useScheduleStore } from '../../stores/scheduleStore';
import { usePlaylistStore } from '../../stores/playlistStore';
import type { Screen } from '../../types/screen';
import type { MediaItem } from '../../types/media';

interface ScreenPreviewModalProps {
  screen: Screen;
  isOpen: boolean;
  onClose: () => void;
}

const ScreenPreviewModal: React.FC<ScreenPreviewModalProps> = ({
  screen,
  isOpen,
  onClose,
}) => {
  const { slots } = useScheduleStore();
  const { playlists } = usePlaylistStore();
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Obtenir les playlists actives pour cet écran à l'heure actuelle
  const getCurrentPlaylists = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    return slots
      .filter(slot => {
        if (!slot.isActive || slot.screenId !== screen.id) return false;
        if (!slot.days.includes(currentDay)) return false;
        
        const startTime = slot.startTime;
        const endTime = slot.endTime;
        
        if (startTime <= currentTime && currentTime <= endTime) {
          const playlist = playlists.find(p => p.id === slot.playlistId);
          return playlist && playlist.items.length > 0;
        }
        
        return false;
      })
      .map(slot => playlists.find(p => p.id === slot.playlistId))
      .filter((playlist): playlist is NonNullable<typeof playlist> => playlist !== undefined);
  };

  const activePlaylists = getCurrentPlaylists();
  const currentPlaylist = activePlaylists[currentPlaylistIndex];
  const currentMedia = currentPlaylist?.items[currentMediaIndex];

  useEffect(() => {
    if (!isOpen || !currentMedia || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Passer au média suivant
          const nextMediaIndex = currentMediaIndex + 1;
          if (nextMediaIndex < (currentPlaylist?.items.length || 0)) {
            setCurrentMediaIndex(nextMediaIndex);
            return currentPlaylist?.items[nextMediaIndex].duration || 0;
          } else {
            // Passer à la playlist suivante
            const nextPlaylistIndex = (currentPlaylistIndex + 1) % activePlaylists.length;
            setCurrentPlaylistIndex(nextPlaylistIndex);
            setCurrentMediaIndex(0);
            return activePlaylists[nextPlaylistIndex]?.items[0]?.duration || 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, currentMedia, isPaused, currentMediaIndex, currentPlaylistIndex, currentPlaylist, activePlaylists]);

  useEffect(() => {
    if (currentMedia) {
      setTimeLeft(currentMedia.duration);
    }
  }, [currentMedia]);

  if (!isOpen) return null;

  const handlePrevious = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(prev => prev - 1);
    } else if (currentPlaylistIndex > 0) {
      setCurrentPlaylistIndex(prev => prev - 1);
      setCurrentMediaIndex(activePlaylists[currentPlaylistIndex - 1].items.length - 1);
    }
  };

  const handleNext = () => {
    if (currentMediaIndex < (currentPlaylist?.items.length || 0) - 1) {
      setCurrentMediaIndex(prev => prev + 1);
    } else if (currentPlaylistIndex < activePlaylists.length - 1) {
      setCurrentPlaylistIndex(prev => prev + 1);
      setCurrentMediaIndex(0);
    }
  };

  if (activePlaylists.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
        <div className="bg-white p-8 rounded-lg max-w-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Aucun contenu programmé</h2>
          <p className="text-gray-600 mb-6">
            Il n'y a actuellement aucune liste de diffusion programmée pour cet écran.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-black bg-opacity-90">
      <div className="flex-1 flex flex-col">
        {/* Zone de prévisualisation */}
        <div className="flex-1 relative overflow-hidden">
          {currentMedia && (
            <div className="absolute inset-0 flex items-center justify-center">
              {currentMedia.type === 'image' && (
                <img
                  src={currentMedia.url}
                  alt={currentMedia.name}
                  className="max-h-full max-w-full object-contain"
                />
              )}
              {currentMedia.type === 'video' && (
                <video
                  src={currentMedia.url}
                  autoPlay
                  muted
                  className="max-h-full max-w-full object-contain"
                  onEnded={handleNext}
                />
              )}
            </div>
          )}
        </div>

        {/* Contrôles */}
        <div className="bg-black bg-opacity-50 p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-white font-medium">{currentPlaylist?.name}</h3>
              <h4 className="text-gray-300 text-sm">{currentMedia?.name}</h4>
            </div>
            <span className="text-gray-300 text-sm">
              {timeLeft}s • {currentMediaIndex + 1}/{currentPlaylist?.items.length} • 
              Liste {currentPlaylistIndex + 1}/{activePlaylists.length}
            </span>
          </div>

          <div className="h-1 bg-gray-700 rounded overflow-hidden mb-4">
            <div
              className="h-full bg-blue-500 transition-all duration-1000"
              style={{
                width: `${(timeLeft / (currentMedia?.duration || 1)) * 100}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handlePrevious}
              className="p-2 text-white/80 hover:text-white"
            >
              <SkipBack size={24} />
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-3 bg-white rounded-full text-black hover:bg-white/90"
            >
              {isPaused ? <Play size={24} /> : <Pause size={24} />}
            </button>
            <button
              onClick={handleNext}
              className="p-2 text-white/80 hover:text-white"
            >
              <SkipForward size={24} />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X size={24} />
      </button>
    </div>
  );
};

export default ScreenPreviewModal;