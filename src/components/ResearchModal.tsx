import React, { useState } from 'react';
import { Microscope, X, Lock, CheckCircle, Clock, DollarSign, Users, Building2 } from 'lucide-react';
import { GameState, ResearchProject, ResearchCategory } from '../types';
import { RESEARCH_PROJECTS } from '../data/research';

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

    // Check if we have enough scientists
    const availableScientists = gameState.availablePersonnel?.filter(
      p => p.role === 'scientist' && p.status === 'available'
    )?.length ?? 0;

    if (availableScientists < project.requirements.scientists) return false;

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
    const availableScientists = gameState.availablePersonnel.filter(
      p => p.role === 'scientist' && p.status === 'available'
    ).length;

    return (
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span className={availableScientists >= project.requirements.scientists ? 'text-green-400' : 'text-red-400'}>
            {project.requirements.scientists} Scientists Required
          </span>
        </div>
        {project.requirements.facilities.map((facility: { type: string; level: number }, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <Building2 size={16} />
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
              {completed ? <CheckCircle size={16} className="text-green-400" /> : <Lock size={16} className="text-red-400" />}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-[1000px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Microscope className="text-purple-400" size={24} />
            <h2 className="text-2xl font-bold">Research Laboratory</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Active Research */}
        {gameState?.activeResearchProject && (
          <div className="mb-6 bg-slate-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Current Research</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{gameState.activeResearchProject.name}</p>
                <p className="text-sm text-slate-400">{gameState.activeResearchProject.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">Progress</div>
                <div className="text-xl font-bold">{gameState.activeResearchProject.progress}%</div>
              </div>
            </div>
            <div className="mt-2 h-2 bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500"
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
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === null
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              All Projects
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full capitalize whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-700 hover:bg-slate-600'
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
            <div key={project.id} className="bg-slate-700 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{project.name}</h4>
                  <p className="text-sm text-slate-400">{project.description}</p>
                </div>
                <span className="text-xs bg-slate-600 px-2 py-1 rounded-full capitalize">
                  {project.category}
                </span>
              </div>

              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-400" />
                    <span>{project.duration} days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-green-400" />
                    <span>${project.cost.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-slate-600 pt-4">
                  <h5 className="font-medium mb-2">Requirements</h5>
                  {renderRequirements(project)}
                </div>

                <button
                  onClick={() => onStartResearch(project)}
                  disabled={!canStartResearch(project)}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
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