import axios from 'axios';
import { StockData, WatchlistItem, ApiResponse, PaginatedResponse, StockStatistics } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export class StockService {
  static async getAllStocks(page: number = 1, limit: number = 50, status?: string): Promise<PaginatedResponse<StockData>> {
    const params: any = { page, limit };
    if (status) params.status = status;
    
    const response = await apiClient.get<ApiResponse<PaginatedResponse<StockData>>>('/stocks', { params });
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch stocks');
    }
    
    return response.data.data;
  }

  static async getStockBySymbol(symbol: string): Promise<StockData> {
    const response = await apiClient.get<ApiResponse<StockData>>(`/stocks/${symbol}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Stock not found');
    }
    
    return response.data.data;
  }

  static async searchStocks(query: string, limit: number = 20): Promise<StockData[]> {
    const response = await apiClient.get<ApiResponse<StockData[]>>('/stocks/search', {
      params: { q: query, limit }
    });
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to search stocks');
    }
    
    return response.data.data;
  }

  static async getRestrictedStocks(): Promise<StockData[]> {
    const response = await apiClient.get<ApiResponse<StockData[]>>('/stocks/restricted');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch restricted stocks');
    }
    
    return response.data.data;
  }

  static async refreshHNXData(): Promise<{ updated: number; stocks: StockData[] }> {
    const response = await apiClient.post<ApiResponse<{ updated: number; stocks: StockData[] }>>('/stocks/refresh-hnx');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to refresh HNX data');
    }
    
    return response.data.data;
  }

  static async getStockStatistics(): Promise<StockStatistics> {
    const response = await apiClient.get<ApiResponse<StockStatistics>>('/stocks/statistics');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch statistics');
    }
    
    return response.data.data;
  }
}

export class WatchlistService {
  static async getWatchlist(userId?: string): Promise<WatchlistItem[]> {
    const params = userId ? { userId } : {};
    const response = await apiClient.get<ApiResponse<WatchlistItem[]>>('/watchlist', { params });
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch watchlist');
    }
    
    return response.data.data;
  }

  static async addToWatchlist(stockSymbol: string, userId?: string, notes?: string): Promise<WatchlistItem> {
    const response = await apiClient.post<ApiResponse<WatchlistItem>>('/watchlist', {
      stockSymbol,
      userId,
      notes
    });
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to add to watchlist');
    }
    
    return response.data.data;
  }

  static async removeFromWatchlist(id: number): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<{ removed: boolean }>>(`/watchlist/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to remove from watchlist');
    }
    
    return true;
  }

  static async updateWatchlistItem(id: number, notes: string): Promise<WatchlistItem> {
    const response = await apiClient.put<ApiResponse<WatchlistItem>>(`/watchlist/${id}`, { notes });
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to update watchlist item');
    }
    
    return response.data.data;
  }
}