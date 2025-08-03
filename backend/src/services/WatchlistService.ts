import { AppDataSource } from '../config/database';
import { WatchlistItem } from '../models/WatchlistItem';
import { WatchlistData } from '../types';
import { Repository } from 'typeorm';

export class WatchlistService {
  private watchlistRepository: Repository<WatchlistItem>;

  constructor() {
    this.watchlistRepository = AppDataSource.getRepository(WatchlistItem);
  }

  async getWatchlist(userId: string): Promise<WatchlistItem[]> {
    return await this.watchlistRepository.find({
      where: { userId, isActive: true },
      relations: ['stock'],
      order: { addedDate: 'DESC' }
    });
  }

  async addToWatchlist(watchlistData: WatchlistData): Promise<WatchlistItem> {
    // Check if already exists
    const existing = await this.watchlistRepository.findOne({
      where: {
        userId: watchlistData.userId,
        stockSymbol: watchlistData.stockSymbol.toUpperCase(),
        isActive: true
      }
    });

    if (existing) {
      throw new Error('Stock is already in watchlist');
    }

    const watchlistItem = this.watchlistRepository.create({
      ...watchlistData,
      stockSymbol: watchlistData.stockSymbol.toUpperCase()
    });

    return await this.watchlistRepository.save(watchlistItem);
  }

  async removeFromWatchlist(id: number): Promise<boolean> {
    const result = await this.watchlistRepository.update(
      { id },
      { isActive: false }
    );

    return (result.affected ?? 0) > 0;
  }

  async updateWatchlistItem(id: number, updates: Partial<WatchlistItem>): Promise<WatchlistItem | null> {
    const item = await this.watchlistRepository.findOne({ where: { id } });
    if (!item) return null;

    Object.assign(item, updates);
    return await this.watchlistRepository.save(item);
  }

  async isInWatchlist(userId: string, stockSymbol: string): Promise<boolean> {
    const item = await this.watchlistRepository.findOne({
      where: {
        userId,
        stockSymbol: stockSymbol.toUpperCase(),
        isActive: true
      }
    });

    return !!item;
  }
}