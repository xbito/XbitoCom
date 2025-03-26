import { Facility, Vehicle } from '../types';

/**
 * Get status report for a hangar
 */
export function getHangarStatusReport(hangar: Facility): {
  capacity: {
    total: number;
    used: number;
    available: number;
  };
  vehicles: {
    id: string;
    name: string;
    type: string;
    status: string;
    condition: number;
    crewCount: number;
  }[];
} {
  if (hangar.type !== 'hangar') {
    throw new Error('Facility is not a hangar');
  }

  const capacity = {
    total: hangar.vehicleCapacity || 3, // Default capacity of 3
    used: hangar.vehicles?.length || 0,
    available: (hangar.vehicleCapacity || 3) - (hangar.vehicles?.length || 0)
  };

  const vehicles = hangar.vehicles?.map(vehicle => ({
    id: vehicle.id,
    name: vehicle.name,
    type: vehicle.type,
    status: vehicle.status,
    condition: vehicle.condition,
    crewCount: vehicle.crew.length
  })) || [];

  return {
    capacity,
    vehicles
  };
}

/**
 * Add a vehicle to a hangar
 */
export function addVehicleToHangar(
  hangar: Facility, 
  vehicle: Vehicle
): {
  success: boolean;
  message: string;
  hangar: Facility;
} {
  if (hangar.type !== 'hangar') {
    return {
      success: false,
      message: 'Facility is not a hangar',
      hangar
    };
  }

  // Check capacity
  const currentVehicles = hangar.vehicles || [];
  if (currentVehicles.length >= (hangar.vehicleCapacity || 3)) {
    return {
      success: false,
      message: 'Hangar is at maximum capacity',
      hangar
    };
  }

  // Add the vehicle
  const updatedHangar = {
    ...hangar,
    vehicles: [...currentVehicles, vehicle]
  };

  return {
    success: true,
    message: `${vehicle.name} added to hangar`,
    hangar: updatedHangar
  };
}

/**
 * Remove a vehicle from a hangar
 */
export function removeVehicleFromHangar(
  hangar: Facility,
  vehicleId: string
): {
  success: boolean;
  message: string;
  hangar: Facility;
  removedVehicle?: Vehicle;
} {
  if (hangar.type !== 'hangar') {
    return {
      success: false,
      message: 'Facility is not a hangar',
      hangar
    };
  }

  const currentVehicles = hangar.vehicles || [];
  const vehicleIndex = currentVehicles.findIndex(v => v.id === vehicleId);

  if (vehicleIndex === -1) {
    return {
      success: false,
      message: 'Vehicle not found in hangar',
      hangar
    };
  }

  const removedVehicle = currentVehicles[vehicleIndex];
  const updatedVehicles = [...currentVehicles];
  updatedVehicles.splice(vehicleIndex, 1);

  const updatedHangar = {
    ...hangar,
    vehicles: updatedVehicles
  };

  return {
    success: true,
    message: `${removedVehicle.name} removed from hangar`,
    hangar: updatedHangar,
    removedVehicle
  };
}