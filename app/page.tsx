import { CryptoTable } from "@/components/crypto-table"
import { GaugeChart } from "@/components/gauge-chart"
import { MarketStats } from "@/components/market-stats"
import { NewsFeed } from "@/components/news-feed"
import { TrendingCoins } from "@/components/trending-coins"
import { BackgroundBeams } from "@/components/ui/background-beams"

export default function Home() {
  return (
    <main className="min-h-screen py-6 relative">
      <BackgroundBeams />
      <div className="container mx-auto max-w-[1920px] px-4 relative z-10">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MarketStats />
            
            <div className="mt-6">
              <CryptoTable />
            </div>
          </div>
          
          <div className="space-y-6">
            <TrendingCoins />
            <GaugeChart />
          </div>
        </div>
      </div>
    </main>
  )
}