import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useFinance } from '../../store/FinanceContext';

const icons = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: AlertTriangle,
};

const colors = {
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
  error: 'bg-rose-500/10 border-rose-500/30 text-rose-500',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useFinance();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          const Icon = icons[toast.type] || CheckCircle;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg ${colors[toast.type]}`}
              style={{ background: 'hsl(var(--surface))' }}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium text-primary">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 p-0.5 rounded hover:bg-white/10 light:hover:bg-black/5 text-muted hover:text-primary transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
