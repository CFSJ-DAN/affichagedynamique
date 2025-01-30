import React, { useState, useEffect } from 'react';
import type { MediaItem } from '../../../types/media';

interface TransitionPreviewProps {
  transition: NonNullable<MediaItem['transition']>;
}

const TransitionPreview: React.FC<TransitionPreviewProps> = ({ transition }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), transition.duration);
    }, transition.duration + 1000);

    return () => clearInterval(timer);
  }, [transition.duration]);

  const getTransitionStyles = () => {
    const baseStyles = "w-full h-32 bg-blue-500 rounded-lg transition-all";
    
    switch (transition.type) {
      case 'fade':
        return `${baseStyles} ${isAnimating ? 'opacity-0' : 'opacity-100'}`;
      case 'slide':
        return `${baseStyles} transform ${isAnimating ? 'translate-x-full' : 'translate-x-0'}`;
      case 'zoom':
        return `${baseStyles} transform ${isAnimating ? 'scale-0' : 'scale-100'}`;
      default:
        return baseStyles;
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="text-sm font-medium text-gray-700 mb-4">
        Aperçu de la transition
      </div>
      <div className="relative overflow-hidden">
        <div
          className={getTransitionStyles()}
          style={{ transitionDuration: `${transition.duration}ms` }}
        />
      </div>
    </div>
  );
};

export default TransitionPreview;