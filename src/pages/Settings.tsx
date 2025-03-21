import React, { useState } from 'react';
import { User, Bell, Key, BarChart3, Sliders, Save } from 'lucide-react';

interface KPIConfig {
  name: string;
  target: number;
  enabled: boolean;
}

interface Profile {
  name: string;
  email: string;
  role: string;
  notifications: boolean;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'kpis' | 'api' | 'preferences'>('profile');
  const [profile, setProfile] = useState<Profile>({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Sales Manager',
    notifications: true,
  });

  const [kpis, setKpis] = useState<KPIConfig[]>([
    { name: 'Lead Conversion Rate', target: 25, enabled: true },
    { name: 'Hot Leads per Month', target: 50, enabled: true },
    { name: 'Average Lead Score', target: 75, enabled: true },
    { name: 'Response Time (hours)', target: 24, enabled: true },
  ]);

  const [apiKeys, setApiKeys] = useState({
    jigsawstack: 'sk_462faa5629a920f82d9cdce64d557c5bb0fbacabccee756eafa00d8f4e3c959676327d43ce620a6e4e858ee319fefdbc483d6b53045b94c425542b57f5899220024jyHBdkyg6nMw2LwReO',
    crm: '',
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update
    console.log('Profile updated:', profile);
  };

  const handleKPIUpdate = (index: number, field: keyof KPIConfig, value: number | boolean) => {
    const updatedKPIs = [...kpis];
    updatedKPIs[index] = { ...updatedKPIs[index], [field]: value };
    setKpis(updatedKPIs);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-6 inline-flex items-center ${
              activeTab === 'profile'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="h-5 w-5 mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('kpis')}
            className={`py-4 px-6 inline-flex items-center ${
              activeTab === 'kpis'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            KPIs
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-4 px-6 inline-flex items-center ${
              activeTab === 'api'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Key className="h-5 w-5 mr-2" />
            API Keys
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-4 px-6 inline-flex items-center ${
              activeTab === 'preferences'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Sliders className="h-5 w-5 mr-2" />
            Preferences
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate}>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option>Sales Representative</option>
                  <option>Sales Manager</option>
                  <option>Account Executive</option>
                  <option>Business Development</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={profile.notifications}
                  onChange={(e) => setProfile({ ...profile, notifications: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                  Enable email notifications
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </button>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'kpis' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Key Performance Indicators</h3>
            <div className="space-y-4">
              {kpis.map((kpi, index) => (
                <div key={kpi.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={kpi.enabled}
                      onChange={(e) => handleKPIUpdate(index, 'enabled', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{kpi.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Target:</span>
                    <input
                      type="number"
                      value={kpi.target}
                      onChange={(e) => handleKPIUpdate(index, 'target', parseInt(e.target.value))}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Jigsawstack API Key</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="password"
                  value={apiKeys.jigsawstack}
                  onChange={(e) => setApiKeys({ ...apiKeys, jigsawstack: e.target.value })}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CRM API Key</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="password"
                  value={apiKeys.crm}
                  onChange={(e) => setApiKeys({ ...apiKeys, crm: e.target.value })}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your CRM API key"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">System Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Auto-refresh Lead Data</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Dark Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Default Lead View</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option>Table View</option>
                  <option>Card View</option>
                  <option>Kanban View</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;