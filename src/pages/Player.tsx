import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OfflinePlayer from '../components/player/OfflinePlayer';

const Player: React.FC = () => {
  const { screenId } = useParams<{ screenId: string }>();

  useEffect(() => {
    // Enter fullscreen mode on start
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.error('Error entering fullscreen:', error);
      }
    };

    // Disable keyboard interactions except Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        e.preventDefault();
      }
    };

    // Only enter fullscreen and disable keyboard in Electron
    if ('electronAPI' in window) {
      enterFullscreen();
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!screenId) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-2xl">
          Screen not found
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      <OfflinePlayer screenId={screenId} />
    </div>
  );
};

export default Player;