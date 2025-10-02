# Mini SEO Report Generator

A comprehensive SEO analysis tool that fetches website metadata, analyzes page content, and provides AI-powered SEO improvement recommendations. Built with Next.js, TypeScript, Cheerio for web scraping, and OpenAI for intelligent insights.

https://github.com/user-attachments/assets/c0d18827-f3df-4ec5-aded-627cdb132636


## Features

### Core Functionality
- **Website Analysis**: Enter any URL to fetch and analyze website metadata
- **Metadata Extraction**: Automatically extracts title tags, meta descriptions, headers, and more
- **AI-Powered SEO Feedback**: Get intelligent recommendations using OpenAI GPT-3.5 Turbo
- **Report Storage**: Save all SEO reports to a database for future reference
- **Historical Tracking**: Compare reports over time to track SEO improvements

### Bonus Features
- **Basic SEO Checks**: Automated validation of title length, missing descriptions, and common issues
- **Historical Comparison**: Save and compare reports to track SEO progress over time
- **Export Options**: Export reports to Markdown or PDF format
- **Bulk Analysis**: Analyze multiple URLs in batch mode
- **SEO Score**: Comprehensive scoring system based on multiple factors

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Web Scraping**: Cheerio for HTML parsing and metadata extraction
- **Database**: SQLite with Prisma ORM
- **AI Integration**: OpenAI GPT-3.5 Turbo
- **Icons**: Lucide React
- **Styling**: Tailwind CSS v4

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd seo-report-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL="file:./dev.db"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Analyzing a Website

1. **Enter URL**: Input the website URL you want to analyze
2. **Start Analysis**: Click "Analyze Website" to begin the SEO audit
3. **View Results**: Review the comprehensive SEO report including:
   - Page title and meta description analysis
   - Header structure (H1, H2, H3, etc.)
   - Image alt text analysis
   - Internal/external link analysis
   - AI-powered improvement recommendations
4. **Save Report**: Reports are automatically saved to your database
5. **Export**: Download reports as Markdown or PDF files

### Managing Reports

1. **View History**: Access all previously generated reports
2. **Compare Reports**: Track SEO improvements over time
3. **Search & Filter**: Find specific reports by URL or date
4. **Bulk Operations**: Manage multiple reports efficiently

## SEO Analysis Features

### Automated Checks
- **Title Tag**: Length, uniqueness, keyword optimization
- **Meta Description**: Length, compelling copy, call-to-action
- **Header Structure**: Proper H1-H6 hierarchy
- **Image Optimization**: Alt text, file sizes, formats
- **Link Analysis**: Internal linking, external links, anchor text
- **Page Speed Indicators**: Basic performance metrics
- **Mobile Friendliness**: Responsive design indicators

### AI-Powered Insights
- **Content Quality Assessment**: AI analysis of content relevance and quality
- **Keyword Optimization**: Suggestions for better keyword targeting
- **Competitive Analysis**: Insights based on industry best practices
- **Technical SEO**: Recommendations for technical improvements
- **User Experience**: UX factors that impact SEO performance

## API Endpoints

### POST /api/analyze
Analyze a website and generate SEO report

**Request Body:**
```json
{
  "url": "https://example.com",
  "includeAI": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "report-id",
    "url": "https://example.com",
    "title": "Example Website",
    "metaDescription": "Example meta description",
    "seoScore": 85,
    "issues": [...],
    "recommendations": [...],
    "aiInsights": "AI-generated recommendations...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/reports
Retrieve saved SEO reports

**Query Parameters:**
- `url`: Filter by specific URL
- `limit`: Number of results to return
- `offset`: Pagination offset

### GET /api/reports/[id]
Retrieve a specific SEO report

### DELETE /api/reports/[id]
Delete a specific SEO report

### POST /api/reports/[id]/export
Export a report to Markdown or PDF

## Design Notes

### Architecture Decisions

1. **Cheerio for Web Scraping**: Lightweight, server-side HTML parsing without browser overhead
2. **Next.js API Routes**: Unified backend for scraping and AI processing
3. **Component-Based Architecture**:
   - `URLInput`: Website URL input and validation
   - `SEOReport`: Comprehensive report display
   - `ReportHistory`: Historical reports management
   - `ExportOptions`: Report export functionality

4. **Error Handling**: Robust handling of network issues, invalid URLs, and scraping failures
5. **Rate Limiting**: Prevent abuse and respect website robots.txt

### UI/UX Decisions

1. **Professional SEO Tool Aesthetic**: Clean, data-focused design
2. **Progressive Disclosure**: Detailed analysis available on demand
3. **Visual SEO Scoring**: Color-coded scores and progress indicators
4. **Responsive Design**: Works on desktop and mobile devices
5. **Accessibility**: Screen reader friendly with proper ARIA labels

### Performance Considerations

1. **Efficient Scraping**: Optimized Cheerio selectors for fast parsing
2. **Caching**: Cache frequently analyzed websites
3. **Background Processing**: Long-running AI analysis happens asynchronously
4. **Pagination**: Handle large numbers of historical reports efficiently

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts          # Website analysis endpoint
│   │   └── reports/
│   │       ├── route.ts              # Reports CRUD operations
│   │       └── [id]/
│   │           ├── route.ts          # Individual report operations
│   │           └── export/route.ts   # Report export functionality
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main analysis page
├── components/
│   ├── URLInput.tsx                  # Website URL input form
│   ├── SEOReport.tsx                 # SEO report display
│   ├── ReportHistory.tsx             # Historical reports list
│   └── ExportOptions.tsx             # Report export controls
├── lib/
│   ├── scraper.ts                    # Cheerio-based web scraping
│   ├── seo-analyzer.ts               # SEO analysis logic
│   ├── db.ts                         # Prisma client setup
│   └── openai.ts                     # OpenAI integration
└── types/
    └── index.ts                      # TypeScript type definitions
```

## SEO Analysis Methodology

### Technical SEO Checks
1. **HTML Structure**: Valid markup, semantic elements
2. **Meta Tags**: Title, description, keywords, Open Graph
3. **Header Hierarchy**: Proper H1-H6 structure
4. **Image Optimization**: Alt text, file sizes, lazy loading
5. **Link Analysis**: Internal linking, external links, broken links

### Content Analysis
1. **Keyword Density**: Optimal keyword usage
2. **Content Length**: Adequate content depth
3. **Readability**: Content structure and clarity
4. **Duplicate Content**: Identification of duplicate sections

### Performance Indicators
1. **Page Size**: Total page weight analysis
2. **Resource Count**: Number of HTTP requests
3. **Image Optimization**: Unoptimized images identification
4. **External Dependencies**: Third-party resource analysis

## Development Workflow

1. **Scraping Logic**: Update scraping rules in `lib/scraper.ts`
2. **SEO Rules**: Modify analysis criteria in `lib/seo-analyzer.ts`
3. **AI Prompts**: Enhance AI recommendations in `lib/openai.ts`
4. **Database Changes**: Update schema in `prisma/schema.prisma`

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Ensure environment variables are set in production

## Limitations & Future Improvements

### Current Limitations
- Client-side rendering analysis only
- Basic performance metrics
- Limited to publicly accessible websites
- Single-page analysis (no site-wide crawling)

### Potential Improvements
- **Site-wide Crawling**: Analyze entire websites
- **Real-time Monitoring**: Continuous SEO monitoring
- **Competitor Analysis**: Compare against competitor websites
- **Advanced Performance**: Core Web Vitals integration
- **Schema Markup**: Structured data analysis
- **Local SEO**: Location-based optimization checks
- **Multi-language**: International SEO analysis

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing intelligent SEO insights
- Cheerio for excellent HTML parsing capabilities
- Next.js and Vercel for the development platform
- The SEO community for best practices and guidelines
