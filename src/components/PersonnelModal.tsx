import React, { useState } from 'react';
import { X, Users, Briefcase, Trophy, DollarSign, Activity, Building2, GraduationCap } from 'lucide-react';
import { Personnel, PersonnelRole, GameState, Base, Facility } from '../types';
import { ROLE_DESCRIPTIONS, generatePersonnel, INITIAL_SKILLS, BASE_SALARIES } from '../data/personnel';

interface PersonnelModalProps {
  onClose: () => void;
  gameState: GameState;
  onHire: (personnel: Personnel) => void;
  onAssign: (personnelId: string, baseId: string, facilityId: string) => void;
  onTrain: (personnelId: string, skill: keyof Personnel['skills']) => void;
}

const PersonnelModal: React.FC<PersonnelModalProps> = ({
  onClose,
  gameState,
  onHire,
  onAssign,
  onTrain,
}) => {
  const [selectedRole, setSelectedRole] = useState<PersonnelRole | null>(null);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [showTrainingOptions, setShowTrainingOptions] = useState(false);
  const [showAssignmentOptions, setShowAssignmentOptions] = useState(false);
  const [selectedBase, setSelectedBase] = useState<Base | null>(null);

  const handleHire = () => {
    if (!selectedRole) return;
    const newPersonnel = generatePersonnel(selectedRole);
    onHire(newPersonnel);
    setSelectedRole(null);
  };

  const handleStartTraining = (skill: keyof Personnel['skills']) => {
    if (!selectedPersonnel) return;
    onTrain(selectedPersonnel.id, skill);
    setShowTrainingOptions(false);
    setSelectedPersonnel({
      ...selectedPersonnel,
      status: 'training'
    });
  };

  const handleAssignToFacility = (facilityId: string) => {
    if (!selectedPersonnel || !selectedBase) return;
    onAssign(selectedPersonnel.id, selectedBase.id, facilityId);
    setShowAssignmentOptions(false);
    setSelectedBase(null);
    setSelectedPersonnel({
      ...selectedPersonnel,
      baseId: selectedBase.id,
      assignedFacilityId: facilityId,
      status: 'working'
    });
  };

  const getFacilitiesForRole = (base: Base, role: PersonnelRole): Facility[] => {
    const roleToFacilityMap: Record<PersonnelRole, string[]> = {
      scientist: ['research'],
      engineer: ['powerPlant', 'hangar'],
      soldier: ['barracks', 'defense'],
      medic: ['barracks'],
      commander: ['barracks', 'defense'],
      pilot: ['hangar']
    };

    const allowedFacilities = roleToFacilityMap[role] || [];
    return base.facilities.filter(f => allowedFacilities.includes(f.type));
  };

  const renderSkillBar = (value: number, label: string, key: string) => (
    <div key={key} className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold">Personnel Management</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Hiring Panel */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Hire New Personnel</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {(Object.keys(ROLE_DESCRIPTIONS) as PersonnelRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`p-3 rounded-lg ${
                    selectedRole === role
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                >
                  <div className="font-medium capitalize">{role}</div>
                  <div className="text-sm text-slate-300">{ROLE_DESCRIPTIONS[role]}</div>
                </button>
              ))}
            </div>
            {selectedRole && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Preview</h4>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="mb-4">
                    <div className="text-lg font-medium capitalize">{selectedRole}</div>
                    <div className="text-sm text-slate-400">{ROLE_DESCRIPTIONS[selectedRole]}</div>
                  </div>
                  {Object.entries(INITIAL_SKILLS[selectedRole]).map(([skill, value]) => (
                    renderSkillBar(value, skill.charAt(0).toUpperCase() + skill.slice(1), skill)
                  ))}
                  <button
                    onClick={handleHire}
                    className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
                  >
                    <DollarSign size={16} />
                    Hire ({BASE_SALARIES[selectedRole].toLocaleString()}/year)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Personnel List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Available Personnel</h3>
            <div className="space-y-3">
              {gameState?.availablePersonnel?.map((person) => (
                <button
                  key={person.id}
                  onClick={() => setSelectedPersonnel(person)}
                  className={`w-full text-left p-4 rounded-lg ${
                    selectedPersonnel?.id === person.id
                      ? 'bg-blue-500'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{person.name}</div>
                      <div className="text-sm text-slate-300 capitalize">{person.role}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Activity size={16} />
                      <span className="capitalize">{person.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Trophy size={14} className="text-yellow-400" />
                      <span>Exp: {person.experience}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase size={14} className="text-blue-400" />
                      <span>{person.baseId ? 'Assigned' : 'Unassigned'}</span>
                    </div>
                  </div>
                </button>
              ))}
              {(!gameState?.availablePersonnel || gameState.availablePersonnel.length === 0) && (
                <div className="text-slate-400 text-center p-4">
                  No personnel available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Personnel Details */}
        {selectedPersonnel && (
          <div className="mt-6 bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Personnel Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Skills</h4>
                {Object.entries(selectedPersonnel.skills).map(([skill, value]) => (
                  renderSkillBar(value, skill.charAt(0).toUpperCase() + skill.slice(1), skill)
                ))}
              </div>
              <div>
                <h4 className="font-medium mb-2">Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowTrainingOptions(true)}
                    disabled={selectedPersonnel.status !== 'available'}
                    className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
                  >
                    <GraduationCap size={16} />
                    Start Training
                  </button>
                  <button
                    onClick={() => setShowAssignmentOptions(true)}
                    disabled={selectedPersonnel.status !== 'available'}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
                  >
                    <Building2 size={16} />
                    Assign to Base
                  </button>
                </div>

                {/* Training Options */}
                {showTrainingOptions && (
                  <div className="mt-4 bg-slate-800 rounded-lg p-4">
                    <h5 className="font-medium mb-2">Select Skill to Train</h5>
                    <div className="space-y-2">
                      {Object.entries(selectedPersonnel.skills).map(([skill, value]) => (
                        <button
                          key={skill}
                          onClick={() => handleStartTraining(skill as keyof Personnel['skills'])}
                          disabled={value >= 100}
                          className="w-full text-left p-2 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex justify-between items-center">
                            <span className="capitalize">{skill}</span>
                            <span>{value}/100</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Base Assignment Options */}
                {showAssignmentOptions && (
                  <div className="mt-4 bg-slate-800 rounded-lg p-4">
                    <h5 className="font-medium mb-2">Select Base</h5>
                    <div className="space-y-2">
                      {gameState?.bases?.map(base => (
                        <button
                          key={base.id}
                          onClick={() => setSelectedBase(base)}
                          className={`w-full text-left p-2 rounded hover:bg-slate-700 ${
                            selectedBase?.id === base.id ? 'bg-slate-700' : ''
                          }`}
                        >
                          {base.name}
                        </button>
                      ))}
                      {(!gameState?.bases || gameState.bases.length === 0) && (
                        <div className="text-slate-400 text-center p-2">
                          No bases available
                        </div>
                      )}
                    </div>

                    {selectedBase && (
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">Select Facility</h5>
                        <div className="space-y-2">
                          {getFacilitiesForRole(selectedBase, selectedPersonnel.role).map(facility => (
                            <button
                              key={facility.id}
                              onClick={() => handleAssignToFacility(facility.id)}
                              className="w-full text-left p-2 rounded hover:bg-slate-700"
                            >
                              {facility.type.charAt(0).toUpperCase() + facility.type.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonnelModal;