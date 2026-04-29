const fetch = require('node-fetch');
const cheerio = require('cheerio');
const crypto = require('crypto');

/**
 * Extract legal text from a webpage
 * Uses multiple strategies:
 * 1. Try to find terms/privacy specific sections by common selectors
 * 2. Fall back to readability-style extraction (main content area)
 * 3. Last resort: extract all text from body
 */
async function extractLegalText(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
      timeout: 30000,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const rawHash = crypto.createHash('sha256').update(html).digest('hex');
    
    const $ = cheerio.load(html);
    
    // Remove script, style, nav, footer, ads
    $('script, style, nav, footer, iframe, aside, .advertisement, .ads, .cookie-banner, .newsletter').remove();
    
    // Strategy 1: Look for common legal content selectors
    const legalSelectors = [
      '[class*="terms"]',
      '[class*="privacy"]',
      '[class*="legal"]',
      '[class*="policy"]',
      '[id*="terms"]',
      '[id*="privacy"]',
      '[id*="legal"]',
      '[id*="policy"]',
      'main',
      'article',
      '.content',
      '#content',
      '[role="main"]',
    ];
    
    let extractedText = '';
    
    for (const selector of legalSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        const text = element.text().trim();
        if (text.length > extractedText.length && text.length > 500) {
          extractedText = text;
        }
      }
    }
    
    // Strategy 2: If nothing found, use body text
    if (!extractedText || extractedText.length < 500) {
      extractedText = $('body').text().trim();
    }
    
    // Clean up the text
    extractedText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();
    
    // Generate hash of extracted text
    const hash = crypto.createHash('sha256').update(extractedText).digest('hex');
    
    return {
      success: true,
      text: extractedText,
      hash,
      rawHash,
      length: extractedText.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function checkPageHead(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 15000,
    });
    
    return {
      success: response.ok,
      status: response.status,
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag'),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = { extractLegalText, checkPageHead };