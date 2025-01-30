import React from 'react';
import { Plus } from 'lucide-react';

interface PlaylistHeaderProps {
  onNewPlaylist: () => void;
}

const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({ onNewPlaylist }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">Listes de diffusion</h1>
      <button
        onClick={onNewPlaylist}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <Plus size={20} className="mr-2" />
        Nouvelle liste
      </button>
    </div>
  );
};

export default PlaylistHeader;