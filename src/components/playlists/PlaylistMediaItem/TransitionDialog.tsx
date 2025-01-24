import React from 'react';
import type { MediaItem } from '../../../types/media';
import TransitionSelector from '../transitions/TransitionSelector';
import TransitionPreview from '../transitions/TransitionPreview';

interface TransitionDialogProps {
  item: MediaItem;
  onSave: (transition: NonNullable<MediaItem['transition']>) => void;
}

const TransitionDialog: React.FC<TransitionDialogProps> = ({ item, onSave }) => {
  const [transition, setTransition] = React.useState(
    item.transition || { type: 'fade', duration: 500 }
  );

  return (
    <div className="space-y-6">
      <TransitionSelector
        value={transition}
        onChange={setTransition}
      />
      
      <TransitionPreview transition={transition} />

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => onSave(transition)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Appliquer
        </button>
      </div>
    </div>
  );
};

export default TransitionDialog;