import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import type { MediaItem } from '../../../types/media';
import DraggableItem from './DraggableItem';
import EmptyState from './EmptyState';

interface DroppableListProps {
  items: MediaItem[];
  onRemove: (id: string) => void;
}

const DroppableList: React.FC<DroppableListProps> = ({ items, onRemove }) => (
  <Droppable droppableId="playlist-media">
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="space-y-2"
      >
        {items.map((item, index) => (
          <DraggableItem
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

export default DroppableList;