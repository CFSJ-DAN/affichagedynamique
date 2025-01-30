import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | React.ReactNode;
  change: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, change }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between mb-2">
      <p className="text-gray-500 text-sm">{title}</p>
      <Icon className="w-8 h-8 text-blue-500" />
    </div>
    <div>
      {typeof value === 'string' ? (
        <h3 className="text-2xl font-bold">{value}</h3>
      ) : (
        value
      )}
    </div>
    <p className="text-sm mt-2">
      <span className={`${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
      </span>
      {' '}vs semaine précédente
    </p>
  </div>
);

export default StatCard;