'use client'

import { formatCompactNumber, formatPercentage, marketStats } from "@/lib/mockData"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const PIE_COLORS = ["#F7931A", "#627EEA", "#8884d8"] // BTC orange, ETH blue, Others purple

export function MarketStats() {
  const marketDistributionData = [
    { name: "BTC", value: marketStats.btcDominance },
    { name: "ETH", value: marketStats.ethDominance },
    { name: "Others", value: 100 - marketStats.btcDominance - marketStats.ethDominance }
  ]

  const fearGreedIndex = 62; // Mock value (0-100)
  let fgLabel = "Neutral";
  let fgColor = "bg-yellow-400";
  if (fearGreedIndex < 25) { fgLabel = "Extreme Fear"; fgColor = "bg-red-500"; }
  else if (fearGreedIndex < 50) { fgLabel = "Fear"; fgColor = "bg-orange-400"; }
  else if (fearGreedIndex < 75) { fgLabel = "Greed"; fgColor = "bg-green-400"; }
  else { fgLabel = "Extreme Greed"; fgColor = "bg-emerald-500"; }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-card rounded-lg p-4 shadow border border-border">
        <h3 className="text-lg font-medium mb-4">Market Overview</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Market Cap</span>
            <span className="font-medium">${formatCompactNumber(marketStats.totalMarketCap)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">24h Volume</span>
            <span className="font-medium">${formatCompactNumber(marketStats.totalVolume24h)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">BTC Dominance</span>
            <span className="font-medium">{formatPercentage(marketStats.btcDominance)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">ETH Dominance</span>
            <span className="font-medium">{formatPercentage(marketStats.ethDominance)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg p-4 shadow border border-border">
        <h3 className="text-lg font-medium mb-4">Market Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Active Cryptocurrencies</span>
            <span className="font-medium">{marketStats.totalCryptos.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Active Exchanges</span>
            <span className="font-medium">{marketStats.totalExchanges.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 shadow border border-border md:col-span-2 lg:col-span-1 flex flex-col items-center justify-center">
        <h3 className="text-lg font-medium mb-3">Fear & Greed Index</h3>
        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full h-6 bg-gray-800 rounded-full overflow-hidden mb-2">
            <div className={`h-full ${fgColor}`} style={{ width: `${fearGreedIndex}%` }}></div>
          </div>
          <div className="flex items-center justify-between w-full text-sm font-semibold">
            <span className="text-red-500">0</span>
            <span className="text-yellow-400">25</span>
            <span className="text-yellow-400">50</span>
            <span className="text-green-400">75</span>
            <span className="text-emerald-500">100</span>
          </div>
          <div className="mt-4 text-3xl font-bold" style={{ color: fgColor.replace('bg-', 'text-') }}>{fearGreedIndex}</div>
          <div className="text-base font-medium text-muted-foreground">{fgLabel}</div>
        </div>
      </div>
    </div>
  )
}