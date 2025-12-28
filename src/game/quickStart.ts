import type { Base, Continent } from '../types';
import { CONTINENTS } from '../data/continents';
import { createFacility, FACILITY_TYPES } from '../data/facilities';
import { generateVehicle } from '../data/vehicles';
import { assert, assertDefined } from '../utils/assert';

export const QUICK_START_BASE_COST = 2000000;

export function createQuickStartBase(continentId: string): Base {
  assert(typeof continentId === 'string' && continentId.length > 0, 'continentId must be a non-empty string');

  const continent = CONTINENTS[continentId];
  assertDefined(continent, 'continent');

  const baseId = crypto.randomUUID();
  const { x, y } = pickBaseLocationInContinent(continent);

  const powerPlant = createFacility('powerPlant');
  const barracks = createFacility('barracks');
  const radar = createFacility('radar');
  const hangar = createFacility('hangar');

  const vehicle = generateVehicle('interceptor-basic', baseId);

  const radarRange = FACILITY_TYPES.radar.baseRadarRange ?? 1200;
  const radarEffectiveness = FACILITY_TYPES.radar.baseEffectiveness ?? 1.0;

  const { power, powerUsage } = computePowerStatus([powerPlant, barracks, radar, hangar]);

  const base: Base = {
    id: baseId,
    name: `GDA ${continent.name} HQ`,
    x,
    y,
    level: 1,
    personnel: [],
    facilities: [powerPlant, barracks, radar, hangar],
    power,
    powerUsage,
    continent,
    maxSize: continent.maxBaseSize,
    vehicles: [vehicle],
    radarRange,
    radarEffectiveness,
    personnelCapacity: barracks.personnelCapacity ?? 15
  };

  return base;
}

function pickBaseLocationInContinent(continent: Continent): { x: number; y: number } {
  assertDefined(continent, 'continent');

  // WorldMap uses viewBox="0 0 900 500".
  const viewWidth = 900;
  const viewHeight = 500;

  const minX = (continent.coordinates.x1 / 100) * viewWidth;
  const maxX = (continent.coordinates.x2 / 100) * viewWidth;
  const minY = (continent.coordinates.y1 / 100) * viewHeight;
  const maxY = (continent.coordinates.y2 / 100) * viewHeight;

  const pad = 18;
  const x = clampFloat(minX + pad + Math.random() * Math.max(1, maxX - minX - pad * 2), 0, viewWidth);
  const y = clampFloat(minY + pad + Math.random() * Math.max(1, maxY - minY - pad * 2), 0, viewHeight);

  return { x, y };
}

function computePowerStatus(facilities: Array<{ powerUsage?: number }>): { power: number; powerUsage: number } {
  const safe = facilities.slice(0, 10);
  let generation = 0;
  let usage = 0;

  for (let i = 0; i < safe.length && i < 10; i++) {
    const p = safe[i]?.powerUsage ?? 0;
    if (p < 0) generation += Math.abs(p);
    else usage += p;
  }

  return {
    power: clampInt(generation, 0, 9999),
    powerUsage: clampInt(usage, 0, 9999)
  };
}

function clampInt(value: number, min: number, max: number): number {
  const safe = Number.isFinite(value) ? Math.trunc(value) : min;
  return Math.max(min, Math.min(max, safe));
}

function clampFloat(value: number, min: number, max: number): number {
  const safe = Number.isFinite(value) ? value : min;
  return Math.max(min, Math.min(max, safe));
}
