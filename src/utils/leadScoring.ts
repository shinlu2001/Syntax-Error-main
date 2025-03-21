// src/utils/leadScoring.ts

export interface LeadScore {
  totalScore: number;
  status: 'hot' | 'warm' | 'cold';
  conversionProbability: number;
}

/**
 * Compute a composite lead score using multiple firmographic signals.
 * @param company - An object with firmographic properties from your CSV/Supabase record.
 */
export function computeLeadScore(company: {
  cb_rank?: number;
  num_employees?: string; // e.g., "101-250"
  founded_date?: string;
  industries?: string;
  operating_status?: string;
  email?:string;
}): LeadScore {
  let score = 0;

  // --- Crunchbase Rank Scoring ---
  // Lower rank is better (assuming cb_rank exists and is a number)
  if (company.cb_rank !== undefined) {
    if (company.cb_rank < 1000) {
      score += 30;
    } else if (company.cb_rank < 10000) {
      score += 15;
    } else {
      score += 5;
    }
  }

  // --- Employee Count Scoring ---
  // Use the lower bound if provided as a range ("101-250"); if missing, assume 0.
  let employeeCount = 0;
  if (company.num_employees && company.num_employees !== 'N/A' ) {
    const parts = company.num_employees.split('-');
    employeeCount = parseInt(parts[0], 10) || 0;
    if (employeeCount > 500) {
      score += 20;
    } else if (employeeCount >= 200) {
      score += 15;
    } else if (employeeCount >= 100) {
      score += 10;
    } else {
      score += 5;
    }
  }

  // --- Company Age Scoring ---
  // Compute age from founded_date. If company is young (<5 years), reward higher points.
  if (company.founded_date) {
    const foundedYear = new Date(company.founded_date).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - foundedYear;
    if (age < 5) {
      score += 20;
    } else if (age < 10) {
      score += 10;
    } else {
      score += 5;
    }
  }

  // --- Industry Scoring ---
  // Add bonus if industry matches target sectors.
  const targetIndustries = ['Technology', 'Software', 'AI'];
  if (company.industries) {
    const industryText = company.industries.toLowerCase();
    if (targetIndustries.some((target) => industryText.includes(target.toLowerCase()))) {
      score += 20;
    }
  }

  // --- Operating Status Scoring ---
  // Active companies receive extra points.
  if (company.operating_status && company.operating_status.toLowerCase() === 'active') {
    score += 10;
  }

  // --- Determine Overall Status & Conversion Probability ---
  let status: 'hot' | 'warm' | 'cold' = 'cold';
  if (score >= 80) {
    status = 'hot';
  } else if (score >= 50) {
    status = 'warm';
  }

  let conversionProbability = 30;
  if (score >= 80) {
    conversionProbability = 90;
  } else if (score >= 50) {
    conversionProbability = 60;
  }

  return {
    totalScore: score,
    status,
    conversionProbability,
  };
}
