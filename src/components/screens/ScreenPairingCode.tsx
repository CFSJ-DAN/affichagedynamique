import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface ScreenPairingCodeProps {
  screenId: string;
  pairingCode: string;
  onRegeneratePairingCode: () => void;
}

const ScreenPairingCode: React.FC<ScreenPairingCodeProps> = ({
  pairingCode,
  onRegeneratePairingCode,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-700">Code d'appairage</h3>
        <button
          onClick={onRegeneratePairingCode}
          className="p-1 text-gray-500 hover:text-gray-700"
          title="Générer un nouveau code"
        >
          <RefreshCw size={16} />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <code className="bg-white px-4 py-2 rounded border font-mono text-lg">
          {pairingCode}
        </code>
        <p className="text-sm text-gray-600">
          Utilisez ce code pour connecter un ordinateur à cet écran
        </p>
      </div>
    </div>
  );
};

export default ScreenPairingCode;