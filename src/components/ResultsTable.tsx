import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CandleData } from '../types';

interface ResultsTableProps {
  results: CandleData[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (results.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">لم يتم العثور على نتائج بعد. ابدأ التحليل للحصول على البيانات.</p>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-6 py-4 text-right">العملة</th>
            <th className="px-6 py-4 text-right">وقت الشمعة</th>
            <th className="px-6 py-4 text-right">نسبة الذيل</th>
            <th className="px-6 py-4 text-right">السعر</th>
            <th className="px-6 py-4 text-right">موقع الذيل</th>
            <th className="px-6 py-4 text-right">التوصية</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr 
              key={`${result.symbol}-${result.timestamp}-${index}`}
              className="border-t border-gray-700 hover:bg-gray-750 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{result.symbol}</span>
                  <span className="text-xs text-gray-400">USDT</span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-300">
                {formatTimestamp(result.timestamp)}
              </td>
              <td className="px-6 py-4">
                <span className="text-emerald-400">
                  {formatNumber(result.shadowPercentage)}%
                </span>
              </td>
              <td className="px-6 py-4">${formatNumber(result.price)}</td>
              <td className="px-6 py-4">
                {result.trend === 'up' ? (
                  <div className="flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                    أعلى الشمعة
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-400">
                    <TrendingDown className="w-4 h-4" />
                    أسفل الشمعة
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  result.recommendation === 'buy' 
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {result.recommendation === 'buy' ? 'شراء' : 'بيع'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}