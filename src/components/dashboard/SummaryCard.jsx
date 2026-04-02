import { useEffect, useState, useRef } from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const bgColors = {
  balance: 'bg-blue-500/10 light:bg-blue-500/15',
  income: 'bg-emerald-500/10 light:bg-emerald-500/15',
  expense: 'bg-rose-500/10 light:bg-rose-500/15',
};

const iconColors = {
  balance: 'text-blue-400/40 light:text-blue-500/40',
  income: 'text-emerald-400/40 light:text-emerald-500/40',
  expense: 'text-rose-400/40 light:text-rose-500/40',
};

const ringColors = {
  balance: 'border-blue-400/20 light:border-blue-500/20',
  income: 'border-emerald-400/20 light:border-emerald-500/20',
  expense: 'border-rose-400/20 light:border-rose-500/20',
};

export default function SummaryCard({ title, amount, icon, trend, trendUp, index = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const type = title.toLowerCase().includes('balance')
    ? 'balance'
    : title.toLowerCase().includes('income')
      ? 'income'
      : 'expense';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
      className="glass-card relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 card-gradient-border"
    >
      <div className="absolute -right-6 -bottom-6 pointer-events-none transition-transform duration-500 group-hover:scale-110">
        <div className={`w-28 h-28 rounded-full ${bgColors[type]} ${ringColors[type]} border-2 flex items-center justify-center`}>
          <div className={`${iconColors[type]} w-10 h-10`}>
            {icon}
          </div>
        </div>
      </div>

      <div className="relative p-4 z-10">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-muted text-sm font-medium">{title}</p>
          <span className={`text-xs font-semibold ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        </div>

        <h3 className="text-3xl font-bold text-primary tracking-tight">
          {isVisible ? (
            <CountUp
              start={0}
              end={Math.abs(amount)}
              duration={1.5}
              separator=","
              prefix={amount < 0 ? '-₹' : '₹'}
              decimals={2}
              decimal="."
              useEasing
            />
          ) : (
            '₹0.00'
          )}
        </h3>
      </div>
    </motion.div>
  );
}
