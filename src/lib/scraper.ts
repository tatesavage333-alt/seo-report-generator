import * as cheerio from 'cheerio';
import { ScrapedMetadata } from '@/types';

export class WebScraper {
  private static readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  private static readonly TIMEOUT = 10000; // 10 seconds

  static async scrapeUrl(url: string): Promise<ScrapedMetadata> {
    try {
      // Validate URL
      const validUrl = this.validateAndNormalizeUrl(url);
      
      // Fetch the HTML content
      const response = await fetch(validUrl, {
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
        },
        signal: AbortSignal.timeout(this.TIMEOUT),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      
      // Parse HTML with Cheerio
      const $ = cheerio.load(html);
      
      return this.extractMetadata($, validUrl);
    } catch (error) {
      console.error('Error scraping URL:', error);
      throw new Error(`Failed to scrape URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static validateAndNormalizeUrl(url: string): string {
    try {
      // Add protocol if missing
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      const urlObj = new URL(url);
      return urlObj.toString();
    } catch (error) {
      throw new Error('Invalid URL format');
    }
  }

  private static extractMetadata($: cheerio.CheerioAPI, url: string): ScrapedMetadata {
    // Extract title
    const title = $('title').first().text().trim() || 
                  $('meta[property="og:title"]').attr('content') || 
                  $('meta[name="twitter:title"]').attr('content') || 
                  undefined;

    // Extract meta description
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || 
                       $('meta[name="twitter:description"]').attr('content') || 
                       undefined;

    // Extract meta keywords
    const keywords = $('meta[name="keywords"]').attr('content') || undefined;

    // Extract headings
    const headings = {
      h1: this.extractHeadings($, 'h1'),
      h2: this.extractHeadings($, 'h2'),
      h3: this.extractHeadings($, 'h3'),
      h4: this.extractHeadings($, 'h4'),
      h5: this.extractHeadings($, 'h5'),
      h6: this.extractHeadings($, 'h6'),
    };

    // Extract all meta tags
    const metaTags: Record<string, string> = {};
    $('meta').each((_, element) => {
      const $meta = $(element);
      const name = $meta.attr('name') || $meta.attr('property') || $meta.attr('http-equiv');
      const content = $meta.attr('content');
      
      if (name && content) {
        metaTags[name] = content;
      }
    });

    return {
      title,
      description,
      keywords,
      headings,
      metaTags,
      url,
    };
  }

  private static extractHeadings($: cheerio.CheerioAPI, tag: string): string[] {
    const headings: string[] = [];
    $(tag).each((_, element) => {
      const text = $(element).text().trim();
      if (text) {
        headings.push(text);
      }
    });
    return headings;
  }
}
