# PDF Generation Setup

## Quick Start (2 steps)

### 1. Install dependencies
```bash
npm install express puppeteer cors
```

### 2. Start PDF server (in a new terminal)
```bash
node pdf-server.js
```

You should see:
```
✅ PDF Server running on http://localhost:3001
📄 Ready to generate PDFs
```

### 3. Use the app
Now when you click "Завантажити PDF" in the app, it will automatically download a perfect PDF with:
- ✅ Selectable text (real text, not images)
- ✅ Sharp vector graphics
- ✅ Perfect layout (no shifts)
- ✅ All backgrounds and colors

---

## Troubleshooting

### "PDF Server Error" when clicking download

**Problem:** Server is not running

**Solution:**
1. Open a new terminal
2. Navigate to project folder
3. Run: `node pdf-server.js`
4. Leave it running

---

### Dependencies won't install

**Problem:** Old Node version or network issues

**Solution:**
```bash
# Check Node version (need v14+)
node --version

# Try with --legacy-peer-deps
npm install express puppeteer cors --legacy-peer-deps
```

---

### Puppeteer fails to download Chromium (Linux)

**Problem:** Missing system dependencies

**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get install -y chromium-browser

# Or skip download and use system Chrome
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install puppeteer
```

---

### Server won't start - port 3001 in use

**Problem:** Port already taken

**Solution:**
Edit `pdf-server.js` and change:
```javascript
const PORT = 3002; // Change to any free port
```

Then update `App.tsx`:
```typescript
const response = await fetch('http://localhost:3002/generate-pdf', {
```

---

## How It Works

1. You click "Завантажити PDF"
2. App sends HTML content to local server (http://localhost:3001)
3. Server uses Puppeteer (headless Chrome) to render HTML
4. Server generates PDF with perfect quality
5. PDF downloads automatically

This is the same technology used by:
- GitHub (for PDF exports)
- Stripe (for invoices)
- Google Docs (for PDF conversion)

---

## Development Workflow

Keep two terminals open:

**Terminal 1 - Main App:**
```bash
npm run dev
```

**Terminal 2 - PDF Server:**
```bash
node pdf-server.js
```

Both need to be running for PDF generation to work.

