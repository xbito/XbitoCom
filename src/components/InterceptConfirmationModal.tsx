import React from 'react';
import { UFO, Vehicle } from '../types'; // Ensure Vehicle type is imported

interface InterceptConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (vehicle: Vehicle) => void; // Expect a vehicle to be passed on confirm
  ufo: UFO | null;
  availableVehicles: Vehicle[]; // Pass available vehicles to the modal
}

const InterceptConfirmationModal: React.FC<InterceptConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  ufo,
  availableVehicles,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | null>(null);

  if (!isOpen || !ufo) return null;

  const handleConfirm = () => {
    const vehicleToIntercept = availableVehicles.find(v => v.id === selectedVehicleId);
    if (vehicleToIntercept) {
      onConfirm(vehicleToIntercept);
    } else {
      alert("Please select a vehicle to intercept.");
    }
  };

  // Filter for vehicles that are 'ready' and 'interceptor' type
  const readyInterceptors = availableVehicles.filter(
    v => v.status === 'ready' && v.type === 'interceptor'
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full text-white border border-slate-700">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">Confirm Interception</h2>
        <p className="mb-2">
          UFO Detected: <span className="font-medium text-yellow-400">{ufo.name}</span> (Type: {ufo.type})
        </p>
        <p className="mb-6">
          Location: ({ufo.location.x.toFixed(0)}, {ufo.location.y.toFixed(0)})
        </p>

        {readyInterceptors.length > 0 ? (
          <div className="mb-4">
            <label htmlFor="vehicleSelect" className="block text-sm font-medium text-slate-300 mb-1">
              Select Interceptor:
            </label>
            <select
              id="vehicleSelect"
              value={selectedVehicleId || ""}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="" disabled>-- Choose a Vehicle --</option>
              {readyInterceptors.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} (Base: {vehicle.baseId}) - Condition: {vehicle.condition}%
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-red-400 mb-4">No 'ready' interceptors available.</p>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedVehicleId || readyInterceptors.length === 0}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
          >
            Launch Interceptor
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterceptConfirmationModal;
