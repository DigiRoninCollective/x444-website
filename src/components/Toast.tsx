import React, { useEffect } from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({ id, message, type, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const bgColor = {
    success: 'bg-green-500/20 border-green-500/40',
    error: 'bg-red-500/20 border-red-500/40',
    info: 'bg-blue-500/20 border-blue-500/40',
    warning: 'bg-yellow-500/20 border-yellow-500/40',
  }[type];

  const textColor = {
    success: 'text-green-300',
    error: 'text-red-300',
    info: 'text-blue-300',
    warning: 'text-yellow-300',
  }[type];

  const Icon = {
    success: Check,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  }[type];

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColor} backdrop-blur-sm animate-slide-in`}>
      <Icon className={`w-5 h-5 ${textColor} flex-shrink-0`} />
      <span className={`${textColor} text-sm font-semibold flex-1`}>{message}</span>
      <button
        onClick={() => onClose(id)}
        className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
