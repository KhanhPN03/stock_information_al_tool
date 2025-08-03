import { StockService } from '../src/services/StockService';
import { StockData } from '../src/types';

// Mock database
jest.mock('../src/config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
        getCount: jest.fn(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn()
      }))
    }))
  }
}));

describe('StockService', () => {
  let stockService: StockService;

  beforeEach(() => {
    stockService = new StockService();
    jest.clearAllMocks();
  });

  describe('createOrUpdateStock', () => {
    it('should create a new stock when it does not exist', async () => {
      const mockStockData: StockData = {
        symbol: 'TEST',
        name: 'Test Company',
        status: 'normal',
        exchange: 'HNX',
        lastUpdated: new Date()
      };

      const mockRepository = require('../src/config/database').AppDataSource.getRepository();
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockStockData);
      mockRepository.save.mockResolvedValue({ id: 1, ...mockStockData });

      const result = await stockService.createOrUpdateStock(mockStockData);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { symbol: 'TEST' }
      });
      expect(mockRepository.create).toHaveBeenCalledWith(mockStockData);
      expect(result).toEqual({ id: 1, ...mockStockData });
    });
  });

  describe('searchStocks', () => {
    it('should search stocks by symbol or name', async () => {
      const mockStocks = [
        { id: 1, symbol: 'ACB', name: 'Asian Commercial Bank' },
        { id: 2, symbol: 'VCB', name: 'Vietcombank' }
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockStocks)
      };

      const mockRepository = require('../src/config/database').AppDataSource.getRepository();
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await stockService.searchStocks('ACB', 10);

      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(mockQueryBuilder.orWhere).toHaveBeenCalled();
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockStocks);
    });
  });

  describe('getStockStatistics', () => {
    it('should return correct statistics', async () => {
      const mockRepository = require('../src/config/database').AppDataSource.getRepository();
      mockRepository.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(10)  // restricted
        .mockResolvedValueOnce(5)   // suspended
        .mockResolvedValueOnce(85); // normal

      mockRepository.createQueryBuilder().getRawMany.mockResolvedValue([
        { stock_exchange: 'HNX', count: '50' },
        { stock_exchange: 'HOSE', count: '30' },
        { stock_exchange: 'UPCOM', count: '20' }
      ]);

      const result = await stockService.getStockStatistics();

      expect(result).toEqual({
        total: 100,
        restricted: 10,
        suspended: 5,
        normal: 85,
        exchanges: {
          HNX: 50,
          HOSE: 30,
          UPCOM: 20
        }
      });
    });
  });
});