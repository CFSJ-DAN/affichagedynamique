import { useState } from 'react';
import { useMediaStore } from '../../../stores/mediaStore';
import type { MediaItem } from '../../../types/media';

export const useMediaSelector = (
  initialSelectedItems: MediaItem[],
  onSelect: (items: MediaItem[]) => void
) => {
  const { items: allMedia } = useMediaStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMediaItems, setSelectedMediaItems] = useState<MediaItem[]>(initialSelectedItems);

  const filteredMedia = allMedia.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSelect = (item: MediaItem) => {
    setSelectedMediaItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      return isSelected
        ? prev.filter(selected => selected.id !== item.id)
        : [...prev, item];
    });
  };

  const handleConfirm = () => {
    onSelect(selectedMediaItems);
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredMedia,
    selectedMediaItems,
    handleToggleSelect,
    handleConfirm,
  };
};