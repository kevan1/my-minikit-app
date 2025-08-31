"use client";

import { useState } from "react";

type VerificationSetupProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function VerificationSetup({ onBack, onContinue }: VerificationSetupProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['guardian']);

  const handleOptionToggle = (option: string) => {
    if (option === 'guardian') {
      // Guardian verification is required and can't be unchecked
      return;
    }
    
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const isSelected = (option: string) => selectedOptions.includes(option);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <div className="w-12 h-0.5 bg-gray-600"></div>
          <div className="w-8 h-8 rounded-full bg-gray-600 text-gray-300 flex items-center justify-center text-sm">
            2
          </div>
          <div className="w-12 h-0.5 bg-gray-600"></div>
          <div className="w-8 h-8 rounded-full bg-gray-600 text-gray-300 flex items-center justify-center text-sm">
            3
          </div>
          <div className="w-12 h-0.5 bg-gray-600"></div>
          <div className="w-8 h-8 rounded-full bg-gray-600 text-gray-300 flex items-center justify-center text-sm">
            4
          </div>
        </div>
      </div>

      {/* Title and Description */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-3">
          How should we verify your passing?
        </h1>
        <p className="text-gray-400 leading-relaxed">
          Choose how your passing should be verified before assets are distributed
        </p>
      </div>

      {/* Verification Options */}
      <div className="space-y-4 mb-8">
        {/* Guardian Verification - Required/Selected */}
        <div className={`p-6 rounded-xl border transition-all duration-200 ${
          isSelected('guardian') 
            ? 'border-green-500 bg-green-50/5' 
            : 'border-gray-700 bg-gray-800/30'
        }`}>
          <div className="flex items-start space-x-4">
            <div className="mt-1">
              <input
                type="checkbox"
                checked={isSelected('guardian')}
                onChange={() => handleOptionToggle('guardian')}
                disabled={true}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500 focus:ring-2"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-white">
                  Guardian verification (required)
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Trusted people who confirm your passing via multi-signature verification
              </p>
              
            </div>
          </div>
        </div>

        {/* Government Registry Check */}
        <div className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer ${
          isSelected('government') 
            ? 'border-green-500 bg-green-50/5' 
            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
        }`}
        onClick={() => handleOptionToggle('government')}>
          <div className="flex items-start space-x-4">
            <div className="mt-1">
              <input
                type="checkbox"
                checked={isSelected('government')}
                onChange={() => handleOptionToggle('government')}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500 focus:ring-2"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Government registry check
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Automatic verification through government death registries (US only)
              </p>
            </div>
          </div>
        </div>

        {/* Activity Heartbeat */}
        <div className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer ${
          isSelected('heartbeat') 
            ? 'border-green-500 bg-green-50/5' 
            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
        }`}
        onClick={() => handleOptionToggle('heartbeat')}>
          <div className="flex items-start space-x-4">
            <div className="mt-1">
              <input
                type="checkbox"
                checked={isSelected('heartbeat')}
                onChange={() => handleOptionToggle('heartbeat')}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500 focus:ring-2"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Activity heartbeat
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Regular check-ins to prove you&apos;re still active
              </p>
            </div>
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
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
