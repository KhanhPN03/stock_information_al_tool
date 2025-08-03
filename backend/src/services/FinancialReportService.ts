import axios from 'axios';
import * as cheerio from 'cheerio';
import { FinancialData, BoardResolutionData } from '../types';

export class FinancialReportService {
  private readonly userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  async fetchFinancialReports(stockSymbol: string): Promise<FinancialData[]> {
    try {
      console.log(`Fetching financial reports for ${stockSymbol}...`);
      
      // Try multiple sources
      const reports = await Promise.allSettled([
        this.fetchFromVietStock(stockSymbol),
        this.fetchFromFireAnt(stockSymbol),
        this.fetchFromCafeF(stockSymbol)
      ]);

      const successfulReports = reports
        .filter((result): result is PromiseFulfilledResult<FinancialData[]> => result.status === 'fulfilled')
        .flatMap(result => result.value);

      return this.deduplicateReports(successfulReports);
    } catch (error) {
      console.error(`Error fetching financial reports for ${stockSymbol}:`, error);
      return [];
    }
  }

  private async fetchFromVietStock(stockSymbol: string): Promise<FinancialData[]> {
    try {
      const url = `https://finance.vietstock.vn/${stockSymbol}/financials.htm`;
      const response = await axios.get(url, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      const reports: FinancialData[] = [];

      // Parse VietStock financial data structure
      $('.financialreport table tr').each((index, row) => {
        const $row = $(row);
        const cells = $row.find('td').map((i, cell) => $(cell).text().trim()).get();
        
        if (cells.length >= 4 && cells[0] && cells[0].match(/\d{4}/)) {
          const year = parseInt(cells[0]);
          const quarter = this.extractQuarter(cells[1]);
          
          reports.push({
            stockSymbol: stockSymbol.toUpperCase(),
            reportType: quarter ? 'quarterly' : 'annual',
            year,
            quarter,
            revenue: this.parseNumber(cells[2]),
            profit: this.parseNumber(cells[3]),
            reportUrl: url,
            publishDate: new Date()
          });
        }
      });

      return reports;
    } catch (error) {
      console.error(`VietStock fetch error for ${stockSymbol}:`, error);
      return [];
    }
  }

  private async fetchFromFireAnt(stockSymbol: string): Promise<FinancialData[]> {
    try {
      const url = `https://fireant.vn/company/${stockSymbol}/financials`;
      const response = await axios.get(url, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 15000
      });

      // FireAnt often uses dynamic loading, this is a simplified parser
      const reports: FinancialData[] = [];
      
      // Add basic parsing logic for FireAnt structure
      // This would need to be adapted based on actual FireAnt API/structure
      
      return reports;
    } catch (error) {
      console.error(`FireAnt fetch error for ${stockSymbol}:`, error);
      return [];
    }
  }

  private async fetchFromCafeF(stockSymbol: string): Promise<FinancialData[]> {
    try {
      const url = `https://s.cafef.vn/bao-cao-tai-chinh/${stockSymbol}/IncSta/2024/0/0/0/ket-qua-kinh-doanh-cong-ty-co-phan.chn`;
      const response = await axios.get(url, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      const reports: FinancialData[] = [];

      // Parse CafeF structure
      $('#tableContent table tr').each((index, row) => {
        const $row = $(row);
        const cells = $row.find('td').map((i, cell) => $(cell).text().trim()).get();
        
        if (cells.length >= 3 && cells[0] && !cells[0].includes('Chỉ tiêu')) {
          // Parse CafeF specific structure
          reports.push({
            stockSymbol: stockSymbol.toUpperCase(),
            reportType: 'annual',
            year: new Date().getFullYear(),
            revenue: this.parseNumber(cells[1]),
            profit: this.parseNumber(cells[2]),
            reportUrl: url,
            publishDate: new Date()
          });
        }
      });

      return reports;
    } catch (error) {
      console.error(`CafeF fetch error for ${stockSymbol}:`, error);
      return [];
    }
  }

  async fetchBoardResolutions(stockSymbol: string): Promise<BoardResolutionData[]> {
    try {
      const resolutions: BoardResolutionData[] = [];
      
      // Fetch from company investor relations pages
      const sources = [
        `https://finance.vietstock.vn/${stockSymbol}/overview.htm`,
        `https://fireant.vn/company/${stockSymbol}/events`,
        // Add more sources as needed
      ];

      for (const url of sources) {
        try {
          const response = await axios.get(url, {
            headers: { 'User-Agent': this.userAgent },
            timeout: 15000
          });

          const $ = cheerio.load(response.data);
          
          // Parse resolutions based on each site's structure
          $('.news-item, .event-item, .resolution-item').each((index, item) => {
            const $item = $(item);
            const title = $item.find('.title, h3, .event-title').text().trim();
            const content = $item.find('.content, .description').text().trim();
            const dateText = $item.find('.date, .time').text().trim();
            
            if (title && title.toLowerCase().includes('nghị quyết')) {
              resolutions.push({
                stockSymbol: stockSymbol.toUpperCase(),
                title,
                content: content || title,
                resolutionDate: this.parseDate(dateText) || new Date(),
                documentUrl: url,
                source: new URL(url).hostname
              });
            }
          });
        } catch (error) {
          console.error(`Error fetching from ${url}:`, error);
        }
      }

      return resolutions;
    } catch (error) {
      console.error(`Error fetching board resolutions for ${stockSymbol}:`, error);
      return [];
    }
  }

  private extractQuarter(text: string): number | undefined {
    const match = text.match(/Q(\d)/i);
    return match ? parseInt(match[1]) : undefined;
  }

  private parseNumber(text: string): number | undefined {
    if (!text) return undefined;
    
    // Remove non-numeric characters except decimal point and negative sign
    const cleaned = text.replace(/[^\d.-]/g, '');
    const number = parseFloat(cleaned);
    
    return isNaN(number) ? undefined : number;
  }

  private parseDate(dateText: string): Date | null {
    if (!dateText) return null;
    
    try {
      // Try various date formats common in Vietnamese financial sites
      const formats = [
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/,  // DD/MM/YYYY
        /(\d{4})-(\d{1,2})-(\d{1,2})/,    // YYYY-MM-DD
        /(\d{1,2})-(\d{1,2})-(\d{4})/     // DD-MM-YYYY
      ];

      for (const format of formats) {
        const match = dateText.match(format);
        if (match) {
          const [, part1, part2, part3] = match;
          
          // Determine if it's DD/MM/YYYY or YYYY/MM/DD
          if (part3.length === 4) {
            // DD/MM/YYYY or DD-MM-YYYY
            return new Date(parseInt(part3), parseInt(part2) - 1, parseInt(part1));
          } else {
            // YYYY-MM-DD
            return new Date(parseInt(part1), parseInt(part2) - 1, parseInt(part3));
          }
        }
      }
      
      return new Date(dateText);
    } catch {
      return null;
    }
  }

  private deduplicateReports(reports: FinancialData[]): FinancialData[] {
    const seen = new Set<string>();
    return reports.filter(report => {
      const key = `${report.stockSymbol}-${report.year}-${report.quarter || 'annual'}-${report.reportType}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}