import React, { useEffect } from 'react';
import axios from 'axios';
import { CandleData } from '../types';

interface CandleAnalyzerProps {
  onNewResult: (result: CandleData) => void;
}

interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
}

export function CandleAnalyzer({ onNewResult }: CandleAnalyzerProps) {
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOGEUSDT'];
  const SHADOW_THRESHOLD = 300; // 300% threshold

  const calculateShadowPercentage = (kline: BinanceKline) => {
    const open = parseFloat(kline.open);
    const close = parseFloat(kline.close);
    const high = parseFloat(kline.high);
    const low = parseFloat(kline.low);

    const bodyLength = Math.abs(close - open);
    const upperShadow = high - Math.max(open, close);
    const lowerShadow = Math.min(open, close) - low;

    // Calculate shadow percentages relative to body length
    const upperShadowPercentage = bodyLength > 0 ? (upperShadow / bodyLength) * 100 : 0;
    const lowerShadowPercentage = bodyLength > 0 ? (lowerShadow / bodyLength) * 100 : 0;

    return {
      upperShadowPercentage,
      lowerShadowPercentage,
      isUpperShadow: upperShadowPercentage > lowerShadowPercentage
    };
  };

  const fetchCandleData = async (symbol: string) => {
    try {
      // Fetch 1-hour candles for the last 24 hours
      const response = await axios.get(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=24`
      );

      const candles = response.data.map((k: any) => ({
        openTime: k[0],
        open: k[1],
        high: k[2],
        low: k[3],
        close: k[4]
      }));

      candles.forEach((kline: BinanceKline) => {
        const { upperShadowPercentage, lowerShadowPercentage, isUpperShadow } = calculateShadowPercentage(kline);
        const shadowPercentage = Math.max(upperShadowPercentage, lowerShadowPercentage);

        if (shadowPercentage >= SHADOW_THRESHOLD) {
          const result: CandleData = {
            symbol,
            timestamp: kline.openTime,
            shadowPercentage,
            price: parseFloat(kline.close),
            trend: isUpperShadow ? 'up' : 'down',
            recommendation: isUpperShadow ? 'sell' : 'buy' // Sell on upper shadow, buy on lower shadow
          };

          onNewResult(result);
        }
      });
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
    }
  };

  useEffect(() => {
    // Initial fetch for all symbols
    symbols.forEach(symbol => fetchCandleData(symbol));

    // Set up interval to fetch new data every minute
    const interval = setInterval(() => {
      symbols.forEach(symbol => fetchCandleData(symbol));
    }, 60000);

    return () => clearInterval(interval);
  }, [onNewResult]);

  return null;
}