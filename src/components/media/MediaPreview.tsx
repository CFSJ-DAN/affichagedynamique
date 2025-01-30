import React from 'react';
import { Image, Video, Type, Layout } from 'lucide-react';
import type { MediaItem } from '../../types/media';

interface MediaPreviewProps {
  type: MediaItem['type'];
  url?: string;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ type, url }) => {
  const TypeIcon = {
    image: Image,
    video: Video,
    text: Type,
    widget: Layout,
  }[type];

  return (
    <div className="relative aspect-video bg-gray-100">
      {type === 'image' && url && (
        <img
          src={url}
          alt="Aperçu"
          className="w-full h-full object-cover"
        />
      )}
      {type === 'video' && url && (
        <video
          src={url}
          className="w-full h-full object-cover"
        />
      )}
      {(type === 'text' || type === 'widget' || !url) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <TypeIcon className="w-12 h-12 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default MediaPreview;