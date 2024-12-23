// src/components/VocabularyUpload.js
import React, { useState } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import { Upload } from '@mui/icons-material';

function VocabularyUpload({ bookId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    // Fetch userId from localStorage or authentication state
    const userId = localStorage.getItem('userId'); // Ensure this is set during login
    formData.append('vocabulary', file);
    formData.append('createdBy', userId); // Add createdBy explicitly

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:3001/api/books/${bookId}/vocabulary/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload vocabulary');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Upload Vocabulary
      </Typography>
      <Button
        variant="contained"
        component="label"
        startIcon={loading ? <CircularProgress size={20} /> : <Upload />}
        disabled={loading}
      >
        Upload Excel File
        <input
          type="file"
          hidden
          accept=".xlsx,.xls"
          onChange={handleUpload}
        />
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Vocabulary uploaded successfully!
        </Alert>
      )}
      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        Please upload an Excel file with columns: word, definition, options, correct_answer
      </Typography>
    </Box>
  );
}

export default VocabularyUpload;