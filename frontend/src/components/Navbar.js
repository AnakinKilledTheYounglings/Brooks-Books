// frontend/src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
} from '@mui/material';
import { 
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon 
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function Navbar({ toggleTheme, currentTheme }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      console.log('Checking auth with token:', token);
      
      if (token) {
        // First check stored user data
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          setIsLoggedIn(true);
          setIsAdmin(storedUser.isAdmin === true);
        }
  
        try {
          const response = await fetch('http://localhost:3001/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          console.log('Profile response:', data);
          
          if (response.ok) {
            setIsLoggedIn(true);
            setIsAdmin(data.isAdmin === true);
            console.log('Is admin?', data.isAdmin);
          } else {
            console.log('Auth check failed:', data);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      }
    };

    
  
    checkAuthStatus();
  }, [localStorage.getItem('lastLogin')]);  // Add lastLogin as dependency


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastLogin');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <AppBar position="fixed" style={{ zIndex: 1100 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Brooks'Bookhouse
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ mr: 2 }}>
            <ThemeToggle currentTheme={currentTheme} toggleTheme={toggleTheme} />
          </Box>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/books">
            Books
          </Button>
          <Button color="inherit" component={RouterLink} to="/explore">
            Explore
          </Button>
          <Button color="inherit" component={RouterLink} to="/discussions">
            Discussions
          </Button>
          <Button color="inherit" component={RouterLink} to="/treehouse">
            Treehouse
          </Button>
          {isLoggedIn ? (
            <>
              <Button color="inherit" component={RouterLink} to="/profile">
                Profile
              </Button>
              {isAdmin && (
                <Button color="inherit" component={RouterLink} to="/admin">
                  Admin Dashboard
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;