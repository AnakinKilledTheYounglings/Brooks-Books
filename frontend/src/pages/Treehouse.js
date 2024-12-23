// frontend/src/pages/Treehouse.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Box, 
  TextField, 
  IconButton, 
  Typography, 
  Paper,
  Badge,
  Avatar,
  Divider
} from '@mui/material';
import { Send, Image } from '@mui/icons-material';
import GifPicker from '../components/GifPicker';
import apiService from '../services/apiService';

function Treehouse() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);
  const [gifPickerOpen, setGifPickerOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState(null);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    ws.current = apiService.connectWebSocket();

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'history') {
        setMessages(data.messages);
      } else if (data.type === 'message') {
        setMessages(prev => [...prev, data.message]);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() && !mediaUrl) return;
  
    const user = JSON.parse(localStorage.getItem('user')) || {};
    
    const messageData = {
      content: message,
      author: {
        username: user.username || 'Guest',
        id: user.userId || user.id
      },
      timestamp: new Date().toISOString(),
      mediaUrl,
      mediaType
    };
  
    try {
      apiService.sendChatMessage(messageData);
      setMessage('');
      setMediaUrl('');
      setMediaType(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleGifSelect = (gif) => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    
    const gifUrl = gif.media_formats?.gif?.url || gif.url;
  
    const messageData = {
      content: '',
      author: {
        username: user.username || 'Guest',
        id: user.userId || user.id
      },
      timestamp: new Date().toISOString(),
      mediaUrl: gifUrl,
      mediaType: 'gif'
    };
  
    try {
      apiService.sendChatMessage(messageData);
      setGifPickerOpen(false);
    } catch (error) {
      console.error('Error sending GIF message:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            Treehouse Chat 
            <Badge 
              badgeContent={onlineCount} 
              color="success" 
              sx={{ ml: 2 }}
            />
          </Typography>
        </Box>

        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {messages.map((msg, index) => (
            <Box 
              key={index}
              sx={{
                display: 'flex',
                mb: 2,
                alignItems: 'flex-start'
              }}
            >
              <Avatar sx={{ mr: 1 }}>
                {msg.author.username ? msg.author.username[0].toUpperCase() : 'G'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {msg.author.username || 'Guest'}
                </Typography>
                {msg.content && (
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {msg.content}
                  </Typography>
                )}
                {msg.mediaUrl && (
                  <Box sx={{ mt: 1, maxWidth: '300px' }}>
                    <img 
                      src={msg.mediaUrl} 
                      alt="Chat media" 
                      style={{ 
                        maxWidth: '100%', 
                        borderRadius: '8px',
                        display: 'block' // Prevents image spacing issues
                      }}
                      onError={(e) => {
                        console.error('Image failed to load:', msg.mediaUrl);
                        e.target.style.display = 'none';
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Divider />
        
        <Box 
          component="form" 
          onSubmit={handleSend}
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            gap: 1
          }}
        >
          <IconButton 
            type="button"
            onClick={() => setGifPickerOpen(true)}
          >
            <Image />
          </IconButton>
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            variant="outlined"
            size="small"
          />
          <IconButton type="submit" color="primary">
            <Send />
          </IconButton>
        </Box>
      </Paper>

      <GifPicker 
        open={gifPickerOpen}
        onClose={() => setGifPickerOpen(false)}
        onSelect={handleGifSelect}
      />
    </Container>
  );
}

export default Treehouse;