# Scaniya — Dynamic QR Code Platform

Scaniya is a production-ready SaaS application for creating, customizing, and tracking dynamic QR codes. One Scan, Infinite Possibilities.

## Features
- **Dynamic Content**: Update destination URLs or content without reprinting.
- **Content Types**: Link, Text, Image, and Multi-Action (Linktree-style).
- **Custom Design**: Adjust size and colors. Pro users can embed logos.
- **Analytics**: Real-time scan tracking with daily charts and device logs (Pro).
- **Authentication**: Seamless Google OAuth integration via NextAuth.
- **Monetization Ready**: Free and Pro plan limits enforced server-side.

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: MongoDB Atlas + Mongoose
- **Auth**: NextAuth.js v5 (auth.js)
- **Styling**: Tailwind CSS + shadcn/ui
- **QR Engine**: qr-code-styling
- **Analytics**: Recharts

## Getting Started

### 1. Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Cloud Console account (for OAuth)

### 2. Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```

### 3. Environment Variables
- `MONGODB_URI`: Your MongoDB Atlas connection string.
- `NEXTAUTH_SECRET`: A secure random string for session encryption.
- `NEXTAUTH_URL`: Your development URL (e.g., `http://localhost:3000`).
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID.
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret.
- `NEXT_PUBLIC_APP_URL`: The public URL where the app is hosted.

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

## MongoDB Setup
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database named `scaniya`.
3. Get your connection string and add it to `.env`.

## Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Configure OAuth consent screen.
4. Create Credentials > OAuth client ID (Web application).
5. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://scaniya.alphaprime.co.in/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`.

## Deployment
This project is optimized for [Vercel](https://vercel.com):
1. Connect your GitHub repository to Vercel.
2. Add all environment variables from `.env`.
3. Deploy.
