import { Request, Response } from 'express';
import { WatchlistService } from '../services/WatchlistService';
import { ApiResponse } from '../types';

export class WatchlistController {
  private watchlistService: WatchlistService;

  constructor() {
    this.watchlistService = new WatchlistService();
  }

  async getWatchlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query.userId as string || 'default';
      const watchlistItems = await this.watchlistService.getWatchlist(userId);

      const response: ApiResponse<typeof watchlistItems> = {
        success: true,
        data: watchlistItems
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

  async addToWatchlist(req: Request, res: Response): Promise<void> {
    try {
      const { stockSymbol, userId, notes } = req.body;
      
      if (!stockSymbol) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Stock symbol is required'
        };
        res.status(400).json(response);
        return;
      }

      const watchlistItem = await this.watchlistService.addToWatchlist({
        stockSymbol: stockSymbol.toUpperCase(),
        userId: userId || 'default',
        notes,
        addedDate: new Date()
      });

      const response: ApiResponse<typeof watchlistItem> = {
        success: true,
        data: watchlistItem,
        message: 'Stock added to watchlist'
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add stock to watchlist'
      };
      res.status(500).json(response);
    }
  }

  async removeFromWatchlist(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const removed = await this.watchlistService.removeFromWatchlist(parseInt(id));

      if (!removed) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Watchlist item not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<{ removed: boolean }> = {
        success: true,
        data: { removed: true },
        message: 'Stock removed from watchlist'
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove stock from watchlist'
      };
      res.status(500).json(response);
    }
  }

  async updateWatchlistItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      const updatedItem = await this.watchlistService.updateWatchlistItem(
        parseInt(id),
        { notes }
      );

      if (!updatedItem) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Watchlist item not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof updatedItem> = {
        success: true,
        data: updatedItem,
        message: 'Watchlist item updated'
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update watchlist item'
      };
      res.status(500).json(response);
    }
  }
}