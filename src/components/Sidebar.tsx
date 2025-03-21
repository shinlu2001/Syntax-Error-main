// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Database, Users, Settings as SettingsIcon } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 px-4 flex items-center border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-800">LeadQualify AI</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
              isActive ? 'bg-gray-200' : ''
            }`
          }
        >
          <BarChart3 className="h-5 w-5 mr-3" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/leads"
          className={({ isActive }) =>
            `flex items-center w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
              isActive ? 'bg-gray-200' : ''
            }`
          }
        >
          <Database className="h-5 w-5 mr-3" />
          <span>Leads</span>
        </NavLink>

        <NavLink
          to="/scoring"
          className={({ isActive }) =>
            `flex items-center w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
              isActive ? 'bg-gray-200' : ''
            }`
          }
        >
          <Database className="h-5 w-5 mr-3" />
          <span>Lead Scoring</span>
        </NavLink>

        <NavLink
          to="/demo"
          className={({ isActive }) =>
            `flex items-center w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
              isActive ? 'bg-gray-200' : ''
            }`
          }
        >
          <Users className="h-5 w-5 mr-3" />
          <span>Scoring Demo</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
              isActive ? 'bg-gray-200' : ''
            }`
          }
        >
          <SettingsIcon className="h-5 w-5 mr-3" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
