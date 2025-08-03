export const formatPrice = (price?: number): string => {
  if (price === undefined || price === null) return 'N/A';
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};

export const formatVolume = (volume?: number): string => {
  if (volume === undefined || volume === null) return 'N/A';
  
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  
  return volume.toString();
};

export const formatMarketCap = (marketCap?: number): string => {
  if (marketCap === undefined || marketCap === null) return 'N/A';
  
  if (marketCap >= 1000000000000) {
    return `${(marketCap / 1000000000000).toFixed(1)}T VND`;
  } else if (marketCap >= 1000000000) {
    return `${(marketCap / 1000000000).toFixed(1)}B VND`;
  } else if (marketCap >= 1000000) {
    return `${(marketCap / 1000000).toFixed(1)}M VND`;
  }
  
  return `${formatPrice(marketCap)} VND`;
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return 'N/A';
  }
};

export const formatDateShort = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch {
    return 'N/A';
  }
};

export const getPriceChangeColor = (change?: number): string => {
  if (change === undefined || change === null || change === 0) return '#757575';
  return change > 0 ? '#4caf50' : '#f44336';
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'normal':
      return '#4caf50';
    case 'restricted':
      return '#ff9800';
    case 'suspended':
      return '#f44336';
    default:
      return '#757575';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'normal':
      return 'Bình thường';
    case 'restricted':
      return 'Hạn chế';
    case 'suspended':
      return 'Đình chỉ';
    default:
      return 'Không xác định';
  }
};

export const getExchangeLabel = (exchange: string): string => {
  switch (exchange) {
    case 'HNX':
      return 'HNX';
    case 'HOSE':
      return 'HOSE';
    case 'UPCOM':
      return 'UPCoM';
    default:
      return exchange;
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const isValidStockSymbol = (symbol: string): boolean => {
  return /^[A-Z]{3,4}$/.test(symbol.toUpperCase());
};