import { useState, useEffect, useCallback } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function ConfirmDialog({
  open,
  title,
  message,
  variant = 'warning',
  onConfirm,
  onCancel,
}) {
  const [settled, setSettled] = useState(false);

  const iconMap = {
    warning: <AlertCircle className="w-5 h-5 text-orange-600" />,
    danger: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <CheckCircle className="w-5 h-5 text-blue-600" />,
  };

  const variantConfig = {
    warning: { border: 'border-orange-200', text: 'text-orange-800', btn: 'bg-orange-600 hover:bg-orange-700' },
    danger: { border: 'border-red-200', text: 'text-red-800', btn: 'bg-red-600 hover:bg-red-700' },
    info: { border: 'border-blue-200', text: 'text-blue-800', btn: 'bg-blue-600 hover:bg-blue-700' },
  };

  const handleConfirm = () => {
    setSettled(true);
    onConfirm?.();
  };

  const handleCancel = () => {
    setSettled(true);
    onCancel?.();
  };

  useEffect(() => {
    if (!open) setSettled(false);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={handleCancel} />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl p-6 soft-shadow-lg border border-gray-100 animate-slide-up">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 mt-0.5">{iconMap[variant]}</div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold ${variantConfig[variant].text}`}>{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl ${variantConfig[variant].btn} text-white font-medium shadow-sm transition`}
          >
            {variant === 'danger' ? 'Delete' : 'Confirm'}
          </button>
        </div>
        {settled && (
          <style>{`
            [data-confirm-backdrop] { opacity: 0; transition: opacity 0.15s; }
            [data-confirm-dialog] { transform: scale(0.95); opacity: 0; transition: all 0.15s; }
          `}</style>
        )}
      </div>
    </div>
  );
}
