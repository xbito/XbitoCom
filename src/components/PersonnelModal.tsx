import React, { useState, useMemo } from 'react';
import { X, Users, Briefcase, Trophy, DollarSign, Activity, Building2, GraduationCap, MapPin, Layers, Shield } from 'lucide-react';
import { Personnel, PersonnelRole, GameState, Base, Facility } from '../types';
import { ROLE_DESCRIPTIONS, generatePersonnel, INITIAL_SKILLS, BASE_SALARIES } from '../data/personnel';
import { canAssignPersonnelToFacility } from '../data/basePersonnel';
import { FACILITY_TYPES } from '../data/facilities';
import ConfirmationDialog from './ConfirmationDialog';

// Extended personnel type with location information for the display
interface AssignedPersonnelDisplay extends Personnel {
  baseName: string;
  facilityName?: string;
  vehicleName?: string;
  assignmentType: 'facility' | 'vehicle' | 'base';
}

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
  const [activeTab, setActiveTab] = useState<'available' | 'assigned'>('available');
  const [selectedAssignedPersonnel, setSelectedAssignedPersonnel] = useState<AssignedPersonnelDisplay | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'hire' | 'assign' | 'train';
    data: {
      personnel?: Personnel;
      role?: PersonnelRole;
      baseId?: string;
      facilityId?: string;
      skill?: keyof Personnel['skills'];
    };
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Create a list of all personnel assigned to bases, facilities, and vehicles
  const assignedPersonnel = useMemo(() => {
    const assigned: AssignedPersonnelDisplay[] = [];
    
    gameState?.bases?.forEach(base => {
      // Add personnel assigned directly to the base
      base.personnel.forEach(person => {
        assigned.push({
          ...person,
          baseName: base.name,
          assignmentType: 'base'
        });
      });
      
      // Add personnel assigned to facilities
      base.facilities.forEach(facility => {
        facility.personnel.forEach(person => {
          assigned.push({
            ...person,
            baseName: base.name,
            facilityName: FACILITY_TYPES[facility.type]?.name || facility.type,
            assignmentType: 'facility'
          });
        });
      });
      
      // Add personnel assigned to vehicles
      base.vehicles.forEach(vehicle => {
        vehicle.crew.forEach(person => {
          assigned.push({
            ...person,
            baseName: base.name,
            vehicleName: vehicle.name,
            assignmentType: 'vehicle'
          });
        });
      });
    });
    
    return assigned;
  }, [gameState?.bases]);

  const handleHire = () => {
    if (!selectedRole) return;
    setPendingAction({
      type: 'hire',
      data: { role: selectedRole }
    });
    setShowConfirmation(true);
  };

  const handleStartTraining = (skill: keyof Personnel['skills']) => {
    if (!selectedPersonnel) return;
    setPendingAction({
      type: 'train',
      data: { personnel: selectedPersonnel, skill }
    });
    setShowConfirmation(true);
  };

  const handleAssignToFacility = (facilityId: string) => {
    if (!selectedPersonnel || !selectedBase) return;

    // Validate assignment
    const facility = selectedBase.facilities.find(f => f.id === facilityId);
    if (!facility) {
      setErrorMessage('Facility not found');
      return;
    }

    const { canAssign, message } = canAssignPersonnelToFacility(facility, selectedPersonnel);
    if (!canAssign) {
      setErrorMessage(message);
      return;
    }

    setPendingAction({
      type: 'assign',
      data: { 
        personnel: selectedPersonnel,
        baseId: selectedBase.id,
        facilityId
      }
    });
    setShowConfirmation(true);
  };

  const handleConfirmAction = () => {
    if (!pendingAction) return;

    try {
      switch (pendingAction.type) {
        case 'hire': {
          if (!pendingAction.data.role) return;
          const newPersonnel = generatePersonnel(pendingAction.data.role);
          onHire(newPersonnel);
          setSelectedRole(null);
          break;
        }
        case 'train': {
          const { personnel, skill } = pendingAction.data;
          if (!personnel || !skill) return;
          onTrain(personnel.id, skill);
          setShowTrainingOptions(false);
          setSelectedPersonnel({
            ...personnel,
            status: 'training'
          });
          break;
        }
        case 'assign': {
          const { personnel, baseId, facilityId } = pendingAction.data;
          if (!personnel || !baseId || !facilityId) return;
          onAssign(personnel.id, baseId, facilityId);
          setShowAssignmentOptions(false);
          setSelectedBase(null);
          setSelectedPersonnel({
            ...personnel,
            baseId,
            assignedFacilityId: facilityId,
            status: 'working'
          });
          break;
        }
      }
    } catch (error) {
      console.error('Action failed:', error);
      setErrorMessage('Failed to complete the action. Please try again.');
    }

    setShowConfirmation(false);
    setPendingAction(null);
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

  // Helper function for assertions
  const validateValue = (condition: boolean, message: string): void => {
    if (!condition) {
      console.error(message);
      throw new Error(message);
    }
  };

  // Updated skill bar rendering with glowing effect
  const renderSkillBar = (value: number, label: string, key: string) => {
    validateValue(value >= 0 && value <= 100, `Skill value must be between 0 and 100, got ${value}`);
    return (
      <div key={key} className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">{label}</span>
          <span className="text-green-300">{value}</span>
        </div>
        <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-800 to-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  };
  
  // Helper to get assignment location display text
  const getAssignmentLocation = (person: AssignedPersonnelDisplay) => {
    if (person.assignmentType === 'facility') {
      return `${person.facilityName} at ${person.baseName}`;
    } else if (person.assignmentType === 'vehicle') {
      return `${person.vehicleName} at ${person.baseName}`;
    } else {
      return person.baseName;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Users className="text-green-400" size={24} />
              <h2 className="text-xl font-medium text-gray-200">Personnel Management</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-green-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex mb-6">
            <button
              onClick={() => {
                setActiveTab('available');
                setSelectedAssignedPersonnel(null);
              }}
              className={`flex-1 py-2 ${activeTab === 'available' 
                ? 'bg-gray-800 text-green-400 border-b-2 border-green-400' 
                : 'bg-gray-900 text-gray-400 hover:text-gray-200'} transition-colors`}
            >
              Available Personnel
            </button>
            <button
              onClick={() => {
                setActiveTab('assigned');
                setSelectedPersonnel(null);
              }}
              className={`flex-1 py-2 ${activeTab === 'assigned' 
                ? 'bg-gray-800 text-green-400 border-b-2 border-green-400' 
                : 'bg-gray-900 text-gray-400 hover:text-gray-200'} transition-colors`}
            >
              Assigned Personnel
            </button>
          </div>

          {activeTab === 'available' && (
            <div className="grid grid-cols-2 gap-6">
              {/* Hiring Panel */}
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-medium mb-4 text-gray-200">Hire New Personnel</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {(Object.keys(ROLE_DESCRIPTIONS) as PersonnelRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`p-3 rounded-lg transition-all ${
                        selectedRole === role
                          ? 'bg-gradient-to-r from-green-900 to-gray-800 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                          : 'bg-gray-800 hover:bg-gray-750 text-gray-300'
                      }`}
                    >
                      <div className="font-medium capitalize">{role}</div>
                      <div className="text-sm text-gray-400">{ROLE_DESCRIPTIONS[role]}</div>
                    </button>
                  ))}
                </div>
                {selectedRole && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2 text-gray-300">Preview</h4>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="mb-4">
                        <div className="text-lg font-medium capitalize text-green-300">{selectedRole}</div>
                        <div className="text-sm text-gray-400">{ROLE_DESCRIPTIONS[selectedRole]}</div>
                      </div>
                      {Object.entries(INITIAL_SKILLS[selectedRole]).map(([skill, value]) => (
                        renderSkillBar(value, skill.charAt(0).toUpperCase() + skill.slice(1), skill)
                      ))}
                      <button
                        onClick={handleHire}
                        className="w-full mt-4 bg-gradient-to-r from-green-800 to-green-600 hover:from-green-700 hover:to-green-500 text-gray-200 font-medium py-2 px-4 rounded flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(34,197,94,0.2)]"
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
                <h3 className="text-lg font-medium mb-4 text-gray-200">Available Personnel</h3>
                <div className="space-y-3">
                  {gameState?.availablePersonnel?.map((person) => (
                    <button
                      key={person.id}
                      onClick={() => setSelectedPersonnel(person)}
                      className={`w-full text-left p-4 rounded-lg border ${
                        selectedPersonnel?.id === person.id
                          ? 'bg-gradient-to-r from-green-900 to-gray-800 border-green-700 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                          : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                      } transition-all`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium text-gray-200">{person.name}</div>
                          <div className="text-sm text-gray-400 capitalize">{person.role}</div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Activity size={16} className="text-green-400" />
                          <span className="capitalize text-gray-300">{person.status}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Trophy size={14} className="text-yellow-500" />
                          <span className="text-gray-300">Exp: {person.experience}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase size={14} className="text-green-400" />
                          <span className="text-gray-300">{person.baseId ? 'Assigned' : 'Unassigned'}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                  {(!gameState?.availablePersonnel || gameState.availablePersonnel.length === 0) && (
                    <div className="text-gray-500 text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                      No personnel available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assigned' && (
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-200">Assigned Personnel by Location</h3>
              <div className="space-y-3">
                {assignedPersonnel.map((person) => (
                  <button
                    key={person.id}
                    onClick={() => setSelectedAssignedPersonnel(
                      selectedAssignedPersonnel?.id === person.id ? null : person
                    )}
                    className={`w-full text-left p-4 rounded-lg border ${
                      selectedAssignedPersonnel?.id === person.id
                        ? 'bg-gradient-to-r from-green-900 to-gray-800 border-green-700 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                        : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                    } transition-all`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-200">{person.name}</div>
                        <div className="text-sm text-gray-400 capitalize">{person.role}</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity size={16} className="text-green-400" />
                        <span className="capitalize text-gray-300">{person.status}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Trophy size={14} className="text-yellow-500" />
                        <span className="text-gray-300">Exp: {person.experience}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-green-400" />
                        <span className="text-gray-300">{getAssignmentLocation(person)}</span>
                      </div>
                    </div>
                  </button>
                ))}
                {(!assignedPersonnel || assignedPersonnel.length === 0) && (
                  <div className="text-gray-500 text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                    No personnel assigned
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Personnel Details */}
          {activeTab === 'available' && selectedPersonnel && (
            <div className="mt-6 bg-gray-850 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-medium mb-4 text-gray-200">Personnel Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2 text-gray-300">Skills</h4>
                  {Object.entries(selectedPersonnel.skills).map(([skill, value]) => (
                    renderSkillBar(value, skill.charAt(0).toUpperCase() + skill.slice(1), skill)
                  ))}
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-gray-300">Actions</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowTrainingOptions(true)}
                      disabled={selectedPersonnel.status !== 'available'}
                      className="w-full bg-gradient-to-r from-purple-900 to-purple-700 hover:from-purple-800 hover:to-purple-600 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-gray-200 font-medium py-2 px-4 rounded flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(147,51,234,0.2)]"
                    >
                      <GraduationCap size={16} />
                      Start Training
                    </button>
                    <button
                      onClick={() => setShowAssignmentOptions(true)}
                      disabled={selectedPersonnel.status !== 'available'}
                      className="w-full bg-gradient-to-r from-green-900 to-green-700 hover:from-green-800 hover:to-green-600 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-gray-200 font-medium py-2 px-4 rounded flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                    >
                      <Building2 size={16} />
                      Assign to Base
                    </button>
                  </div>

                  {/* Training Options */}
                  {showTrainingOptions && (
                    <div className="mt-4 bg-gray-850 rounded-lg p-4 border border-purple-900 shadow-[0_0_10px_rgba(147,51,234,0.2)]">
                      <h5 className="font-medium mb-2 text-purple-300">Select Skill to Train</h5>
                      <div className="space-y-2">
                        {Object.entries(selectedPersonnel.skills).map(([skill, value]) => (
                          <button
                            key={skill}
                            onClick={() => handleStartTraining(skill as keyof Personnel['skills'])}
                            disabled={value >= 100}
                            className="w-full text-left p-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <span className="capitalize text-gray-300">{skill}</span>
                              <span className="text-purple-300">{value}/100</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Base Assignment Options */}
                  {showAssignmentOptions && (
                    <div className="mt-4 bg-gray-850 rounded-lg p-4 border border-green-900 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                      <h5 className="font-medium mb-2 text-green-300">Select Base</h5>
                      <div className="space-y-2">
                        {gameState?.bases?.map(base => (
                          <button
                            key={base.id}
                            onClick={() => setSelectedBase(base)}
                            className={`w-full text-left p-2 rounded hover:bg-gray-800 transition-colors ${
                              selectedBase?.id === base.id ? 'bg-gray-800 text-green-300' : 'text-gray-300'
                            }`}
                          >
                            {base.name}
                          </button>
                        ))}
                        {(!gameState?.bases || gameState.bases.length === 0) && (
                          <div className="text-gray-500 text-center p-2">
                            No bases available
                          </div>
                        )}
                      </div>

                      {selectedBase && (
                        <div className="mt-4">
                          <h5 className="font-medium mb-2 text-green-300">Select Facility</h5>
                          <div className="space-y-2">
                            {getFacilitiesForRole(selectedBase, selectedPersonnel.role).map(facility => (
                              <button
                                key={facility.id}
                                onClick={() => handleAssignToFacility(facility.id)}
                                className="w-full text-left p-2 rounded hover:bg-gray-800 text-gray-300 transition-colors"
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
          
          {/* Selected Assigned Personnel Details */}
          {activeTab === 'assigned' && selectedAssignedPersonnel && (
            <div className="mt-6 bg-gray-850 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-medium mb-4 text-gray-200">Personnel Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2 text-gray-300">Skills</h4>
                  {Object.entries(selectedAssignedPersonnel.skills).map(([skill, value]) => (
                    renderSkillBar(value, skill.charAt(0).toUpperCase() + skill.slice(1), skill)
                  ))}
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-gray-300">Assignment</h4>
                  <div className="space-y-2 bg-gray-900 p-4 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-2">
                      <Building2 className="text-green-400" size={16} />
                      <div>
                        <div className="text-sm text-gray-400">Base</div>
                        <div className="text-gray-200">{selectedAssignedPersonnel.baseName}</div>
                      </div>
                    </div>
                    
                    {selectedAssignedPersonnel.assignmentType === 'facility' && (
                      <div className="flex items-center gap-2">
                        <Layers className="text-purple-400" size={16} />
                        <div>
                          <div className="text-sm text-gray-400">Facility</div>
                          <div className="text-gray-200">{selectedAssignedPersonnel.facilityName}</div>
                        </div>
                      </div>
                    )}
                    
                    {selectedAssignedPersonnel.assignmentType === 'vehicle' && (
                      <div className="flex items-center gap-2">
                        <Shield className="text-red-400" size={16} />
                        <div>
                          <div className="text-sm text-gray-400">Vehicle</div>
                          <div className="text-gray-200">{selectedAssignedPersonnel.vehicleName}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Activity size={16} className="text-yellow-400" />
                      <div>
                        <div className="text-sm text-gray-400">Status</div>
                        <div className="capitalize text-gray-200">{selectedAssignedPersonnel.status}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setPendingAction(null);
        }}
        onConfirm={handleConfirmAction}
        title={
          pendingAction?.type === 'hire'
            ? 'Confirm Hire'
            : pendingAction?.type === 'train'
            ? 'Confirm Training'
            : 'Confirm Assignment'
        }
        message={
          !pendingAction ? '' :
          pendingAction.type === 'hire' && pendingAction.data.role
            ? `Are you sure you want to hire a new ${pendingAction.data.role} for $${BASE_SALARIES[pendingAction.data.role].toLocaleString()}/year?`
            : pendingAction.type === 'train' && pendingAction.data.personnel && pendingAction.data.skill
            ? `Start training ${pendingAction.data.personnel.name} in ${pendingAction.data.skill}?`
            : pendingAction.type === 'assign' && pendingAction.data.personnel
            ? `Assign ${pendingAction.data.personnel.name} to this facility?`
            : ''
        }
        confirmText={
          pendingAction?.type === 'hire'
            ? 'Hire'
            : pendingAction?.type === 'train'
            ? 'Start Training'
            : 'Assign'
        }
      />

      {errorMessage && (
        <ConfirmationDialog
          isOpen={true}
          onClose={() => setErrorMessage(null)}
          onConfirm={() => setErrorMessage(null)}
          title="Error"
          message={errorMessage}
          confirmText="OK"
        />
      )}
    </>
  );
};

export default PersonnelModal;