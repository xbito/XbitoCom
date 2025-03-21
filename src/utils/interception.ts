import { Vehicle, UFO } from '../types';

export interface InterceptionResult {
  success: boolean;
  vehicleDamage: number;
  ufoDamage: number;
  message: string;
}

export function calculateInterception(vehicle: Vehicle, ufo: UFO): InterceptionResult {
  // Calculate combat effectiveness
  const vehicleEffectiveness = calculateVehicleEffectiveness(vehicle);
  const ufoEffectiveness = calculateUFOEffectiveness(ufo);
  
  // Calculate damage
  const vehicleDamage = calculateDamage(ufoEffectiveness, vehicle.stats.armor);
  const ufoDamage = calculateDamage(vehicleEffectiveness, ufo.armor);
  
  // Determine outcome
  const success = ufoDamage > vehicleDamage;
  
  return {
    success,
    vehicleDamage,
    ufoDamage,
    message: generateCombatMessage(success, vehicleDamage, ufoDamage)
  };
}

function calculateVehicleEffectiveness(vehicle: Vehicle): number {
  const speedFactor = vehicle.stats.speed / 100;
  const weaponFactor = vehicle.stats.firepower / 100;
  const crewBonus = calculateCrewBonus(vehicle);
  
  return (speedFactor + weaponFactor) * crewBonus;
}

function calculateUFOEffectiveness(ufo: UFO): number {
  const speedFactor = ufo.speed / 100;
  const weaponFactor = ufo.weapons / 100;
  
  return (speedFactor + weaponFactor);
}

function calculateCrewBonus(vehicle: Vehicle): number {
  // Calculate bonus based on crew experience and skills
  const crewBonus = vehicle.crew.reduce((bonus, crewMember) => {
    return bonus + (crewMember.experience * 0.01) + (crewMember.skills.combat * 0.005);
  }, 1);
  
  return crewBonus;
}

function calculateDamage(attackerEffectiveness: number, defenderArmor: number): number {
  const baseDamage = attackerEffectiveness * 100;
  const damageReduction = defenderArmor / 100;
  
  return Math.floor(baseDamage * (1 - damageReduction));
}

function generateCombatMessage(
  success: boolean,
  vehicleDamage: number,
  ufoDamage: number
): string {
  if (success) {
    if (vehicleDamage < 20) {
      return `Successful interception with minimal damage! UFO severely damaged (${ufoDamage} damage).`;
    } else {
      return `Successful interception but sustained heavy damage (${vehicleDamage} damage). UFO critically damaged (${ufoDamage} damage).`;
    }
  } else {
    if (vehicleDamage >= 80) {
      return `Interception failed! Vehicle critically damaged (${vehicleDamage} damage). UFO escaped with light damage (${ufoDamage} damage).`;
    } else {
      return `Interception unsuccessful. Vehicle damaged (${vehicleDamage} damage). UFO escaped with moderate damage (${ufoDamage} damage).`;
    }
  }
}