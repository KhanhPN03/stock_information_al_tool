# HNX Stock Tracking System

A comprehensive web application for tracking and analyzing restricted/suspended securities from Hanoi Stock Exchange (HNX), combined with financial report monitoring and watchlist management features.

## 🚀 Features

### Core Functionality
- **HNX Data Collection**: Automated scraping of restricted/suspended stocks from HNX website
- **Stock Dashboard**: Real-time monitoring of stock prices and status changes
- **Watchlist Management**: Personal stock tracking with notes and alerts
- **Search System**: Quick search for any stock symbol or company name
- **Financial Reports**: Integration for financial report tracking (expandable)
- **Board Resolutions**: Monitor board resolutions and corporate actions

### Technical Features
- **RESTful API**: Comprehensive backend API with TypeScript
- **Real-time Updates**: Automated data refresh from HNX
- **Responsive Design**: Professional UI that works on all devices
- **Database Integration**: PostgreSQL for reliable data storage
- **Web Scraping**: Robust scraping system with Puppeteer
- **Docker Support**: Easy deployment with Docker Compose

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** with **TypeORM**
- **Puppeteer** + **Cheerio** for web scraping
- **Rate limiting** and **Security middleware**

### Frontend
- **React** + **TypeScript**
- **Material-UI** for professional design
- **Axios** for API communication
- **Responsive design** with mobile support

### Deployment
- **Docker** + **Docker Compose**
- **Nginx** for frontend serving
- **Health checks** and **monitoring**

## 📦 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/KhanhPN03/stock_information_al_tool.git
   cd stock_information_al_tool
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

### Manual Development Setup

#### Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run build
npm start
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### Database Setup
- Install PostgreSQL
- Create database: `stock_tracking`
- Update connection details in `.env`

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=stock_tracking
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 📋 API Endpoints

### Stocks
- `GET /api/stocks` - List all stocks with pagination
- `GET /api/stocks/search?q={query}` - Search stocks
- `GET /api/stocks/restricted` - Get restricted/suspended stocks
- `GET /api/stocks/statistics` - Get stock statistics
- `POST /api/stocks/refresh-hnx` - Refresh data from HNX
- `GET /api/stocks/{symbol}` - Get specific stock details

### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add stock to watchlist
- `PUT /api/watchlist/{id}` - Update watchlist item
- `DELETE /api/watchlist/{id}` - Remove from watchlist

### System
- `GET /health` - Health check endpoint

## 🎯 Key Features Explained

### 1. HNX Data Scraping
The system automatically fetches restricted/suspended stock data from:
- **URL**: https://www.hnx.vn/co-phieu-etfs/chung-khoan-uc-thong-tin-ck.html
- **Method**: Puppeteer-based web scraping with error handling
- **Frequency**: On-demand or scheduled updates

### 2. Stock Dashboard
- **Two-panel layout**: Restricted stocks vs. Personal watchlist
- **Real-time data**: Current prices and status information
- **Quick actions**: Add to watchlist, view details, manage notes

### 3. Search & Discovery
- **Autocomplete search**: Fast symbol and company name search
- **Intelligent filtering**: Results based on exchange and status
- **Quick add**: Directly add searched stocks to watchlist

### 4. Professional UI/UX
- **Clean design**: Professional color scheme (blues, minimal red)
- **Responsive layout**: Works on desktop, tablet, and mobile
- **Intuitive navigation**: Easy-to-use interface for all users
- **Status indicators**: Clear visual indicators for stock status

## 🚦 Development

### Build Commands
```bash
# Build entire project
npm run build

# Build backend only
npm run build:backend

# Build frontend only  
npm run build:frontend

# Run tests
npm test

# Development mode
npm run dev
```

### Code Quality
- **TypeScript**: Full type safety across the stack
- **ESLint**: Code linting and formatting
- **Professional naming**: Clear, descriptive variable/function names
- **Error handling**: Comprehensive error handling throughout

## 🔄 Data Flow

1. **HNX Scraping**: Automated data collection from HNX website
2. **Database Storage**: Structured storage in PostgreSQL
3. **API Layer**: RESTful endpoints for data access
4. **Frontend Display**: React components render the data
5. **User Interaction**: Watchlist management and search functionality

## 📊 Database Schema

### Tables
- **stocks**: Core stock information and status
- **watchlist_items**: User's personal stock tracking
- **financial_reports**: Financial report metadata (expandable)
- **board_resolutions**: Corporate action tracking (expandable)

## 🔒 Security

- **Rate limiting**: API endpoint protection
- **Input validation**: All user inputs validated
- **CORS configuration**: Secure cross-origin requests
- **SQL injection protection**: Parameterized queries
- **XSS protection**: Input sanitization

## 🌐 Production Deployment

The system is designed for production deployment with:
- **Docker containerization**
- **Health monitoring**
- **Automatic restarts**
- **Environment-based configuration**
- **Nginx reverse proxy**
- **Database persistence**

## 📈 Future Enhancements

- **Real-time notifications**: WebSocket integration for live updates
- **Advanced analytics**: Charts and trend analysis
- **Mobile app**: React Native implementation
- **User management**: Multi-user support with authentication
- **Export functionality**: Data export to Excel/PDF
- **Email alerts**: Automated notifications for status changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

For questions or support, please open an issue in the GitHub repository.

---

**Built with ❤️ for the Vietnamese stock market community**
