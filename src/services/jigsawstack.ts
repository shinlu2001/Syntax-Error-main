import axios from 'axios';
import { CompanyData, Contact } from '../types';
import { supabase } from './supabase';


const API_KEY = import.meta.env.VITE_JIGSAWSTACK_API_KEY;
if (!API_KEY) {
  throw new Error('Jigsawstack API key is not configured');
}

const API_URL = 'https://api.jigsawstack.com/v1/web/search';

const jigsawstackApi = axios.create({
  baseURL: API_URL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000,
});

/**
 * Performs a web search using Jigsawstack.
 * @param query The search query string.
 * @returns The API response data.
 */
export const searchWeb = async (query: string = 'How to build a chatbot') => {
  const response = await jigsawstackApi.get('', {
    params: { query }
  });
  return response.data;
};


// Add response interceptor for better error handling
jigsawstackApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Request Error:', error.request);
      throw new Error('Network Error: Unable to connect to the API');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Config Error:', error.message);
      throw new Error(`Request Error: ${error.message}`);
    }
  }
);

export const scrapeWebsite = async (url: string) => {
  try {
    const response = await jigsawstackApi.post('/ai/scrape', {
      url,
      element_prompts: ["prices"]
    });
    return response.data;
  } catch (error) {
    console.error('Error scraping website:', error);
    throw error;
  }
};

export const enrichCompanyData = async (domain: string): Promise<CompanyData | null> => {
  try {
    // First check if we have cached data
    const { data: cachedData } = await supabase
      .from('company_data')
      .select('*')
      .eq('domain', domain)
      .single();

    if (cachedData) {
      return {
        name: cachedData.name || domain.split('.')[0],
        industry: cachedData.industry || 'technology',
        size: cachedData.size || 'unknown',
        revenue: null,
        description: null,
        technologies: [],
        social: {
          linkedin: null,
          twitter: null,
        },
        location: {
          country: null,
          city: null,
        }
      };
    }

    // If no cached data, create basic entry
    const companyData: CompanyData = {
      name: domain.split('.')[0],
      industry: 'technology',
      size: 'unknown',
      revenue: null,
      description: null,
      technologies: [],
      social: {
        linkedin: null,
        twitter: null,
      },
      location: {
        country: null,
        city: null,
      }
    };

    // Store in Supabase
    const { error: insertError } = await supabase
      .from('company_data')
      .upsert({
        domain,
        name: companyData.name,
        industry: companyData.industry,
        size: companyData.size,
        status: 'pending_review',
        last_updated: new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (insertError) {
      console.error('Error storing company data:', insertError);
      return null;
    }

    return companyData;
  } catch (error) {
    console.error('Error enriching company data:', error);
    throw error;
  }
};

export const findCompanyContacts = async (domain: string): Promise<Contact[]> => {
  try {
    // For now, return empty array to avoid API errors
    return [];
  } catch (error) {
    console.error('Error finding company contacts:', error);
    return [];
  }
};

export const extractDomainFromUrl = (url: string): string => {
  try {
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
    const domain = new URL(urlWithProtocol).hostname.replace('www.', '');
    return domain;
  } catch {
    return url.replace('www.', '').split('/')[0];
  }
};

export const analyzeTechnologyStack = async (domain: string) => {
  try {
    // For now, return empty array to avoid API errors
    return { technologies: [] };
  } catch (error) {
    console.error('Error analyzing technology stack:', error);
    return { technologies: [] };
  }
};

function mapCompanySize(employees?: number): string {
  if (!employees) return 'unknown';
  if (employees > 1000) return 'enterprise';
  if (employees > 250) return 'mid-market';
  if (employees > 50) return 'small business';
  return 'startup';
}