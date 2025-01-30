import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import type { MediaItem } from '../../types/media';
import SortableMediaItem from './PlaylistMediaList/SortableMediaItem';
import EmptyState from './PlaylistMediaList/EmptyState';
import { formatDuration } from '../../utils/mediaUtils';

interface PlaylistMediaListProps {
  items: MediaItem[];
  onRemove: (id: string) => void;
  onReorder: (newItems: MediaItem[]) => void;
}

const PlaylistMediaList: React.FC<PlaylistMediaListProps> = ({
  items = [],
  onRemove,
  onReorder,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  const totalDuration = items.reduce((total, item) => total + item.duration, 0);

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">
        Durée totale : {formatDuration(totalDuration)}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-2">
          <SortableContext
            items={items}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableMediaItem
                key={item.id}
                item={item}
                onRemove={onRemove}
              />
            ))}
          </SortableContext>
          {items.length === 0 && <EmptyState />}
        </div>
      </DndContext>
    </div>
  );
};

export default PlaylistMediaList;