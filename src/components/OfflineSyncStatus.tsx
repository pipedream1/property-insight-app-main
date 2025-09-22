
import React from 'react';
import { Wifi, WifiOff, Upload, CheckCircle2, Pause, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOfflineSync } from '@/hooks/useOfflineSync';

export const OfflineSyncStatus: React.FC = () => {
  const { 
    isOnline, 
    syncInProgress, 
    pendingUploads, 
    syncOfflinePhotos,
    paused,
    pauseSync,
    resumeSync
  } = useOfflineSync();

  if (isOnline && pendingUploads === 0 && !syncInProgress && !paused) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-sm">All synced</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isOnline ? (
        <Wifi className="h-4 w-4 text-green-600" />
      ) : (
        <WifiOff className="h-4 w-4 text-orange-500" />
      )}
      
      <div className="flex items-center gap-2">
        {paused && (
          <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
            Paused
          </Badge>
        )}
        {pendingUploads > 0 && !paused && (
          <Badge variant="outline" className="text-xs">
            {pendingUploads} pending
          </Badge>
        )}
        
        {syncInProgress && (
          <div className="flex items-center gap-1">
            <Upload className="h-3 w-3 animate-pulse" />
            <span className="text-xs">Syncing...</span>
          </div>
        )}
        
        {isOnline && pendingUploads > 0 && !syncInProgress && !paused && (
          <Button
            size="sm"
            variant="outline"
            onClick={syncOfflinePhotos}
            className="text-xs px-2 py-1 h-6"
          >
            Sync Now
          </Button>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={paused ? resumeSync : pauseSync}
          className="text-xs px-2 py-1 h-6"
          title={paused ? 'Resume offline sync' : 'Pause offline sync'}
        >
          {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  );
};
