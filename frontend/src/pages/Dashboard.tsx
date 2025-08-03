import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { StockData, WatchlistItem } from '../types';
import { StockService, WatchlistService } from '../services/api';
import StockCard from '../components/StockCard';
import StockSearch from '../components/StockSearch';

const Dashboard: React.FC = () => {
  const [restrictedStocks, setRestrictedStocks] = useState<StockData[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [addToWatchlistDialog, setAddToWatchlistDialog] = useState<{
    open: boolean;
    stock: StockData | null;
    notes: string;
  }>({
    open: false,
    stock: null,
    notes: ''
  });

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [restrictedData, watchlistData] = await Promise.all([
        StockService.getRestrictedStocks(),
        WatchlistService.getWatchlist()
      ]);

      setRestrictedStocks(restrictedData);
      setWatchlist(watchlistData);
    } catch (error) {
      showSnackbar('Lỗi tải dữ liệu: ' + (error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshHNXData = async () => {
    try {
      setRefreshing(true);
      const result = await StockService.refreshHNXData();
      showSnackbar(`Đã cập nhật ${result.updated} mã chứng khoán từ HNX`, 'success');
      await loadData();
    } catch (error) {
      showSnackbar('Lỗi cập nhật dữ liệu: ' + (error as Error).message, 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddToWatchlist = (stock: StockData) => {
    setAddToWatchlistDialog({
      open: true,
      stock,
      notes: ''
    });
  };

  const handleAddToWatchlistFromCard = (symbol: string) => {
    const stock = restrictedStocks.find(s => s.symbol === symbol);
    if (stock) {
      handleAddToWatchlist(stock);
    }
  };

  const confirmAddToWatchlist = async () => {
    if (!addToWatchlistDialog.stock) return;

    try {
      await WatchlistService.addToWatchlist(
        addToWatchlistDialog.stock.symbol,
        'default',
        addToWatchlistDialog.notes
      );
      
      showSnackbar('Đã thêm vào danh sách theo dõi', 'success');
      await loadData();
      setAddToWatchlistDialog({ open: false, stock: null, notes: '' });
    } catch (error) {
      showSnackbar('Lỗi thêm vào danh sách: ' + (error as Error).message, 'error');
    }
  };

  const handleRemoveFromWatchlist = async (id: number) => {
    try {
      await WatchlistService.removeFromWatchlist(id);
      showSnackbar('Đã xóa khỏi danh sách theo dõi', 'success');
      await loadData();
    } catch (error) {
      showSnackbar('Lỗi xóa khỏi danh sách: ' + (error as Error).message, 'error');
    }
  };

  const handleStockSelect = (stock: StockData) => {
    handleAddToWatchlist(stock);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isStockInWatchlist = (symbol: string) => {
    return watchlist.find(item => item.stockSymbol === symbol && item.isActive);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Hệ thống theo dõi chứng khoán HNX
      </Typography>

      {/* Search Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tìm kiếm và thêm cổ phiếu
          </Typography>
          <StockSearch onStockSelect={handleStockSelect} />
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Restricted Stocks Section */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Chứng khoán bị hạn chế/đình chỉ
                  <Chip 
                    label={restrictedStocks.length} 
                    size="small" 
                    sx={{ ml: 1 }} 
                  />
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={refreshing ? <CircularProgress size={16} /> : <Refresh />}
                  onClick={refreshHNXData}
                  disabled={refreshing}
                >
                  {refreshing ? 'Đang cập nhật...' : 'Cập nhật HNX'}
                </Button>
              </Box>

              {restrictedStocks.length === 0 ? (
                <Alert severity="info">
                  Hiện tại không có mã chứng khoán nào bị hạn chế hoặc đình chỉ giao dịch
                </Alert>
              ) : (
                <Box sx={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {restrictedStocks.map((stock) => {
                    const watchlistItem = isStockInWatchlist(stock.symbol);
                    return (
                      <StockCard
                        key={stock.id}
                        stock={stock}
                        onAddToWatchlist={handleAddToWatchlistFromCard}
                        isInWatchlist={!!watchlistItem}
                        compact
                      />
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Watchlist Section */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Danh sách theo dõi
                <Chip 
                  label={watchlist.filter(item => item.isActive).length} 
                  size="small" 
                  sx={{ ml: 1 }} 
                />
              </Typography>

              {watchlist.filter(item => item.isActive).length === 0 ? (
                <Alert severity="info">
                  Danh sách theo dõi trống. Hãy thêm một số mã chứng khoán để theo dõi.
                </Alert>
              ) : (
                <Box sx={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {watchlist
                    .filter(item => item.isActive)
                    .map((item) => (
                      <StockCard
                        key={item.id}
                        stock={item.stock!}
                        onRemoveFromWatchlist={handleRemoveFromWatchlist}
                        isInWatchlist={true}
                        watchlistId={item.id}
                        compact
                      />
                    ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add to Watchlist Dialog */}
      <Dialog 
        open={addToWatchlistDialog.open} 
        onClose={() => setAddToWatchlistDialog({ open: false, stock: null, notes: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Thêm vào danh sách theo dõi
        </DialogTitle>
        <DialogContent>
          {addToWatchlistDialog.stock && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>{addToWatchlistDialog.stock.symbol}</strong> - {addToWatchlistDialog.stock.name}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Ghi chú (tùy chọn)"
                value={addToWatchlistDialog.notes}
                onChange={(e) => setAddToWatchlistDialog({
                  ...addToWatchlistDialog,
                  notes: e.target.value
                })}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddToWatchlistDialog({ open: false, stock: null, notes: '' })}>
            Hủy
          </Button>
          <Button onClick={confirmAddToWatchlist} variant="contained">
            Thêm vào danh sách
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;