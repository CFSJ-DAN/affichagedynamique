import React from 'react';
import { Monitor, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useScreenStore } from '../../stores/screenStore';

const ScreenStatusList: React.FC = () => {
  const { screens } = useScreenStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {screens.map((screen) => (
        <div
          key={screen.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <Monitor className="w-5 h-5 text-gray-500" />
            <div>
              <div className="font-medium">{screen.name}</div>
              <div className="text-sm text-gray-500">
                {screen.resolution.width} × {screen.resolution.height}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(screen.lastSeen).toLocaleTimeString()}
            </div>
            {getStatusIcon(screen.status)}
          </div>
        </div>
      ))}

      {screens.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Aucun écran configuré
        </div>
      )}
    </div>
  );
};

export default ScreenStatusList;