import React, { useState, useEffect, useCallback } from 'react';
import type { MediaItem } from '../../../types/media';
import { applyTransitionStyles } from '../../../utils/transitionUtils';
import PreviewControls from './PreviewControls';
import PreviewProgress from './PreviewProgress';

interface PlaylistPreviewProps {
  items: MediaItem[];
  onClose: () => void;
}

const PlaylistPreview: React.FC<PlaylistPreviewProps> = ({ items, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentItem = items[currentIndex];
  const nextItem = items[(currentIndex + 1) % items.length];

  const goToNextMedia = useCallback(() => {
    if (!items.length) return;
    setCurrentIndex(current => (current + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!items.length || isPaused) return;
    setTimeLeft(currentItem.duration);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          goToNextMedia();
          return items[(currentIndex + 1) % items.length].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, items, isPaused, goToNextMedia]);

  const handleTransition = useCallback(() => {
    const currentElement = document.getElementById(`media-${currentItem.id}`);
    const nextElement = document.getElementById(`media-${nextItem.id}`);

    if (currentElement && nextElement && currentItem.transition) {
      applyTransitionStyles(currentElement, currentItem.transition, false);
      applyTransitionStyles(nextElement, currentItem.transition, true);
    }
  }, [currentItem, nextItem]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative h-full flex flex-col">
        {/* Zone de prévisualisation */}
        <div className="flex-1 relative overflow-hidden">
          {items.map((item, index) => (
            <div
              key={item.id}
              id={`media-${item.id}`}
              className={`absolute inset-0 flex items-center justify-center ${
                index === currentIndex ? 'z-10' : 'z-0'
              }`}
              style={{
                opacity: index === currentIndex ? 1 : 0,
                transition: `opacity ${item.transition?.duration || 500}ms ease-in-out`
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
                  src={item.url}
                  autoPlay
                  muted
                  className="max-h-full max-w-full object-contain"
                  onEnded={goToNextMedia}
                />
              )}
            </div>
          ))}
        </div>

        {/* Contrôles et progression */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <PreviewProgress
            currentItem={currentItem}
            timeLeft={timeLeft}
            totalItems={items.length}
            currentIndex={currentIndex}
          />
          <PreviewControls
            isPaused={isPaused}
            onPause={() => setIsPaused(true)}
            onPlay={() => setIsPaused(false)}
            onPrevious={() => setCurrentIndex(prev => (prev - 1 + items.length) % items.length)}
            onNext={goToNextMedia}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default PlaylistPreview;