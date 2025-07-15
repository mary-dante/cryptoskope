'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatMarketCap, formatVolume, formatPercentage } from '@/lib/utils';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MarketData {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    total_market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    market_cap_percentage: {
      btc: number;
      eth: number;
      [key: string]: number;
    };
  };
}

export default function MarketPage() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market');
        const data = await response.json();
        setMarketData(data);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!marketData) {
    return <div className="flex items-center justify-center min-h-screen">Error loading market data</div>;
  }

  const { data } = marketData;
  const topCoins = Object.entries(data.market_cap_percentage)
    .slice(0, 10) // Show top 10 coins instead of 5
    .map(([coin, percentage]) => ({
      coin: coin.toUpperCase(),
      percentage,
    }));

  const chartData = {
    labels: topCoins.map((coin) => coin.coin),
    datasets: [
      {
        label: 'Market Cap %',
        data: topCoins.map((coin) => coin.percentage),
        backgroundColor: [
          '#F7931A', // BTC
          '#627EEA', // ETH
          '#F0B90B', // BNB
          '#26A17B', // USDT
          '#345D9D', // XRP
          '#E6007A', // SOL
          '#3E73C4', // ADA
          '#C4A484', // DOGE
          '#2D2D2D', // STETH
          '#2775CA', // USDC
        ],
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            return `${context.raw}%`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
          callback: function(value: any) {
            return value + '%';
          }
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#fff',
          font: {
            size: 12,
            weight: 'bold' as const,
          }
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Market Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatMarketCap(data.total_market_cap.usd)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>24h Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatVolume(data.total_volume.usd)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>BTC Dominance</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={data.market_cap_percentage.btc} className="h-4" />
            <p className="text-sm mt-2">{formatPercentage(data.market_cap_percentage.btc)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ETH Dominance</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={data.market_cap_percentage.eth} className="h-4" />
            <p className="text-sm mt-2">{formatPercentage(data.market_cap_percentage.eth)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Cryptocurrencies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.active_cryptocurrencies.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Markets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.markets.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Market Cap Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            {topCoins.map((coin) => (
              <div key={coin.coin} className="flex items-center space-x-2 bg-gray-800/50 p-2 rounded-lg">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: chartData.datasets[0].backgroundColor[
                      topCoins.findIndex((c) => c.coin === coin.coin)
                    ],
                  }}
                />
                <span className="text-sm text-white font-medium">
                  {coin.coin}: {formatPercentage(coin.percentage)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 