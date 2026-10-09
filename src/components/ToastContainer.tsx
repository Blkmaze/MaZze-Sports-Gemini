import React from 'react';
import { useToast } from '../context/ToastContext';
import { Info, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-8 right-12 z-50 flex flex-col space-y-3 pointer-events-none max-w-lg w-full">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-4 p-4 rounded-xl bg-[#161620]/95 border-2 border-zinc-700/80 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-200"
            style={{
              borderColor: isSuccess ? '#a3e635' : isWarning ? '#eab308' : '#ff7a1a',
              boxShadow: `0 8px 30px rgba(0,0,0,0.7), 0 0 20px ${
                isSuccess ? 'rgba(163,230,53,0.25)' : 'rgba(255,122,26,0.3)'
              }`,
            }}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess ? (
                <CheckCircle2 className="w-6 h-6 text-[#a3e635]" />
              ) : isWarning ? (
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              ) : (
                <Info className="w-6 h-6 text-[#ff7a1a]" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <h4 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                {toast.title}
              </h4>
              <p className="text-sm text-zinc-300 mt-1 leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
