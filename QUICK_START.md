# Quick Start: Deploy Edge Functions NOW

Follow these steps exactly - should take about 5 minutes!

---

## Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

Wait for it to finish, then verify:
```bash
supabase --version
```

You should see something like `1.x.x`

---

## Step 2: Login to Supabase

```bash
supabase login
```

This will:
1. Open your browser
2. Ask you to authorize the CLI
3. Click "Authorize"

---

## Step 3: Get Your Project Reference

Go to your Supabase dashboard: https://supabase.com/dashboard

Look at your project URL. It looks like:
```
https://abcdefghijklmnop.supabase.co
         ^^^^^^^^^^^^^^^^
         This is your project ref!
```

Copy that project ref (the random letters before `.supabase.co`)

---

## Step 4: Link Your Project

```bash
supabase link --project-ref YOUR_PROJECT_REF_HERE
```

Replace `YOUR_PROJECT_REF_HERE` with what you copied above.

Example:
```bash
supabase link --project-ref abcdefghijklmnop
```

It will ask for your database password. Enter it.

---

## Step 5: Set Your API Keys as Secrets

**Get your API keys ready:**
- Groq API key from: https://console.groq.com/
- ElevenLabs API key from: https://elevenlabs.io/app/settings/api-keys

**Set them:**
```bash
supabase secrets set GROQ_API_KEY=paste_your_groq_key_here
```

```bash
supabase secrets set ELEVENLABS_API_KEY=paste_your_elevenlabs_key_here
```

```bash
supabase secrets set ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
```

**Verify they're set:**
```bash
supabase secrets list
```

You should see all three secrets listed!

---

## Step 6: Deploy the Edge Functions

```bash
supabase functions deploy groq-proxy
```

Wait for it to finish (takes ~30 seconds)

```bash
supabase functions deploy elevenlabs-proxy
```

Wait again (~30 seconds)

---

## Step 7: Test They Work!

**Test Groq proxy:**
```bash
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/groq-proxy \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Say hi in 5 words"}]}'
```

You should get back a JSON response with AI text!

**Test ElevenLabs proxy:**
```bash
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/elevenlabs-proxy \
  -H "Content-Type: application/json" \
  -d '{"text": "Testing"}'
```

You should get back JSON with base64 audio data!

---

## Step 8: Update Your Frontend .env

Create or edit `.env` in your project:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_from_supabase_dashboard
```

**To get your anon key:**
1. Go to Supabase dashboard
2. Settings → API
3. Copy "anon" "public" key

---

## Step 9: Test Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

Try the voice assistant or chat - it should work!

---

## Step 10: Deploy Your Frontend

**If using Vercel:**
```bash
npm run build
vercel --prod
```

**If using Netlify:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

**If using another host:**
```bash
npm run build
# Upload the dist/ folder
```

Don't forget to set environment variables in your hosting dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Step 11: Verify Security ✅

1. Visit your live website
2. Open DevTools (F12)
3. Go to Network tab
4. Use the voice assistant
5. Look at the requests

You should see:
- ✅ Requests to `https://yourproject.supabase.co/functions/v1/`
- ✅ NO API keys anywhere in the requests
- ✅ Only `text` or `messages` in request body

If you see API keys, something is wrong! Let me know.

---

## Done! 🎉

Your API keys are now:
- ✅ Protected server-side
- ✅ Never exposed to browser
- ✅ Rate-limited by Supabase
- ✅ Running on global edge network
- ✅ FREE (500K requests/month)

---

## If Something Goes Wrong

**Edge function not found?**
```bash
# Redeploy
supabase functions deploy groq-proxy elevenlabs-proxy
```

**API key errors?**
```bash
# Check secrets
supabase secrets list

# Re-set if needed
supabase secrets set GROQ_API_KEY=your_key
```

**Can't link project?**
```bash
# Make sure you're logged in
supabase login

# Try linking again
supabase link --project-ref your_project_ref
```

**Function returns error?**
```bash
# Check logs
supabase functions logs groq-proxy --tail
```

---

## Need Help?

Just let me know what error you're seeing and I'll help fix it!
