import React from 'react';
import { useParams } from 'react-router-dom';
import OfflinePlayer from '../components/player/OfflinePlayer';

const Player: React.FC = () => {
  const { screenId } = useParams<{ screenId: string }>();

  if (!screenId) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-2xl">
          Écran non trouvé
        </div>
      </div>
    );
  }

  return <OfflinePlayer screenId={screenId} />;
};

export default Player;