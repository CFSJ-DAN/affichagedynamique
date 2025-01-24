import React from 'react';
import { useMediaStore } from '../../stores/mediaStore';
import type { MediaItem } from '../../types/media';

interface MediaFilterDialogProps {
  onClose: () => void;
}

const MediaFilterDialog: React.FC<MediaFilterDialogProps> = ({ onClose }) => {
  const { tags, activeFilters, setFilters } = useMediaStore();
  const [selectedTags, setSelectedTags] = React.useState<string[]>(activeFilters.tags);
  const [selectedType, setSelectedType] = React.useState<MediaItem['type'] | undefined>(
    activeFilters.type
  );

  const handleApplyFilters = () => {
    setFilters({
      tags: selectedTags,
      type: selectedType,
    });
    onClose();
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSelectedType(undefined);
    setFilters({ tags: [] });
    onClose();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Type de média</h3>
        <div className="grid grid-cols-2 gap-4">
          {(['image', 'video', 'text', 'widget'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type === selectedType ? undefined : type)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                type === selectedType
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedTags.includes(tag)
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
          {tags.length === 0 && (
            <p className="text-sm text-gray-500">Aucun tag disponible</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Réinitialiser
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Appliquer
        </button>
      </div>
    </div>
  );
};

export default MediaFilterDialog;