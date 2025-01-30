import React from 'react';
import { SearchBar } from './SearchBar';
import { MediaGrid } from './MediaGrid';
import { ActionButtons } from './ActionButtons';
import { useMediaSelector } from './useMediaSelector';
import type { MediaItem } from '../../../types/media';

interface PlaylistMediaSelectorProps {
  onSelect: (selectedItems: MediaItem[]) => void;
  selectedItems: MediaItem[];
}

const PlaylistMediaSelector: React.FC<PlaylistMediaSelectorProps> = ({
  onSelect,
  selectedItems,
}) => {
  const {
    searchTerm,
    setSearchTerm,
    filteredMedia,
    selectedMediaItems,
    handleToggleSelect,
    handleConfirm,
  } = useMediaSelector(selectedItems, onSelect);

  return (
    <div className="space-y-4">
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      
      <MediaGrid
        items={filteredMedia}
        selectedItems={selectedMediaItems}
        onToggleSelect={handleToggleSelect}
      />

      <ActionButtons
        onCancel={() => onSelect(selectedItems)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};