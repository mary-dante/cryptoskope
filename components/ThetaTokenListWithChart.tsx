"use client";
import React, { useEffect, useState } from "react";
import { ThetaDexService } from "@/lib/services/thetaDexService";

// Token list (add more as needed)
const THETA_TOKENS = [
  {
    symbol: "WTFUEL",
    name: "Wrapped TFUEL",
    address: "0x338FEBa9CC710991EA30fFD44274BC0d17b48b2A",
    pairAddress: "0x2D65cf52EC55702eAee7ABF38e789e8E0048D7dD",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/14888/small/theta-token-logo.png"
  },
  {
    symbol: "THETA",
    name: "Theta Network",
    address: "0x4Dc08B15Ea0E10B96c41Aec22Fab934Ba15c983e",
    pairAddress: "0x2D65cf52EC55702eAee7ABF38e789e8E0048D7dD",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/14888/small/theta-token-logo.png"
  },
  // Add more tokens here as needed
];

interface PriceData {
  timestamp: number;
  price: number;
}

export default function ThetaTokenListWithChart() {
  const [selectedToken, setSelectedToken] = useState(THETA_TOKENS[0]);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const dexService = new ThetaDexService();

  useEffect(() => {
    setPriceData([]);
    setCurrentPrice(null);
    setLoading(true);

    const cleanup = dexService.subscribeToPriceUpdates(async (price) => {
      setCurrentPrice(price);
      setPriceData((prev) => {
        const newData = [...prev, { timestamp: Date.now(), price }];
        return newData.slice(-100);
      });
      setLoading(false);
    });

    return () => cleanup();
    // eslint-disable-next-line
  }, [selectedToken]);

  return (
    <div className="flex gap-8 p-8">
      {/* Left: Token List */}
      <div className="w-80 bg-black rounded-xl p-6 flex flex-col gap-2">
        <h2 className="text-lg font-bold mb-4 text-white">Tokens</h2>
        {THETA_TOKENS.map((token) => (
          <button
            key={token.symbol}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedToken.symbol === token.symbol
                ? "bg-white text-black font-bold"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
            onClick={() => setSelectedToken(token)}
          >
            <div className="font-medium">{token.name}</div>
            <div className="text-sm text-gray-400">
              {selectedToken.symbol === token.symbol && currentPrice !== null
                ? `$${currentPrice.toFixed(3)}`
                : ""}
            </div>
          </button>
        ))}
      </div>
      {/* Right: Chart */}
      <div className="flex-1 bg-black rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4 text-white">
          {selectedToken.name} ({selectedToken.symbol})
        </h2>
        <div className="h-[400px] bg-gray-900 rounded-lg p-4">
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : (
            <svg width="100%" height="100%">
              {/* Simple SVG line chart for demonstration; replace with recharts or chart.js for production */}
              {priceData.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#4fd1c5"
                  strokeWidth="2"
                  points={priceData
                    .map((d, i) => {
                      const x = (i / (priceData.length - 1)) * 600;
                      const min = Math.min(...priceData.map((d) => d.price));
                      const max = Math.max(...priceData.map((d) => d.price));
                      const y = 350 - ((d.price - min) / (max - min || 1)) * 350;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />
              )}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
} 