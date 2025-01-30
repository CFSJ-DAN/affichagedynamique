import React, { useState } from 'react';
import { useScreenStore } from '../stores/screenStore';
import ScreenHeader from '../components/screens/ScreenHeader';
import ScreenGrid from '../components/screens/ScreenGrid';
import ScreenForm from '../components/screens/ScreenForm';
import Modal from '../components/common/Modal';
import type { Screen } from '../types/screen';

const Screens: React.FC = () => {
  const { screens, addScreen, deleteScreen, updateScreen } = useScreenStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState<Screen | null>(null);

  const handleSubmit = (data: Omit<Screen, 'id' | 'status' | 'lastSeen' | 'playlists' | 'createdAt' | 'updatedAt'>) => {
    if (editingScreen) {
      updateScreen(editingScreen.id, data);
    } else {
      addScreen(data);
    }
    setIsModalOpen(false);
    setEditingScreen(null);
  };

  const handleEdit = (screen: Screen) => {
    setEditingScreen(screen);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet écran ?')) {
      deleteScreen(id);
    }
  };

  return (
    <div>
      <ScreenHeader onNewScreen={() => setIsModalOpen(true)} />
      
      <ScreenGrid
        screens={screens}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingScreen(null);
        }}
        title={editingScreen ? 'Modifier l\'écran' : 'Nouvel écran'}
      >
        <ScreenForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingScreen(null);
          }}
          initialData={editingScreen || undefined}
        />
      </Modal>
    </div>
  );
};

export default Screens;