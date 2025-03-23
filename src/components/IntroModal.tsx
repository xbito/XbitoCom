import React, { useState } from 'react';
import { AlertTriangle, X, Map, Info, ChevronLeft, ChevronRight, Shield, Globe } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto">
        {currentPage === 'crisis' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-yellow-400" size={24} />
                <h2 className="text-2xl font-bold">Global Crisis Alert</h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg mb-4">
                <strong>January 1st, 2025</strong> - The world stands at a critical juncture. Over the past six months, 
                there has been an unprecedented surge in UFO sightings and unexplained phenomena across the globe.
              </p>
              <p className="mb-4">
                What was once dismissed as conspiracy theories can no longer be ignored. Governments worldwide 
                are receiving reports of advanced craft performing impossible maneuvers in our skies. Some reports 
                indicate potential interference with military installations and civilian infrastructure.
              </p>
              <p className="mb-4">
                In response to this escalating crisis, the United Nations Security Council has established the 
                <strong> Global Defense Agency (GDA)</strong> - a specialized organization tasked with investigating, 
                researching, and defending against potential extraterrestrial threats.
              </p>
              
              <div className="bg-slate-700 p-4 rounded-lg mt-6">
                <p className="text-yellow-400 font-semibold mb-2">WARNING:</p>
                <p>
                  Intelligence suggests that alien activity is increasing. Time is of the essence. 
                  The fate of humanity may depend on your decisions.
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <div></div> {/* Empty div for spacing */}
              <button
                onClick={handleNextPage}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
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
                <Shield className="text-blue-400" size={24} />
                <h2 className="text-2xl font-bold">Your Role as GDA Director</h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg mb-4">
                As the newly appointed Director of the GDA, you have been granted:
              </p>
              <ul className="mb-4">
                <li>Initial funding of $20,000,000</li>
                <li>Authority to establish operations globally</li>
                <li>Control over personnel recruitment and resource allocation</li>
                <li>Mandate to develop countermeasures against the alien threat</li>
              </ul>
              
              <p className="mb-4">
                Your immediate objectives:
              </p>
              <ul className="mb-6">
                <li>Establish your first operational base in a strategic location</li>
                <li>Recruit specialized personnel for your operations</li>
                <li>Begin research into alien technology</li>
                <li>Build a detection network to monitor for extraterrestrial activity</li>
              </ul>
              
              <p className="mb-4">
                The UN Security Council will review your performance annually, adjusting funding based on results.
                Protecting civilian populations and gathering intelligence are your top priorities.
              </p>
              
              <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-700">
                <p className="font-semibold mb-2">First Steps:</p>
                <p>
                  Your first critical decision will be selecting where to establish your headquarters. 
                  Different regions offer unique strategic advantages that will affect your operations.
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevPage}
                className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
              >
                <ChevronLeft size={18} /> Back
              </button>
              <button
                onClick={handleNextPage}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
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
                <Globe className="text-blue-400" size={24} />
                <h2 className="text-2xl font-bold">Strategic Locations</h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="mb-2 text-sm text-gray-300">
                Each continent provides unique efficiency modifiers that affect your operations. These are percentage bonuses to effectiveness in different areas.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {Object.values(CONTINENTS).map((continent: Continent) => (
                  <div key={continent.id} className="bg-slate-700 p-3 rounded-lg">
                    <h4 className="font-bold text-blue-300">{continent.name}</h4>
                    <ul className="mt-1 space-y-1">
                      <li><span className="text-gray-300">Max Base Size:</span> {continent.maxBaseSize} facilities</li>
                      {continent.personnelMultiplier > 1 && (
                        <li><span className="text-gray-300">Personnel:</span> <span className="text-green-400">+{((continent.personnelMultiplier - 1) * 100).toFixed(0)}%</span></li>
                      )}
                      {continent.researchMultiplier > 1 && (
                        <li><span className="text-gray-300">Research:</span> <span className="text-green-400">+{((continent.researchMultiplier - 1) * 100).toFixed(0)}%</span></li>
                      )}
                      {continent.defenseMultiplier > 1 && (
                        <li><span className="text-gray-300">Defense:</span> <span className="text-green-400">+{((continent.defenseMultiplier - 1) * 100).toFixed(0)}%</span></li>
                      )}
                    </ul>
                    <p className="mt-1 text-sm">
                      {continent.id === 'northAmerica' && 'Strong defensive capability. Good for interception operations.'}
                      {continent.id === 'southAmerica' && 'Enhanced personnel efficiency. Good for training specialists.'}
                      {continent.id === 'europe' && 'Superior research facilities. Ideal for technology development.'}
                      {continent.id === 'africa' && 'Balanced region with moderate costs. Suitable for beginners.'}
                      {continent.id === 'asia' && 'Largest base capacity with defensive bonus. Good for comprehensive operations.'}
                      {continent.id === 'oceania' && 'Research-focused with natural isolation. Good for secret projects.'}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-900 bg-opacity-30 p-3 rounded-lg border border-blue-700">
                <h4 className="font-bold text-blue-300 mb-1">Getting Started:</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Choose a continent by clicking on it in the world map</li>
                  <li>Build essential facilities: Power Plant, Command Center, and Research Lab</li>
                  <li>Each new base costs $2,000,000 to establish, plus facility costs</li>
                </ol>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevPage}
                className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
              >
                <ChevronLeft size={18} /> Back
              </button>
              <button
                onClick={onClose}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
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