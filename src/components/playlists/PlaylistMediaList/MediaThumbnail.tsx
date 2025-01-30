import React from 'react';
import { Image, Video, Type, Layout } from 'lucide-react';
import type { MediaItem } from '../../../types/media';

interface MediaThumbnailProps {
  type: MediaItem['type'];
  url: string;
}

export const MediaThumbnail: React.FC<MediaThumbnailProps> = ({ type, url }) => {
  const TypeIcon = {
    image: Image,
    video: Video,
    text: Type,
    widget: Layout,
  }[type];

  return (
    <div className="flex-shrink-0 w-32 h-20 mr-4 relative overflow-hidden rounded bg-gray-100">
      {type === 'image' && (
        <img
          src={url}
          alt="Aperçu"
          className="w-full h-full object-cover"
        />
      )}
      {type === 'video' && (
        <video
          src={url}
          className="w-full h-full object-cover"
        />
      )}
      {(type === 'text' || type === 'widget') && (
        <div className="absolute inset-0 flex items-center justify-center">
          <TypeIcon className="w-12 h-12 text-gray-400" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1">
        {type.toUpperCase()}
      </div>
    </div>
  );
};