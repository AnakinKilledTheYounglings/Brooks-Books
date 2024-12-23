// src/components/WordEtymology.js
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

function WordEtymology({ word, etymology, translations }) {
  return (
    <Paper sx={{ p: 2, my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Word Origin: {word}
      </Typography>
      
      {/* Etymology Tree Visualization */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        my: 2 
      }}>
        <Box sx={{ 
          p: 2, 
          border: '2px solid #1976d2',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5'
        }}>
          <Typography>{etymology.root}</Typography>
        </Box>
        
        {/* Lines connecting to translations */}
        <Box sx={{ 
          width: '2px', 
          height: '20px', 
          backgroundColor: '#1976d2' 
        }} />
        
        {/* Translations */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          mt: 2
        }}>
          {Object.entries(translations).map(([lang, trans]) => (
            <Box key={lang} sx={{
              p: 1,
              border: '1px solid #1976d2',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <Typography variant="caption" display="block">
                {lang.toUpperCase()}
              </Typography>
              <Typography>
                {trans}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}

export default WordEtymology;