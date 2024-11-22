import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AlertOverlayProps {
  show: boolean;
}

export function AlertOverlay({ show }: AlertOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-8 left-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 animate-slide-up">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-emerald-500" />
        <p className="text-sm">تم اكتشاف نمط جديد للشموع!</p>
      </div>
    </div>
  );
}