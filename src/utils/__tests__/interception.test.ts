import { describe, it, expect } from 'vitest';
import { calculateInterception } from '../interception';
import type { Vehicle, UFO, Personnel } from '../../types';

const crew: Personnel[] = [
  {
    id: 'p1',
    name: 'Pilot',
    role: 'pilot',
    skills: { combat: 50, research: 0, engineering: 0, leadership: 0, medical: 0, piloting: 50 },
    status: 'available',
    experience: 50,
    salary: 0,
    baseId: 'b1',
    assignedFacilityId: null,
    assignedVehicleId: 'v1',
  }
];

const vehicle: Vehicle = {
  id: 'v1',
  type: 'interceptor',
  name: 'Int',
  status: 'ready',
  condition: 100,
  crew,
  baseId: 'b1',
  stats: {
    speed: 200,
    armor: 50,
    range: 0,
    capacity: 0,
    firepower: 100,
    energyGeneration: 0,
    cardSlots: 0,
    equipmentSlots: 0,
  }
};

const ufo: UFO = {
  id: 'u1',
  type: 'scout',
  name: 'Scout',
  size: 1,
  speed: 100,
  armor: 40,
  weapons: 80,
  stealthRating: 0,
  status: 'approaching',
  location: { x: 0, y: 0, altitude: 0 },
  detectedBy: null,
  interceptedBy: null,
  progressPerTurn: 1,
  automated: true,
  shape: 'circle',
  color: 'silver'
};

describe('interception', () => {
  it('calculates successful interception', () => {
    const result = calculateInterception(vehicle, ufo);
    expect(result.success).toBe(true);
    expect(result.ufoDamage).toBeGreaterThan(result.vehicleDamage);
  });
});
