const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://brooks-books.onrender.com/api'  // Production backend URL
  : 'http://localhost:3001/api';            // Development backend URL

export default API_URL;