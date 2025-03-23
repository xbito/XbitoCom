import { useState, useCallback, useEffect } from 'react';
import { Globe2, Shield, Users, Microscope, DollarSign, Clock, ChevronRight, FastForward } from 'lucide-react';
import WorldMap from './components/WorldMap';
import ResourcePanel from './components/ResourcePanel';
import SidePanel from './components/SidePanel';
import BaseModal from './components/BaseModal';
import PersonnelModal from './components/PersonnelModal';
import ResearchModal from './components/ResearchModal';
import FinancialModal from './components/FinancialModal';
import IntroModal from './components/IntroModal';
import EventModal from './components/EventModal';
import YearlyReviewModal from './components/YearlyReviewModal';
import HangarModal from './components/HangarModal';
import ConfirmationDialog from './components/ConfirmationDialog';
import { GameState, Base, Continent, Personnel, ResearchProject, Transaction } from './types';
import { FACILITY_TYPES } from './data/facilities';
import { BASE_SALARIES, generatePersonnel } from './data/personnel';
import { CONTINENTS } from './data/continents';
import { MONTHLY_EVENTS, GameEvent, evaluateYearlyPerformance, YearlyReview } from './data/events';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    funds: 20000000,
    research: 0,
    availablePersonnel: [],
    bases: [],
    date: new Date('2025-01-01'),
    threatLevel: 0,
    activeResearchProject: null,
    completedResearch: [],
    activeUFOs : [],
    detectedUFOs: [],
    interceptedUFOs: [],
    destroyedUFOs: [],
    escapedUFOs: [],
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

  type ModalType = 'intro' | 'base' | 'personnel' | 'research' | 'financial' | 'event' | 'yearlyReview' | 'hangar' | null;
  const [activeModal, setActiveModal] = useState<ModalType>('intro');
  const [selectedBase, setSelectedBase] = useState<Base | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null);
  const [currentEvent, setCurrentEvent] = useState<{ event: GameEvent; message: string } | null>(null);
  const [yearlyReview, setYearlyReview] = useState<YearlyReview | null>(null);
  const [selectedHangarBase, setSelectedHangarBase] = useState<Base | null>(null);
  
  // State to track user actions during a turn
  const [actionsPerformed, setActionsPerformed] = useState<boolean>(false);
  // State for the confirmation dialog
  const [showNoActionConfirmation, setShowNoActionConfirmation] = useState<boolean>(false);
  // Store previous funds to detect spending
  const [previousFunds, setPreviousFunds] = useState<number>(10000000); // Initial funds

  // Track transactions in the current turn
  const [currentTurnTransactions, setCurrentTurnTransactions] = useState<number>(0);

  // Reset action tracking when a new turn starts
  const resetActionTracking = useCallback(() => {
    setActionsPerformed(false);
    setPreviousFunds(gameState.funds);
    setCurrentTurnTransactions(gameState.financials.transactions.length);
  }, [gameState.funds, gameState.financials.transactions.length]);

  // Check if any meaningful actions were taken this turn
  const checkForActions = useCallback(() => {
    // Check if any transactions were added this turn
    const newTransactions = gameState.financials.transactions.length - currentTurnTransactions;
    
    // Actions considered:
    // 1. New transactions added
    // 2. Funds spent (not just monthly expenses)
    // 3. Personnel assignments changed
    return newTransactions > 0 || gameState.funds < previousFunds;
  }, [gameState.funds, gameState.financials.transactions.length, currentTurnTransactions, previousFunds]);

  // Effect to reset tracking on first load and after turn advance
  useEffect(() => {
    resetActionTracking();
  }, [gameState.date, resetActionTracking]);

  // Track actions when transactions happen
  useEffect(() => {
    if (gameState.financials.transactions.length > currentTurnTransactions) {
      setActionsPerformed(true);
    }
  }, [gameState.financials.transactions.length, currentTurnTransactions]);

  // Track actions when funds change (outside of automatic changes)
  useEffect(() => {
    if (gameState.funds < previousFunds) {
      setActionsPerformed(true);
    }
  }, [gameState.funds, previousFunds]);

  const addTransaction = useCallback((
    amount: number,
    type: Transaction['type'],
    description: string,
    category: Transaction['category']
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
  }, []);

  const updateGameStateFunds = useCallback((newAmount: number) => {
    setGameState(prev => ({ ...prev, funds: newAmount }));
  }, []);

  const updateGameStateBase = useCallback((updatedBase: Base) => {
    setGameState(prev => ({
      ...prev,
      bases: prev.bases.map(b => b.id === updatedBase.id ? updatedBase : b)
    }));
  }, []);

  const handleCreateBase = useCallback((base: Base) => {
    const cost = 2000000;
    setGameState(prev => ({
      ...prev,
      funds: prev.funds - cost,
      bases: [...prev.bases, base],
    }));
    addTransaction(cost, 'expense', `New base construction: ${base.name}`, 'facilities');
    handleCloseBaseModal();
  }, [addTransaction]);

  const handleBaseClick = useCallback((base: Base) => {
    setSelectedBase(base);
    setActiveModal('base');
  }, []);

  const handleCloseBaseModal = useCallback(() => {
    setActiveModal(null);
    setSelectedBase(null);
    setSelectedContinent(null);
  }, []);

  const handleUpgradeFacility = useCallback((baseId: string, facilityId: string) => {
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
  }, [addTransaction]);

  const handleAddFacility = useCallback((baseId: string, facilityType: string) => {
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
  }, [addTransaction]);

  const handleHirePersonnel = useCallback((personnel: Personnel) => {
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
  }, [addTransaction]);

  const handleAssignPersonnel = useCallback((personnelId: string, baseId: string, facilityId: string) => {
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
  }, []);

  const handleTrainPersonnel = useCallback((personnelId: string, skill: keyof Personnel['skills']) => {
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
  }, [addTransaction]);

  const handleStartResearch = useCallback((project: ResearchProject) => {
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
  }, [addTransaction]);

  const handleContinentSelect = useCallback((continent: Continent) => {
    setSelectedContinent(continent);
    setActiveModal('base');
  }, []);

  const handleAdvanceTime = useCallback(() => {
    // Check if any actions were performed this turn
    if (!actionsPerformed && !checkForActions()) {
      // No actions were performed, show confirmation dialog
      setShowNoActionConfirmation(true);
      return;
    }

    // Actions were performed or user confirmed, proceed with turn advancement
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

      // Reset the action tracking for the new turn
      resetActionTracking();
      
      return updatedState;
    });
  }, [actionsPerformed, checkForActions, resetActionTracking]);

  // Handle confirmation of advancing without actions
  const handleConfirmAdvanceWithoutActions = useCallback(() => {
    setShowNoActionConfirmation(false);
    // Force the turn to advance anyway
    setActionsPerformed(true);
    handleAdvanceTime();
  }, [handleAdvanceTime]);

  const handleOpenHangar = useCallback((base: Base) => {
    setSelectedHangarBase(base);
    setActiveModal('hangar');
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      <header className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe2 className="text-blue-400" />
            Global Defense Agency
          </h1>
          
          <div className="flex gap-6 items-center">
            {/* Financial information */}
            <div className="flex items-center gap-2">
              <DollarSign className="text-green-400" />
              <div>
                <div>${gameState.funds.toLocaleString()}</div>
                <div className="text-xs text-slate-400">
                  {gameState.financials.monthlyIncome > gameState.financials.monthlyExpenses.personnel + 
                   gameState.financials.monthlyExpenses.facilities + 
                   gameState.financials.monthlyExpenses.research + 
                   gameState.financials.monthlyExpenses.other
                   ? '+' : '-'}
                  ${Math.abs(gameState.financials.monthlyIncome - (
                    gameState.financials.monthlyExpenses.personnel + 
                    gameState.financials.monthlyExpenses.facilities + 
                    gameState.financials.monthlyExpenses.research + 
                    gameState.financials.monthlyExpenses.other
                  )).toLocaleString()}/month
                </div>
              </div>
            </div>
            
            {/* Time information */}
            <div className="flex items-center gap-2">
              <Clock className="text-blue-400" />
              <div>
                <div>{gameState.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div>
                <div className="text-xs text-slate-400">Turn {Math.floor((gameState.date.getTime() - new Date('2025-01-01').getTime()) / (30 * 24 * 60 * 60 * 1000)) + 1}</div>
              </div>
            </div>
            
            {/* Continue button moved to header */}
            <button
              onClick={handleAdvanceTime}
              disabled={!!activeModal}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
            >
              <ChevronRight size={16} />
              Continue
            </button>
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
          onOpenHangar={handleOpenHangar}
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

      {activeModal === 'hangar' && selectedHangarBase && (
        <HangarModal
          isOpen={true}
          onClose={() => {
            setActiveModal(null);
            setSelectedHangarBase(null);
          }}
          base={selectedHangarBase}
          updateBase={updateGameStateBase}
          availableFunds={gameState.funds}
          updateFunds={updateGameStateFunds}
          completedResearch={gameState.completedResearch.map(r => r.id)}
        />
      )}
      
      {/* No action confirmation dialog */}
      <ConfirmationDialog
        isOpen={showNoActionConfirmation}
        onClose={() => setShowNoActionConfirmation(false)}
        onConfirm={handleConfirmAdvanceWithoutActions}
        title="No Actions Taken"
        message="You haven't performed any actions this turn. Are you sure you want to continue to the next month?"
        confirmText="Continue Anyway"
        cancelText="Go Back"
      />
    </div>
  );
}

export default App;