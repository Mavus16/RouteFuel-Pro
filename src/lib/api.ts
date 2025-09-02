import { RouteRequest, RouteResponse } from './types';

const WEBHOOK_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/webhook/calc`
  : 'https://manav-n8n.duckdns.org/webhook/calc';

export async function calculateRoute(request: RouteRequest): Promise<RouteResponse> {
  try {
    // Production: Remove debug logging
    // console.log('Sending request to:', WEBHOOK_URL);
    // console.log('Request data:', request);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    // Production: Remove debug logging
    // console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      // Production: Keep error logging for debugging
      console.error('Response error text:', errorText);
      throw new Error('Service temporarily unavailable, please try again later.');
    }

    const data = await response.json();
    // Production: Remove debug logging
    // console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Error calculating route:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Service temporarily unavailable, please try again later.');
  }
}
