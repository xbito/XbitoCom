import { GameState } from '../types';

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  probability: number; // 0-1
  effect: (state: GameState) => { 
    state: GameState;
    message: string;
  };
}

const BASE_MONTHLY_EVENTS: GameEvent[] = [
  {
    id: 'funding_increase',
    title: 'UN Emergency Funding',
    description: 'The United Nations has approved additional emergency funding for the GDA.',
    type: 'positive',
    probability: 0.15,
    effect: (state) => {
      const amount = Math.floor(state.funds * 0.1);
      return {
        state: {
          ...state,
          funds: state.funds + amount,
          financials: {
            ...state.financials,
            transactions: [
              ...state.financials.transactions,
              {
                id: crypto.randomUUID(),
                date: new Date(),
                amount,
                type: 'income',
                description: 'UN Emergency Funding',
                category: 'funding'
              }
            ]
          }
        },
        message: `Received ${amount.toLocaleString()} in emergency funding`
      };
    }
  },
  {
    id: 'equipment_malfunction',
    title: 'Equipment Malfunction',
    description: 'Some research equipment has malfunctioned, requiring immediate repairs.',
    type: 'negative',
    probability: 0.2,
    effect: (state) => {
      const cost = Math.floor(state.funds * 0.05);
      return {
        state: {
          ...state,
          funds: state.funds - cost,
          financials: {
            ...state.financials,
            transactions: [
              ...state.financials.transactions,
              {
                id: crypto.randomUUID(),
                date: new Date(),
                amount: cost,
                type: 'expense',
                description: 'Emergency Equipment Repairs',
                category: 'maintenance'
              }
            ]
          }
        },
        message: `Emergency repairs cost ${cost.toLocaleString()}`
      };
    }
  },
  {
    id: 'research_breakthrough',
    title: 'Research Breakthrough',
    description: 'Your scientists have made an unexpected breakthrough!',
    type: 'positive',
    probability: 0.1,
    effect: (state) => {
      const researchBonus = 10;
      return {
        state: {
          ...state,
          research: Math.min(100, state.research + researchBonus)
        },
        message: `Research progress increased by ${researchBonus}%`
      };
    }
  },
  {
    id: 'personnel_training',
    title: 'Training Exercise Success',
    description: 'A joint training exercise has improved personnel effectiveness.',
    type: 'positive',
    probability: 0.15,
    effect: (state) => {
      const newPersonnel = state.availablePersonnel.map(p => ({
        ...p,
        experience: p.experience + 1
      }));
      return {
        state: {
          ...state,
          availablePersonnel: newPersonnel
        },
        message: 'All personnel gained 1 experience point'
      };
    }
  },
  {
    id: 'public_support',
    title: 'Increased Public Support',
    description: 'Public support for the GDA has increased, leading to additional funding.',
    type: 'positive',
    probability: 0.1,
    effect: (state) => {
      const increase = Math.floor(state.financials.monthlyIncome * 0.05);
      return {
        state: {
          ...state,
          financials: {
            ...state.financials,
            monthlyIncome: state.financials.monthlyIncome + increase
          }
        },
        message: `Monthly funding increased by ${increase.toLocaleString()}`
      };
    }
  }
];

export const UFO_EVENTS: GameEvent[] = [
  {
    id: 'ufo_sighting',
    title: 'UFO Sighting',
    description: 'Civilian reports of unusual aerial phenomena have increased.',
    type: 'neutral',
    probability: 0.2,
    effect: (state) => {
      // Increase threat level slightly
      return {
        state: {
          ...state,
          threatLevel: Math.min(5, state.threatLevel + 0.1)
        },
        message: 'Global tension has increased slightly due to UFO sightings'
      };
    }
  },
  {
    id: 'radar_upgrade',
    title: 'Radar Efficiency Improvement',
    description: 'Technical adjustments have improved radar detection capabilities.',
    type: 'positive',
    probability: 0.15,
    effect: (state) => {
      // Improve radar effectiveness for all bases
      const newBases = state.bases.map(base => ({
        ...base,
        radarEffectiveness: (base.radarEffectiveness || 1) * 1.1
      }));
      
      return {
        state: {
          ...state,
          bases: newBases
        },
        message: 'Radar detection effectiveness increased by 10%'
      };
    }
  }
];

export interface YearlyReview {
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  fundingChange: number;
  bonuses: {
    description: string;
    effect: (state: GameState) => GameState;
  }[];
}

export function evaluateYearlyPerformance(state: GameState): YearlyReview {
  // Calculate performance metrics
  const baseCount = state.bases.length;
  const personnelCount = state.availablePersonnel.length;
  const researchProgress = state.research;
  const financialHealth = state.funds > state.financials.monthlyIncome * 3;
  
  // Calculate score based on metrics
  let score = 0;
  score += baseCount * 20;
  score += personnelCount * 5;
  score += researchProgress * 0.5;
  score += financialHealth ? 20 : -20;
  
  // Determine rating
  let rating: YearlyReview['rating'];
  let fundingChange = 0;
  
  if (score >= 100) {
    rating = 'excellent';
    fundingChange = 0.2; // 20% increase
  } else if (score >= 70) {
    rating = 'good';
    fundingChange = 0.1; // 10% increase
  } else if (score >= 40) {
    rating = 'fair';
    fundingChange = 0; // No change
  } else {
    rating = 'poor';
    fundingChange = -0.1; // 10% decrease
  }
  
  const descriptions = {
    excellent: 'The GDA has exceeded all expectations. The UN Security Council is extremely pleased with our progress.',
    good: 'The GDA has performed well, meeting most of its objectives for the year.',
    fair: 'The GDA has shown mixed results. There is room for improvement.',
    poor: 'The GDA has fallen short of expectations. Significant improvements are needed.'
  };
  
  const bonuses: YearlyReview['bonuses'] = [];
  
  if (rating === 'excellent') {
    bonuses.push({
      description: 'Additional Research Grant',
      effect: (state) => ({
        ...state,
        research: Math.min(100, state.research + 15)
      })
    });
  }
  
  if (rating === 'excellent' || rating === 'good') {
    bonuses.push({
      description: 'Personnel Morale Boost',
      effect: (state) => ({
        ...state,
        availablePersonnel: state.availablePersonnel.map(p => ({
          ...p,
          experience: p.experience + 2
        }))
      })
    });
  }
  
  return {
    rating,
    description: descriptions[rating],
    fundingChange,
    bonuses
  };
}

// Combine all monthly events
export const MONTHLY_EVENTS: GameEvent[] = [
  ...BASE_MONTHLY_EVENTS,
  ...UFO_EVENTS
];