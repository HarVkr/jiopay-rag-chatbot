import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { pipeline, env, FeatureExtractionPipeline } from "@xenova/transformers";

// Configure environment for serverless
env.allowRemoteModels = true;
env.allowLocalModels = false;
env.backends.onnx.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/";
env.backends.onnx.wasm.numThreads = 1;


export const runtime = "edge";
export const dynamic = "force-dynamic";



// Define types for better type safety
interface SearchResult {
  searchType: string;
  results: DatabaseChunk[];
  count: number;
  topic?: string | null;
}

interface DatabaseChunk {
  id: number;
  content: string;
  source_file: string;
  source_type: string;
  topic: string;
  faq_count?: number;
  token_count?: number;
  chunk_method?: string;
  metadata?: Record<string, unknown>;
  similarity?: number;
}



// Initialize Gemini AI
const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const geminiModel = genai.getGenerativeModel({ model: "gemini-2.5-flash" });

// Initialize Supabase with service role key
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// Improved JioPay search router with better PDF handling
class JioPayRAGSearchRouter {
  private topicKeywords: { [key: string]: string[] };
  private pdfKeywords: string[];
  private faqKeywords: string[];

  constructor() {
    // Topic keywords for intelligent routing
    this.topicKeywords = {
      'collect_links': ['collect link', 'payment link', 'link validity', 'bulk collect', 'partial payment'],
      'voicebox': ['voicebox', 'voice box', 'audio', 'announcement', 'replay'],
      'settlements': ['settlement', 'bank account', 'UTR', 'refund', 'payout'],
      'app_dashboard': ['app', 'dashboard', 'login', 'password', 'download', 'forgot'],
      'transactions': ['transaction', 'payment', 'refund', 'failed', 'processing'],
      'repeat_payments': ['repeat', 'recurring', 'subscription', 'mandate'],
      'campaigns': ['campaign', 'offer', 'create campaign', 'edit campaign'],
      'user_management': ['sub user', 'user management', 'block user'],
      'dqr': ['DQR', 'dynamic QR', 'store manager'],
      'partner_program': ['partner', 'commission', 'earning'],
      'p2pm_merchants': ['P2PM', 'merchant limit', 'upgrade'],
      'payment_gateway': ['payment', 'gateway', 'transaction', 'processing', 'checkout'],
      'app_usage': ['app', 'download', 'install', 'mobile', 'android', 'ios'],
      'business_setup': ['business', 'setup', 'merchant', 'onboarding', 'registration'],
      'technical_issues': ['error', 'issue', 'problem', 'troubleshoot', 'fix', 'bug'],
      'refunds': ['refund', 'return', 'cancel', 'reverse', 'chargeback'],
      'kyc_documents': ['kyc', 'documents', 'verification', 'identity', 'proof'],
      'fees_pricing': ['fee', 'charge', 'cost', 'price', 'rate', 'commission'],
      'general': []
    };

    // PDF-specific keywords (policies, procedures, compliance)
    this.pdfKeywords = [
      'policy', 'grievance', 'complaint', 'escalation', 'levels', 'resolution',
      'ombudsman', 'nodal officer', 'turnaround time', 'compensation',
      'restricted business', 'prohibited', 'allowed', 'not allowed',
      'documents required', 'kyc documents', 'proof of identity', 'address proof',
      'sole proprietorship', 'partnership', 'private limited', 'LLP',
      'registered address', 'CIN', 'PAN', 'GST', 'FSSAI',
      'RBI guidelines', 'regulatory', 'compliance', 'board reporting'
    ];

    // FAQ-specific keywords (operational questions)
    this.faqKeywords = [
      'how to', 'steps to', 'process to', 'way to',
      'create', 'setup', 'configure', 'install',
      'login', 'signup', 'register', 'activate'
    ];
  }

  analyzeQuery(query: string) {
    const queryLower = query.toLowerCase();
    
    // Check if it's a FAQ-style question
    const isFaqQuestion = /how to|what is|where can|why does|can i|do i need|\?/.test(queryLower);
    
    // Check if it's PDF-related (policy, compliance, documentation)
    const isPdfQuery = this.pdfKeywords.some(keyword => 
      queryLower.includes(keyword.toLowerCase())
    );
    
    // Check if it's operational FAQ
    const isOperationalFaq = this.faqKeywords.some(keyword => 
      queryLower.includes(keyword.toLowerCase())
    );
    
    // Detect specific topic
    let detectedTopic = null;
    for (const [topic, keywords] of Object.entries(this.topicKeywords)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        detectedTopic = topic;
        break;
      }
    }
    
    // Check for exact terms that need hybrid search
    const hasExactTerms = /jiopay|api|webhook|callback|integration/i.test(query);
    
    // Check query complexity
    const wordCount = query.split(/\s+/).length;
    const isComplexQuery = wordCount > 6;
    
    return {
      isFaqQuestion,
      isPdfQuery,
      isOperationalFaq,
      detectedTopic,
      hasExactTerms,
      isComplexQuery,
      wordCount
    };
  }

  async routeSearch(query: string, queryEmbedding: number[], maxResults: number = 8) {
    const analysis = this.analyzeQuery(query);
    
    console.log(`Query Analysis:`, analysis);
    
    try {
      // 1. PDF-specific search for policy/compliance questions
      if (analysis.isPdfQuery) {
        console.log("Using PDF-specific search for policy/compliance query");
        const result = await this.pdfSearch(queryEmbedding, maxResults);
        if (result.count > 0) {
          return { ...result, topic: 'pdf_policy' };
        }
        console.log("No PDF results, falling back to comprehensive search");
      }
      
      // 2. Topic-specific search when topic is clearly identified
      if (analysis.detectedTopic) {
        console.log(`Using topic-specific search for: ${analysis.detectedTopic}`);
        const result = await this.topicSearch(queryEmbedding, analysis.detectedTopic, maxResults);
        if (result.count > 0) {
          return result;
        }
        console.log("No topic results, falling back to comprehensive search");
      }
      
      // 3. Operational FAQ search for "how to" questions
      if (analysis.isOperationalFaq && !analysis.isPdfQuery) {
        console.log("Using FAQ-specific search for operational question");
        const result = await this.faqSearch(queryEmbedding, maxResults);
        if (result.count > 0) {
          return { ...result, topic: null };
        }
        console.log("No FAQ results, falling back to comprehensive search");
      }
      
      // 4. Hybrid search for complex queries with exact terms
      if (analysis.isComplexQuery && analysis.hasExactTerms) {
        console.log("Using hybrid search (semantic + keyword)");
        const result = await this.hybridSearch(queryEmbedding, query, maxResults);
        if (result.count > 0) {
          return { ...result, topic: null };
        }
        console.log("No hybrid results, falling back to comprehensive search");
      }
      
      // 5. Comprehensive search (searches ALL content types)
      console.log("Using comprehensive search across all content");
      return await this.comprehensiveSearch(queryEmbedding, maxResults);
      
    } catch (error) {
      console.error("Search routing error:", error);
      // Final fallback to basic search
      console.log("Fallback to basic semantic search");
      const result = await this.basicSearch(queryEmbedding, maxResults);
      return { ...result, topic: null };
    }
  }

  async comprehensiveSearch(queryEmbedding: number[], maxResults: number) {
    // Search across ALL content types with no restrictions
    const { data, error } = await supabase.rpc('jiopay_similarity_search', {
      query_embedding: queryEmbedding,
      match_count: maxResults,
      min_similarity: 0.2  // Lower threshold for broader search
    });

    if (error) throw error;

    return {
      searchType: 'comprehensive',
      results: data || [],
      count: data?.length || 0,
      topic: null
    };
  }

  async pdfSearch(queryEmbedding: number[], maxResults: number): Promise<SearchResult> {
    // Search specifically in PDF content
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.3,
      match_count: maxResults
    });

    if (!error && data) {
      // Filter PDF content from the results
      const pdfResults = data.filter((item: DatabaseChunk & { is_pdf: boolean }) => item.is_pdf === true);
      return {
        searchType: 'pdf_specific',
        results: pdfResults || [],
        count: pdfResults?.length || 0
      };
    }

    if (error) {
      // Fallback if RPC doesn't exist
      console.log("📄 Using fallback PDF search");
      const { data: fallbackData } = await supabase
        .from('jiopay_chunks')
        .select('*')
        .eq('is_pdf', true)
        .limit(maxResults);
      
      return {
        searchType: 'pdf_fallback',
        results: fallbackData || [],
        count: fallbackData?.length || 0
      };
    }

    return {
      searchType: 'pdf_specific',
      results: data || [],
      count: data?.length || 0
    };
  }

  async basicSearch(queryEmbedding: number[], maxResults: number) {
    const { data, error } = await supabase.rpc('jiopay_similarity_search', {
      query_embedding: queryEmbedding,
      match_count: maxResults,
      min_similarity: 0.3
    });

    if (error) throw error;

    return {
      searchType: 'basic_semantic',
      results: data || [],
      count: data?.length || 0
    };
  }

  async faqSearch(queryEmbedding: number[], maxResults: number) {
    // Try FAQ-specific search first
    const { data, error } = await supabase.rpc('jiopay_faq_search', {
      query_embedding: queryEmbedding,
      match_count: maxResults,
      min_similarity: 0.4
    });

    if (error) {
      // Fallback to filtering FAQ content
      console.log("Using fallback FAQ search");
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('jiopay_chunks')
        .select('*')
        .eq('is_faq', true)
        .limit(maxResults);
      
      if (fallbackError) throw fallbackError;
      
      return {
        searchType: 'faq_fallback',
        results: fallbackData || [],
        count: fallbackData?.length || 0
      };
    }

    return {
      searchType: 'faq_specific',
      results: data || [],
      count: data?.length || 0
    };
  }

  async topicSearch(queryEmbedding: number[], topic: string, maxResults: number) {
    const { data, error } = await supabase.rpc('jiopay_topic_search', {
      query_embedding: queryEmbedding,
      target_topic: topic,
      match_count: maxResults
    });

    if (error) throw error;

    return {
      searchType: 'topic_specific',
      topic: topic,
      results: data || [],
      count: data?.length || 0
    };
  }

  async hybridSearch(queryEmbedding: number[], queryText: string, maxResults: number) {
    const { data, error } = await supabase.rpc('jiopay_hybrid_search', {
      query_embedding: queryEmbedding,
      query_text: queryText,
      match_count: maxResults,
      semantic_weight: 0.7,
      keyword_weight: 0.3
    });

    if (error) throw error;

    return {
      searchType: 'hybrid',
      results: data || [],
      count: data?.length || 0
    };
  }
}

// Initialize search router
const searchRouter = new JioPayRAGSearchRouter();

function buildJioPayContext(chunks: DatabaseChunk[]): string {
  if (!chunks || chunks.length === 0) return "";

  return chunks
    .map((chunk: DatabaseChunk, i: number) => {
      const sourceType = chunk.source_type || 'unknown';
      const topic = chunk.topic || 'general';
      
      // Enhanced formatting for better context
      if (sourceType.includes('faq')) {
        return `[${i + 1}] FAQ (Topic: ${topic}): ${chunk.content}`;
      } else if (sourceType.includes('pdf')) {
        return `[${i + 1}] Policy Document: ${chunk.content}`;
      } else if (sourceType.includes('web')) {
        return `[${i + 1}] Web Information: ${chunk.content}`;
      } else {
        return `[${i + 1}] ${sourceType}: ${chunk.content}`;
      }
    })
    .join("\n\n");
}

// Create a global pipeline instance (initialize once)
let extractor: FeatureExtractionPipeline | null = null;

async function initializeExtractor() {
  if (!extractor) {
    console.log("🔧 Initializing local sentence transformer pipeline...");
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      // revision: 'main',
      // cache_dir: '/tmp/transformers_cache' // Use tmp directory in serverless
      revision: 'main',
    });
    console.log("Pipeline initialized successfully");
  }
  return extractor;
}

// Replace your current getQueryEmbedding function with this:
async function getQueryEmbedding(input: string): Promise<number[]> {
  try {
    console.log("Generating embedding for:", input);
    
    // Initialize the pipeline if not already done
    const pipeline = await initializeExtractor();
    
    // Generate embedding using local transformer
    const output = await pipeline(input, { 
      pooling: 'mean', 
      normalize: true 
    });
    
    // Convert tensor to array
    // const embedding = Array.from(output.data as Float32Array);
    // Convert tensor to array - Edge runtime compatible
    const embedding = Array.from(output.data);
    
    console.log("Local embedding generated successfully");
    console.log("Embedding dimension:", embedding.length);
    
    return embedding;

  } catch (error) {
    console.error("Local embedding generation failed:", error);
    
    // Fallback to Hugging Face API
    try {
      console.log("🔄 Trying fallback to Hugging Face API...");
      const response = await fetch(
        "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            inputs: input,
            options: {
              wait_for_model: true,
              use_cache: true
            }
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HF API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      if (Array.isArray(result) && result.length > 0) {
        const embedding = Array.isArray(result[0]) ? result[0] : result;
        console.log("Fallback API embedding successful");
        return embedding;
      } else {
        throw new Error("Unexpected API response format");
      }

    } catch (apiError) {
      console.error("API fallback also failed:", apiError);
      
      // Final fallback to local service if running
      try {
        console.log("Trying final fallback to local service...");
        const fallbackResponse = await fetch('http://localhost:5000/embed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: input }),
          signal: AbortSignal.timeout(5000)
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log("Local service fallback successful");
          return fallbackData.embedding;
        }
      } catch {
        console.log("All embedding methods failed");
      }
      
      throw error;
    }
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = (body?.message ?? "").toString().trim();

    if (!message) {
      return new Response(JSON.stringify({ 
        error: "Please enter a question about JioPay Business" 
      }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }

    console.log(`🔍 JioPay Query: "${message}"`);

    // 1. Generate query embedding using your MiniLM-L6-v2 service
    const queryEmbedding = await getQueryEmbedding(message);

    // 2. Use improved intelligent search routing
    const searchResult = await searchRouter.routeSearch(message, queryEmbedding, 8);

    console.log(`📊 Search Result: ${searchResult.searchType}, Found: ${searchResult.count} chunks`);

    // 3. Build JioPay-specific context
    const context = buildJioPayContext(searchResult.results);

    // If no relevant information found
    if (!context || searchResult.count === 0) {
      return new Response(JSON.stringify({
        answer: "I couldn't find specific information about that in the JioPay Business documentation. Please try rephrasing your question or check our support resources.",
        sources: [],
        searchType: searchResult.searchType
      }), { 
        status: 200, 
        headers: { "content-type": "application/json" }
      });
    }

    // 4. Generate response using Gemini 2.5 Flash
    const prompt = `You are a JioPay Business customer support assistant. Answer questions ONLY using the provided CONTEXT about JioPay Business services, features, and policies.

IMPORTANT GUIDELINES:
- Answer ONLY based on the provided context
- If information is not in the context, say: "I don't have specific information about that in my knowledge base"
- Cite sources using [1], [2], etc. format
- Be helpful and professional
- Focus on JioPay Business merchant needs
- If context contains step-by-step instructions, present them clearly
- For policy questions, provide accurate details from official documents

QUESTION: ${message}

CONTEXT:
${context}

Please provide a helpful answer based only on the above context:`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    // 5. Prepare source information for transparency
    const sources = searchResult.results.map((chunk: DatabaseChunk, i: number) => ({
      id: i + 1,
      content: chunk.content,
      source_type: chunk.source_type,
      topic: chunk.topic,
      similarity: chunk.similarity
    }));

    return new Response(JSON.stringify({
      answer,
      sources,
      searchType: searchResult.searchType,
      searchTopic: searchResult.topic || null,
      totalSources: searchResult.count
    }), { 
      status: 200, 
      headers: { "content-type": "application/json" }
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("❌ JioPay RAG API error:", errorMessage);
    console.log("❌ JioPay RAG API error:", errorMessage);
    
    return new Response(JSON.stringify({ 
      error: "I'm experiencing technical difficulties. Please try again.",
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
}
