import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Remove,
  Info,
  Delete,
  Edit
} from '@mui/icons-material';
import { StockData } from '../types';
import {
  formatPrice,
  formatVolume,
  getPriceChangeColor,
  getStatusColor,
  getStatusLabel,
  getExchangeLabel,
  formatDate
} from '../utils/formatters';

interface StockCardProps {
  stock: StockData;
  onAddToWatchlist?: (symbol: string) => void;
  onRemoveFromWatchlist?: (id: number) => void;
  onEditNotes?: (id: number) => void;
  isInWatchlist?: boolean;
  watchlistId?: number;
  compact?: boolean;
}

const StockCard: React.FC<StockCardProps> = ({
  stock,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onEditNotes,
  isInWatchlist,
  watchlistId,
  compact = false
}) => {
  const priceChangeColor = getPriceChangeColor(stock.priceChange);
  const statusColor = getStatusColor(stock.status);

  const handleAddToWatchlist = () => {
    if (onAddToWatchlist) {
      onAddToWatchlist(stock.symbol);
    }
  };

  const handleRemoveFromWatchlist = () => {
    if (onRemoveFromWatchlist && watchlistId) {
      onRemoveFromWatchlist(watchlistId);
    }
  };

  const handleEditNotes = () => {
    if (onEditNotes && watchlistId) {
      onEditNotes(watchlistId);
    }
  };

  const PriceChangeIcon = stock.priceChange && stock.priceChange > 0 ? TrendingUp : 
                         stock.priceChange && stock.priceChange < 0 ? TrendingDown : Remove;

  return (
    <Card sx={{ mb: 2, '&:hover': { elevation: 4 } }}>
      <CardContent>
        <Grid container spacing={2}>
          {/* Stock Symbol and Name */}
          <Grid item xs={12} sm={compact ? 12 : 6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="h6" component="span" fontWeight="bold">
                {stock.symbol}
              </Typography>
              <Chip
                label={getExchangeLabel(stock.exchange)}
                size="small"
                variant="outlined"
              />
              <Chip
                label={getStatusLabel(stock.status)}
                size="small"
                sx={{
                  backgroundColor: statusColor,
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" noWrap>
              {stock.name}
            </Typography>
          </Grid>

          {/* Price Information */}
          <Grid item xs={12} sm={compact ? 12 : 6}>
            <Box display="flex" alignItems="center" justifyContent={compact ? 'flex-start' : 'flex-end'}>
              <Box textAlign={compact ? 'left' : 'right'}>
                <Typography variant="h6" component="div">
                  {formatPrice(stock.currentPrice)} VND
                </Typography>
                {stock.priceChange !== undefined && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <PriceChangeIcon 
                      sx={{ 
                        fontSize: 16, 
                        color: priceChangeColor 
                      }} 
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ color: priceChangeColor, fontWeight: 'bold' }}
                    >
                      {stock.priceChange > 0 ? '+' : ''}{formatPrice(stock.priceChange)}
                      {stock.priceChangePercent && (
                        ` (${stock.priceChangePercent > 0 ? '+' : ''}${stock.priceChangePercent.toFixed(2)}%)`
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Additional Information */}
          {!compact && (
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <Box display="flex" gap={2}>
                  {stock.volume && (
                    <Typography variant="body2" color="text.secondary">
                      Khối lượng: {formatVolume(stock.volume)}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Cập nhật: {formatDate(stock.lastUpdated)}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box display="flex" gap={1}>
                  {stock.restrictionReason && (
                    <Tooltip title={stock.restrictionReason}>
                      <IconButton size="small">
                        <Info fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {isInWatchlist ? (
                    <>
                      {onEditNotes && (
                        <Tooltip title="Chỉnh sửa ghi chú">
                          <IconButton size="small" onClick={handleEditNotes}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onRemoveFromWatchlist && (
                        <Tooltip title="Xóa khỏi danh sách theo dõi">
                          <IconButton size="small" color="error" onClick={handleRemoveFromWatchlist}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  ) : (
                    onAddToWatchlist && (
                      <Tooltip title="Thêm vào danh sách theo dõi">
                        <IconButton size="small" color="primary" onClick={handleAddToWatchlist}>
                          <TrendingUp fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )
                  )}
                </Box>
              </Box>
            </Grid>
          )}

          {/* Restriction Information */}
          {stock.restrictionReason && compact && (
            <Grid item xs={12}>
              <Typography variant="body2" color="warning.main" fontSize="0.875rem">
                {stock.restrictionReason}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StockCard;