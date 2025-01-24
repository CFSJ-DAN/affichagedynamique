import React, { useState, useEffect } from 'react';
import { usePlaylistStore } from '../stores/playlistStore';
import PlaylistHeader from '../components/playlists/PlaylistHeader';
import PlaylistGrid from '../components/playlists/PlaylistGrid';
import PlaylistForm from '../components/playlists/PlaylistForm';
import Modal from '../components/common/Modal';
import type { Playlist } from '../types/playlist';

const Playlists: React.FC = () => {
  const { playlists, addPlaylist, deletePlaylist, updatePlaylist, loadPlaylists } = usePlaylistStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  const handleSubmit = (data: any) => {
    if (editingPlaylist) {
      updatePlaylist(editingPlaylist.id, data);
    } else {
      addPlaylist(data);
    }
    setIsModalOpen(false);
    setEditingPlaylist(null);
  };

  const handleEdit = (playlist: Playlist) => {
    setEditingPlaylist({
      ...playlist,
      mediaItems: playlist.items
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette liste de diffusion ?')) {
      deletePlaylist(id);
    }
  };

  return (
    <div>
      <PlaylistHeader onNewPlaylist={() => setIsModalOpen(true)} />
      
      <PlaylistGrid
        playlists={playlists || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlaylist(null);
        }}
        title={editingPlaylist ? 'Modifier la liste de diffusion' : 'Nouvelle liste de diffusion'}
      >
        <PlaylistForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingPlaylist(null);
          }}
          initialData={editingPlaylist ? {
            name: editingPlaylist.name,
            description: editingPlaylist.description,
            mediaItems: editingPlaylist.items
          } : undefined}
        />
      </Modal>
    </div>
  );
};

export default Playlists;