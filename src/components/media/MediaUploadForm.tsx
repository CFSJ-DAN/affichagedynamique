import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import type { MediaItem } from '../../types/media';

interface MediaUploadFormProps {
  onSubmit: (data: Omit<MediaItem, 'id' | 'createdAt'>[]) => void;
  onCancel: () => void;
  initialData?: MediaItem;
}

const MediaUploadForm: React.FC<MediaUploadFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaItems, setMediaItems] = useState<(Omit<MediaItem, 'createdAt'> | MediaItem)[]>(
    initialData ? [initialData] : []
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    const newMediaItems = await Promise.all(validFiles.map(async file => {
      try {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        return {
          name: file.name.split('.')[0],
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: base64,
          duration: 10,
          tags: [],
        };
      } catch (error) {
        console.error('Failed to process file:', error);
        return null;
      }
    }));

    const validMediaItems = newMediaItems.filter((item): item is NonNullable<typeof item> => item !== null);
    setMediaItems(validMediaItems);
  };

  const handleNameChange = (index: number, name: string) => {
    setMediaItems(prev => prev.map((item, i) => 
      i === index ? { ...item, name } : item
    ));
  };

  const handleDurationChange = (duration: number) => {
    setMediaItems(prev => prev.map(item => ({ ...item, duration })));
  };

  const handleTagsChange = (tags: string[]) => {
    setMediaItems(prev => prev.map(item => ({ ...item, tags })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      // Si nous modifions un média existant, conservons son ID
      onSubmit([{ ...mediaItems[0], id: initialData.id }]);
    } else {
      onSubmit(mediaItems);
    }
  };

  const removeFile = (index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!initialData && (
        <div
          className="relative border-2 border-dashed rounded-lg p-6 text-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            multiple
            className="hidden"
          />
          
          <div className="cursor-pointer space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                Cliquez pour sélectionner
              </span>
              {' '}ou glissez-déposez des fichiers
            </div>
            <p className="text-sm text-gray-500">
              Images ou vidéos uniquement
            </p>
          </div>
        </div>
      )}

      {mediaItems.length > 0 && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Paramètres pour tous les médias
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Durée (secondes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={mediaItems[0].duration}
                  onChange={(e) => handleDurationChange(parseInt(e.target.value) || 10)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="Ajouter des tags (séparés par des virgules)"
                  value={mediaItems[0].tags.join(', ')}
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                    handleTagsChange(tags);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {mediaItems.map((item, index) => (
              <div key={index} className="relative bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {!initialData && (
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
          disabled={mediaItems.length === 0}
        >
          {initialData ? 'Mettre à jour' : `Importer ${mediaItems.length > 0 ? `(${mediaItems.length})` : ''}`}
        </button>
      </div>
    </form>
  );
};

export default MediaUploadForm;