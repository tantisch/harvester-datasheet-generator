# PDF Generation Solutions

## Current Solution: Browser Print (With Selectable Text)

The app now uses the browser's native print functionality which:
- ✅ Preserves all text as **selectable text** (not images)
- ✅ Keeps vector graphics sharp (backgrounds, shapes, etc.)
- ✅ Perfect CSS rendering (no shifts or missing elements)
- ⚠️ Requires user to manually select "Save as PDF" in print dialog

### How to Use:
1. Click "Завантажити PDF"
2. In the print dialog:
   - **Destination**: Choose "Save as PDF" or "Microsoft Print to PDF"
   - **Layout**: Portrait
   - **Margins**: None
   - **Background graphics**: ON (important!)
3. Click "Save"

---

## Optional: Server-Side PDF Generation (Best Quality)

For automatic PDF downloads with perfect quality, you can optionally run a local PDF server.

### Setup:

1. **Install dependencies:**
   ```bash
   npm install express puppeteer cors
   ```

2. **Start the PDF server:**
   ```bash
   node pdf-server.js
   ```
   Server runs on `http://localhost:3001`

3. **Update App.tsx** to use the server:
   
   Replace the `handleDownloadPDF` function with:
   ```typescript
   const handleDownloadPDF = async () => {
     setIsDownloading(true);
     try {
       const container = document.getElementById('datasheet-container');
       if (!container) return;

       // Get the HTML content
       const html = container.innerHTML;
       
       // Get computed styles
       const styles = Array.from(document.styleSheets)
         .map(sheet => {
           try {
             return Array.from(sheet.cssRules)
               .map(rule => rule.cssText)
               .join('\n');
           } catch (e) {
             return '';
           }
         })
         .join('\n');

       // Send to server
       const response = await fetch('http://localhost:3001/generate-pdf', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ html, css: styles })
       });

       if (!response.ok) throw new Error('PDF generation failed');

       // Download the PDF
       const blob = await response.blob();
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = 'Harvester_Datasheet.pdf';
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       window.URL.revokeObjectURL(url);

     } catch (error) {
       console.error('PDF Error:', error);
       alert('Failed to generate PDF');
     } finally {
       setIsDownloading(false);
     }
   };
   ```

### Benefits of Server-Side Approach:
- ✅ Automatic download (no dialog)
- ✅ Perfect rendering every time
- ✅ Selectable text preserved
- ✅ All CSS/backgrounds/shapes rendered correctly
- ✅ No user interaction needed

---

## Troubleshooting

**Print dialog doesn't show backgrounds:**
- Make sure "Background graphics" option is enabled in print settings

**PDF has wrong dimensions:**
- Ensure print margins are set to "None" or "Minimum"

**Text looks blurry:**
- If using browser print, this shouldn't happen
- If still seeing images instead of text, switch to server-side solution

**Server-side PDF not working:**
- Make sure port 3001 is not in use
- Check that Puppeteer installed correctly: `npm list puppeteer`
- On Linux, you may need additional dependencies for Chromium

