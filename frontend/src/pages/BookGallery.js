// frontend/src/pages/BookGallery.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  TextField, 
  Box,
  Button,
  Paper,
  Snackbar,
  Alert,
  Chip,
  IconButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { 
  CloudUpload,
  ExpandMore,
  ExpandLess,
  Quiz as QuizIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import DrawingCard from '../components/DrawingCard';
import FilterBar from '../components/FilterBar';
import VocabularyQuiz from '../components/vocabulary/VocabularyQuiz';
//import DebugQuiz from './debug-quiz';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';


function BookGallery() {
  // State declarations (unchanged)
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [expandedBooks, setExpandedBooks] = useState({});
  const [selectedTag, setSelectedTag] = useState(null);
  const [openQuiz, setOpenQuiz] = useState(false);
  const [activeQuizBookId, setActiveQuizBookId] = useState(null);
  //const [openBookDialog, setOpenBookDialog] = useState(false);
  

  // Effects and handlers (unchanged)
  useEffect(() => {
    fetchBooks();
  }, []);

  // Your existing handler functions remain the same
  const handleExpandBook = (bookId) => {
    setExpandedBooks(prev => ({
      ...prev,
      [bookId]: !prev[bookId]
    }));
  };

  const fetchBooks = async () => {
    try {
      const data = await apiService.getAllBooks();
      setBooks(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load books');
      setLoading(false);
    }
  };

  const handleDrawingUpload = async (bookId, file, event) => {
    event.preventDefault();
  
    try {
      const response = await apiService.uploadDrawing(bookId, file);
      setSnackbar({
        open: true,
        message: 'Drawing uploaded successfully!',
        severity: 'success'
      });
      fetchBooks(); // Refresh the books list
    } catch (err) {
      console.error('Upload error:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Error uploading drawing',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Then create filtered books BEFORE the return statement
  const filteredBooks = books.filter(book => 
    (searchTerm === '' || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (!selectedGenre || (book.genres && book.genres.includes(selectedGenre))) &&
    (!selectedTag || (book.tags && book.tags.includes(selectedTag)))
  );

  if (loading) {
    return (
      <Container>
        <Typography variant="h5" sx={{ mt: 4 }}>Loading books...</Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <Typography color="error" sx={{ mt: 4 }}>{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <FilterBar
        selectedGenre={selectedGenre}
        onGenreSelect={setSelectedGenre}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
      />
      
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Search books..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid 
          container 
          spacing={4}
          sx={{
            '& .MuiGrid-item': {
              transition: 'none',
            }
          }}
        >
          {filteredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book._id}>
              <Paper 
                elevation={3} 
                sx={{ 
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  },
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: 'background.paper',
                  position: 'relative'
                }}
              >
                {/* Cover Image / Most Liked Drawing */}
                <Box
                  onClick={() => handleExpandBook(book._id)}
                  sx={{ 
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {book.drawings && book.drawings.length > 0 ? (
                    <Box sx={{ 
                      width: '100%', 
                      height: 200, 
                      overflow: 'hidden',
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4
                    }}>
                      <img
                        src={book.drawings.reduce((mostLiked, current) => {
                          const currentLikes = current.likes?.length || 0;
                          const mostLikedCount = mostLiked.likes?.length || 0;
                          return currentLikes > mostLikedCount ? current : mostLiked;
                        }, book.drawings[0]).imageUrl}
                        alt={`Most liked drawing for ${book.title}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{
                      width: '100%',
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.200',
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        No drawings yet
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Expand/Collapse Indicator */}
                  <IconButton 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 8, 
                      right: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(4px)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {expandedBooks[book._id] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
          
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    by {book.author}
                  </Typography>
                  
                  {/* Genres and Age Range */}
                  {book.genres && (
                    <Box sx={{ mb: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {book.genres.map((genre) => (
                        <Chip
                          key={genre}
                          label={genre}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.75rem',
                            height: '24px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            borderColor: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.15)',
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  {/* Vocabulary Training Button */}
                  <Button 
                    component={Link} 
                    to={`/books/${book._id}/vocabulary`}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Vocabulary Training
                  </Button>
          
                  {/* Expanded Content */}
                  <Collapse in={expandedBooks[book._id]}>
                    <Box sx={{ mt: 2 }}>
                      {/* Drawing Upload Button */}
                      <Button
                        variant="contained"
                        component="label"
                        startIcon={<CloudUpload />}
                        fullWidth
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          py: 1.5,
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #2196F3 60%, #21CBF3 90%)',
                          }
                        }}
                      >
                        Upload Drawing
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              handleDrawingUpload(book._id, e.target.files[0], e);
                            }
                          }}
                        />
                      </Button>

                      {/* Drawings Grid */}
                      {book.drawings && book.drawings.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            Drawings ({book.drawings.length})
                          </Typography>
                          <Grid container spacing={1}>
                            {book.drawings.map((drawing, index) => (
                              <Grid item xs={12} key={index}>
                                <DrawingCard
                                  drawing={drawing}
                                  bookId={book._id}
                                  onLikeUpdate={fetchBooks}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}

                      {/* Vocabulary Quiz Button: */}
                      
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => {
                          console.log('Quiz button clicked for book:', book._id);
                          setActiveQuizBookId(book._id);
                          setOpenQuiz(true);
                          console.log('Set activeQuizBookId to:', book._id);
                          console.log('Set openQuiz to: true');
                        }}
                        startIcon={<QuizIcon />}
                      >
                        Take Vocabulary Quiz
                      </Button>
                      
                      {/* Quiz Dialog */}
                      <Dialog 
                        open={openQuiz && activeQuizBookId === book._id} 
                        onClose={() => {
                          console.log('Dialog closing');
                          setOpenQuiz(false);
                          setActiveQuizBookId(null);
                        }}
                        maxWidth="md"
                        fullWidth
                      >
                        {console.log('Dialog rendering with:', { openQuiz, activeQuizBookId, bookId: book._id })}
                        <DialogTitle>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>Vocabulary Quiz - {book.title}</Typography>
                            <IconButton
                              onClick={() => {
                                setOpenQuiz(false);
                                setActiveQuizBookId(null);
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Box>
                        </DialogTitle>
                        <DialogContent>
                          {console.log('DialogContent rendering, activeQuizBookId:', activeQuizBookId)}
                          <Box sx={{ py: 2 }}>
                            {activeQuizBookId ? (
                              <VocabularyQuiz bookId={activeQuizBookId} />
                            ) : (
                              <Typography>No book ID provided</Typography>
                            )}
                          </Box>
                        </DialogContent>
                      </Dialog>



                      {/* Tags Section */}
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          fullWidth
                          label="Add your tags (comma-separated)"
                          size="small"
                          value={book.tagInput || ''}
                          onChange={(e) => {
                            setBooks(books.map(b => 
                              b._id === book._id 
                                ? { ...b, tagInput: e.target.value }
                                : b
                            ));
                          }}
                        />
                        <Button
                          size="small"
                          onClick={async () => {
                            try {
                              const newTags = book.tagInput
                                .split(',')
                                .map(tag => tag.trim())
                                .filter(tag => tag);
                          
                              await apiService.addTags(book._id, newTags);
                              fetchBooks(); // This will refresh the book list
                            } catch (error) {
                              console.error('Error adding tags:', error);
                            }
                          }}
                          sx={{ mt: 1 }}
                        >
                          Add Tags
                        </Button>
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default BookGallery;