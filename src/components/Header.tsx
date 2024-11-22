import React from 'react';
import { CandlestickChart } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CandlestickChart className="w-8 h-8 text-emerald-500" />
            <div>
              <h1 className="text-2xl font-bold">محلل ذيول الشموع</h1>
              <p className="text-gray-400 text-sm">تحليل مباشر لذيول الشموع في سوق العملات الرقمية</p>
            </div>
          </div>
          
          <div className="text-left text-sm text-gray-400">
            آخر تحديث: {new Date().toLocaleTimeString('en-US')}
          </div>
        </div>
      </div>
    </header>
  );
}