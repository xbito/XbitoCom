import { ResearchProject } from '../types';

export const RESEARCH_PROJECTS: ResearchProject[] = [
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
  // Vehicle-specific research projects
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
    id: 'covert-operations',
    name: 'Covert Operations',
    description: 'Special infiltration techniques and equipment for stealthy personnel deployment.',
    cost: 900000,
    duration: 40,
    progress: 0,
    requirements: {
      scientists: 3,
      facilities: [
        { type: 'research', level: 2 },
        { type: 'hangar', level: 2 }
      ],
      prerequisites: ['stealth-systems'],
    },
    benefits: {
      unlocks: ['transport-stealth'],
      bonuses: [
        { type: 'stealth', value: 25 }
      ],
    },
    category: 'operations',
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
  {
    id: 'advanced-sensors',
    name: 'Advanced Sensor Systems',
    description: 'Cutting-edge detection systems for improved UFO tracking and targeting.',
    cost: 750000,
    duration: 35,
    progress: 0,
    requirements: {
      scientists: 3,
      facilities: [
        { type: 'research', level: 2 },
        { type: 'radar', level: 2 }
      ],
      prerequisites: ['advanced-aeronautics'],
    },
    benefits: {
      unlocks: ['advancedRadar'],
      bonuses: [
        { type: 'detection', value: 25 },
        { type: 'range', value: 15 }
      ],
    },
    category: 'detection',
  },
  {
    id: 'inertial-guidance',
    name: 'Inertial Guidance Systems',
    description: 'Self-contained navigation systems that maintain positional accuracy without external references.',
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
      unlocks: ['advancedNavigation'],
      bonuses: [
        { type: 'accuracy', value: 10 },
        { type: 'range', value: 10 }
      ],
    },
    category: 'navigation',
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
  {
    id: 'alien-power-systems',
    name: 'Alien Power Systems',
    description: 'Research into the exotic energy generation used in UFO propulsion and weapons.',
    cost: 1800000,
    duration: 55,
    progress: 0,
    requirements: {
      scientists: 5,
      facilities: [
        { type: 'research', level: 3 },
        { type: 'powerPlant', level: 3 }
      ],
      prerequisites: ['ufo-recovery', 'plasma-containment'],
    },
    benefits: {
      unlocks: ['plasmaCannon'],
      bonuses: [
        { type: 'power', value: 50 },
        { type: 'firepower', value: 30 }
      ],
    },
    category: 'power',
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