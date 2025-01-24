import React, { useState } from 'react';
import { Image } from 'lucide-react';
import { useMediaStore } from '../../stores/mediaStore';
import type { Template, TemplateFormData } from '../../types/template';
import type { MediaItem } from '../../types/media';
import Modal from '../common/Modal';

interface TemplateFormProps {
  onSubmit: (data: TemplateFormData) => void;
  onCancel: () => void;
  initialData?: Template;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const { items: mediaItems } = useMediaStore();
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [formData, setFormData] = useState<TemplateFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    backgroundUrl: initialData?.backgroundUrl || '',
    width: initialData?.width || 1920,
    height: initialData?.height || 1080,
  });

  const [errors, setErrors] = useState({
    name: '',
    backgroundUrl: '',
  });

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      backgroundUrl: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.backgroundUrl) {
      newErrors.backgroundUrl = 'L\'image de fond est requise';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleSelectMedia = (media: MediaItem) => {
    setFormData(prev => ({
      ...prev,
      backgroundUrl: media.url,
    }));
    setIsMediaSelectorOpen(false);
  };

  // Filtrer uniquement les images de la médiathèque
  const availableImages = mediaItems.filter(item => item.type === 'image');

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
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: '' });
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
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image de fond
        </label>
        <div className="mt-1 flex items-center">
          <button
            type="button"
            onClick={() => setIsMediaSelectorOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Image size={20} className="mr-2" />
            Choisir une image
          </button>
          {formData.backgroundUrl && (
            <div className="ml-4 relative w-20 h-20 rounded-lg overflow-hidden">
              <img
                src={formData.backgroundUrl}
                alt="Aperçu"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        {errors.backgroundUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.backgroundUrl}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="width" className="block text-sm font-medium text-gray-700">
            Largeur (px)
          </label>
          <input
            type="number"
            id="width"
            value={formData.width}
            onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) || 1920 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700">
            Hauteur (px)
          </label>
          <input
            type="number"
            id="height"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 1080 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
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

      {/* Modal de sélection d'image */}
      <Modal
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        title="Choisir une image de fond"
      >
        <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-4">
          {availableImages.map((media) => (
            <div
              key={media.id}
              onClick={() => handleSelectMedia(media)}
              className={`cursor-pointer rounded-lg border overflow-hidden hover:border-blue-500 transition-colors ${
                formData.backgroundUrl === media.url ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="aspect-video relative">
                <img
                  src={media.url}
                  alt={media.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <p className="text-sm font-medium truncate">{media.name}</p>
              </div>
            </div>
          ))}
          {availableImages.length === 0 && (
            <div className="col-span-3 text-center py-8 text-gray-500">
              Aucune image disponible dans la médiathèque
            </div>
          )}
        </div>
      </Modal>
    </form>
  );
};

export default TemplateForm;