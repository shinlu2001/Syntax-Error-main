// Pagination states and logic added to your component

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { computeLeadScore, LeadScore } from '../utils/leadScoring';
import { Search, Plus, ArrowDown } from 'lucide-react';
import { Lead } from '../types';

interface CompanyRecord {
  id: string;
  name: string;
  industries?: string;
  founded_date?: string;
  num_employees?: string;
  operating_status?: string;
  contact_email?: string;
  about?:string;
}

const LeadDiscovery: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

// In your LeadDiscovery component

// State
const [currentPage, setCurrentPage] = useState<number>(1);
const itemsPerPage = 10;

  // Filter leads by search query
  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );


// Slicing leads for current page
const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
const currentItems = filteredLeads.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
const visibleRange = 2; // show ±2 pages around current
const startPage = Math.max(1, currentPage - visibleRange);
const endPage = Math.min(totalPages, currentPage + visibleRange);
const pageNumbers = [];
for (let i = startPage; i <= endPage; i++) {
  pageNumbers.push(i);
}


// Helper function to change page
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};


  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('company')
        .select('*');

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setLoading(false);
        return;
      }

      const fetchedLeads: Lead[] = (data as CompanyRecord[]).map((company) => {
        const scoreObj: LeadScore = computeLeadScore({
          cb_rank: 0,
          industries: company.industries || 'Technology',
          founded_date: company.founded_date,
          num_employees: company.num_employees,
          operating_status: company.operating_status,
          email: company.contact_email || '',
        });

        // Retrieve contact email or use a dash if not available.
        const email = company.contact_email && company.contact_email.trim() !== '' 
          ? company.contact_email 
          : '-';

        let status: 'qualified' | 'pending' | 'contacted' = 'pending';
        if (scoreObj.status === 'hot') status = 'qualified';
        else if (scoreObj.status === 'warm') status = 'pending';
        else status = 'contacted';

        return {
          id: company.id,
          name: company.name,
          title: '',
          company: company.name,
          location: '',
          linkedin_url: '',
          connections: 0,
          profile_summary: company.about || '',
          email,
          phone: '',
          industry: company.industries || 'Technology',
          companySize: company.num_employees || '',
          website: '',
          keywords: [],
          score: Math.round(scoreObj.totalScore),
          status,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          engagements: [],
          conversionProbability: scoreObj.conversionProbability,
          revenue: 0,
          contacts: [],
          notes: '',
          crmId: '',
          funding: 0,
          founded: company.founded_date || '',
          lastScanned: '',
          nextScanDate: '',
          scanInterval: 0,
          source: 'N/A',
          lastActivity: 'N/A',
        };
      });

      setLeads(fetchedLeads);
      setLoading(false);
    };

    fetchLeads();
  }, []);



  const handleSelectLead = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = filteredLeads.map((lead) => lead.id);
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(allIds);
    }
  };



  if (loading) return <div>Loading leads...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-6">
        {/* Heading & Tools */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Lead Management</h2>
            <p className="text-sm text-gray-500">
              View and manage all leads collected from various sources
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute top-2 left-2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium">
              <Plus className="h-4 w-4 mr-1" />
              Add Lead Manually
            </button>
            <button className="text-sm text-gray-600 underline">Advanced Filters</button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  <input
                    type="checkbox"
                    checked={
                      selectedLeads.length === filteredLeads.length &&
                      filteredLeads.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Lead</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Score</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{lead.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {lead.score}
                    <ArrowDown className="inline h-4 w-4 ml-1 text-gray-400" />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {lead.status === 'qualified' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Qualified
                      </span>
                    )}
                    {lead.status === 'pending' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                    {lead.status === 'contacted' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        Contacted
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {lead.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

     

        <nav className="inline-flex items-center flex-wrap space-x-1" aria-label="Pagination">
  {/* Pagination Controls */}
  <div className="mt-4 flex justify-center">
    <nav className="inline-flex items-center space-x-1" aria-label="Pagination">

      {/* Previous button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 text-sm rounded ${
          currentPage === 1 ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        «
      </button>

      {/* Possibly show "1" if we're not already near page 1 */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => goToPage(1)}
            className="px-3 py-2 text-sm rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            1
          </button>
          {/* If there's a gap between 1 and startPage, show "..." */}
          {startPage > 2 && (
            <span className="px-2 py-2 text-sm text-gray-500 select-none">...</span>
          )}
        </>
      )}

      {/* Page buttons in the range [startPage .. endPage] */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-3 py-2 text-sm rounded ${
            page === currentPage
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Possibly show last page if we're not near the last page */}
      {endPage < totalPages && (
        <>
          {/* If there's a gap between endPage and totalPages - 1, show "..." */}
          {endPage < totalPages - 1 && (
            <span className="px-2 py-2 text-sm text-gray-500 select-none">...</span>
          )}
          <button
            onClick={() => goToPage(totalPages)}
            className="px-3 py-2 text-sm rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 text-sm rounded ${
          currentPage === totalPages ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        »
      </button>
    </nav>
  </div>

</nav>


      </main>
    </div>
  );
};

export default LeadDiscovery;
