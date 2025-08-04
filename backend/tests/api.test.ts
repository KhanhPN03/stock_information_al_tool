import request from 'supertest';
import app from '../src/index';
import { AppDataSource } from '../src/config/database';

describe('API Endpoints', () => {
  beforeAll(async () => {
    // The AppDataSource should already be initialized by the app
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  test('GET /api/stocks should return 200 with empty array initially', async () => {
    const response = await request(app)
      .get('/api/stocks')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('data');
    expect(Array.isArray(response.body.data.data)).toBe(true);
  });

  test('GET /api/watchlist should return 200 with empty array initially', async () => {
    const response = await request(app)
      .get('/api/watchlist')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('GET /health should return healthy status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });
});