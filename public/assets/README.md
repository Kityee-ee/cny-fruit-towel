# Music File Instructions

## Adding Festive Background Music

1. **Find a festive music file:**
   - Go to [freesound.org](https://freesound.org)
   - Search for "Chinese New Year", "festive", "celebration", or "traditional Chinese music"
   - Make sure the file has a license that allows use (CC0, CC BY, etc.)
   - Download an MP3, WAV, OGG, or M4A file

2. **Rename and place the file:**
   - Option A: Rename to `festive-music.mp3` (or `.wav`, `.ogg`, `.m4a`)
   - Place it in this directory: `public/assets/festive-music.mp3`
   - **If using .wav**: Update the path in `App.tsx` line 27:
     - Change: `'/assets/festive-music.mp3'` 
     - To: `'/assets/festive-music.wav'`

3. **Alternative: Use a different filename**
   - If you want to use a different filename, update the path in `App.tsx`:
   - Look for: `soundService.initBackgroundMusic('/assets/festive-music.mp3')`
   - Change to your filename: `soundService.initBackgroundMusic('/assets/your-filename.wav')`

## Recommended Search Terms on Freesound.org:
- "Chinese New Year"
- "festive celebration"
- "traditional Chinese"
- "lunar new year"
- "celebration music"

## Supported File Formats:
- **MP3** (recommended for best compatibility and smaller file size)
- **WAV** (high quality, but larger file size)
- **OGG** (good compression)
- **M4A** (also supported)

**File size:** Keep under 5MB for faster loading (WAV files are typically larger, so MP3 is recommended)
