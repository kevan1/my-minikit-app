"use client";

import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useOpenUrl } from "@coinbase/onchainkit/minikit";
import { sdk } from "@farcaster/frame-sdk";
import { sendFrameNotification } from "@/lib/notification-client";

type Guardian = {
  id: string;
  address: string;
};

type Asset = {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
};

type FinalReviewProps = {
  guardians: Guardian[];
  vaultAssets: Asset[];
  verificationMethods: string[];
  onBack: () => void;
  onEditGuardians: () => void;
  onEditVault: () => void;
  onEditVerification: () => void;
};

export function FinalReview({
  guardians,
  vaultAssets,
  verificationMethods,
  onBack,
  onEditGuardians,
  onEditVault,
  onEditVerification,
}: FinalReviewProps) {
  const { address: connectedAddress } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const openUrl = useOpenUrl();
  const [deploymentStatus, setDeploymentStatus] = useState<'ready' | 'deploying' | 'success' | 'failed'>('ready');
  const [isDeploying, setIsDeploying] = useState(false);
  const [willAddress, setWillAddress] = useState<string>("");

  // Calculate total vault value
  const totalVaultValue = vaultAssets.reduce((sum, asset) => sum + parseFloat(asset.usdValue), 0);


  // Handle will deployment
  const handleDeploy = async () => {
    try {
      setIsDeploying(true);
      setDeploymentStatus('deploying');
      
      // Create will data for signing
      const willData = {
        creator: connectedAddress,
        guardians: guardians.map(g => g.address),
        assets: vaultAssets.map(asset => ({
          symbol: asset.symbol,
          amount: asset.balance,
          value: asset.usdValue
        })),
        verificationMethods,
        timestamp: Date.now(),
        totalValue: totalVaultValue
      };
      
      // Create message for signing
      const message = `NEORYPTO Digital Will Deployment\n\n` +
        `Creator: ${connectedAddress}\n` +
        `Guardians: ${guardians.length}\n` +
        `Assets: ${vaultAssets.length} (Total: $${totalVaultValue.toFixed(2)})\n` +
        `Timestamp: ${new Date().toISOString()}\n\n` +
        `By signing this message, I confirm the deployment of my digital inheritance will with the above configuration.\n\n` +
        `Data Hash: ${JSON.stringify(willData)}`;
      
      console.log('Requesting wallet signature for will deployment...');
      
      // Request wallet signature
      const userSignature = await signMessageAsync({
        message: message,
      });
      
      console.log('Will deployment signed successfully:', userSignature);
      
      // Simulate blockchain deployment after successful signing
      setTimeout(() => {
        // Generate mock contract address
        const mockContractAddress = `0x${Math.random().toString(16).slice(2, 42)}`.padEnd(42, '0');
        setWillAddress(mockContractAddress);
        setDeploymentStatus('success');
        setIsDeploying(false);
        
        console.log('Will deployed successfully:', {
          contractAddress: mockContractAddress,
          signature: userSignature,
          willData
        });
      }, 2000); // 2 second deployment after signing
      
    } catch (error) {
      console.error('Error during will deployment:', error);
      setDeploymentStatus('failed');
      setIsDeploying(false);
      
      // Show user-friendly error
      if (error instanceof Error && error.message.includes('User rejected')) {
        alert('❌ Will deployment cancelled. Please sign the message to deploy your digital inheritance will.');
      } else {
        alert('❌ Failed to deploy will. Please try again.');
      }
    }
  };

  // Share via Farcaster cast composition and notification
  const handleShareToSocial = async () => {
    try {
      // Create a share message for the will creation
      const shareText = `🎉 Just secured my digital inheritance on Base!\n\n` +
        `📜 Will Contract: ${willAddress}\n` +
        `🛡️ Protected by ${guardians.length} guardian${guardians.length > 1 ? 's' : ''}\n` +
        `💰 Vault Value: $${totalVaultValue.toFixed(2)} USD\n\n` +
        `Built with Base + Farcaster 🛠️\n` +
        `#BaseWill #DigitalInheritance #Web3Legacy #Base`;
      
      // Method 1: Try Farcaster ComposeCast action
      try {
        const composeResult = await sdk.actions.composeCast({
          text: shareText,
          parent: undefined, // No parent cast, it's a top-level post
        });
        
        if (composeResult.cast) {
          console.log('Successfully opened Farcaster compose with will details');
          
          // Send a success notification
          try {
            const context = await sdk.context;
            if (context.user?.fid) {
              await sendFrameNotification({
                fid: context.user.fid,
                title: "Will Creation Shared! 🎉",
                body: `Your digital inheritance will (${willAddress.substring(0, 8)}...) has been shared to your social feed.`,
              });
            }
          } catch (notifError) {
            console.warn('Could not send notification:', notifError);
          }
          
          return;
        }
      } catch (composeError) {
        console.warn('ComposeCast failed:', composeError);
      }
      
      // Method 2: Fallback to Base compose URL with openUrl
      const baseComposeUrl = `https://base.org/compose?text=${encodeURIComponent(shareText)}`;
      try {
        await openUrl(baseComposeUrl);
        console.log('Successfully opened Base app compose');
      } catch {
        // Method 3: Final fallback - open in new tab
        window.open(baseComposeUrl, '_blank');
      }
      
    } catch (error) {
      console.error('Error sharing will creation:', error);
      
      // Show user-friendly error and copy text to clipboard
      const shareText = `🎉 Just secured my digital inheritance on Base!\n\n📜 Will Contract: ${willAddress}\n🛡️ Protected by ${guardians.length} guardian${guardians.length > 1 ? 's' : ''}\n💰 Vault Value: $${totalVaultValue.toFixed(2)} USD\n\n#BaseWill #DigitalInheritance #Web3Legacy #Base`;
      
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Will details copied to clipboard! 📋 Paste in your favorite social app 🎉');
      } catch {
        alert('Share functionality unavailable. Your will has been successfully deployed! 🎉');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* ASCII Art Header */}
      <div className="text-center mb-8">
        <pre className="font-mono text-gray-400 text-xs mb-4 leading-tight overflow-x-auto">
{`   ╔══════════════════════════════════╗
   ║     📜 FINAL WILL REVIEW 📜      ║
   ║  ┌─────────────────────────────┐  ║
   ║  │ [🛡️] [💰] [⚖️] [🔒] [✓]  │  ║
   ║  │   INHERITANCE PROTOCOL     │  ║
   ║  └─────────────────────────────┘  ║
   ╚══════════════════════════════════╝`}
        </pre>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
          Final Review & Deployment
        </h1>
        <p className="text-gray-400 leading-relaxed text-sm sm:text-base px-2">
          Review your will configuration before deploying to the blockchain
        </p>
      </div>

      {deploymentStatus === 'success' ? (
        // Success State
        <div className="text-center py-12">
          <pre className="font-mono text-gray-400 text-xs mb-6 leading-tight">
{`   ╔══════════════════════════════════╗
   ║     ✅ DEPLOYMENT SUCCESS ✅      ║
   ║  ┌─────────────────────────────┐  ║
   ║  │    WILL SUCCESSFULLY        │  ║
   ║  │    DEPLOYED TO BLOCKCHAIN   │  ║
   ║  └─────────────────────────────┘  ║
   ╚══════════════════════════════════╝`}
          </pre>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Will Deployed Successfully! 🎉
          </h2>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Contract Address:</p>
                <p className="text-white font-mono text-lg font-semibold">
                  {willAddress}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Vault Value Secured:</p>
                <p className="text-white text-xl font-bold">
                  ${totalVaultValue.toFixed(2)} USD
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Guardians Protected:</p>
                <p className="text-white font-semibold">
                  {guardians.length} Guardian{guardians.length > 1 ? 's' : ''} Assigned
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleShareToSocial}
              className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-lg transition-colors duration-200 border border-gray-300"
            >
              📱 Share to Social Feed
            </button>
            
            <div className="text-center">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Return to Main Menu
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Review State
        <>
          {/* Deployment Status */}
          {deploymentStatus === 'deploying' && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-400 border-t-transparent"></div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white">
                    Deploying Will to Blockchain
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Please wait while your inheritance contract is deployed...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Testator Information */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <span>👤</span>
              <span>Testator Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Wallet Address:</p>
                <p className="text-white font-mono">{connectedAddress}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Creation Date:</p>
                <p className="text-white">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Guardians Section */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span>🛡️</span>
                <span>Guardians ({guardians.length})</span>
              </h3>
              <button
                onClick={onEditGuardians}
                disabled={isDeploying}
                className="px-3 py-1 text-gray-400 hover:text-white text-sm border border-gray-600 rounded-md hover:border-gray-400 transition-colors duration-200 disabled:opacity-50"
              >
                Edit
              </button>
            </div>
            
            {guardians.length > 0 ? (
              <div className="space-y-3">
                {guardians.map((guardian, index) => (
                  <div
                    key={guardian.id}
                    className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Guardian {index + 1}</p>
                      <p className="text-white font-mono text-sm">{guardian.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No guardians assigned</p>
            )}
          </div>

          {/* Verification Methods Section */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span>⚖️</span>
                <span>Death Verification Methods</span>
              </h3>
              <button
                onClick={onEditVerification}
                disabled={isDeploying}
                className="px-3 py-1 text-gray-400 hover:text-white text-sm border border-gray-600 rounded-md hover:border-gray-400 transition-colors duration-200 disabled:opacity-50"
              >
                Edit
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-sm text-white">
                  ✓
                </div>
                <span className="text-white">Guardian verification (required)</span>
              </div>
              {verificationMethods.includes('government') && (
                <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-sm text-white">
                    ✓
                  </div>
                  <span className="text-white">Government registry check</span>
                </div>
              )}
              {verificationMethods.includes('heartbeat') && (
                <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-sm text-white">
                    ✓
                  </div>
                  <span className="text-white">Activity heartbeat</span>
                </div>
              )}
            </div>
          </div>

          {/* Vault Assets Section */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span>💰</span>
                <span>Vault Assets</span>
              </h3>
              <button
                onClick={onEditVault}
                disabled={isDeploying}
                className="px-3 py-1 text-gray-400 hover:text-white text-sm border border-gray-600 rounded-md hover:border-gray-400 transition-colors duration-200 disabled:opacity-50"
              >
                Edit
              </button>
            </div>
            
            {vaultAssets.length > 0 ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-2xl font-bold text-white mb-1">
                    ${totalVaultValue.toFixed(2)} USD
                  </p>
                  <p className="text-gray-400 text-sm">Total Inheritance Value</p>
                </div>
                
                <div className="space-y-2">
                  {vaultAssets.map((asset, index) => (
                    <div
                      key={`${asset.symbol}-${index}`}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm">
                          {asset.symbol === 'ETH' ? '⟠' : '💲'}
                        </div>
                        <div>
                          <p className="text-white font-medium">{asset.name}</p>
                          <p className="text-gray-400 text-sm font-mono">
                            {parseFloat(asset.balance).toFixed(4)} {asset.symbol}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">
                          ${parseFloat(asset.usdValue).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No assets in vault</p>
            )}
          </div>

          {/* Beneficiaries Section (Placeholder) */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <span>👥</span>
              <span>Beneficiaries</span>
            </h3>
            <div className="text-center p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <p className="text-gray-300 text-sm">
                Simplified demo: Assets will be distributed to guardians
              </p>
            </div>
          </div>

          {/* Deployment Summary */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <span>🚀</span>
              <span>Deployment Summary</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-2xl font-bold text-white">{guardians.length}</p>
                <p className="text-gray-400 text-sm">Guardian{guardians.length > 1 ? 's' : ''}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-2xl font-bold text-white">{vaultAssets.length}</p>
                <p className="text-gray-400 text-sm">Asset Type{vaultAssets.length > 1 ? 's' : ''}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-2xl font-bold text-white">${totalVaultValue.toFixed(0)}</p>
                <p className="text-gray-400 text-sm">USD Value</p>
              </div>
            </div>
          </div>

          {/* Deployment Warning */}
          <div className="bg-gray-800/30 border border-gray-600 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 text-gray-400 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-200 mb-2">
                  ⚠️ Important: Deployment is Irreversible
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Once deployed, the will cannot be modified</li>
                  <li>• Assets will be locked until guardian verification</li>
                  <li>• Make sure all information is correct</li>
                  <li>• Trust your selected guardians completely</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onBack}
              disabled={isDeploying}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50"
            >
              Back to Vault
            </button>
            
            <button
              onClick={handleDeploy}
              disabled={isDeploying || guardians.length === 0 || vaultAssets.length === 0}
              className="w-full sm:w-auto px-12 py-4 bg-white hover:bg-gray-100 text-black font-bold text-lg rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 border border-gray-300"
            >
              {isDeploying ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                  <span>Deploying Contract...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Confirm & Deploy Will</span>
                </>
              )}
            </button>
          </div>

          {/* Requirements Check */}
          {(guardians.length === 0 || vaultAssets.length === 0) && (
            <div className="mt-4 bg-gray-800/50 border border-gray-600 rounded-lg p-4">
              <h4 className="text-gray-200 font-semibold text-sm mb-2">
                Deployment Requirements Not Met:
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                {guardians.length === 0 && <li>• At least 1 guardian required</li>}
                {vaultAssets.length === 0 && <li>• At least 1 asset must be deposited in vault</li>}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Demo Notice */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 font-mono">
          🚧 DEMO MODE - No real smart contracts will be deployed 🚧
        </p>
      </div>
    </div>
  );
}
