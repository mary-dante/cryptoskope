"use client";

import React, { useEffect, useState } from 'react';
import { ThetaDexService } from '@/lib/services/thetaDexService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface PriceData {
    timestamp: number;
    price: number;
}

const LOCAL_STORAGE_KEY = 'wtfuel_price_history';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 rounded-lg border shadow-lg">
                <p className="text-sm font-medium">{new Date(label).toLocaleString()}</p>
                <p className="text-sm text-primary">${payload[0].value.toFixed(6)}</p>
            </div>
        );
    }
    return null;
};

export const ThetaDexPriceFeed: React.FC<{ onPriceUpdate?: (price: number) => void }> = ({ onPriceUpdate }) => {
    const [price, setPrice] = useState<number>(0);
    const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [debug, setDebug] = useState<string>("");

    // Load price history from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            try {
                const parsed: PriceData[] = JSON.parse(stored);
                setPriceHistory(parsed);
                if (parsed.length > 0) {
                    setPrice(parsed[parsed.length - 1].price);
                    if (onPriceUpdate) onPriceUpdate(parsed[parsed.length - 1].price);
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
    }, []);

    useEffect(() => {
        const dexService = new ThetaDexService();
        let unsub: (() => void) | null = null;
        let isMounted = true;

        async function fetchInitialPrice() {
            try {
                setDebug('Fetching initial price...');
                const initialPrice = await dexService.getTokenPrice();
                setDebug('Initial price fetched: ' + initialPrice);
                if (!isMounted) return;
                setPrice(initialPrice);
                if (onPriceUpdate) onPriceUpdate(initialPrice);
                setPriceHistory(prev => {
                    if (prev.length > 0 && Math.abs(prev[prev.length - 1].price - initialPrice) < 1e-12) {
                        return prev;
                    }
                    const newHistory = [...prev, { timestamp: Date.now(), price: initialPrice }].slice(-100);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory));
                    return newHistory;
                });
                setIsLoading(false);
                setError(null);
            } catch (err: any) {
                setError('Failed to fetch initial price: ' + (err?.message || JSON.stringify(err)));
                setDebug('Error: ' + (err?.message || JSON.stringify(err)));
                setIsLoading(false);
            }
        }

        fetchInitialPrice();

        try {
            unsub = dexService.subscribeToPriceUpdates((newPrice) => {
                if (!isMounted) return;
                setPrice(newPrice);
                if (onPriceUpdate) onPriceUpdate(newPrice);
                setPriceHistory(prev => {
                    const newHistory = [...prev, { timestamp: Date.now(), price: newPrice }].slice(-100);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory));
                    return newHistory;
                });
            });
        } catch (err: any) {
            setError('Failed to subscribe to price updates: ' + (err?.message || JSON.stringify(err)));
            setDebug('Error subscribing: ' + (err?.message || JSON.stringify(err)));
        }

        return () => {
            isMounted = false;
            if (unsub) unsub();
            dexService.disconnect();
        };
    }, []);

    if (isLoading) {
        return (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Loading price data...
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[400px] flex items-center justify-center text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="h-[400px]">
            {priceHistory.length < 2 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                    Waiting for more data to display chart...
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke="rgba(255,255,255,0.1)"
                            vertical={false}
                        />
                        <XAxis 
                            dataKey="timestamp" 
                            tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.7)' }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                        />
                        <YAxis 
                            domain={['auto', 'auto']}
                            tickFormatter={(value) => `$${value.toFixed(6)}`}
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.7)' }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                            width={100}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}; 