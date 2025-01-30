import React from 'react';
import type { MediaItem } from '../../../../types/media';

interface ThumbnailProps {
  item: MediaItem;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({ item }) => (
  <div className="flex-shrink-0 w-32 h-20 mr-4 relative overflow-hidden rounded bg-gray-100">
    {item.type === 'image' && (
      <img
        src={item.url}
        alt={item.name}
        className="w-full h-full object-cover"
      />
    )}
    {item.type === 'video' && (
      <video
        src={item.url}
        className="w-full h-full object-cover"
      />
    )}
    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1">
      {item.type.toUpperCase()}
    </div>
  </div>
);