import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import type { MediaItem } from '../../../types/media';
import MediaItem from './MediaItem';

interface DraggableItemProps {
  item: MediaItem;
  index: number;
  onRemove: (id: string) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, index, onRemove }) => (
  <Draggable draggableId={item.id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
      >
        <MediaItem
          item={item}
          onRemove={onRemove}
          dragHandleProps={provided.dragHandleProps}
        />
      </div>
    )}
  </Draggable>
);

export default DraggableItem;