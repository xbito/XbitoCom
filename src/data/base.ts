import { Base } from '../types';
import { upgradeFacility } from './facilities';

export function upgradeBaseWithFacility(
  base: Base,
  facilityId: string
): { success: boolean; message: string; base: Base; cost: number } {
  try {
    const facility = base.facilities.find(f => f.id === facilityId);
    if (!facility) {
      return { 
        success: false, 
        message: 'Facility not found',
        base,
        cost: 0
      };
    }

    // Use the centralized upgradeFacility function
    const result = upgradeFacility(facility);
    if (!result.success) {
      return {
        success: false,
        message: result.message,
        base,
        cost: 0
      };
    }

    // Create new base with updated facility
    const newBase = {
      ...base,
      facilities: base.facilities.map(f => 
        f.id === facilityId ? result.facility : f
      )
    };

    // Update base properties if needed (e.g. radar properties)
    if (result.baseProperties) {
      Object.assign(newBase, result.baseProperties);
    }

    return {
      success: true,
      message: result.message,
      base: newBase,
      cost: result.cost
    };
  } catch (error) {
    console.error('[Base Upgrade] Error upgrading facility:', error, {
      baseId: base.id,
      facilityId,
      currentState: base.facilities.find(f => f.id === facilityId)
    });
    return {
      success: false,
      message: 'An error occurred while upgrading the facility',
      base,
      cost: 0
    };
  }
}