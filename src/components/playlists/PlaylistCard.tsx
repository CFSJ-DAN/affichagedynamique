import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, HardDrive, Wifi } from 'lucide-react';
import type { Playlist } from '../../types/playlist';
import PlaylistCardActions from './PlaylistCardActions';
import PlaylistItems from './PlaylistItems';
import PlaylistSchedule from './PlaylistSchedule';
import { formatDuration } from '../../utils/mediaUtils';
import { usePlaylistStore } from '../../stores/playlistStore';

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit: (playlist: Playlist) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { syncPlaylist, syncingPlaylists } = usePlaylistStore();
  const isSyncing = syncingPlaylists.has(playlist.id);

  const handleSync = async () => {
    await syncPlaylist(playlist.id);
  };

  const totalSize = playlist.items.reduce((acc, item) => acc + (item.size || 0), 0);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{playlist.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{playlist.description}</p>
          </div>
          <PlaylistCardActions
            playlistId={playlist.id}
            isActive={playlist.isActive}
            onToggleActive={() => onToggleActive(playlist.id, !playlist.isActive)}
            onEdit={() => onEdit(playlist)}
            onDelete={() => onDelete(playlist.id)}
            onSync={handleSync}
            isSyncing={isSyncing}
          />
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Clock size={16} className="mr-2" />
            <span>{formatDuration(playlist.duration)}</span>
          </div>
          <div className="flex items-center">
            <HardDrive size={16} className="mr-2" />
            <span>{(totalSize / (1024 * 1024)).toFixed(1)} MB</span>
          </div>
          <div className="flex items-center">
            <Wifi size={16} className="mr-2" />
            <span>Dernière synchro: {new Date(playlist.lastSync || Date.now()).toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="mb-4">
          <PlaylistItems items={playlist.items} />
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center w-full mt-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={20} className="mr-1" />
              Masquer la planification
            </>
          ) : (
            <>
              <ChevronDown size={20} className="mr-1" />
              Voir la planification
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t px-6 pb-6">
          <PlaylistSchedule playlistId={playlist.id} />
        </div>
      )}
    </div>
  );
};

export default PlaylistCard;