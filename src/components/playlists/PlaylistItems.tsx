import React from 'react';
import type { MediaItem } from '../../types/media';

interface PlaylistItemsProps {
  items: MediaItem[];
}

const PlaylistItems: React.FC<PlaylistItemsProps> = ({ items }) => {
  if (items.length === 0) {
    return <span className="text-gray-400 text-sm">Aucun élément ajouté</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.id}
          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
        >
          {item.name}
        </span>
      ))}
    </div>
  );
};

export default PlaylistItems;