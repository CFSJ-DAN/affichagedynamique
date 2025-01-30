import React from 'react';
import type { MediaItem } from '../../../types/media';
import { MediaCard } from './MediaCard';

interface MediaGridProps {
  items: MediaItem[];
  selectedItems: MediaItem[];
  onToggleSelect: (item: MediaItem) => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  selectedItems,
  onToggleSelect,
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
    {items.map((item) => (
      <MediaCard
        key={item.id}
        item={item}
        isSelected={selectedItems.some(selected => selected.id === item.id)}
        onSelect={() => onToggleSelect(item)}
      />
    ))}
    {items.length === 0 && (
      <div className="col-span-full text-center py-8 text-gray-500">
        Aucun média trouvé
      </div>
    )}
  </div>
);