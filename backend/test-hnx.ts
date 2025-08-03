import { HNXScrapingService } from './src/services/HNXScrapingService';
import { StockData } from './src/types';

async function testHNXScraping() {
  console.log('Testing HNX Scraping Service...');
  
  const hnxService = new HNXScrapingService();
  
  try {
    console.log('Attempting to scrape HNX restricted stocks...');
    const stocks: StockData[] = await hnxService.scrapeRestrictedStocks();
    
    console.log(`Successfully scraped ${stocks.length} stocks:`);
    stocks.forEach((stock: StockData, index: number) => {
      console.log(`${index + 1}. ${stock.symbol} - ${stock.name} (${stock.status})`);
      if (stock.restrictionReason) {
        console.log(`   Reason: ${stock.restrictionReason}`);
      }
    });
    
    if (stocks.length === 0) {
      console.log('No restricted stocks found. This could mean:');
      console.log('1. There are currently no restricted stocks on HNX');
      console.log('2. The website structure has changed');
      console.log('3. Access is being blocked');
    }
    
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await hnxService.closeBrowser();
    console.log('Browser closed. Test completed.');
  }
}

// Run the test
testHNXScraping().catch(console.error);