// frontend/src/components/debug-quiz.js

import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const DebugQuiz = ({ bookId }) => {
  useEffect(() => {
    console.log('Debug Quiz mounted with bookId:', bookId);
  }, [bookId]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography>Debug Quiz for book: {bookId}</Typography>
    </Box>
  );
};

export default DebugQuiz;