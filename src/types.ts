import { UFOShape, UFOColor } from './data/visual';

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
  maxSize: number; // Maximum land usage in facility spaces
  vehicles: Vehicle[];
  radarRange: number;
  radarEffectiveness: number;
  personnelCapacity?: number; // Total barracks capacity for housing personnel
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
  specialAbilities?: BattleCard[];  // Special crew cards unlocked by experience
  battleStats?: PersonnelBattleStats;
  statusEffects?: {
    morale: number;     // Affects overall performance and card effectiveness (0-100)
    fatigue: number;    // Reduces energy generation and command points (0-100)
  };
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
  battleStats?: VehicleBattleStats;
  activeBattleEffects?: BattleEffect[];
  equippedCards?: BattleCard[];
}

export interface VehicleStats {
  speed: number;
  armor: number;
  range: number;
  capacity: number;
  firepower: number;
  energyGeneration: number;  // Energy generated per turn in battle
  cardSlots: number;        // Number of action cards that can be equipped
  equipmentSlots: number;   // Number of equipment cards that can be equipped
}

export interface VehicleBattleStats {
  maxHealth: number;
  currentHealth: number;
  energyPerTurn: number;
  maxEnergy: number;
  currentEnergy: number;
  accuracy: number;
  evasion: number;
  criticalChance: number;
  cardSlots: number;
  equipmentSlots: number;
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
  basePersonnel: number; // Staff required to operate the facility
  basePowerUsage: number;
  baseMaintenance: number;
  upgradeMultiplier: number;
  size: number; // Land usage in facility spaces
  personnelCapacity?: number; // For barracks: housing capacity
  personnelCapacityMultiplier?: number;
  vehicleCapacity?: number;
  vehicleCapacityMultiplier?: number;
  baseRadarRange?: number; // Base radar detection range in km
  baseEffectiveness?: number; // Base radar effectiveness multiplier
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Trajectory {
  start: Point2D;
  end: Point2D;
  progress: number;
  currentPosition: Point2D;
  crossedContinents?: string[]; // List of continent IDs that the trajectory crosses
}

export interface BattleCard {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  effects: CardEffect[];
  requirements?: CardRequirement[];
  cooldown?: number;
  rarity: CardRarity;
  imageUrl?: string;
}

export type CardType = 'action' | 'equipment' | 'crew' | 'environmental' | 'ufo_response';
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface CardEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'special';
  target: 'self' | 'enemy' | 'both' | 'all';
  value: number | string;
  duration?: number;
}

export interface CardRequirement {
  type: 'skill' | 'equipment' | 'research' | 'status';
  value: number | string;
  operator: '>' | '>=' | '=' | '<=' | '<';
}

export interface UFOBehaviorCard extends BattleCard {
  aiConditions: {
    triggerOn: 'health' | 'energy' | 'turn' | 'status';
    threshold: number;
    comparison: '>' | '>=' | '=' | '<=' | '<';
  }[];
}

export interface UFOBattleStats {
  maxHealth: number;
  currentHealth: number;
  energyPerTurn: number;
  maxEnergy: number;
  currentEnergy: number;
  accuracy: number;
  evasion: number;
  criticalChance: number;
  behaviorDeck: UFOBehaviorCard[];
  threatLevel: number;
}

export interface UFOTypeDefinition {
  name: string;
  description: string;
  size: number;
  baseSpeed: number;
  baseArmor: number;
  baseWeapons: number;
  baseStealth: number;
  threatLevel: number;
  automated: boolean;
  crewRequirements?: UFOCrewRequirements;
  shape: UFOShape;
  color: UFOColor;
  battleStats: UFOBattleStats;
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
  detectedBy: string | null; // Base ID that detected it
  interceptedBy: string | null; // Vehicle ID that's intercepting it
  trajectory?: Trajectory;
  isFirstSpawn?: boolean; // Flag for first UFO spawn special handling
  progressPerTurn: number; // How much the UFO moves along its trajectory each turn
  automated: boolean;
  crewRequirements?: UFOCrewRequirements;
  shape: UFOShape;
  color: UFOColor;
  battleStats?: UFOBattleStats;
  activeBattleEffects?: BattleEffect[];
  currentBehaviorCard?: UFOBehaviorCard;
}

export type UFOType = 
  | 'scout'
  | 'fighter'
  | 'transport'
  | 'harvester'
  | 'mothership'
  | 'science'
  | 'builder';

export type UFOStatus =
  | 'approaching'
  | 'detected'
  | 'engaged'
  | 'escaped'
  | 'destroyed'
  | 'landed';

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
  showRadarCoverage: boolean;
  showAllUFOTrajectories?: boolean;
  forceUFOSpawn?: boolean;
  debugPanelVisible?: boolean;
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
  loreId: string;
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
  benefits: {
    unlocks: string[];
    bonuses: { type: string; value: number }[];
  };
}

export type ResearchCategory =
  | 'weapons'
  | 'armor'
  | 'aircraft'
  | 'facilities'
  | 'xenobiology'
  | 'psionics'
  | 'operations'
  | 'medical'
  | 'detection'
  | 'navigation'
  | 'materials'
  | 'power'
  | 'logistics'
  | 'radar';

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

export interface UFOCrewRequirements {
  // Minimum required crew
  pilots?: number;
  engineers?: number;
  scientists?: number;
  // Maximum capacity per role
  maxPilots?: number;
  maxEngineers?: number;
  maxScientists?: number;
  maxSoldiers?: number; // For boarding parties
  // Total crew capacity
  totalCapacity?: number;
}

export interface ContinentSelection {
  continent: Continent;
  clickX: number; // SVG coordinate X where user clicked
  clickY: number; // SVG coordinate Y where user clicked
}

export interface BattleEffect {
  id: string;
  name: string;
  type: 'buff' | 'debuff' | 'damage_over_time' | 'heal_over_time';
  value: number;
  duration: number;
  source: string;
  description: string;
}

export type BattleStage = 'approach' | 'engagement' | 'pursuit' | 'recovery' | 'aftermath';

export interface BattleState {
  id: string;
  stage: BattleStage;
  turn: number;
  initiative: {
    current: string;  // ID of current actor
    order: string[];  // IDs in initiative order
  };
  playerEnergy: number;
  enemyEnergy: number;
  playerHand: BattleCard[];
  playerDeck: BattleCard[];
  playerDiscard: BattleCard[];
  activeEffects: BattleEffect[];
  vehicleStatus: VehicleBattleStats;
  ufoStatus: UFOBattleStats;
  stageObjectives: ObjectiveStatus[];
  environmentalConditions: BattleCard[];
  battleLog: BattleLogEntry[];
}

export interface ObjectiveStatus {
  id: string;
  type: 'primary' | 'secondary' | 'bonus';
  description: string;
  completed: boolean;
  progress?: number;
  maxProgress?: number;
  rewards?: {
    type: 'research' | 'funds' | 'equipment' | 'intel';
    value: number;
  }[];
}

export interface BattleLogEntry {
  turn: number;
  stage: BattleStage;
  actorId: string;
  actionType: 'card' | 'effect' | 'status' | 'objective';
  description: string;
  timestamp: Date;
}

export interface PersonnelBattleStats {
  // Core battle capabilities
  commandPoints: number;      // Special resource for crew abilities
  maxCommandPoints: number;   // Maximum command points available
  initiative: number;        // Affects card play order
  
  // Card-related stats
  cardDrawBonus: number;     // Additional cards drawn per turn
  energyGeneration: number;  // Extra energy provided to vehicle
  
  // Combat effectiveness
  accuracyBonus: number;     // Improves vehicle's accuracy
  criticalBonus: number;     // Improves critical hit chance
  evasionBonus: number;      // Improves vehicle's evasion
  
  // Special abilities
  specialtyBonus: number;    // Role-specific combat bonus
  leadershipBonus: number;   // Affects whole crew performance
}