import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { Badge } from '@/components/ui/badge';

export function OfflineIndicator() {
  const isOnline = useOfflineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Badge variant="destructive" className="flex items-center gap-2 px-3 py-2">
        <div className="offline-indicator">
          <WifiOff className="w-4 h-4" />
        </div>
        You are offline
      </Badge>
    </div>
  );
}
