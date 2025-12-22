import { calculateInterception, type InterceptionResult } from '../utils/interception';
import type { Base, GameState, Transaction, UFO, Vehicle } from '../types';
import { validateDefined, validateString, validate } from '../utils/validation';

export type InterceptionOutcome = 'success' | 'failure';

export interface InterceptionReport {
  outcome: InterceptionOutcome;
  message: string;
  vehicleDamage: number;
  ufoDamage: number;
  vehicleId: string;
  ufoId: string;
  fundsDelta: number;
  transaction?: Transaction;
}

export interface InterceptionResolutionInput {
  success: boolean;
  message: string;
  vehicleDamage: number; // 0..100
  ufoDamage: number; // 0..9999
}

function findUFOById(state: GameState, ufoId: string): UFO | null {
  const fromDetected = state.detectedUFOs.find(u => u.id === ufoId);
  if (fromDetected) return fromDetected;
  const fromActive = state.activeUFOs.find(u => u.id === ufoId);
  return fromActive ?? null;
}

function findVehicleById(state: GameState, vehicleId: string): { base: Base; vehicle: Vehicle } | null {
  for (const base of state.bases.slice(0, 50)) {
    const vehicle = base.vehicles.find(v => v.id === vehicleId);
    if (vehicle) return { base, vehicle };
  }
  return null;
}

function clampInt(value: number, min: number, max: number): number {
  const safe = Number.isFinite(value) ? Math.trunc(value) : min;
  return Math.max(min, Math.min(max, safe));
}

function createTransaction(amount: number, description: string, category: Transaction['category']): Transaction {
  return {
    id: crypto.randomUUID(),
    date: new Date(),
    amount,
    type: amount >= 0 ? 'income' : 'expense',
    description,
    category
  };
}

function removeUFOById(list: UFO[], ufoId: string): UFO[] {
  return list.filter(u => u.id !== ufoId);
}

function replaceVehicle(bases: Base[], updatedBaseId: string, updatedVehicle: Vehicle): Base[] {
  return bases.map(b => {
    if (b.id !== updatedBaseId) return b;
    return {
      ...b,
      vehicles: b.vehicles.map(v => (v.id === updatedVehicle.id ? updatedVehicle : v))
    };
  });
}

export function performInterception(state: GameState, ufoId: string, vehicleId: string): {
  nextState: GameState;
  report: InterceptionReport;
} {
  const { ufo, base, vehicle } = getValidatedInterceptionInputs(state, ufoId, vehicleId);
  const result: InterceptionResult = calculateInterception(vehicle, ufo);

  return applyInterceptionResolution(state, {
    ufoId,
    vehicleId,
    resolution: {
      success: result.success,
      message: result.message,
      vehicleDamage: clampInt(result.vehicleDamage, 0, 100),
      ufoDamage: clampInt(result.ufoDamage, 0, 9999)
    },
    resolvedFrom: { baseId: base.id }
  });
}

export function applyInterceptionResolution(
  state: GameState,
  input: {
    ufoId: string;
    vehicleId: string;
    resolution: InterceptionResolutionInput;
    resolvedFrom?: { baseId?: string };
  }
): { nextState: GameState; report: InterceptionReport } {
  const { ufo, base, vehicle } = getValidatedInterceptionInputs(state, input.ufoId, input.vehicleId);
  const baseId = input.resolvedFrom?.baseId ?? base.id;

  const { updatedVehicle, updatedUFO } = applyInterceptionResolutionToEntities(
    vehicle,
    ufo,
    input.resolution
  );

  const { fundsDelta, transaction } = getInterceptionRewards(updatedUFO, input.resolution.success);

  return {
    nextState: buildNextState(state, {
      ufoId: input.ufoId,
      baseId,
      updatedVehicle,
      updatedUFO,
      fundsDelta,
      transaction,
      success: input.resolution.success
    }),
    report: {
      outcome: input.resolution.success ? 'success' : 'failure',
      message: input.resolution.message,
      vehicleDamage: clampInt(input.resolution.vehicleDamage, 0, 100),
      ufoDamage: clampInt(input.resolution.ufoDamage, 0, 9999),
      vehicleId: vehicle.id,
      ufoId: updatedUFO.id,
      fundsDelta,
      transaction
    }
  };
}

function getValidatedInterceptionInputs(state: GameState, ufoId: string, vehicleId: string): {
  ufo: UFO;
  base: Base;
  vehicle: Vehicle;
} {
  validateDefined(state, 'state');
  validateString(ufoId, 'ufoId');
  validateString(vehicleId, 'vehicleId');

  const ufo = findUFOById(state, ufoId);
  validate(ufo, 'UFO not found');

  const vehicleLookup = findVehicleById(state, vehicleId);
  validate(vehicleLookup, 'Vehicle not found');

  const { base, vehicle } = vehicleLookup!;
  validate(vehicle.type === 'interceptor', 'Selected vehicle is not an interceptor');
  validate(vehicle.status === 'ready', 'Selected interceptor is not ready');
  validate(vehicle.condition > 0, 'Selected interceptor is not operational');

  return { ufo: ufo!, base, vehicle };
}

function applyInterceptionResolutionToEntities(vehicle: Vehicle, ufo: UFO, resolution: InterceptionResolutionInput): {
  updatedVehicle: Vehicle;
  updatedUFO: UFO;
} {
  const vehicleDamage = clampInt(resolution.vehicleDamage, 0, 100);
  const updatedCondition = clampInt(vehicle.condition - vehicleDamage, 0, 100);

  return {
    updatedVehicle: {
      ...vehicle,
      condition: updatedCondition,
      status: updatedCondition <= 0 ? 'damaged' : resolution.success ? 'ready' : 'damaged'
    },
    updatedUFO: {
      ...ufo,
      interceptedBy: vehicle.id,
      status: resolution.success ? 'destroyed' : 'escaped'
    }
  };
}

function getInterceptionRewards(ufo: UFO, success: boolean): {
  fundsDelta: number;
  transaction?: Transaction;
} {
  const reward = success ? 250000 + ufo.size * 100000 : 0;
  return {
    fundsDelta: reward,
    transaction: reward > 0 ? createTransaction(reward, `Interception reward: ${ufo.name}`, 'funding') : undefined
  };
}

function buildNextState(
  state: GameState,
  input: {
    ufoId: string;
    baseId: string;
    updatedVehicle: Vehicle;
    updatedUFO: UFO;
    fundsDelta: number;
    transaction?: Transaction;
    success: boolean;
  }
): GameState {
  return {
    ...state,
    funds: state.funds + input.fundsDelta,
    bases: replaceVehicle(state.bases, input.baseId, input.updatedVehicle),
    activeUFOs: removeUFOById(state.activeUFOs, input.ufoId),
    detectedUFOs: removeUFOById(state.detectedUFOs, input.ufoId),
    interceptedUFOs: [...state.interceptedUFOs, input.updatedUFO],
    destroyedUFOs: input.success ? [...state.destroyedUFOs, input.updatedUFO] : state.destroyedUFOs,
    escapedUFOs: input.success ? state.escapedUFOs : [...state.escapedUFOs, input.updatedUFO],
    financials: {
      ...state.financials,
      transactions: input.transaction ? [...state.financials.transactions, input.transaction] : state.financials.transactions
    }
  };
}
