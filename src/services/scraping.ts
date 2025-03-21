import { jigsawstackApi, rateLimitedRequest, handleApiError } from './api';
import { supabase } from './supabase';

interface ScrapedProfile {
  url: string;
  full_name?: string;
  current_position?: string;
  company?: string;
  location?: string;
  skills?: string[];
  raw_data?: any;
}

export const scrapeProfile = async (url: string): Promise<ScrapedProfile> => {
  try {
    const response = await rateLimitedRequest(() => 
      jigsawstackApi.post('/ai/scrape', {
        url,
        element_prompts: [
          'full name',
          'current position',
          'company',
          'location',
          'skills'
        ]
      })
    );

    const scrapedData = response.data;
    
    // Transform scraped data into structured format
    const profile: ScrapedProfile = {
      url,
      full_name: scrapedData['full name'],
      current_position: scrapedData['current position'],
      company: scrapedData.company,
      location: scrapedData.location,
      skills: Array.isArray(scrapedData.skills) 
        ? scrapedData.skills 
        : scrapedData.skills?.split(',').map((s: string) => s.trim()),
      raw_data: scrapedData
    };

    // Store in Supabase
    const { data, error } = await supabase
      .from('scraped_profiles')
      .upsert({
        ...profile,
        last_scraped: new Date().toISOString(),
        next_scan_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        status: 'completed'
      })
      .select()
      .single();

    if (error) throw error;

    return profile;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getScrapingSchedule = async () => {
  try {
    const { data, error } = await supabase
      .from('scraped_profiles')
      .select('*')
      .lt('next_scan_date', new Date().toISOString())
      .order('next_scan_date');

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const updateScrapingSchedule = async (profileId: string, scanInterval: number) => {
  try {
    const nextScanDate = new Date(Date.now() + scanInterval * 24 * 60 * 60 * 1000);
    
    const { error } = await supabase
      .from('scraped_profiles')
      .update({
        scan_interval: scanInterval,
        next_scan_date: nextScanDate.toISOString()
      })
      .eq('id', profileId);

    if (error) throw error;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Batch scraping with rate limiting
export const batchScrapeProfiles = async (urls: string[]) => {
  const results = [];
  for (const url of urls) {
    try {
      const profile = await scrapeProfile(url);
      results.push({ url, status: 'success', data: profile });
    } catch (error) {
      results.push({ url, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
    // Add delay between requests to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return results;
};