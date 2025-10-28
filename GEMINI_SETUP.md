# 🤖 Gemini AI ChatBot Setup Guide

## Overview
The LuxeStay hotel booking application now includes an intelligent AI chatbot powered by Google's Gemini AI. The chatbot provides personalized assistance for hotel bookings, recommendations, and customer support.

## 🔑 Getting Your Gemini API Key

### Step 1: Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Configure the API Key

#### Option 1: Environment Variable (Recommended)
```bash
# Windows
set GEMINI_API_KEY=your-actual-api-key-here

# Linux/Mac
export GEMINI_API_KEY=your-actual-api-key-here
```

#### Option 2: Update application.yml
```yaml
gemini:
  api:
    key: your-actual-api-key-here
    url: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

## 🚀 Features

### For Customers:
- **Hotel Recommendations**: Get personalized hotel suggestions based on preferences
- **Booking Assistance**: Help with finding and booking hotels
- **Price Information**: Real-time pricing and availability
- **Local Insights**: Information about destinations and amenities
- **Support**: 24/7 assistance with bookings and inquiries

### For Admins:
- **Management Insights**: Hotel performance and booking analytics
- **Customer Support**: Handle customer inquiries efficiently
- **System Information**: Help with administrative tasks

## 🎯 How It Works

1. **Context-Aware**: The AI understands user roles (customer vs admin)
2. **Hotel-Specific**: Trained on LuxeStay's hotel inventory and policies
3. **Real-Time**: Provides up-to-date information about hotels and bookings
4. **Multilingual**: Supports multiple languages for international guests

## 💬 Sample Conversations

### Customer Examples:
- "Show me luxury hotels in Mumbai"
- "What's the price for a 3-night stay in Goa?"
- "I need to cancel my booking"
- "Recommend hotels near the Taj Mahal"

### Admin Examples:
- "Show me today's booking analytics"
- "How many rooms are available this weekend?"
- "Help me manage customer complaints"

## 🔧 Technical Details

- **AI Model**: Google Gemini Pro
- **Response Time**: ~1-3 seconds
- **Fallback**: Graceful error handling with support contact info
- **Security**: All conversations are secured with JWT authentication

## 🎨 UI Features

- **Floating Chat Button**: Always accessible when logged in
- **Professional Design**: Matches the LuxeStay brand
- **Typing Indicators**: Shows when AI is thinking
- **Quick Replies**: Suggested responses for common queries
- **Message History**: Conversation persistence during session
- **Responsive**: Works on desktop and mobile devices

## 🛠️ Troubleshooting

### Common Issues:

1. **"API Key not configured"**
   - Ensure GEMINI_API_KEY environment variable is set
   - Restart the backend after setting the key

2. **"Rate limit exceeded"**
   - Gemini has usage limits on free tier
   - Consider upgrading to paid plan for production

3. **"Network error"**
   - Check internet connection
   - Verify API key is valid and active

### Testing the ChatBot:

1. Login to the application (customer or admin)
2. Look for the floating chat button in bottom-right corner
3. Click to open the chat interface
4. Try sample messages like "Hello" or "Show me hotels"

## 📊 Monitoring

The backend logs all AI interactions for:
- Performance monitoring
- Error tracking
- Usage analytics
- Conversation quality assessment

## 🔒 Privacy & Security

- **No Data Storage**: Conversations are not permanently stored
- **Secure API**: All requests use HTTPS encryption
- **User Context**: Only necessary user info (name, role) is shared with AI
- **Content Filtering**: Built-in safety filters prevent inappropriate responses

## 🚀 Production Deployment

For production use:
1. Set up proper environment variables
2. Configure rate limiting
3. Monitor API usage and costs
4. Set up logging and analytics
5. Consider caching for frequently asked questions

---

**Need Help?** Contact our development team or check the application logs for detailed error information.