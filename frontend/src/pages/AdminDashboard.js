// frontend/src/pages/AdminDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Tab,
  Tabs,
  IconButton,
  Chip,
  Dialog,
  //DialogTitle,
  //DialogContent,
  //DialogActions,
} from '@mui/material';
import { Delete, Edit, Add, CloudUpload, } from '@mui/icons-material';
import { GENRES } from '../constants/bookConstants';
import BulkUpload from '../components/BulkUpload';

import VocabularyManagement from '../components/VocabularyManagement';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [books, setBooks] = useState([]);
  const [openBookDialog, setOpenBookDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookFormData, setBookFormData] = useState({
    title: '',
    author: '',
    description: '',
    genres: [],
    tags: [],
    tagInput: '',
    ageRange: { min: 8, max: 15 }
  });
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalDrawings: 0,
    activeUsers: 0
  });

  // First, make fetchBooks a useCallback
  const fetchBooks = useCallback(async () => {
    try {
      //console.log('Fetching books...');
      const response = await fetch('http://localhost:3001/api/books');
      const data = await response.json();
      //console.log('Books fetched:', data);
      setBooks(data);
      //setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      //setError('Failed to load books');
      //setLoading(false);
    }
  }, []); // Empty dependency array since it doesn't depend on state
  
  
    const fetchStats = useCallback(async () => {
      try {
        // Calculate stats from books data
        const statsData = {
          totalBooks: books.length,
          totalDrawings: books.reduce((sum, book) => sum + (book.drawings?.length || 0), 0),
          activeUsers: new Set(books.flatMap(book => 
            (book.drawings || []).map(drawing => drawing.userId)
          )).size,
          booksPerAgeGroup: books.reduce((acc, book) => {
            const range = `${book.ageRange.min}-${book.ageRange.max}`;
            acc[range] = (acc[range] || 0) + 1;
            return acc;
          }, {})
        };
        
        setStats(statsData);
        console.log('Updated stats:', statsData); // Debug log
      } catch (error) {
        console.error('Error calculating stats:', error);
      }
    }, [books]);
  
  
    // Make sure this useEffect is present
    useEffect(() => {
      fetchStats();
    }, [books, fetchStats]);
    useEffect(() => {
          console.log('Starting to fetch books');
          fetchBooks();
        }, [fetchBooks]);
  
    const handleBookSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem('token');
        console.log('Auth token:', token);
        console.log('Selected book:', selectedBook);
    
        // Ensure bookFormData.tags is an array
        const existingTags = Array.isArray(bookFormData.tags) ? bookFormData.tags : [];
    
        // Process the new tags
        const newTags = bookFormData.tagInput
          ? bookFormData.tagInput.split(',').map(tag => tag.trim()).filter(tag => tag)
          : [];
    
        // Combine existing and new tags, remove duplicates
        const allTags = [...new Set([...existingTags, ...newTags])];
    
        const dataToSend = {
          ...bookFormData,
          tags: allTags
        };
        delete dataToSend.tagInput;
    
        const url = selectedBook
          ? `http://localhost:3001/api/books/${selectedBook._id}`
          : 'http://localhost:3001/api/books';
    
        const method = selectedBook ? 'PUT' : 'POST';
        console.log('Sending request:', {
          url,
          method,
          data: dataToSend
        });

        // Before the fetch
        console.log('About to send:', {
          url,
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: dataToSend
        });
        
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(dataToSend)
        });
    
    
        if (!response.ok) {
          const text = await response.text();
          console.error('Server response:', text);
          throw new Error(`Server error: ${text}`);
        }
    
        const data = await response.json();
        console.log('Success response:', data);

        console.log('Response status:', response.status);
        console.log('Response headers:', [...response.headers.entries()]);
    
        setOpenBookDialog(false);
        fetchBooks();
        setSelectedBook(null);
        setBookFormData({
          title: '',
          author: '',
          description: '',
          genres: [],
          tags: [],
          tagInput: '',
          ageRange: { min: 8, max: 15 }
        });
      } catch (error) {
        console.error('Error saving book:', error);
        alert('Failed to save book: ' + error.message);
      }
    };


  // In your AdminDashboard.js, update the handleBookSubmit function:
  
  
  // Add genre field to the dialog form:
  <TextField
    fullWidth
    label="Genre"
    value={bookFormData.genre || ''}
    onChange={(e) => setBookFormData({ ...bookFormData, genre: e.target.value })}
    margin="normal"
  />

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/books/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          fetchBooks();
        }
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 4 }}>
        <Tab label="Books Management" />
        <Tab label="Statistics" />
        <Tab label="Content Moderation" />
        <Tab label="Vocabulary Management" /> {/* Add this new tab */}
        <Tab label="Bulk Upload" /> 
      </Tabs>

      {activeTab === 0 && (
        <>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setSelectedBook(null);
                setBookFormData({
                  title: '',
                  author: '',
                  description: '',
                  ageRange: { min: 8, max: 15 }
                });
                setOpenBookDialog(true);
              }}
            >
              Add New Book
            </Button>
          </Box>

          

          <Grid container spacing={3}>
            {books.map((book) => (
              <Grid item xs={12} md={6} key={book._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <Typography variant="h6">{book.title}</Typography>
                        <Typography color="textSecondary">{book.author}</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Age Range: {book.ageRange.min}-{book.ageRange.max}
                        </Typography>
                        <Typography variant="body2">
                          Drawings: {book.drawings?.length || 0}
                        </Typography>
                      </div>
                      <div>
                        <IconButton
                          onClick={() => {
                            setSelectedBook(book);
                            setBookFormData({
                              title: book.title,
                              author: book.author,
                              description: book.description,
                              genres: book.genres || [],
                              tags: book.tags || [],
                              ageRange: book.ageRange
                            });
                            setOpenBookDialog(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteBook(book._id)} color="error">
                          <Delete />
                        </IconButton>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

  
  
  
      {activeTab === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>Platform Statistics</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Books
                  </Typography>
                  <Typography variant="h4">{stats.totalBooks}</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Drawings
                  </Typography>
                  <Typography variant="h4">{stats.totalDrawings}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Active Users
                  </Typography>
                  <Typography variant="h4">{stats.activeUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>
           </Grid>
              {/* Add this new section */}
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    try {
                      console.log('Starting sync request...');
                      const response = await fetch('http://localhost:3001/api/recommendations/sync', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                      });
                      
                      const data = await response.json();
                      console.log('Sync response:', data);
                      
                      if (response.ok) {
                        alert('Successfully synced books to graph database');
                      } else {
                        throw new Error(data.details || data.error || 'Failed to sync');
                      }
                    } catch (error) {
                      console.error('Sync error:', error);
                      alert(`Failed to sync books to graph database: ${error.message}`);
                    }
                  }}
                >
                  Sync Books to Graph Database
                </Button>
              </Box>
            </Box>
      )}
  
      {activeTab === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom>Content Moderation</Typography>
          {/* Content moderation content */}
        </Box>
      )}

      {/* {activeTab === 3 && (
        <Box>
          {console.log('Rendering vocabulary tab')}
          <Typography variant="h5" gutterBottom>Vocabulary Management</Typography>
          <VocabularyManagement />
        </Box>
      )} */}

      
      {activeTab === 3 && (
        <Box>
          <Typography variant="h5" gutterBottom>Vocabulary Management</Typography>
          <VocabularyManagement />
        </Box>
      )}

      {activeTab === 4 && (
        <>
          <BulkUpload />
          {/* Rest of your existing Books Management content */}
        </>
      )}
    
  

      {/* Book Dialog */}
      <Dialog open={openBookDialog} onClose={() => setOpenBookDialog(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleBookSubmit} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {selectedBook ? 'Edit Book' : 'Add New Book'}
          </Typography>
          <TextField
            fullWidth
            label="Title"
            value={bookFormData.title}
            onChange={(e) => setBookFormData({ ...bookFormData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Author"
            value={bookFormData.author}
            onChange={(e) => setBookFormData({ ...bookFormData, author: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={bookFormData.description}
            onChange={(e) => setBookFormData({ ...bookFormData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          {/* Genre Selection */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Genres</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {GENRES.map((genre) => (
                <Chip
                  key={genre}
                  label={genre}
                  onClick={() => {
                    const currentGenres = bookFormData.genres || [];
                    if (currentGenres.includes(genre)) {
                      setBookFormData({
                        ...bookFormData,
                        genres: currentGenres.filter(g => g !== genre)
                      });
                    } else {
                      setBookFormData({
                        ...bookFormData,
                        genres: [...currentGenres, genre]
                      });
                    }
                  }}
                  color={bookFormData.genres?.includes(genre) ? "primary" : "default"}
                  variant={bookFormData.genres?.includes(genre) ? "filled" : "outlined"}
                />
              ))}
            </Box>
          </Box>
          
          {/* Tags Input */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Tags</Typography>
            <TextField
              fullWidth
              label="Add tags (comma-separated)"
              value={bookFormData.tagInput || ''}
              onChange={(e) => {
                setBookFormData({
                  ...bookFormData,
                  tagInput: e.target.value
                });
              }}
              helperText="Enter new tags separated by commas, they will be added when you save"
            />
            {bookFormData.tags && bookFormData.tags.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {bookFormData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => {
                      setBookFormData({
                        ...bookFormData,
                        tags: bookFormData.tags.filter((_, i) => i !== index)
                      });
                    }}
                    size="small"
                  />
                ))}
              </Box>
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Age Range</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Min Age"
                  type="number"
                  value={bookFormData.ageRange.min}
                  onChange={(e) => setBookFormData({
                    ...bookFormData,
                    ageRange: { ...bookFormData.ageRange, min: parseInt(e.target.value) }
                  })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Max Age"
                  type="number"
                  value={bookFormData.ageRange.max}
                  onChange={(e) => setBookFormData({
                    ...bookFormData,
                    ageRange: { ...bookFormData.ageRange, max: parseInt(e.target.value) }
                  })}
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setOpenBookDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedBook ? 'Save Changes' : 'Add Book'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
}

// Bottom: export
export default AdminDashboard;