// Simple demo without Puppeteer to show system functionality
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Mock data for demo
const mockStocks = [
  {
    id: 1,
    symbol: 'ACB',
    name: 'Ngân hàng TMCP Á Châu',
    status: 'restricted',
    exchange: 'HNX',
    currentPrice: 23500,
    priceChange: -500,
    priceChangePercent: -2.08,
    volume: 1250000,
    restrictionReason: 'Bị hạn chế giao dịch do chậm nộp báo cáo tài chính',
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    symbol: 'VND',
    name: 'Công ty Cổ phần Chứng khoán VnDirect',
    status: 'suspended',
    exchange: 'HNX',
    currentPrice: 15200,
    priceChange: 0,
    priceChangePercent: 0,
    volume: 0,
    restrictionReason: 'Đình chỉ giao dịch theo quyết định của HNX',
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    symbol: 'PVS',
    name: 'Tổng Công ty Dịch vụ Kỹ thuật Dầu khí Việt Nam',
    status: 'restricted',
    exchange: 'HNX',
    currentPrice: 18700,
    priceChange: 300,
    priceChangePercent: 1.63,
    volume: 890000,
    restrictionReason: 'Hạn chế giao dịch do vi phạm công bố thông tin',
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let watchlist = [];

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'HNX Stock Tracking Demo Server'
  });
});

// Get all stocks
app.get('/api/stocks', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const status = req.query.status;

  let filteredStocks = mockStocks;
  if (status && ['restricted', 'suspended', 'normal'].includes(status)) {
    filteredStocks = mockStocks.filter(stock => stock.status === status);
  }

  const total = filteredStocks.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const stocks = filteredStocks.slice(start, end);

  res.json({
    success: true,
    data: {
      data: stocks,
      total,
      page,
      limit,
      hasMore: end < total
    }
  });
});

// Search stocks
app.get('/api/stocks/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const limit = parseInt(req.query.limit) || 20;

  if (query.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Search query must be at least 2 characters'
    });
  }

  const results = mockStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(query) || 
    stock.name.toLowerCase().includes(query)
  ).slice(0, limit);

  res.json({
    success: true,
    data: results
  });
});

// Get restricted stocks
app.get('/api/stocks/restricted', (req, res) => {
  const restrictedStocks = mockStocks.filter(stock => 
    stock.status === 'restricted' || stock.status === 'suspended'
  );

  res.json({
    success: true,
    data: restrictedStocks
  });
});

// Mock HNX refresh
app.post('/api/stocks/refresh-hnx', (req, res) => {
  // Simulate refresh
  console.log('Mock HNX refresh requested');
  
  res.json({
    success: true,
    data: {
      updated: mockStocks.length,
      stocks: mockStocks
    },
    message: `Successfully updated ${mockStocks.length} stocks from HNX (Demo Mode)`
  });
});

// Get stock statistics
app.get('/api/stocks/statistics', (req, res) => {
  const stats = {
    total: mockStocks.length,
    restricted: mockStocks.filter(s => s.status === 'restricted').length,
    suspended: mockStocks.filter(s => s.status === 'suspended').length,
    normal: mockStocks.filter(s => s.status === 'normal').length,
    exchanges: {
      HNX: mockStocks.filter(s => s.exchange === 'HNX').length,
      HOSE: 0,
      UPCOM: 0
    }
  };

  res.json({
    success: true,
    data: stats
  });
});

// Get specific stock
app.get('/api/stocks/:symbol', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const stock = mockStocks.find(s => s.symbol === symbol);

  if (!stock) {
    return res.status(404).json({
      success: false,
      error: 'Stock not found'
    });
  }

  res.json({
    success: true,
    data: stock
  });
});

// Watchlist endpoints
app.get('/api/watchlist', (req, res) => {
  const watchlistWithStocks = watchlist.map(item => ({
    ...item,
    stock: mockStocks.find(s => s.symbol === item.stockSymbol)
  })).filter(item => item.stock); // Only include items where stock exists

  res.json({
    success: true,
    data: watchlistWithStocks
  });
});

app.post('/api/watchlist', (req, res) => {
  const { stockSymbol, notes } = req.body;
  
  if (!stockSymbol) {
    return res.status(400).json({
      success: false,
      error: 'Stock symbol is required'
    });
  }

  // Check if already exists
  const existing = watchlist.find(item => 
    item.stockSymbol === stockSymbol.toUpperCase() && item.isActive
  );

  if (existing) {
    return res.status(400).json({
      success: false,
      error: 'Stock is already in watchlist'
    });
  }

  const newItem = {
    id: watchlist.length + 1,
    userId: 'default',
    stockSymbol: stockSymbol.toUpperCase(),
    notes: notes || '',
    addedDate: new Date().toISOString(),
    isActive: true
  };

  watchlist.push(newItem);

  res.status(201).json({
    success: true,
    data: newItem,
    message: 'Stock added to watchlist'
  });
});

app.delete('/api/watchlist/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = watchlist.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Watchlist item not found'
    });
  }

  watchlist[itemIndex].isActive = false;

  res.json({
    success: true,
    data: { removed: true },
    message: 'Stock removed from watchlist'
  });
});

app.listen(port, () => {
  console.log(`🚀 HNX Stock Tracking Demo Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`📈 API Base: http://localhost:${port}/api`);
  console.log(`\n🎯 Available endpoints:`);
  console.log(`   GET  /api/stocks - List all stocks`);
  console.log(`   GET  /api/stocks/restricted - Get restricted stocks`);
  console.log(`   GET  /api/stocks/search?q=query - Search stocks`);
  console.log(`   POST /api/stocks/refresh-hnx - Refresh HNX data`);
  console.log(`   GET  /api/watchlist - Get watchlist`);
  console.log(`   POST /api/watchlist - Add to watchlist`);
  console.log(`\n✨ Demo includes ${mockStocks.length} sample restricted/suspended stocks`);
});