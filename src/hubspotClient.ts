// server/hubspotClient.ts
import { Client } from '@hubspot/api-client';
import { FilterOperatorEnum } from '@hubspot/api-client/lib/codegen/crm/contacts/models/Filter';

const hubspotClient = new Client({
  accessToken: import.meta.env.VITE_HUBSPOT_API_KEY, // ensure this is stored securely in your environment variables
});

/**
 * Upsert a contact (create or update) in HubSpot.
 * @param email - The contact's email address (HubSpot uses email as unique identifier)
 * @param properties - An object with contact properties (e.g., firstname, lastname, company)
 */
export async function upsertContact(email: string, properties: { [key: string]: any }) {
  try {
    // Try creating the contact first
    const createResponse = await hubspotClient.crm.contacts.basicApi.create({
      properties: { email, ...properties },
    });
    return createResponse;
  } catch (err: any) {
    // If a 409 conflict error occurs, the contact exists, so update it
    if (err.response && err.response.status === 409) {
      // Find the contact's id by searching for the email
      const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
        filterGroups: [
          {
            filters: [{
              propertyName: 'email',
              operator: FilterOperatorEnum.Eq, // Use the enum value instead of "EQ"
              value: email,
            }],
          },
        ],
        properties: ['email'],
      });
      if (searchResponse && searchResponse.results.length > 0) {
        const contactId = searchResponse.results[0].id;
        const updateResponse = await hubspotClient.crm.contacts.basicApi.update(contactId, {
          properties: { email, ...properties },
        });
        return updateResponse;
      }
    }
    throw err;
  }
}
