# Render Deployment Guide - x444 Website

## 🔒 Secure API Proxy Setup for Render

This guide shows you how to deploy the x444 website with secure API key protection using Render.com.

---

## Architecture

```
┌─────────────────────┐
│   Render Static     │
│   Site (Frontend)   │
│   Your Website      │
└──────────┬──────────┘
           │
           │ API Calls
           ▼
┌─────────────────────┐
│   Render Web        │
│   Service (Backend) │
│                     │
│   Express Server    │
│   • Rate Limiting   │
│   • API Key Proxy   │
└──────────┬──────────┘
           │
           │ With API Keys
           ▼
┌─────────────────────┐
│   External APIs     │
│   • Groq AI         │
│   • ElevenLabs TTS  │
└─────────────────────┘
```

---

## Step 1: Deploy Backend API Server

### Option A: Using render.yaml (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Render backend with API proxies"
   git push
   ```

2. **Create New Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Render will auto-detect the `render.yaml` file

3. **Configure Backend Service**
   - Name: `x444-api-proxy` (or your choice)
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm run server`
   - Instance Type: `Free` (or paid for better performance)

4. **Add Environment Variables**

   In the Render dashboard, go to **Environment** tab and add:

   | Key | Value | Note |
   |-----|-------|------|
   | `NODE_ENV` | `production` | |
   | `PORT` | `3001` | Render sets this automatically |
   | `GROQ_API_KEY` | `gsk_your_key_here` | Your Groq API key |
   | `ELEVENLABS_API_KEY` | `sk_your_key_here` | Your ElevenLabs API key |
   | `ELEVENLABS_VOICE_ID` | `EXAVITQu4vr4xnSDxMaL` | CZ voice |
   | `FRONTEND_URL` | `https://your-frontend.onrender.com` | Your frontend URL (for CORS) |

5. **Deploy**
   - Click **"Create Web Service"**
   - Wait for deployment to complete
   - Note your backend URL: `https://x444-api-proxy.onrender.com`

### Option B: Manual Deployment

If not using render.yaml:

1. Create a new Web Service
2. Connect GitHub repo
3. Set these values:
   - **Name:** x444-api-proxy
   - **Root Directory:** (leave blank)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm run server`
4. Add environment variables (same as above)
5. Deploy

---

## Step 2: Deploy Frontend Static Site

### Option A: Using render.yaml

If you used render.yaml, the frontend is already configured! Just:

1. **Add Frontend Environment Variable**
   - Go to your frontend service in Render
   - Add environment variable:
     - `VITE_API_URL` = `https://your-backend-url.onrender.com`
   - Trigger redeploy

### Option B: Manual Frontend Deployment

1. **Create New Static Site**
   - Go to Render Dashboard
   - Click **"New +"** → **"Static Site"**
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Name: `x444-website`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

3. **Add Rewrite Rule**
   - Add this rewrite rule for React Router:
   ```
   Source: /*
   Destination: /index.html
   Action: Rewrite
   ```

4. **Add Environment Variable**
   - `VITE_API_URL` = `https://x444-api-proxy.onrender.com` (your backend URL)

5. **Deploy**

---

## Step 3: Update CORS Settings (Important!)

Once your frontend is deployed, update the backend's `FRONTEND_URL`:

1. Go to your backend service (`x444-api-proxy`)
2. Environment tab
3. Update `FRONTEND_URL` to your actual frontend URL
4. Example: `https://x444-website.onrender.com`
5. This prevents CORS errors

---

## Testing Your Deployment

### 1. Check Backend Health

Visit: `https://your-backend.onrender.com/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-11-01T..."
}
```

### 2. Check API Endpoints

**Test Groq Proxy:**
```bash
curl -X POST https://your-backend.onrender.com/api/groq-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "What is x444?"}]
  }'
```

**Test ElevenLabs Proxy:**
```bash
curl -X POST https://your-backend.onrender.com/api/elevenlabs-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello from x444"
  }'
```

### 3. Check Frontend

1. Visit your frontend URL
2. Open browser DevTools → Network tab
3. Try the voice assistant
4. You should see requests to:
   - `https://your-backend.onrender.com/api/groq-proxy`
   - `https://your-backend.onrender.com/api/elevenlabs-proxy`
5. **Verify NO API keys are visible in the requests!**

---

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Create .env File
```bash
cp .env.example .env
```

Edit `.env`:
```bash
# Backend API Keys
GROQ_API_KEY=your_groq_key
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL

# Local Development
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Frontend points to local backend
VITE_API_URL=http://localhost:3001
```

### 3. Run Backend Server
```bash
npm run dev:server
```

Server runs on `http://localhost:3001`

### 4. Run Frontend (in another terminal)
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

### 5. Test Locally

Open `http://localhost:3000` and test the voice assistant!

---

## Environment Variables Reference

### Backend Variables (Render Web Service)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GROQ_API_KEY` | ✅ Yes | Your Groq API key | `gsk_...` |
| `ELEVENLABS_API_KEY` | ✅ Yes | Your ElevenLabs API key | `sk_...` |
| `ELEVENLABS_VOICE_ID` | No | Voice ID for TTS | `EXAVITQu4vr4xnSDxMaL` |
| `FRONTEND_URL` | ✅ Yes | Your frontend URL (for CORS) | `https://x444.onrender.com` |
| `NODE_ENV` | No | Environment mode | `production` |
| `PORT` | No | Port (Render sets this) | `3001` |

### Frontend Variables (Render Static Site)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ Yes | Backend API URL | `https://x444-api.onrender.com` |
| `VITE_SUPABASE_URL` | No | Supabase URL (if using analytics) | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase anon key | `eyJ...` |

---

## Rate Limiting

The backend includes automatic rate limiting:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/groq-proxy` | 20 requests | per minute per IP |
| `/api/elevenlabs-proxy` | 10 requests | per minute per IP |

### Rate Limit Response

When exceeded:
```json
HTTP 429 Too Many Requests
{
  "error": "Rate limit exceeded. Please try again later.",
  "retryAfter": 60
}
```

---

## Security Benefits ✅

### What This Protects

- ✅ API keys never exposed to browser
- ✅ Rate limiting prevents abuse
- ✅ Input validation blocks malicious requests
- ✅ CORS protection limits access to your frontend
- ✅ No API keys in JavaScript bundles
- ✅ Prevents bot scraping of credentials

### What You're Protected Against

- ❌ Users stealing API keys from DevTools
- ❌ Bots scraping keys from source code
- ❌ Unlimited API usage draining quota
- ❌ $1000+ surprise API bills
- ❌ Malicious actors using your keys

---

## Monitoring

### Render Dashboard

1. Go to your backend service
2. Click **"Logs"** tab
3. Monitor for:
   ```
   🚀 API Proxy Server running on port 3001
   [Rate Limit] Too many requests from 1.2.3.4
   [Error] Groq API error: ...
   ```

### Check Rate Limits

Response headers show remaining quota:
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1699999999
```

---

## Troubleshooting

### Error: "Service not configured"

**Problem:** Environment variables not set

**Solution:**
1. Go to Render Dashboard → Your Service → Environment
2. Verify `GROQ_API_KEY` and `ELEVENLABS_API_KEY` are set
3. Click "Save Changes"
4. Wait for redeploy

### Error: CORS blocked

**Problem:** `FRONTEND_URL` not set correctly

**Solution:**
1. Go to backend service → Environment
2. Set `FRONTEND_URL` to your actual frontend URL
3. Example: `https://x444-website.onrender.com`
4. Save and redeploy

### Error: "Network error" from frontend

**Problem:** `VITE_API_URL` not set or wrong

**Solution:**
1. Go to frontend service → Environment
2. Set `VITE_API_URL` to your backend URL
3. Example: `https://x444-api-proxy.onrender.com`
4. Trigger manual deploy

### Error: Rate limit exceeded

**Problem:** Too many requests

**Solution:**
- Wait 60 seconds
- Check for request loops in frontend code
- Consider upgrading to paid Render plan for better limits

### Backend keeps sleeping (Free tier)

**Problem:** Render free tier spins down after inactivity

**Solution:**
- Upgrade to paid plan ($7/month) for always-on
- Or accept 30-second cold start on first request
- Use a ping service to keep it awake

---

## Cost Optimization

### Free Tier
- Backend: Free (with sleep after 15min inactivity)
- Frontend: Free
- **Total:** $0/month

### Paid Tier (Recommended)
- Backend: $7/month (always on, no cold starts)
- Frontend: Free
- **Total:** $7/month

### Expected API Costs
- ElevenLabs: ~$5-20/month (based on usage)
- Groq: Free tier usually sufficient
- **Total with Render:** ~$12-27/month

**vs. Without protection:** $400-500/month from abuse

**Savings:** ~$370-480/month! 💰

---

## Advanced Configuration

### Increase Rate Limits

Edit `server/index.js`:

```javascript
const groqLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50, // Change from 20 to 50
});
```

### Add IP Whitelist

```javascript
const WHITELISTED_IPS = ['1.2.3.4'];

app.use((req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'];
  if (WHITELISTED_IPS.includes(ip)) {
    return next(); // Skip rate limiting
  }
  next();
});
```

### Add Request Logging

```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});
```

---

## Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Render
- [ ] `GROQ_API_KEY` set in backend
- [ ] `ELEVENLABS_API_KEY` set in backend
- [ ] `FRONTEND_URL` set to actual frontend URL
- [ ] `VITE_API_URL` set in frontend to backend URL
- [ ] Health check returns 200 OK
- [ ] Test Groq proxy endpoint
- [ ] Test ElevenLabs proxy endpoint
- [ ] Voice assistant works on live site
- [ ] Chat works on live site
- [ ] No API keys visible in browser DevTools
- [ ] Rate limiting works (test 21st request)
- [ ] CORS configured correctly
- [ ] Logs show no errors

---

## Support & Resources

- [Render Documentation](https://render.com/docs)
- [Express.js Docs](https://expressjs.com/)
- [Rate Limiting Guide](https://www.npmjs.com/package/express-rate-limit)

---

**🎉 Your API keys are now secure on Render!**

Your APIs are protected, rate-limited, and your bills won't explode from abuse.
