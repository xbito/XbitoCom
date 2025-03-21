import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { GameEvent } from '../data/events';

interface EventModalProps {
  event: GameEvent;
  effectMessage: string;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, effectMessage, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-[500px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className={
              event.type === 'positive' ? 'text-green-400' :
              event.type === 'negative' ? 'text-red-400' :
              'text-blue-400'
            } size={24} />
            <h2 className="text-2xl font-bold">{event.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-lg mb-6">{event.description}</p>

        <div className={`p-4 rounded-lg ${
          event.type === 'positive' ? 'bg-green-900/30 text-green-400' :
          event.type === 'negative' ? 'bg-red-900/30 text-red-400' :
          'bg-blue-900/30 text-blue-400'
        }`}>
          <p className="font-semibold">{effectMessage}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default EventModal;