import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  TextField,
  MenuItem,
  Button
} from '@mui/material';
import BookGraph from '../components/BookGraph';
import { useNavigate } from 'react-router-dom';

function BookExplorer() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [filterOptions, setFilterOptions] = useState([]);
  const navigate = useNavigate();

  const fetchGraphData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let url = 'http://localhost:3001/api/recommendations/graph';
      
      // Add filter parameters if they exist
      if (selectedFilter) {
        url += `?nodeType=${selectedFilter}`;
        if (filterValue) {
          url += `&value=${encodeURIComponent(filterValue)}`;
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch graph data');
      }
      const data = await response.json();

      if (!data.nodes || !data.links) {
        console.error('Invalid graph data structure:', data);
        setError('Invalid graph data structure received');
        return;
      }

      // Filter out any invalid links
      const validNodeIds = new Set(data.nodes.map(node => node.id));
      const validLinks = data.links.filter(link => 
        validNodeIds.has(link.source) && validNodeIds.has(link.target)
      );

      setGraphData({
        nodes: data.nodes,
        links: validLinks
      });

      // Update filter options based on node type
      if (selectedFilter) {
        const options = [...new Set(data.nodes
          .filter(node => node.type === selectedFilter)
          .map(node => node.title || node.name)
        )];
        setFilterOptions(options);
      }
    } catch (err) {
      console.error('Error fetching graph data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedFilter, filterValue]); // Add dependencies here

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]); // Update dependency array

  const handleFilterSelect = (nodeType) => {
    setSelectedFilter(nodeType);
    setFilterValue('');  // Clear the value filter when changing types
  };

  const handleNodeClick = (node) => {
    if (node.type === 'Book') {
      // Make sure we're using the correct property for the book ID
      const bookId = node.properties?.id || node.id;
      navigate(`/books/${bookId}`);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, height: '90vh' }}>
      <Typography variant="h4" gutterBottom>
        Book Explorer
      </Typography>
      
      {/* Filter Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        {selectedFilter && filterOptions.length > 0 && (
          <TextField
            select
            label={`Select ${selectedFilter}`}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {filterOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}
        {selectedFilter && (
          <Button 
            variant="outlined" 
            onClick={() => {
              setSelectedFilter(null);
              setFilterValue('');
            }}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      <Paper elevation={3} sx={{ height: 'calc(100% - 100px)', overflow: 'hidden' }}>
        <BookGraph 
          graphData={graphData}
          onNodeClick={handleNodeClick}
          selectedFilter={selectedFilter}
          onFilterSelect={handleFilterSelect}
        />
      </Paper>

      {loading && (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Typography>Loading book network...</Typography>
        </Box>
      )}

      {error && (
        <Box sx={{ mt: 2 }}>
          <Typography color="error">Error: {error}</Typography>
        </Box>
      )}
    </Container>
  );
}

export default BookExplorer;