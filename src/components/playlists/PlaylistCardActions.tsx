import React, { useState } from 'react';
import { Play, Eye, EyeOff, Edit, Trash2, RefreshCw } from 'lucide-react';
import { usePlaylistStore } from '../../stores/playlistStore';
import { useSyncStore } from '../../stores/syncStore';
import PlaylistPreviewPlayer from './PlaylistPreviewPlayer';
import SyncStatus from './SyncStatus';

interface PlaylistCardActionsProps {
  playlistId: string;
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSync: () => void;
  isSyncing: boolean;
}

const PlaylistCardActions: React.FC<PlaylistCardActionsProps> = ({
  playlistId,
  isActive,
  onEdit,
  onDelete,
  onSync,
  isSyncing,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { togglePlaylist } = usePlaylistStore();

  return (
    <>
      <div className="space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
            title="Prévisualiser"
          >
            <Play size={16} />
          </button>
          <button
            onClick={() => togglePlaylist(playlistId)}
            className={`p-2 rounded-full ${
              isActive 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-600'
            }`}
            title={isActive ? 'Désactiver' : 'Activer'}
          >
            {isActive ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            onClick={onSync}
            disabled={isSyncing}
            className={`p-2 rounded-full ${
              isSyncing
                ? 'bg-gray-100 text-gray-400'
                : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
            }`}
            title="Forcer la synchronisation"
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
            title="Modifier"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <SyncStatus playlistId={playlistId} />
      </div>

      <PlaylistPreviewPlayer
        playlistId={playlistId}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
};

export default PlaylistCardActions;