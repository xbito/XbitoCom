import { 
  Personnel, 
  PersonnelRole, 
  PersonnelSkills,
  VehicleType,
  PilotAttributes,
  VehicleSpecialization 
} from '../types';

export const ROLE_DESCRIPTIONS: Record<PersonnelRole, string> = {
  soldier: 'Combat specialist trained in tactical operations',
  scientist: 'Research expert specializing in alien technology',
  engineer: 'Technical specialist for maintenance and development',
  medic: 'Medical professional for personnel care',
  commander: 'Leadership and strategic operations specialist',
  pilot: 'Expert aircraft pilot trained for special operations',
};

export const BASE_SALARIES: Record<PersonnelRole, number> = {
  soldier: 50000,
  scientist: 75000,
  engineer: 65000,
  medic: 60000,
  commander: 90000,
  pilot: 80000,
};

export const INITIAL_SKILLS: Record<PersonnelRole, PersonnelSkills> = {
  soldier: {
    combat: 50,
    research: 10,
    engineering: 20,
    leadership: 30,
    medical: 20,
    piloting: 10,
  },
  scientist: {
    combat: 10,
    research: 50,
    engineering: 30,
    leadership: 20,
    medical: 20,
    piloting: 10,
  },
  engineer: {
    combat: 15,
    research: 30,
    engineering: 50,
    leadership: 20,
    medical: 15,
    piloting: 20,
  },
  medic: {
    combat: 20,
    research: 30,
    engineering: 20,
    leadership: 25,
    medical: 50,
    piloting: 10,
  },
  commander: {
    combat: 35,
    research: 25,
    engineering: 25,
    leadership: 50,
    medical: 25,
    piloting: 30,
  },
  pilot: {
    combat: 40,
    research: 20,
    engineering: 30,
    leadership: 30,
    medical: 20,
    piloting: 50,
  },
};

export const FIRST_NAMES = [
  'James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia',
  'Alexander', 'Isabella', 'Michael', 'Charlotte', 'Benjamin', 'Amelia',
  'Daniel', 'Harper', 'Lucas', 'Evelyn', 'Henry', 'Abigail'
];

export const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
];

// Generate initial personnel for game start
export const INITIAL_PERSONNEL: Personnel[] = [
  // Commander
  {
    id: '001',
    name: 'Alex Morgan',
    role: 'commander',
    skills: INITIAL_SKILLS.commander,
    status: 'available',
    experience: 100,
    salary: BASE_SALARIES.commander,
    baseId: '1',
    assignedFacilityId: null,
    assignedVehicleId: null,
  },
  // Scientists
  {
    id: '002',
    name: 'Marcus Chen',
    role: 'scientist',
    skills: INITIAL_SKILLS.scientist,
    status: 'available',
    experience: 50,
    salary: BASE_SALARIES.scientist,
    baseId: '1',
    assignedFacilityId: null,
    assignedVehicleId: null,
  },
  {
    id: '003',
    name: 'Sophia Rodriguez',
    role: 'scientist',
    skills: INITIAL_SKILLS.scientist,
    status: 'available',
    experience: 60,
    salary: BASE_SALARIES.scientist,
    baseId: '1',
    assignedFacilityId: null,
    assignedVehicleId: null,
  },
  // Engineers
  {
    id: '004',
    name: 'Daniel Wilson',
    role: 'engineer',
    skills: INITIAL_SKILLS.engineer,
    status: 'available',
    experience: 40,
    salary: BASE_SALARIES.engineer,
    baseId: '1',
    assignedFacilityId: null,
    assignedVehicleId: null,
  },
  {
    id: '005',
    name: 'Emma Taylor',
    role: 'engineer',
    skills: INITIAL_SKILLS.engineer,
    status: 'available',
    experience: 45,
    salary: BASE_SALARIES.engineer,
    baseId: '1',
    assignedFacilityId: null,
    assignedVehicleId: null,
  },
  // Soldiers
  {
    id: '006',
    name: 'Michael Johnson',
    role: 'soldier',
    skills: INITIAL_SKILLS.soldier,
    status: 'available',
    experience: 30,
    salary: BASE_SALARIES.soldier,
    baseId: '1',
    assignedFacilityId: null,
    assignedVehicleId: null,
  },
  {
    id: '007',
    name: 'Sarah Martinez',
    role: 'soldier',
    skills: INITIAL_SKILLS.soldier,
    status: 'available',
    experience: 35,
    salary: BASE_SALARIES.soldier,
    baseId: '1',
    assignedFacilityId: null,
    assignedVehicleId: null,
  },
  // Medic
  {
    id: '008',
    name: 'Thomas Brown',
    role: 'medic',
    skills: INITIAL_SKILLS.medic,
    status: 'available',
    experience: 40,
    salary: BASE_SALARIES.medic,
    baseId: '1',
    assignedFacilityId: null,
    assignedVehicleId: null,
  },
  // Pilot
  {
    id: '009',
    name: 'Olivia Garcia',
    role: 'pilot',
    skills: INITIAL_SKILLS.pilot,
    status: 'available',
    experience: 55,
    salary: BASE_SALARIES.pilot,
    baseId: '1',
    assignedFacilityId: null,
    assignedVehicleId: null,
    pilotAttributes: {
      reflexes: 65,
      stressHandling: 60,
      combatAwareness: 70,
      technicalAptitude: 55
    },
    vehicleSpecialization: {
      vehicleType: 'interceptor',
      proficiency: 65,
      flightHours: 300,
      trainingLevel: 'advanced'
    }
  }
];

export function generatePersonnel(role: PersonnelRole): Personnel {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  
  const personnel: Personnel = {
    id: crypto.randomUUID(),
    name: `${firstName} ${lastName}`,
    role,
    skills: INITIAL_SKILLS[role],
    status: 'available',
    experience: 0,
    salary: BASE_SALARIES[role],
    baseId: null,
    assignedFacilityId: null,
    assignedVehicleId: null,
  };

  // Add pilot-specific attributes if the role is a pilot
  if (role === 'pilot') {
    personnel.pilotAttributes = generatePilotAttributes();
    personnel.vehicleSpecialization = generateInitialSpecialization();
  }

  return personnel;
}

// Generate random pilot attributes with values between 30-70
function generatePilotAttributes(): PilotAttributes {
  return {
    reflexes: 30 + Math.floor(Math.random() * 41),          // 30-70 range
    stressHandling: 30 + Math.floor(Math.random() * 41),    // 30-70 range
    combatAwareness: 30 + Math.floor(Math.random() * 41),   // 30-70 range
    technicalAptitude: 30 + Math.floor(Math.random() * 41), // 30-70 range
  };
}

// Generate initial vehicle specialization
function generateInitialSpecialization(): VehicleSpecialization {
  // Randomly choose one of the vehicle types
  const vehicleTypes: VehicleType[] = ['interceptor', 'transport', 'scout'];
  const randomType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
  
  return {
    vehicleType: randomType,
    proficiency: 30 + Math.floor(Math.random() * 31), // 30-60 range for initial
    flightHours: 50 + Math.floor(Math.random() * 151), // 50-200 range for initial hours
    trainingLevel: 'basic' // All new pilots start with basic training
  };
}

// Function to train pilots in a specific vehicle type
export function trainPilotSpecialization(
  pilot: Personnel, 
  vehicleType: VehicleType, 
  trainingDuration: number
): Personnel {
  if (pilot.role !== 'pilot') {
    throw new Error('Only pilots can receive vehicle specialization training');
  }
  
  // If pilot already has a specialization in this vehicle type, update it
  if (pilot.vehicleSpecialization && pilot.vehicleSpecialization.vehicleType === vehicleType) {
    const currentSpecialization = pilot.vehicleSpecialization;
    
    // Calculate training effects
    const proficiencyGain = Math.min(10, Math.floor(trainingDuration / 7));
    const flightHoursGain = trainingDuration * 8;
    
    // Update specialization
    pilot.vehicleSpecialization = {
      ...currentSpecialization,
      proficiency: Math.min(100, currentSpecialization.proficiency + proficiencyGain),
      flightHours: currentSpecialization.flightHours + flightHoursGain,
      trainingLevel: determineTrainingLevel(currentSpecialization.proficiency + proficiencyGain)
    };
  } else {
    // Create new specialization
    pilot.vehicleSpecialization = {
      vehicleType,
      proficiency: 30 + Math.floor(trainingDuration / 7),
      flightHours: trainingDuration * 8,
      trainingLevel: 'basic'
    };
  }
  
  return pilot;
}

// Helper function to determine training level based on proficiency
function determineTrainingLevel(proficiency: number): 'basic' | 'advanced' | 'expert' {
  if (proficiency >= 85) return 'expert';
  if (proficiency >= 60) return 'advanced';
  return 'basic';
}

// Function to assign a pilot to a vehicle
export function assignPilotToVehicle(pilot: Personnel, vehicleId: string): Personnel {
  if (pilot.role !== 'pilot') {
    throw new Error('Only pilots can be assigned to vehicles');
  }
  
  if (pilot.status !== 'available') {
    throw new Error('Pilot must be available to be assigned to a vehicle');
  }
  
  pilot.assignedVehicleId = vehicleId;
  pilot.status = 'working';
  
  return pilot;
}

// Function to remove a pilot from a vehicle
export function removePilotFromVehicle(pilot: Personnel): Personnel {
  if (pilot.assignedVehicleId === null) {
    return pilot; // Nothing to do if not assigned
  }
  
  pilot.assignedVehicleId = null;
  pilot.status = 'available';
  
  return pilot;
}