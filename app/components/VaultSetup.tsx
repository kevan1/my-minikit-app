"use client";

import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";

type Asset = {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  address?: string;
};

type VaultSetupProps = {
  onContinue: (assets: Asset[]) => void;
  onBack: () => void;
};

export function VaultSetup({ onContinue, onBack }: VaultSetupProps) {
  const { address } = useAccount();
  const [selectedAsset, setSelectedAsset] = useState<'ETH' | 'USDC'>('ETH');
  const [depositAmount, setDepositAmount] = useState("");
  const [vaultAssets, setVaultAssets] = useState<Asset[]>([]);
  const [isDepositing, setIsDepositing] = useState(false);

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
  });

  // Mock USDC balance for demo
  const mockUSDCBalance = "1250.50";

  const availableAssets: Asset[] = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: ethBalance ? formatEther(ethBalance.value) : "0",
      usdValue: ethBalance ? (parseFloat(formatEther(ethBalance.value)) * 3200).toFixed(2) : "0", // Mock ETH price
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: mockUSDCBalance,
      usdValue: mockUSDCBalance,
      address: '0xa0b86a33e6bf06d8b1be9c1e6cb9b1b2e6bf06d8' // Mock USDC address
    }
  ];

  const selectedAssetData = availableAssets.find(asset => asset.symbol === selectedAsset);
  const totalVaultValue = vaultAssets.reduce((sum, asset) => sum + parseFloat(asset.usdValue), 0);

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      return;
    }

    const amount = parseFloat(depositAmount);
    const maxBalance = parseFloat(selectedAssetData?.balance || "0");

    if (amount > maxBalance) {
      alert(`Insufficient ${selectedAsset} balance`);
      return;
    }

    setIsDepositing(true);

    // Simulate deposit transaction
    setTimeout(() => {
      const newAsset: Asset = {
        symbol: selectedAsset,
        name: selectedAssetData?.name || selectedAsset,
        balance: depositAmount,
        usdValue: selectedAsset === 'ETH' 
          ? (amount * 3200).toFixed(2) 
          : amount.toFixed(2),
        address: selectedAssetData?.address
      };

      setVaultAssets(prev => {
        const existingIndex = prev.findIndex(asset => asset.symbol === selectedAsset);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            balance: (parseFloat(updated[existingIndex].balance) + amount).toString(),
            usdValue: selectedAsset === 'ETH'
              ? ((parseFloat(updated[existingIndex].balance) + amount) * 3200).toFixed(2)
              : (parseFloat(updated[existingIndex].balance) + amount).toFixed(2)
          };
          return updated;
        }
        return [...prev, newAsset];
      });

      setDepositAmount("");
      setIsDepositing(false);
    }, 2000); // Simulate network delay
  };

  const canContinue = vaultAssets.length > 0; // Require at least some assets in vault

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
            ✓
          </div>
          <div className="w-12 h-0.5 bg-green-500"></div>
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
            ✓
          </div>
          <div className="w-12 h-0.5 bg-green-500"></div>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
            3
          </div>
        </div>
      </div>

      {/* ASCII Art Header */}
      <div className="text-center mb-6">
        <pre className="font-mono text-cyan-400 text-xs sm:text-xs mb-4 leading-tight overflow-x-auto">
{`   ╔══════════════════════════╗
   ║      💰 SECURE VAULT 💰   ║
   ║  ┌─────────────────────┐  ║
   ║  │ [💎] [ETH] [USDC]   │  ║
   ║  │   DIGITAL ASSETS    │  ║
   ║  └─────────────────────┘  ║
   ╚══════════════════════════╝`}
        </pre>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
          Step 3 of 3: Setup Vault
        </h1>
        <p className="text-gray-400 leading-relaxed text-sm sm:text-base px-2">
          Deposit your digital assets into a secure inheritance vault
        </p>
      </div>

      {/* Current Vault Balance */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <span>🏦</span>
            <span>Vault Balance</span>
          </h3>
          
          {vaultAssets.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 font-mono text-sm mb-2">
                ┌─────────────────────┐<br />
                │    Vault Empty      │<br />
                │   $0.00 USD         │<br />
                └─────────────────────┘
              </div>
              <p className="text-gray-400 text-sm">
                Deposit assets to secure them for inheritance
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-right mb-4">
                <p className="text-2xl font-bold text-white">
                  ${totalVaultValue.toFixed(2)} USD
                </p>
                <p className="text-sm text-gray-400">Total Vault Value</p>
              </div>
              
              <div className="space-y-3">
                {vaultAssets.map((asset, index) => (
                  <div
                    key={`${asset.symbol}-${index}`}
                    className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold">
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
          )}
        </div>
      </div>

      {/* Asset Deposit Section */}
      <div className="mb-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Deposit Assets</h3>
          
          {/* Asset Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Asset
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availableAssets.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset.symbol as 'ETH' | 'USDC')}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    selectedAsset === asset.symbol
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm">
                      {asset.symbol === 'ETH' ? '⟠' : '💲'}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium text-sm">{asset.symbol}</p>
                      <p className="text-gray-400 text-xs">
                        {parseFloat(asset.balance).toFixed(4)} available
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount to Deposit
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.0001"
                  min="0"
                  max={selectedAssetData?.balance}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 pr-16"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-semibold">
                  {selectedAsset}
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <p className="text-gray-400">
                  Available: {parseFloat(selectedAssetData?.balance || "0").toFixed(4)} {selectedAsset}
                </p>
                <button
                  onClick={() => setDepositAmount(selectedAssetData?.balance || "0")}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Max
                </button>
              </div>
              {depositAmount && (
                <p className="text-gray-400 text-sm mt-1">
                  ≈ ${selectedAsset === 'ETH' 
                    ? (parseFloat(depositAmount) * 3200).toFixed(2) 
                    : parseFloat(depositAmount).toFixed(2)} USD
                </p>
              )}
            </div>
            
            <button
              onClick={handleDeposit}
              disabled={!depositAmount || parseFloat(depositAmount) <= 0 || isDepositing}
              className="w-full px-6 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 border border-gray-300"
            >
              {isDepositing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                  <span>Depositing...</span>
                </>
              ) : (
                <span>Deposit {selectedAsset}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Vault Security Info */}
      <div className="mb-8 bg-green-900/20 border border-green-700/30 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 text-green-400 mt-0.5">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-green-300 mb-2">
              Vault Security Features
            </h4>
            <ul className="text-sm text-green-200 space-y-1">
              <li>• Assets locked until guardian verification</li>
              <li>• Multi-signature protection</li>
              <li>• Time-locked withdrawals for security</li>
              <li>• Immutable smart contract deployment</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Vault Access Preview */}
      {vaultAssets.length > 0 && (
        <div className="mb-8 bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-yellow-400 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-yellow-300 mb-2">
                Important: Vault Access
              </h4>
              <p className="text-sm text-yellow-200">
                Once deposited, assets can only be withdrawn after guardian verification of your passing. 
                Make sure you trust your selected guardians completely.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Available Assets Display */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Your Available Assets</h3>
        <div className="space-y-3">
          {availableAssets.map((asset) => (
            <div
              key={asset.symbol}
              className="flex items-center justify-between p-4 bg-gray-900/30 border border-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm">
                  {asset.symbol === 'ETH' ? '⟠' : '💲'}
                </div>
                <div>
                  <p className="text-white font-medium">{asset.name}</p>
                  <p className="text-gray-400 text-sm">{asset.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-mono">
                  {parseFloat(asset.balance).toFixed(4)}
                </p>
                <p className="text-gray-400 text-sm">
                  ${parseFloat(asset.usdValue).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
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
          onClick={() => onContinue(vaultAssets)}
          disabled={!canContinue}
          className={`px-8 py-3 font-semibold rounded-lg transition-colors duration-200 border ${
            canContinue
              ? "bg-white hover:bg-gray-100 text-black border-gray-300"
              : "bg-gray-700 text-gray-400 cursor-not-allowed border-gray-700"
          }`}
        >
          Continue to Review
        </button>
      </div>

      {/* Demo Notice */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 font-mono">
          🚧 DEMO MODE - No real transactions will be executed 🚧
        </p>
      </div>
    </div>
  );
}
