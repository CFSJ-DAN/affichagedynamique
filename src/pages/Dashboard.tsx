import React from 'react';
import { PlaySquare, AlertTriangle } from 'lucide-react';
import StatCard from '../components/stats/StatCard';
import ScreenStatusIndicator from '../components/dashboard/ScreenStatusIndicator';
import { useScreenStore } from '../stores/screenStore';
import { formatOfflineTime } from '../utils/dateUtils';

const Dashboard: React.FC = () => {
  const { screens } = useScreenStore();
  const activeScreens = Array.isArray(screens) ? screens.filter(screen => screen.status === 'online') : [];
  const offlineScreens = Array.isArray(screens) ? screens.filter(screen => screen.status === 'offline') : [];

  const stats = [
    { 
      icon: PlaySquare,
      title: 'Listes de diffusion actives',
      value: '12',
      change: -2,
    },
  ];

  const hasAlerts = offlineScreens.length > 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
      
      {/* Alertes */}
      {hasAlerts && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center text-yellow-800 mb-2">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <h2 className="font-semibold">Alertes actives</h2>
          </div>
          <ul className="space-y-2">
            {offlineScreens.map(screen => {
              const { formattedDate, duration } = formatOfflineTime(new Date(screen.lastSeen));
              return (
                <li key={screen.id} className="flex items-center text-yellow-700">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                  Écran "{screen.name}" hors ligne depuis le {formattedDate} -- {duration}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Écrans actifs */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">État des écrans</h2>
        <ScreenStatusIndicator screens={screens || []} />
      </div>

      {/* Autres statistiques */}
      <div className="grid grid-cols-1 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;