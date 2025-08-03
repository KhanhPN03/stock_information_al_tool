import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import { StockData } from '../types';

export class HNXScrapingService {
  private browser: Browser | null = null;
  private readonly hnxUrl = 'https://www.hnx.vn/co-phieu-etfs/chung-khoan-uc-thong-tin-ck.html';

  async initBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async scrapeRestrictedStocks(): Promise<StockData[]> {
    try {
      await this.initBrowser();
      if (!this.browser) throw new Error('Failed to initialize browser');

      const page = await this.browser.newPage();
      
      // Set user agent to avoid blocking
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Set viewport
      await page.setViewport({ width: 1366, height: 768 });

      console.log(`Navigating to HNX restricted stocks page: ${this.hnxUrl}`);
      await page.goto(this.hnxUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for the table to load
      await page.waitForSelector('table', { timeout: 10000 });

      const html = await page.content();
      const stocks = this.parseHNXData(html);

      await page.close();
      return stocks;
    } catch (error) {
      console.error('Error scraping HNX data:', error);
      throw error;
    }
  }

  private parseHNXData(html: string): StockData[] {
    const $ = cheerio.load(html);
    const stocks: StockData[] = [];

    // Look for tables containing stock data
    $('table').each((index, table) => {
      const $table = $(table);
      
      // Look for table headers to identify the correct table
      const headers = $table.find('thead tr th, tbody tr:first-child td').map((i, el) => $(el).text().trim()).get();
      
      // Check if this table contains stock information
      if (this.isStockTable(headers)) {
        $table.find('tbody tr').each((rowIndex, row) => {
          if (rowIndex === 0 && this.isHeaderRow($(row))) return; // Skip header row
          
          const $row = $(row);
          const cells = $row.find('td').map((i, cell) => $(cell).text().trim()).get();
          
          if (cells.length >= 3) {
            const stock = this.parseStockRow(cells);
            if (stock) {
              stocks.push(stock);
            }
          }
        });
      }
    });

    // If no tables found, try alternative selectors
    if (stocks.length === 0) {
      console.log('No stock table found, trying alternative parsing...');
      stocks.push(...this.parseAlternativeFormat(html));
    }

    return stocks;
  }

  private isStockTable(headers: string[]): boolean {
    const stockTableKeywords = ['mã', 'tên', 'công ty', 'symbol', 'stock', 'chứng khoán'];
    return headers.some(header => 
      stockTableKeywords.some(keyword => 
        header.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }

  private isHeaderRow($row: cheerio.Cheerio<any>): boolean {
    const text = $row.text().toLowerCase();
    return text.includes('mã') || text.includes('tên') || text.includes('symbol');
  }

  private parseStockRow(cells: string[]): StockData | null {
    try {
      // Basic validation
      if (cells.length < 2) return null;
      
      // Extract symbol and name (adjust indices based on actual table structure)
      const symbol = this.extractStockSymbol(cells[0]);
      const name = cells[1] || '';
      
      if (!symbol || symbol.length < 2) return null;

      return {
        symbol: symbol.toUpperCase(),
        name: name,
        status: 'restricted', // Default status for HNX restricted page
        exchange: 'HNX',
        lastUpdated: new Date(),
        restrictionReason: cells.length > 2 ? cells[2] : 'Restricted trading',
        restrictionDate: new Date()
      };
    } catch (error) {
      console.error('Error parsing stock row:', error);
      return null;
    }
  }

  private extractStockSymbol(text: string): string {
    // Remove common prefixes and clean the symbol
    return text.replace(/[^\w]/g, '').toUpperCase();
  }

  private parseAlternativeFormat(html: string): StockData[] {
    const $ = cheerio.load(html);
    const stocks: StockData[] = [];

    // Try to find stock codes in various formats
    const stockPattern = /\b[A-Z]{3,4}\b/g;
    const text = $.text();
    const matches = text.match(stockPattern);

    if (matches) {
      const uniqueSymbols = [...new Set(matches)];
      uniqueSymbols.forEach(symbol => {
        if (symbol.length >= 3 && symbol.length <= 4) {
          stocks.push({
            symbol: symbol,
            name: `Company ${symbol}`,
            status: 'restricted',
            exchange: 'HNX',
            lastUpdated: new Date(),
            restrictionReason: 'Trading restriction detected',
            restrictionDate: new Date()
          });
        }
      });
    }

    return stocks;
  }

  async getStockDetails(symbol: string): Promise<Partial<StockData> | null> {
    try {
      await this.initBrowser();
      if (!this.browser) throw new Error('Failed to initialize browser');

      const page = await this.browser.newPage();
      
      // Search for specific stock information
      const searchUrl = `https://www.hnx.vn/co-phieu-etfs/thong-tin-co-phieu.html?symbol=${symbol}`;
      
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 15000 });
      
      const html = await page.content();
      const $ = cheerio.load(html);
      
      // Extract stock details (implement based on actual page structure)
      const details: Partial<StockData> = {
        symbol: symbol.toUpperCase(),
        lastUpdated: new Date()
      };

      await page.close();
      return details;
    } catch (error) {
      console.error(`Error getting details for stock ${symbol}:`, error);
      return null;
    }
  }
}