// frontend/src/App.js
import React, { useState, useMemo, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline'; // Add this import
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

//lazy load components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookGallery from './pages/BookGallery';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import VocabularyPage from './pages/VocabularyPage';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import ResourcesPage from './pages/Resources';
import LittleLibraryPage from './pages/LittleLibrary';
import Discussions from './pages/Discussions';
import Treehouse from './pages/Treehouse';
import BookExplorer from './pages/BookExplorer';
import BookDetail from './pages/BookDetail';

// Create a theme instance
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#2196f3',
      ...(mode === 'dark' && {
        main: '#90caf9',
      }),
    },
    secondary: {
      main: '#ff9800',
      ...(mode === 'dark' && {
        main: '#ffb74d',
      }),
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#fff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#000000' : '#ffffff',
      secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
  },
});

function App() {
  const [mode, setMode] = useState('dark'); // Default to dark mode

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Add this to enable theme background */}
      <Router>
        <div className="App">
          <Navbar toggleTheme={toggleTheme} currentTheme={mode} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/books" element={<BookGallery />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/books/:bookId/vocabulary" element={<VocabularyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/little-library" element={<LittleLibraryPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/treehouse" element={<Treehouse />} />
            <Route path="/explore" element={<BookExplorer />} />
            <Route path="/books/:bookId" element={<BookDetail />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;