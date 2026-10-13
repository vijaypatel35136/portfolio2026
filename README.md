# Vijay Portfolio

A modern, full-stack portfolio application built with React, Vite, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎨 **Aurora Workbench Design**: Modern, creative UI with glass panels and aurora effects
- 🌓 **Light/Dark Theme**: Theme toggle with localStorage persistence
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- ✨ **Scroll Animations**: Smooth reveal animations using Intersection Observer
- 🖼️ **Image Gallery**: Multiple images per project with slider support
- 📊 **Admin Dashboard**: Full CRUD management for portfolio content
- 🔐 **Authentication**: Secure admin login
- 📝 **Contact Form**: Contact form with Supabase integration
- 🎯 **Supabase Backend**: PostgreSQL database and storage

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express, Node.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Routing**: React Router with HashRouter
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/vijaypatel35136/portfolio2026.git
cd portfolio2026

# Install dependencies
npm install

# Set up environment variables
cp client/.env.example client/.env
```

### Environment Variables

Create `client/.env` with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### Run Locally

```bash
# Start development server (runs both client and server)
npm run dev

# Client only
npm run dev:client

# Server only
npm run dev:server
```

### Build for Production

```bash
npm run build
```

## Supabase Setup

### 1. Create Project

- Go to [Supabase](https://supabase.com)
- Create a new project
- Copy URL and anon key to `.env`

### 2. Run Schema

Run the SQL in `supabase_schema.sql` in the Supabase SQL Editor.

### 3. Set Up Storage

1. Create bucket: `portfolio-files` (public)
2. Set RLS policies for public access
3. Run the storage policies I provided earlier

## Deployment

### GitHub Pages

The project is configured to deploy to GitHub Pages via GitHub Actions.

1. Push to `main` branch
2. GitHub Actions automatically builds and deploys
3. Site available at: https://vijaypatel35136.github.io/portfolio2026/

### Local Build

```bash
npm run build
# Output in /dist folder
```

## Admin Panel

- URL: `/#/vijay_dev`
- Default credentials: `admin@vijay.dev` / `admin123`

## License

MIT
