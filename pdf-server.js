// Simple PDF generation server using Puppeteer
// Install: npm install express puppeteer cors
// Run: node pdf-server.js

import express from 'express';
import cors from 'cors';

// Use puppeteer-core with chromium for serverless (Render)
// Use regular puppeteer for local development
let puppeteer;
let chromium;

if (process.env.NODE_ENV === 'production') {
  // Production: Use puppeteer-core with chromium
  puppeteer = (await import('puppeteer-core')).default;
  chromium = (await import('@sparticuz/chromium')).default;
} else {
  // Development: Use regular puppeteer
  puppeteer = (await import('puppeteer')).default;
}

const app = express();

// CORS configuration for production
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.text({ limit: '50mb' }));

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.post('/generate-pdf', async (req, res) => {
  let browser;
  try {
    const html = req.body;
    
    if (!html) {
      return res.status(400).json({ error: 'HTML content required' });
    }

    console.log('Generating PDF...');

    // Launch headless browser
    let launchOptions;
    
    if (process.env.NODE_ENV === 'production') {
      // Production: Use chromium with optimized args for Render
      launchOptions = {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      };
    } else {
      // Development: Use local Chrome
      launchOptions = {
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      };
    }

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    
    // Load Tailwind CSS from CDN (same as main app)
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="uk">
        <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet">
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    sans: ['Inter', 'sans-serif'],
                    mono: ['Roboto Mono', 'monospace'],
                  },
                  colors: {
                    brand: 'var(--brand-color)',
                    'brand-dark': 'var(--brand-color-dark)',
                  }
                }
              }
            }
          </script>
          <style>
            :root {
              --brand-color: #1b4d3e;
              --brand-color-dark: #123329;
            }
            body {
              margin: 0;
              padding: 0;
              background: white;
            }
            .a4-page {
              width: 210mm;
              height: 297mm;
              background: white;
              overflow: hidden;
              position: relative;
              page-break-after: always;
              page-break-inside: avoid;
            }
            /* Force brand color for text and backgrounds */
            .text-brand {
              color: var(--brand-color) !important;
            }
            .bg-brand {
              background-color: var(--brand-color) !important;
            }
            .border-brand {
              border-color: var(--brand-color) !important;
            }
            @page {
              size: A4 portrait;
              margin: 0;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    await page.setContent(fullHTML, {
      waitUntil: ['networkidle0', 'domcontentloaded']
    });

    // Wait for Tailwind and fonts to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate PDF with high quality
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      displayHeaderFooter: false
    });

    await browser.close();
    console.log('PDF generated successfully');

    // Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Harvester_Datasheet.pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    if (browser) await browser.close();
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PDF server is running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n✅ PDF Server running on http://localhost:${PORT}`);
  console.log('📄 Ready to generate PDFs\n');
});

