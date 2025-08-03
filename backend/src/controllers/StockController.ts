import { Request, Response } from 'express';
import { StockService } from '../services/StockService';
import { HNXScrapingService } from '../services/HNXScrapingService';
import { ApiResponse, PaginatedResponse } from '../types';
import { Stock } from '../models/Stock';

export class StockController {
  private stockService: StockService;
  private hnxScrapingService: HNXScrapingService;

  constructor() {
    this.stockService = new StockService();
    this.hnxScrapingService = new HNXScrapingService();
  }

  async getAllStocks(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const status = req.query.status as string;

      const result = await this.stockService.getAllStocks(page, limit, status);

      const response: ApiResponse<PaginatedResponse<Stock>> = {
        success: true,
        data: {
          data: result.stocks,
          total: result.total,
          page,
          limit,
          hasMore: result.hasMore
        }
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  async getStockBySymbol(req: Request, res: Response): Promise<void> {
    try {
      const { symbol } = req.params;
      const stock = await this.stockService.getStockBySymbol(symbol);

      if (!stock) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Stock not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Stock> = {
        success: true,
        data: stock
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  async searchStocks(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length < 2) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Search query must be at least 2 characters'
        };
        res.status(400).json(response);
        return;
      }

      const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
      const stocks = await this.stockService.searchStocks(query.trim(), limit);

      const response: ApiResponse<Stock[]> = {
        success: true,
        data: stocks
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  async getRestrictedStocks(req: Request, res: Response): Promise<void> {
    try {
      const stocks = await this.stockService.getRestrictedStocks();

      const response: ApiResponse<Stock[]> = {
        success: true,
        data: stocks
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  async refreshHNXData(req: Request, res: Response): Promise<void> {
    try {
      console.log('Starting HNX data refresh...');
      const scrapedStocks = await this.hnxScrapingService.scrapeRestrictedStocks();
      console.log(`Scraped ${scrapedStocks.length} stocks from HNX`);

      const savedStocks = await this.stockService.bulkCreateOrUpdateStocks(scrapedStocks);
      console.log(`Saved ${savedStocks.length} stocks to database`);

      await this.hnxScrapingService.closeBrowser();

      const response: ApiResponse<{ updated: number; stocks: Stock[] }> = {
        success: true,
        data: {
          updated: savedStocks.length,
          stocks: savedStocks
        },
        message: `Successfully updated ${savedStocks.length} stocks from HNX`
      };

      res.json(response);
    } catch (error) {
      console.error('Error refreshing HNX data:', error);
      await this.hnxScrapingService.closeBrowser();
      
      const response: ApiResponse<never> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to refresh HNX data'
      };
      res.status(500).json(response);
    }
  }

  async getStockStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.stockService.getStockStatistics();

      const response: ApiResponse<typeof stats> = {
        success: true,
        data: stats
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }
}