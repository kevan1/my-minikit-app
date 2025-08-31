"use client";

import { type ReactNode } from "react";

type RoleOptionProps = {
  title: string;
  description: string;
  asciiIcon: string;
  onClick: () => void;
  iconColor: string;
};

function RoleOption({ title, description, asciiIcon, onClick, iconColor }: RoleOptionProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition-all duration-200 hover:border-gray-700"
    >
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-mono ${iconColor}`}>
          {asciiIcon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

type RoleSelectionProps = {
  onRoleSelect: (role: 'creator' | 'guardian') => void;
};

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          How are you using Base Will?
        </h1>
        <p className="text-gray-400">
          Choose your role to get started
        </p>
      </div>

      <div className="space-y-4">
        <RoleOption
          title="I'm creating a will"
          description="Set up guardians, beneficiaries, and secure your digital assets for inheritance"
          asciiIcon="📜"
          iconColor="bg-blue-900/50"
          onClick={() => onRoleSelect('creator')}
        />

        <RoleOption
          title="I'm a guardian"
          description="Verify and confirm the passing of will owners you've been entrusted to protect"
          asciiIcon="🛡️"
          iconColor="bg-green-900/50"
          onClick={() => onRoleSelect('guardian')}
        />
      </div>
    </div>
  );
}

// ASCII Art alternatives for a more technical look
export const ASCII_ICONS = {
  will: `
   ╔═══════╗
   ║ WILL  ║
   ║ _____ ║
   ║ _____ ║
   ║ _____ ║
   ╚═══════╝
  `,
  guardian: `
   ╔═══════╗
   ║   ⚔   ║
   ║  /|\\  ║
   ║ GUARD ║
   ║  IAN  ║
   ╚═══════╝
  `,
};
