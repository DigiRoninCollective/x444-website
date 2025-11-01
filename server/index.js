/**
 * Express Backend for x444 Website
 * Protects API keys and provides rate-limited proxy endpoints
 *
 * Deploy to Render.com as a Web Service
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Set to your frontend URL in production
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rate limiters
const groqLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: { error: 'Rate limit exceeded. Please try again later.', retryAfter: 60 },
  standardHeaders: true,
  legacyHeaders: false,
});

const elevenLabsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: { error: 'Rate limit exceeded. Please try again later.', retryAfter: 60 },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// GROQ API PROXY
// ============================================
app.post('/api/groq-proxy', groqLimiter, async (req, res) => {
  try {
    const { messages, model } = req.body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages parameter' });
    }

    // Limit message length
    const totalLength = messages.reduce((sum, msg) => sum + (msg.content?.length || 0), 0);
    if (totalLength > 10000) {
      return res.status(400).json({ error: 'Messages too long (max 10000 characters)' });
    }

    // Limit number of messages
    if (messages.length > 20) {
      return res.status(400).json({ error: 'Too many messages (max 20)' });
    }

    // Get API key from environment
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('GROQ_API_KEY not configured');
      return res.status(500).json({ error: 'Service not configured' });
    }

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'llama-3.1-70b-versatile',
        messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      return res.status(response.status).json({
        error: 'Failed to get AI response',
        details: response.statusText
      });
    }

    const data = await response.json();
    return res.json(data);

  } catch (error) {
    console.error('Groq proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// ============================================
// ELEVENLABS API PROXY
// ============================================
app.post('/api/elevenlabs-proxy', elevenLabsLimiter, async (req, res) => {
  try {
    const { text, voice_id } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Invalid text parameter' });
    }

    // Limit text length
    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text too long (max 5000 characters)' });
    }

    // Get API key and voice ID from environment
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = voice_id || process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

    if (!apiKey) {
      console.error('ELEVENLABS_API_KEY not configured');
      return res.status(500).json({ error: 'Service not configured' });
    }

    // Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs API error:', error);
      return res.status(response.status).json({
        error: 'Failed to generate speech',
        details: response.statusText
      });
    }

    // Get audio data
    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    // Return audio as base64
    return res.json({
      audio: audioBase64,
      contentType: 'audio/mpeg'
    });

  } catch (error) {
    console.error('ElevenLabs proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Proxy Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔒 Groq proxy: http://localhost:${PORT}/api/groq-proxy`);
  console.log(`🔊 ElevenLabs proxy: http://localhost:${PORT}/api/elevenlabs-proxy`);
  console.log(`✅ API keys protected server-side`);
});

export default app;
