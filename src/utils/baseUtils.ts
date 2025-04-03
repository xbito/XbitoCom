import { Base, Facility, Continent, ContinentSelection } from '../types';
import { FACILITY_TYPES } from '../data/facilities';

/**
 * Calculates power generation, usage, and surplus for a base
 * @param base The base to calculate power status for
 * @returns Object containing generation, usage, and surplus values
 */
export function calculatePowerStatus(base: Base) {
  if (!base || !base.facilities) {
    throw new Error('Invalid base provided');
  }
  
  const totalGeneration = base.facilities
    .filter(f => f.powerUsage < 0)
    .reduce((acc, f) => acc + Math.abs(f.powerUsage), 0);
  
  const totalUsage = base.facilities
    .filter(f => f.powerUsage > 0)
    .reduce((acc, f) => acc + f.powerUsage, 0);

  return {
    generation: totalGeneration,
    usage: totalUsage,
    surplus: totalGeneration - totalUsage,
  };
}

/**
 * Helper function to safely access continent properties
 * @param selected Continent or ContinentSelection object
 * @returns Continent object
 */
export function getContinent(selected: Continent | ContinentSelection | null | undefined): Continent {
  if (!selected) return {} as Continent;
  return 'continent' in selected ? selected.continent : selected;
}

/**
 * Calculate continent personnel bonus
 * @param selectedContinent The selected continent
 * @returns Personnel multiplier value
 */
export function getPersonnelMultiplier(selectedContinent: Continent | ContinentSelection | null | undefined) {
  const continent = getContinent(selectedContinent);
  return continent?.personnelMultiplier || 1;
}

/**
 * For new bases, calculate initial housing capacity from barracks
 * @param selectedContinent The selected continent
 * @returns Initial personnel capacity value
 */
export function getInitialPersonnelCapacity(selectedContinent: Continent | ContinentSelection | null | undefined) {
  // Initial facilities include a level 1 barracks
  // Level 1 barracks provides 15 personnel housing capacity
  const baseCapacity = 15;
  
  // Apply continent multiplier
  return Math.round(baseCapacity * getPersonnelMultiplier(selectedContinent));
}

/**
 * Calculate upgrade cost for a facility
 * @param facility The facility to calculate upgrade cost for
 * @returns The cost to upgrade the facility
 */
export function calculateUpgradeCost(facility: Facility) {
  if (!facility || !facility.type) {
    throw new Error('Invalid facility provided');
  }
  const facilityType = FACILITY_TYPES[facility.type];
  return Math.floor(facilityType.baseCost * Math.pow(facilityType.upgradeMultiplier, facility.level));
}

/**
 * Calculate the total size of facilities in a base
 * @param base The base to calculate size for
 * @returns Total facility spaces used
 */
export function calculateBaseSize(base: Base) {
  if (!base || !base.facilities) {
    throw new Error('Invalid base provided');
  }
  return base.facilities.reduce((acc, f) => acc + FACILITY_TYPES[f.type].size, 0);
}