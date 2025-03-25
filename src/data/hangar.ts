import { 
  Facility, 
  Vehicle, 
  Personnel, 
  VehicleStatus, 
  Base
} from '../types';
import { FACILITY_TYPES } from './facilities';
import { calculateMaintenanceCost } from './vehicles';

// Type for maintenance queue items
export interface MaintenanceQueueItem {
  vehicleId: string;
  vehicleName: string;
  startTime: Date;
  estimatedCompletionTime: Date;
  progress: number;
  timeRemaining: number;
  repairType: 'routine' | 'damage' | 'overhaul';
}

/**
 * Creates a new hangar facility
 */
export function createHangar(level: number = 1): Facility {
  const hangarType = FACILITY_TYPES.hangar;
  
  return {
    id: crypto.randomUUID(),
    type: 'hangar',
    level,
    personnel: [],
    powerUsage: hangarType.basePowerUsage * level,
    maintenance: hangarType.baseMaintenance * Math.pow(hangarType.upgradeMultiplier, level - 1),
    vehicles: [],
    vehicleCapacity: Math.floor(hangarType.vehicleCapacity! * Math.pow(hangarType.vehicleCapacityMultiplier!, level - 1)),
    maintenanceBays: hangarType.maintenanceBays! * level,
    repairSpeed: hangarType.repairSpeed! * (1 + (level - 1) * 0.2),
    maintenanceQueue: [],
    upgradeLevel: {
      equipmentQuality: 1,
      baySize: 1,
      crewTraining: 1
    }
  };
}

/**
 * Add a vehicle to a hangar
 */
export function addVehicleToHangar(hangar: Facility, vehicle: Vehicle): { success: boolean, message: string, hangar: Facility } {
  if (hangar.type !== 'hangar') {
    return { 
      success: false, 
      message: 'Facility is not a hangar', 
      hangar 
    };
  }

  if (!hangar.vehicles) {
    hangar.vehicles = [];
  }

  // Check if the hangar is at capacity
  if (hangar.vehicles.length >= (hangar.vehicleCapacity || 0)) {
    console.log('Adding vehicle REJECTED: Hangar at maximum capacity');
    return { 
      success: false, 
      message: 'Hangar is at maximum capacity', 
      hangar 
    };
  }

  // Add the vehicle to the hangar
  hangar.vehicles.push(vehicle);
  console.log(`Vehicle added successfully, new count: ${hangar.vehicles.length}`);

  return { 
    success: true, 
    message: `${vehicle.name} added to hangar`, 
    hangar 
  };
}

/**
 * Remove a vehicle from a hangar
 */
export function removeVehicleFromHangar(hangar: Facility, vehicleId: string): { success: boolean, message: string, hangar: Facility, vehicle?: Vehicle } {
  if (hangar.type !== 'hangar') {
    return { success: false, message: 'Facility is not a hangar', hangar };
  }

  if (!hangar.vehicles || hangar.vehicles.length === 0) {
    return { success: false, message: 'Hangar has no vehicles', hangar };
  }

  // Find the vehicle in the hangar
  const vehicleIndex = hangar.vehicles.findIndex(v => v.id === vehicleId);
  
  if (vehicleIndex === -1) {
    return { success: false, message: 'Vehicle not found in hangar', hangar };
  }

  // Check if the vehicle is in maintenance
  if (hangar.vehicles[vehicleIndex].status === 'maintenance') {
    return { success: false, message: 'Vehicle is currently in maintenance', hangar };
  }

  // Remove the vehicle from maintenance queue if it's there
  if (hangar.maintenanceQueue) {
    const queueIndex = hangar.maintenanceQueue.findIndex(item => item.vehicleId === vehicleId);
    if (queueIndex !== -1) {
      hangar.maintenanceQueue.splice(queueIndex, 1);
    }
  }

  // Remove the vehicle from hangar
  const removedVehicle = hangar.vehicles[vehicleIndex];
  hangar.vehicles.splice(vehicleIndex, 1);

  return { 
    success: true, 
    message: `${removedVehicle.name} removed from hangar`, 
    hangar, 
    vehicle: removedVehicle 
  };
}

/**
 * Process vehicle maintenance (to be called periodically, e.g., on daily game update)
 */
export function processVehicleMaintenance(hangar: Facility, currentDate: Date): { 
  hangar: Facility,
  completedMaintenance: Array<{vehicleId: string, improvement: number}>
} {
  const completedMaintenance: Array<{vehicleId: string, improvement: number}> = [];
  
  if (hangar.type !== 'hangar' || !hangar.maintenanceQueue || hangar.maintenanceQueue.length === 0) {
    return { hangar, completedMaintenance };
  }

  // Process each vehicle in maintenance queue
  const remainingQueue = hangar.maintenanceQueue.filter(maintenance => {
    // Check if maintenance is complete
    if (currentDate >= maintenance.estimatedCompletionTime) {
      // Find vehicle and update its condition
      const vehicleIndex = hangar.vehicles?.findIndex(v => v.id === maintenance.vehicleId);
      
      if (vehicleIndex !== undefined && vehicleIndex !== -1 && hangar.vehicles) {
        const vehicle = hangar.vehicles[vehicleIndex];
        
        // Calculate condition improvement
        let conditionImprovement;
        switch(maintenance.repairType) {
          case 'routine':
            conditionImprovement = 15 + Math.floor(Math.random() * 10); // 15-24%
            break;
          case 'damage':
            conditionImprovement = 40 + Math.floor(Math.random() * 20); // 40-59%
            break;
          case 'overhaul':
            conditionImprovement = 70 + Math.floor(Math.random() * 30); // 70-99%
            break;
        }
        
        // Apply hangar quality bonus based on equipment quality
        if (hangar.upgradeLevel?.equipmentQuality) {
          const qualityBonus = (hangar.upgradeLevel.equipmentQuality - 1) * 0.05;
          conditionImprovement = Math.floor(conditionImprovement * (1 + qualityBonus));
        }
        
        // Update vehicle condition
        vehicle.condition = Math.min(100, vehicle.condition + conditionImprovement);
        vehicle.status = 'ready';
        
        // Recalculate maintenance cost
        vehicle.maintenance = calculateMaintenanceCost(vehicle);
        
        // Add to completed maintenance list
        completedMaintenance.push({
          vehicleId: vehicle.id,
          improvement: conditionImprovement
        });
      }
      
      // Remove from maintenance queue
      return false;
    }
    
    // Keep in queue if not complete
    return true;
  });
  
  // Update the maintenance queue
  hangar.maintenanceQueue = remainingQueue;
  
  return { hangar, completedMaintenance };
}

/**
 * Get maintenance status report for a hangar
 */
export function getHangarStatusReport(hangar: Facility): {
  capacity: {
    total: number;
    used: number;
    available: number;
  };
  maintenance: {
    bays: number;
    active: number;
    available: number;
    queue: {
      vehicleId: string;
      vehicleName: string;
      repairType: string;
      progress: number;
      timeRemaining: number; // in hours
    }[];
  };
  vehicles: {
    id: string;
    name: string;
    type: string;
    status: string;
    condition: number;
    crewCount: number;
  }[];
  engineers: number;
} {
  if (hangar.type !== 'hangar') {
    throw new Error('Facility is not a hangar');
  }

  const now = new Date();
  const maintenanceBays = hangar.maintenanceBays || (hangar.level * 2);
  const activeMaintenanceCount = hangar.maintenanceQueue?.length || 0;
  const engineerCount = hangar.personnel?.filter(p => p.role === 'engineer').length || 0;
  
  // Process the maintenance queue to update progress
  const queue = processMaintenanceQueue(hangar);
  
  // DEBUG: Log hangar capacity details
  const totalCapacity = hangar.vehicleCapacity || 0;
  const usedCapacity = hangar.vehicles?.length || 0;
  const availableCapacity = totalCapacity - usedCapacity;

  return {
    capacity: {
      total: totalCapacity,
      used: usedCapacity,
      available: availableCapacity
    },
    maintenance: {
      bays: maintenanceBays,
      active: activeMaintenanceCount,
      available: Math.max(0, maintenanceBays - activeMaintenanceCount),
      queue: queue
    },
    vehicles: (hangar.vehicles || []).map(v => ({
      id: v.id,
      name: v.name,
      type: v.type,
      status: v.status,
      condition: v.condition,
      crewCount: v.crew.length
    })),
    engineers: engineerCount
  };
}

/**
 * Queue a vehicle for maintenance
 */
export function queueVehicleForMaintenance(
  hangar: Facility,
  vehicleId: string,
  repairType: 'routine' | 'damage' | 'overhaul'
): {
  success: boolean;
  message: string;
  hangar: Facility;
} {
  // Check if we have available maintenance bays
  const statusReport = getHangarStatusReport(hangar);
  if (statusReport.maintenance.available <= 0) {
    return {
      success: false,
      message: 'No maintenance bays available',
      hangar,
    };
  }
  
  // Find the vehicle in the base
  const vehicle = hangar.vehicles?.find(v => v.id === vehicleId);
  if (!vehicle) {
    return {
      success: false,
      message: 'Vehicle not found in this hangar',
      hangar,
    };
  }
  
  // Check if vehicle is already in maintenance
  if (vehicle.status === 'maintenance') {
    return {
      success: false,
      message: 'Vehicle is already in maintenance',
      hangar,
    };
  }
  
  // Check if vehicle is on a mission
  if (vehicle.status === 'mission') {
    return {
      success: false,
      message: 'Vehicle is currently on a mission',
      hangar,
    };
  }
  
  // Calculate repair time based on repair type and vehicle condition
  let repairTimeHours;
  switch (repairType) {
    case 'routine':
      repairTimeHours = 12 + (100 - vehicle.condition) * 0.1;
      break;
    case 'damage':
      repairTimeHours = 24 + (100 - vehicle.condition) * 0.4;
      break;
    case 'overhaul':
      repairTimeHours = 72;
      break;
  }
  
  // Engineer efficiency reduces repair time
  const engineerCount = hangar.personnel?.filter(p => p.role === 'engineer').length || 0;
  const engineerEfficiency = 1 - (engineerCount * 0.05);  // Each engineer reduces time by 5%, max 5 engineers (25% reduction)
  repairTimeHours = Math.max(1, repairTimeHours * Math.max(0.75, engineerEfficiency));
  
  // Apply hangar repair speed modifier
  if (hangar.repairSpeed) {
    repairTimeHours = repairTimeHours / hangar.repairSpeed;
  }
  
  // Create start and end times
  const startTime = new Date();
  const estimatedCompletionTime = new Date(startTime.getTime() + repairTimeHours * 60 * 60 * 1000);
  
  // Create maintenance queue item
  const queueItem = {
    vehicleId,
    vehicleName: vehicle.name,
    startTime,
    estimatedCompletionTime,
    repairType,
    progress: 0,
    timeRemaining: repairTimeHours,
  };
  
  // Add to maintenance queue
  const maintenanceQueue = hangar.maintenanceQueue || [];
  
  // Update the vehicle status
  vehicle.status = 'maintenance';
  
  // Update the hangar
  const updatedHangar = {
    ...hangar,
    maintenanceQueue: [...maintenanceQueue, queueItem],
  };
  
  return {
    success: true,
    message: `${vehicle.name} queued for ${repairType} maintenance. Estimated completion time: ${estimatedCompletionTime.toLocaleString()}`,
    hangar: updatedHangar,
  };
}

// Process the maintenance queue and update progress
function processMaintenanceQueue(hangar: Facility): MaintenanceQueueItem[] {
  if (!hangar.maintenanceQueue || hangar.maintenanceQueue.length === 0) return [];
  
  const now = new Date();
  const updatedQueue = hangar.maintenanceQueue.map(item => {
    const startTime = new Date(item.startTime);
    const estimatedCompletionTime = new Date(item.estimatedCompletionTime);
    
    // Calculate elapsed time as a percentage
    const totalRepairTime = estimatedCompletionTime.getTime() - startTime.getTime();
    const elapsedTime = now.getTime() - startTime.getTime();
    const progress = Math.min(100, Math.round((elapsedTime / totalRepairTime) * 100));
    
    // Calculate time remaining in hours
    const timeRemainingMs = Math.max(0, estimatedCompletionTime.getTime() - now.getTime());
    const timeRemaining = timeRemainingMs / (1000 * 60 * 60);
    
    return {
      ...item,
      progress,
      timeRemaining,
    };
  });
  
  return updatedQueue;
}

// Complete maintenance for a vehicle
export function completeVehicleMaintenance(
  hangar: Facility,
  vehicleId: string
): {
  success: boolean;
  message: string;
  hangar: Facility;
  vehicleCondition?: number;
} {
  if (!hangar.maintenanceQueue) {
    return {
      success: false,
      message: 'No maintenance queue found',
      hangar,
    };
  }
  
  // Find the vehicle in the queue
  const maintenanceItem = hangar.maintenanceQueue.find(item => item.vehicleId === vehicleId);
  if (!maintenanceItem) {
    return {
      success: false,
      message: 'Vehicle not found in maintenance queue',
      hangar,
    };
  }
  
  // Remove from the queue
  const updatedQueue = hangar.maintenanceQueue.filter(item => item.vehicleId !== vehicleId);
  
  // Calculate new condition based on repair type
  let newCondition = 100;
  if (maintenanceItem.repairType === 'routine') {
    newCondition = 85;
  } else if (maintenanceItem.repairType === 'damage') {
    newCondition = 95;
  } else if (maintenanceItem.repairType === 'overhaul') {
    newCondition = 100;
  }
  
  // Update hangar
  const updatedHangar = {
    ...hangar,
    maintenanceQueue: updatedQueue,
  };
  
  return {
    success: true,
    message: `Maintenance completed for vehicle ID ${vehicleId}`,
    hangar: updatedHangar,
    vehicleCondition: newCondition,
  };
}

// Check for completed maintenance tasks
export function checkMaintenanceCompletion(
  hangar: Facility
): {
  hangar: Facility;
  completedMaintenanceItems: { vehicleId: string; condition: number }[];
} {
  if (!hangar.maintenanceQueue || hangar.maintenanceQueue.length === 0) {
    return { hangar, completedMaintenanceItems: [] };
  }
  
  const now = new Date();
  const completedItems: { vehicleId: string; condition: number }[] = [];
  const remainingQueue = hangar.maintenanceQueue.filter(item => {
    const isComplete = new Date(item.estimatedCompletionTime) <= now;
    
    if (isComplete) {
      // Calculate new condition based on repair type
      let newCondition = 100;
      if (item.repairType === 'routine') {
        newCondition = 85;
      } else if (item.repairType === 'damage') {
        newCondition = 95;
      } else if (item.repairType === 'overhaul') {
        newCondition = 100;
      }
      
      completedItems.push({
        vehicleId: item.vehicleId,
        condition: newCondition,
      });
      
      return false; // Remove from queue
    }
    
    return true; // Keep in queue
  });
  
  const updatedHangar = {
    ...hangar,
    maintenanceQueue: remainingQueue,
  };
  
  return {
    hangar: updatedHangar,
    completedMaintenanceItems: completedItems,
  };
}

/**
 * Upgrade a specific aspect of the hangar
 */
export function upgradeHangar(
  hangar: Facility, 
  aspect: 'equipmentQuality' | 'baySize' | 'crewTraining' | 'level',
  cost?: number
): { 
  success: boolean; 
  message: string; 
  hangar: Facility;
  cost: number;
} {
  if (hangar.type !== 'hangar') {
    return { success: false, message: 'Facility is not a hangar', hangar, cost: 0 };
  }
  
  // Check if we're upgrading the hangar level
  if (aspect === 'level') {
    const newLevel = hangar.level + 1;
    
    // Calculate upgrade cost if not provided
    if (cost === undefined) {
      const baseCost = 1000000;
      const levelMultiplier = Math.pow(2, newLevel - 1);
      cost = baseCost * levelMultiplier;
    }
    
    // Calculate new capacity and bays
    const newSize = 10 + (newLevel * 5);
    const newMaintenanceBays = newLevel * 2;
    
    // Create upgraded hangar
    const upgradedHangar = {
      ...hangar,
      level: newLevel,
      size: newSize,
      maintenanceBays: newMaintenanceBays,
      vehicleCapacity: Math.floor((hangar.vehicleCapacity || 5) * 1.5)
    };
    
    return {
      success: true,
      message: `Upgraded hangar to level ${newLevel}`,
      hangar: upgradedHangar,
      cost: cost,
    };
  }
  
  // Regular upgrade logic
  // Initialize upgrade levels if not present
  if (!hangar.upgradeLevel) {
    hangar.upgradeLevel = {
      equipmentQuality: 1,
      baySize: 1,
      crewTraining: 1
    };
  }

  // Check if upgrade is already at maximum
  if (hangar.upgradeLevel[aspect] >= 5) {
    return { success: false, message: 'Upgrade is already at maximum level', hangar, cost: 0 };
  }
  
  // Calculate cost if not provided
  if (cost === undefined) {
    const baseUpgradeCost = 250000;
    const currentLevel = hangar.upgradeLevel[aspect];
    cost = baseUpgradeCost * Math.pow(1.5, currentLevel);
  }

  // Apply the upgrade
  hangar.upgradeLevel[aspect]++;
  
  // Apply effects based on the upgrade
  switch (aspect) {
    case 'equipmentQuality':
      // Better equipment means faster repairs
      hangar.repairSpeed = (hangar.repairSpeed || 1) * 1.2;
      break;
      
    case 'baySize':
      // Bigger bays means more capacity
      hangar.vehicleCapacity = Math.floor((hangar.vehicleCapacity || 3) * 1.2);
      break;
      
    case 'crewTraining':
      // Better training means more maintenance bays and efficiency
      if (hangar.upgradeLevel.crewTraining % 2 === 0) {
        hangar.maintenanceBays = (hangar.maintenanceBays || 1) + 1;
      }
      break;
  }

  return { 
    success: true, 
    message: `Hangar ${aspect} upgraded to level ${hangar.upgradeLevel[aspect]}`, 
    hangar,
    cost
  };
}