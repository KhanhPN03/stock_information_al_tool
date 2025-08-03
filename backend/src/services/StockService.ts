import { AppDataSource } from '../config/database';
import { Stock } from '../models/Stock';
import { StockData } from '../types';
import { Repository } from 'typeorm';

export class StockService {
  private stockRepository: Repository<Stock>;

  constructor() {
    this.stockRepository = AppDataSource.getRepository(Stock);
  }

  async getAllStocks(page: number = 1, limit: number = 50, status?: string): Promise<{
    stocks: Stock[];
    total: number;
    hasMore: boolean;
  }> {
    const query = this.stockRepository.createQueryBuilder('stock');
    
    if (status && ['restricted', 'suspended', 'normal'].includes(status)) {
      query.where('stock.status = :status', { status });
    }

    query.orderBy('stock.lastUpdated', 'DESC');
    
    const total = await query.getCount();
    const stocks = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      stocks,
      total,
      hasMore: page * limit < total
    };
  }

  async getStockBySymbol(symbol: string): Promise<Stock | null> {
    return await this.stockRepository.findOne({
      where: { symbol: symbol.toUpperCase() }
    });
  }

  async searchStocks(query: string, limit: number = 20): Promise<Stock[]> {
    return await this.stockRepository
      .createQueryBuilder('stock')
      .where('UPPER(stock.symbol) LIKE UPPER(:query)', { query: `%${query}%` })
      .orWhere('UPPER(stock.name) LIKE UPPER(:query)', { query: `%${query}%` })
      .limit(limit)
      .getMany();
  }

  async createOrUpdateStock(stockData: StockData): Promise<Stock> {
    const existingStock = await this.getStockBySymbol(stockData.symbol);
    
    if (existingStock) {
      // Update existing stock
      Object.assign(existingStock, stockData);
      existingStock.lastUpdated = new Date();
      return await this.stockRepository.save(existingStock);
    } else {
      // Create new stock
      const stock = this.stockRepository.create(stockData);
      return await this.stockRepository.save(stock);
    }
  }

  async bulkCreateOrUpdateStocks(stocksData: StockData[]): Promise<Stock[]> {
    const results: Stock[] = [];
    
    for (const stockData of stocksData) {
      try {
        const stock = await this.createOrUpdateStock(stockData);
        results.push(stock);
      } catch (error) {
        console.error(`Failed to save stock ${stockData.symbol}:`, error);
      }
    }
    
    return results;
  }

  async getRestrictedStocks(): Promise<Stock[]> {
    return await this.stockRepository.find({
      where: [
        { status: 'restricted' },
        { status: 'suspended' }
      ],
      order: { lastUpdated: 'DESC' }
    });
  }

  async updateStockPrice(symbol: string, priceData: {
    currentPrice?: number;
    priceChange?: number;
    priceChangePercent?: number;
    volume?: number;
  }): Promise<Stock | null> {
    const stock = await this.getStockBySymbol(symbol);
    if (!stock) return null;

    Object.assign(stock, priceData);
    stock.lastUpdated = new Date();
    
    return await this.stockRepository.save(stock);
  }

  async deleteStock(symbol: string): Promise<boolean> {
    const result = await this.stockRepository.delete({ symbol: symbol.toUpperCase() });
    return (result.affected ?? 0) > 0;
  }

  async getStockStatistics(): Promise<{
    total: number;
    restricted: number;
    suspended: number;
    normal: number;
    exchanges: { [key: string]: number };
  }> {
    const [total, restricted, suspended, normal] = await Promise.all([
      this.stockRepository.count(),
      this.stockRepository.count({ where: { status: 'restricted' } }),
      this.stockRepository.count({ where: { status: 'suspended' } }),
      this.stockRepository.count({ where: { status: 'normal' } })
    ]);

    const exchangeStats = await this.stockRepository
      .createQueryBuilder('stock')
      .select('stock.exchange')
      .addSelect('COUNT(*)', 'count')
      .groupBy('stock.exchange')
      .getRawMany();

    const exchanges = exchangeStats.reduce((acc, stat) => {
      acc[stat.stock_exchange] = parseInt(stat.count);
      return acc;
    }, {} as { [key: string]: number });

    return {
      total,
      restricted,
      suspended,
      normal,
      exchanges
    };
  }
}