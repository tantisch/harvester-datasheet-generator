# 📋 Deployment Checklist

Use this checklist when deploying to production.

## ✅ Before Deployment

- [ ] Test locally (frontend on :3000, backend on :3001)
- [ ] Verify PDF generation works
- [ ] Check all images load correctly
- [ ] Test on different screen sizes

## 🔧 GitHub Setup

- [ ] Create GitHub repository (public for free hosting)
- [ ] Push code to GitHub:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
  git push -u origin main
  ```

## 🖥️ Render (Backend) Setup

1. [ ] Sign up at [render.com](https://render.com) with GitHub
2. [ ] Create new "Web Service"
3. [ ] Connect your GitHub repo
4. [ ] Configure:
   - Name: `harvester-pdf-server`
   - Build Command: `npm install`
   - Start Command: `node pdf-server.js`
   - Plan: Free
5. [ ] Add environment variables:
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = (add after Vercel deployment)
6. [ ] Deploy and copy the URL (e.g., `https://harvester-pdf-server.onrender.com`)

## 🌐 Vercel (Frontend) Setup

1. [ ] Sign up at [vercel.com](https://vercel.com) with GitHub
2. [ ] Import your GitHub repository
3. [ ] Configure (auto-detected for Vite):
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. [ ] Add environment variable:
   - `VITE_PDF_SERVER_URL` = Your Render URL from above
5. [ ] Deploy and copy the URL (e.g., `https://your-app.vercel.app`)

## 🔄 Final Configuration

1. [ ] Go back to Render
2. [ ] Add/Update environment variable:
   - `FRONTEND_URL` = Your Vercel URL
3. [ ] Wait for auto-redeploy on Render (~1 min)
4. [ ] Test the live app - try generating a PDF!

## 🎉 Done!

Your app is live at: `https://your-app.vercel.app`

Share this URL with anyone - they can use it immediately!

---

## 🆘 Troubleshooting

**PDF Generation Fails:**
- Check Render logs (Dashboard → Service → Logs)
- Verify environment variables are correct on both platforms
- First request after 15 min inactivity takes ~30 seconds (free tier)

**Build Fails:**
- Check build logs on Vercel
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

**CORS Errors:**
- Double-check `FRONTEND_URL` on Render matches your Vercel URL exactly
- Include `https://` in the URL
- No trailing slash

---

## 💡 Tips

- **Auto-Deploy**: Push to GitHub = automatic redeployment
- **Preview URLs**: Vercel creates preview URLs for each branch
- **Custom Domain**: Both platforms support free custom domains
- **Logs**: Always check logs first when debugging

