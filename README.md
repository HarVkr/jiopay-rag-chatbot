# JioPay Business RAG Chatbot

A comprehensive RAG (Retrieval-Augmented Generation) chatbot for JioPay Business customer support.

## Live Demo

[View Application](https://your-deployment-url.vercel.app)

## Project Structure

```
jiopay-rag-chatbot/
├── webapp/          # Next.js application
├── research/        # Data processing & notebooks
├── docs/           # Documentation
└── deployment/     # Deployment configs
```

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **AI/ML**: Google Gemini, Transformers.js, Sentence Transformers
- **Database**: Supabase with pgvector
- **Deployment**: Vercel

## Quick Start

1. Clone and install:

```bash
git clone <your-repo-url>
cd jiopay-rag-chatbot/webapp
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
# Add your API keys
```

3. Run development server:

```bash
npm run dev
```

## Features

- Real-time RAG-based responses
- Vector similarity search
- Multiple data source integration
- Responsive modern UI
- Source attribution and citations

## Deployment

Deploy to Vercel by connecting your GitHub repository.
Set root directory to `webapp/` in Vercel settings.
