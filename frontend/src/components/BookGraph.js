import React, { useState, useCallback } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { 
  Box, 
  Paper, 
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import { Book, Person, LocalOffer, Category } from '@mui/icons-material';
import PropTypes from 'prop-types';

const NODE_TYPES = {
  BOOK: 'Book',
  AUTHOR: 'Author',
  GENRE: 'Genre',
  TAG: 'Tag'
};

const NODE_COLORS = {
  [NODE_TYPES.BOOK]: '#4CAF50',    // Green
  [NODE_TYPES.AUTHOR]: '#2196F3',  // Blue
  [NODE_TYPES.GENRE]: '#FFC107',   // Amber
  [NODE_TYPES.TAG]: '#9C27B0'      // Purple
};

const BookGraph = ({ 
  graphData, 
  onNodeClick, 
  selectedFilter, 
  onFilterSelect 
}) => {
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    if (onNodeClick) {
      onNodeClick(node);
    }
  };

  const handleNodeHover = useCallback((node) => {
    setHighlightNodes(new Set(node ? [node] : []));
    setHighlightLinks(new Set());

    // If a node is hovered, highlight its direct connections
    if (node) {
      graphData.links.forEach(link => {
        if (link.source === node || link.target === node) {
          setHighlightLinks(prev => new Set([...prev, link]));
          setHighlightNodes(prev => new Set([...prev, link.source, link.target]));
        }
      });
    }
  }, [graphData.links]);

  const getNodeIcon = (type) => {
    switch (type) {
      case NODE_TYPES.BOOK:
        return <Book />;
      case NODE_TYPES.AUTHOR:
        return <Person />;
      case NODE_TYPES.GENRE:
        return <Category />;
      case NODE_TYPES.TAG:
        return <LocalOffer />;
      default:
        return null;
    }
  };

  const getNodeColor = (type) => {
    return NODE_COLORS[type] || '#999999';
  };

  return (
    <Box sx={{ position: 'relative', height: '80vh' }}>
      <ForceGraph2D
        graphData={graphData}
        nodeId="id"
        nodeLabel={node => `${node.type}: ${node.title || node.name}`}
        nodeColor={node => getNodeColor(node.type)}
        linkWidth={1.5}
        nodeRelSize={6}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const size = 6;
          const fontSize = 12 / globalScale;
          const label = node.title || node.name;
  
          ctx.fillStyle = getNodeColor(node.type);
          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
          ctx.fill();
  
          if (globalScale < 4) {
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#000';
            ctx.fillText(label, node.x, node.y + size + fontSize);
          }
        }}
      />

      {/* Legend */}
      <Paper 
        sx={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          p: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <Typography variant="subtitle2" gutterBottom>Filter By:</Typography>
        {Object.entries(NODE_TYPES).map(([key, value]) => (
          <Box 
            key={key} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1,
              cursor: 'pointer',
              p: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)'
              },
              backgroundColor: selectedFilter === value ? 'rgba(0, 0, 0, 0.1)' : 'transparent'
            }}
            onClick={() => onFilterSelect(value)}
          >
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: NODE_COLORS[value],
                mr: 1
              }} 
            />
            <Typography variant="body2">{key.toLowerCase()}</Typography>
          </Box>
        ))}
        {selectedFilter && (
          <IconButton 
            size="small" 
            onClick={() => onFilterSelect(null)}
            sx={{ mt: 1 }}
          >
            Clear Filter
          </IconButton>
        )}
      </Paper>

      {/* Selected Node Info */}
      {selectedNode && (
        <Card 
          sx={{ 
            position: 'absolute', 
            bottom: 10, 
            left: 10, 
            maxWidth: 300,
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {getNodeIcon(selectedNode.type)}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {selectedNode.title || selectedNode.name}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Type: {selectedNode.type}
            </Typography>
            {selectedNode.description && (
              <Typography variant="body2">
                {selectedNode.description}
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

BookGraph.propTypes = {
  graphData: PropTypes.shape({
    nodes: PropTypes.array,
    links: PropTypes.array
  }),
  onNodeClick: PropTypes.func,
  selectedFilter: PropTypes.string,
  onFilterSelect: PropTypes.func
};

BookGraph.defaultProps = {
  graphData: { nodes: [], links: [] },
  onNodeClick: () => {},
  selectedFilter: null,
  onFilterSelect: () => {}
};

export default BookGraph;