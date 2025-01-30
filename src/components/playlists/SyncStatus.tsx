import React from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useSyncStore } from '../../stores/syncStore';

interface SyncStatusProps {
  playlistId: string;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ playlistId }) => {
  const { syncQueue, currentSync, syncHistory } = useSyncStore();
  
  const isQueued = syncQueue.includes(playlistId);
  const isSyncing = currentSync === playlistId;
  const lastSync = syncHistory.find(sync => sync.id === playlistId);

  if (isSyncing) {
    return (
      <div className="flex items-center text-blue-600">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        <span className="text-sm">Synchronisation en cours...</span>
      </div>
    );
  }

  if (isQueued) {
    return (
      <div className="flex items-center text-gray-600">
        <span className="text-sm">En attente de synchronisation...</span>
      </div>
    );
  }

  if (lastSync) {
    return (
      <div className="flex items-center">
        {lastSync.status === 'success' ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            <span className="text-sm text-green-600">
              Synchronisé le {new Date(lastSync.timestamp).toLocaleString()}
            </span>
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4 mr-2 text-red-600" />
            <span className="text-sm text-red-600">
              Erreur: {lastSync.details}
            </span>
          </>
        )}
      </div>
    );
  }

  return null;
};

export default SyncStatus;