import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { MediaItem } from '../../../types/media';
import { GripVertical, Clock, Tag } from 'lucide-react';
import { formatDuration } from '../../../utils/mediaUtils';

interface SortableMediaItemProps {
  item: MediaItem;
  onRemove: (id: string) => void;
}

const SortableMediaItem: React.FC<SortableMediaItemProps> = ({ item, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center bg-white rounded-lg border p-3 group hover:shadow-md transition-shadow"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab mr-3 text-gray-400 hover:text-gray-600"
      >
        <GripVertical size={20} />
      </div>
      
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

      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
        title="Supprimer"
      >
        ×
      </button>
    </div>
  );
};

export default SortableMediaItem;