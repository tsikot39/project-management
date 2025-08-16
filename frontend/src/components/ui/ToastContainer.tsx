import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { toast } from '../../lib/toast';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: number;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToasts: ToastItem[]) => {
      setToasts(newToasts);
    });

    return unsubscribe;
  }, []);

  const getToastIcon = (type: ToastItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getToastStyles = (type: ToastItem['type']) => {
    const baseStyles =
      'rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 transform';

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50/90 border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50/90 border-red-200 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-amber-50/90 border-amber-200 text-amber-800`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-50/90 border-blue-200 text-blue-800`;
    }
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toastItem) => (
        <div
          key={toastItem.id}
          className={`${getToastStyles(toastItem.type)} p-4 animate-in slide-in-from-right`}
        >
          <div className="flex items-start gap-3">
            {getToastIcon(toastItem.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{toastItem.message}</p>
            </div>
            <button
              onClick={() => toast.remove(toastItem.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
