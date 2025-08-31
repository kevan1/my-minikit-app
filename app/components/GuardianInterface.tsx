"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

// Mock data for demo - in a real app this would come from blockchain/API
const MOCK_WILL_DATA = {
  testatorAddress: "0x742d35Cc6432C8Cf6a58130ac2C03c8ad5E8b0b0",
  testatorName: "John Doe",
  assignedGuardian: "0x841f1308d80a3952ac6a495616Aaab9BE0ebD0CF",
  allGuardians: [
    {
      address: "0x69Dc7349edAF67e2b104f815DAa9c2C25402EeC8",
      name: "Primary Guardian",
      verified: false
    },
    {
      address: "0x8bD14205255920F9c39020Ba206041907331afc3",
      name: "Secondary Guardian", 
      verified: false
    }
  ],
  vaultValue: "$15,750.00",
  createdDate: "2024-03-15"
};

type GuardianInterfaceProps = {
  onBack?: () => void;
};

export function GuardianInterface({ onBack }: GuardianInterfaceProps) {
  const { address: connectedAddress, isConnected } = useAccount();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verifying' | 'verified' | 'failed'>('pending');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Check if connected wallet is a guardian
  const isGuardian = connectedAddress && 
    MOCK_WILL_DATA.allGuardians.some(guardian => 
      guardian.address.toLowerCase() === connectedAddress.toLowerCase()
    );
  
  // Get current guardian data if connected user is a guardian
  const currentGuardian = MOCK_WILL_DATA.allGuardians.find(guardian =>
    guardian.address.toLowerCase() === connectedAddress?.toLowerCase()
  );

  // Handle verification action
  const handleVerification = async () => {
    if (!isGuardian || !connectedAddress) return;
    
    setIsVerifying(true);
    setVerificationStatus('verifying');
    
    // Simulate blockchain transaction or API call
    setTimeout(() => {
      // Update guardian verification status
      const guardianIndex = MOCK_WILL_DATA.allGuardians.findIndex(g => 
        g.address.toLowerCase() === connectedAddress.toLowerCase()
      );
      
      if (guardianIndex !== -1) {
        MOCK_WILL_DATA.allGuardians[guardianIndex].verified = true;
        setVerificationStatus('verified');
      } else {
        setVerificationStatus('failed');
      }
      
      setIsVerifying(false);
    }, 3000); // 3 second simulation
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <pre className="font-mono text-red-400 text-xs mb-6 leading-tight overflow-x-auto">
{`   ╔══════════════════════════╗
   ║    ⚠️  WALLET REQUIRED  ⚠️  ║
   ║  ┌─────────────────────┐  ║
   ║  │   CONNECT TO ACCESS │  ║
   ║  │   GUARDIAN PANEL    │  ║
   ║  └─────────────────────┘  ║
   ╚══════════════════════════╝`}
          </pre>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
            Guardian Verification Required
          </h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base px-2">
            Please connect your wallet to access the guardian verification interface.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-2xl mx-auto">
        
        {/* ASCII Art Header */}
        <div className="text-center mb-8">
          {isGuardian ? (
            <pre className="font-mono text-green-400 text-xs mb-4 leading-tight">
{`   ╔══════════════════════════╗
   ║   🛡️  GUARDIAN PANEL  🛡️   ║
   ║  ┌─────────────────────┐  ║
   ║  │  [✓] AUTHORIZED [✓] │  ║
   ║  │   DEATH VERIFICATION │  ║
   ║  └─────────────────────┘  ║
   ╚══════════════════════════╝`}
            </pre>
          ) : (
            <pre className="font-mono text-red-400 text-xs mb-4 leading-tight">
{`   ╔══════════════════════════╗
   ║   ❌ UNAUTHORIZED ACCESS ❌ ║
   ║  ┌─────────────────────┐  ║
   ║  │   NOT A GUARDIAN    │  ║
   ║  │   ACCESS DENIED     │  ║
   ║  └─────────────────────┘  ║
   ╚══════════════════════════╝`}
            </pre>
          )}
        </div>

        {/* Header Info */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Guardian Verification Interface
          </h1>
          <div className="text-sm text-gray-400 space-y-1">
            <p>Connected Wallet: <span className="font-mono text-white">{formatAddress(connectedAddress || "")}</span></p>
            <p>Testator: <span className="text-white">{MOCK_WILL_DATA.testatorName}</span></p>
            <p>Vault Value: <span className="text-green-400 font-semibold">{MOCK_WILL_DATA.vaultValue}</span></p>
          </div>
        </div>

        {isGuardian ? (
          // Guardian Interface
          <>
            {/* Status Message */}
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 text-blue-400 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">
                    You are a designated guardian for this will
                  </h3>
                  <p className="text-blue-200 text-sm">
                    Your verification is required to unlock the inheritance vault and distribute assets to beneficiaries.
                  </p>
                </div>
              </div>
            </div>

            {/* Guardian List */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Guardian Status</h3>
              <div className="space-y-3">
                {MOCK_WILL_DATA.allGuardians.map((guardian, index) => {
                  const isCurrentUser = guardian.address.toLowerCase() === connectedAddress?.toLowerCase();
                  return (
                    <div
                      key={guardian.address}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        isCurrentUser 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : 'border-gray-700 bg-gray-800/30'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          guardian.verified 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {guardian.verified ? '✓' : index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {guardian.name} {isCurrentUser && '(You)'}
                          </p>
                          <p className="text-gray-400 text-sm font-mono">
                            {formatAddress(guardian.address)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${
                          guardian.verified ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {guardian.verified ? 'Verified' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Verification Status */}
            <div className="mb-6">
              {verificationStatus === 'pending' && !currentGuardian?.verified && (
                <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-yellow-400">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-300">
                        Verification Required
                      </h4>
                      <p className="text-sm text-yellow-200">
                        Awaiting your confirmation of the testator&apos;s passing.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {verificationStatus === 'verifying' && (
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-300">
                        Processing Verification
                      </h4>
                      <p className="text-sm text-blue-200">
                        Submitting verification to the blockchain...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {(verificationStatus === 'verified' || currentGuardian?.verified) && (
                <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-green-400">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-green-300">
                        Verification Complete
                      </h4>
                      <p className="text-sm text-green-200">
                        Your verification has been successfully recorded.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {verificationStatus === 'failed' && (
                <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-red-400">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-red-300">
                        Verification Failed
                      </h4>
                      <p className="text-sm text-red-200">
                        There was an error processing your verification. Please try again.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Verification Button */}
            {!currentGuardian?.verified && verificationStatus !== 'verified' && (
              <div className="mb-6">
                <button
                  onClick={handleVerification}
                  disabled={isVerifying || verificationStatus === 'verifying'}
                  className="w-full px-8 py-4 bg-white hover:bg-gray-100 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold text-lg rounded-xl transition-colors duration-200 flex items-center justify-center space-x-3 border border-gray-300"
                >
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                      <span>Processing Verification...</span>
                    </>
                  ) : (
                    <>
                      <span>⚠️</span>
                      <span>Verify Testator&apos;s Death</span>
                    </>
                  )}
                </button>
                
                {!isVerifying && (
                  <p className="text-center text-gray-400 text-sm mt-3">
                    This action cannot be undone and will permanently unlock the inheritance vault
                  </p>
                )}
              </div>
            )}

            {/* Will Details */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Will Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Testator Address:</p>
                  <p className="text-white font-mono">{formatAddress(MOCK_WILL_DATA.testatorAddress)}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Created Date:</p>
                  <p className="text-white">{MOCK_WILL_DATA.createdDate}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Vault Value:</p>
                  <p className="text-green-400 font-semibold">{MOCK_WILL_DATA.vaultValue}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Total Guardians:</p>
                  <p className="text-white">{MOCK_WILL_DATA.allGuardians.length}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Non-Guardian Interface
          <div className="text-center py-12">
            <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-red-400 mb-4">
                Access Denied
              </h2>
              <p className="text-red-200 mb-6 leading-relaxed">
                You are not a guardian for this will. Only designated guardians can verify the testator&apos;s passing and unlock inheritance assets.
              </p>
              
              <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Designated Guardians:</h3>
                <div className="space-y-2">
                  {MOCK_WILL_DATA.allGuardians.map((guardian, index) => (
                    <p key={guardian.address} className="text-gray-400 font-mono text-sm">
                      {index + 1}. {formatAddress(guardian.address)}
                    </p>
                  ))}
                </div>
              </div>

              <p className="text-gray-400 text-sm">
                If you believe this is an error, please contact the testator or system administrator.
              </p>
            </div>
          </div>
        )}

        {/* Back Button */}
        {onBack && (
          <div className="mt-8 text-center">
            <button
              onClick={onBack}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors duration-200"
            >
              ← Back to Main Menu
            </button>
          </div>
        )}

        {/* Demo Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 font-mono">
            🚧 DEMO MODE - Guardian verification simulation only 🚧
          </p>
        </div>
      </div>
    </div>
  );
}
