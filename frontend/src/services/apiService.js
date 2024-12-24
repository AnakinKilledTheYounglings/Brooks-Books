import config from '../config/config';

class ApiService {
  constructor() {
    this.baseUrl = config.apiUrl;
    this.getHeaders = () => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  // Auth endpoints
  async login(credentials) {
      console.log('Login URL:', `${this.baseUrl}/auth/login`); // Debug log
      console.log('Sending credentials:', credentials); // Debug log
      
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
  
      // Add debug logging
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.error || 'Login failed');
      }
  
      return this.handleResponse(response);
  }

  async register(userData) {
    const response = await fetch(`${this.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  // Book endpoints
  async getBooks() {
    const response = await fetch(`${this.baseUrl}/api/books`);
    return this.handleResponse(response);
  }

  async uploadDrawing(bookId, file) {
    const formData = new FormData();
    formData.append('drawing', file);

    const response = await fetch(`${this.baseUrl}/api/books/${bookId}/drawings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    return this.handleResponse(response);
  }

  // Profile endpoints
  async getProfile() {
    const response = await fetch(`${this.baseUrl}/api/auth/profile`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async updateProfilePhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch(`${this.baseUrl}/api/auth/profile/photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    return this.handleResponse(response);
  }

  // Helper method to handle responses
  async handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    return data;
  }

// Add these methods to your existing apiService class
// Book related methods
async getAllBooks() {
    const response = await fetch(`${this.baseUrl}/api/books`);
    return this.handleResponse(response);
}

async uploadDrawing(bookId, file) {
    const formData = new FormData();
    formData.append('drawing', file);

    const response = await fetch(`${this.baseUrl}/api/books/${bookId}/drawings`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
    });
    return this.handleResponse(response);
}

async likeDrawing(bookId, drawingId) {
    const response = await fetch(
    `${this.baseUrl}/api/books/${bookId}/drawings/${drawingId}/like`,
    {
        method: 'POST',
        headers: this.getHeaders()
    }
    );
    return this.handleResponse(response);
}

async unlikeDrawing(bookId, drawingId) {
    const response = await fetch(
    `${this.baseUrl}/api/books/${bookId}/drawings/${drawingId}/unlike`,
    {
        method: 'POST',
        headers: this.getHeaders()
    }
    );
    return this.handleResponse(response);
}

async addComment(bookId, drawingId, content) {
    const response = await fetch(
    `${this.baseUrl}/api/books/${bookId}/drawings/${drawingId}/comments`,
    {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ content })
    }
    );
    return this.handleResponse(response);
}

async addTags(bookId, tags) {
    const response = await fetch(`${this.baseUrl}/api/books/${bookId}/tags`, {
    method: 'POST',
    headers: this.getHeaders(),
    body: JSON.stringify({ tags })
    });
    return this.handleResponse(response);
}

async getDiscussions() {
    const response = await fetch(`${this.baseUrl}/api/discussions`);
    return this.handleResponse(response);
  }

  async createDiscussion(discussionData) {
    const response = await fetch(`${this.baseUrl}/api/discussions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(discussionData)
    });
    return this.handleResponse(response);
  }

  async addDiscussionComment(discussionId, content) {
    const response = await fetch(`${this.baseUrl}/api/discussions/${discussionId}/comments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ content })
    });
    return this.handleResponse(response);
  }

  // Profile methods
  async getProfile() {
    const response = await fetch(`${this.baseUrl}/api/auth/profile`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async updateProfilePhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch(`${this.baseUrl}/api/auth/profile/photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    return this.handleResponse(response);
  }

  async getProfileDrawings() {
    const response = await fetch(`${this.baseUrl}/api/auth/profile/drawings`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  connectWebSocket() {
      this.ws = new WebSocket(`ws://localhost:3001`);
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        return data;
      };
  
      return this.ws;
    }
  
    sendChatMessage(messageData) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(messageData));
      } else {
        throw new Error('WebSocket connection not open');
      }
    }

}

export default new ApiService();