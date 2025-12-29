<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# WonderLens - Magical Memory Gallery

A beautiful, AI-powered photo and video gallery to celebrate life's special moments. Built with React, Vite, and Tailwind CSS.

## ✨ Features

- 🖼️ **Beautiful Gallery** - Stunning photo and video display with animations
- 🤖 **AI Stories** - Generate magical stories with Gemini AI
- 🎵 **Background Music** - Multiple music tracks with playlist
- 🎨 **Glass Morphism** - Modern, elegant UI design
- 📱 **Fully Responsive** - Perfect on all devices (mobile-first)
- 🚀 **Lightning Fast** - ~77KB gzipped total
- 🔍 **SEO Optimized** - Comprehensive meta tags and structured data
- 📲 **PWA Ready** - Installable as a mobile app
- ♿ **Accessible** - WCAG compliant with ARIA labels

## 🚀 Quick Start

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Vercel

This app is ready for Vercel deployment! 

### Quick Deploy

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables**:
   - In your Vercel dashboard, go to Settings → Environment Variables
   - Add: `GEMINI_API_KEY` with your API key from https://aistudio.google.com/app/apikey

### Deploy via Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New..." → "Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: Your Gemini API key
7. Click "Deploy"

### Environment Variables Required

- `GEMINI_API_KEY` - Your Gemini API key from https://aistudio.google.com/app/apikey

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[SEO_GUIDE.md](./SEO_GUIDE.md)** - SEO optimization details
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Testing procedures
- **[OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md)** - What's been optimized

## 🎨 Brand Assets

All brand assets are in `/public/`:
- `favicon.svg` - Main favicon (camera icon with gradient)
- `apple-touch-icon.svg` - iOS home screen icon
- `og-image.svg` - Social media preview (1200x630)
- `manifest.json` - PWA configuration

## 🔍 SEO Features

✅ Comprehensive meta tags (title, description, keywords)
✅ Open Graph tags for Facebook/LinkedIn
✅ Twitter Card tags
✅ Structured data (JSON-LD)
✅ Sitemap.xml and robots.txt
✅ PWA manifest
✅ Performance optimized (preconnect, dns-prefetch)

## 📱 Mobile Optimizations

✅ Responsive header with compact controls
✅ Touch-friendly targets (44x44px minimum)
✅ Adaptive text sizing (3xl → 8xl)
✅ Smooth animations on all devices
✅ Optimized for iPhone, Android, tablets

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite 6** - Build tool & dev server
- **Tailwind CSS 3** - Styling
- **TypeScript** - Type safety
- **Lucide React** - Icons
- **Google Gemini AI** - Story generation

## 📊 Performance

- **HTML**: 5.37 KB (1.63 KB gzipped)
- **CSS**: 28.74 KB (5.83 KB gzipped)
- **JS**: 227.11 KB (70.13 KB gzipped)
- **Total**: ~77 KB gzipped ⚡

## 🎯 Browser Support

- Chrome/Edge (latest)
- Safari (latest)
- Firefox (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

Created by [Porqa Studio](https://porqa.com)

---

**Ready to deploy? Check [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions!**
