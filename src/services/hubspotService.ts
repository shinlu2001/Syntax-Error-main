// src/services/hubspotService.ts
export async function pushLeadToHubSpot(lead: {
    email: string;
    firstName: string;
    lastName: string;
    company: string;
  }) {
    try {
      const response = await fetch('http://localhost:3001/api/upsert-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      });
      if (!response.ok) {
        throw new Error('Failed to push lead to HubSpot');
      }
      const result = await response.json();
      console.log('HubSpot response:', result);
      return result;
    } catch (error: any) {
      console.error('Error pushing lead to HubSpot:', error);
      throw error;
    }
  }
  