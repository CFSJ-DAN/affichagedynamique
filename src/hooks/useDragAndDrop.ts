import { useMemo } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

interface UseDragAndDropOptions<T> {
  items: T[];
  onReorder: (items: T[]) => void;
}

export function useDragAndDrop<T extends { id: string }>({ items, onReorder }: UseDragAndDropOptions<T>) {
  const itemIds = useMemo(() => items.map(item => ({ id: item.id })), [items]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  return {
    itemIds,
    handleDragEnd,
  };
}