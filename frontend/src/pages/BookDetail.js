import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Grid,
  Chip,
  CircularProgress
} from '@mui/material';
import DrawingCard from '../components/DrawingCard';

function BookDetail() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/books/${bookId}`);
      if (!response.ok) {
        throw new Error('Book not found');
      }
      const data = await response.json();
      setBook(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]); // Add bookId as dependency

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Book not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {book.title}
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          by {book.author}
        </Typography>

        <Box sx={{ my: 2 }}>
          {book.genres?.map((genre) => (
            <Chip
              key={genre}
              label={genre}
              sx={{ mr: 1, mb: 1 }}
              variant="outlined"
            />
          ))}
        </Box>

        <Typography variant="body1" paragraph>
          {book.description}
        </Typography>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Drawings
        </Typography>
        <Grid container spacing={2}>
          {book.drawings?.map((drawing, index) => (
            <Grid item xs={12} md={6} key={index}>
              <DrawingCard
                drawing={drawing}
                bookId={book._id}
                onLikeUpdate={fetchBookDetails} // Now this will work
              />
            </Grid>
          ))}
          {!book.drawings?.length && (
            <Grid item xs={12}>
              <Typography color="textSecondary">
                No drawings yet for this book.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
}

export default BookDetail;