// frontend/src/pages/Discussions.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  TextField, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Collapse,
  Divider
} from '@mui/material';
import { ImageOutlined, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import GifPicker from '../components/GifPicker';
import apiService from '../services/apiService';

function Discussions() {
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussionDialog, setNewDiscussionDialog] = useState(false);
  const [gifPickerOpen, setGifPickerOpen] = useState(false);
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mediaUrl: '',
    mediaType: null
  });

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const data = await apiService.getDiscussions();
      setDiscussions(data);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  const handleSubmitComment = async (discussionId) => {
    if (!newComment.trim()) return;
  
    try {
      await apiService.addDiscussionComment(discussionId, newComment);
      setNewComment('');
      fetchDiscussions(); // Refresh discussions to show new comment
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleNavigateToProfile = (authorId) => {
    navigate(`/profile/${authorId}`);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.createDiscussion(formData);
      setNewDiscussionDialog(false);
      setFormData({ title: '', content: '', mediaUrl: '', mediaType: null });
      fetchDiscussions();
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  const handleGifSelect = (gif) => {
    setFormData({
      ...formData,
      mediaUrl: gif.media_formats.gif.url,
      mediaType: 'gif'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Discussions</Typography>
        <Button 
          variant="contained" 
          onClick={() => setNewDiscussionDialog(true)}
        >
          Start New Discussion
        </Button>
      </Box>

      {discussions.map((discussion) => (
        <Card key={discussion._id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">{discussion.title}</Typography>
              <Typography 
                color="primary" 
                component={Link}
                to={`/profile/${discussion.author?._id}`}
                sx={{ 
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {discussion.author?.username}
              </Typography>
            </Box>
            <Typography variant="body1">{discussion.content}</Typography>
            
            {discussion.mediaUrl && (
              <Box sx={{ mt: 2 }}>
                <img 
                  src={discussion.mediaUrl} 
                  alt="Discussion media" 
                  style={{ maxWidth: '100%', borderRadius: '4px' }}
                />
              </Box>
            )}

            <Button
              onClick={() => setExpandedDiscussion(
                expandedDiscussion === discussion._id ? null : discussion._id
              )}
              endIcon={expandedDiscussion === discussion._id ? <ExpandLess /> : <ExpandMore />}
              sx={{ mt: 2 }}
            >
              Comments ({discussion.comments?.length || 0})
            </Button>

            <Collapse in={expandedDiscussion === discussion._id}>
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ my: 2 }} />
                
                {/* Comments section */}
                {discussion.comments?.map((comment, index) => (
                  <Box key={index} sx={{ mb: 2, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                    <Typography 
                      component={Link}
                      to={`/profile/${comment.author}`}
                      color="primary"
                      sx={{ 
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      {comment.username}
                    </Typography>
                    <Typography variant="body2">{comment.content}</Typography>
                    {comment.mediaUrl && (
                      <img 
                        src={comment.mediaUrl} 
                        alt="Comment media" 
                        style={{ 
                          maxWidth: '200px', 
                          borderRadius: '4px',
                          marginTop: '8px'
                        }}
                      />
                    )}
                  </Box>
                ))}

                {/* Add comment form */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button 
                    variant="contained"
                    onClick={() => handleSubmitComment(discussion._id)}
                    disabled={!newComment.trim()}
                  >
                    Post
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}

      <Dialog 
        open={newDiscussionDialog} 
        onClose={() => setNewDiscussionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>Start New Discussion</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <Box sx={{ mt: 2 }}>
              <IconButton onClick={() => setGifPickerOpen(true)}>
                <ImageOutlined />
              </IconButton>
              {formData.mediaUrl && (
                <Box sx={{ mt: 1 }}>
                  <img 
                    src={formData.mediaUrl} 
                    alt="Selected media" 
                    style={{ maxWidth: '200px', borderRadius: '4px' }}
                  />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewDiscussionDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>

      <GifPicker 
        open={gifPickerOpen}
        onClose={() => setGifPickerOpen(false)}
        onSelect={handleGifSelect}
      />
    </Container>
  );
}

export default Discussions;