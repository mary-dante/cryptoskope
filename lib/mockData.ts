import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
  price: number;
  marketCap: number;
  volume: number;
  supply: number;
  priceChange: {
    "1h": number;
    "24h": number;
    "7d": number;
  };
  sparkline: number[];
}

export interface MarketStats {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  ethDominance: number;
  totalCryptos: number;
  totalExchanges: number;
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
  price: number;
  priceChange24h: number;
  sparkline: number[];
}

export interface FearGreedData {
  value: number;
  classification: "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed";
  timestamp: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl: string;
}

// Generate sparkline data for charts
const generateSparkline = (length: number, volatility: number = 0.05, trend: number = 0): number[] => {
  const result: number[] = [];
  let value = 100 + Math.random() * 50;
  
  for (let i = 0; i < length; i++) {
    const change = (Math.random() - 0.5 + trend) * volatility * value;
    value += change;
    value = Math.max(value, 10); // Ensure value doesn't go too low
    result.push(Number(value.toFixed(2)));
  }
  
  return result;
};

// Generate random price change
const generatePriceChange = (min: number = -15, max: number = 15): number => {
  return Number((min + Math.random() * (max - min)).toFixed(2));
};

// Generate cryptocurrencies mock data
export const cryptos: Crypto[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    price: 104564.02,
    marketCap: 2076980369876,
    volume: 44655303390,
    supply: 19.86,
    priceChange: {
      "1h": 0.16,
      "24h": 0.94,
      "7d": 9.49
    },
    sparkline: generateSparkline(24, 0.03, 0.01)
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    price: 2514.29,
    marketCap: 302056780123,
    volume: 21567890123,
    supply: 120.15,
    priceChange: {
      "1h": 0.25,
      "24h": 4.88,
      "7d": 7.32
    },
    sparkline: generateSparkline(24, 0.04, 0.015)
  },
  {
    id: "binancecoin",
    name: "BNB",
    symbol: "BNB",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    price: 700.12,
    marketCap: 107865432100,
    volume: 2567843210,
    supply: 153.86,
    priceChange: {
      "1h": -0.12,
      "24h": 2.34,
      "7d": 5.67
    },
    sparkline: generateSparkline(24, 0.035, 0.01)
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
    price: 143.67,
    marketCap: 65432178900,
    volume: 4312567890,
    supply: 455.23,
    priceChange: {
      "1h": 0.45,
      "24h": -1.23,
      "7d": 8.91
    },
    sparkline: generateSparkline(24, 0.06, -0.005)
  },
  {
    id: "xrp",
    name: "XRP",
    symbol: "XRP",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
    price: 0.7321,
    marketCap: 40123456789,
    volume: 1765432109,
    supply: 54678.45,
    priceChange: {
      "1h": -0.32,
      "24h": 1.21,
      "7d": 3.45
    },
    sparkline: generateSparkline(24, 0.045, 0.005)
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png",
    price: 0.4563,
    marketCap: 16123456789,
    volume: 645789123,
    supply: 35389.21,
    priceChange: {
      "1h": 0.21,
      "24h": 3.21,
      "7d": -1.34
    },
    sparkline: generateSparkline(24, 0.05, 0)
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png",
    price: 0.1234,
    marketCap: 16987654321,
    volume: 1324567890,
    supply: 137593.21,
    priceChange: {
      "1h": 0.43,
      "24h": 2.11,
      "7d": 6.54
    },
    sparkline: generateSparkline(24, 0.07, 0.01)
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png",
    price: 7.84,
    marketCap: 10123456789,
    volume: 521345678,
    supply: 1289.42,
    priceChange: {
      "1h": -0.51,
      "24h": -2.34,
      "7d": 4.32
    },
    sparkline: generateSparkline(24, 0.055, -0.005)
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    symbol: "ARB",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png",
    price: 0.4646,
    marketCap: 5912345678,
    volume: 423456789,
    supply: 12723.45,
    priceChange: {
      "1h": 0.34,
      "24h": 17.08,
      "7d": 21.32
    },
    sparkline: generateSparkline(24, 0.08, 0.02)
  },
  {
    id: "pi",
    name: "PI",
    symbol: "PI",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/24091.png",
    price: 1.05,
    marketCap: 4512345678,
    volume: 323456789,
    supply: 4298.32,
    priceChange: {
      "1h": 1.23,
      "24h": 44.91,
      "7d": 72.65
    },
    sparkline: generateSparkline(24, 0.09, 0.04)
  },
];

// Generate trending coins data
export const trendingCoins: TrendingCoin[] = [
  {
    id: "pi",
    name: "PI",
    symbol: "PI",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/24091.png",
    price: 1.05,
    priceChange24h: 44.91,
    sparkline: generateSparkline(24, 0.09, 0.04)
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    price: 2514.29,
    priceChange24h: 4.88,
    sparkline: generateSparkline(24, 0.04, 0.015)
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    symbol: "ARB",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png",
    price: 0.4646,
    priceChange24h: 17.08,
    sparkline: generateSparkline(24, 0.08, 0.02)
  },
  {
    id: "ethereum-finance",
    name: "Ethereum Finance",
    symbol: "ETHFI",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/28495.png",
    price: 1.1,
    priceChange24h: 41.55,
    sparkline: generateSparkline(24, 0.1, 0.035)
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    price: 104564.02,
    priceChange24h: 0.94,
    sparkline: generateSparkline(24, 0.03, 0.01)
  }
];

// Generate market stats
export const marketStats: MarketStats = {
  totalMarketCap: 3330000000000,
  totalVolume24h: 138670000000,
  btcDominance: 62.2,
  ethDominance: 9.1,
  totalCryptos: 15680,
  totalExchanges: 815
};

// Generate fear and greed data
export const fearGreedData: FearGreedData = {
  value: 75,
  classification: "Greed",
  timestamp: new Date().toISOString()
};

// Generate news items
export const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "$BNB price eyes a bullish breakout past $700 amid two bullish patterns as Binance hits new ATH",
    summary: "BNB price is showing bullish momentum with several technical patterns indicating a potential breakout above $700.",
    source: "CoinTelegraph",
    url: "#",
    publishedAt: "14 hours ago",
    imageUrl: "https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=320"
  },
  {
    id: "2",
    title: "Altseason is coming, 40% daily gains to become 'new normal' — Analyst",
    summary: "Crypto analysts predict an upcoming altcoin season with some tokens potentially seeing daily gains of up to 40%.",
    source: "CoinTelegraph",
    url: "#",
    publishedAt: "3 hours ago",
    imageUrl: "https://images.pexels.com/photos/6780789/pexels-photo-6780789.jpeg?auto=compress&cs=tinysrgb&w=320"
  },
  {
    id: "3",
    title: "Bitcoin breaks $105K as institutional adoption continues to grow",
    summary: "Bitcoin has reached a new all-time high above $105,000 as major financial institutions increase their crypto holdings.",
    source: "CryptoNews",
    url: "#",
    publishedAt: "1 day ago",
    imageUrl: "https://images.pexels.com/photos/6772076/pexels-photo-6772076.jpeg?auto=compress&cs=tinysrgb&w=320"
  },
  {
    id: "4",
    title: "New regulatory framework proposed to support crypto innovation",
    summary: "Government officials have announced plans for a regulatory framework designed to foster innovation in the cryptocurrency space.",
    source: "BlockchainToday",
    url: "#",
    publishedAt: "2 days ago",
    imageUrl: "https://images.pexels.com/photos/8370368/pexels-photo-8370368.jpeg?auto=compress&cs=tinysrgb&w=320"
  },
];

// Helper functions for formatting
export const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

export const formatCurrency = (num: number, currency: string = 'USD', decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

export const formatCompactNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2
  }).format(num);
};

export const formatPercentage = (num: number): string => {
  return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
};

export const getPriceChangeColor = (change: number): string => {
  return change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-500';
};

export const getPriceChangeIcon = (change: number) => {
  return change > 0 ? ArrowUpIcon : change < 0 ? ArrowDownIcon : null;
};