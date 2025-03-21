import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface IntroModalProps {
  onClose: () => void;
}

const IntroModal: React.FC<IntroModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto">
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
            What was once dismissed as conspiracy theories can no longer be ignored.
          </p>

          <p className="mb-4">
            In response to this escalating crisis, the United Nations Security Council has established the 
            Global Defense Agency (GDA) - a specialized organization tasked with investigating, researching, 
            and defending against potential extraterrestrial threats.
          </p>

          <p className="mb-4">
            As the newly appointed Director of the GDA, you have been granted:
          </p>

          <ul className="mb-4">
            <li>Initial funding of $10,000,000</li>
            <li>A basic operational base in North America</li>
            <li>A small team of essential personnel</li>
            <li>Authority to expand operations globally</li>
          </ul>

          <p className="mb-4">
            Your immediate objectives:
          </p>

          <ul className="mb-4">
            <li>Establish a functional research program to understand the alien technology</li>
            <li>Build a network of detection and response facilities</li>
            <li>Recruit and train specialized personnel</li>
            <li>Manage resources efficiently to maintain global defense capabilities</li>
          </ul>

          <div className="bg-slate-700 p-4 rounded-lg mt-6">
            <p className="text-yellow-400 font-semibold mb-2">WARNING:</p>
            <p>
              Intelligence suggests that alien activity is increasing. Time is of the essence. 
              The fate of humanity may depend on your decisions.
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Begin Operations
        </button>
      </div>
    </div>
  );
};

export default IntroModal;