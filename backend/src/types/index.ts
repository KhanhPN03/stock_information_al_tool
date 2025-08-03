export interface StockData {
  symbol: string;
  name: string;
  status: 'restricted' | 'suspended' | 'normal';
  exchange: 'HNX' | 'HOSE' | 'UPCOM';
  currentPrice?: number;
  priceChange?: number;
  priceChangePercent?: number;
  volume?: number;
  marketCap?: number;
  lastUpdated: Date;
  restrictionReason?: string;
  restrictionDate?: Date;
}

export interface FinancialData {
  stockSymbol: string;
  reportType: 'quarterly' | 'annual' | 'extraordinary';
  year: number;
  quarter?: number;
  revenue?: number;
  profit?: number;
  eps?: number;
  reportUrl?: string;
  publishDate: Date;
}

export interface WatchlistData {
  id?: number;
  userId?: string;
  stockSymbol: string;
  addedDate: Date;
  notes?: string;
}

export interface BoardResolutionData {
  stockSymbol: string;
  title: string;
  resolutionDate: Date;
  content: string;
  documentUrl?: string;
  source: string;
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