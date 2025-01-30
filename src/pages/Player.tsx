<<<<<<< HEAD
import React, { useEffect } from 'react';
=======
<<<<<<< HEAD
import React, { useEffect } from 'react';
=======
import React from 'react';
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
>>>>>>> 7143f6c4c52e8933b9badb5fff168e9f569d8599
import { useParams } from 'react-router-dom';
import OfflinePlayer from '../components/player/OfflinePlayer';

const Player: React.FC = () => {
  const { screenId } = useParams<{ screenId: string }>();

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 7143f6c4c52e8933b9badb5fff168e9f569d8599
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

<<<<<<< HEAD
=======
=======
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
>>>>>>> 7143f6c4c52e8933b9badb5fff168e9f569d8599
  if (!screenId) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-2xl">
<<<<<<< HEAD
          Screen not found
=======
<<<<<<< HEAD
          Screen not found
=======
          Écran non trouvé
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
>>>>>>> 7143f6c4c52e8933b9badb5fff168e9f569d8599
        </div>
      </div>
    );
  }

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 7143f6c4c52e8933b9badb5fff168e9f569d8599
  return (
    <div className="fixed inset-0 bg-black">
      <OfflinePlayer screenId={screenId} />
    </div>
  );
<<<<<<< HEAD
=======
=======
  return <OfflinePlayer screenId={screenId} />;
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
>>>>>>> 7143f6c4c52e8933b9badb5fff168e9f569d8599
};

export default Player;