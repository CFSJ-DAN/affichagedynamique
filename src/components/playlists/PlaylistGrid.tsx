import React from 'react';
import type { Playlist } from '../../types/playlist';
import PlaylistCard from './PlaylistCard';

interface PlaylistGridProps {
  playlists: Playlist[];
  onEdit: (playlist: Playlist) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({
  playlists,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
};

export default PlaylistGrid;