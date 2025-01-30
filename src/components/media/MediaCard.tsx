import React from 'react';
import { Image, Video, Type, Layout, Clock, Edit, Trash2, Tag } from 'lucide-react';
import type { MediaItem } from '../../types/media';

interface MediaCardProps {
  item: MediaItem;
  onEdit: (item: MediaItem) => void;
  onDelete: (id: string) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, onEdit, onDelete }) => {
  const TypeIcon = {
    image: Image,
    video: Video,
    text: Type,
    widget: Layout,
  }[item.type];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-video bg-gray-100">
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
        {(item.type === 'text' || item.type === 'widget') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <TypeIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <Clock size={16} className="mr-2" />
          <span>{item.duration}s</span>
        </div>
        
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
              >
                <Tag size={12} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;