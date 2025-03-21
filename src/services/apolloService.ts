// apolloService.ts

export interface PersonDetail {
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    hashed_email: string;
    organization_name: string;
    domain: string;
    id: string;
    linkedin_url: string;
  }
  
  /**
   * Calls the Apollo.io bulk match API with the given person details.
   * @param details Array of person detail objects.
   * @returns The API response as a JSON object.
   */
  export const bulkMatchPeople = async (details: PersonDetail[]) => {
    const response = await fetch('http://localhost:5173/api/apollo', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        // You can still send your API key in the headers if required by Apollo:
        'x-api-key': import.meta.env.VITE_APOLLO_API_KEY,
      },
      body: JSON.stringify({ details }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error connecting to Apollo API');
    }
  
    return response.json();
  };