import OpenAI from 'openai';
import { ScrapedMetadata, SeoAnalysis } from '@/types';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSeoAnalysis(metadata: ScrapedMetadata): Promise<string> {
  try {
    const prompt = createSeoAnalysisPrompt(metadata);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert SEO consultant with deep knowledge of search engine optimization best practices, technical SEO, content optimization, and user experience. Provide detailed, actionable SEO recommendations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent, factual responses
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return response;
  } catch (error) {
    console.error('Error generating SEO analysis:', error);
    throw new Error(`Failed to generate SEO analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function createSeoAnalysisPrompt(metadata: ScrapedMetadata): string {
  const { title, description, keywords, headings, metaTags, url } = metadata;
  
  // Calculate basic metrics
  const titleLength = title?.length || 0;
  const descriptionLength = description?.length || 0;
  const hasH1 = headings.h1.length > 0;
  const h1Count = headings.h1.length;
  
  return `Please analyze the following webpage for SEO optimization and provide detailed recommendations:

**URL:** ${url}

**Current SEO Elements:**
- **Title:** ${title || 'MISSING'}
  - Length: ${titleLength} characters
- **Meta Description:** ${description || 'MISSING'}
  - Length: ${descriptionLength} characters
- **Meta Keywords:** ${keywords || 'MISSING'}
- **H1 Headings:** ${hasH1 ? headings.h1.join(', ') : 'MISSING'}
  - Count: ${h1Count}
- **H2 Headings:** ${headings.h2.length > 0 ? headings.h2.slice(0, 5).join(', ') + (headings.h2.length > 5 ? '...' : '') : 'None'}
- **H3 Headings:** ${headings.h3.length > 0 ? headings.h3.slice(0, 3).join(', ') + (headings.h3.length > 3 ? '...' : '') : 'None'}

**Additional Meta Tags:**
${Object.entries(metaTags).slice(0, 10).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

**Please provide a comprehensive SEO analysis including:**

1. **Critical Issues** (High Priority)
   - List any major SEO problems that need immediate attention

2. **Title Tag Analysis**
   - Evaluate the current title tag effectiveness
   - Suggest improvements for better click-through rates and rankings

3. **Meta Description Analysis**
   - Assess the meta description quality and length
   - Provide recommendations for improvement

4. **Content Structure Analysis**
   - Evaluate heading hierarchy and structure
   - Suggest improvements for better content organization

5. **Technical SEO Recommendations**
   - Identify missing or problematic meta tags
   - Suggest additional technical improvements

6. **Content Optimization Suggestions**
   - Recommend keyword optimization strategies
   - Suggest content improvements for better user engagement

7. **Overall SEO Score**
   - Provide a score out of 100 based on current optimization level
   - Explain the scoring rationale

Please format your response in clear sections with actionable recommendations. Focus on practical, implementable suggestions that will have the most impact on search engine rankings and user experience.`;
}

export default openai;
