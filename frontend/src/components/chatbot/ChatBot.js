import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Fab,
  Collapse,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Minimize as MinimizeIcon,
} from '@mui/icons-material';

const ChatBot = () => {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message when chat opens for the first time
      const welcomeMessage = {
        id: Date.now(),
        text: `Hello ${user?.firstName || 'there'}! 👋 I'm your LuxeStay assistant. I can help you with:`,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: [
          'Find hotels in a specific city',
          'Check booking details',
          'Get hotel recommendations',
          'Help with cancellations',
          'Contact support'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, user?.firstName]);

  const quickReplies = [
    'Show me luxury hotels',
    'Best hotels in Mumbai',
    'My current bookings',
    'Cancel a booking',
    'Contact support'
  ];

  const generateBotResponse = async (userMessage) => {
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8080/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      return {
        text: data.response,
        suggestions: data.suggestions || [],
        timestamp: data.timestamp
      };
      
    } catch (error) {
      console.error('Error calling AI service:', error);
      
      // Fallback response if AI service fails
      return {
        text: "I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment, or contact our support team at +91 1800-123-4567 for immediate assistance.",
        suggestions: ['Try again', 'Contact support', 'View FAQ', 'Check system status']
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    const currentMessage = inputMessage;
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Get AI response
      const botResponse = await generateBotResponse(currentMessage);
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: botResponse.suggestions,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I encountered an error. Please try again or contact support.",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ['Try again', 'Contact support']
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    const userMessage = {
      id: Date.now(),
      text: suggestion,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Get AI response
      const botResponse = await generateBotResponse(suggestion);
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: botResponse.suggestions,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I encountered an error. Please try again or contact support.",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ['Try again', 'Contact support']
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) return null; // Don't show chatbot if user is not logged in

  return (
    <>
      {/* Chat Window */}
      <Box
        sx={{
          position: 'fixed',
          bottom: isOpen ? 100 : 20,
          right: 20,
          zIndex: 1300,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Collapse in={isOpen}>
          <Card
            sx={{
              width: 380,
              height: isMinimized ? 60 : 500,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              transition: 'height 0.3s ease-in-out',
            }}
          >
            {/* Chat Header */}
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <BotIcon />
                </Avatar>
              }
              title={
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  LuxeStay Assistant
                </Typography>
              }
              subheader="Online • Typically replies instantly"
              action={
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => setIsMinimized(!isMinimized)}
                    sx={{ mr: 1 }}
                  >
                    <MinimizeIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setIsOpen(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              }
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '& .MuiCardHeader-subheader': {
                  color: 'rgba(255,255,255,0.8)',
                },
              }}
            />

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <CardContent
                  sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  {messages.map((message) => (
                    <Box key={message.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1,
                            maxWidth: '80%',
                            flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: message.sender === 'user' ? 'secondary.main' : 'primary.main',
                            }}
                          >
                            {message.sender === 'user' ? <PersonIcon /> : <BotIcon />}
                          </Avatar>
                          <Box>
                            <Box
                              sx={{
                                bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                                color: message.sender === 'user' ? 'white' : 'text.primary',
                                p: 1.5,
                                borderRadius: 2,
                                borderTopLeftRadius: message.sender === 'user' ? 2 : 0.5,
                                borderTopRightRadius: message.sender === 'user' ? 0.5 : 2,
                              }}
                            >
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                {message.text}
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: 'block',
                                mt: 0.5,
                                textAlign: message.sender === 'user' ? 'right' : 'left',
                              }}
                            >
                              {formatTime(message.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Suggestions */}
                      {message.suggestions && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, ml: 5 }}>
                          {message.suggestions.map((suggestion, index) => (
                            <Chip
                              key={index}
                              label={suggestion}
                              size="small"
                              variant="outlined"
                              clickable
                              onClick={() => handleSuggestionClick(suggestion)}
                              sx={{
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                  color: 'white',
                                },
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}

                  {isTyping && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        <BotIcon />
                      </Avatar>
                      <Box
                        sx={{
                          bgcolor: 'grey.100',
                          p: 1.5,
                          borderRadius: 2,
                          borderTopLeftRadius: 0.5,
                        }}
                      >
                        <CircularProgress size={16} />
                        <Typography variant="body2" sx={{ ml: 1, display: 'inline' }}>
                          Typing...
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Quick Replies */}
                {messages.length <= 1 && (
                  <>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Quick replies:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {quickReplies.map((reply, index) => (
                          <Chip
                            key={index}
                            label={reply}
                            size="small"
                            variant="outlined"
                            clickable
                            onClick={() => handleSuggestionClick(reply)}
                          />
                        ))}
                      </Box>
                    </Box>
                  </>
                )}

                {/* Input Area */}
                <Divider />
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type your message..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isTyping}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                    />
                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                        '&:disabled': {
                          bgcolor: 'grey.300',
                        },
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </>
            )}
          </Card>
        </Collapse>
      </Box>

      {/* Chat Toggle Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1300,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
          },
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>
    </>
  );
};

export default ChatBot;