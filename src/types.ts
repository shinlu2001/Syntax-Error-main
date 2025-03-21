export interface Lead {
  id: string;
  // New attributes from the Jigsawstack response:
  name: string;              // e.g., "John Doe"
  title: string;             // e.g., "CEO"
  company: string;           // e.g., "Tech Innovations Pte Ltd"
  location: string;          // e.g., "Singapore"
  linkedin_url: string;      // e.g., "https://www.linkedin.com/in/johndoe"
  connections: number;       // e.g., 500
  profile_summary: string;   // e.g., "Experienced entrepreneur in AI and cloud computing."
  email: string;             // e.g., "john.doe@example.com"
  phone: string;             // e.g., "+65 1234 5678"

  // You can still keep additional properties if needed:
  industry: string;          // This can be the industry from the API or reused from your original model.
  companySize?: string;
  website?: string;
  keywords: string[];
  score: number;
  createdAt: string;
  lastUpdated: string;
  engagements: Engagement[];
  status: 'qualified' | 'pending' | 'contacted';
  lastActivity: string;  // Add this line
  source: string;        // Also add this if needed
  conversionProbability?: number;
  revenue?: number;
  contacts?: Contact[];
  notes?: string;
  crmId?: string;
  funding?: number;
  founded?: string;
  lastScanned?: string;
  nextScanDate?: string;
  scanInterval?: number;
}

export interface CompanyData {
  name: string;
  industry: string;
  size: string;
  revenue: number | null;
  description: string | null;
  technologies: string[];
  funding?: number | null;
  founded?: string | null;
  social: {
    linkedin: string | null;
    twitter: string | null;
  };
  location: {
    country: string | null;
    city: string | null;
  };
}

export interface LeadScore {
  industryScore: number;
  sizeScore: number;
  keywordScore: number;
  engagementScore: number;
  recencyScore: number;
  fundingScore?: number;
  totalScore: number;
  status: 'hot' | 'warm' | 'cold';
}

export interface Engagement {
  type: 'website_visit' | 'content_download' | 'demo_request' | 'email_open' | 'email_click';
  date: string;
  details?: string;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string | null;
  phone?: string;
  linkedin?: string | null;
  lastContact?: string;
  seniority?: string;
  department?: string;
}

export interface CRMIntegration {
  type: 'salesforce' | 'hubspot' | 'zoho';
  apiKey: string;
  enabled: boolean;
}