'use client';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

export function Toast({ message, type = 'success', duration = 3000 }: ToastProps) {
  const bgColor = {
    success: 'bg-green-700',
    error: 'bg-red-700',
    info: 'bg-blue-700',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }[type];

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-4 flex items-center gap-2`}>
      <span className="flex-shrink-0">{icon}</span>
      <span>{message}</span>
    </div>
  );
}
