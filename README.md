<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/18SxDUWNcJEK-u5aK58QRFY1QmwO-5trk

## Run Locally

**Prerequisites:**  Node.js

### Development Mode (Recommended for Testing)

1. **Install dependencies** (if you haven't already):
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Create a `.env.local` file in the root directory
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your-api-key-here
     ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - The app will be available at: `http://localhost:3000`
   - The terminal will show the exact URL
   - Changes to code will automatically reload in the browser (hot reload)

### Test Production Build Locally

To test how the app will work after deployment:

1. **Build the production version:**
   ```bash
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

3. **Open in browser:**
   - Usually available at: `http://localhost:4173` (or check the terminal output)
   - This simulates how the app will work on Netlify

### What to Test

- ✅ Add fruits and drag them around
- ✅ Rotate and scale fruits (pinch/scroll)
- ✅ Delete fruits by dragging to trash
- ✅ Click "拜财神 (Pray)" button to generate blessing
- ✅ Test music toggle button (if you added music file)
- ✅ Test on mobile device (connect to same network, use your computer's IP address)
- ✅ Check sound effects work
- ✅ Verify API key is working (blessing generation)

### Testing on Mobile Device

1. Find your computer's local IP address:
   - **Mac/Linux:** Run `ifconfig` or `ip addr`
   - **Windows:** Run `ipconfig`
   - Look for something like `192.168.1.xxx`

2. Make sure your phone is on the same WiFi network

3. Access from phone:
   - Open browser on phone
   - Go to: `http://YOUR_IP_ADDRESS:3000` (replace with your actual IP)
   - Example: `http://192.168.1.100:3000`

## Deploy to Netlify

This app is ready to deploy to Netlify! Follow these steps:

### Option 1: Deploy via Netlify UI (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   - Make sure your repository is pushed to a Git hosting service

2. **Connect to Netlify**
   - Go to [netlify.com](https://www.netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

3. **Configure Build Settings**
   - Netlify should auto-detect the settings from `netlify.toml`
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Set Environment Variable**
   - Go to Site settings → Environment variables
   - Add a new variable:
     - Key: `GEMINI_API_KEY`
     - Value: Your Gemini API key
   - **Important:** Make sure to add this before your first build!

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your app

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize and deploy**:
   ```bash
   netlify init
   netlify env:set GEMINI_API_KEY your-api-key-here
   netlify deploy --prod
   ```

### Important Security Note

⚠️ **Warning:** Currently, the Gemini API key is embedded in the client-side bundle, which means it will be visible in the browser. This is acceptable for development and personal projects, but for production apps with high traffic, consider:

- Using Netlify Functions to proxy API calls
- Implementing rate limiting
- Using API key restrictions in Google Cloud Console

The app will work as-is, but be aware that your API key will be exposed in the client bundle.

## Adding Background Music

The app supports festive background music! To add music:

1. **Find a music file:**
   - Go to [freesound.org](https://freesound.org)
   - Search for "Chinese New Year", "festive", "celebration", or "traditional Chinese music"
   - Make sure the file has a license that allows use (CC0, CC BY, etc.)
   - Download an MP3 file

2. **Add the music file:**
   - Place the file in: `public/assets/festive-music.mp3` (or `.wav`, `.ogg`, `.m4a`)
   - **If using .wav**: Update the path in `App.tsx` line 27 from `.mp3` to `.wav`
   - Or update the path in `App.tsx` if you use a different filename

3. **Use the music controls:**
   - Click the volume icon (🔊/🔇) in the top-left corner to play/pause music
   - Music will loop automatically
   - Volume is set to 30% by default to not overpower sound effects

**Recommended search terms on Freesound.org:**
- "Chinese New Year"
- "festive celebration"
- "traditional Chinese"
- "lunar new year"
- "celebration music"

**Supported formats:** MP3 (recommended), WAV, OGG, M4A

**Note:** If no music file is found, the app will work normally without background music. The music button will still appear but won't play anything until you add a music file.
