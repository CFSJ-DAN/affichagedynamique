import React, { useState } from 'react';
import { usePlaylistStore } from '../stores/playlistStore';
import { useScreenStore } from '../stores/screenStore';
import { useScheduleStore } from '../stores/scheduleStore';
import SchedulingHeader from '../components/scheduling/SchedulingHeader';
import SchedulingForm from '../components/scheduling/SchedulingForm';
import SchedulingList from '../components/scheduling/SchedulingList';
import Modal from '../components/common/Modal';
import type { ScheduleFormData } from '../types/schedule';

const Scheduling: React.FC = () => {
  const { playlists } = usePlaylistStore();
  const { screens } = useScreenStore();
  const { slots, addTimeSlot, deleteTimeSlot, updateTimeSlot } = useScheduleStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);

  const handleSubmit = (data: ScheduleFormData) => {
    if (editingSlot) {
      updateTimeSlot(editingSlot, data);
    } else {
      addTimeSlot(data);
    }
    setIsModalOpen(false);
    setEditingSlot(null);
  };

  return (
    <div>
      <SchedulingHeader onNewSchedule={() => setIsModalOpen(true)} />
      
      <SchedulingList
        slots={slots}
        playlists={playlists}
        screens={screens}
        onEdit={(id) => {
          setEditingSlot(id);
          setIsModalOpen(true);
        }}
        onDelete={deleteTimeSlot}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSlot(null);
        }}
        title={editingSlot ? 'Modifier la planification' : 'Nouvelle planification'}
      >
        <SchedulingForm
          playlists={playlists}
          screens={screens}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingSlot(null);
          }}
          initialSlotId={editingSlot}
        />
      </Modal>
    </div>
  );
};

export default Scheduling;