// frontend/src/services/recommendationService.js
const API_URL = 'http://localhost:3001/api';

class RecommendationService {
  async getSimilarBooks(bookId) {
    try {
      const response = await fetch(`${API_URL}/recommendations/similar/${bookId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch similar books');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching similar books:', error);
      throw error;
    }
  }

  async getPersonalizedRecommendations() {
    try {
      const response = await fetch(`${API_URL}/recommendations/user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  async getBooksByTag(tag) {
    try {
      const response = await fetch(`${API_URL}/recommendations/tag/${encodeURIComponent(tag)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch books by tag');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching books by tag:', error);
      throw error;
    }
  }
}

export default new RecommendationService();