import { Router } from 'express';
import { StockController } from '../controllers/StockController';

const router = Router();
const stockController = new StockController();

// GET /api/stocks - Get all stocks with pagination
router.get('/', (req, res) => stockController.getAllStocks(req, res));

// GET /api/stocks/search - Search stocks
router.get('/search', (req, res) => stockController.searchStocks(req, res));

// GET /api/stocks/restricted - Get restricted/suspended stocks
router.get('/restricted', (req, res) => stockController.getRestrictedStocks(req, res));

// GET /api/stocks/statistics - Get stock statistics
router.get('/statistics', (req, res) => stockController.getStockStatistics(req, res));

// POST /api/stocks/refresh-hnx - Refresh data from HNX
router.post('/refresh-hnx', (req, res) => stockController.refreshHNXData(req, res));

// GET /api/stocks/:symbol - Get specific stock by symbol
router.get('/:symbol', (req, res) => stockController.getStockBySymbol(req, res));

export default router;