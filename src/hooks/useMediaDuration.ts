import { useState, useEffect } from 'react';

export const useMediaDuration = (url: string, type: 'image' | 'video'): number => {
  const [duration, setDuration] = useState(10); // Durée par défaut de 10 secondes

  useEffect(() => {
    if (type === 'video' && url) {
      const video = document.createElement('video');
      video.src = url;
      
      video.onloadedmetadata = () => {
        setDuration(Math.round(video.duration));
      };

      return () => {
        video.src = '';
      };
    }
  }, [url, type]);

  return duration;
};