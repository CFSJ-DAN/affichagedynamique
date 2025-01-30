import React from 'react';
import { Clock, Tag } from 'lucide-react';
import type { MediaItem } from '../../../types/media';
import { formatDuration } from '../../../utils/mediaUtils';

interface MediaInfoProps {
  item: MediaItem;
}

export const MediaInfo: React.FC<MediaInfoProps> = ({ item }) => (
  <div className="flex-1 min-w-0">
    <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
    <div className="flex flex-wrap gap-3 mt-1">
      <div className="flex items-center text-sm text-gray-500">
        <Clock size={14} className="mr-1" />
        {formatDuration(item.duration)}
      </div>
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.tags.map(tag => (
            <span 
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600"
            >
              <Tag size={12} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);