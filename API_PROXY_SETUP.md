# API Proxy Setup Guide

## 🔒 Security Fix: Protected API Keys

Your API keys are now protected server-side! This prevents abuse and unauthorized usage.

---

## What Changed?

### Before (Insecure ❌)
```typescript
// API keys exposed in client-side code
const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

fetch('https://api.elevenlabs.io/...', {
  headers: { 'xi-api-key': apiKey } // ❌ Visible in DevTools!
});
```

### After (Secure ✅)
```typescript
// API calls go through your backend proxy
fetch('/api/elevenlabs-proxy', {
  method: 'POST',
  body: JSON.stringify({ text: 'Hello' })
}); // ✅ API key stays on server!
```

---

## Environment Variables Setup

### 1. Update Your Environment Variables

**Remove these from `.env` (if you had them):**
```bash
# DON'T use these anymore
VITE_ELEVENLABS_API_KEY=...
VITE_GROQ_API_KEY=...
VITE_ELEVENLABS_CZ_VOICE_ID=...
```

**Add these NEW variables (without VITE_ prefix):**
```bash
# Server-side only (NOT exposed to browser)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
GROQ_API_KEY=your_groq_api_key_here
```

### 2. Configure Vercel Environment Variables

Go to your Vercel project dashboard:

1. Navigate to **Settings** → **Environment Variables**
2. Add these variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `ELEVENLABS_API_KEY` | `sk-...` (your key) | Production, Preview, Development |
| `ELEVENLABS_VOICE_ID` | `EXAVITQu4vr4xnSDxMaL` | Production, Preview, Development |
| `GROQ_API_KEY` | `gsk_...` (your key) | Production, Preview, Development |

⚠️ **IMPORTANT:** Do NOT prefix these with `VITE_`

---

## How It Works

### Architecture

```
┌─────────────┐
│   Browser   │
│  (Client)   │
└──────┬──────┘
       │ POST /api/groq-proxy
       │ { messages: [...] }
       ▼
┌─────────────────────────┐
│  Vercel Serverless      │
│  Function (Your Server) │
│                         │
│  • Rate limiting        │
│  • Input validation     │
│  • API key injection    │
└──────┬──────────────────┘
       │ Authorization: Bearer sk-...
       ▼
┌─────────────┐
│  Groq API   │
│ ElevenLabs  │
└─────────────┘
```

### Rate Limiting

Both proxies include automatic rate limiting:

- **ElevenLabs:** 10 requests/minute per IP
- **Groq:** 20 requests/minute per IP

This prevents abuse and protects your API quota.

---

## API Endpoints

### `/api/groq-proxy`

**Request:**
```json
POST /api/groq-proxy
{
  "messages": [
    { "role": "user", "content": "What is x444?" }
  ],
  "model": "llama-3.1-70b-versatile"
}
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "content": "x444 is a HTTP 402 payment protocol..."
      }
    }
  ]
}
```

**Rate Limit:** 20 requests/minute per IP

---

### `/api/elevenlabs-proxy`

**Request:**
```json
POST /api/elevenlabs-proxy
{
  "text": "Hello, this is CZ speaking about x444",
  "voice_id": "EXAVITQu4vr4xnSDxMaL"
}
```

**Response:**
```json
{
  "audio": "base64_encoded_audio_data...",
  "contentType": "audio/mpeg"
}
```

**Rate Limit:** 10 requests/minute per IP

---

## Testing Locally

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Create `.env.local`
```bash
# Local development only
ELEVENLABS_API_KEY=your_key_here
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
GROQ_API_KEY=your_key_here
```

### 3. Run Development Server
```bash
pnpm dev
```

The API routes will be available at:
- `http://localhost:3000/api/groq-proxy`
- `http://localhost:3000/api/elevenlabs-proxy`

### 4. Test the Endpoints

**Test Groq:**
```bash
curl -X POST http://localhost:3000/api/groq-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "What is x444?"}]
  }'
```

**Test ElevenLabs:**
```bash
curl -X POST http://localhost:3000/api/elevenlabs-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world"
  }'
```

---

## Deployment

### Vercel (Automatic)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add API proxies for security"
   git push
   ```

2. **Configure Environment Variables** in Vercel dashboard (see above)

3. **Deploy:**
   - Vercel auto-deploys on push
   - Or manually: `vercel --prod`

4. **Verify:**
   - Visit your site
   - Open voice assistant
   - Check browser DevTools → Network tab
   - You should see calls to `/api/groq-proxy` and `/api/elevenlabs-proxy`
   - **API keys should NOT be visible anywhere!**

---

## Security Benefits

### ✅ What This Fixes

1. **API Keys Hidden** - Keys never sent to browser
2. **Rate Limiting** - Prevents abuse (10-20 req/min per IP)
3. **Input Validation** - Rejects malformed requests
4. **Cost Control** - Limits prevent runaway API charges
5. **Request Logging** - Server-side logs for monitoring

### ✅ What You're Protected Against

- ❌ Users extracting your API keys from DevTools
- ❌ Bots scraping your keys from JavaScript bundles
- ❌ Unlimited API usage draining your quota
- ❌ Malicious actors using your keys for their projects
- ❌ Unexpected $1000+ API bills from abuse

---

## Monitoring

### Check Rate Limit Status

The proxy returns these headers:
```
X-RateLimit-Remaining: 8
X-RateLimit-Reset: 1699999999
```

### Rate Limit Exceeded Response

```json
HTTP 429 Too Many Requests
{
  "error": "Rate limit exceeded. Please try again later.",
  "retryAfter": 60
}
```

### Server Logs

Check Vercel function logs:
```bash
vercel logs <deployment-url>
```

Look for:
- `[Proxy] Rate limit exceeded for IP: ...`
- `[Proxy] Invalid request: ...`
- `[Proxy] API error: ...`

---

## Advanced Configuration

### Adjust Rate Limits

Edit `/api/groq-proxy.ts` or `/api/elevenlabs-proxy.ts`:

```typescript
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;  // Change this
```

### Add IP Whitelist

```typescript
const WHITELISTED_IPS = ['1.2.3.4', '5.6.7.8'];

if (WHITELISTED_IPS.includes(clientIP)) {
  // Skip rate limiting
  return handler(req, res);
}
```

### Add API Key Rotation

```typescript
const API_KEYS = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
];

const apiKey = API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
```

---

## Troubleshooting

### Error: "Service not configured"

**Problem:** Environment variable not set

**Solution:**
```bash
# Check Vercel environment variables
vercel env ls

# Add missing variable
vercel env add ELEVENLABS_API_KEY
```

### Error: "Rate limit exceeded"

**Problem:** Too many requests from same IP

**Solution:**
- Wait 60 seconds
- Increase rate limits (see Advanced Configuration)
- Check for accidental request loops in frontend

### Error: "Failed to generate speech"

**Problem:** ElevenLabs API error

**Solution:**
- Check API key is valid
- Verify account has quota remaining
- Check ElevenLabs dashboard for issues

---

## Migration Checklist

- [ ] Created `/api/groq-proxy.ts`
- [ ] Created `/api/elevenlabs-proxy.ts`
- [ ] Updated `package.json` with `@vercel/node`
- [ ] Updated `CZChatService.js` to use proxy
- [ ] Updated `ElevenLabsTTSCache.js` to use proxy
- [ ] Removed `VITE_` prefix from API keys in `.env`
- [ ] Added server-side env vars to Vercel
- [ ] Tested locally
- [ ] Deployed to Vercel
- [ ] Verified API keys NOT visible in browser
- [ ] Tested voice assistant works
- [ ] Tested chat works
- [ ] Monitored for rate limit errors

---

## Cost Savings Example

### Before (Exposed Keys)
```
Bad Actor finds your key → Uses it for their app
Your bill: $500/month (mostly abuse)
```

### After (Protected Keys)
```
Rate limited to 10-20 req/min per IP
Your bill: $20/month (only your actual users)
Savings: $480/month 💰
```

---

## Support

If you encounter issues:

1. Check Vercel function logs: `vercel logs`
2. Verify environment variables: `vercel env ls`
3. Test locally first: `pnpm dev`
4. Check browser console for errors
5. Review this guide's troubleshooting section

---

**🎉 Your API keys are now secure!**

No more worrying about someone stealing your keys and running up your bill.
