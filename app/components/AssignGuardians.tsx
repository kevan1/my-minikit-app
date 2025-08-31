"use client";

import { useState } from "react";

type Guardian = {
  id: string;
  address: string;
};

type AssignGuardiansProps = {
  guardians: Guardian[];
  onAddGuardian: (address: string) => void;
  onRemoveGuardian: (id: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function AssignGuardians({
  guardians,
  onAddGuardian,
  onRemoveGuardian,
  onContinue,
  onBack,
}: AssignGuardiansProps) {
  const [newGuardianAddress, setNewGuardianAddress] = useState("");
  const [error, setError] = useState("");

  // Basic address validation (checks for hex format and length)
  const validateAddress = (address: string): boolean => {
    const cleanAddress = address.trim();
    return /^0x[a-fA-F0-9]{40}$/.test(cleanAddress);
  };

  const handleAddGuardian = () => {
    const trimmedAddress = newGuardianAddress.trim();
    
    if (!trimmedAddress) {
      setError("Please enter a wallet address");
      return;
    }

    if (!validateAddress(trimmedAddress)) {
      setError("Please enter a valid wallet address (0x...)");
      return;
    }

    // Check for duplicates
    if (guardians.some(g => g.address.toLowerCase() === trimmedAddress.toLowerCase())) {
      setError("This guardian has already been added");
      return;
    }

    setError("");
    onAddGuardian(trimmedAddress);
    setNewGuardianAddress("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddGuardian();
    }
  };

  const canContinue = guardians.length >= 1; // Require at least 1 guardian

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
            ✓
          </div>
          <div className="w-12 h-0.5 bg-green-500"></div>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
            2
          </div>
          <div className="w-12 h-0.5 bg-gray-600"></div>
          <div className="w-8 h-8 rounded-full bg-gray-600 text-gray-300 flex items-center justify-center text-sm">
            3
          </div>
        </div>
      </div>

      {/* ASCII Art Header */}
      <div className="text-center mb-6">
        <pre className="font-mono text-green-400 text-xs sm:text-xs mb-4 leading-tight overflow-x-auto">
{`   ╔══════════════════════════╗
   ║    👥 VAULT GUARDIANS 👥  ║
   ║  ┌─────────────────────┐  ║
   ║  │ [🛡️]  [🛡️]  [🛡️] │  ║
   ║  │  TRUSTED PROTECTORS │  ║
   ║  └─────────────────────┘  ║
   ╚══════════════════════════╝`}
        </pre>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
          Step 2 of 3: Assign Guardians
        </h1>
        <p className="text-gray-400 leading-relaxed text-sm sm:text-base px-2">
          Add trusted wallet addresses who will verify your passing and protect your assets
        </p>
      </div>

      {/* Add Guardian Input */}
      <div className="mb-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Guardian</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Wallet Address
              </label>
              <input
                type="text"
                value={newGuardianAddress}
                onChange={(e) => {
                  setNewGuardianAddress(e.target.value);
                  if (error) setError("");
                }}
                onKeyPress={handleKeyPress}
                placeholder="0x742d35Cc6432C8Cf6..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
              />
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
            </div>
            
            <button
              onClick={handleAddGuardian}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
              disabled={!newGuardianAddress.trim()}
            >
              Add Guardian
            </button>
          </div>
        </div>
      </div>

      {/* Current Guardians List */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Current Guardians ({guardians.length})
        </h3>
        
        {guardians.length === 0 ? (
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-8 text-center">
            <div className="text-gray-500 font-mono text-sm mb-2">
              ┌─────────────────────┐<br />
              │   No guardians yet  │<br />
              └─────────────────────┘
            </div>
            <p className="text-gray-400 text-sm">
              Add at least one trusted guardian to continue
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {guardians.map((guardian, index) => (
              <div
                key={guardian.id}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 sm:p-4 hover:bg-gray-800/50 transition-colors duration-200 guardian-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-green-900/50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                      🛡️
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-300">
                        Guardian {index + 1}
                      </p>
                      <p className="text-xs sm:text-sm font-mono text-white truncate guardian-address mono-responsive">
                        {guardian.address}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveGuardian(guardian.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    title="Remove guardian"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guardian Requirements Info */}
      <div className="mb-8 bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 text-blue-400 mt-0.5">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-300 mb-2">
              Guardian Requirements
            </h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Minimum 1 guardian required</li>
              <li>• Guardians will verify your passing through multi-signature</li>
              <li>• Choose people you trust completely</li>
              <li>• Consider selecting 2-3 guardians for redundancy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-400 hover:text-white transition-colors duration-200"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className={`px-8 py-3 font-semibold rounded-lg transition-colors duration-200 border ${
            canContinue
              ? "bg-white hover:bg-gray-100 text-black border-gray-300"
              : "bg-gray-700 text-gray-400 cursor-not-allowed border-gray-700"
          }`}
        >
          Continue to Vault
        </button>
      </div>
    </div>
  );
}
