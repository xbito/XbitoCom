import React, { useState } from 'react';
import { AlertTriangle, X, ChevronLeft, ChevronRight, Shield, Globe } from 'lucide-react';
import { Continent } from '../types';
import { CONTINENTS } from '../data/continents';

interface IntroModalProps {
  onClose: () => void;
}

type PageType = 'crisis' | 'objectives' | 'locations';

const IntroModal: React.FC<IntroModalProps> = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('crisis');

  const handleNextPage = () => {
    if (currentPage === 'crisis') setCurrentPage('objectives');
    else if (currentPage === 'objectives') setCurrentPage('locations');
  };

  const handlePrevPage = () => {
    if (currentPage === 'objectives') setCurrentPage('crisis');
    else if (currentPage === 'locations') setCurrentPage('objectives');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-slate-900 to-black rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto border border-gray-800 shadow-[0_0_15px_rgba(0,255,170,0.15)]">
        {currentPage === 'crisis' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-yellow-500 drop-shadow-[0_0_3px_rgba(234,179,8,0.5)]" size={24} />
                <h2 className="text-xl font-bold text-slate-200">Global Crisis Alert</h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-base mb-4 text-slate-300">
                <strong className="text-emerald-400">January 1st, 2025</strong> - The world stands at a critical juncture. Over the past six months, 
                there has been an unprecedented surge in UFO sightings and unexplained phenomena across the globe.
              </p>
              <p className="mb-4 text-slate-300">
                What was once dismissed as conspiracy theories can no longer be ignored. Governments worldwide 
                are receiving reports of advanced craft performing impossible maneuvers in our skies. Some reports 
                indicate potential interference with military installations and civilian infrastructure.
              </p>
              <p className="mb-4 text-slate-300">
                In response to this escalating crisis, the United Nations Security Council has established the 
                <strong className="text-emerald-400"> Global Defense Agency (GDA)</strong> - a specialized organization tasked with investigating, 
                researching, and defending against potential extraterrestrial threats.
              </p>
              
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-md mt-6 border border-yellow-900/50 shadow-[0_0_5px_rgba(234,179,8,0.2)]">
                <p className="text-yellow-500 font-semibold mb-2 text-sm">WARNING:</p>
                <p className="text-slate-300 text-sm">
                  Intelligence suggests that alien activity is increasing. Time is of the essence. 
                  The fate of humanity may depend on your decisions.
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <div></div> {/* Empty div for spacing */}
              <button
                onClick={handleNextPage}
                className="bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-slate-200 font-medium py-2 px-4 rounded-sm flex items-center gap-2 shadow-md transition-all border-t border-emerald-700/50"
              >
                Your Mission <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}

        {currentPage === 'objectives' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Shield className="text-emerald-500 drop-shadow-[0_0_3px_rgba(16,185,129,0.5)]" size={24} />
                <h2 className="text-xl font-bold text-slate-200">Your Role as GDA Director</h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-base mb-4 text-slate-300">
                As the newly appointed Director of the GDA, you have been granted:
              </p>
              <ul className="mb-4 space-y-1 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  Initial funding of $20,000,000
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  Authority to establish operations globally
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  Control over personnel recruitment and resource allocation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  Mandate to develop countermeasures against the alien threat
                </li>
              </ul>
              
              <p className="mb-4 text-slate-300">
                Your immediate objectives:
              </p>
              <ul className="mb-6 space-y-1 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  Establish your first operational base in a strategic location
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  Recruit specialized personnel for your operations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  Begin research into alien technology
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  Build a detection network to monitor for extraterrestrial activity
                </li>
              </ul>
              
              <p className="mb-4 text-slate-300">
                The UN Security Council will review your performance annually, adjusting funding based on results.
                Protecting civilian populations and gathering intelligence are your top priorities.
              </p>
              
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-md border border-emerald-900/50 shadow-[0_0_5px_rgba(16,185,129,0.2)]">
                <p className="font-semibold mb-2 text-emerald-400 text-sm">First Steps:</p>
                <p className="text-slate-300 text-sm">
                  Your first critical decision will be selecting where to establish your headquarters. 
                  Different regions offer unique strategic advantages that will affect your operations.
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevPage}
                className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-slate-300 font-medium py-2 px-4 rounded-sm flex items-center gap-2 shadow-md transition-all border-t border-slate-600/50"
              >
                <ChevronLeft size={18} /> Back
              </button>
              <button
                onClick={handleNextPage}
                className="bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-slate-200 font-medium py-2 px-4 rounded-sm flex items-center gap-2 shadow-md transition-all border-t border-emerald-700/50"
              >
                Strategic Locations <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}

        {currentPage === 'locations' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Globe className="text-emerald-500 drop-shadow-[0_0_3px_rgba(16,185,129,0.5)]" size={24} />
                <h2 className="text-xl font-bold text-slate-200">Strategic Locations</h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="mb-2 text-sm text-slate-400">
                Each continent provides unique efficiency modifiers that affect your operations. These are percentage bonuses to effectiveness in different areas.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {Object.values(CONTINENTS).map((continent: Continent) => {
                  // Runtime validation
                  if (!continent || typeof continent.id !== 'string') {
                    console.error('Invalid continent data encountered');
                    return null;
                  }
                  return (
                    <div key={continent.id} className="bg-gradient-to-r from-slate-900 to-slate-800 p-3 rounded-md border border-slate-700/50 shadow-md hover:shadow-[0_0_8px_rgba(16,185,129,0.2)] transition-all">
                      <h4 className="font-bold text-emerald-400">{continent.name}</h4>
                      <ul className="mt-1 space-y-1">
                        <li className="text-sm"><span className="text-slate-400">Max Base Size:</span> <span className="text-slate-300">{continent.maxBaseSize} facilities</span></li>
                        {continent.personnelMultiplier > 1 && (
                          <li className="text-sm"><span className="text-slate-400">Personnel:</span> <span className="text-emerald-400">+{((continent.personnelMultiplier - 1) * 100).toFixed(0)}%</span></li>
                        )}
                        {continent.researchMultiplier > 1 && (
                          <li className="text-sm"><span className="text-slate-400">Research:</span> <span className="text-emerald-400">+{((continent.researchMultiplier - 1) * 100).toFixed(0)}%</span></li>
                        )}
                        {continent.defenseMultiplier > 1 && (
                          <li className="text-sm"><span className="text-slate-400">Defense:</span> <span className="text-emerald-400">+{((continent.defenseMultiplier - 1) * 100).toFixed(0)}%</span></li>
                        )}
                      </ul>
                      <p className="mt-1 text-xs text-slate-400">
                        {continent.id === 'northAmerica' && 'Strong defensive capability. Good for interception operations.'}
                        {continent.id === 'southAmerica' && 'Enhanced personnel efficiency. Good for training specialists.'}
                        {continent.id === 'europe' && 'Superior research facilities. Ideal for technology development.'}
                        {continent.id === 'africa' && 'Balanced region with moderate costs. Suitable for beginners.'}
                        {continent.id === 'asia' && 'Largest base capacity with defensive bonus. Good for comprehensive operations.'}
                        {continent.id === 'oceania' && 'Research-focused with natural isolation. Good for secret projects.'}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-3 rounded-md border border-emerald-900/50 shadow-[0_0_5px_rgba(16,185,129,0.2)]">
                <h4 className="font-bold text-emerald-400 mb-1 text-sm">Getting Started:</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-300">
                  <li>Choose a continent by clicking on it in the world map</li>
                  <li>Build essential facilities: Power Plant, Command Center, and Research Lab</li>
                  <li>Each new base costs $2,000,000 to establish, plus facility costs</li>
                </ol>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevPage}
                className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-slate-300 font-medium py-2 px-4 rounded-sm flex items-center gap-2 shadow-md transition-all border-t border-slate-600/50"
              >
                <ChevronLeft size={18} /> Back
              </button>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-slate-200 font-medium py-2 px-4 rounded-sm flex items-center gap-2 shadow-md transition-all border-t border-emerald-700/50"
              >
                Begin Operations
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IntroModal;