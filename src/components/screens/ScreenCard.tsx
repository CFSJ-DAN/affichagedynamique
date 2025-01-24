import React, { useState } from 'react';
import { Monitor, Edit, Trash2, RotateCw, Smartphone, Calendar, ListFilter, RefreshCw, Download, Eye } from 'lucide-react';
import type { Screen } from '../../types/screen';
import { useScreenStore } from '../../stores/screenStore';
import ScreenScheduleModal from './ScreenScheduleModal';
import ScreenCalendarModal from './ScreenCalendarModal';
import ScreenPreviewModal from './ScreenPreviewModal';

interface ScreenCardProps {
  screen: Screen;
  onEdit: (screen: Screen) => void;
  onDelete: (id: string) => void;
}

const ScreenCard: React.FC<ScreenCardProps> = ({
  screen,
  onEdit,
  onDelete,
}) => {
  const { regeneratePairingCode } = useScreenStore();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    error: 'bg-red-500',
  };

  const handleDownload = () => {
    // Ouvrir une nouvelle fenêtre avec le lien de téléchargement
    window.open('https://github.com/yourusername/digital-signage-player/releases/latest', '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="text-xl font-semibold text-gray-800">{screen.name}</h3>
              <span className={`ml-2 w-3 h-3 rounded-full ${statusColors[screen.status]}`} />
            </div>
            <p className="text-gray-600 text-sm mt-1">{screen.description}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
              title="Prévisualiser"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onEdit(screen)}
              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
              title="Modifier"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(screen.id)}
              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            {screen.orientation === 'landscape' ? (
              <Monitor size={16} className="mr-2" />
            ) : (
              <Smartphone size={16} className="mr-2" />
            )}
            <span>
              {screen.resolution.width} × {screen.resolution.height}
              {' '}({screen.orientation})
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <RotateCw size={16} className="mr-2" />
            <span>
              Dernière activité : {new Date(screen.lastSeen).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center">
              <code className="font-mono text-lg">{screen.pairingCode}</code>
              <span className="ml-3 text-sm text-gray-600">Code d'appairage</span>
            </div>
            <button
              onClick={() => regeneratePairingCode(screen.id)}
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
              title="Générer un nouveau code"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 rounded-md"
            >
              <ListFilter size={20} className="mr-2" />
              Liste des planifications
            </button>
            <button
              onClick={() => setIsCalendarModalOpen(true)}
              className="flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 rounded-md"
            >
              <Calendar size={20} className="mr-2" />
              Vue calendrier
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Download size={20} className="mr-2" />
            Télécharger le lecteur
          </button>
        </div>
      </div>

      <ScreenScheduleModal
        screenId={screen.id}
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      <ScreenCalendarModal
        screenId={screen.id}
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
      />

      <ScreenPreviewModal
        screen={screen}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
      />
    </div>
  );
};

export default ScreenCard;