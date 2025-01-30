import React from 'react';
import { Transition } from 'lucide-react';
import type { MediaItem } from '../../../types/media';

interface TransitionButtonProps {
  item: MediaItem;
  onConfigureTransition: () => void;
}

export const TransitionButton: React.FC<TransitionButtonProps> = ({
  item,
  onConfigureTransition,
}) => (
  <button
    onClick={onConfigureTransition}
    className="p-2 text-gray-400 hover:text-blue-600 transition-colors group-hover:opacity-100 opacity-0"
    title="Configurer la transition"
  >
    <Transition size={16} />
    {item.transition && (
      <span className="ml-1 text-xs">
        {item.transition.type} • {item.transition.duration}ms
      </span>
    )}
  </button>
);