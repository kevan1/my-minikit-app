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
import { useAccount } from "wagmi";
import { Button } from "./components/DemoComponents";
import { Icon } from "./components/DemoComponents";
import { RoleSelection } from "./components/RoleSelection";
import { VerificationSetup } from "./components/VerificationSetup";
import { MenuBar } from "@/components/menu-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import MatrixRain from "@/components/matrix-rain";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const { isConnected } = useAccount();
  const [showMainApp, setShowMainApp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'creator' | 'guardian' | null>(null);

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
    // Add logic for next step
  };

  // Show main app after 1.5-second delay
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Wallet className="z-10">
            <ConnectWallet>
              <Name className="text-inherit text-white" />
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
        <div>{saveFrameButton}</div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        {selectedRole === 'creator' ? (
          <VerificationSetup 
            onBack={handleBackToRoleSelection}
            onContinue={handleContinueFromVerification}
          />
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
