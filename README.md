# ✂️ Cutter — URL Shortener & Analytics SaaS

<p align="center">
  <img src="public/logo.png" alt="Cutter Logo" width="120" />
</p>

**Cutter** is a high-performance URL shortener and real-time link analytics platform built with modern web technologies and a sleek liquid glass dark theme design.

---

## ✨ Features

- 💎 **Liquid Glass UI**: Glassmorphism aesthetic featuring HSL dark mode, custom reflections, and modern typography (Inter & Instrument Serif).
- ⚡ **Instant URL Shortening**: Custom short code creation, vector QR code generator, and one-click copy to clipboard.
- 📊 **Real-time Analytics Dashboard**: Monitor link clicks, active shortened URLs, traffic sources, and geographic metrics.
- 🔑 **Supabase Authentication**: Integrated Email/Password registration & sign-in, and Google OAuth support.
- 🗄️ **Supabase Database & Offline Fallback**: Persistent Supabase database operations with seamless client-side local storage backup.
- 🎨 **Smooth Scroll Animations**: Parallax dashboard effects and scroll-driven word-by-word opacity reveals powered by Framer Motion.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS v3, Custom CSS Tokens, Glassmorphism
- **Animations**: Framer Motion, Canvas Confetti
- **Backend & DB**: Supabase JS Client (`@supabase/supabase-js`)
- **Icons & QR**: Lucide React, QRCode SVG

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sh4dabexe/Cutter.git
   cd Cutter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🗄️ Database Setup (Supabase SQL)

Run the following schema in your Supabase SQL Editor to set up the `urls` and `url_analytics` tables:

```sql
CREATE TABLE IF NOT EXISTS public.urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  short_code VARCHAR(12) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  title VARCHAR(255),
  clicks INT DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.url_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url_id UUID REFERENCES public.urls(id) ON DELETE CASCADE NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  referrer TEXT DEFAULT 'Direct',
  user_agent TEXT,
  country VARCHAR(50) DEFAULT 'Global'
);
```

---

## 📜 License

MIT License © 2026 Cutter SaaS Inc.
