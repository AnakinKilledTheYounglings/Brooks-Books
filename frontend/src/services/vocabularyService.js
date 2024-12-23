// frontend/src/services/vocabularyService.js
const API_URL = 'http://localhost:3001/api';


class VocabularyService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async getQuizForBook(bookId) {
      try {
        const response = await fetch(`${API_URL}/quiz/book/${bookId}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to fetch quiz');
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error fetching quiz:', error);
        throw error;
      }
    }

  async addVocabularyWord(wordData) {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      const response = await fetch(`${API_URL}/vocabulary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...wordData,
          createdBy: userId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add vocabulary word');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding vocabulary word:', error);
      throw error;
    }
  }

  async getBookVocabulary(bookId) {
    try {
      const response = await fetch(`${API_URL}/vocabulary/book/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vocabulary');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      throw error;
    }
  }

  async updateVocabularyWord(id, updateData) {
    try {
      const response = await fetch(`${API_URL}/vocabulary/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update vocabulary word');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating vocabulary word:', error);
      throw error;
    }
  }

  async deleteVocabularyWord(id) {
    try {
      const response = await fetch(`${API_URL}/vocabulary/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete vocabulary word');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting vocabulary word:', error);
      throw error;
    }
  }
}

const vocabularyServiceInstance = new VocabularyService();
export default vocabularyServiceInstance;