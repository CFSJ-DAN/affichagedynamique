import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaStore } from '../stores/mediaStore';
import MediaHeader from '../components/media/MediaHeader';
import MediaGrid from '../components/media/MediaGrid';
import MediaUploadForm from '../components/media/MediaUploadForm';
import MediaFilterDialog from '../components/media/MediaFilterDialog';
import Modal from '../components/common/Modal';
import type { MediaItem } from '../types/media';

const MediaLibrary: React.FC = () => {
  const navigate = useNavigate();
  const { getFilteredItems, addMedia, deleteMedia, updateMedia } = useMediaStore();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);

  const handleUpload = (mediaItems: (Omit<MediaItem, 'id' | 'createdAt'> | MediaItem)[]) => {
    if (editingMedia) {
      // Mise à jour d'un média existant
      const updatedMedia = mediaItems[0];
      updateMedia(editingMedia.id, updatedMedia);
    } else {
      // Ajout de nouveaux médias
      mediaItems.forEach(item => {
        if (!('id' in item)) {
          addMedia(item);
        }
      });
    }
    setIsUploadModalOpen(false);
    setEditingMedia(null);
  };

  const handleEdit = (item: MediaItem) => {
    setEditingMedia(item);
    setIsUploadModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) {
      deleteMedia(id);
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <div>
      <MediaHeader
        onUpload={() => setIsUploadModalOpen(true)}
        onFilter={() => setIsFilterModalOpen(true)}
      />

      <MediaGrid
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setEditingMedia(null);
        }}
        title={editingMedia ? 'Modifier le média' : 'Importer des médias'}
      >
        <MediaUploadForm
          onSubmit={handleUpload}
          onCancel={() => {
            setIsUploadModalOpen(false);
            setEditingMedia(null);
          }}
          initialData={editingMedia || undefined}
        />
      </Modal>

      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filtrer les médias"
      >
        <MediaFilterDialog onClose={() => setIsFilterModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default MediaLibrary;