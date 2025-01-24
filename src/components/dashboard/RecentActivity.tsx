import React from 'react';
import { Monitor, PlaySquare, Image, Settings } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'screen',
    icon: Monitor,
    message: 'Écran "Accueil" connecté',
    time: '5 min',
  },
  {
    id: 2,
    type: 'playlist',
    icon: PlaySquare,
    message: 'Liste "Promotions" modifiée',
    time: '15 min',
  },
  {
    id: 3,
    type: 'media',
    icon: Image,
    message: 'Nouvelle image ajoutée',
    time: '30 min',
  },
  {
    id: 4,
    type: 'system',
    icon: Settings,
    message: 'Mise à jour du système',
    time: '1h',
  },
];

const RecentActivity: React.FC = () => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
        >
          <activity.icon className="w-5 h-5 text-blue-500" />
          <div className="flex-1">
            <div className="text-sm font-medium">{activity.message}</div>
            <div className="text-xs text-gray-500">Il y a {activity.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;