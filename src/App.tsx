import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
 import Leads from './components/LeadDiscovery';
import LeadScoring from './components/LeadScoringConfig';
// import ScoringDemo from './pages/ScoringDemo'; 
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const queryClient = new QueryClient();

function App() {
// In your Header component or directly in App.tsx
const handleConnectCRM = async () => {
  // For instance, open a modal or call a function to initiate the CRM connection.
  // This might open an OAuth window or trigger a popup.
  // Example using window.location for an OAuth redirect:
  window.location.href = 'https://app.hubspot.com/oauth/authorize?client_id=90573f32-5e63-4474-b919-c360e4c9cff9&scope=contacts%20crm.objects.contacts.read&https://app-na2.hubspot.com/oauth/authorize?client_id=90573f32-5e63-4474-b919-c360e4c9cff9&redirect_uri=http://localhost:5173/&scope=oauth';
};


  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header onConnectCRM={handleConnectCRM} />
            <main className="pt-16 px-6 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads"  element={<Leads />}  />
                <Route path="/scoring" element={<LeadScoring />} />
                <Route path="/demo"/>
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
