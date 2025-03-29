import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { GameEvent } from '../data/events';

interface EventModalProps {
  event: GameEvent;
  effectMessage: string;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose, effectMessage }) => {
  const eventTypeStyles = {
    positive: {
      icon: 'text-emerald-400',
      bg: 'from-emerald-900/30 to-emerald-950/30',
      text: 'text-emerald-400',
      border: 'border-emerald-800/30'
    },
    negative: {
      icon: 'text-rose-400',
      bg: 'from-rose-900/30 to-rose-950/30',
      text: 'text-rose-400',
      border: 'border-rose-800/30'
    },
    neutral: {
      icon: 'text-cyan-400',
      bg: 'from-cyan-900/30 to-cyan-950/30',
      text: 'text-cyan-400',
      border: 'border-cyan-800/30'
    }
  };

  const styleType = event.type in eventTypeStyles ? event.type : 'neutral';
  const styles = eventTypeStyles[styleType as keyof typeof eventTypeStyles];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-lg border border-slate-800 shadow-xl p-6 w-[500px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className={`${styles.icon} filter drop-shadow-glow`} size={24} />
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-300">{event.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-lg mb-6 text-slate-300">{event.description}</p>

        <div className={`p-4 rounded-lg bg-gradient-to-r ${styles.bg} ${styles.text} border ${styles.border}`}>
          <p className="font-semibold">{effectMessage}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-slate-100 font-bold py-2 px-4 rounded border-none transition-all duration-200 shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default EventModal;