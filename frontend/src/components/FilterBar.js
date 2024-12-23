// frontend/src/components/FilterBar.js
import React, { useState, useEffect } from 'react';
import { Box, Chip, Paper, Typography, Divider } from '@mui/material';

const genres = [
  'All',
  'Adventure',
  'Fantasy',
  'Mystery',
  'Science',
  'Historical',
  'Educational',
  'Fiction',
  'Non-Fiction'
];

function FilterBar({ selectedGenre, onGenreSelect, selectedTag, onTagSelect }) {
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/books');
      const books = await response.json();
      const uniqueTags = new Set();
      books.forEach(book => {
        book.tags?.forEach(tag => uniqueTags.add(tag));
      });
      setAllTags(Array.from(uniqueTags));
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        overflowX: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      {/* Genres Section */}
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Genres:</Typography>
      <Box sx={{
        display: 'flex',
        gap: 1,
        minWidth: 'min-content',
        mb: 2
      }}>
        {genres.map((genre) => (
          <Chip
            key={genre}
            label={genre}
            onClick={() => onGenreSelect(genre === 'All' ? null : genre)}
            color={selectedGenre === genre ? 'primary' : 'default'}
            variant={selectedGenre === genre ? 'filled' : 'outlined'}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 1
              }
            }}
          />
        ))}
      </Box>

      {/* Divider between genres and tags */}
      <Divider sx={{ my: 2 }} />

      {/* Tags Section */}
      {allTags.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Tags:</Typography>
          <Box sx={{
            display: 'flex',
            gap: 1,
            minWidth: 'min-content',
            flexWrap: 'wrap'
          }}>
            {allTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
                color={selectedTag === tag ? "primary" : "default"}
                variant={selectedTag === tag ? "filled" : "outlined"}
                size="small"
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 1
                  }
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
}

export default FilterBar;