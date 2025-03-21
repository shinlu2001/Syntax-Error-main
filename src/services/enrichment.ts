import { rateLimitedRequest, jigsawstackApi, linkedinApi, crunchbaseApi, handleApiError } from './api';
import { CompanyData, Contact } from '../types';

export const enrichCompanyData = async (domain: string): Promise<CompanyData> => {
  try {
    // Parallel requests for different data sources
    const [jigsawData, crunchbaseData] = await Promise.all([
      rateLimitedRequest(() => jigsawstackApi.get('/enrich/company', { params: { domain } })),
      rateLimitedRequest(() => crunchbaseApi.get('/organizations/lookup', { params: { domain } }))
    ]);

    // Merge and normalize data from multiple sources
    return {
      name: jigsawData.data.name || crunchbaseData.data.properties.name || domain,
      industry: (jigsawData.data.industry || crunchbaseData.data.properties.industry_group)?.toLowerCase() || 'technology',
      size: mapCompanySize(jigsawData.data.employees || crunchbaseData.data.properties.employee_count),
      revenue: jigsawData.data.revenue || crunchbaseData.data.properties.annual_revenue,
      description: jigsawData.data.description || crunchbaseData.data.properties.short_description,
      technologies: Array.isArray(jigsawData.data.technologies) ? jigsawData.data.technologies : [],
      funding: crunchbaseData.data.properties.funding_total || null,
      founded: crunchbaseData.data.properties.founded_on || null,
      social: {
        linkedin: jigsawData.data.linkedin || null,
        twitter: jigsawData.data.twitter || null,
      },
      location: {
        country: jigsawData.data.country || crunchbaseData.data.properties.country,
        city: jigsawData.data.city || crunchbaseData.data.properties.city,
      }
    };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const findCompanyContacts = async (domain: string): Promise<Contact[]> => {
  try {
    const [jigsawContacts, linkedinContacts] = await Promise.all([
      rateLimitedRequest(() => jigsawstackApi.get('/enrich/contacts', { params: { domain } })),
      rateLimitedRequest(() => linkedinApi.get('/people/search', { 
        params: { 
          company_domain: domain,
          count: 10,
          roles: ['SENIOR_LEADERSHIP', 'DECISION_MAKER']
        }
      }))
    ]);

    const contacts = [...jigsawContacts.data, ...linkedinContacts.data.elements]
      .map(contact => ({
        id: crypto.randomUUID(),
        name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unknown',
        title: contact.title || contact.position || 'Unknown',
        email: contact.email || null,
        linkedin: contact.linkedin || contact.profileUrl || null,
        seniority: contact.seniority || 'Unknown',
        department: contact.department || 'Unknown',
      }));

    // Remove duplicates based on email or LinkedIn profile
    return Array.from(new Map(contacts.map(c => [c.email || c.linkedin, c])).values());
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const analyzeTechnologyStack = async (domain: string) => {
  try {
    const [techData, buildWithData] = await Promise.all([
      rateLimitedRequest(() => jigsawstackApi.get('/enrich/technology', { params: { domain } })),
      rateLimitedRequest(() => axios.get(`https://builtwith.com/api/v3/free/${domain}`))
    ]);

    return {
      technologies: [
        ...(Array.isArray(techData.data.technologies) ? techData.data.technologies : []),
        ...(Array.isArray(buildWithData.data.technologies) ? buildWithData.data.technologies : [])
      ]
    };
  } catch (error) {
    handleApiError(error);
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