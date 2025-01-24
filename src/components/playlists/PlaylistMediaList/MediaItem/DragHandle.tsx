import React from 'react';
import { GripVertical } from 'lucide-react';
import type { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

interface DragHandleProps {
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export const DragHandle: React.FC<DragHandleProps> = ({ dragHandleProps }) => (
  <div {...dragHandleProps} className="cursor-grab mr-3 text-gray-400 hover:text-gray-600">
    <GripVertical size={20} />
  </div>
);