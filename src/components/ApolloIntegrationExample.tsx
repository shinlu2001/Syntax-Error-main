import React, { useState } from 'react';
import { bulkMatchPeople, PersonDetail } from '../services/apolloService';
import { searchWeb } from '../services/jigsawstack';

// Define the structure of a Jigsawstack result (adjust fields as necessary)
interface JigsawResult {
  name?: string;
  email?: string;
  company?: string;
  linkedin_url?: string;
  // other fields as needed
}

// Helper: Split a full name into first and last names, with defaults.
const splitName = (fullName?: string): { first_name: string; last_name: string } => {
  if (!fullName) return { first_name: 'Unknown', last_name: '' };
  const parts = fullName.trim().split(' ');
  return { first_name: parts[0] || 'Unknown', last_name: parts.slice(1).join(' ') };
};

// Helper: Extract the domain from a URL.
const extractDomain = (url?: string): string => {
  if (!url) return 'unknown';
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (error) {
    return 'unknown';
  }
};

// Map Jigsawstack results to Apollo's expected PersonDetail format.
const mapJigsawResultsToApolloDetails = (results: JigsawResult[]): PersonDetail[] => {
  return results.map((result) => {
    const { first_name, last_name } = splitName(result.name);
    return {
      first_name,
      last_name,
      name: result.name || 'Unknown Name',
      email: result.email || '',
      hashed_email: '', // Implement hashing if needed.
      organization_name: result.company || 'Unknown Company',
      domain: extractDomain(result.linkedin_url),
      id: crypto.randomUUID(),
      linkedin_url: result.linkedin_url || ''
    };
  });
};

const ApolloIntegrationExample: React.FC = () => {
  const [apolloResponse, setApolloResponse] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEnrichment = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Query Jigsawstack for LinkedIn profiles with your specific query.
      const query = ':site:linkedin.com/in/ "CEO" or "Founder" (tech) "Singapore"';
      const jigsawResponse = await searchWeb(query);
      
      // Ensure the results array exists.
      const jigsawResults: JigsawResult[] = jigsawResponse.results || [];
      if (!jigsawResults.length) {
        setError('No results found in the Jigsawstack response.');
        setIsLoading(false);
        return;
      }
      
      // Map Jigsawstack results into Apollo's required format.
      const details: PersonDetail[] = mapJigsawResultsToApolloDetails(jigsawResults);
      
      // Send the mapped details to the Apollo API.
      const apolloData = await bulkMatchPeople(details);
      setApolloResponse(apolloData);
    } catch (err: any) {
      setError(err.message || 'An error occurred while enriching data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Apollo Bulk Enrichment</h1>
      <button onClick={handleEnrichment} disabled={isLoading} style={{ padding: '10px 20px' }}>
        {isLoading ? 'Loading...' : 'Enrich Data with Apollo'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {apolloResponse && (
        <div style={{ marginTop: '20px' }}>
          <h2>Enrichment Result:</h2>
          <pre style={{ background: '#f4f4f4', padding: '10px' }}>
            {JSON.stringify(apolloResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApolloIntegrationExample;
