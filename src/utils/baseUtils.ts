import { Base, ResearchProject, GameState } from '../types'; // Added GameState
import { FACILITY_TYPES } from '../data/facilities';

/**
 * Calculates the radar coverage radius for a base, including bonuses from completed radar research projects.
 * @param base The base to calculate for
 * @param completedResearch Array of completed research projects
 * @returns The radar coverage radius
 */
export function getRadarRadius(base: Base, completedResearch: ResearchProject[]): number {
  const radarFacility = base.facilities.find(f => f.type === 'radar');
  if (!radarFacility) return 0;

  const baseRange = 60;
  const radarBonus = radarFacility.level * 0.2;

  // Calculate total radar coverage bonus from completed research
  let researchCoverageBonus = 0;
  for (const project of completedResearch) {
    if (project.category === 'radar' && project.benefits && Array.isArray(project.benefits.bonuses)) {
      for (const bonus of project.benefits.bonuses) {
        if (bonus.type === 'coverage') {
          researchCoverageBonus += bonus.value;
        }
      }
    }
  }

  // Convert research bonus from percent to multiplier
  const researchMultiplier = 1 + researchCoverageBonus / 100;
  return baseRange * (1 + radarBonus) * researchMultiplier;
}

/**
 * Calculates the radar opacity for a base based on radar facility level.
 * @param base The base to calculate for
 * @returns The radar opacity (0-1)
 */
export function getRadarOpacity(base: Base): number {
  const radarFacility = base.facilities.find(f => f.type === 'radar');
  if (!radarFacility) return 0;
  return 0.3 + (radarFacility.level * 0.1); // Base opacity 0.3, increasing by 0.1 per level
}

/**
 * Calculates the total facility space used in a base.
 * @param base The base to calculate for
 * @returns The total facility size used
 */
export function calculateBaseSize(base: Base): number {
  if (!base || !Array.isArray(base.facilities)) return 0;
  return base.facilities.reduce((sum, facility) => {
    const facilityType = FACILITY_TYPES[facility.type];
    const size = facilityType?.size ?? 1;
    return sum + size;
  }, 0);
}

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
export function getContinent(selected: any): any {
  if (!selected) return {};
  return 'continent' in selected ? selected.continent : selected;
}

/**
 * Calculate continent personnel bonus
 * @param selectedContinent The selected continent
 * @returns Personnel multiplier value
 */
export function getPersonnelMultiplier(selectedContinent: any) {
  const continent = getContinent(selectedContinent);
  return continent?.personnelMultiplier || 1;
}

/**
 * For new bases, calculate initial housing capacity from barracks
 * @param selectedContinent The selected continent
 * @returns Initial personnel capacity value
 */
export function getInitialPersonnelCapacity(selectedContinent: any) {
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
export function calculateUpgradeCost(facility: any) {
  if (!facility || !facility.type) {
    throw new Error('Invalid facility provided');
  }
  const facilityType = FACILITY_TYPES[facility.type];
  return Math.floor(facilityType.baseCost * Math.pow(facilityType.upgradeMultiplier, facility.level));
}

/**
 * Calculates the total number of scientists assigned to research labs across all bases.
 * @param gameState The current game state.
 * @returns The total count of scientists in research labs.
 */
export const calculateScientistsInLabs = (gameState: GameState): number => {
  if (!gameState || !gameState.bases) {
    console.warn(`%c[${new Date().toISOString()}] [baseUtils] calculateScientistsInLabs called with invalid gameState`, 'color: orange;', { gameState });
    return 0;
  }

  let count = 0;
  // Use for...of loop for better readability and safety
  for (const base of gameState.bases) {
    // Ensure base and base.facilities are valid before proceeding
    if (base && Array.isArray(base.facilities)) {
      for (const facility of base.facilities) {
        // Ensure facility and facility.personnel are defined and facility is a research lab
        if (facility && facility.type === 'research' && Array.isArray(facility.personnel)) {
          // Count personnel directly assigned to the research lab who are scientists
          // Ensure personnel object (p) exists before accessing its role
          count += facility.personnel.filter(p => p && p.role === 'scientist').length;
        }
      }
    }
  }
  // Updated log prefix
  console.log(`%c[${new Date().toISOString()}] [baseUtils] Calculated scientists in labs: ${count}`, 'color: cyan;');
  return count;
};
