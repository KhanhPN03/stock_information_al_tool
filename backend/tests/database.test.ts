import 'reflect-metadata';
import { AppDataSource } from '../src/config/database';
import { Stock } from '../src/models/Stock';
import { WatchlistItem } from '../src/models/WatchlistItem';

describe('Database Setup', () => {
  beforeAll(async () => {
    try {
      await AppDataSource.initialize();
      console.log('Database connection established');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  test('should connect to database and tables should exist', async () => {
    // Check if tables exist by querying metadata
    const queryRunner = AppDataSource.createQueryRunner();
    
    try {
      // Check if stocks table exists
      const stocksTable = await queryRunner.getTable('stocks');
      expect(stocksTable).toBeDefined();
      expect(stocksTable?.name).toBe('stocks');

      // Check if watchlist_items table exists
      const watchlistTable = await queryRunner.getTable('watchlist_items');
      expect(watchlistTable).toBeDefined();
      expect(watchlistTable?.name).toBe('watchlist_items');

      console.log('All required tables exist');
    } finally {
      await queryRunner.release();
    }
  });

  test('should be able to create and query stocks', async () => {
    const stockRepository = AppDataSource.getRepository(Stock);
    
    // Create a test stock
    const testStock = stockRepository.create({
      symbol: 'TEST001',
      name: 'Test Company',
      status: 'normal',
      exchange: 'HNX',
      lastUpdated: new Date()
    });

    const savedStock = await stockRepository.save(testStock);
    expect(savedStock.id).toBeDefined();
    expect(savedStock.symbol).toBe('TEST001');

    // Query the stock back
    const foundStock = await stockRepository.findOne({
      where: { symbol: 'TEST001' }
    });

    expect(foundStock).toBeDefined();
    expect(foundStock?.name).toBe('Test Company');

    // Clean up
    await stockRepository.delete({ symbol: 'TEST001' });
  });

  test('should be able to create and query watchlist items', async () => {
    const stockRepository = AppDataSource.getRepository(Stock);
    const watchlistRepository = AppDataSource.getRepository(WatchlistItem);
    
    // First create a stock
    const testStock = stockRepository.create({
      symbol: 'TEST002',
      name: 'Test Company 2',
      status: 'normal',
      exchange: 'HNX',
      lastUpdated: new Date()
    });
    await stockRepository.save(testStock);

    // Create a watchlist item
    const watchlistItem = watchlistRepository.create({
      userId: 'test-user',
      stockSymbol: 'TEST002',
      notes: 'Test watchlist item',
      addedDate: new Date(),
      isActive: true
    });

    const savedWatchlistItem = await watchlistRepository.save(watchlistItem);
    expect(savedWatchlistItem.id).toBeDefined();
    expect(savedWatchlistItem.stockSymbol).toBe('TEST002');

    // Query the watchlist item back
    const foundWatchlistItem = await watchlistRepository.findOne({
      where: { stockSymbol: 'TEST002' }
    });

    expect(foundWatchlistItem).toBeDefined();
    expect(foundWatchlistItem?.notes).toBe('Test watchlist item');

    // Clean up
    await watchlistRepository.delete({ stockSymbol: 'TEST002' });
    await stockRepository.delete({ symbol: 'TEST002' });
  });
});