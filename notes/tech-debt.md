# Tech Debt Notes

## Radar detection logic duplication

The codebase currently has *two* overlapping approaches for radar detection:

- [src/utils/detection.ts](../src/utils/detection.ts): `checkRadarDetection(ufo, base)` computes a probabilistic detection outcome based on distance, base effectiveness, radar level bonus, and UFO stealth.
- [src/utils/trajectory.ts](../src/utils/trajectory.ts): `doesTrajectoryIntersectRadar(trajectory, base)` is a deterministic geometric intersection check (sampled along the path) and is what [src/App.tsx](../src/App.tsx) currently uses to move UFOs into `detectedUFOs`.

This duplication is already causing divergence:
- App logic ignores UFO stealth and radar effectiveness when detecting.
- `checkRadarDetection` is unused in the main loop.

Suggested cleanup (when we have time):
1. Pick a single detection model (deterministic vs probabilistic) and make App’s detection use it.
2. If we want both: split responsibilities explicitly:
   - Geometry: “is within coverage” (`trajectory` intersection)
   - Probability: “does radar actually detect” (`detection` probability)
   Then call them in sequence.
3. Add one small integration test or debug overlay that verifies both models are producing expected results for a known scenario.
