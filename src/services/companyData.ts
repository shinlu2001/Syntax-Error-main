import axios from 'axios';
import { supabase } from '../supabaseClient';
import { CompanyData } from '../types';

const COMPANY_DATA_TABLE = 'company_data';

export function extractDomainFromUrl(url: string): string {
  try {
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
    const domain = new URL(urlWithProtocol).hostname.replace('www.', '');
    return domain;
  } catch {
    return url.replace('www.', '').split('/')[0];
  }
}

export async function enrichCompanyData(domain: string): Promise<CompanyData | null> {
  try {
    // Basic company information collection
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
    const { data, error } = await supabase
      .from(COMPANY_DATA_TABLE)
      .upsert({
        domain,
        ...companyData,
        last_updated: new Date().toISOString(),
        status: 'pending_review'
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing company data:', error);
      return null;
    }

    return companyData;
  } catch (error) {
    console.error('Error enriching company data:', error);
    return null;
  }
}

export async function getCompanyStats() {
  try {
    const { data: totalLeads, error: totalError } = await supabase
      .from(COMPANY_DATA_TABLE)
      .select('count')
      .single();

    const { data: qualifiedLeads, error: qualifiedError } = await supabase
      .from(COMPANY_DATA_TABLE)
      .select('count')
      .eq('status', 'qualified')
      .single();

    const { data: rejectedLeads, error: rejectedError } = await supabase
      .from(COMPANY_DATA_TABLE)
      .select('count')
      .eq('status', 'rejected')
      .single();

    if (totalError || qualifiedError || rejectedError) {
      console.error('Error fetching stats:', { totalError, qualifiedError, rejectedError });
      return null;
    }

    return {
      total: totalLeads?.count || 0,
      qualified: qualifiedLeads?.count || 0,
      rejected: rejectedLeads?.count || 0,
      pending: (totalLeads?.count || 0) - (qualifiedLeads?.count || 0) - (rejectedLeads?.count || 0)
    };
  } catch (error) {
    console.error('Error getting company stats:', error);
    return null;
  }
}