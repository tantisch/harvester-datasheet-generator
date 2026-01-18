# 💾 Auto-Save Feature

## What It Does

Your work is **automatically saved** to your browser every time you make a change. When you reload the page, everything is restored exactly as you left it!

## What Gets Saved

✅ **Everything:**
- Theme selection (Sharp Tech, Angle Bold, etc.)
- Brand color (Forest, Yellow, Steel)
- All technical specifications
- Hero image (first page) - position, zoom, image
- Gallery images - all photos, positions, sizes, order

## How It Works

### Auto-Save (Instant)
- Makes a change → **Automatically saved** in 0.1 seconds
- No "Save" button needed
- No internet required (saves to browser)
- Works offline

### Auto-Restore
- Reload page → Your work is **automatically restored**
- Close browser and come back → Still there!
- Works even if you close the tab

## Storage Location

Data is stored in **browser's localStorage**:
- Stored on **your computer** (not on a server)
- Each browser keeps its own data (Chrome ≠ Firefox)
- Private and secure
- Approximately **5MB** storage limit (more than enough!)

## Reset Button

Click **"Скинути все"** (Reset All) in the sidebar to:
- Clear all saved data
- Restore default values
- Start fresh

**⚠️ Warning:** This action cannot be undone!

## Technical Details

### For Developers:

**Storage Key:** `harvester-datasheet-data`

**Data Structure:**
```json
{
  "theme": "sharp",
  "color": "forest",
  "specs": [...],
  "heroImage": {...},
  "galleryImages": [...]
}
```

**Implementation:**
- `useEffect` hook watches state changes
- `localStorage.setItem()` saves on every change
- `localStorage.getItem()` loads on app mount
- `localStorage.removeItem()` clears on reset

## Browser Compatibility

✅ **Supported:**
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

❌ **Not Supported:**
- Private/Incognito mode (localStorage disabled)
- Very old browsers (IE 9 and below)

## FAQ

**Q: What happens if I clear my browser cache?**  
A: Your saved data will be lost. Export your PDF before clearing cache!

**Q: Can I use this on multiple devices?**  
A: No, data is stored locally. Each device keeps its own data.

**Q: Will my coworker see my changes?**  
A: No, data is stored on your browser only. Each user has their own data.

**Q: What if localStorage is full?**  
A: Very unlikely (5MB limit), but if it happens, the app will show an error in console.

**Q: Can I export/import my data?**  
A: Not yet, but you can:
  1. Download PDF to save the final result
  2. Or manually copy data from browser DevTools (localStorage)

## Console Messages

Check browser console (F12) to see:
- `✅ Auto-saved` - Data saved successfully
- `🔄 Reset to defaults` - Data cleared and reset
- `Error saving data:` - Something went wrong

## Privacy & Security

- ✅ Data never leaves your computer
- ✅ No server uploads
- ✅ No tracking
- ✅ No cookies
- ✅ 100% private

Your datasheet data is yours alone!

---

**Tip:** Download your PDF regularly as a backup. Auto-save is convenient but not a replacement for proper backups!

