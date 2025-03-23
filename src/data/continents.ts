import { Continent } from '../types';

export const CONTINENTS: Record<string, Continent> = {
  northAmerica: {
    id: 'northAmerica',
    name: 'North America',
    maxBaseSize: 10,
    personnelMultiplier: 1.0,
    researchMultiplier: 1.0,
    defenseMultiplier: 1.3,
    coordinates: {
      x1: 15,
      y1: 10,
      x2: 35,
      y2: 44,
    },
  },
  southAmerica: {
    id: 'southAmerica',
    name: 'South America',
    maxBaseSize: 8,
    personnelMultiplier: 1.2,
    researchMultiplier: 1.0,
    defenseMultiplier: 1.0,
    coordinates: {
      x1: 20,
      y1: 46,
      x2: 32,
      y2: 84,
    },
  },
  europe: {
    id: 'europe',
    name: 'Europe',
    maxBaseSize: 7,
    personnelMultiplier: 1.0,
    researchMultiplier: 1.5,
    defenseMultiplier: 1.0,
    coordinates: {
      x1: 45,
      y1: 16,
      x2: 58,
      y2: 36,
    },
  },
  asia: {
    id: 'asia',
    name: 'Asia',
    maxBaseSize: 12, // This is their advantage: largest base size
    personnelMultiplier: 1.0,
    researchMultiplier: 1.0, 
    defenseMultiplier: 1.2,
    coordinates: {
      x1: 60,
      y1: 10,
      x2: 85,
      y2: 64,
    },
  },
  africa: {
    id: 'africa',
    name: 'Africa',
    maxBaseSize: 9,
    personnelMultiplier: 1.0,
    researchMultiplier: 1.0,
    defenseMultiplier: 1.0, // No specific bonuses, but balanced overall
    coordinates: {
      x1: 45,
      y1: 40,
      x2: 58,
      y2: 70,
    },
  },
  oceania: {
    id: 'oceania',
    name: 'Oceania',
    maxBaseSize: 6,
    personnelMultiplier: 1.0,
    researchMultiplier: 1.3,
    defenseMultiplier: 1.0,
    coordinates: {
      x1: 75,
      y1: 70,
      x2: 87,
      y2: 90,
    },
  },
};