# Laurelle Realty

> Where AI Meets Home — A premium AI-powered real estate platform for the Lagos market.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Phase](https://img.shields.io/badge/phase-1%20of%205-blue)

## About

Laurelle Realty is a modern real estate web application that combines polished property listings with AI-powered customer interaction and automated lead management. Built for the Lagos, Nigeria market with international scalability in mind.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Supabase (Postgres + Auth + RLS)
- **AI Layer:** Groq LLaMA 3.3 70B + Pinecone Assistant (RAG)
- **Automation:** n8n
- **Deployment:** Vercel

## Features

### ✅ Phase 1 — Complete

- Responsive marketing site with brand identity
- Property listings with filters (location, price, type, bedrooms)
- Property detail pages with image galleries
- Contact form with Supabase persistence
- Mobile-first responsive design

### 🚧 Phase 2 — In Progress

- User authentication (buyers + admin)
- Buyer dashboard (saved properties, viewing history)
- Admin panel (property + lead management)

### 📋 Upcoming

- **Phase 3:** AI chat widget with RAG-powered responses and lead capture
- **Phase 4:** n8n automations (notifications, follow-ups, daily reports)
- **Phase 5:** Production deployment + polish

## Setup

```bash
# Clone the repo
git clone https://github.com/YOUR-USERNAME/laurelle-realty.git
cd laurelle-realty

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase URL and anon key to .env

# Run development server
npm run dev
```

## Architecture

This is a multi-phase project built incrementally. Each phase adds a complete, tested layer of functionality before moving forward — preventing technical debt and ensuring every feature works end-to-end.

## Built By

**Lauren Jude** — AI Automation Builder

- LinkedIn: [Your LinkedIn URL]
- Building in public 🚀

## License

MIT
