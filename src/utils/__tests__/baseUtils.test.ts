import { describe, it, expect } from 'vitest';
import { calculatePowerStatus, calculateBaseSize, getInitialPersonnelCapacity } from '../baseUtils';
import { createFacility } from '../../data/facilities';
import type { Base, Continent } from '../../types';

const continent: Continent = {
  id: 'c1',
  name: 'Test',
  coordinates: { x1: 0, y1: 0, x2: 10, y2: 10 },
  maxBaseSize: 10,
  personnelMultiplier: 2,
  researchMultiplier: 1,
  defenseMultiplier: 1,
  loreId: 'c1'
};

function createBase(): Base {
  return {
    id: 'b1',
    name: 'Base',
    x: 0,
    y: 0,
    level: 1,
    personnel: [],
    facilities: [],
    power: 0,
    powerUsage: 0,
    continent,
    maxSize: 10,
    vehicles: [],
    radarRange: 100,
    radarEffectiveness: 1
  };
}

describe('baseUtils', () => {
  it('calculates power generation and usage', () => {
    const base = createBase();
    base.facilities = [
      createFacility('powerPlant', 1),
      createFacility('research', 1)
    ];
    const result = calculatePowerStatus(base);
    expect(result).toEqual({ generation: 50, usage: 20, surplus: 30 });
  });

  it('computes base size from facilities', () => {
    const base = createBase();
    base.facilities = [
      createFacility('barracks', 1),
      createFacility('research', 1)
    ];
    expect(calculateBaseSize(base)).toBe(5);
  });

  it('gets initial personnel capacity with continent bonus', () => {
    expect(getInitialPersonnelCapacity(continent)).toBe(30);
  });
});
