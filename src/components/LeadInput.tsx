import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Lead } from '../types';
// import { calculateLeadScore } from '../utils/leadScoring';
import { enrichCompanyData, extractDomainFromUrl } from '../services/companyData';

interface LeadInputProps {
  onLeadAdd: (lead: Lead) => void;
}

const LeadInput: React.FC<LeadInputProps> = ({ onLeadAdd }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    keywords: '',
  });
  const [isEnriching, setIsEnriching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEnriching(true);

    try {
      const domain = extractDomainFromUrl(formData.website);
      const enrichedData = await enrichCompanyData(domain);

      const keywords = formData.keywords.split(',').map(k => k.trim());
      const score = calculateLeadScore(
        enrichedData?.industry || formData.industry,
        enrichedData?.size || formData.companySize,
        keywords
      );
      
      const newLead: Lead = {
        id: crypto.randomUUID(),
        companyName: enrichedData?.name || formData.companyName,
        industry: enrichedData?.industry || formData.industry,
        companySize: enrichedData?.size || formData.companySize,
        website: formData.website,
        keywords,
        score: score.totalScore,
        status: score.status,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        engagements: []
      };
      
      onLeadAdd(newLead);
      setFormData({
        companyName: '',
        industry: '',
        companySize: '',
        website: '',
        keywords: '',
      });
    } catch (error) {
      console.error('Error processing lead:', error);
    } finally {
      setIsEnriching(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="border-b border-gray-200 pb-8">
        <h2 className="text-xl font-semibold text-gray-900">Add New Lead</h2>
        <p className="mt-2 text-sm text-gray-600">Enter the company information to add a new lead to your pipeline.</p>
      </div>

      <div className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select Industry</option>
              <option value="artificial intelligence">Artificial Intelligence</option>
              <option value="machine learning">Machine Learning</option>
              <option value="software">Software</option>
              <option value="technology">Technology</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
              Company Size
            </label>
            <select
              id="companySize"
              value={formData.companySize}
              onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select Size</option>
              <option value="enterprise">Enterprise</option>
              <option value="mid-market">Mid-Market</option>
              <option value="small business">Small Business</option>
              <option value="startup">Startup</option>
            </select>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="url"
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              id="keywords"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="ai, automation, digital transformation"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isEnriching}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEnriching ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Processing...
                </>
              ) : (
                'Add Lead'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadInput;