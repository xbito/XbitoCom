import { Point2D, Trajectory, Base, Continent } from '../types';
import { CONTINENTS } from '../data/continents';

function generatePoint(minX: number = 0, maxX: number = 1000, minY: number = 0, maxY: number = 500): Point2D {
    return {
        x: Math.floor(minX + Math.random() * (maxX - minX)),
        y: Math.floor(minY + Math.random() * (maxY - minY))
    };
}

function doesLineIntersectContinent(start: Point2D, end: Point2D, continent: Continent): boolean {
    // Simple check - if either start or end point is in the continent's bounding box
    const { coordinates } = continent;
    const x1 = Math.min(start.x, end.x);
    const x2 = Math.max(start.x, end.x);
    const y1 = Math.min(start.y, end.y);
    const y2 = Math.max(start.y, end.y);
    
    return !(x2 < coordinates.x1 || x1 > coordinates.x2 || 
             y2 < coordinates.y1 || y1 > coordinates.y2);
}

export function generateTrajectory(bases: Base[], isFirstSpawn: boolean): Trajectory {
    const MAX_ATTEMPTS = 100;
    let attempts = 0;
    
    while (attempts < MAX_ATTEMPTS) {
        attempts++;
        
        // Generate start and end points on the map edges
        const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        let start: Point2D, end: Point2D;
        
        switch (edge) {
            case 0: // Top edge
                start = generatePoint(0, 1000, 0, 0);
                end = generatePoint(0, 1000, 500, 500);
                break;
            case 1: // Right edge
                start = generatePoint(1000, 1000, 0, 500);
                end = generatePoint(0, 0, 0, 500);
                break;
            case 2: // Bottom edge
                start = generatePoint(0, 1000, 500, 500);
                end = generatePoint(0, 1000, 0, 0);
                break;
            default: // Left edge
                start = generatePoint(0, 0, 0, 500);
                end = generatePoint(1000, 1000, 0, 500);
                break;
        }

        // Check if trajectory intersects with at least one continent
        const crossesContinent = Object.values(CONTINENTS).some(continent => 
            doesLineIntersectContinent(start, end, continent)
        );

        if (!crossesContinent) continue;

        // For first spawn, ensure high chance of radar intersection
        if (isFirstSpawn) {
            const intersectsRadar = bases.some(base => doesTrajectoryIntersectRadar({ 
                start, 
                end, 
                progress: 0,
                currentPosition: start
            }, base));
            
            if (!intersectsRadar) continue;
        }

        // Create and return valid trajectory
        return {
            start,
            end,
            progress: 0,
            currentPosition: { ...start },
            crossedContinents: Object.values(CONTINENTS)
                .filter(c => doesLineIntersectContinent(start, end, c))
                .map(c => c.id)
        };
    }

    // Could not generate valid trajectory after max attempts
    throw new Error('Failed to generate valid UFO trajectory after maximum attempts');
}

// Check if a trajectory intersects with a base's radar coverage
export function doesTrajectoryIntersectRadar(trajectory: Trajectory, base: Base): boolean {
    if (!trajectory || !base) return false;

    // Check trajectory endpoints
    if (isPointInRadarRange(trajectory.start, base) || isPointInRadarRange(trajectory.end, base)) {
        return true;
    }

    // Sample points along the trajectory for more accurate detection
    const NUM_SAMPLES = 10;
    for (let i = 1; i < NUM_SAMPLES - 1; i++) {
        const progress = i / NUM_SAMPLES;
        const point = {
            x: trajectory.start.x + (trajectory.end.x - trajectory.start.x) * progress,
            y: trajectory.start.y + (trajectory.end.y - trajectory.start.y) * progress
        };
        
        if (isPointInRadarRange(point, base)) {
            return true;
        }
    }

    return false;
}

// Helper function to check if a point is within a base's radar range
function isPointInRadarRange(point: Point2D, base: Base): boolean {
    const radarFacility = base.facilities.find(f => f.type === 'radar');
    if (!radarFacility) return false;
    
    // Get radar range based on facility level (20% increase per level)
    const radarBonus = radarFacility.level * 0.2;
    const range = base.radarRange * (1 + radarBonus);
    
    // Calculate distance from point to base
    const dx = point.x - base.x;
    const dy = point.y - base.y;
    const distanceSquared = dx * dx + dy * dy;
    
    return distanceSquared <= range * range;
}