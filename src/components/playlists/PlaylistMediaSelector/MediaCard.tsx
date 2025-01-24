import React from 'react';
import type { MediaItem } from '../../../types/media';
import { MediaThumbnail } from './MediaThumbnail';
import { MediaInfo } from './MediaInfo';

interface MediaCardProps {
  item: MediaItem;
  isSelected: boolean;
  onSelect: () => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  isSelected,
  onSelect,
}) => (
  <div
    onClick={onSelect}
    className={`cursor-pointer rounded-lg border transition-all ${
      isSelected 
        ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' 
        : 'border-gray-200 hover:border-gray-300'
    }`}
  >
    <MediaThumbnail type={item.type} url={item.url} />
    <MediaInfo name={item.name} duration={item.duration} />
  </div>
);