// frontend/src/services/etymologyAPI.js

// This will be your interface to whatever external API you choose later
export class EtymologyAPI {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    this.baseUrl = process.env.REACT_APP_ETYMOLOGY_API_URL || 'default_url';
  }

  async getWordEtymology(word) {
    // This is where you'll implement the actual API call later
    try {
      // For now, return null to fall back to local data
      return null;
      
      // Later, you'll implement something like:
      // const response = await fetch(`${this.baseUrl}/etymology/${word}`, {
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`,
      //   }
      // });
      // return await response.json();
    } catch (error) {
      console.error('Etymology API error:', error);
      return null;
    }
  }
}

// Create a singleton instance
export const etymologyAPI = new EtymologyAPI();