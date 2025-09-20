# Data Sources Card 

This document provides detailed information about the data sources, collection methods, and processing pipeline used in the JioPay Business RAG Chatbot project.

## Overview

The JioPay Business RAG Chatbot is built on a comprehensive knowledge base derived from official JioPay Business documentation, FAQs, and policy documents. All data sources are publicly available and have been collected for educational and research purposes.

## Web Data Sources

### Primary Website Sources

**Base Domain**: `https://www.jiopay.com/business/`
**Collection Date**: September 2025
**Collection Method**: Automated web scraping using Python (requests/playwright)

### Scraped URLs (25 total)

#### Core Business Information

- `https://www.jiopay.com/business/` - Main business homepage
- `https://www.jiopay.com/business/about-us` - Company information
- `https://www.jiopay.com/business/contact` - Contact details

#### Payment Gateway Services

- `https://www.jiopay.com/business/paymentgateway` - Main payment gateway
- `https://www.jiopay.com/business/paymentgateway/direct` - Direct payment API
- `https://www.jiopay.com/business/paymentgateway/checkout` - Checkout solutions
- `https://www.jiopay.com/business/paymentgateway/vault` - Payment vault service
- `https://www.jiopay.com/business/paymentgateway/collect` - Collect links
- `https://www.jiopay.com/business/paymentgateway/repeat` - Recurring payments
- `https://www.jiopay.com/business/paymentgateway/campaign` - Payment campaigns
- `https://www.jiopay.com/business/paymentgateway/console` - Management console
- `https://www.jiopay.com/business/paymentgateway/1qr` - QR code solutions

#### Additional Services

- `https://www.jiopay.com/business/voicebox` - Voice notification service
- `https://www.jiopay.com/business/increase-conversion` - Conversion optimization
- `https://www.jiopay.com/business/widen-presence` - Business expansion
- `https://www.jiopay.com/business/mitigate-risk` - Risk management
- `https://www.jiopay.com/business/simplified-experience` - User experience

#### Support & Policies

- `https://www.jiopay.com/business/complaint-resolution-escalation-matrix` - Support escalation
- `https://www.jiopay.com/business/pointofsale` - POS solutions
- `https://www.jiopay.com/business/upi` - UPI services
- `https://www.jiopay.com/business/biller` - Biller services

#### Legal & Compliance

- `https://www.jiopay.com/business/privacy-policy` - Privacy policy
- `https://www.jiopay.com/business/terms-conditions` - Terms and conditions
- `https://www.jiopay.com/business/on-boarding-and-kyc-policy` - KYC policy
- `https://www.jiopay.com/business/billpay-terms-conditions` - Bill payment terms

## Document Sources

### PDF Documents

**Location**: `scraped_data/`

1. **Grievance-Redressal-Policy.pdf**

   - **Type**: Policy document
   - **Content**: Customer complaint resolution procedures
   - **Pages**: Multiple pages of official policy
   - **Language**: English
2. **list_of_documents_for_sole_proprietorship_and-entity.pdf**

   - **Type**: Documentation requirements
   - **Content**: KYC document requirements for different business types
   - **Format**: Structured list with requirements
   - **Language**: English
3. **restricted_business_list.pdf**

   - **Type**: Compliance document
   - **Content**: List of restricted business categories
   - **Format**: Categorized business restrictions
   - **Language**: English

### JSON Data Files

**Location**: `scraped_data/`

1. **jiopay_faq_data_final.json**

   - **Type**: FAQ collection
   - **Content**: Frequently asked questions and answers
   - **Structure**: Question-answer pairs with categories
   - **Topics**: General JioPay operations, troubleshooting
2. **partner_faq_data.json**

   - **Type**: Partner-specific FAQ
   - **Content**: Partner program questions and procedures
   - **Structure**: Structured FAQ format
   - **Topics**: Partner onboarding, commissions, support
3. **scraped_data_playwright.json**

   - **Type**: Web content (Playwright scraping)
   - **Content**: Structured web page content
   - **Format**: JSON with page metadata and content
   - **Source**: Automated browser scraping
4. **scraped_data_requests.json**

   - **Type**: Web content (Requests scraping)
   - **Content**: HTTP scraped web content
   - **Format**: JSON with URLs and content
   - **Source**: Direct HTTP requests

## Data Processing Pipeline

### 1. Data Collection

- **Web Scraping**: Python scripts using requests and playwright
- **PDF Processing**: Automated text extraction
- **FAQ Curation**: Manual verification and cleaning

### 2. Text Processing

- **Cleaning**: Removal of HTML tags, special characters
- **Normalization**: Consistent formatting and structure
- **Validation**: Content quality checks

### 3. Chunking Strategies

**Location**: `chunked_data/`

#### Fixed-Size Chunking

- **1024 tokens**: With 0, 64, 128 overlap
- **512 tokens**: With 0, 64, 128 overlap
- **256 tokens**: With 0, 64, 128 overlap

#### Advanced Chunking

- **Semantic Chunking**: Content-aware boundaries
- **Structural Chunking**: Document structure-based
- **LLM-based Chunking**: AI-guided segmentation
- **Recursive Chunking**: Hierarchical text splitting

### 4. Embedding Generation

**Location**: `embeddings_data/`

#### Models Used

- **BGE Large**: `BAAI/bge-large-en-v1.5`
- **E5 Large**: `intfloat/e5-large-v2`
- **MiniLM**: `sentence-transformers/all-MiniLM-L6-v2`

#### Files Generated

- **Embedding Vectors**: `.pkl` files with numpy arrays
- **Metadata**: `.json` files with chunk information
- **Mappings**: Chunk-to-embedding relationships

## Data Statistics

### Content Distribution

- **Web Pages**: 25 URLs scraped
- **PDF Documents**: 3 policy documents
- **FAQ Items**: 100+ question-answer pairs
- **Total Chunks**: 1000+ processed text segments

### Processing Variants

- **Chunking Methods**: 7 different strategies
- **Embedding Models**: 3 different models
- **Overlap Configurations**: Multiple overlap settings

### Data Quality

- **Language**: English
- **Domain**: Financial services, payments
- **Completeness**: Comprehensive JioPay business coverage
- **Currency**: Updated September 2025

## Data Usage & Ethics

### Usage Rights

- **Public Sources**: All scraped content is publicly available
- **Fair Use**: Educational and research purposes
- **Attribution**: JioPay Business as original content owner

### Privacy Considerations

- **No Personal Data**: Only public business information collected
- **No User Data**: No customer or transaction data included
- **Compliance**: Follows web scraping best practices

### Data Limitations

- **Temporal**: Snapshot from September 2025
- **Scope**: Limited to public JioPay Business content
- **Language**: English language content only

## Technical Implementation

### Collection Scripts

**Location**: `scraper_files/`

- `jiopay_general_data_scraper.py` - Main web scraper
- `faq_scraper.py` - FAQ-specific collection
- `scraper_partner_faq.py` - Partner content scraper

### Processing Notebooks

- `Full_Workflow.ipynb` - Complete data processing pipeline

### Analysis Results

**Location**: `chunked_data/analysis_results/`

- `chunking_comparison.csv` - Performance analysis of different chunking strategies

## Data Versioning

### Current Version: v1.0

- **Collection Date**: September 2025
- **Last Updated**: September 20, 2025
- **Status**: Production ready

### Future Updates

- Automated refresh mechanisms planned
- Incremental update capabilities
- Version tracking for data changes

## Data Sources Acknowledgment

- **JioPay Business**: Original content provider
- **Public Documentation**: Freely available business information
- **Open Source Tools**: Python ecosystem for data processing
- **Community Models**: Hugging Face transformers and embeddings

## Contact & Attribution

For questions about data sources, processing methods, or usage rights:

**Project Repository**: [github.com/HarVkr/jiopay-rag-chatbot](https://github.com/HarVkr/jiopay-rag-chatbot)
**Author**: HarVkr
**License**: MIT License
**Data Attribution**: JioPay Business (original content)

---

*This data card is maintained as part of the JioPay Business RAG Chatbot project and is updated with each significant data collection or processing cycle.*
