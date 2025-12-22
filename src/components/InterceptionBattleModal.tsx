import React, { useEffect, useMemo, useState } from 'react';
import { Crosshair, Shield, Zap, Swords, X } from 'lucide-react';
import BaseModal from './BaseModal';
import type { UFO, Vehicle } from '../types';
import { createBattleV0, endTurnV0, playBasicAttackV0, playCardV0, type BattleResult, type BattleStateV0 } from '../game/battleV0';
import { logInfo } from '../utils/logging';
import { assertDefined } from '../utils/assert';

interface InterceptionBattleModalProps {
  isOpen: boolean;
  vehicle: Vehicle | null;
  ufo: UFO | null;
  onClose: () => void;
  onComplete: (result: BattleResult) => void;
}

const InterceptionBattleModal: React.FC<InterceptionBattleModalProps> = ({
  isOpen,
  vehicle,
  ufo,
  onClose,
  onComplete
}) => {
  const [state, setState] = useState<BattleStateV0 | null>(null);

  const title = useMemo(() => {
    if (!vehicle || !ufo) return 'Interception Battle';
    return `Interception: ${vehicle.name} vs ${ufo.name}`;
  }, [ufo, vehicle]);

  useEffect(() => {
    if (!isOpen) return;
    if (!vehicle || !ufo) return;

    const next = createBattleV0(vehicle, ufo);
    logInfo('Battle', 'Battle v0 created', {
      battleId: next.id,
      vehicleId: vehicle.id,
      ufoId: ufo.id
    });
    setState(next);
  }, [isOpen, ufo, vehicle]);

  useEffect(() => {
    if (!state?.finished || !state.result) return;
    onComplete(state.result);
  }, [onComplete, state?.finished, state?.result]);

  if (!isOpen) return null;

  if (!vehicle || !ufo) {
    return (
      <BaseModal isOpen={isOpen} onClose={onClose} title="Interception Battle" width="md">
        <div className="text-slate-300">Missing vehicle or UFO context.</div>
      </BaseModal>
    );
  }

  if (!state) {
    return (
      <BaseModal isOpen={isOpen} onClose={onClose} title={title} width="lg">
        <div className="text-slate-300">Initializing battle…</div>
      </BaseModal>
    );
  }

  const playerHpPct = Math.round((state.player.hp / Math.max(1, state.player.maxHp)) * 100);
  const enemyHpPct = Math.round((state.enemy.hp / Math.max(1, state.enemy.maxHp)) * 100);

  const handlePlay = (cardId: string) => {
    setState(prev => {
      assertDefined(prev, 'battleState');
      return playCardV0(prev, cardId);
    });
  };

  const handleEndTurn = () => {
    setState(prev => {
      assertDefined(prev, 'battleState');
      return endTurnV0(prev);
    });
  };

  const handleBasicAttack = () => {
    setState(prev => {
      assertDefined(prev, 'battleState');
      return playBasicAttackV0(prev);
    });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} width="2xl">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="text-sm text-slate-400">
            Turn <span className="text-slate-200 font-mono">{state.turn}</span> / <span className="font-mono">{state.maxTurns}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded p-4">
            <div className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
              <Shield size={16} className="text-green-400" />
              Interceptor
            </div>
            <div className="text-xs text-slate-400 mb-1">HP</div>
            <div className="w-full h-2 bg-slate-950 rounded overflow-hidden mb-2">
              <div className="h-full bg-green-500" style={{ width: `${playerHpPct}%` }} />
            </div>
            <div className="text-xs text-slate-300 font-mono">{state.player.hp} / {state.player.maxHp}</div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Zap size={14} className="text-yellow-400" /> Energy
              </div>
              <div className="font-mono text-slate-200">{state.player.energy} / {state.player.maxEnergy}</div>
            </div>

            <div className="mt-2 text-xs text-slate-400">
              Plays left: <span className="text-slate-200 font-mono">{state.player.playsLeft}</span>
            </div>

            <div className="mt-1 text-xs text-slate-500">
              Draw/turn: <span className="text-slate-300 font-mono">{state.player.drawPerTurn}</span> · Hand: <span className="text-slate-300 font-mono">{state.player.handSize}</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded p-4">
            <div className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
              <Swords size={16} className="text-red-400" />
              UFO
            </div>
            <div className="text-xs text-slate-400 mb-1">HP</div>
            <div className="w-full h-2 bg-slate-950 rounded overflow-hidden mb-2">
              <div className="h-full bg-red-500" style={{ width: `${enemyHpPct}%` }} />
            </div>
            <div className="text-xs text-slate-300 font-mono">{state.enemy.hp} / {state.enemy.maxHp}</div>

            <div className="mt-3 text-xs text-slate-400">Evasion: <span className="text-slate-200 font-mono">{state.enemy.evasion}</span></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-4">
          <div className="flex items-center gap-2 text-slate-200 font-semibold mb-3">
            <Crosshair size={16} className="text-cyan-400" />
            Hand
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-slate-500">
              Vehicle: <span className="text-slate-300 font-mono">{state.player.vehicleType}</span>
            </div>
            <button
              onClick={handleBasicAttack}
              disabled={state.finished || state.player.playsLeft <= 0 || state.player.energy < state.player.basicAttackCost}
              className="bg-red-600/80 hover:bg-red-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded text-sm"
            >
              Basic Attack ({state.player.basicAttackCost})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {state.hand.map(card => {
              const disabled = state.finished || state.player.playsLeft <= 0 || state.player.energy < card.cost;

              return (
                <button
                  key={card.id}
                  disabled={disabled}
                  onClick={() => handlePlay(card.id)}
                  className={`text-left rounded border p-3 transition-colors ${
                    disabled
                      ? 'bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-950 border-slate-700 hover:border-slate-500 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-sm">{card.name}</div>
                    <div className="font-mono text-xs text-yellow-400">{card.cost}</div>
                  </div>
                  <div className="text-xs text-slate-400">{card.description}</div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleEndTurn}
              disabled={state.finished}
              className="bg-blue-600/80 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
            >
              End Turn
            </button>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded p-4 max-h-56 overflow-y-auto">
          <div className="text-xs text-slate-400 mb-2">Combat Log</div>
          <div className="space-y-1">
            {state.log.slice(-20).map((entry, idx) => (
              <div key={`${entry.turn}-${idx}`} className="text-xs text-slate-300">
                <span className="text-slate-500 font-mono">T{entry.turn}:</span> {entry.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default InterceptionBattleModal;
