import React, { useState } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  Typography,
  InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { StockData } from '../types';
import { StockService } from '../services/api';
import { debounce } from '../utils/formatters';

interface StockSearchProps {
  onStockSelect: (stock: StockData) => void;
  placeholder?: string;
  fullWidth?: boolean;
}

const StockSearch: React.FC<StockSearchProps> = ({
  onStockSelect,
  placeholder = "Tìm kiếm mã chứng khoán...",
  fullWidth = true
}) => {
  const [options, setOptions] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const searchStocks = debounce(async (query: string) => {
    if (query.trim().length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await StockService.searchStocks(query.trim(), 10);
      setOptions(results);
    } catch (error) {
      console.error('Search error:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleInputChange = (event: any, newInputValue: string) => {
    setInputValue(newInputValue);
    searchStocks(newInputValue);
  };

  const handleStockSelect = (event: any, value: StockData | null) => {
    if (value) {
      onStockSelect(value);
      setInputValue('');
      setOptions([]);
    }
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
      filterOptions={(x) => x} // Disable client-side filtering
      loading={loading}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleStockSelect}
      fullWidth={fullWidth}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {option.symbol}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {option.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.exchange} - {option.status === 'normal' ? 'Bình thường' : 
               option.status === 'restricted' ? 'Hạn chế' : 'Đình chỉ'}
            </Typography>
          </Box>
        </Box>
      )}
      noOptionsText={
        inputValue.length < 2 
          ? "Nhập ít nhất 2 ký tự để tìm kiếm"
          : "Không tìm thấy mã chứng khoán nào"
      }
    />
  );
};

export default StockSearch;