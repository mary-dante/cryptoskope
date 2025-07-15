'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
      eur: number;
      gbp: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
  };
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
    };
  };
  platforms: Record<string, string>;
  categories: string[];
}

export default function CoinPage() {
  const params = useParams();
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await fetch(`/api/coin/${params.id}`);
        const data = await response.json();
        setCoinData(data);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [params.id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!coinData) {
    return <div className="flex items-center justify-center min-h-screen">Coin not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <img src={coinData.image.large} alt={coinData.name} className="w-16 h-16" />
        <div>
          <h1 className="text-3xl font-bold">{coinData.name}</h1>
          <p className="text-gray-500 uppercase">{coinData.symbol}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${coinData.market_data.current_price.usd.toLocaleString()}</p>
            <p className="text-sm text-gray-500">EUR: €{coinData.market_data.current_price.eur.toLocaleString()}</p>
            <p className="text-sm text-gray-500">GBP: £{coinData.market_data.current_price.gbp.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${coinData.market_data.market_cap.usd.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>24h Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${coinData.market_data.total_volume.usd.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              24h: <span className={coinData.market_data.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                {coinData.market_data.price_change_percentage_24h.toFixed(2)}%
              </span>
            </p>
            <p className="text-sm">
              7d: <span className={coinData.market_data.price_change_percentage_7d >= 0 ? 'text-green-500' : 'text-red-500'}>
                {coinData.market_data.price_change_percentage_7d.toFixed(2)}%
              </span>
            </p>
            <p className="text-sm">
              30d: <span className={coinData.market_data.price_change_percentage_30d >= 0 ? 'text-green-500' : 'text-red-500'}>
                {coinData.market_data.price_change_percentage_30d.toFixed(2)}%
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>About {coinData.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: coinData.description.en }} />
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {coinData.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coinData.links.homepage[0] && (
                  <div>
                    <h3 className="font-semibold">Homepage</h3>
                    <a href={coinData.links.homepage[0]} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {coinData.links.homepage[0]}
                    </a>
                  </div>
                )}
                {coinData.links.blockchain_site[0] && (
                  <div>
                    <h3 className="font-semibold">Blockchain Explorer</h3>
                    <a href={coinData.links.blockchain_site[0]} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {coinData.links.blockchain_site[0]}
                    </a>
                  </div>
                )}
                {coinData.links.twitter_screen_name && (
                  <div>
                    <h3 className="font-semibold">Twitter</h3>
                    <a href={`https://twitter.com/${coinData.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      @{coinData.links.twitter_screen_name}
                    </a>
                  </div>
                )}
                {coinData.links.repos_url.github[0] && (
                  <div>
                    <h3 className="font-semibold">GitHub</h3>
                    <a href={coinData.links.repos_url.github[0]} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {coinData.links.repos_url.github[0]}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms">
          <Card>
            <CardHeader>
              <CardTitle>Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(coinData.platforms).map(([platform, address]) => (
                  <div key={platform}>
                    <h3 className="font-semibold capitalize">{platform}</h3>
                    <p className="text-sm text-gray-500 break-all">{address}</p>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 