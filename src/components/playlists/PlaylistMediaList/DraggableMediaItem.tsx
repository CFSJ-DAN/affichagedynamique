import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import type { MediaItem } from '../../../types/media';
import PlaylistMediaItem from '../PlaylistMediaItem';

interface DraggableMediaItemProps {
  item: MediaItem;
  index: number;
  onRemove: (id: string) => void;
}

const DraggableMediaItem: React.FC<DraggableMediaItemProps> = ({ item, index, onRemove }) => (
  <Draggable draggableId={item.id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
      >
        <PlaylistMediaItem
          item={item}
          onRemove={onRemove}
          dragHandleProps={provided.dragHandleProps}
        />
      </div>
    )}
  </Draggable>
);

export default DraggableMediaItem;