# UFO Spawning System: Detailed Implementation Plan

## Overview
This plan outlines the development of a comprehensive UFO spawning and detection System for XbitoCom. Each phase includes UI changes and testable outcomes to ensure progress can be validated.

---

## Phase 1: Radar Detection System

**Goal:** Create a radar system that alerts players to UFO activity.

### Tasks:
- **Implement Radar Coverage Map**
    - [x] Create a map overlay showing circular outlines for radar coverage from player bases. The coverage isn't affected by any conditions, it's plain and standard for any continent.
    - [x] Display using border thickness and color (gradients of blue to indicate strength with the darker sharper blue indicating more strength) as a visual indicators of radar strength based on radar facility level.
    - [x] Implement radar detection range based on facility upgrades, 20% effectiveness bonus per level, with a max of 4 upgrades, that is up to level 5 radar facility.
    - [x] Take into consideration that as the game advances there can be multiple bases in one or more continents and all radar coverages should still be viewable.
    - [x] The world map should have a button to turn off radar coverage display situated in the SidePanel.
    - [x] The Radar coverage display should change any time a Radar facility is added to a base and when a Radar facility is upgraded.
    - [ ] Do not care about UFOs at this moment, this is focused on Radar and coverage.
    - [ ] At this stage Radar facilities do not decay, they "work" even without personnel assigned.
    - [ ] At this stage Radar range and strength is not affected by research, only by the facility level at each base.

**Verification:**  
Radar coverage displays correctly on the map, with clearly shown radar strength and detection range; player can see how radar upgrades affect coverage.

---

## Phase 2: UFO Tracking and Encounter Generation

**Goal:** Design a system to track detected UFOs and generate UFO encounters.

### Tasks:
- **UFO Spawn and Trajectory Generation**
    - [x] Starting from turn 2, each new turn will have a fixed random chance to spawn 1 UFO.
    - [ ] The spawn chance will be based on configurable game parameters (excluding threat level since that mechanism is not defined yet).
    - [x] When a UFO spawns, immediately generate a random trajectory.
    - [x] The trajectory generation must include a runtime check to ensure it is within bounds of the map.
    - [x] The trajectory must cross at least 1 continent. It is a straight line, on any direction as long as it complies with the 1 continent rule.
    - [x] The length of the trajectory is from one border of the map to another, not necessarily the opposite.
    - [x] There is a fixed chance that the UFO's trajectory will intersect with the radar coverage area of one or more bases. The first UFO spawn should cross a radar coverage from a base with a very high chance.
    - [x] If an intersection occurs, detection is automatic and the UFO is flagged for observation.
    - [x] Add flight path visualization for detected UFOs. The trajectory of the UFO is rendered in the map with a Darkish Red line and some shadow.
    - [ ] Create simple animations for UFOs entering or leaving radar coverage. UFOs shouldn't travel that fast.

- **UFO Detection Notifications**
    - [ ] Design a notification panel for new UFO detections.
    - [ ] Add sound effects for UFO detections.
    - [ ] Create toast notifications confirming new detections when a trajectory crosses a radar.
    - [x] Implement a UFO detail panel showing estimated size, speed, and mission type.


**Verification:**  
UI displays UFOs moving across the map with appropriate indicators; alerts appear when new UFOs are detected; player can view UFO details and predicted trajectories.

---

## Phase 3: UFO types

**Goal:** Check the existing UFO types and add new ones as needed

### Tasks:
- **UFO Types Review**
    - [x] Review existing UFO types in the game to ensure they are well-defined and distinct.
    - [x] Ensure each UFO type has unique characteristics (size, speed, armor, weapons, stealth, automated (no alien pilot), crew size (0 if automated)) that affect gameplay.
    - [x] Add new UFO types if necessary to enhance variety and challenge.
    - [x] Do not implement UFO levels but leave the scaffolding for it. Levels will be added later as part of the game progression system. The idea is that a scout at turn 2 will be weaker than a scout at turn 20, but they are still the same type. The level will be a hidden attribute that only affects stats like speed, armor, and damage.
    - [x] Ensure that the new UFO types are integrated into the existing spawning and detection systems, allowing for dynamic gameplay and varied encounters.
    - [x] Beside UFOs only spawning under certain threat levels, they can also affect the threat level of the game. For example, a "Scout" UFO might not increase the threat level, while a "Battleship" or "Mothership" would significantly raise it. This will be implemented in a later phase, but the groundwork should be laid now.
    - [x] Each continent reacts differently to a flyover of a UFO. For example, a "Scout" UFO might cause minor panic or curiosity, while a "Battleship" or "Mothership" would cause widespread panic and unrest. This will be implemented in a later phase, but the groundwork should be laid now. There should be some written lore about each continent and why they may react certain ways to UFOs. For example Nazca lines in South America may mean that UFOs are more connected to their past and they would be more curious and not so panicked by a "Scout" UFO, while in North America, where there are many conspiracy theories about UFOs, a "Battleship" might cause widespread panic and protests. This will be implemented in a later phase, but the groundwork should be laid now.
    - [ ] The game will have an Encyclopedia like "Encarta" or "Wikipedia" for UFOs, where players can view current information about each UFO type that they have encountered. At first the details will be limited, but the more encounters the more details will be revealed. There should be certain lore elements for each UFO type, such as origin, purpose, and conspiracy theories. This will be a living document that evolves as the player progresses through the game. Create the data for this Encyclopedia for each UFO type so we can document their characteristics and lore and use it in the feature later.
    - [x] UFOs will have minimal crew requirements and maximum capacities. For example, a scout requires 1 pilot but it can also carry 1 extra pilot and up to 2 science officers for research purposes. A "Battleship" might have a crew of 10 but can carry up to 20 personnel for boarding parties or special missions. This will be implemented in a later phase, but the groundwork should be laid now. The idea is that the player can capture UFOs and use them for their own purposes, such as boarding parties or special missions. The game will have a "boarding party" mechanic where players can send personnel to board a UFO and capture it. This will be implemented in a later phase, but the groundwork should be laid now.

- **UFO Visualization Review**
    - [ ] Review the current UFO visualizations to ensure they are distinct and visually appealing.
    - [ ] Add shape and color as properties for all UFO types.
    - [ ] Ensure that each UFO type has a unique appearance that matches its characteristics (e.g., size, shape, color).
    - [ ] Add new visual effects if necessary to enhance the appearance of new UFO types.

- **UFO properties revamp**
    - [ ] Ensure that stealth is a hidden attribute of the UFO that affects detection probability. Stealth should be a percentage value that reduces the effective radar range when calculating detection chances. For example, a UFO with 50% stealth will only be detected at half the radar range.
    - [ ] Implement a stealth detection mechanic that allows advanced radar systems or specific research projects to counteract UFO stealth. This means that even if a UFO has stealth, it can still be detected if the radar system is advanced enough or if the player has researched specific technologies.
    - [ ] Add a "jamming" property to certain UFO types that can interfere with radar detection. Jamming should be a percentage value that reduces the effective radar range by a certain amount. For example, a UFO with 30% jamming will reduce the radar range by 30% when calculating detection chances.


**Verification:**
Different UFO types appear with distinct visuals; UFO information panel shows type-specific details; stealth attributes meaningfully affect detection mechanics; players can recognize patterns in UFO behavior.

---


## Phase 4: Integration with Research

**Goal:** Connect research to radar and detection technology.

### Tasks:
- **Research Projects**
    - [ ] Create specific radar-related research projects:
      - [ ] "Advanced Radar Systems" (increased detection range)
      - [ ] "Signal Processing Algorithms" (improved detection probability)
      - [ ] "Stealth Detection Technology" (counter UFO stealth capabilities)
      - [ ] "Multi-band Radar Systems" (detection of special UFO types)
    - [ ] Implement research completion effects on radar performance.
    - [ ] Add research dependency tree for radar technologies.

- **Research Integration**
    - [ ] Connect research progress to radar facility effectiveness.
    - [ ] Implement radar upgrades unlocked by research completion.
    - [ ] Create random events that can boost specific radar research.
    - [ ] Design research report UI for completed radar technologies.
    - [ ] Add research prerequisites for advanced radar capabilities
    - [ ] Implement "breakthrough" mechanics for radar research


**Verification:**  
Research projects visibly improve radar capabilities; tech tree shows clear progression path for radar improvements; random events meaningfully impact research progress.


---

## Phase 5: Integration with Personnel

**Goal:** Connect personnel management to radar operation.

### Tasks:

- **Personnel Management**
    - [ ] Create personnel specializations relevant to radar operation:
        - [ ] **Radar Technicians**: Improve maintenance and reliability.
        - [ ] **Signal Analysts**: Improve detection probability.
        - [ ] **Electronic Warfare Specialists**: Counter UFO jamming.
    - [ ] Implement personnel assignment to radar facilities.
    - [ ] Add a skill progression system for radar personnel.
    - [ ] Create training programs to improve personnel radar skills.

- **Personnel Effects**
    - [ ] Implement performance bonuses from skilled personnel.
    - [ ] Add special abilities for high-ranking radar staff (e.g., once-per-turn abilities, auto-triggered).
    - [ ] Create synergy bonuses for complementary skill sets.
    - [ ] Design a UI for viewing personnel contributions to radar performance.
    - [ ] Add random events related to radar personnel (e.g., breakthroughs, mistakes, sickness, personal life).

- **Career Progression**
    - [ ] Create a promotion path for radar specialists.
    - [ ] Implement skill specialization trees for radar personnel.
    - [ ] Add an achievement/medal system for exceptional radar performance.

**Verification:**  
Personnel assignments visibly affect radar performance; skilled staff provide meaningful bonuses; personnel management feels consequential to gameplay.

---

## Testing Strategy

- [ ] **Visual Testing:** Each UI component should be manually verified for appearance and responsiveness.
- [ ] **Functional Testing:** Create automated tests for game mechanics (detection probability, combat calculations).
- [ ] **Integration Testing:** Verify that combat outcomes correctly affect research, resources, and progression.
- [ ] **User Testing:** Create test scenarios for common interception situations to evaluate balance and fun factor.

This plan provides a roadmap for implementing a complete UFO Interception System with clear, testable deliverables at each stage.