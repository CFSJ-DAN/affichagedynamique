import React, { useState } from 'react';
import { MediaThumbnail } from './MediaThumbnail';
import { MediaInfo } from './MediaInfo';
import { DragHandle } from './DragHandle';
import { RemoveButton } from './RemoveButton';
import { TransitionButton } from './TransitionButton';
import TransitionDialog from './TransitionDialog';
import Modal from '../../common/Modal';
import type { MediaItem } from '../../../types/media';
import type { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

interface PlaylistMediaItemProps {
  item: MediaItem;
  onRemove: (id: string) => void;
  onUpdateTransition: (id: string, transition: NonNullable<MediaItem['transition']>) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

const PlaylistMediaItem: React.FC<PlaylistMediaItemProps> = ({
  item,
  onRemove,
  onUpdateTransition,
  dragHandleProps,
}) => {
  const [isTransitionDialogOpen, setIsTransitionDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center bg-white rounded-lg border p-3 group hover:shadow-md transition-shadow">
        <DragHandle dragHandleProps={dragHandleProps} />
        <MediaThumbnail item={item} />
        <MediaInfo item={item} />
        <div className="flex items-center space-x-2">
          <TransitionButton
            item={item}
            onConfigureTransition={() => setIsTransitionDialogOpen(true)}
          />
          <RemoveButton onRemove={() => onRemove(item.id)} />
        </div>
      </div>

      <Modal
        isOpen={isTransitionDialogOpen}
        onClose={() => setIsTransitionDialogOpen(false)}
        title="Configuration de la transition"
      >
        <TransitionDialog
          item={item}
          onSave={(transition) => {
            onUpdateTransition(item.id, transition);
            setIsTransitionDialogOpen(false);
          }}
        />
      </Modal>
    </>
  );
};

export default PlaylistMediaItem;