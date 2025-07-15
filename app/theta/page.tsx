"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createChart, ColorType, UTCTimestamp, IChartApi, ISeriesApi, CandlestickData, LineData, Time } from 'lightweight-charts';
import { BackgroundBeams } from "@/components/ui/background-beams";
// import { chartjs } from 'theta-tv-charts'; 

interface Token {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export default function ThetaPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [ohlcData, setOHLCData] = useState<OHLCData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [showVolume, setShowVolume] = useState(true);
  const [showMA, setShowMA] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [showMACD, setShowMACD] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchTokens();
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted && selectedToken) {
      fetchOHLCData(selectedToken.id);
    }
  }, [mounted, selectedToken, timeRange]);

  const fetchTokens = async () => {
    try {
      const response = await fetch('/api/crypto');
      if (!response.ok) throw new Error('Failed to fetch tokens');
      const data = await response.json();
      setTokens(data);
      if (data.length > 0) {
        setSelectedToken(data[0]);
      }
    } catch (err) {
      setError('Failed to fetch tokens');
    } finally {
      setLoading(false);
    }
  };

  const fetchOHLCData = async (tokenId: string) => {
    try {
      // Convert timeRange to days
      const daysMap = {
        '1D': 1,
        '1W': 7,
        '1M': 30,
        '3M': 90,
        '1Y': 365
      };
      const days = daysMap[timeRange];
      
      const response = await fetch(`/api/crypto/ohlc?id=${tokenId}&days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch OHLC data');
      const data = await response.json();
      // Map CoinGecko OHLC array to lightweight-charts format
      const mapped = Array.isArray(data)
        ? data.map((item: number[]) => ({
            time: Math.floor(item[0] / 1000), // convert ms to seconds
            open: item[1],
            high: item[2],
            low: item[3],
            close: item[4],
            volume: item[5],
          }))
        : [];
      setOHLCData(mapped);
    } catch (err) {
      setError('Failed to fetch OHLC data');
    }
  };

  const calculateMA = (data: OHLCData[], period: number) => {
    return data.map((item, index) => {
      if (index < period - 1) return null;
      const sum = data.slice(index - period + 1, index + 1).reduce((acc, curr) => acc + curr.close, 0);
      return {
        time: item.time as UTCTimestamp,
        value: sum / period
      };
    }).filter((item): item is { time: UTCTimestamp; value: number } => item !== null);
  };

  const calculateRSI = (data: OHLCData[], period: number = 14) => {
    const changes = data.map((item, index) => {
      if (index === 0) return { gain: 0, loss: 0 };
      const change = item.close - data[index - 1].close;
      return {
        gain: change > 0 ? change : 0,
        loss: change < 0 ? -change : 0
      };
    });

    const avgGain = changes.slice(1).reduce((acc, curr) => acc + curr.gain, 0) / period;
    const avgLoss = changes.slice(1).reduce((acc, curr) => acc + curr.loss, 0) / period;

    return data.map((item, index) => {
      if (index < period) return null;
      const rs = avgGain / avgLoss;
      return {
        time: item.time as UTCTimestamp,
        value: 100 - (100 / (1 + rs))
      };
    }).filter((item): item is { time: UTCTimestamp; value: number } => item !== null);
  };

  const calculateMACD = (data: OHLCData[]) => {
    const ema12 = calculateEMA(data, 12);
    const ema26 = calculateEMA(data, 26);
    
    const validEma12 = ema12.filter((item): item is { time: UTCTimestamp; value: number } => item !== null);
    const validEma26 = ema26.filter((item): item is { time: UTCTimestamp; value: number } => item !== null);
    
    const minLength = Math.min(validEma12.length, validEma26.length);
    
    const macdLine = validEma12.slice(0, minLength).map((item, index) => ({
      time: item.time,
      value: item.value - validEma26[index].value
    }));
    
    const signalLine = calculateEMA(macdLine, 9);
    const histogram = macdLine.map((item, index) => ({
      time: item.time,
      value: item.value - (signalLine[index]?.value || 0)
    }));
    
    return { macdLine, signalLine, histogram };
  };

  const calculateEMA = (data: any[], period: number) => {
    const k = 2 / (period + 1);
    return data.map((item, index) => {
      if (index < period - 1) return null;
      const ema = item.value * k + (1 - k) * (data[index - 1].value || item.value);
      return {
        time: item.time,
        value: ema
      };
    }).filter((item): item is { time: UTCTimestamp; value: number } => item !== null);
  };

  useEffect(() => {
    if (!mounted || !chartContainerRef.current || ohlcData.length === 0) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const mainSeries = chartType === 'candlestick' 
      ? chart.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        })
      : chart.addLineSeries({
          color: '#2962FF',
          lineWidth: 2,
        });

    const formattedData = ohlcData.map(item => ({
      time: item.time as UTCTimestamp,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close
    }));

    mainSeries.setData(formattedData);

    // Add Moving Averages
    if (showMA) {
      const ma20 = calculateMA(ohlcData, 20);
      const ma50 = calculateMA(ohlcData, 50);
      const ma200 = calculateMA(ohlcData, 200);

      chart.addLineSeries({ color: '#FF6B6B', lineWidth: 1 }).setData(ma20);
      chart.addLineSeries({ color: '#4ECDC4', lineWidth: 1 }).setData(ma50);
      chart.addLineSeries({ color: '#FFD93D', lineWidth: 1 }).setData(ma200);
    }

    // Add Volume
    if (showVolume) {
      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // Set as an overlay by setting a blank priceScaleId
      });

      const volumeData = ohlcData.map(item => ({
        time: item.time as UTCTimestamp,
        value: item.volume || 0,
        color: item.close >= item.open ? '#26a69a' : '#ef5350',
      }));

      volumeSeries.setData(volumeData);
    }

    // Add RSI
    if (showRSI) {
      const rsiPane = (chart as any).addPane(100, { height: 100 });
      const rsiSeries = rsiPane.addLineSeries({
        color: '#2962FF',
        lineWidth: 2,
      });
      const rsiData = calculateRSI(ohlcData);
      rsiSeries.setData(rsiData);
    }

    // Add MACD
    if (showMACD) {
      const macdPane = (chart as any).addPane(150, { height: 150 });
      const { macdLine, signalLine, histogram } = calculateMACD(ohlcData);
      
      macdPane.addLineSeries({ color: '#2962FF', lineWidth: 2 }).setData(macdLine);
      macdPane.addLineSeries({ color: '#FF6B6B', lineWidth: 2 }).setData(signalLine);
      macdPane.addHistogramSeries({ color: '#26a69a' }).setData(histogram);
    }

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [mounted, ohlcData, selectedToken, chartType, showVolume, showMA, showRSI, showMACD]);

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <main className="min-h-screen py-6 relative">
      <BackgroundBeams />
      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <h1 className="text-2xl font-bold mb-6">Theta Ecosystem Tokens</h1>
        
        {loading && <div className="p-4 text-center">Loading tokens...</div>}
        {error && <div className="p-4 text-center text-red-500">{error}</div>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tokens.map((token) => (
                      <button
                        key={token.id}
                        onClick={() => setSelectedToken(token)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedToken?.id === token.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        <div className="font-medium">{token.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {typeof token.current_price === 'number'
                            ? `$${token.current_price.toLocaleString()}`
                            : 'N/A'}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedToken ? `${selectedToken.name} (${selectedToken.symbol.toUpperCase()})` : 'Select a token'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-4">
                    <select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value as 'candlestick' | 'line')}
                      className="bg-background border rounded px-3 py-1"
                    >
                      <option value="candlestick">Candlestick</option>
                      <option value="line">Line</option>
                    </select>
                    
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value as '1D' | '1W' | '1M' | '3M' | '1Y')}
                      className="bg-background border rounded px-3 py-1"
                    >
                      <option value="1D">1D</option>
                      <option value="1W">1W</option>
                      <option value="1M">1M</option>
                      <option value="3M">3M</option>
                      <option value="1Y">1Y</option>
                    </select>

                    <div className="flex gap-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={showVolume}
                          onChange={(e) => setShowVolume(e.target.checked)}
                          className="rounded"
                        />
                        Volume
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={showMA}
                          onChange={(e) => setShowMA(e.target.checked)}
                          className="rounded"
                        />
                        MA
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={showRSI}
                          onChange={(e) => setShowRSI(e.target.checked)}
                          className="rounded"
                        />
                        RSI
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={showMACD}
                          onChange={(e) => setShowMACD(e.target.checked)}
                          className="rounded"
                        />
                        MACD
                      </label>
                    </div>
                  </div>
                  <div ref={chartContainerRef} className="w-full h-[400px]" />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 