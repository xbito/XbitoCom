import React from 'react';
import { CheckCircle2, XCircle, Coins, Shield, Zap } from 'lucide-react';
import BaseModal from './BaseModal';
import type { InterceptionReport } from '../game/ufoInterception';

interface InterceptionReportModalProps {
  isOpen: boolean;
  report: InterceptionReport | null;
  onClose: () => void;
}

const InterceptionReportModal: React.FC<InterceptionReportModalProps> = ({
  isOpen,
  report,
  onClose
}) => {
  if (!isOpen || !report) return null;

  const isSuccess = report.outcome === 'success';

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Interception Report" width="md">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          {isSuccess ? (
            <CheckCircle2 className="text-green-500" />
          ) : (
            <XCircle className="text-red-500" />
          )}
          <div>
            <div className={`text-lg font-semibold ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
              {isSuccess ? 'UFO Neutralized' : 'Interception Failed'}
            </div>
            <div className="text-slate-300 text-sm">{report.message}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
              <Shield size={14} className="text-slate-300" />
              Vehicle Damage
            </div>
            <div className="text-white font-mono">{report.vehicleDamage}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
              <Zap size={14} className="text-slate-300" />
              UFO Damage
            </div>
            <div className="text-white font-mono">{report.ufoDamage}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-3 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Coins size={16} className="text-green-400" />
            Funds Change
          </div>
          <div className={`font-mono ${report.fundsDelta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {report.fundsDelta >= 0 ? '+' : '-'}${Math.abs(report.fundsDelta).toLocaleString()}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600/80 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default InterceptionReportModal;
