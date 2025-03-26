// Existing imports...

export interface Base {
  id: string;
  name: string;
  x: number;
  y: number;
  level: number;
  personnel: Personnel[];
  facilities: Facility[];
  power: number;
  powerUsage: number;
  continent: Continent;
  maxSize: number;
  vehicles: Vehicle[];
  radarRange: number;
  radarEffectiveness: number;
  personnelCapacity?: number; // Maximum personnel capacity for this base
}

export interface Personnel {
  id: string;
  name: string;
  role: PersonnelRole;
  skills: PersonnelSkills;
  status: PersonnelStatus;
  experience: number;
  salary: number;
  baseId: string | null;
  assignedFacilityId: string | null;
  assignedVehicleId: string | null;
  vehicleSpecialization?: VehicleSpecialization; // Added for pilots to specialize in vehicle types
  pilotAttributes?: PilotAttributes; // Added specific attributes for pilots
}

export interface PilotAttributes {
  reflexes: number;          // Affects maneuverability and evasion
  stressHandling: number;    // Affects performance under pressure
  combatAwareness: number;   // Affects targeting and combat effectiveness
  technicalAptitude: number; // Affects vehicle handling and maintenance
}

export interface VehicleSpecialization {
  vehicleType: VehicleType;
  proficiency: number;       // 0-100 proficiency level
  flightHours: number;       // Hours of experience with this vehicle type
  trainingLevel: 'basic' | 'advanced' | 'expert';
}

export interface PersonnelSkills {
  combat: number;
  research: number;
  engineering: number;
  leadership: number;
  medical: number;
  piloting: number;
}

export type PersonnelRole = 
  | 'soldier'
  | 'scientist'
  | 'engineer'
  | 'medic'
  | 'commander'
  | 'pilot';

export type PersonnelStatus = 
  | 'available'
  | 'training'
  | 'working'
  | 'injured'
  | 'resting'
  | 'mission';

export interface Vehicle {
  id: string;
  type: VehicleType;
  name: string;
  status: VehicleStatus;
  condition: number;
  crew: Personnel[];
  baseId: string;
  stats: VehicleStats;
}

export interface VehicleStats {
  speed: number;
  armor: number;
  range: number;
  capacity: number;
}

export type VehicleType =
  | 'interceptor'
  | 'transport'
  | 'scout';

export type VehicleStatus =
  | 'ready'
  | 'maintenance'
  | 'mission'
  | 'damaged'
  | 'upgrading';

export interface Facility {
  id: string;
  type: 'research' | 'barracks' | 'hangar' | 'radar' | 'defense' | 'powerPlant';
  level: number;
  personnel: Personnel[];
  powerUsage: number;
  maintenance: number;
  vehicles?: Vehicle[];
  vehicleCapacity?: number;  // Maximum number of vehicles the hangar can hold
  personnelCapacity?: number; // Maximum number of personnel that can be assigned to this facility
  commanderAssigned?: boolean; // Whether a commander is assigned to this barracks
}

export interface FacilityType {
  type: string;
  name: string;
  description: string;
  baseCost: number;
  basePersonnel: number;
  basePowerUsage: number;
  baseMaintenance: number;
  upgradeMultiplier: number;
  size: number;
  vehicleCapacity?: number;
  vehicleCapacityMultiplier?: number;
  personnelCapacity?: number; // Base capacity for personnel
  personnelCapacityMultiplier?: number; // Multiplier for personnel capacity per level
}

export interface UFO {
  id: string;
  type: UFOType;
  name: string;
  size: number;
  speed: number;
  armor: number;
  weapons: number;
  stealthRating: number;
  status: UFOStatus;
  location: {
    x: number;
    y: number;
    altitude: number;
  };
  mission: UFOMission;
  detectedBy: string | null; // Base ID that detected it
  interceptedBy: string | null; // Vehicle ID that's intercepting it
}

export type UFOType = 
  | 'scout'
  | 'fighter'
  | 'transport'
  | 'harvester'
  | 'mothership';

export type UFOStatus =
  | 'approaching'
  | 'detected'
  | 'engaged'
  | 'escaped'
  | 'destroyed'
  | 'landed';

export type UFOMission =
  | 'reconnaissance'
  | 'abduction'
  | 'attack'
  | 'harvest'
  | 'infiltration';

export interface GameState {
  funds: number;
  research: number;
  availablePersonnel: Personnel[];
  bases: Base[];
  date: Date;
  threatLevel: number;
  activeResearchProject: ResearchProject | null;
  completedResearch: ResearchProject[];
  activeUFOs: UFO[];
  detectedUFOs: UFO[];
  interceptedUFOs: UFO[];
  destroyedUFOs: UFO[];
  escapedUFOs: UFO[];
  financials: {
    monthlyIncome: number;
    monthlyExpenses: {
      personnel: number;
      facilities: number;
      research: number;
      other: number;
    };
    projectedBalance: number;
    transactions: Transaction[];
  };
}

export interface Continent {
  id: string;
  name: string;
  coordinates: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  maxBaseSize: number;
  personnelMultiplier: number;
  researchMultiplier: number;
  defenseMultiplier: number;
}

export interface ResearchProject {
  id: string;
  name: string;
  description: string;
  category: ResearchCategory;
  duration: number;
  cost: number;
  progress: number;
  requirements: {
    scientists: number;
    facilities: {
      type: string;
      level: number;
    }[];
    prerequisites: string[];
  };
}

export type ResearchCategory =
  | 'weapons'
  | 'armor'
  | 'aircraft'
  | 'facilities'
  | 'xenobiology'
  | 'psionics';

export interface Transaction {
  id: string;
  date: Date;
  type: 'income' | 'expense';
  category: TransactionCategory;
  amount: number;
  description: string;
}

export type TransactionCategory =
  | 'funding'
  | 'personnel'
  | 'facilities'
  | 'research'
  | 'equipment'
  | 'maintenance'
  | 'other';