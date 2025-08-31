"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Button } from "./components/DemoComponents";
import { Icon } from "./components/DemoComponents";
import { RoleSelection } from "./components/RoleSelection";
import { VerificationSetup } from "./components/VerificationSetup";
import { AssignGuardians } from "./components/AssignGuardians";
import { VaultSetup } from "./components/VaultSetup";
import { GuardianInterface } from "./components/GuardianInterface";
import { FinalReview } from "./components/FinalReview";
import MatrixRain from "@/components/matrix-rain";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const { isConnected } = useAccount();
  const [showMainApp, setShowMainApp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'creator' | 'guardian' | null>(null);
  const [currentStep, setCurrentStep] = useState<'verification' | 'guardians' | 'vault' | 'review'>('verification');
  const [guardians, setGuardians] = useState<Array<{ id: string; address: string }>>([]);
  const [vaultAssets, setVaultAssets] = useState<Array<{ symbol: string; name: string; balance: string; usdValue: string }>>([]);
  const [verificationMethods] = useState<string[]>(['guardian']);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Handle 1.5-second delay after wallet connection
  useEffect(() => {
    if (isConnected && !showMainApp) {
      const timer = setTimeout(() => {
        setShowMainApp(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else if (!isConnected) {
      setShowMainApp(false);
    }
  }, [isConnected, showMainApp]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  // Show MatrixRain landing page when wallet is not connected OR during 1.5-second delay
  if (!isConnected || (isConnected && !showMainApp)) {
    return (
      <div className="fixed inset-0 w-full h-full bg-black">
        <MatrixRain />
        {/* Connect Wallet button positioned at bottom like a footer */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 sm:pb-12 md:pb-16">
          {!isConnected ? (
            <Wallet className="z-20">
              <ConnectWallet className="bg-white hover:bg-gray-100 text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg border border-gray-300">
                <span>Connect Wallet</span>
              </ConnectWallet>
            </Wallet>
          ) : (
            <div className="z-20 flex flex-col items-center space-y-4">
              <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span className="text-white font-medium">Wallet Connected</span>
                </div>
                <p className="text-white/70 text-sm mt-2 text-center">Initializing...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Handle role selection
  const handleRoleSelect = (role: 'creator' | 'guardian') => {
    setSelectedRole(role);
    console.log(`Selected role: ${role}`);
  };

  // Handle going back to role selection
  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
  };

  // Handle continue from verification setup
  const handleContinueFromVerification = () => {
    console.log('Continuing from verification setup...');
    setCurrentStep('guardians');
  };

  // Guardian management functions
  const handleAddGuardian = (address: string) => {
    const newGuardian = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      address
    };
    setGuardians(prev => [...prev, newGuardian]);
  };

  const handleRemoveGuardian = (id: string) => {
    setGuardians(prev => prev.filter(guardian => guardian.id !== id));
  };

  const handleContinueFromGuardians = () => {
    console.log('Continuing from guardians setup...');
    // Skip beneficiaries, go directly to vault
    setCurrentStep('vault');
  };

  const handleBackToVerification = () => {
    setCurrentStep('verification');
  };

  const handleBackToGuardians = () => {
    setCurrentStep('guardians');
  };

  const handleContinueFromVault = (assets: Array<{ symbol: string; name: string; balance: string; usdValue: string }>) => {
    console.log('Vault setup complete, proceeding to review...');
    setVaultAssets(assets);
    setCurrentStep('review');
  };

  const handleBackToVault = () => {
    setCurrentStep('vault');
  };

  // Final review navigation handlers
  const handleEditGuardians = () => {
    setCurrentStep('guardians');
  };

  const handleEditVault = () => {
    setCurrentStep('vault');
  };

  const handleEditVerification = () => {
    setCurrentStep('verification');
  };

  // Show main app after 1.5-second delay
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2 min-w-0">
          <Wallet className="z-10">
            <ConnectWallet className="bg-white hover:bg-gray-100 text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              <Name className="text-inherit text-black" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
        
        {/* Logo positioned in the center */}
        <div className="flex justify-center">
          <Image
            src="/ascii-art-text.png" 
            alt="NEORYPTO Logo"
            width={120}
            height={32}
            className="h-8 w-auto opacity-60 hover:opacity-80 transition-opacity duration-200"
          />
        </div>
        
        {/* Save Frame Button positioned to the right */}
        <div className="flex justify-end">
          {saveFrameButton}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-2 sm:p-4">
        {selectedRole === 'creator' ? (
          <>
            {currentStep === 'verification' && (
              <VerificationSetup 
                onBack={handleBackToRoleSelection}
                onContinue={handleContinueFromVerification}
              />
            )}
            {currentStep === 'guardians' && (
              <AssignGuardians
                guardians={guardians}
                onAddGuardian={handleAddGuardian}
                onRemoveGuardian={handleRemoveGuardian}
                onContinue={handleContinueFromGuardians}
                onBack={handleBackToVerification}
              />
            )}
            {currentStep === 'vault' && (
              <VaultSetup
                onContinue={handleContinueFromVault}
                onBack={handleBackToGuardians}
              />
            )}
            {currentStep === 'review' && (
              <FinalReview
                guardians={guardians}
                vaultAssets={vaultAssets}
                verificationMethods={verificationMethods}
                onBack={handleBackToVault}
                onEditGuardians={handleEditGuardians}
                onEditVault={handleEditVault}
                onEditVerification={handleEditVerification}
              />
            )}
          </>
        ) : selectedRole === 'guardian' ? (
          <div className="w-full">
            <GuardianInterface onBack={handleBackToRoleSelection} />
          </div>
        ) : (
          <RoleSelection onRoleSelect={handleRoleSelect} />
        )}
      </main>

      <footer className="p-4 border-t border-gray-800 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 text-xs hover:text-gray-300"
          onClick={() => openUrl("https://base.org/builders/minikit")}
        >
          Built on Base with MiniKit
        </Button>
      </footer>
    </div>
  );
}
