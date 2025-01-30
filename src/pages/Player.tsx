<<<<<<< HEAD
import React, { useEffect } from 'react';
=======
import React from 'react';
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
import { useParams } from 'react-router-dom';
import OfflinePlayer from '../components/player/OfflinePlayer';

const Player: React.FC = () => {
  const { screenId } = useParams<{ screenId: string }>();

<<<<<<< HEAD
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

=======
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
  if (!screenId) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-2xl">
<<<<<<< HEAD
          Screen not found
=======
          Écran non trouvé
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  return (
    <div className="fixed inset-0 bg-black">
      <OfflinePlayer screenId={screenId} />
    </div>
  );
=======
  return <OfflinePlayer screenId={screenId} />;
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
};

export default Player;