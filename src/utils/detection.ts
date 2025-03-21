import { Base, UFO } from '../types';

export function checkRadarDetection(ufo: UFO, base: Base): boolean {
  // Calculate base radar effectiveness
  const baseEffectiveness = base.radarEffectiveness || 1;
  const radarLevel = base.facilities.find(f => f.type === 'radar')?.level || 0;
  const radarBonus = radarLevel * 0.2; // Each radar level adds 20% effectiveness
  
  // Calculate detection chance
  const distance = calculateDistance(
    base.x,
    base.y,
    ufo.location.x,
    ufo.location.y
  );
  
  // Base detection range is 1000km, modified by radar level
  const detectionRange = base.radarRange * (1 + radarBonus);
  
  if (distance > detectionRange) {
    return false;
  }
  
  // Calculate detection probability
  const detectionProbability = calculateDetectionProbability(
    distance,
    detectionRange,
    baseEffectiveness,
    ufo.stealthRating
  );
  
  return Math.random() < detectionProbability;
}

function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function calculateDetectionProbability(
  distance: number,
  range: number,
  effectiveness: number,
  stealthRating: number
): number {
  // Base probability decreases with distance
  const distanceFactor = 1 - (distance / range);
  
  // Stealth rating reduces detection probability
  const stealthFactor = 1 - (stealthRating / 100);
  
  // Calculate final probability
  const probability = distanceFactor * effectiveness * stealthFactor;
  
  // Ensure probability is between 0 and 1
  return Math.max(0, Math.min(1, probability));
}