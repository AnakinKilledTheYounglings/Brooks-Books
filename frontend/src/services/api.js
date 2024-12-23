// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:3001';

export const api = {
  async searchGifs(query) {
    const response = await fetch(`${API_BASE_URL}/api/gifs/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to fetch GIFs');
    return response.json();
  },

  async getTrendingGifs() {
    const response = await fetch(`${API_BASE_URL}/api/gifs/trending`);
    if (!response.ok) throw new Error('Failed to fetch trending GIFs');
    return response.json();
  }
};