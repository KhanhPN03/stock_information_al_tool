export interface StockData {
  id: number;
  symbol: string;
  name: string;
  status: 'restricted' | 'suspended' | 'normal';
  exchange: 'HNX' | 'HOSE' | 'UPCOM';
  currentPrice?: number;
  priceChange?: number;
  priceChangePercent?: number;
  volume?: number;
  marketCap?: number;
  restrictionReason?: string;
  restrictionDate?: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface WatchlistItem {
  id: number;
  userId?: string;
  stockSymbol: string;
  notes?: string;
  addedDate: string;
  isActive: boolean;
  stock?: StockData;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface StockStatistics {
  total: number;
  restricted: number;
  suspended: number;
  normal: number;
  exchanges: { [key: string]: number };
}

export interface SearchResult {
  stocks: StockData[];
  total: number;
}