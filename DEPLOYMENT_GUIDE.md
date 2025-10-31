# x444 Website - Deployment Guide

**Status:** ✅ READY FOR PRODUCTION
**Build Date:** October 29, 2025
**Build Time:** ~13 seconds
**Build Size:** ~272 KB (gzipped: ~80-100 KB)

---

## Quick Start (Vercel - Recommended)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Authorize Vercel to access your repositories

### Step 2: Import Project
```bash
# Vercel will detect this automatically if using GitHub
# Or use the Vercel CLI:
npm i -g vercel
cd /Users/rayarroyo/ZCDOS/apps/x444-website
vercel
```

### Step 3: Configure Environment Variables
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add the following (optional - site works without them):
   ```
   VITE_ELEVENLABS_API_KEY=your_key_here
   VITE_ELEVENLABS_CZ_VOICE_ID=EXAVITQu4vr4xnSDxMaL
   VITE_GROQ_API_KEY=your_key_here
   ```
3. Save variables

### Step 4: Deploy
```bash
vercel --prod
```

That's it! Your site is now live.

---

## Detailed Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Pros:**
- Zero configuration
- Automatic HTTPS
- Global CDN
- Free tier available
- Built-in analytics
- Automatic deployments from Git

**Cons:**
- Vendor lock-in
- Limited customization

**Steps:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /Users/rayarroyo/ZCDOS/apps/x444-website
vercel --prod

# Verify deployment
vercel ls
```

**Configure Custom Domain:**
1. Add domain in Vercel project settings
2. Update DNS records with Vercel nameservers
3. Wait 24-48 hours for propagation
4. Verify in Vercel dashboard

---

### Option 2: Netlify

**Pros:**
- Easy setup
- Good free tier
- Git-based deployments
- Strong community

**Cons:**
- Slightly slower cold starts than Vercel
- Build minutes limited on free tier

**Steps:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build first
npm run build

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist

# Or link to Git repo
netlify init
```

**Env Variables:**
1. Go to Netlify Dashboard → Site Settings → Build & Deploy
2. Add environment variables
3. Redeploy

---

### Option 3: GitHub Pages

**Pros:**
- Free
- GitHub integration
- No vendor dependency

**Cons:**
- Limited customization
- No server-side rendering
- Must be public repository

**Steps:**
```bash
# Add to package.json
"deploy": "npm run build && git add dist && git commit -m 'Deploy' && git subtree push --prefix dist origin gh-pages"

# Configure GitHub repo settings:
# 1. Go to Settings → Pages
# 2. Source: Deploy from branch
# 3. Branch: gh-pages
# 4. Folder: / (root)

# Deploy
npm run deploy
```

---

### Option 4: AWS S3 + CloudFront

**Pros:**
- Highly scalable
- Full control
- Pay-as-you-go

**Cons:**
- More complex setup
- Higher cost for low traffic

**Steps:**
```bash
# Install AWS CLI
pip install awscli

# Build
npm run build

# Create S3 bucket
aws s3api create-bucket \
  --bucket x444-protocol \
  --region us-east-1

# Upload build
aws s3 sync dist/ s3://x444-protocol/ --delete

# Create CloudFront distribution
# (Use AWS Console or CDK)

# Update DNS to CloudFront URL
```

---

### Option 5: Docker + Container Hosting

**Pros:**
- Portable
- Reproducible
- Easy scaling

**Cons:**
- Requires container knowledge
- More infrastructure management

**Docker Setup:**
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Deploy to Heroku:**
```bash
heroku login
heroku create x444-protocol
git push heroku main
```

---

## Pre-Deployment Checklist

### Local Testing
- [ ] Run `npm run build` successfully
- [ ] Run `npm run preview` and manually test
- [ ] Visit http://localhost:4173
- [ ] Test all pages load
- [ ] Test mobile responsiveness (F12 → toggle device)
- [ ] Check console for errors
- [ ] Test navigation between pages

### Build Verification
- [ ] dist/ folder exists
- [ ] dist/index.html is present
- [ ] dist/assets/ contains JS and CSS files
- [ ] No console warnings during build
- [ ] File sizes reasonable (CSS < 50KB, JS < 250KB)

### Security Verification
- [ ] No API keys in source code
- [ ] No API keys in dist/ folder
- [ ] .gitignore configured
- [ ] .env file not in repository
- [ ] SECURITY_CHECKLIST.md reviewed

### Content Verification
- [ ] No CZDOS references in public code
- [ ] All links work correctly
- [ ] Images load properly
- [ ] Text renders clearly
- [ ] Colors match brand (gold/charcoal)
- [ ] Animations smooth and professional

---

## Post-Deployment Steps

### Immediate (First Hour)
- [ ] Verify site loads at production URL
- [ ] Check all pages are accessible
- [ ] Test navigation works
- [ ] Verify no 404 errors
- [ ] Check mobile view
- [ ] Monitor console for errors

### First Day
- [ ] Set up analytics (optional)
- [ ] Configure monitoring
- [ ] Create backup of deployment
- [ ] Test email notifications (if applicable)
- [ ] Verify DNS propagation complete

### First Week
- [ ] Monitor traffic and performance
- [ ] Check error logs
- [ ] Verify API keys working
- [ ] Test from different locations/devices
- [ ] Gather user feedback

### Ongoing
- [ ] Monitor uptime
- [ ] Track performance metrics
- [ ] Plan security updates
- [ ] Update content as needed
- [ ] Review analytics

---

## Monitoring & Analytics

### Performance Monitoring
```bash
# Local Lighthouse audit
npm run audit

# Or use web tools:
# - https://pagespeed.web.dev/
# - https://www.webpagetest.org/
# - Chrome DevTools Lighthouse
```

### Optional Analytics Setup
Choose one for your deployment:

**Vercel Analytics:**
- Built-in with Vercel
- No code changes needed
- Free tier available

**Google Analytics:**
```html
<!-- Add to index.html <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

**Plausible:**
```html
<!-- Add to index.html <head> -->
<script defer data-domain="x444.protocol" src="https://plausible.io/js/script.js"></script>
```

---

## Rollback Plan

### If Something Goes Wrong

**Vercel Rollback:**
1. Go to Vercel Dashboard
2. Select x444-website project
3. Go to Deployments tab
4. Find previous working deployment
5. Click "Promote to Production"
6. Confirm

**Manual Rollback:**
```bash
# If using Git
git revert <commit-hash>
git push

# Then redeploy
vercel --prod
```

**Quick Fix:**
```bash
# Fix the issue locally
npm run build
npm run preview

# Test thoroughly, then:
vercel --prod
```

---

## Domain Configuration

### Using Custom Domain (e.g., x444.protocol)

**Step 1: Register Domain**
- Go to domain registrar (GoDaddy, Namecheap, etc.)
- Register your domain
- Note: you may need x444.protocol or x444.app

**Step 2: Configure in Vercel**
1. Vercel Dashboard → Project Settings
2. Add domain in "Domains" section
3. Follow Vercel's DNS configuration

**Step 3: Update DNS**
- If using Vercel DNS: Update nameservers with registrar
- If using custom DNS: Add CNAME or A records per Vercel instructions

**Step 4: Verify SSL**
- Vercel automatically provisions SSL
- Takes 15-30 minutes
- Check green lock in browser

**Step 5: Enable Redirects** (Optional)
Redirect www.x444.protocol to x444.protocol in vercel.json:
```json
{
  "redirects": [
    {
      "source": "/:path*",
      "destination": "/:path*"
    }
  ]
}
```

---

## Environment Variables

### Required (For Voice Features)
```
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
VITE_ELEVENLABS_CZ_VOICE_ID=EXAVITQu4vr4xnSDxMaL
VITE_GROQ_API_KEY=your_groq_key
```

### Optional (For Analytics)
```
VITE_ANALYTICS_ID=your_analytics_id
VITE_GA_ID=your_google_analytics_id
```

### How to Set (Vercel Example)
1. Project Settings → Environment Variables
2. Click "Add New"
3. Name: VITE_ELEVENLABS_API_KEY
4. Value: your-api-key
5. Select environments: Production, Preview, Development
6. Click "Save"
7. Redeploy for changes to take effect

---

## Performance Optimization

### Bundle Size
Current sizes:
- CSS: 43.83 kB
- JS (vendor): 42.28 kB
- JS (app): 224.04 kB (includes everything)
- **Gzipped: ~80-100 kB**

### Optimization Tips
1. **Images:** Use WebP format
2. **Code splitting:** Already enabled
3. **Caching:** Configure long-lived caches for assets
4. **Minification:** Automatic with Vite
5. **Tree-shaking:** Enabled by default

### Expected Performance
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Lighthouse Score:** 90+

---

## Troubleshooting

### Site Won't Load
- [ ] Check DNS propagation
- [ ] Verify domain pointing to Vercel
- [ ] Check deployment logs
- [ ] Try purging cache (Ctrl+Shift+Delete)
- [ ] Contact hosting provider support

### Styles Look Wrong
- [ ] Clear browser cache
- [ ] Verify CSS file loaded (DevTools → Network)
- [ ] Check Tailwind configuration
- [ ] Verify build completed successfully

### Voice Features Not Working
- [ ] Check API keys are set in environment variables
- [ ] Verify API key is valid
- [ ] Check browser console for errors
- [ ] Try different API key

### 404 on Pages
- [ ] Verify all routes in vercel.json
- [ ] Check that all page files exist
- [ ] Ensure rewrites configured: `/:path* → /index.html`
- [ ] Test locally first with `npm run preview`

---

## Support & Resources

**Documentation:**
- Vercel: https://vercel.com/docs
- Vite: https://vitejs.dev/
- React: https://react.dev/
- Tailwind: https://tailwindcss.com/

**Community:**
- GitHub Discussions
- Stack Overflow
- Community Discord

---

## Version History

| Version | Date | Status |
|---------|------|--------|
| 1.0 | Oct 29, 2025 | Initial deployment guide |

---

**🚀 Ready to Deploy!**

Choose your platform above and follow the steps. The site is fully optimized and secure.
