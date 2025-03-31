import React, { useEffect } from 'react';
import { AlertTriangle, Radio } from 'lucide-react';
import { UFO } from '../types';

interface UFONotificationProps {
  ufo: UFO;
  base: string;
  onClose?: () => void;
}

const UFONotification: React.FC<UFONotificationProps> = ({ ufo, base, onClose }) => {
  useEffect(() => {
    // Play detection sound
    const audio = new Audio('/assets/detect.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore errors if sound can't play

    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      onClose?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-black/90 border border-red-500/50 rounded-lg p-4 text-white shadow-lg animate-slide-in">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Radio size={14} className="text-red-500 animate-pulse" />
            <h3 className="font-bold text-red-500">UFO Detected</h3>
          </div>
          <p className="text-sm opacity-90 mb-2">
            {ufo.name} detected by {base}
          </p>
          <div className="text-xs space-y-1 opacity-80">
            <div>Type: {ufo.type}</div>
            <div>Speed: {ufo.speed} km/h</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UFONotification;