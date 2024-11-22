export interface CandleData {
  symbol: string;
  timestamp: number;
  shadowPercentage: number;
  price: number;
  trend: 'up' | 'down';
  recommendation: 'buy' | 'sell';
}