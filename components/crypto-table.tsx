"use client"

import { useState } from "react"
import { formatCurrency, formatCompactNumber, formatPercentage, getPriceChangeColor, Crypto } from "@/lib/mockData"
import { SparklineChart } from "./sparkline-chart"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "./ui/button"
import { useAutoRefresh } from "@/hooks/useAutoRefresh"
import { CoinDetailsDrawer } from "./coin-details-drawer"

type SortField = 'name' | 'price' | 'marketCap' | 'volume' | 'priceChange.24h' | null
type SortDirection = 'asc' | 'desc'

interface CoinGeckoCrypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  sparkline_in_7d: {
    price: number[];
  };
}

// Real API call function
const fetchCryptoData = async (): Promise<Crypto[]> => {
  try {
    const response = await fetch('/api/crypto', {
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

    const data: CoinGeckoCrypto[] = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No data received from the API');
    }
    
    // Transform the data to match our component's structure
    return data.map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      iconUrl: coin.image,
      price: coin.current_price,
      marketCap: coin.market_cap,
      volume: coin.total_volume,
      supply: 0, // Not provided by the API
      priceChange: {
        "1h": coin.price_change_percentage_1h_in_currency || 0,
        "24h": coin.price_change_percentage_24h_in_currency || 0,
        "7d": coin.price_change_percentage_7d_in_currency || 0
      },
      sparkline: coin.sparkline_in_7d?.price || []
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    // If it's a rate limit error, wait and retry
    if (error instanceof Error && error.message.includes('429')) {
      await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 60 seconds
      return fetchCryptoData(); // Retry
    }
    throw error;
  }
};

export function CryptoTable() {
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null)
  
  // Use auto-refresh hook with 60 second interval
  const { data: cryptoData, loading, error } = useAutoRefresh(fetchCryptoData, 30000);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedCryptos = [...(cryptoData || [])].sort((a, b) => {
    if (!sortField) return 0
    
    let comparison = 0
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name)
    } else if (sortField === 'price') {
      comparison = a.price - b.price
    } else if (sortField === 'marketCap') {
      comparison = a.marketCap - b.marketCap
    } else if (sortField === 'volume') {
      comparison = a.volume - b.volume
    } else if (sortField === 'priceChange.24h') {
      comparison = a.priceChange['24h'] - b.priceChange['24h']
    }
    
    return sortDirection === 'asc' ? comparison : -comparison
  })

  if (loading && !cryptoData) {
    return <div className="p-4 text-center">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading data: {error.message}</div>
  }

  return (
    <div className="rounded-md border bg-card">
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Cryptocurrency Prices</h3>
        {loading && <div className="text-sm text-muted-foreground">Refreshing...</div>}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">#</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="hover:bg-transparent p-0 h-auto font-medium flex items-center gap-1"
                  onClick={() => handleSort('name')}
                >
                  Name
                  <ArrowUpDownIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button 
                  variant="ghost" 
                  className="hover:bg-transparent p-0 h-auto font-medium flex items-center gap-1 ml-auto"
                  onClick={() => handleSort('price')}
                >
                  Price
                  <ArrowUpDownIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button 
                  variant="ghost" 
                  className="hover:bg-transparent p-0 h-auto font-medium flex items-center gap-1 ml-auto"
                  onClick={() => handleSort('priceChange.24h')}
                >
                  24h %
                  <ArrowUpDownIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TableHead>
              <TableHead className="text-right hidden md:table-cell">
                <Button 
                  variant="ghost" 
                  className="hover:bg-transparent p-0 h-auto font-medium flex items-center gap-1 ml-auto"
                  onClick={() => handleSort('marketCap')}
                >
                  Market Cap
                  <ArrowUpDownIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TableHead>
              <TableHead className="text-right hidden md:table-cell">
                <Button 
                  variant="ghost" 
                  className="hover:bg-transparent p-0 h-auto font-medium flex items-center gap-1 ml-auto"
                  onClick={() => handleSort('volume')}
                >
                  Volume (24h)
                  <ArrowUpDownIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TableHead>
              <TableHead className="w-[100px] hidden md:table-cell">Last 7 Days</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCryptos.map((crypto, index) => {
              const isPositive = crypto.priceChange['24h'] > 0
              const priceChangeColor = isPositive ? "text-green-500" : "text-red-500"
              const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon
              
              return (
                <TableRow 
                  key={crypto.id} 
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedCoinId(crypto.id)}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 relative shrink-0">
                        <Image 
                          src={crypto.iconUrl} 
                          alt={crypto.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${crypto.symbol}&background=random`;
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(crypto.price, 'USD', crypto.price < 10 ? 4 : 2)}
                  </TableCell>
                  <TableCell className={`text-right ${priceChangeColor}`}>
                    <div className="flex items-center justify-end gap-1">
                      <Icon className="h-3.5 w-3.5" />
                      {formatPercentage(crypto.priceChange['24h'])}
                    </div>
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    ${formatCompactNumber(crypto.marketCap)}
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    ${formatCompactNumber(crypto.volume)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <SparklineChart 
                      data={crypto.sparkline} 
                      color={isPositive ? "rgba(34, 197, 94, 0.7)" : "rgba(239, 68, 68, 0.7)"}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <CoinDetailsDrawer 
        coinId={selectedCoinId} 
        onClose={() => setSelectedCoinId(null)} 
      />
    </div>
  )
}