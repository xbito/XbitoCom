import { Base, Facility, Personnel, PersonnelRole } from '../types';
import { validate } from '../utils/validation';

/**
 * Calculate the total personnel capacity of a base
 * @param base The base to calculate capacity for
 * @returns The total personnel capacity
 */
export function calculateBasePersonnelCapacity(base: Base): number {
  validate(base, 'Base must be defined');
  
  // Only barracks contribute to base personnel capacity
  const barracks = base.facilities.filter(f => f.type === 'barracks');
  
  if (barracks.length === 0) {
    return 0; // No barracks means no personnel capacity
  }
  
  // Sum up the capacity of all barracks
  const totalCapacity = barracks.reduce((total, facility) => {
    return total + (facility.personnelCapacity || 0);
  }, 0);
  
  return totalCapacity;
}

/**
 * Calculate the used personnel capacity of a base
 * @param base The base to calculate used capacity for
 * @returns The used personnel capacity
 */
export function calculateUsedPersonnelCapacity(base: Base): number {
  validate(base, 'Base must be defined');
  
  // Count personnel assigned to base and all facilities
  const basePersonnelCount = base.personnel.length;
  
  // Count personnel assigned to facilities
  const facilityPersonnelCount = base.facilities.reduce((count, facility) => {
    return count + facility.personnel.length;
  }, 0);
  
  return basePersonnelCount + facilityPersonnelCount;
}

/**
 * Calculate the available personnel capacity of a base
 * @param base The base to calculate available capacity for
 * @returns The available personnel capacity
 */
export function calculateAvailablePersonnelCapacity(base: Base): number {
  const totalCapacity = calculateBasePersonnelCapacity(base);
  const usedCapacity = calculateUsedPersonnelCapacity(base);
  
  return Math.max(0, totalCapacity - usedCapacity);
}

/**
 * Check if a base has enough available personnel capacity to assign new personnel
 * @param base The base to check
 * @param count The number of personnel to assign
 * @returns True if the base has enough capacity, false otherwise
 */
export function hasAvailablePersonnelCapacity(base: Base, count: number = 1): boolean {
  return calculateAvailablePersonnelCapacity(base) >= count;
}

/**
 * Check if a personnel can be assigned to a facility
 * @param facility The facility to check
 * @param personnel The personnel to assign
 * @returns Object with success status and message
 */
export function canAssignPersonnelToFacility(
  facility: Facility, 
  personnel: Personnel
): { canAssign: boolean; message: string } {
  validate(facility, 'Facility must be defined');
  validate(personnel, 'Personnel must be defined');
  
  // Check if the facility already has this personnel assigned
  if (facility.personnel.some(p => p.id === personnel.id)) {
    return { 
      canAssign: false, 
      message: 'Personnel is already assigned to this facility' 
    };
  }
  
  // Special handling for barracks
  if (facility.type === 'barracks') {
    // Only commanders can be assigned to barracks
    if (personnel.role !== 'commander') {
      return {
        canAssign: false,
        message: 'Only commanders can be assigned to barracks'
      };
    }
    
    // Check if a commander is already assigned
    if (facility.commanderAssigned) {
      return { 
        canAssign: false, 
        message: 'This barracks already has a commander assigned' 
      };
    }
    
    return { canAssign: true, message: 'Commander can be assigned to barracks' };
  }
  
  // For other facilities, check regular personnel capacity
  const currentCount = facility.personnel.length;
  const maxCapacity = facility.personnelCapacity || 0;
  
  if (currentCount >= maxCapacity) {
    return { 
      canAssign: false, 
      message: `Facility has reached its maximum personnel capacity (${maxCapacity})` 
    };
  }
  
  return { canAssign: true, message: 'Personnel can be assigned to this facility' };
}

/**
 * Assign personnel to a facility
 * @param facility The facility to assign personnel to
 * @param personnel The personnel to assign
 * @returns The updated facility
 */
export function assignPersonnelToFacility(
  facility: Facility, 
  personnel: Personnel
): Facility {
  validate(facility, 'Facility must be defined');
  validate(personnel, 'Personnel must be defined');
  
  const { canAssign, message } = canAssignPersonnelToFacility(facility, personnel);
  if (!canAssign) {
    throw new Error(message);
  }
  
  // Make a copy of the personnel with updated assignment
  const updatedPersonnel: Personnel = {
    ...personnel,
    assignedFacilityId: facility.id,
    status: 'working' as const
  };
  
  // Update facility personnel
  const updatedFacility = { ...facility };
  updatedFacility.personnel = [...facility.personnel, updatedPersonnel];
  
  // Special handling for commanders in barracks
  if (facility.type === 'barracks' && personnel.role === 'commander') {
    updatedFacility.commanderAssigned = true;
  }
  
  return updatedFacility;
}

/**
 * Calculate the maximum personnel capacity for a facility based on its type and level
 * @param facility The facility to calculate capacity for
 * @returns The maximum personnel capacity
 */
export function calculateFacilityPersonnelCapacity(facility: Facility): number {
  validate(facility, 'Facility must be defined');
  
  switch (facility.type) {
    case 'barracks':
      // First level barracks gives 15 personnel capacity
      // Each additional level gives 10 more capacity
      return facility.level === 1 ? 15 : 15 + ((facility.level - 1) * 10);
      
    case 'research':
    case 'powerPlant':
    case 'radar':
    case 'defense':
    case 'hangar':
      // For other facilities, capacity depends on their basePersonnel value times level
      const facilityType = facility.type;
      // Assuming we have a constant for basePersonnel values
      const baseCapacity = {
        research: 10,
        powerPlant: 5,
        radar: 3,
        defense: 6,
        hangar: 5 // Changed from 8 to 5 as per requirements
      }[facilityType] || 3;
      
      return baseCapacity * facility.level;
      
    default:
      return 0;
  }
}

/**
 * Check if a base has enough personnel capacity to build a new facility
 * @param base The base to check
 * @returns True if the base has enough capacity for a new facility, false otherwise
 */
export function hasCapacityForNewFacility(base: Base): boolean {
  // To build a facility, at least 1 personnel capacity must be available
  return calculateAvailablePersonnelCapacity(base) >= 1;
}

/**
 * Calculate the commander boost for a facility
 * The commander provides boosts to other personnel in the facility
 * @param facility The facility to check
 * @returns The boost multiplier (1.0 = no boost)
 */
export function calculateCommanderBoost(facility: Facility): number {
  if (facility.type !== 'barracks' || !facility.commanderAssigned) {
    return 1.0; // No boost
  }
  
  // Find the commander in the barracks
  const commander = facility.personnel.find(p => p.role === 'commander');
  if (!commander) {
    return 1.0; // No commander found
  }
  
  // Calculate boost based on commander's leadership skill and experience
  const leadershipBoost = commander.skills.leadership / 100; // 0-1 range
  const experienceBoost = Math.min(commander.experience / 100, 1); // Cap at 1
  
  // Commander provides up to 30% boost (10% from leadership, 10% from experience, 10% base)
  return 1.0 + (0.1 + (leadershipBoost * 0.1) + (experienceBoost * 0.1));
}

/**
 * Get personnel capacity stats for a base
 * @param base The base to get stats for
 * @returns Object containing total, used, and available personnel capacity
 */
export function getBasePersonnelCapacityStats(base: Base): {
  total: number;
  used: number;
  available: number;
  hasCommander: boolean;
} {
  const total = calculateBasePersonnelCapacity(base);
  const used = calculateUsedPersonnelCapacity(base);
  const available = Math.max(0, total - used);
  
  // Check if the base has at least one commander assigned to any barracks
  const hasCommander = base.facilities
    .filter(f => f.type === 'barracks')
    .some(f => f.commanderAssigned);
  
  return {
    total,
    used,
    available,
    hasCommander
  };
}

/**
 * Get all personnel assigned to a specific role in a base
 * @param base The base to check
 * @param role The role to filter by
 * @returns Array of personnel with the specified role
 */
export function getPersonnelByRole(base: Base, role: PersonnelRole): Personnel[] {
  validate(base, 'Base must be defined');
  validate(role, 'Role must be defined');
  
  // Get personnel assigned directly to the base
  const basePersonnel = base.personnel.filter(p => p.role === role);
  
  // Get personnel assigned to facilities
  const facilityPersonnel = base.facilities.flatMap(facility => 
    facility.personnel.filter(p => p.role === role)
  );
  
  return [...basePersonnel, ...facilityPersonnel];
}