// frontend/src/components/GifPicker.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Box,
  IconButton,
  CircularProgress,
  Typography
} from '@mui/material';
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';
import { api } from '../services/api';  // Add this import at the top

const GifPicker = ({ open, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGifSelect = (gif) => {
    // Make sure we're accessing the correct URL property
    const gifUrl = gif.media_formats?.gif?.url || gif.url;
    if (!gifUrl) {
      console.error('No valid URL found in GIF data:', gif);
      return;
    }
    onSelect({ ...gif, url: gifUrl });
  };

//fetch gifs & send requeest to services/api.js
  const fetchGifs = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = query 
        ? await api.searchGifs(query)
        : await api.getTrendingGifs();
      setGifs(data);
    } catch (err) {
      console.error('GIF fetch error:', err);
      setError('Failed to load GIFs');
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      if (open) {
        fetchGifs('');  // Load trending GIFs when opened
      }
    }, [open]);

    const handleSearch = (e) => {
      e.preventDefault();
      if (searchTerm.trim()) {
        fetchGifs(searchTerm);
      }
    };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography>Select a GIF</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search GIFs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton type="submit">
                  <SearchIcon />
                </IconButton>
              )
            }}
          />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : (
          <Grid container spacing={2}>
            {gifs.map((gif, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Box 
                  component="img"
                  src={gif.media_formats?.tinygif?.url || gif.media_formats?.gif?.url}
                  alt={gif.content_description || 'GIF'}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    cursor: 'pointer',
                    borderRadius: 1,
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                  onClick={() => {
                    handleGifSelect(gif);
                    onClose();
                  }}
                  onError={(e) => {
                    console.error('Failed to load GIF:', gif);
                    e.target.style.display = 'none';
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GifPicker;