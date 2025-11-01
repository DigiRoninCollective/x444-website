# Supabase Deployment Guide - x444 Website

## 🔒 Secure API Proxy with Supabase Edge Functions

This guide shows you how to deploy secure API proxies using **Supabase Edge Functions** - serverless functions that protect your API keys.

---

## Why Supabase Edge Functions?

✅ **Free** - Included with Supabase free tier (500K requests/month)
✅ **No separate backend** - Uses your existing Supabase project
✅ **Globally distributed** - Fast edge computing
✅ **Auto-scaling** - Handles traffic spikes
✅ **Built-in security** - API keys never exposed to browser

---

## Architecture

```
┌─────────────────┐
│   Your Website  │
│   (Frontend)    │
└────────┬────────┘
         │
         │ Calls Edge Functions
         ▼
┌──────────────────────────────┐
│   Supabase Edge Functions    │
│                              │
│   ├─ groq-proxy              │
│   └─ elevenlabs-proxy        │
│                              │
│   API keys stored as secrets │
└────────┬─────────────────────┘
         │
         │ With protected keys
         ▼
┌────────────────────┐
│   External APIs    │
│   • Groq           │
│   • ElevenLabs     │
└────────────────────┘
```

---

## Prerequisites

1. **Supabase CLI installed**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Verify installation
   supabase --version
   ```

2. **Supabase project** (you already have this!)
   - Project URL: `https://yourproject.supabase.co`
   - Anon key: From Supabase dashboard

3. **API Keys**
   - Groq API key: Get from [console.groq.com](https://console.groq.com/)
   - ElevenLabs API key: Get from [elevenlabs.io](https://elevenlabs.io/)

---

## Step 1: Initialize Supabase Locally

```bash
# Login to Supabase
supabase login

# Link to your existing project
supabase link --project-ref your-project-ref

# Your project ref is in your Supabase URL:
# https://YOUR-PROJECT-REF.supabase.co
```

---

## Step 2: Deploy Edge Functions

### Deploy Groq Proxy Function

```bash
supabase functions deploy groq-proxy
```

### Deploy ElevenLabs Proxy Function

```bash
supabase functions deploy elevenlabs-proxy
```

### Deploy Both at Once

```bash
supabase functions deploy groq-proxy && supabase functions deploy elevenlabs-proxy
```

---

## Step 3: Set API Key Secrets

**IMPORTANT:** These are server-side secrets, never visible in the browser!

```bash
# Set Groq API key
supabase secrets set GROQ_API_KEY=gsk_your_groq_api_key_here

# Set ElevenLabs API key
supabase secrets set ELEVENLABS_API_KEY=sk_your_elevenlabs_api_key_here

# Set ElevenLabs voice ID (CZ voice)
supabase secrets set ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
```

### Verify Secrets

```bash
supabase secrets list
```

You should see:
```
GROQ_API_KEY
ELEVENLABS_API_KEY
ELEVENLABS_VOICE_ID
```

---

## Step 4: Configure Frontend

### Update `.env` file

```bash
# Your Supabase project URL and anon key
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**That's it!** The frontend will automatically use Edge Functions at:
- `https://yourproject.supabase.co/functions/v1/groq-proxy`
- `https://yourproject.supabase.co/functions/v1/elevenlabs-proxy`

---

## Step 5: Test Edge Functions

### Test Groq Proxy

```bash
curl -X POST https://yourproject.supabase.co/functions/v1/groq-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "What is x444?"}]
  }'
```

**Expected response:**
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

### Test ElevenLabs Proxy

```bash
curl -X POST https://yourproject.supabase.co/functions/v1/elevenlabs-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello from x444"
  }'
```

**Expected response:**
```json
{
  "audio": "base64_encoded_audio...",
  "contentType": "audio/mpeg"
}
```

---

## Local Development

### Option 1: Use Your Deployed Edge Functions (Recommended)

Just set your Supabase URL in `.env`:
```bash
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Run your frontend:
```bash
npm run dev
```

It will call your live Edge Functions automatically!

### Option 2: Run Edge Functions Locally

Start Supabase locally:
```bash
supabase start
```

Serve Edge Functions locally:
```bash
supabase functions serve groq-proxy
supabase functions serve elevenlabs-proxy
```

Set local secrets:
```bash
# Create .env file in supabase/functions
echo "GROQ_API_KEY=your_key" >> supabase/.env.local
echo "ELEVENLABS_API_KEY=your_key" >> supabase/.env.local
```

Update frontend `.env`:
```bash
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your_local_anon_key
```

---

## Testing Your Deployment

### 1. Deploy Your Frontend

Deploy to any hosting service (Vercel, Netlify, Render, etc.):

```bash
# Build the frontend
npm run build

# Deploy dist/ folder to your host
```

### 2. Check Edge Functions Work

1. Visit your website
2. Open browser DevTools → Network tab
3. Try the voice assistant or chat
4. Look for requests to:
   - `https://yourproject.supabase.co/functions/v1/groq-proxy`
   - `https://yourproject.supabase.co/functions/v1/elevenlabs-proxy`

### 3. Verify API Keys Are Protected

**Open DevTools → Network → Click on the request**

You should see:
- ✅ Request URL contains `supabase.co/functions/v1/`
- ✅ Request body only contains `messages` or `text`
- ✅ **NO API keys anywhere!**

If you see API keys, something is wrong!

---

## Edge Function Endpoints

Your Edge Functions are available at:

```
https://[YOUR-PROJECT-REF].supabase.co/functions/v1/groq-proxy
https://[YOUR-PROJECT-REF].supabase.co/functions/v1/elevenlabs-proxy
```

### Groq Proxy

**POST** `/functions/v1/groq-proxy`

Request:
```json
{
  "messages": [
    { "role": "user", "content": "What is x444?" }
  ],
  "model": "llama-3.1-70b-versatile" // optional
}
```

Response:
```json
{
  "choices": [
    {
      "message": {
        "content": "AI response here..."
      }
    }
  ]
}
```

### ElevenLabs Proxy

**POST** `/functions/v1/elevenlabs-proxy`

Request:
```json
{
  "text": "Text to speak",
  "voice_id": "EXAVITQu4vr4xnSDxMaL" // optional
}
```

Response:
```json
{
  "audio": "base64_encoded_mp3...",
  "contentType": "audio/mpeg"
}
```

---

## Monitoring & Logs

### View Function Logs

```bash
supabase functions logs groq-proxy --tail
supabase functions logs elevenlabs-proxy --tail
```

### View in Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Edge Functions** in sidebar
4. View logs, invocations, and errors

---

## Rate Limiting

Supabase automatically provides:
- **500,000 invocations/month** (free tier)
- **10GB egress/month** (free tier)

For additional protection, you can add rate limiting in the Edge Function code.

---

## Security Features ✅

### What's Protected

✅ **API keys never exposed** - Stored as Supabase secrets
✅ **Server-side only** - Keys never sent to browser
✅ **CORS configured** - Only your domain can call functions
✅ **Input validation** - Rejects malicious requests
✅ **Automatic scaling** - Handles traffic spikes

### What You're Protected Against

❌ Users stealing API keys from DevTools
❌ Bots scraping keys from JavaScript
❌ Unlimited API usage
❌ $1000+ surprise API bills

---

## Cost Breakdown

### Supabase (Edge Functions)
- **Free tier:** 500K requests/month
- **Beyond free:** $0.00000008 per request

### API Usage (Protected by Edge Functions)
- **ElevenLabs:** ~$5-20/month (legitimate users only)
- **Groq:** Free tier usually sufficient

### Total Cost
- **Typical:** $5-20/month
- **vs. Without protection:** $400-500/month

**Savings:** ~$380-480/month! 💰

---

## Troubleshooting

### Error: "Service not configured"

**Problem:** Secrets not set

**Solution:**
```bash
# Check secrets
supabase secrets list

# Set missing secrets
supabase secrets set GROQ_API_KEY=your_key
supabase secrets set ELEVENLABS_API_KEY=your_key
```

### Error: CORS blocked

**Problem:** CORS headers not configured

**Solution:** Update `supabase/functions/_shared/cors.ts`:
```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-domain.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

Then redeploy:
```bash
supabase functions deploy groq-proxy elevenlabs-proxy
```

### Error: "Function not found"

**Problem:** Functions not deployed

**Solution:**
```bash
# Deploy both functions
supabase functions deploy groq-proxy
supabase functions deploy elevenlabs-proxy
```

### Frontend can't connect

**Problem:** Wrong Supabase URL in `.env`

**Solution:**
```bash
# Check your .env file
cat .env

# Should have:
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Restart dev server
npm run dev
```

---

## Updating Edge Functions

### Update Function Code

1. Edit files in `supabase/functions/`
2. Redeploy:
   ```bash
   supabase functions deploy groq-proxy
   ```

### Update Secrets

```bash
# Update a secret
supabase secrets set GROQ_API_KEY=new_key_here

# Functions automatically use new secrets (no redeploy needed)
```

---

## Advanced Configuration

### Add Custom Rate Limiting

Edit `supabase/functions/groq-proxy/index.ts`:

```typescript
// Simple in-memory rate limiting
const rateLimits = new Map();

serve(async (req) => {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  // Check rate limit (10 requests per minute)
  const userRequests = rateLimits.get(ip) || [];
  const recentRequests = userRequests.filter(t => now - t < 60000);

  if (recentRequests.length >= 10) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      { status: 429, headers: corsHeaders }
    );
  }

  recentRequests.push(now);
  rateLimits.set(ip, recentRequests);

  // ... rest of function
});
```

### Add Request Logging

```typescript
serve(async (req) => {
  const ip = req.headers.get('x-forwarded-for');
  console.log(`[${new Date().toISOString()}] Request from ${ip}`);

  // ... rest of function
});
```

---

## Deployment Checklist

- [ ] Supabase CLI installed
- [ ] Linked to Supabase project
- [ ] Edge Functions deployed (`supabase functions deploy`)
- [ ] API key secrets set (`supabase secrets set`)
- [ ] Verified secrets (`supabase secrets list`)
- [ ] Tested Edge Functions with curl
- [ ] Updated frontend `.env` with Supabase URL
- [ ] Frontend deployed
- [ ] Tested voice assistant works
- [ ] Tested chat works
- [ ] Verified no API keys in browser DevTools
- [ ] Checked function logs for errors

---

## Commands Cheat Sheet

```bash
# Login and link project
supabase login
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy groq-proxy
supabase functions deploy elevenlabs-proxy

# Set secrets
supabase secrets set GROQ_API_KEY=your_key
supabase secrets set ELEVENLABS_API_KEY=your_key
supabase secrets set ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL

# View secrets
supabase secrets list

# View logs
supabase functions logs groq-proxy --tail

# Local development
supabase start
supabase functions serve
```

---

## Support & Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Deno Deploy Docs](https://deno.com/deploy/docs)

---

**🎉 Your API keys are now secure with Supabase!**

No more worrying about exposed keys. Everything runs on Supabase Edge Functions - free, fast, and secure.
