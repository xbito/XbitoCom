import React, { useMemo, useState } from 'react';
import { Crosshair, PlaneTakeoff, Radar, X } from 'lucide-react';
import BaseModal from './BaseModal';
import type { Base, UFO } from '../types';
import { validateDefined } from '../utils/validation';

interface UFOContactModalProps {
  isOpen: boolean;
  ufo: UFO | null;
  bases: Base[];
  onClose: () => void;
  onIntercept: (vehicleId: string) => void;
}

type InterceptorOption = {
  vehicleId: string;
  label: string;
};

const UFOContactModal: React.FC<UFOContactModalProps> = ({
  isOpen,
  ufo,
  bases,
  onClose,
  onIntercept
}) => {
  const options = useMemo<InterceptorOption[]>(() => {
    const safeBases = bases.slice(0, 50);
    const choices: InterceptorOption[] = [];

    for (const base of safeBases) {
      for (const vehicle of base.vehicles.slice(0, 50)) {
        if (vehicle.type !== 'interceptor') continue;
        if (vehicle.status !== 'ready') continue;
        if (vehicle.condition <= 0) continue;

        choices.push({
          vehicleId: vehicle.id,
          label: `${base.name} — ${vehicle.name} (${vehicle.condition}%)`
        });
      }
    }

    return choices;
  }, [bases]);

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  if (!isOpen) return null;

  if (!ufo) {
    return (
      <BaseModal isOpen={isOpen} onClose={onClose} title="UFO Contact" width="md">
        <div className="text-slate-300">No UFO selected.</div>
      </BaseModal>
    );
  }

  const canIntercept = ufo.status === 'detected' && options.length > 0;

  const handleIntercept = () => {
    validateDefined(ufo, 'ufo');
    const vehicleId = selectedVehicleId || options[0]?.vehicleId;
    validateDefined(vehicleId, 'vehicleId');
    onIntercept(vehicleId);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="UFO Contact" width="lg">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-slate-200 font-semibold flex items-center gap-2">
              <Radar size={18} className="text-red-400" />
              {ufo.name}
            </div>
            <div className="text-xs text-slate-400">Status: <span className="text-slate-200">{ufo.status}</span></div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="text-xs text-slate-400">Armor</div>
            <div className="font-mono text-white">{ufo.armor}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="text-xs text-slate-400">Weapons</div>
            <div className="font-mono text-white">{ufo.weapons}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="text-xs text-slate-400">Speed</div>
            <div className="font-mono text-white">{ufo.speed}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="text-xs text-slate-400">Stealth</div>
            <div className="font-mono text-white">{ufo.stealthRating}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-4 space-y-3">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Crosshair size={18} className="text-green-400" />
            Response
          </div>

          <div className="text-sm text-slate-400">
            {ufo.status !== 'detected'
              ? 'Interception requires confirmed detection.'
              : options.length === 0
                ? 'No ready interceptors available.'
                : 'Select an interceptor to launch.'}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              disabled={!canIntercept}
              className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 disabled:opacity-60"
            >
              {options.slice(0, 50).map(opt => (
                <option key={opt.vehicleId} value={opt.vehicleId}>{opt.label}</option>
              ))}
            </select>

            <button
              onClick={handleIntercept}
              disabled={!canIntercept}
              className="bg-red-600/80 hover:bg-red-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <PlaneTakeoff size={16} />
              Launch
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default UFOContactModal;
