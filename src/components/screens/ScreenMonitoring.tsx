import React from 'react';
import { Cpu, Memory, HardDrive, Thermometer, Wifi } from 'lucide-react';
import { useScreenStore } from '../../stores/screenStore';

interface ScreenMonitoringProps {
  screenId: string;
}

const ScreenMonitoring: React.FC<ScreenMonitoringProps> = ({ screenId }) => {
  const { monitoringStatus, getScreenHealth } = useScreenStore();
  const status = monitoringStatus[screenId];
  const health = getScreenHealth(screenId);

  if (!status) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-700">Aucune donnée de monitoring disponible</p>
      </div>
    );
  }

  const healthColors = {
    healthy: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800',
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${healthColors[health]}`}>
        <h3 className="font-medium mb-2">État du système</h3>
        <p>Dernière mise à jour: {new Date(status.lastPing).toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Cpu className="w-5 h-5 mr-2 text-blue-500" />
              <span className="font-medium">CPU</span>
            </div>
            <span className={`${status.cpuUsage > 80 ? 'text-red-600' : 'text-gray-600'}`}>
              {status.cpuUsage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                status.cpuUsage > 80 ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${status.cpuUsage}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Memory className="w-5 h-5 mr-2 text-purple-500" />
              <span className="font-medium">Mémoire</span>
            </div>
            <span className={`${status.memoryUsage > 80 ? 'text-red-600' : 'text-gray-600'}`}>
              {status.memoryUsage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                status.memoryUsage > 80 ? 'bg-red-500' : 'bg-purple-500'
              }`}
              style={{ width: `${status.memoryUsage}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <HardDrive className="w-5 h-5 mr-2 text-orange-500" />
              <span className="font-medium">Espace disque</span>
            </div>
            <span className={`${status.diskSpace < 10 ? 'text-red-600' : 'text-gray-600'}`}>
              {status.diskSpace}% libre
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                status.diskSpace < 10 ? 'bg-red-500' : 'bg-orange-500'
              }`}
              style={{ width: `${status.diskSpace}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Thermometer className="w-5 h-5 mr-2 text-red-500" />
              <span className="font-medium">Température</span>
            </div>
            <span className={`${status.temperature > 80 ? 'text-red-600' : 'text-gray-600'}`}>
              {status.temperature}°C
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                status.temperature > 80 ? 'bg-red-500' : 'bg-red-500'
              }`}
              style={{ width: `${(status.temperature / 100) * 100}%` }}
            />
          </div>
        </div>

        <div className="col-span-2 bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Wifi className="w-5 h-5 mr-2 text-green-500" />
              <span className="font-medium">Réseau</span>
            </div>
            <span className="text-gray-600">{formatBytes(status.networkSpeed)}/s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenMonitoring;