import React, { useState, useEffect } from 'react';
import { localContent } from '../../lib/localContent';
import type { MediaItem } from '../../types/media';
import type { Playlist } from '../../types/playlist';
import type { TimeSlot } from '../../types/schedule';

interface OfflinePlayerProps {
  screenId: string;
}

const OfflinePlayer: React.FC<OfflinePlayerProps> = ({ screenId }) => {
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [localDB, setLocalDB] = useState<{
    playlists: Playlist[];
    slots: TimeSlot[];
    media: MediaItem[];
    lastSync: string;
  } | null>(null);

  useEffect(() => {
    const loadLocalContent = async () => {
      const db = await localContent.loadLocalDB();
      setLocalDB(db);
    };
    loadLocalContent();
  }, []);

  // Obtenir les playlists actives pour cet écran à l'heure actuelle
  const getCurrentPlaylists = () => {
    if (!localDB) return [];

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    return localDB.slots
      .filter(slot => {
        if (!slot.isActive || slot.screenId !== screenId) return false;
        if (!slot.days.includes(currentDay)) return false;
        
        const startTime = slot.startTime;
        const endTime = slot.endTime;
        
        if (startTime <= currentTime && currentTime <= endTime) {
          const playlist = localDB.playlists.find(p => p.id === slot.playlistId);
          return playlist && playlist.items.length > 0;
        }
        
        return false;
      })
      .map(slot => localDB.playlists.find(p => p.id === slot.playlistId))
      .filter((playlist): playlist is NonNullable<typeof playlist> => playlist !== undefined);
  };

  useEffect(() => {
    // Activer le mode plein écran au démarrage
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.error('Erreur lors du passage en plein écran:', error);
      }
    };
    enterFullscreen();

    // Désactiver toutes les interactions clavier sauf Échap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!localDB) return;

    const activePlaylists = getCurrentPlaylists();
    if (activePlaylists.length === 0) {
      setCurrentMedia(null);
      return;
    }

    const currentPlaylist = activePlaylists[currentPlaylistIndex];
    if (!currentPlaylist) {
      setCurrentPlaylistIndex(0);
      return;
    }

    const media = currentPlaylist.items[currentMediaIndex];
    if (!media) return;

    // Trouver le média local correspondant
    const localMedia = localDB.media.find(m => m.id === media.id);
    if (!localMedia) {
      console.error('Media not found locally:', media.id);
      return;
    }

    setCurrentMedia(localMedia);

    // Gérer la transition vers le média suivant
    const timer = setTimeout(() => {
      if (currentMediaIndex < currentPlaylist.items.length - 1) {
        setCurrentMediaIndex(prev => prev + 1);
      } else if (currentPlaylistIndex < activePlaylists.length - 1) {
        setCurrentPlaylistIndex(prev => prev + 1);
        setCurrentMediaIndex(0);
      } else {
        setCurrentPlaylistIndex(0);
        setCurrentMediaIndex(0);
      }
    }, media.duration * 1000);

    return () => clearTimeout(timer);
  }, [localDB, screenId, currentPlaylistIndex, currentMediaIndex]);

  // Vérifier périodiquement les changements de programmation
  useEffect(() => {
    const checkSchedule = () => {
      const activePlaylists = getCurrentPlaylists();
      if (activePlaylists.length === 0) {
        setCurrentMedia(null);
        return;
      }
    };

    const interval = setInterval(checkSchedule, 60000); // Vérifier chaque minute
    return () => clearInterval(interval);
  }, [screenId]);

  if (!localDB) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-2xl">
          Chargement du contenu local...
        </div>
      </div>
    );
  }

  if (!currentMedia) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-2xl">
          En attente de contenu...
        </div>
      </div>
    );
  }

  const getTransitionStyle = () => {
    if (!currentMedia.transition) return {};
    
    return {
      transition: `all ${currentMedia.transition.duration}ms ease-in-out`,
      ...(currentMedia.transition.type === 'fade' && { opacity: 1 }),
      ...(currentMedia.transition.type === 'slide' && { transform: 'translateX(0)' }),
      ...(currentMedia.transition.type === 'zoom' && { transform: 'scale(1)' })
    };
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={getTransitionStyle()}
      >
        {currentMedia.type === 'image' && (
          <img
            src={currentMedia.url} // URL locale du fichier
            alt=""
            className="w-full h-full object-contain"
            style={{ userSelect: 'none' }}
            draggable={false}
          />
        )}
        {currentMedia.type === 'video' && (
          <video
            src={currentMedia.url} // URL locale du fichier
            autoPlay
            muted
            className="w-full h-full object-contain"
            style={{ userSelect: 'none' }}
            onContextMenu={e => e.preventDefault()}
          />
        )}
      </div>
    </div>
  );
};

export default OfflinePlayer;