import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import type { MediaItem } from '../../../types/media';
import DraggableMediaItem from './DraggableMediaItem';
import EmptyState from './EmptyState';

interface DroppableContainerProps {
  items: MediaItem[];
  onRemove: (id: string) => void;
}

const DroppableContainer: React.FC<DroppableContainerProps> = ({ items, onRemove }) => (
  <Droppable droppableId="droppable-media-list" direction="vertical">
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="space-y-2"
      >
        {items.map((item, index) => (
          <DraggableMediaItem
            key={item.id}
            item={item}
            index={index}
            onRemove={onRemove}
          />
        ))}
        {provided.placeholder}
        {items.length === 0 && <EmptyState />}
      </div>
    )}
  </Droppable>
);

export default DroppableContainer;