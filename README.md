# JioPay Business RAG Chatbot 

A comprehensive RAG (Retrieval-Augmented Generation) chatbot system for JioPay Business customer support. This intelligent assistant helps users find information about JioPay services, policies, features, and troubleshooting through natural language queries.

## 🚀 Live Demo

[View Application](https://jiopay-rag-chatbot.vercel.app)

## 📁 Project Structure

```
jiopay-rag-chatbot/
├── vercel.json                     # Vercel deployment configuration
├── README.md                       # Project documentation
├── rag-chat/                      # Next.js application (main app)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Main chat interface
│   │   │   ├── api/
│   │   │   │   └── chat/
│   │   │   │       └── route.ts   # API endpoint for chat functionality
│   │   │   ├── globals.css        # Global styles
│   │   │   └── layout.tsx         # Root layout
│   │   └── components/            # Reusable React components
│   ├── package.json               # Dependencies and scripts
│   ├── next.config.js            # Next.js configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── tsconfig.json             # TypeScript configuration
├── chunked_data/                  # Processed data chunks
│   ├── *.json                    # Various chunking strategies
│   └── analysis_results/         # Chunking analysis
├── embeddings_data/              # Vector embeddings
│   ├── *.pkl                     # Embedding vectors
│   └── *.json                    # Metadata files
├── scraped_data/                 # Raw scraped data
│   ├── *.json                    # FAQ and web data
│   └── *.pdf                     # Policy documents
├── scraper_files/                # Data collection scripts
│   └── *.py                      # Python scrapers
├── reports/                      # Analysis reports
└── Full_Workflow.ipynb          # Complete data processing pipeline
```

## Technology Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Lucide React Icons
- **AI/ML**: Google Gemini 2.5 Flash, Hugging Face Transformers
- **Database**: Supabase with pgvector for similarity search
- **Deployment**: Vercel (Edge Runtime)
- **Data Processing**: Python, Jupyter Notebooks
- **Styling**: Tailwind CSS with responsive design

## Features

- **Intelligent Query Routing**: Automatically routes queries to appropriate search strategies
- **Multi-Source Knowledge Base**: Integrates FAQs, policy documents, and web content
- **Advanced Search**: Hybrid semantic + keyword search with topic detection
- **Real-time Chat Interface**: Modern, responsive chat UI with typing indicators
- **Source Attribution**: Shows sources and citations for all responses
- **Beautiful UI**: Modern design with animations and transitions
- **Mobile Responsive**: Works seamlessly across all devices
- **Fast Performance**: Edge runtime for optimal response times

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google AI Studio API key
- Hugging Face API key

### 1. Clone and Install

```bash
git clone https://github.com/HarVkr/jiopay-rag-chatbot.git
cd jiopay-rag-chatbot/rag-chat
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the `rag-chat/` directory:

```env
# Google AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

# Hugging Face (for embeddings)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Development
NODE_ENV=development
```

### 3. Database Setup

1. Create a Supabase project
2. Enable the `pgvector` extension
3. Set up your vector similarity search functions
4. Upload your processed data and embeddings

### 4. Run Development Server

```bash
cd rag-chat
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## API Keys Setup

### Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` as `GEMINI_API_KEY`

### Hugging Face API Key

1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Create a new token with read access
3. Add it to your `.env.local` as `HUGGINGFACE_API_KEY`

### Supabase Setup

1. Create a project at [Supabase](https://supabase.com)
2. Go to Settings → API
3. Copy your project URL and service role key
4. Add them to your `.env.local`

## Deployment to Vercel

### Method 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure these settings in Vercel Dashboard:

**Build & Development Settings:**

- Framework Preset: `Next.js`
- Root Directory: `rag-chat`
- Build Command: `npm run build`
- Output Directory: (leave empty)
- Install Command: `npm ci`

**Advanced Settings:**

- ✅ Include files outside the root directory in the Build Step
- ❌ Skip deployments when there are no changes to the root directory

4. Add all environment variables in Vercel → Settings → Environment Variables

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from root directory
vercel

# Follow the prompts and set root directory to 'rag-chat'
```

## Architecture Overview

### Data Processing Pipeline

1. **Web Scraping**: Automated collection of JioPay documentation
2. **Document Processing**: PDF parsing and text extraction
3. **Intelligent Chunking**: Multiple strategies (semantic, structural, fixed-size)
4. **Embedding Generation**: Vector representations using sentence transformers
5. **Vector Storage**: Supabase with pgvector for similarity search

### Chat System Architecture

1. **Query Analysis**: Intelligent routing based on query type and content
2. **Vector Search**: Semantic similarity search with multiple fallback strategies
3. **Context Building**: Relevant information retrieval and formatting
4. **Response Generation**: AI-powered responses using Google Gemini
5. **Source Attribution**: Transparent citation of information sources

### Search Strategies

- **PDF Search**: Policy and compliance documents
- **FAQ Search**: Operational questions and procedures
- **Topic Search**: Category-specific information retrieval
- **Hybrid Search**: Combined semantic and keyword matching
- **Comprehensive Search**: Fallback across all content

## Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler

# Data Processing (in root directory)
jupyter notebook Full_Workflow.ipynb    # Run complete pipeline
python scraper_files/jiopay_general_data_scraper.py  # Scrape web data
```

## Data Sources

- **JioPay Business Website**: General information and features
- **FAQ Documentation**: Operational procedures and troubleshooting
- **Policy Documents**: Compliance, grievance, and regulatory information
- **Partner Resources**: Commission structures and partner guidelines

## Configuration Files

- **`vercel.json`**: Vercel deployment configuration
- **`next.config.js`**: Next.js configuration
- **`tailwind.config.js`**: UI styling configuration
- **`tsconfig.json`**: TypeScript compiler options

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure all environment variables are set correctly
2. **Build Failures**: Check Node.js version compatibility (18+)
3. **CORS Issues**: Verify Supabase RLS policies
4. **Embedding Errors**: Confirm Hugging Face API key permissions

### Performance Optimization

- **Edge Runtime**: Faster cold starts and response times
- **Embedding Caching**: Reduced API calls for repeated queries
- **Fallback Strategies**: Multiple search methods for reliability
- **Connection Pooling**: Efficient database connections

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**HarVkr**

- GitHub: [@HarVkr](https://github.com/HarVkr)

## Acknowledgments

- JioPay Business for documentation and resources
- Google AI for Gemini API
- Hugging Face for transformer models
- Supabase for vector database capabilities
- Vercel for seamless deployment platform
