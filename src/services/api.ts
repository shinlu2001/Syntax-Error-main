import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import Bottleneck from 'bottleneck';

// Rate limiting configuration
const rateLimiter = new Bottleneck({
  minTime: 333, // Minimum time between requests (3 requests per second)
  maxConcurrent: 5, // Maximum concurrent requests
});

// Create API instances for different services
const createApiClient = (baseURL: string, apiKey: string) => {
  const client = axios.create({
    baseURL,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  // Configure retry mechanism
  axiosRetry(client, {
    retries: 3,
    retryDelay: (retryCount) => {
      return retryCount * 1000; // Progressive delay
    },
    retryCondition: (error) => {
      return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        error.response?.status === 429; // Retry on rate limit
    },
  });

  return client;
};

// API clients for different services
export const jigsawstackApi = createApiClient(
  'https://api.jigsawstack.com/v1',
  import.meta.env.VITE_JIGSAWSTACK_API_KEY
);

export const linkedinApi = createApiClient(
  'https://api.linkedin.com/v2',
  import.meta.env.VITE_LINKEDIN_API_KEY || ''
);

export const crunchbaseApi = createApiClient(
  'https://api.crunchbase.com/v3.1',
  import.meta.env.VITE_CRUNCHBASE_API_KEY || ''
);

// Error handling wrapper
export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 429:
          throw new Error('Rate limit exceeded. Please try again later.');
        case 401:
          throw new Error('Invalid API key or unauthorized access.');
        case 404:
          throw new Error('Resource not found.');
        default:
          throw new Error(`API Error: ${axiosError.response.statusText}`);
      }
    }
    throw new Error(`Network Error: ${axiosError.message}`);
  }
  throw error;
};

// Rate-limited request wrapper
export const rateLimitedRequest = async <T>(
  fn: () => Promise<T>,
  retries = 3
): Promise<T> => {
  return rateLimiter.schedule(async () => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && axios.isAxiosError(error) && error.response?.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return rateLimitedRequest(fn, retries - 1);
      }
      throw error;
    }
  });
};