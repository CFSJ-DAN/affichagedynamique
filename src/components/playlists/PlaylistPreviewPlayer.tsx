import React, { useState, useEffect, useCallback } from 'react';
import { X, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { usePlaylistStore } from '../../stores/playlistStore';

interface PlaylistPreviewPlayerProps {
  playlistId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PlaylistPreviewPlayer: React.FC<PlaylistPreviewPlayerProps> = ({
  playlistId,
  isOpen,
  onClose,
}) => {
  const { playlists } = usePlaylistStore();
  const playlist = playlists.find(p => p.id === playlistId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNextMedia = useCallback(() => {
    if (!playlist?.items.length) return;
    setCurrentIndex(current => (current + 1) % playlist.items.length);
  }, [playlist?.items.length]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && playlist?.items.length) {
      setCurrentIndex(0);
      setTimeLeft(playlist.items[0].duration);
      setIsPaused(false);
    }
  }, [isOpen, playlist]);

  // Handle timer
  useEffect(() => {
    if (!isOpen || !playlist?.items.length || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          goToNextMedia();
          return playlist.items[(currentIndex + 1) % playlist.items.length].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, playlist, currentIndex, goToNextMedia, isPaused]);

  // Update timeLeft when changing media
  useEffect(() => {
    if (playlist?.items[currentIndex]) {
      setTimeLeft(playlist.items[currentIndex].duration);
    }
  }, [currentIndex, playlist?.items]);

  if (!isOpen || !playlist?.items.length) return null;

  const currentItem = playlist.items[currentIndex];
  const transition = playlist.transition;
  const transitionStyle = transition ? {
    transition: `all ${transition.duration}ms ease-in-out`,
    ...(transition.type === 'fade' && { opacity: 1 }),
    ...(transition.type === 'slide' && { transform: 'translateX(0)' }),
    ...(transition.type === 'zoom' && { transform: 'scale(1)' })
  } : {};

  return (
    <div className="fixed inset-0 z-50 flex bg-black bg-opacity-90">
      <div className="flex-1 flex flex-col">
        {/* Zone de prévisualisation */}
        <div className="flex-1 relative overflow-hidden">
          {playlist.items.map((item, index) => {
            const isVisible = index === currentIndex;
            const exitStyle = transition ? {
              ...(transition.type === 'fade' && { opacity: 0 }),
              ...(transition.type === 'slide' && { transform: 'translateX(100%)' }),
              ...(transition.type === 'zoom' && { transform: 'scale(0)' })
            } : {};

            return (
              <div
                key={item.id}
                className={`absolute inset-0 flex items-center justify-center ${
                  isVisible ? 'z-10' : 'z-0'
                }`}
                style={{
                  ...transitionStyle,
                  ...(isVisible ? {} : exitStyle)
                }}
              >
                {item.type === 'image' && (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                )}
                {item.type === 'video' && (
                  <video
                    key={item.id}
                    src={item.url}
                    autoPlay
                    muted
                    className="max-h-full max-w-full object-contain"
                    onEnded={goToNextMedia}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Contrôles */}
        <div className="bg-black bg-opacity-50 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium">{currentItem.name}</h3>
            <span className="text-gray-300 text-sm">
              {timeLeft}s • {currentIndex + 1}/{playlist.items.length}
            </span>
          </div>

          <div className="h-1 bg-gray-700 rounded overflow-hidden mb-4">
            <div
              className="h-full bg-blue-500 transition-all duration-1000"
              style={{
                width: `${(timeLeft / currentItem.duration) * 100}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setCurrentIndex(prev => 
                (prev - 1 + playlist.items.length) % playlist.items.length
              )}
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
              onClick={goToNextMedia}
              className="p-2 text-white/80 hover:text-white"
            >
              <SkipForward size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Liste des médias */}
      <div className="w-64 bg-black bg-opacity-50 p-4 overflow-y-auto">
        <h3 className="text-white font-medium mb-4">Liste des médias</h3>
        <div className="space-y-2">
          {playlist.items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(index)}
              className={`w-full flex items-center p-2 rounded ${
                index === currentIndex
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <div className="w-16 h-12 flex-shrink-0 rounded overflow-hidden mr-2">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="truncate text-sm">{item.name}</div>
                <div className="text-xs opacity-75">{item.duration}s</div>
              </div>
            </button>
          ))}
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

export default PlaylistPreviewPlayer;