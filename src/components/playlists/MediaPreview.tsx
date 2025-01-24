import React from 'react';
import type { MediaItem } from '../../types/media';
import { Image, Video, Type, Layout } from 'lucide-react';

interface MediaPreviewProps {
  item: MediaItem;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ item }) => {
  if (item.type === 'image') {
    return (
      <img
        src={item.url}
        alt={item.name}
        className="w-16 h-12 object-cover rounded mr-4"
      />
    );
  }

  if (item.type === 'video') {
    return (
      <video
        src={item.url}
        className="w-16 h-12 object-cover rounded mr-4"
      />
    );
  }

  const IconComponent = {
    text: Type,
    widget: Layout,
  }[item.type] || Image;

  return (
    <div className="w-16 h-12 flex items-center justify-center bg-gray-100 rounded mr-4">
      <IconComponent className="w-6 h-6 text-gray-400" />
    </div>
  );
};

export default MediaPreview;