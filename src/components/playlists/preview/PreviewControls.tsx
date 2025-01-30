import React from 'react';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';

interface PreviewControlsProps {
  isPaused: boolean;
  onPause: () => void;
  onPlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}

const PreviewControls: React.FC<PreviewControlsProps> = ({
  isPaused,
  onPause,
  onPlay,
  onPrevious,
  onNext,
  onClose,
}) => (
  <div className="flex items-center justify-center space-x-4 mt-4">
    <button
      onClick={onPrevious}
      className="p-2 text-white/80 hover:text-white"
    >
      <SkipBack size={24} />
    </button>
    <button
      onClick={isPaused ? onPlay : onPause}
      className="p-3 bg-white rounded-full text-black hover:bg-white/90"
    >
      {isPaused ? <Play size={24} /> : <Pause size={24} />}
    </button>
    <button
      onClick={onNext}
      className="p-2 text-white/80 hover:text-white"
    >
      <SkipForward size={24} />
    </button>
    <button
      onClick={onClose}
      className="absolute right-4 top-4 p-2 text-white/80 hover:text-white"
    >
      <X size={24} />
    </button>
  </div>
);