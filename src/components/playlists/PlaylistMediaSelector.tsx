import React, { useState } from 'react';
import { useMediaStore } from '../../stores/mediaStore';
import { Search } from 'lucide-react';
import type { MediaItem } from '../../types/media';

interface PlaylistMediaSelectorProps {
  onSelect: (selectedItems: MediaItem[]) => void;
  selectedItems: MediaItem[];
}

const PlaylistMediaSelector: React.FC<PlaylistMediaSelectorProps> = ({
  onSelect,
  selectedItems,
}) => {
  const { items: allMedia } = useMediaStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMediaItems, setSelectedMediaItems] = useState<MediaItem[]>(selectedItems);

  const filteredMedia = allMedia.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSelect = (item: MediaItem) => {
    setSelectedMediaItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleConfirm = () => {
    onSelect(selectedMediaItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un média..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
        {filteredMedia.map((item) => {
          const isSelected = selectedMediaItems.some(selected => selected.id === item.id);
          return (
            <div
              key={item.id}
              onClick={() => handleToggleSelect(item)}
              className={`cursor-pointer rounded-lg border transition-all ${
                isSelected 
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="aspect-video bg-gray-100 relative rounded-t-lg overflow-hidden">
                {item.type === 'image' && (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {item.type === 'video' && (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-2">
                <h4 className="font-medium text-sm truncate">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.duration}s</p>
              </div>
            </div>
          );
        })}
        {filteredMedia.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            Aucun média trouvé
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => onSelect(selectedItems)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Confirmer la sélection
        </button>
      </div>
    </div>
  );
};

export default PlaylistMediaSelector;