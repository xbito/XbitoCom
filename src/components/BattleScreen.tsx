import React from 'react';
import { GameState, BattleState, VehicleBattleStats, UFOBattleStats, BattleCard } from '../types'; // Assuming these types exist

interface BattleScreenProps {
  gameState: GameState;
  onPlayCard: (cardId: string) => void;
  onEndTurn: () => void;
  // onRetreat: () => void; // Retreat can be added later
}

// Placeholder components for different parts of the battle screen
// VehicleStatusDisplay and UFOStatusDisplay remain the same for now

const VehicleStatusDisplay: React.FC<{ vehicleStats: VehicleBattleStats | undefined }> = ({ vehicleStats }) => {
  if (!vehicleStats) return <div className="text-red-500">Vehicle Battle Stats Missing!</div>;
  return (
    <div className="bg-slate-700 p-4 rounded-lg shadow-md border border-slate-600">
      <h3 className="text-lg font-semibold text-blue-400 mb-2">Player Vehicle</h3>
      <p>Health: <span className="font-mono text-green-400">{vehicleStats.currentHealth} / {vehicleStats.maxHealth}</span></p>
      <p>Energy: <span className="font-mono text-yellow-400">{vehicleStats.currentEnergy} / {vehicleStats.maxEnergy}</span></p>
      {/* Add more stats as needed: accuracy, evasion, etc. */}
    </div>
  );
};

const UFOStatusDisplay: React.FC<{ ufoStats: UFOBattleStats | undefined, ufoName: string | undefined }> = ({ ufoStats, ufoName }) => {
  if (!ufoStats) return <div className="text-red-500">UFO Battle Stats Missing!</div>;
  return (
    <div className="bg-slate-700 p-4 rounded-lg shadow-md border border-slate-600">
      <h3 className="text-lg font-semibold text-red-400 mb-2">Target UFO: {ufoName || 'Unknown'}</h3>
      <p>Health: <span className="font-mono text-green-400">{ufoStats.currentHealth} / {ufoStats.maxHealth}</span></p>
      <p>Energy: <span className="font-mono text-yellow-400">{ufoStats.currentEnergy} / {ufoStats.maxEnergy}</span></p>
      {/* Add more stats as needed: accuracy, evasion, threat etc. */}
    </div>
  );
};

const PlayerHandDisplay: React.FC<{ hand: BattleCard[]; onPlayCard: (cardId: string) => void; playerEnergy: number }> = ({ hand, onPlayCard, playerEnergy }) => {
  if (!hand.length) {
    return <div className="text-center text-slate-400 italic">Hand is empty.</div>;
  }
  return (
    <div className="mt-4">
      <h3 className="text-md font-semibold text-slate-300 mb-2 text-center">Player Hand</h3>
      <div className="flex justify-center space-x-2 p-2 bg-slate-900/50 rounded-lg min-h-[150px] items-center">
        {hand.map(card => {
          const canAfford = playerEnergy >= card.cost;
          return (
            <div
              key={card.id}
              onClick={() => canAfford && onPlayCard(card.id)}
              className={`bg-slate-600 p-3 rounded shadow-lg w-32 h-48 border border-slate-500 transition-all transform hover:scale-105
                          ${canAfford ? 'cursor-pointer hover:border-blue-500' : 'cursor-not-allowed opacity-60'}`}
            >
              <p className="font-bold text-sm text-blue-300">{card.name}</p>
              <p className="text-xs text-slate-300 mt-1 flex-grow">{card.description}</p>
              <p className={`text-xs font-mono mt-2 ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>Cost: {card.cost}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BattleControls: React.FC<{
  currentTurn: number;
  playerEnergy: number;
  onEndTurn: () => void;
  // onRetreat: () => void
}> = ({ currentTurn, playerEnergy, onEndTurn }) => {
  return (
    <div className="mt-4 p-3 bg-slate-800 rounded-lg shadow-md border border-slate-700 flex justify-between items-center">
      <div>
        <p className="text-slate-300">Turn: <span className="font-mono text-sky-400">{currentTurn}</span></p>
        <p className="text-slate-300">Player Energy: <span className="font-mono text-yellow-400">{playerEnergy}</span></p>
      </div>
      <div className="space-x-2">
        <button
          onClick={onEndTurn}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-md shadow transition-colors"
        >
          End Turn
        </button>
        <button
          // onClick={onRetreat} // Retreat to be implemented later
          className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-md shadow transition-colors opacity-50 cursor-not-allowed"
        >
          Retreat
        </button>
      </div>
    </div>
  );
};


const BattleScreen: React.FC<BattleScreenProps> = ({ gameState, onPlayCard, onEndTurn }) => {
  const battleState = gameState.activeBattle;

  if (!battleState) {
    // This case should ideally not be reached if BattleScreen is only rendered when a battle is active.
    // However, it's a good fallback.
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100]">
        <p className="text-xl text-red-500">Error: Battle State is not active.</p>
      </div>
    );
  }

  const { vehicleStatus, ufoStatus, playerHand, turn, playerEnergy } = battleState;
  const vehicleName = gameState.selectedVehicleForBattle?.name;
  const ufoName = gameState.selectedUFOForBattle?.name;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white p-4 sm:p-8 flex flex-col items-center justify-center z-[100]">
      <div className="w-full max-w-4xl mx-auto bg-slate-800/70 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-slate-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-sky-400 tracking-wider">UFO Interception In Progress!</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <VehicleStatusDisplay vehicleStats={vehicleStatus} />
          <UFOStatusDisplay ufoStats={ufoStatus} ufoName={ufoName} />
        </div>

        {/* Placeholder for where cards would be played or visual effects shown */}
        <div className="my-6 h-32 bg-slate-700/50 rounded-lg flex items-center justify-center border border-slate-600">
          <p className="text-slate-400 italic">Battle Action Area</p>
        </div>

        <PlayerHandDisplay hand={playerHand} onPlayCard={onPlayCard} playerEnergy={playerEnergy} />

        <BattleControls
          currentTurn={turn}
          playerEnergy={playerEnergy}
          onEndTurn={onEndTurn}
          /* onRetreat={onRetreat} */
        />

        {/* Battle Log could go here */}
        {/* <div className="mt-4 p-3 bg-slate-700 rounded h-24 overflow-y-auto">
          <h4 className="text-sm font-semibold text-slate-300 mb-1">Battle Log:</h4>
          {battleState.battleLog.map(entry => (
            <p key={entry.timestamp.toISOString()} className="text-xs text-slate-400">{entry.description}</p>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default BattleScreen;
