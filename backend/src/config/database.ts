import { DataSource } from 'typeorm';
import { Stock } from '../models/Stock';
import { WatchlistItem } from '../models/WatchlistItem';
import { FinancialReport } from '../models/FinancialReport';
import { BoardResolution } from '../models/BoardResolution';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'stock_tracking',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [Stock, WatchlistItem, FinancialReport, BoardResolution],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});