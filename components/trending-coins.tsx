"use client"

import { formatCurrency, formatPercentage } from "@/lib/mockData"
import { SparklineChart } from "./sparkline-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import Image from "next/image"
import { useAutoRefresh } from "@/hooks/useAutoRefresh"
import { CoinDetailsDrawer } from "./coin-details-drawer"
import { useState } from "react"

interface TrendingCoinItem {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  price_btc: number;
  score: number;
  data: {
    price: number;
    price_btc: string;
    price_change_percentage_24h: {
      usd: number;
      [key: string]: number;
    };
    market_cap: string;
    market_cap_btc: string;
    total_volume: string;
    total_volume_btc: string;
    sparkline: string;
    content: {
      title: string;
      description: string;
    } | null;
  };
}

interface TrendingResponse {
  coins: { item: TrendingCoinItem }[];
  nfts: any[];
  categories: any[];
}

const fetchTrendingData = async (): Promise<TrendingCoinItem[]> => {
  try {
    const response = await fetch('/api/trending', {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || 
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }

    const data: TrendingResponse = await response.json();
    
    if (!data.coins || !Array.isArray(data.coins)) {
      throw new Error('Invalid data format received from the API');
    }
    
    return data.coins.map(coin => coin.item);
  } catch (error) {
    console.error('Error fetching trending data:', error);
    throw error;
  }
};

export function TrendingCoins() {
  const { data: trendingCoins, loading, error } = useAutoRefresh(fetchTrendingData, 30000);
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  if (loading && !trendingCoins) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Trending Coins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Trending Coins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-red-500">Error loading data: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Trending Coins</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendingCoins?.map((coin) => {
            const isPositive = coin.data.price_change_percentage_24h.usd > 0
            const priceChangeColor = isPositive ? "text-green-500" : "text-red-500"
            const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon
            
            return (
              <div 
                key={coin.id} 
                className="flex items-center gap-3 p-2 hover:bg-secondary/50 rounded-md transition-colors cursor-pointer"
                onClick={() => setSelectedCoinId(coin.id)}
              >
                <div className="w-8 h-8 relative shrink-0">
                  <Image 
                    src={coin.thumb} 
                    alt={coin.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=random`;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <div className="font-medium truncate">{coin.name}</div>
                    <div className="text-right font-semibold">
                      {formatCurrency(coin.data.price, 'USD', coin.data.price < 10 ? 4 : 2)}
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <div className="text-sm text-muted-foreground">{coin.symbol}</div>
                    <div className={`text-sm flex items-center gap-1 ${priceChangeColor}`}>
                      <Icon className="h-3 w-3" />
                      {formatPercentage(coin.data.price_change_percentage_24h.usd)}
                    </div>
                  </div>
                </div>
                {coin.data.sparkline && (
                  <div className="w-20 h-10">
                    <img 
                      src={coin.data.sparkline} 
                      alt={`${coin.name} price chart`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
      <CoinDetailsDrawer 
        coinId={selectedCoinId} 
        onClose={() => setSelectedCoinId(null)} 
      />
    </Card>
  )
}