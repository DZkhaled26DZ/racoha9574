import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Play, Square, RefreshCw } from 'lucide-react';
import { CandleAnalyzer } from './components/CandleAnalyzer';
import { Header } from './components/Header';
import { ResultsTable } from './components/ResultsTable';
import { AlertOverlay } from './components/AlertOverlay';
import { CandleData } from './types';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [results, setResults] = useState<CandleData[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  const toggleAnalysis = () => {
    setIsAnalyzing(!isAnalyzing);
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  const handleNewResult = (result: CandleData) => {
    setResults(prev => [result, ...prev]);
    if (notifications) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white" dir="rtl">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button
              onClick={toggleAnalysis}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                isAnalyzing 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Square className="w-5 h-5" />
                  إيقاف التحليل
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  بدء التحليل
                </>
              )}
            </button>
            
            <button
              onClick={toggleNotifications}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                notifications 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {notifications ? (
                <>
                  <Bell className="w-5 h-5" />
                  التنبيهات مفعلة
                </>
              ) : (
                <>
                  <BellOff className="w-5 h-5" />
                  التنبيهات معطلة
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <RefreshCw className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'جاري التحليل...' : 'التحليل متوقف'}
          </div>
        </div>

        {isAnalyzing && <CandleAnalyzer onNewResult={handleNewResult} />}
        
        <ResultsTable results={results} />
      </main>

      <AlertOverlay show={showAlert} />
    </div>
  );
}

export default App;