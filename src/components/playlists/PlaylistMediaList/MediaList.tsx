import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import type { MediaItem } from '../../../types/media';
import { MediaItem as MediaItemComponent } from './MediaItem';

interface MediaListProps {
  items: MediaItem[];
  onRemove: (id: string) => void;
}

export const MediaList: React.FC<MediaListProps> = ({ items, onRemove }) => (
  <>
    {items.map((item, index) => (
      <Draggable key={item.id} draggableId={item.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <MediaItemComponent
              item={item}
              onRemove={onRemove}
              dragHandleProps={provided.dragHandleProps}
            />
          </div>
        )}
      </Draggable>
    ))}
  </>
);