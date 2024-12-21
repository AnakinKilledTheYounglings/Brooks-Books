// backend/src/services/tenorService.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.TENOR_API_KEY;
const CLIENT_KEY = process.env.TENOR_CLIENT_KEY;
const BASE_URL = 'https://tenor.googleapis.com/v2';

export const searchGifs = async (searchTerm, limit = 20) => {
  try {
    console.log('Searching GIFs with:', { 
      searchTerm, 
      API_KEY: !!API_KEY, 
      CLIENT_KEY: !!CLIENT_KEY 
    });

    if (!API_KEY || !CLIENT_KEY) {
      throw new Error('Missing Tenor API configuration');
    }

    const url = `${BASE_URL}/search?q=${encodeURIComponent(searchTerm)}&key=${API_KEY}&client_key=${CLIENT_KEY}&limit=${limit}&contentfilter=medium`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Tenor API error:', error);
      throw new Error('Failed to fetch GIFs');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching GIFs:', error);
    throw error;
  }
};

export const testTenorAPI = async () => {
  try {
    console.log('Testing Tenor API connection...');
    
    if (!API_KEY || !CLIENT_KEY) {
      throw new Error('Missing Tenor API configuration');
    }

    const url = `${BASE_URL}/featured?key=${API_KEY}&client_key=${CLIENT_KEY}&limit=1`;
    console.log('Testing URL:', url);
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Tenor API test successful!');
    return true;
  } catch (error) {
    console.error('Tenor API test failed:', error);
    return false;
  }
};

export const getTrendingGifs = async (limit = 20) => {
  try {
    if (!API_KEY || !CLIENT_KEY) {
      throw new Error('Missing Tenor API configuration');
    }

    const url = `${BASE_URL}/featured?key=${API_KEY}&client_key=${CLIENT_KEY}&limit=${limit}&contentfilter=medium`;
    
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.text();
      console.error('Tenor API error:', error);
      throw new Error('Failed to fetch trending GIFs');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching trending GIFs:', error);
    throw error;
  }
};