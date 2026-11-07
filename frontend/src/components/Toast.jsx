import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, Clock, Mail, Users, ShoppingCart, CreditCard } from 'lucide-react';

const TOAST_AUTO_DISMISS = 4000;

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-green-600" />,
  error: <AlertCircle className="w-5 h-5 text-red-600" />,
  info: <Info className="w-5 h-5 text-blue-600" />,
};

const variantConfig = {
  success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
  error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
};

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (event) => {
      const { title, message, variant = 'info', duration = TOAST_AUTO_DISMISS } = event.detail;
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, title, message, variant, duration }]);
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    };
    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  const dismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border transform transition-all duration-300 ${
            variantConfig[toast.variant].bg
          } ${variantConfig[toast.variant].border} ${variantConfig[toast.variant].text} animate-slide-in`}
        >
          <div className="flex-shrink-0 mt-0.5">{iconMap[toast.variant]}</div>
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className="text-sm font-bold">{toast.title}</h4>
            )}
            {toast.message && (
              <p className="text-xs mt-0.5">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="flex-shrink-0 opacity-50 hover:opacity-100 transition"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
