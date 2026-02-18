<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/18SxDUWNcJEK-u5aK58QRFY1QmwO-5trk

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

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
