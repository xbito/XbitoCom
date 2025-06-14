# UFO Interception System: Card-Based Combat Plan

## Overview
This plan outlines the development of a card-based interception system for XbitoCom, inspired by games like Slay the Spire and Hearthstone. When a UFO is detected, players can initiate an interception that plays out as a multi-stage card battle with strategic depth and meaningful consequences.

---

## Current Game State Analysis

### Existing Systems to Leverage:
- **UFO Detection**: UFOs spawn with trajectories, detected by radar, with various types (scout, fighter, transport, harvester, mothership, science, builder)
- **Aircraft/Vehicles**: Interceptors, transports, scouts with stats (speed, armor, range, capacity, firepower)
- **Personnel System**: Pilots with specializations, experience, skills (combat, piloting), and attributes (reflexes, stress handling, combat awareness)
- **Research System**: Unlocks new weapons, armor, aircraft types, and bonuses
- **Base Management**: Hangars store vehicles, personnel assignments, facility upgrades

### Current Interception Logic:
- Simple effectiveness calculation based on vehicle stats + crew bonuses
- Direct damage calculation with armor reduction
- Binary success/failure outcome

---

## Phase 1: Core Interception Framework

### Game Flow Design

#### 1.1 Interception Initiation
**Trigger Conditions:**
- UFO detected by radar and within interception range of a base
- Player has available aircraft in ready status
- Sufficient crew assigned to the aircraft

**Pre-Battle Setup:**
- Select intercepting aircraft from hangar
- Choose pilot and optional crew members
- Preview UFO threat assessment (if research allows)
- Confirm interception or wait for better opportunity

#### 1.2 Battle Structure
**Multi-Stage Encounters:**
Each interception consists of 3-5 stages depending on UFO type:

1. **Approach Stage** - Navigate to intercept position
2. **Engagement Stage** - Primary combat phase
3. **Pursuit/Escape Stage** - Final decisive moment
4. **Recovery Stage** (optional) - Capture attempts, rescue operations
5. **Aftermath Stage** (optional) - Salvage, intelligence gathering

**Stage Objectives:**
- **Approach**: Avoid detection, minimize fuel consumption, position advantage
- **Engagement**: Deal damage while protecting aircraft
- **Pursuit**: Prevent UFO escape or safely disengage
- **Recovery**: Capture technology, rescue crew, secure wreckage
- **Aftermath**: Maximize intelligence and resource gains

### 1.3 Card System Foundation

#### Card Types:
- **Action Cards**: Direct combat actions (Fire Missiles, Evasive Maneuvers)
- **Equipment Cards**: Weapons and defensive systems unlocked by research
- **Crew Cards**: Special abilities based on pilot skills and experience
- **Environmental Cards**: Situational modifiers (Weather, Terrain, Time of Day)
- **UFO Response Cards**: Alien countermeasures and tactics

#### Core Mechanics:
- **Energy System**: Each turn provides energy to play cards
- **Initiative**: Determines action order (based on aircraft speed + pilot reflexes)
- **Status Effects**: Damage, system failures, morale, stealth
- **Risk/Reward**: High-damage actions may have negative consequences

---

## Phase 2: Card Design and Implementation

### 2.1 Base Card Set

#### Interceptor Action Cards:
```
Fire Missiles
- Cost: 3 Energy
- Effect: Deal 40-60 damage based on weapon systems
- Requirements: Missile weapons equipped
- Risk: Ammunition consumption

Cannon Burst
- Cost: 2 Energy  
- Effect: Deal 25-35 damage, no ammunition cost
- Requirements: Cannon equipped
- Bonus: Can be played multiple times per turn

Evasive Maneuvers
- Cost: 2 Energy
- Effect: +30% dodge chance this turn, +10 stealth
- Requirements: Pilot skill > 50
- Drawback: -1 Energy next turn

Emergency Boost
- Cost: 4 Energy
- Effect: +50% damage next attack, +20 initiative
- Requirements: Advanced engines
- Risk: 10% engine strain damage
```

#### Crew Ability Cards:
```
Veteran's Instinct (Experienced Pilot)
- Cost: 1 Energy
- Effect: Draw 2 cards, +10% accuracy
- Requirement: Pilot experience > 75
- Cooldown: Once per battle

Stress Management (High Stress Handling)
- Cost: 0 Energy
- Effect: Remove negative status effects
- Requirement: Stress Handling > 70
- Passive: Immunity to fear effects

Combat Awareness (High Combat Awareness)
- Cost: 2 Energy
- Effect: Predict next UFO action, +25% critical hit
- Requirement: Combat Awareness > 80
- Duration: Until end of stage
```

#### Research-Unlocked Equipment Cards:
```
Plasma Cannon (Unlocked by Plasma Weapons research)
- Passive Equipment
- Effect: +40% damage, ignores 25% armor
- Drawback: +1 energy cost to all attack actions

Stealth Coating (Unlocked by Stealth Systems research)
- Passive Equipment  
- Effect: Start battle with 50 stealth points
- Bonus: UFO attacks have -30% accuracy until stealth broken

Advanced Targeting (Unlocked by Advanced Avionics research)
- Active Equipment
- Cost: 1 Energy
- Effect: Next attack gains +50% accuracy, +15% crit chance
```

### 2.2 UFO Response System

#### UFO Behavior Cards:
Each UFO type has a unique deck of response cards:

```
Scout UFO Responses:
- Emergency Cloak: +50 stealth, -25% damage taken
- Evasive Pattern: +40% dodge, cannot attack next turn  
- Data Burst: If escapes, increases threat level by 1

Fighter UFO Responses:
- Aggressive Pursuit: +30% damage, +10% crit chance
- Weapon Overcharge: Deal massive damage, 20% self-damage
- Combat Maneuvers: +25% accuracy and dodge

Mothership Responses:
- Deploy Fighters: Summon 2 additional fighter encounters
- Shield Matrix: Absorb next 100 damage
- Devastating Beam: High damage attack that pierces armor
```

### 2.3 Environmental and Situational Cards

```
Weather Conditions:
- Storm Front: -20% accuracy for both sides, +stealth
- Clear Skies: +15% accuracy, -stealth effectiveness
- Night Operations: +stealth bonuses, -visual targeting

Terrain Effects:
- Urban Area: Collateral damage risks, civilian concerns
- Ocean: Extended range required, water landing options
- Mountains: Radar interference, altitude advantages

Emergency Situations:
- Engine Failure: Must play repair cards or face consequences
- Pilot Injury: Reduced effectiveness until medical attention
- Ammunition Low: Limited attack options remaining
```

---

## Phase 3: Battle Interface Design

### 3.1 Battle Screen Layout

#### Main Combat View:
- **Aircraft Status Panel**: Health, fuel, ammunition, system status
- **UFO Status Panel**: Estimated health, behavior prediction (if research allows)
- **Card Hand**: Current playable cards (5-7 card limit)
- **Energy Display**: Available energy for current turn
- **Battle Log**: Scrolling history of actions and results
- **Stage Progress**: Visual indicator of current battle stage

#### Card Interaction:
- **Drag-and-Drop**: Intuitive card playing mechanism
- **Hover Details**: Comprehensive card descriptions and requirements
- **Targeting System**: Clear indication of targets and effects
- **Animation Feedback**: Visual representation of card effects

### 3.2 Information Display

#### Pilot Information:
- **Experience Level**: Affects available crew cards
- **Specialization Bonus**: Vehicle-specific advantages
- **Current Status**: Health, stress, morale
- **Special Abilities**: Unlocked skills and their cooldowns

#### Research Integration:
- **Unlocked Equipment**: Available advanced cards
- **UFO Knowledge**: Information revealed through previous encounters
- **Tactical Database**: Effectiveness data from past battles

---

## Phase 4: Progression and Rewards

### 4.1 Victory Conditions and Outcomes

#### Primary Objectives:
- **UFO Destroyed**: Maximum rewards, no threat escalation
- **UFO Captured**: Technology samples, intelligence, research bonuses
- **UFO Escaped**: Partial rewards, threat level increase
- **Mission Failed**: Minimal rewards, aircraft damage, potential pilot injury

#### Stage-Specific Rewards:
- **Approach Stage Success**: Fuel savings, positioning advantage
- **Engagement Stage Success**: Damage dealt, tactical information
- **Pursuit Stage Success**: Prevent escape, capture opportunities
- **Recovery Stage Success**: Technology samples, alien materials
- **Aftermath Stage Success**: Intelligence data, research bonuses

### 4.2 Pilot Development

#### Experience Gains:
- **Combat Experience**: Increases with successful actions
- **Specialization Progress**: Vehicle-specific skill improvements
- **Trait Development**: New abilities based on performance patterns

#### Stress and Morale System:
- **Battle Stress**: Accumulates during intense encounters
- **Recovery Time**: Required rest between missions
- **PTSD Risk**: Consequences of traumatic experiences
- **Morale Bonuses**: Success breeds confidence and better performance

### 4.3 Aircraft Advancement

#### Battle Damage and Repair:
- **System Damage**: Affects available cards and performance
- **Maintenance Requirements**: Time and resource costs
- **Upgrade Opportunities**: Install captured alien technology

#### Performance Tracking:
- **Mission History**: Record of pilot-aircraft combinations
- **Effectiveness Ratings**: Statistical analysis of combat performance
- **Customization Options**: Loadout optimization based on mission type

---

## Phase 5: Integration with Existing Systems

### 5.1 Research Tree Expansion

#### New Interception-Focused Research:
```
Combat Tactics Branch:
- Air-to-Air Combat Doctrine: Unlocks tactical formation cards
- Electronic Warfare: Jamming and counter-stealth capabilities
- Psychological Warfare: Morale-affecting abilities

Weapon Systems Branch:
- Alien Weapon Integration: Use captured UFO weapons
- Smart Munitions: Guided missiles with improved accuracy
- Energy Weapons: Plasma and laser weapon systems

Defensive Systems Branch:
- Adaptive Armor: Dynamic protection against alien weapons
- Emergency Systems: Ejection seats, emergency repair kits
- Stealth Technology: Reduced detection by UFOs
```

### 5.2 Base Operations Integration

#### Hangar Enhancements:
- **Mission Briefing Room**: Pre-battle planning interface
- **Pilot Ready Room**: Crew assignment and status monitoring
- **Maintenance Bay**: Aircraft repair and upgrade facilities
- **Intelligence Center**: UFO analysis and tactical planning

#### Personnel Specializations:
- **Flight Surgeon**: Pilot health and stress management
- **Tactical Analyst**: Mission planning and UFO behavior prediction
- **Weapons Specialist**: Equipment maintenance and optimization
- **Intelligence Officer**: Information gathering and analysis

### 5.3 Campaign Progression

#### Escalating Threat Response:
- **UFO Adaptation**: Aliens learn from player tactics
- **New UFO Types**: Advanced variants appear over time
- **Technology Race**: Player improvements vs. alien countermeasures
- **Strategic Decisions**: Resource allocation between offense and defense

#### Long-term Consequences:
- **Pilot Reputation**: Veteran pilots become valuable assets
- **UFO Behavioral Changes**: Successful tactics become less effective
- **Public Response**: Interception success affects global morale
- **Research Priorities**: Battle outcomes influence technology development

---

## Phase 6: Advanced Features

### 6.1 Multi-Aircraft Engagements

#### Formation Combat:
- **Wing Commander**: Lead pilot coordinates team actions
- **Formation Cards**: Special abilities requiring multiple aircraft
- **Resource Sharing**: Ammunition and energy distribution
- **Tactical Coordination**: Synchronized attacks and maneuvers

### 6.2 Special Mission Types

#### Escort Missions:
- **Transport Protection**: Defend vulnerable aircraft
- **VIP Evacuation**: High-stakes civilian rescue
- **Supply Run**: Deliver critical resources under threat

#### Reconnaissance Missions:
- **Intelligence Gathering**: Avoid combat while collecting data
- **UFO Tracking**: Follow without engaging
- **Base Investigation**: Explore alien installations

### 6.3 Dynamic Campaign Events

#### Random Encounters:
- **Distress Signals**: Emergency rescue situations
- **Alien Ambushes**: Surprise multi-UFO encounters
- **Technology Malfunctions**: Equipment failure scenarios
- **Weather Emergencies**: Environmental challenge missions

---

## Implementation Roadmap

### Sprint 1: Core Framework (2-3 weeks)
- [x] Extend existing type definitions for battle integration
  - [x] Add battle-related properties to UFO types (health, behavior deck, threat level)
  - [x] Extend Vehicle types with battle stats (energy generation, card slots, armor)
  - [x] Enhance Personnel types with crew card abilities and specializations
  - [x] Create battle state and card management type definitions
- [x] Design card data structures and base card set
  - [x] Define card type interfaces and core mechanics
  - [x] Create JSON data file with initial card set (20-30 base cards)
  - [x] Implement placeholder image references and naming conventions
- [x] Create card utility functions and validation
  - [x] Card deck management (shuffle, draw, discard)
  - [x] Card effect processing and validation
  - [x] Energy system and turn management utilities
- [ ] Implement basic battle flow and stage progression
  - [ ] Multi-stage battle structure (Approach, Engagement, Pursuit)
  - [ ] Stage transition logic and objective tracking
  - [ ] Victory/defeat condition evaluation
- [ ] Create simple battle interface with card playing mechanics
  - [ ] Basic card hand display and interaction
  - [ ] Energy and turn counter UI components
  - [ ] Simple drag-and-drop card playing mechanism
- [ ] Integrate with existing UFO detection and aircraft systems
  - [ ] Hook into UFO spawning/detection events
  - [ ] Aircraft selection and crew assignment interface
  - [ ] Battle initiation from existing interception flow

### Sprint 2: Card System (2-3 weeks)
- [ ] Implement full card type system (Action, Equipment, Crew, Environmental)
- [ ] Create UFO response AI and behavior cards
- [ ] Add energy system and turn management
- [ ] Implement status effects and persistent battle state

### Sprint 3: Battle Interface (2-3 weeks)
- [ ] Design and implement polished battle UI
- [ ] Add card animations and visual feedback
- [ ] Create information display panels for pilots and aircraft
- [ ] Implement targeting system and effect visualization

### Sprint 4: Progression Systems (2-3 weeks)
- [ ] Implement pilot experience and specialization system
- [ ] Add aircraft damage and repair mechanics
- [ ] Create reward distribution based on battle outcomes
- [ ] Integrate with research system for equipment unlocks

### Sprint 5: Advanced Features (2-3 weeks)
- [ ] Add multi-stage battle variations
- [ ] Implement stress and morale systems
- [ ] Create special mission types and scenarios
- [ ] Add formation combat for multi-aircraft engagements

### Sprint 6: Polish and Balance (1-2 weeks)
- [ ] Balance card costs, effects, and battle difficulty
- [ ] Add sound effects and enhanced animations
- [ ] Implement save/load for interrupted battles
- [ ] Create comprehensive tutorial system

---

## Technical Considerations

### Data Structures:
```typescript
interface BattleCard {
  id: string;
  name: string;
  type: 'action' | 'equipment' | 'crew' | 'environmental' | 'ufo_response';
  cost: number;
  effects: CardEffect[];
  requirements?: CardRequirement[];
  cooldown?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

interface BattleState {
  stage: BattleStage;
  turn: number;
  playerEnergy: number;
  playerHand: BattleCard[];
  activeEffects: StatusEffect[];
  aircraftStatus: AircraftBattleStatus;
  ufoStatus: UFOBattleStatus;
  stageObjectives: ObjectiveStatus[];
}

interface CardEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'special';
  target: 'self' | 'enemy' | 'both';
  value: number | string;
  duration?: number;
}
```

### Performance Optimization:
- Efficient card rendering with virtualization
- Minimal re-renders during animations
- Preloaded card assets and effects
- Optimized battle state management

### Accessibility:
- Keyboard navigation for all battle actions
- Screen reader support for card descriptions
- Colorblind-friendly status indicators
- Scalable UI elements for different screen sizes

---

## Testing Strategy

### Unit Testing:
- [ ] Card effect calculations and interactions
- [ ] Battle state transitions and validation
- [ ] Pilot experience and progression algorithms
- [ ] UFO AI response selection logic

### Integration Testing:
- [ ] Battle system integration with existing game state
- [ ] Research unlock effects on available cards
- [ ] Personnel assignment impacts on battle performance
- [ ] Aircraft damage persistence between battles

### User Experience Testing:
- [ ] Battle pacing and engagement metrics
- [ ] Card balance and strategic depth evaluation
- [ ] Tutorial effectiveness and learning curve
- [ ] Accessibility compliance and usability

### Performance Testing:
- [ ] Battle loading times and responsiveness
- [ ] Memory usage during extended battles
- [ ] Animation smoothness and frame rates
- [ ] Save/load performance with battle state

---

This comprehensive plan provides a roadmap for implementing a deep, engaging card-based interception system that leverages existing game systems while adding strategic depth and meaningful player choice to UFO encounters.
