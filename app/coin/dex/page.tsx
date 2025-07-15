"use client";

import { ThetaDexPriceFeed } from '@/components/ThetaDexPriceFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { useState } from 'react';
import { ThetaChainStatus } from '@/components/ThetaChainStatus';

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
    logo: "https://assets.coingecko.com/coins/images/14888/small/theta-token-logo.png",
    dummy_price: 1.03
  },
  {
    symbol: "TDROP",
    name: "ThetaDrop",
    address: "0x0000000000000000000000000000000000000000",
    pairAddress: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/14888/small/theta-token-logo.png",
    dummy_price: 0.002
  },
  {
    symbol: "TNT20",
    name: "Theta NFT Token",
    address: "0x0000000000000000000000000000000000000000",
    pairAddress: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/14888/small/theta-token-logo.png",
    dummy_price: 0.093
  },
  {
    symbol: "TUSD",
    name: "Theta USD",
    address: "0x0000000000000000000000000000000000000000",
    pairAddress: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/14888/small/theta-token-logo.png",
    dummy_price: 0.99
  },
  {
    symbol: "TETH",
    name: "Theta ETH",
    address: "0x0000000000000000000000000000000000000000",
    pairAddress: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/14888/small/theta-token-logo.png",
    dummy_price: 1850.77
  }
];

export default function WTFUELPage() {
    const [price, setPrice] = useState<number | null>(null);
    const [selectedToken, setSelectedToken] = useState(THETA_TOKENS[0]);
    return (
        <main className="min-h-screen py-6 relative">
            <BackgroundBeams />
            <div className="container mx-auto max-w-7xl px-4 relative z-10">
                <h1 className="text-2xl font-bold mb-6">Theta Ecosystem Tokens</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tokens</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {THETA_TOKENS.map((token) => (
                                        token.symbol === 'WTFUEL' ? (
                                            <button
                                                key={token.symbol}
                                                className={`w-full text-left p-3 rounded-lg transition-colors ${selectedToken.symbol === token.symbol ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'} cursor-pointer`}
                                                onClick={() => setSelectedToken(token)}
                                            >
                                                <div className={`font-medium${selectedToken.symbol === token.symbol ? ' font-bold' : ''}`}>{token.name}</div>
                                                <div className="text-sm text-muted-foreground font-normal">
                                                    {price !== null ? `$${price.toLocaleString()}` : 'N/A'}
                                                </div>
                                            </button>
                                        ) : (
                                            <div
                                                key={token.symbol}
                                                className={`w-full text-left p-3 rounded-lg transition-colors opacity-60 cursor-not-allowed select-none`}
                                            >
                                                <div className={`font-medium${selectedToken.symbol === token.symbol ? ' font-bold' : ''}`}>{token.name}</div>
                                                <div className="text-sm text-muted-foreground font-normal">
                                                    {token.dummy_price !== undefined ? `$${token.dummy_price}` : 'N/A'}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {selectedToken ? `${selectedToken.name} (${selectedToken.symbol})` : 'Select a token'}
                                    <span className="ml-3 px-2 py-1 text-xs rounded bg-blue-900 text-blue-200 border border-blue-400 align-middle">DEX Integration</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ThetaDexPriceFeed onPriceUpdate={setPrice} />
                            </CardContent>
                        </Card>
                        <div className="mt-4">
                            <ThetaChainStatus />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
} 