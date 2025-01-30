import React from 'react';
import type { MediaItem } from '../../../types/media';

interface PreviewProgressProps {
  currentItem: MediaItem;
  timeLeft: number;
  totalItems: number;
  currentIndex: number;
}

const PreviewProgress: React.FC<PreviewProgressProps> = ({
  currentItem,
  timeLeft,
  totalItems,
  currentIndex,
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-white">
      <h3 className="font-medium">{currentItem.name}</h3>
      <span className="text-sm">
        {timeLeft}s • {currentIndex + 1}/{totalItems}
      </span>
    </div>
    <div className="h-1 bg-white/20 rounded overflow-hidden">
      <div
        className="h-full bg-white transition-all duration-1000"
        style={{
          width: `${(timeLeft / currentItem.duration) * 100}%`,
        }}
      />
    </div>
  </div>
);