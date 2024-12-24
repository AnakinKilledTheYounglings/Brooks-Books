const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  // Add other configuration variables here
};

if (process.env.NODE_ENV !== 'production') {
  console.log('Current API URL:', config.apiUrl);
}

export default config;