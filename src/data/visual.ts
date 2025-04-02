export const UFO_SHAPES = [
  'triangle',
  'diamond',
  'rectangle',
  'hexagon',
  'circle',
  'pentagon',
  'octagon'
] as const;

export type UFOShape = typeof UFO_SHAPES[number];

// Color palette following a sci-fi theme
export const UFO_COLORS = {
  // Scout/Recon colors
  SCOUT_BLUE: '#66B2FF',
  
  // Combat/Attack colors
  FIGHTER_RED: '#FF4444',
  
  // Transport/Utility colors
  TRANSPORT_GRAY: '#808080',
  
  // Special purpose colors
  SCIENCE_GREEN: '#00FF88',
  BUILDER_ORANGE: '#FF8800',
  
  // High-threat colors
  HARVESTER_PURPLE: '#8844FF',
  MOTHERSHIP_GOLD: '#FFD700'
} as const;

export type UFOColor = typeof UFO_COLORS[keyof typeof UFO_COLORS];

// Validation functions
export function isValidUFOShape(shape: string): shape is UFOShape {
  return UFO_SHAPES.includes(shape as UFOShape);
}

export function isValidUFOColor(color: string): color is UFOColor {
  return Object.values(UFO_COLORS).includes(color as UFOColor);
}