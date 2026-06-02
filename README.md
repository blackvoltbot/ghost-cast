
# GhostCast: Remote Support Terminal

High-performance, hacker-style remote support infrastructure built with Next.js 15, WebRTC, and GenAI.

## Tech Stack
- **Next.js 15 (App Router)**
- **WebRTC** for real-time screen and audio transmission
- **GenAI** for automated incident diagnosis
- **Tailwind CSS** for the hacker aesthetic UI
- **Lucide Icons**

## Deployment Guide

### Prerequisites
- Node.js 20+
- A Google AI SDK Key for GenAI features (added to `.env`)

### Setup Instructions
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see below)
4. Start the development server: `npm run dev`

### Environment Variables
Create a `.env.local` file:
```
GOOGLE_GENAI_API_KEY=your_api_key_here
```

### Vercel Deployment
1. Connect your GitHub repository to Vercel.
2. Add your environment variables in the Vercel dashboard.
3. Click "Deploy". GhostCast is optimized for serverless performance.

## Signaling Bridge
Note: For production WebRTC signaling, a dedicated Socket.io server is recommended. This starter uses a mock bridge for demonstration purposes, but the logic is ready to be hooked into a service like Ably or a custom Node server.
