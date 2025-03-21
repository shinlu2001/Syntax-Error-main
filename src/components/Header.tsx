// src/components/Header.tsx
import { Search } from 'lucide-react';
import React from 'react';

interface HeaderProps {
  onConnectCRM: () => void;
}

const Header: React.FC<HeaderProps> = ({ onConnectCRM }) => {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side: App Name & Global Search */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-800">LeadQualify AI</h1>
          <div className="relative">
            <Search className="absolute top-2 left-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Search leads, companies..."
            />
          </div>
        </div>
        {/* Right side: Connect CRM button */}
        <button
          onClick={onConnectCRM}
          className="bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-sm text-gray-700"
        >
          Connect CRM
        </button>
      </div>
    </header>
  );
};

export default Header;
