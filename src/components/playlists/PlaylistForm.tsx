import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { PlaylistFormData } from '../../types/playlist';
import type { MediaItem } from '../../types/media';
import PlaylistMediaList from './PlaylistMediaList';
import PlaylistMediaSelector from './PlaylistMediaSelector';
import TransitionSelector from './transitions/TransitionSelector';
import Modal from '../common/Modal';

interface PlaylistFormProps {
  onSubmit: (data: PlaylistFormData & { mediaItems: MediaItem[] }) => void;
  onCancel: () => void;
  initialData?: {
    name: string;
    description: string;
    mediaItems: MediaItem[];
    transition?: PlaylistFormData['transition'];
  };
}

const PlaylistForm: React.FC<PlaylistFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<PlaylistFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    transition: initialData?.transition || { type: 'fade', duration: 500 },
  });
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialData?.mediaItems || []);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    description: '',
  });

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      description: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (formData.description.length > 200) {
      newErrors.description = 'La description doit faire moins de 200 caractères';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        mediaItems,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, name: e.target.value }));
            if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
          }}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          } focus:ring-blue-500 focus:border-blue-500`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, description: e.target.value }));
            if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
          }}
          rows={3}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          } focus:ring-blue-500 focus:border-blue-500`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Transition entre les médias</h3>
        <TransitionSelector
          value={formData.transition!}
          onChange={(transition) => setFormData(prev => ({ ...prev, transition }))}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Médias</h3>
          <button
            type="button"
            onClick={() => setIsMediaSelectorOpen(true)}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={16} className="mr-1" />
            Sélectionner des médias
          </button>
        </div>

        <PlaylistMediaList
          items={mediaItems}
          onReorder={setMediaItems}
          onRemove={(id) => setMediaItems(prev => prev.filter(item => item.id !== id))}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {initialData ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>

      <Modal
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        title="Sélectionner des médias"
      >
        <PlaylistMediaSelector
          onSelect={(selectedItems) => {
            setMediaItems(prev => [...prev, ...selectedItems]);
            setIsMediaSelectorOpen(false);
          }}
          selectedItems={mediaItems}
        />
      </Modal>
    </form>
  );
};

export default PlaylistForm;