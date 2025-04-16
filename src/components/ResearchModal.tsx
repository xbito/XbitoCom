import React, { useState } from 'react';
import { Microscope, X, Lock, CheckCircle, Clock, DollarSign, Users, Building2, Beaker, Zap } from 'lucide-react';
import { GameState, ResearchProject, ResearchCategory } from '../types';
import { RESEARCH_PROJECTS } from '../data/research';
import { calculateScientistsInLabs } from '../utils/baseUtils'; // Import the moved function

interface ResearchModalProps {
  onClose: () => void;
  gameState: GameState;
  onStartResearch: (project: ResearchProject) => void;
}

const ResearchModal: React.FC<ResearchModalProps> = ({
  onClose,
  gameState,
  onStartResearch,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ResearchCategory | null>(null);

  const categories: ResearchCategory[] = ['weapons', 'armor', 'aircraft', 'facilities', 'xenobiology', 'psionics'];

  const getAvailableProjects = () => {
    if (!gameState) return [];

    return RESEARCH_PROJECTS.filter(project => {
      // Filter by category if one is selected
      if (selectedCategory && project.category !== selectedCategory) return false;

      // Check if already completed
      if (gameState.completedResearch?.some(r => r.id === project.id)) return false;

      // Check if already researching
      if (gameState.activeResearchProject?.id === project.id) return false;

      // Check prerequisites
      const hasPrerequisites = project.requirements.prerequisites.every(
        (prereqId: string) => gameState.completedResearch?.some(r => r.id === prereqId)
      );

      return hasPrerequisites;
    });
  };

  const canStartResearch = (project: ResearchProject) => {
    if (!gameState) return false;

    // Check funds
    if (gameState.funds < project.cost) return false;

    // Check if we have enough scientists *in research labs*
    const scientistsInLabs = calculateScientistsInLabs(gameState);
    if (scientistsInLabs < project.requirements.scientists) {
      console.warn(`%c[${new Date().toISOString()}] [ResearchModal] Cannot start research '${project.name}': Insufficient scientists. Required: ${project.requirements.scientists}, Available in labs: ${scientistsInLabs}`, 'color: orange;');
      return false;
    }

    // Check if we have the required facilities
    const hasFacilities = project.requirements.facilities.every((requirement: { type: string; level: number }) => {
      return gameState.bases?.some(base =>
        base.facilities?.some(
          facility =>
            facility.type === requirement.type &&
            facility.level >= requirement.level
        )
      );
    });

    return hasFacilities;
  };

  const renderRequirements = (project: ResearchProject) => {
    // Calculate scientists currently assigned to research labs
    const scientistsInLabs = calculateScientistsInLabs(gameState);

    return (
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          {/* Use scientistsInLabs for color coding */}
          <Users size={16} className={scientistsInLabs >= project.requirements.scientists ? 'text-green-400' : 'text-red-400'} />
          {/* Use scientistsInLabs for text and color coding */}
          <span className={scientistsInLabs >= project.requirements.scientists ? 'text-green-400' : 'text-red-400'}>
            {project.requirements.scientists} Scientists Required (Available in Labs: {scientistsInLabs})
          </span>
        </div>
        {project.requirements.facilities.map((facility: { type: string; level: number }, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <Building2 size={16} className="text-green-400" />
            <span className={
              gameState.bases.some(base =>
                base.facilities.some(
                  f => f.type === facility.type && f.level >= facility.level
                )
              )
                ? 'text-green-400'
                : 'text-red-400'
            }>
              Level {facility.level} {facility.type} Required
            </span>
          </div>
        ))}
        {project.requirements.prerequisites.map((prereqId: string) => {
          const completed = gameState.completedResearch.some(r => r.id === prereqId);
          const prereq = RESEARCH_PROJECTS.find(r => r.id === prereqId);
          return (
            <div key={prereqId} className="flex items-center gap-2">
              {completed ? 
                <CheckCircle size={16} className="text-green-400" /> : 
                <Lock size={16} className="text-red-400" />
              }
              <span className={completed ? 'text-green-400' : 'text-red-400'}>
                Requires: {prereq?.name}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-zinc-900 to-black rounded-lg border border-green-900/30 p-6 w-[1000px] max-h-[80vh] overflow-y-auto shadow-[0_0_15px_rgba(34,197,94,0.2)]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black/50 rounded-full border border-green-800/20 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
              <Microscope className="text-green-400" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-green-50">Research Laboratory</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-green-400 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Active Research */}
        {gameState?.activeResearchProject && (
          <div className="mb-6 bg-gradient-to-r from-black to-zinc-900 border border-green-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Beaker className="text-green-400" size={18} />
              <h3 className="text-sm font-semibold text-green-100">Current Research</h3>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-green-50">{gameState.activeResearchProject.name}</p>
                <p className="text-sm text-slate-400">{gameState.activeResearchProject.description}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Progress</div>
                <div className="text-xl font-bold text-green-400">{gameState.activeResearchProject.progress}%</div>
              </div>
            </div>
            <div className="mt-2 h-2 bg-black/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-green-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                style={{ width: `${gameState.activeResearchProject.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-green-600 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                  : 'bg-black hover:bg-zinc-800 text-gray-300 border border-green-900/20'
              }`}
            >
              All Projects
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded text-sm font-medium capitalize transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                    : 'bg-black hover:bg-zinc-800 text-gray-300 border border-green-900/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Available Projects */}
        <div className="grid grid-cols-2 gap-4">
          {getAvailableProjects().map(project => (
            <div key={project.id} className="bg-gradient-to-br from-zinc-900 to-black border border-green-900/30 p-4 rounded-lg relative overflow-hidden group hover:shadow-[0_0_10px_rgba(34,197,94,0.2)] transition-all duration-300">
              {/* Subtle glowing corner effect */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-green-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-2 relative">
                <div>
                  <h4 className="font-semibold text-green-50">{project.name}</h4>
                  <p className="text-sm text-slate-400">{project.description}</p>
                </div>
                <span className="text-xs bg-black/50 border border-green-800/20 px-2 py-0.5 rounded capitalize text-green-400">
                  {project.category}
                </span>
              </div>

              <div className="mt-4 space-y-4 relative">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-green-400" />
                    <span className="text-gray-300">{project.duration} days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-green-400" />
                    <span className="text-gray-300">${project.cost.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-green-900/20 pt-4">
                  <h5 className="font-medium mb-2 text-xs text-green-400 uppercase tracking-wider flex items-center gap-1">
                    <Zap size={12} />
                    Requirements
                  </h5>
                  {renderRequirements(project)} 
                </div>

                <button
                  onClick={() => onStartResearch(project)}
                  disabled={!canStartResearch(project)}
                  className={`w-full py-2 px-4 rounded text-sm font-medium transition-all duration-200
                    ${canStartResearch(project) 
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]' 
                      : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'}`}
                >
                  Start Research
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchModal;