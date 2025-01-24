import React, { useState } from 'react';
import type { Screen, ScreenFormData } from '../../types/screen';
import { Monitor, Smartphone } from 'lucide-react';

interface ScreenFormProps {
  onSubmit: (data: ScreenFormData) => void;
  onCancel: () => void;
  initialData?: Screen;
}

const ScreenForm: React.FC<ScreenFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<ScreenFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    orientation: initialData?.orientation || 'landscape',
    resolution: initialData?.resolution || { width: 1920, height: 1080 },
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
  });

  const commonResolutions = [
    { width: 1920, height: 1080, label: 'Full HD (1920×1080)' },
    { width: 1280, height: 720, label: 'HD (1280×720)' },
    { width: 3840, height: 2160, label: '4K (3840×2160)' },
  ];

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
      onSubmit(formData);
    }
  };

  const handleResolutionSelect = (width: number, height: number) => {
    setFormData(prev => ({
      ...prev,
      resolution: { width, height },
    }));
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
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            if (errors.description) setErrors({ ...errors, description: '' });
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Orientation
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, orientation: 'landscape' })}
            className={`flex items-center justify-center p-4 rounded-lg border-2 ${
              formData.orientation === 'landscape'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Monitor size={24} className="mr-2" />
            Paysage
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, orientation: 'portrait' })}
            className={`flex items-center justify-center p-4 rounded-lg border-2 ${
              formData.orientation === 'portrait'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Smartphone size={24} className="mr-2" />
            Portrait
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Résolution
        </label>
        <div className="grid grid-cols-1 gap-2">
          {commonResolutions.map(({ width, height, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleResolutionSelect(width, height)}
              className={`text-left p-3 rounded-lg border ${
                formData.resolution.width === width && formData.resolution.height === height
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-4 flex space-x-4">
          <div>
            <label htmlFor="width" className="block text-sm text-gray-600">
              Largeur
            </label>
            <input
              type="number"
              id="width"
              value={formData.resolution.width}
              onChange={(e) => setFormData({
                ...formData,
                resolution: {
                  ...formData.resolution,
                  width: parseInt(e.target.value) || 0,
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm text-gray-600">
              Hauteur
            </label>
            <input
              type="number"
              id="height"
              value={formData.resolution.height}
              onChange={(e) => setFormData({
                ...formData,
                resolution: {
                  ...formData.resolution,
                  height: parseInt(e.target.value) || 0,
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
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
    </form>
  );
};

export default ScreenForm;