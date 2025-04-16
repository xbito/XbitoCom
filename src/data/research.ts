import { ResearchProject } from '../types';

// Weapons category
export const RESEARCH_PROJECTS_WEAPONS: ResearchProject[] = [
  {
    id: 'laser-weapons',
    name: 'Laser Weapons',
    description: 'Advanced energy-based weapons that use concentrated light to deal damage.',
    cost: 500000,
    duration: 30,
    progress: 0,
    requirements: {
      scientists: 3,
      facilities: [
        { type: 'research', level: 2 }
      ],
      prerequisites: [],
    },
    benefits: {
      unlocks: ['laser-rifle', 'laser-pistol'],
      bonuses: [
        { type: 'combat', value: 15 }
      ],
    },
    category: 'weapons',
  },
  {
    id: 'plasma-containment',
    name: 'Plasma Containment',
    description: 'Research into containing and harnessing plasma energy for weapons and power generation.',
    cost: 750000,
    duration: 45,
    progress: 0,
    requirements: {
      scientists: 4,
      facilities: [
        { type: 'research', level: 3 },
        { type: 'powerPlant', level: 2 }
      ],
      prerequisites: ['laser-weapons'],
    },
    benefits: {
      unlocks: ['plasma-rifle', 'plasma-generator'],
      bonuses: [
        { type: 'combat', value: 25 },
        { type: 'power', value: 30 }
      ],
    },
    category: 'weapons',
  },
  {
    id: 'advanced-weapons-systems',
    name: 'Advanced Weapons Systems',
    description: 'Heavy weapon mounting platforms and fire control systems for interceptors.',
    cost: 800000,
    duration: 30,
    progress: 0,
    requirements: {
      scientists: 3,
      facilities: [
        { type: 'research', level: 2 },
        { type: 'hangar', level: 2 }
      ],
      prerequisites: ['advanced-aeronautics'],
    },
    benefits: {
      unlocks: ['interceptor-heavy', 'amraamMissile'],
      bonuses: [
        { type: 'firepower', value: 20 }
      ],
    },
    category: 'weapons',
  },
  {
    id: 'directed-energy-weapons',
    name: 'Directed Energy Weapons',
    description: 'Harness concentrated energy beams for devastating aerial combat efficiency.',
    cost: 1500000,
    duration: 45,
    progress: 0,
    requirements: {
      scientists: 4,
      facilities: [
        { type: 'research', level: 3 },
        { type: 'hangar', level: 2 },
        { type: 'powerPlant', level: 3 }
      ],
      prerequisites: ['laser-weapons', 'advanced-aeronautics'],
    },
    benefits: {
      unlocks: ['interceptor-beam', 'laserWeapon'],
      bonuses: [
        { type: 'firepower', value: 25 },
        { type: 'accuracy', value: 15 }
      ],
    },
    category: 'weapons',
  },
  {
    id: 'precision-munitions',
    name: 'Precision Munitions',
    description: 'Highly accurate weapon systems optimized for surgical strikes.',
    cost: 700000,
    duration: 30,
    progress: 0,
    requirements: {
      scientists: 2,
      facilities: [
        { type: 'research', level: 2 }
      ],
      prerequisites: ['advanced-weapons-systems'],
    },
    benefits: {
      unlocks: ['jdamBomb'],
      bonuses: [
        { type: 'accuracy', value: 25 }
      ],
    },
    category: 'weapons',
  },
];

// Armor category
export const RESEARCH_PROJECTS_ARMOR: ResearchProject[] = [
  {
    id: 'advanced-materials',
    name: 'Advanced Materials',
    description: 'Study of alien alloys and composite materials for improved armor and construction.',
    cost: 400000,
    duration: 25,
    progress: 0,
    requirements: {
      scientists: 2,
      facilities: [
        { type: 'research', level: 1 }
      ],
      prerequisites: [],
    },
    benefits: {
      unlocks: ['alien-alloy-armor', 'reinforced-facilities'],
      bonuses: [
        { type: 'defense', value: 20 }
      ],
    },
    category: 'armor',
  },
  {
    id: 'alien-materials',
    name: 'Alien Materials Analysis',
    description: 'Study of exotic alien alloys and composites for revolutionary applications.',
    cost: 1200000,
    duration: 45,
    progress: 0,
    requirements: {
      scientists: 4,
      facilities: [
        { type: 'research', level: 3 }
      ],
      prerequisites: ['advanced-materials', 'ufo-recovery'],
    },
    benefits: {
      unlocks: ['alienAlloyArmor'],
      bonuses: [
        { type: 'armor', value: 40 }
      ],
    },
    category: 'materials',
  },
];

// Aircraft category
export const RESEARCH_PROJECTS_AIRCRAFT: ResearchProject[] = [
  {
    id: 'advanced-aeronautics',
    name: 'Advanced Aeronautics',
    description: 'Improved aircraft systems for better performance in high-stress situations.',
    cost: 800000,
    duration: 30,
    progress: 0,
    requirements: {
      scientists: 3,
      facilities: [
        { type: 'research', level: 2 },
        { type: 'hangar', level: 1 }
      ],
      prerequisites: [],
    },
    benefits: {
      unlocks: ['improved-engines', 'advanced-avionics'],
      bonuses: [
        { type: 'speed', value: 20 },
        { type: 'range', value: 15 }
      ],
    },
    category: 'aircraft',
  },
  {
    id: 'advanced-propulsion',
    name: 'Advanced Propulsion Systems',
    description: 'Research into high-efficiency turbofan engines and thrust vectoring for improved vehicle performance.',
    cost: 600000,
    duration: 25,
    progress: 0,
    requirements: {
      scientists: 3,
      facilities: [
        { type: 'research', level: 2 },
        { type: 'hangar', level: 1 }
      ],
      prerequisites: ['advanced-aeronautics'],
    },
    benefits: {
      unlocks: ['advancedEngine'],
      bonuses: [
        { type: 'speed', value: 15 },
        { type: 'range', value: 10 }
      ],
    },
    category: 'aircraft',
  },
  {
    id: 'drone-technology',
    name: 'Drone Technology',
    description: 'Remote-operated aerial vehicles for reconnaissance and combat support.',
    cost: 850000,
    duration: 35,
    progress: 0,
    requirements: {
      scientists: 3,
      facilities: [
        { type: 'research', level: 2 },
        { type: 'hangar', level: 1 }
      ],
      prerequisites: ['advanced-aeronautics'],
    },
    benefits: {
      unlocks: ['scout-recon', 'scout-strike'],
      bonuses: [
        { type: 'range', value: 20 }
      ],
    },
    category: 'aircraft',
  },
  {
    id: 'heavy-transport-systems',
    name: 'Heavy Transport Systems',
    description: 'Enhanced cargo capacity and troop deployment systems for transport aircraft.',
    cost: 700000,
    duration: 35,
    progress: 0,
    requirements: {
      scientists: 2,
      facilities: [
        { type: 'research', level: 2 },
        { type: 'hangar', level: 2 }
      ],
      prerequisites: ['advanced-aeronautics'],
    },
    benefits: {
      unlocks: ['transport-heavy', 'expandedCargo'],
      bonuses: [
        { type: 'capacity', value: 30 }
      ],
    },
    category: 'aircraft',
  },
  {
    id: 'stealth-systems',
    name: 'Stealth Systems',
    description: 'Advanced stealth technology for avoiding UFO detection.',
    cost: 1200000,
    duration: 45,
    progress: 0,
    requirements: {
      scientists: 4,
      facilities: [
        { type: 'research', level: 3 },
        { type: 'hangar', level: 2 }
      ],
      prerequisites: ['advanced-aeronautics'],
    },
    benefits: {
      unlocks: ['scout-aircraft', 'stealth-coating'],
      bonuses: [
        { type: 'stealth', value: 30 }
      ],
    },
    category: 'aircraft',
  },
  {
    id: 'scramjet-technology',
    name: 'Scramjet Technology',
    description: 'Revolutionary hypersonic propulsion system for extreme speeds.',
    cost: 2000000,
    duration: 50,
    progress: 0,
    requirements: {
      scientists: 5,
      facilities: [
        { type: 'research', level: 4 },
        { type: 'hangar', level: 3 }
      ],
      prerequisites: ['advanced-propulsion', 'advanced-materials'],
    },
    benefits: {
      unlocks: ['scout-hypersonic', 'hypersonicEngine'],
      bonuses: [
        { type: 'speed', value: 50 }
      ],
    },
    category: 'aircraft',
  },
];

// Facilities category
export const RESEARCH_PROJECTS_FACILITIES: ResearchProject[] = [
  {
    id: 'ufo-recovery',
    name: 'UFO Recovery Systems',
    description: 'Specialized equipment for safely recovering and transporting alien artifacts.',
    cost: 1000000,
    duration: 40,
    progress: 0,
    requirements: {
      scientists: 3,
      facilities: [
        { type: 'research', level: 2 },
        { type: 'hangar', level: 2 }
      ],
      prerequisites: ['advanced-materials'],
    },
    benefits: {
      unlocks: ['recovery-vehicle', 'containment-field'],
      bonuses: [
        { type: 'recovery', value: 25 }
      ],
    },
    category: 'facilities',
  },
  {
    id: 'vehicle-maintenance-optimization',
    name: 'Vehicle Maintenance Optimization',
    description: 'Advanced maintenance techniques and materials to reduce aircraft operating costs.',
    cost: 350000,
    duration: 20,
    progress: 0,
    requirements: {
      scientists: 2,
      facilities: [
        { type: 'hangar', level: 2 }
      ],
      prerequisites: ['advanced-aeronautics'],
    },
    benefits: {
      unlocks: [],
      bonuses: [
        { type: 'maintenance', value: -25 } // 25% reduction in maintenance costs
      ],
    },
    category: 'logistics',
  },
];

// Xenobiology category
export const RESEARCH_PROJECTS_XENOBIOLOGY: ResearchProject[] = [
  {
    id: 'alien-biology',
    name: 'Alien Biology',
    description: 'Study of alien physiology and biological systems.',
    cost: 600000,
    duration: 35,
    progress: 0,
    requirements: {
      scientists: 3,
      facilities: [
        { type: 'research', level: 2 }
      ],
      prerequisites: [],
    },
    benefits: {
      unlocks: ['med-kit-plus', 'stasis-chamber'],
      bonuses: [
        { type: 'research', value: 20 }
      ],
    },
    category: 'xenobiology',
  },
  {
    id: 'field-medicine',
    name: 'Advanced Field Medicine',
    description: 'Mobile medical facilities and trauma response protocols for combat situations.',
    cost: 500000,
    duration: 30,
    progress: 0,
    requirements: {
      scientists: 2,
      facilities: [
        { type: 'research', level: 2 }
      ],
      prerequisites: ['alien-biology'],
    },
    benefits: {
      unlocks: ['transport-medical', 'advancedMedical'],
      bonuses: [
        { type: 'recovery', value: 30 }
      ],
    },
    category: 'medical',
  },
];

// Radar category (detailed projects)
export const RESEARCH_PROJECTS_RADAR: ResearchProject[] = [
  {
    id: 'advanced-radar-system',
    name: 'Advanced Radar System',
    description: 'Upgrades radar hardware for increased coverage. Increases radar coverage by 10%.',
    cost: 150000,
    duration: 1,
    progress: 0,
    requirements: {
      scientists: 1,
      facilities: [
        { type: 'research', level: 1 },
        { type: 'radar', level: 1 }
      ],
      prerequisites: [],
    },
    benefits: {
      unlocks: ['radar-coverage-10'],
      bonuses: [
        { type: 'coverage', value: 10 }
      ],
    },
    category: 'radar',
  },
  {
    id: 'signal-processing-algorithm',
    name: 'Signal Processing Algorithm',
    description: 'Improves radar signal processing for greater coverage. Increases radar coverage by 10%.',
    cost: 200000,
    duration: 2,
    progress: 0,
    requirements: {
      scientists: 2,
      facilities: [
        { type: 'research', level: 1 },
        { type: 'radar', level: 1 }
      ],
      prerequisites: ['advanced-radar-system'],
    },
    benefits: {
      unlocks: ['radar-coverage-20'],
      bonuses: [
        { type: 'coverage', value: 10 }
      ],
    },
    category: 'radar',
  },
  {
    id: 'ufo-detection-technology',
    name: 'UFO Detection Technology',
    description: 'Specialized technology for detecting unidentified flying objects. Increases radar coverage by 10%.',
    cost: 250000,
    duration: 3,
    progress: 0,
    requirements: {
      scientists: 2,
      facilities: [
        { type: 'research', level: 1 },
        { type: 'radar', level: 1 }
      ],
      prerequisites: ['signal-processing-algorithm'],
    },
    benefits: {
      unlocks: ['radar-coverage-30'],
      bonuses: [
        { type: 'coverage', value: 10 }
      ],
    },
    category: 'radar',
  },
  {
    id: 'multi-band-radar-systems',
    name: 'Multi-band Radar Systems',
    description: 'Integrates multiple frequency bands for maximum radar coverage. Increases radar coverage by 10%.',
    cost: 300000,
    duration: 4,
    progress: 0,
    requirements: {
      scientists: 2,
      facilities: [
        { type: 'research', level: 1 },
        { type: 'radar', level: 1 }
      ],
      prerequisites: ['ufo-detection-technology'],
    },
    benefits: {
      unlocks: ['radar-coverage-40'],
      bonuses: [
        { type: 'coverage', value: 10 }
      ],
    },
    category: 'radar',
  },
];

// Combine all categories into a single array
export const RESEARCH_PROJECTS: ResearchProject[] = [
  ...RESEARCH_PROJECTS_WEAPONS,
  ...RESEARCH_PROJECTS_ARMOR,
  ...RESEARCH_PROJECTS_AIRCRAFT,
  ...RESEARCH_PROJECTS_FACILITIES,
  ...RESEARCH_PROJECTS_XENOBIOLOGY,
  ...RESEARCH_PROJECTS_RADAR,
];