import { useState, useCallback } from 'react';
import type { MediaItem } from '../../../types/media';

export const usePlaylistMedia = (initialItems: MediaItem[] = []) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialItems);

  const handleReorder = useCallback((newItems: MediaItem[]) => {
    setMediaItems(newItems);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleAdd = useCallback((item: MediaItem) => {
    setMediaItems(prev => [...prev, item]);
  }, []);

  return {
    mediaItems,
    handleReorder,
    handleRemove,
    handleAdd,
  };
};