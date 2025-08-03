import { Router } from 'express';
import { WatchlistController } from '../controllers/WatchlistController';

const router = Router();
const watchlistController = new WatchlistController();

// GET /api/watchlist - Get user's watchlist
router.get('/', (req, res) => watchlistController.getWatchlist(req, res));

// POST /api/watchlist - Add stock to watchlist
router.post('/', (req, res) => watchlistController.addToWatchlist(req, res));

// PUT /api/watchlist/:id - Update watchlist item
router.put('/:id', (req, res) => watchlistController.updateWatchlistItem(req, res));

// DELETE /api/watchlist/:id - Remove stock from watchlist
router.delete('/:id', (req, res) => watchlistController.removeFromWatchlist(req, res));

export default router;