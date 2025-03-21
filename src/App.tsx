import { useState } from 'react';
import { Globe2, Database, Users, Microscope, DollarSign } from 'lucide-react';
import WorldMap from './components/WorldMap';
import ResourcePanel from './components/ResourcePanel';
import SidePanel from './components/SidePanel';
import BaseModal from './components/BaseModal';
import PersonnelModal from './components/PersonnelModal';
import ResearchModal from './components/ResearchModal';
import FinancialModal from './components/FinancialModal';
import IntroModal from './components/IntroModal';
import TimeControlPanel from './components/TimeControlPanel';
import EventModal from './components/EventModal';
import YearlyReviewModal from './components/YearlyReviewModal';
import { GameState, Base, Continent, Personnel, ResearchProject } from './types';
import { FACILITY_TYPES } from './data/facilities';
import { BASE_SALARIES, generatePersonnel } from './data/personnel';
import { CONTINENTS } from './data/continents';
import { MONTHLY_EVENTS, GameEvent, evaluateYearlyPerformance, YearlyReview } from './data/events';

function App() {
  // Create initial base
  const initialBase: Base = {
    id: crypto.randomUUID(),
    name: "GDA Headquarters",
    x: 25,
    y: 20,
    level: 1,
    personnel: [],
    power: 50,
    powerUsage: 30,
    continent: CONTINENTS.northAmerica,
    maxSize: CONTINENTS.northAmerica.maxBaseSize,
    facilities: [
      {
        id: crypto.randomUUID(),
        type: 'powerPlant',
        level: 1,
        personnel: [],
        powerUsage: FACILITY_TYPES.powerPlant.basePowerUsage,
        maintenance: FACILITY_TYPES.powerPlant.baseMaintenance,
      },
      {
        id: crypto.randomUUID(),
        type: 'research',
        level: 1,
        personnel: [],
        powerUsage: FACILITY_TYPES.research.basePowerUsage,
        maintenance: FACILITY_TYPES.research.baseMaintenance,
      },
      {
        id: crypto.randomUUID(),
        type: 'barracks',
        level: 1,
        personnel: [],
        powerUsage: FACILITY_TYPES.barracks.basePowerUsage,
        maintenance: FACILITY_TYPES.barracks.baseMaintenance,
      }
    ],
    vehicles: [],
    radarRange: 100,
    radarEffectiveness: 50
  };

  // Create initial personnel
  const initialPersonnel: Personnel[] = [
    generatePersonnel('scientist'),
    generatePersonnel('engineer'),
    generatePersonnel('soldier'),
  ];

  const [gameState, setGameState] = useState<GameState>({
    funds: 10000000,
    research: 0,
    availablePersonnel: initialPersonnel,
    bases: [initialBase],
    date: new Date('2025-01-01'),
    threatLevel: 0,
    activeResearchProject: null,
    completedResearch: [],
    financials: {
      monthlyIncome: 2000000,
      monthlyExpenses: {
        personnel: 350000,
        facilities: 450000,
        research: 300000,
        other: 100000
      },
      projectedBalance: 12000000,
      transactions: [
        {
          id: crypto.randomUUID(),
          date: new Date('2025-01-01'),
          amount: 10000000,
          type: 'income',
          description: 'Initial UN funding',
          category: 'funding'
        }
      ]
    }
  });

  type ModalType = 'intro' | 'base' | 'personnel' | 'research' | 'financial' | 'event' | 'yearlyReview' | null;
  const [activeModal, setActiveModal] = useState<ModalType>('intro');
  const [selectedBase, setSelectedBase] = useState<Base | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null);
  const [currentEvent, setCurrentEvent] = useState<{ event: GameEvent; message: string } | null>(null);
  const [yearlyReview, setYearlyReview] = useState<YearlyReview | null>(null);

  const addTransaction = (
    amount: number,
    type: 'income' | 'expense',
    description: string,
    category: 'funding' | 'personnel' | 'facilities' | 'research' | 'equipment' | 'maintenance' | 'other'
  ) => {
    setGameState(prev => ({
      ...prev,
      financials: {
        ...prev.financials,
        transactions: [
          ...prev.financials.transactions,
          {
            id: crypto.randomUUID(),
            date: new Date(),
            amount,
            type,
            description,
            category
          }
        ]
      }
    }));
  };

  const handleCreateBase = (base: Base) => {
    const cost = 2000000;
    setGameState(prev => ({
      ...prev,
      funds: prev.funds - cost,
      bases: [...prev.bases, base],
    }));
    addTransaction(cost, 'expense', `New base construction: ${base.name}`, 'facilities');
    handleCloseBaseModal();
  };

  const handleBaseClick = (base: Base) => {
    setSelectedBase(base);
    setActiveModal('base');
  };

  const handleCloseBaseModal = () => {
    setActiveModal(null);
    setSelectedBase(null);
    setSelectedContinent(null);
  };

  const handleUpgradeFacility = (baseId: string, facilityId: string) => {
    setGameState(prev => {
      const base = prev.bases.find(b => b.id === baseId);
      const facility = base?.facilities.find(f => f.id === facilityId);
      if (!base || !facility) return prev;

      const facilityType = FACILITY_TYPES[facility.type];
      const upgradeCost = Math.floor(
        facilityType.baseCost * Math.pow(facilityType.upgradeMultiplier, facility.level)
      );

      const newBases = prev.bases.map(b => {
        if (b.id !== baseId) return b;

        const newFacilities = b.facilities.map(f => {
          if (f.id !== facilityId) return f;

          const newLevel = f.level + 1;
          const powerMultiplier = Math.pow(1.2, newLevel - 1);

          return {
            ...f,
            level: newLevel,
            powerUsage: Math.floor(facilityType.basePowerUsage * powerMultiplier),
            personnel: [],
            maintenance: Math.floor(facilityType.baseMaintenance * powerMultiplier),
          };
        });

        return {
          ...b,
          facilities: newFacilities,
        };
      });

      addTransaction(
        upgradeCost,
        'expense',
        `Upgrade ${facilityType.name} to level ${facility.level + 1} at ${base.name}`,
        'facilities'
      );

      return {
        ...prev,
        bases: newBases,
        funds: prev.funds - upgradeCost,
      };
    });
  };

  const handleAddFacility = (baseId: string, facilityType: string) => {
    if (!FACILITY_TYPES[facilityType]) return;

    setGameState(prev => {
      const base = prev.bases.find(b => b.id === baseId);
      if (!base) return prev;

      const facilityTypeData = FACILITY_TYPES[facilityType];
      const cost = facilityTypeData.baseCost;

      const newBases = prev.bases.map(b => {
        if (b.id !== baseId) return b;

        const newFacility = {
          id: crypto.randomUUID(),
          type: facilityType as any,
          level: 1,
          personnel: [],
          powerUsage: facilityTypeData.basePowerUsage,
          maintenance: facilityTypeData.baseMaintenance,
        };

        return {
          ...b,
          facilities: [...b.facilities, newFacility],
        };
      });

      addTransaction(
        cost,
        'expense',
        `New ${facilityTypeData.name} construction at ${base.name}`,
        'facilities'
      );

      return {
        ...prev,
        bases: newBases,
        funds: prev.funds - cost,
      };
    });
  };

  const handleHirePersonnel = (personnel: Personnel) => {
    const cost = BASE_SALARIES[personnel.role];
    setGameState(prev => ({
      ...prev,
      availablePersonnel: [...prev.availablePersonnel, personnel],
      funds: prev.funds - cost,
    }));
    addTransaction(
      cost,
      'expense',
      `Hired new ${personnel.role}: ${personnel.name}`,
      'personnel'
    );
  };

  const handleAssignPersonnel = (personnelId: string, baseId: string, facilityId: string) => {
    setGameState(prev => {
      const personnel = prev.availablePersonnel.find(p => p.id === personnelId);
      if (!personnel) return prev;

      const newAvailablePersonnel = prev.availablePersonnel.filter(p => p.id !== personnelId);
      const newBases = prev.bases.map(base => {
        if (base.id !== baseId) return base;

        const newFacilities = base.facilities.map(facility => {
          if (facility.id !== facilityId) return facility;

          return {
            ...facility,
            personnel: [...facility.personnel, { ...personnel, baseId, assignedFacilityId: facilityId }],
          };
        });

        return {
          ...base,
          facilities: newFacilities,
        };
      });

      return {
        ...prev,
        availablePersonnel: newAvailablePersonnel,
        bases: newBases,
      };
    });
  };

  const handleTrainPersonnel = (personnelId: string, skill: keyof Personnel['skills']) => {
    const trainingCost = 10000;
    setGameState(prev => {
      const personnel = prev.availablePersonnel.find(p => p.id === personnelId);
      if (!personnel) return prev;

      addTransaction(
        trainingCost,
        'expense',
        `Training ${personnel.name} in ${skill}`,
        'personnel'
      );

      return {
        ...prev,
        funds: prev.funds - trainingCost,
        availablePersonnel: prev.availablePersonnel.map(p => {
          if (p.id !== personnelId) return p;

          return {
            ...p,
            skills: {
              ...p.skills,
              [skill]: Math.min(100, p.skills[skill] + 10),
            },
            experience: p.experience + 1,
            status: 'training',
          };
        }),
      };
    });
  };

  const handleStartResearch = (project: ResearchProject) => {
    setGameState(prev => {
      addTransaction(
        project.cost,
        'expense',
        `Started research project: ${project.name}`,
        'research'
      );

      return {
        ...prev,
        activeResearchProject: { ...project, progress: 0 },
        funds: prev.funds - project.cost,
        availablePersonnel: prev.availablePersonnel.map(p => {
          if (p.role === 'scientist' && p.status === 'available' && project.requirements.scientists > 0) {
            project.requirements.scientists--;
            return { ...p, status: 'working' };
          }
          return p;
        }),
      };
    });
    setActiveModal(null);
  };

  const handleContinentSelect = (continent: Continent) => {
    setSelectedContinent(continent);
    setActiveModal('base');
  };

  const handleAdvanceTime = () => {
    setGameState(prev => {
      const newDate = new Date(prev.date);
      newDate.setMonth(newDate.getMonth() + 1);

      // Apply monthly income and expenses
      const monthlyBalance = prev.financials.monthlyIncome - 
        Object.values(prev.financials.monthlyExpenses).reduce((a, b) => a + b, 0);

      // Check for random events
      const possibleEvents = MONTHLY_EVENTS.filter(
        event => Math.random() < event.probability
      );
      
      let updatedState = {
        ...prev,
        date: newDate,
        funds: prev.funds + monthlyBalance,
      };

      // Apply random event if any
      if (possibleEvents.length > 0) {
        const selectedEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
        const { state, message } = selectedEvent.effect(updatedState);
        updatedState = state;
        setCurrentEvent({ event: selectedEvent, message });
      }

      // Check for year end
      if (newDate.getMonth() === 0) {
        const review = evaluateYearlyPerformance(updatedState);
        setYearlyReview(review);

        // Apply funding changes
        const fundingAdjustment = updatedState.financials.monthlyIncome * review.fundingChange;
        updatedState = {
          ...updatedState,
          financials: {
            ...updatedState.financials,
            monthlyIncome: updatedState.financials.monthlyIncome + fundingAdjustment
          }
        };

        // Apply bonuses
        review.bonuses.forEach(bonus => {
          updatedState = bonus.effect(updatedState);
        });
      }

      return updatedState;
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe2 className="text-blue-400" />
            Global Defense Agency
          </h1>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <DollarSign className="text-green-400" />
              <span>${gameState.funds.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="text-purple-400" />
              <span>{gameState.research}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-yellow-400" />
              <span>{gameState.availablePersonnel.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Microscope className="text-red-400" />
              <span>Threat Level: {gameState.threatLevel}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 flex gap-4">
        <div className="flex-1">
          <WorldMap 
            bases={gameState.bases} 
            onBaseClick={handleBaseClick}
            onContinentSelect={!activeModal ? handleContinentSelect : undefined}
          />
        </div>
        <SidePanel 
          gameState={gameState}
          onCreateBase={() => setActiveModal('base')}
          onManagePersonnel={() => setActiveModal('personnel')}
          onOpenResearch={() => setActiveModal('research')}
          onOpenFinancials={() => setActiveModal('financial')}
        />
      </main>

      <ResourcePanel gameState={gameState} />

      <TimeControlPanel
        gameState={gameState}
        onAdvanceTime={handleAdvanceTime}
        disabled={!!activeModal} // Disable time advance when any modal is open
      />

      {/* Modal rendering based on activeModal state */}
      {activeModal === 'intro' && (
        <IntroModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'base' && (
        <BaseModal
          onClose={handleCloseBaseModal}
          onCreate={handleCreateBase}
          onUpgrade={handleUpgradeFacility}
          onAddFacility={handleAddFacility}
          existingBase={selectedBase}
          availablePersonnel={gameState.availablePersonnel.length}
          availableFunds={gameState.funds}
          selectedContinent={selectedContinent}
        />
      )}

      {activeModal === 'personnel' && (
        <PersonnelModal
          onClose={() => setActiveModal(null)}
          gameState={gameState}
          onHire={handleHirePersonnel}
          onAssign={handleAssignPersonnel}
          onTrain={handleTrainPersonnel}
        />
      )}

      {activeModal === 'research' && (
        <ResearchModal
          onClose={() => setActiveModal(null)}
          gameState={gameState}
          onStartResearch={handleStartResearch}
        />
      )}

      {activeModal === 'financial' && (
        <FinancialModal
          onClose={() => setActiveModal(null)}
          gameState={gameState}
        />
      )}

      {currentEvent && (
        <EventModal
          event={currentEvent.event}
          effectMessage={currentEvent.message}
          onClose={() => {
            setCurrentEvent(null);
            setActiveModal(null);
          }}
        />
      )}

      {yearlyReview && (
        <YearlyReviewModal
          review={yearlyReview}
          onClose={() => {
            setYearlyReview(null);
            setActiveModal(null);
          }}
        />
      )}
    </div>
  );
}

export default App;