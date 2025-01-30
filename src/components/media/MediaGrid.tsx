import React from 'react';
import type { MediaItem } from '../../types/media';
import MediaCard from './MediaCard';

interface MediaGridProps {
  items: MediaItem[];
  onEdit: (item: MediaItem) => void;
  onDelete: (id: string) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ items, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <MediaCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default MediaGrid;