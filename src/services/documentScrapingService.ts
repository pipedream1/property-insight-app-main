
interface ScrapedDocument {
  title: string;
  url: string;
  type: string;
  description?: string;
}

export class DocumentScrapingService {
  static async scrapeDocuments(websiteUrl: string): Promise<ScrapedDocument[]> {
    try {
      console.log('Scraping documents from:', websiteUrl);
      
      // Use a CORS proxy to fetch the website content
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(websiteUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch website: ${response.statusText}`);
      }
      
      const data = await response.json();
      const htmlContent = data.contents;
      
      // Parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // Extract document links (looking for PDF, DOC, DOCX files)
      const links = doc.querySelectorAll('a[href]');
      const documents: ScrapedDocument[] = [];
      
      links.forEach((link) => {
        const href = link.getAttribute('href');
        const text = link.textContent?.trim() || '';
        
        if (href && this.isDocumentLink(href)) {
          const fullUrl = this.resolveUrl(href, websiteUrl);
          const fileExtension = this.getFileExtension(href);
          
          documents.push({
            title: text || this.getFilenameFromUrl(href),
            url: fullUrl,
            type: fileExtension,
            description: this.generateDescription(text, fileExtension)
          });
        }
      });
      
      console.log(`Found ${documents.length} documents`);
      return documents;
      
    } catch (error) {
      console.error('Error scraping documents:', error);
      throw new Error(`Failed to scrape documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private static isDocumentLink(href: string): boolean {
    const documentExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
    return documentExtensions.some(ext => href.toLowerCase().includes(ext));
  }
  
  private static getFileExtension(url: string): string {
    const match = url.toLowerCase().match(/\.([a-z0-9]+)(?:\?|$)/);
    return match ? match[1] : 'unknown';
  }
  
  private static resolveUrl(href: string, baseUrl: string): string {
    if (href.startsWith('http')) {
      return href;
    }
    
    const base = new URL(baseUrl);
    if (href.startsWith('/')) {
      return `${base.protocol}//${base.host}${href}`;
    }
    
    return new URL(href, baseUrl).toString();
  }
  
  private static getFilenameFromUrl(url: string): string {
    const pathname = new URL(url).pathname;
    return pathname.split('/').pop() || 'Unknown Document';
  }
  
  private static generateDescription(text: string, fileType: string): string {
    if (text && text.length > 10) {
      return `${text} (${fileType.toUpperCase()} document)`;
    }
    return `Official ${fileType.toUpperCase()} document from Knysna Municipality`;
  }
}
