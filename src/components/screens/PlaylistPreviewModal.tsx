import React from 'react';
import { Clock, Tag } from 'lucide-react';
import { usePlaylistStore } from '../../stores/playlistStore';
import Modal from '../common/Modal';
import { formatDuration } from '../../utils/mediaUtils';

interface PlaylistPreviewModalProps {
  playlistId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PlaylistPreviewModal: React.FC<PlaylistPreviewModalProps> = ({
  playlistId,
  isOpen,
  onClose,
}) => {
  const { playlists } = usePlaylistStore();
  const playlist = playlists.find(p => p.id === playlistId);

  if (!playlist) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Médias de la liste "${playlist.name}"`}
    >
      <div className="space-y-4">
        {playlist.items.map((item, index) => (
          <div key={item.id} className="flex items-center p-4 bg-white rounded-lg border">
            <div className="flex-shrink-0 w-32 h-20 mr-4 relative overflow-hidden rounded bg-gray-100">
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
              <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                {index + 1}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
              <div className="flex flex-wrap gap-3 mt-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={14} className="mr-1" />
                  {formatDuration(item.duration)}
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(tag => (
                      <span 
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600"
                      >
                        <Tag size={12} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {playlist.items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun média dans cette liste de lecture
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PlaylistPreviewModal;