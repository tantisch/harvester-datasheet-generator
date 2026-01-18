# 🚀 Deployment Guide - Industrial Harvester Datasheet Generator

This guide will help you deploy your app online so anyone can use it with just a URL.

---

## 📋 What You'll Deploy

- **Frontend (Vercel)**: The main app interface - FREE
- **Backend (Render)**: PDF generation server - FREE

**Total Cost: $0** ✅

---

## Step 1: Prepare Your Code (GitHub)

### 1.1 Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"+"** → **"New repository"**
3. Repository name: `harvester-datasheet-generator`
4. Select **Public** (required for free Vercel/Render)
5. Click **"Create repository"**

### 1.2 Push Your Code to GitHub

Open terminal in your project folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Harvester Datasheet Generator"

# Add your GitHub repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/harvester-datasheet-generator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### 2.2 Import Your Project

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find `harvester-datasheet-generator` in the list
3. Click **"Import"**

### 2.3 Configure Build Settings

Vercel should auto-detect Vite, but verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2.4 Add Environment Variable (Important!)

Click **"Environment Variables"** and add:

- **Name**: `VITE_PDF_SERVER_URL`
- **Value**: `https://your-pdf-server.onrender.com` (we'll get this in Step 3)
- Check all environments (Production, Preview, Development)

**Don't deploy yet!** We need the PDF server URL first.

---

## Step 3: Deploy Backend (PDF Server) to Render

### 3.1 Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click **"Get Started"**
3. Choose **"Sign up with GitHub"**
4. Authorize Render

### 3.2 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `harvester-datasheet-generator`
3. Click **"Connect"**

### 3.3 Configure Service

Fill in the settings:

- **Name**: `harvester-pdf-server` (this creates URL: harvester-pdf-server.onrender.com)
- **Region**: Choose closest to your location
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node pdf-server.js`
- **Plan**: **Free** ✅

### 3.4 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable**:

- **Key**: `NODE_ENV`
- **Value**: `production`

### 3.5 Deploy!

Click **"Create Web Service"**

⏳ Wait 2-3 minutes for deployment...

✅ When it says **"Live"**, copy your URL (e.g., `https://harvester-pdf-server.onrender.com`)

---

## Step 4: Update Frontend with Backend URL

### 4.1 Update App.tsx

We need to use the deployed PDF server URL instead of localhost.

In `App.tsx`, find this line (around line 196):

```typescript
const response = await fetch('http://localhost:3001/generate-pdf', {
```

Change it to use environment variable:

```typescript
const API_URL = import.meta.env.VITE_PDF_SERVER_URL || 'http://localhost:3001';
const response = await fetch(`${API_URL}/generate-pdf`, {
```

### 4.2 Enable CORS on PDF Server

Update `pdf-server.js` to allow requests from your Vercel domain.

Find the `app.use(cors());` line and replace it with:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
```

### 4.3 Commit and Push Changes

```bash
git add .
git commit -m "Configure for production deployment"
git push
```

---

## Step 5: Complete Vercel Deployment

### 5.1 Go Back to Vercel

1. In your Vercel project settings
2. Go to **"Settings"** → **"Environment Variables"**
3. Update the `VITE_PDF_SERVER_URL` variable:
   - **Value**: Your Render URL (e.g., `https://harvester-pdf-server.onrender.com`)
4. Click **"Save"**

### 5.2 Deploy!

1. Go to **"Deployments"** tab
2. Click **"Redeploy"** → **"Redeploy"**

⏳ Wait 1-2 minutes...

✅ Your app is now LIVE!

---

## Step 6: Update Render with Frontend URL

### 6.1 Add CORS Environment Variable

1. Go to your Render dashboard
2. Select `harvester-pdf-server`
3. Go to **"Environment"**
4. Click **"Add Environment Variable"**:
   - **Key**: `FRONTEND_URL`
   - **Value**: Your Vercel URL (e.g., `https://harvester-datasheet.vercel.app`)
5. Click **"Save Changes"**

Render will automatically redeploy.

---

## 🎉 YOU'RE DONE!

### Your Live URLs:

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://harvester-pdf-server.onrender.com`

### Share with Your Coworker:

Just send them the Vercel URL! They can:
- ✅ Use it immediately in any browser
- ✅ Create datasheets
- ✅ Download PDFs
- ✅ No setup required!

---

## 🔧 Troubleshooting

### PDF Download Fails

**Problem**: CORS error or PDF server not responding

**Solution**:
1. Check Render logs: Go to Render → Your service → "Logs"
2. Verify environment variables are set correctly
3. Make sure both URLs (Frontend ↔ Backend) are updated

### Free Tier Limitations

**Render Free Tier:**
- Service spins down after 15 minutes of inactivity
- First request after inactivity takes ~30 seconds to wake up
- 750 hours/month free (more than enough)

**Solution**: First PDF of the day might take 30 seconds. Subsequent ones are instant.

### Need Help?

Check logs:
- **Vercel**: Project → "Deployments" → Click latest → "View Function Logs"
- **Render**: Service → "Logs" tab

---

## 💡 Tips

1. **Custom Domain** (Optional): Both Vercel and Render allow custom domains for free
2. **Automatic Deploys**: Any push to GitHub automatically redeploys
3. **Preview Deployments**: Vercel creates preview URLs for every git branch

---

## 📝 Summary

```
┌─────────────┐
│  Coworker   │
└──────┬──────┘
       │ Opens URL
       ▼
┌─────────────────┐
│ Vercel Frontend │  (FREE)
│ your-app.vercel.app
└────────┬────────┘
         │ Requests PDF
         ▼
┌─────────────────┐
│ Render Backend  │  (FREE)
│ PDF Generation  │
└─────────────────┘
```

**Result**: Professional, production-ready deployment at $0 cost! 🚀

