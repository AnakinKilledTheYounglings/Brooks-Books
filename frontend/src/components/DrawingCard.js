import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  IconButton, 
  Typography, 
  Box,
  TextField,
  Collapse
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  ChatBubbleOutline,
  Send
} from '@mui/icons-material';
import apiService from '../services/apiService';

function DrawingCard({ drawing, bookId, onLikeUpdate }) {
  const userId = localStorage.getItem('userId');
  const [isLiked, setIsLiked] = useState(drawing.likes?.includes(userId));
  const [likeCount, setLikeCount] = useState(drawing.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(drawing.comments || []);

  useEffect(() => {
    setIsLiked(drawing.likes?.includes(userId));
    setLikeCount(drawing.likes?.length || 0);
    setComments(drawing.comments || []);
  }, [drawing, userId]);

  const handleLike = async () => {
    try {
      console.log('Current userId:', userId);
      console.log('Current likes:', drawing.likes);
      console.log('Is currently liked:', isLiked);
  
      if (isLiked) {
        await apiService.unlikeDrawing(bookId, drawing._id);
      } else {
        await apiService.likeDrawing(bookId, drawing._id);
      }
  
      // Update local state immediately
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      
      // Call parent update
      onLikeUpdate();
      
      console.log('Like state updated:', {
        isLiked: !isLiked,
        newLikeCount: isLiked ? likeCount - 1 : likeCount + 1
      });
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
  
    try {
      const result = await apiService.addComment(bookId, drawing._id, newComment);
      
      // Update local comments state
      setComments(prevComments => [...prevComments, result.comment]);
      setNewComment('');
      // Call parent update
      onLikeUpdate();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardMedia
        component="img"
        image={drawing.imageUrl}
        alt="User Drawing"
        sx={{ height: 'auto', maxHeight: '400px', objectFit: 'contain' }}
      />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              size="small" 
              onClick={handleLike}
              color={isLiked ? "error" : "default"}
            >
              {isLiked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="body2">
              {likeCount}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              size="small" 
              onClick={() => setShowComments(!showComments)}
            >
              <ChatBubbleOutline />
            </IconButton>
            <Typography variant="body2">
              {comments.length}
            </Typography>
          </Box>
        </Box>

        <Collapse in={showComments}>
          <Box sx={{ mt: 2 }}>
            {/* Comments list */}
            {comments.map((comment, index) => (
              <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary">
                  {comment.username}
                </Typography>
                <Typography variant="body2">
                  {comment.content}
                </Typography>
              </Box>
            ))}

            {/* Comment form */}
            <Box 
              component="form" 
              onSubmit={handleComment}
              sx={{ 
                mt: 2, 
                display: 'flex', 
                gap: 1 
              }}
            >
              <TextField
                size="small"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                fullWidth
                multiline
                maxRows={3}
              />
              <IconButton 
                type="submit" 
                color="primary"
                disabled={!newComment.trim()}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default DrawingCard;