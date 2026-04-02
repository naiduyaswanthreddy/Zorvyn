import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../store/FinanceContext';
import SummaryCard from '../components/dashboard/SummaryCard';
import BalanceChart from '../components/dashboard/BalanceChart';
import SpendingBreakdown from '../components/dashboard/SpendingBreakdown';
import { DashboardSkeleton } from '../components/ui/Skeletons';
import { Wallet, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function DashboardOverview() {
  const { stats, trendData } = useFinance();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => setSecondsAgo(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isLoading]);

  const formatTime = (s) => {
    if (s < 60) return `${s}s ago`;
    return `${Math.floor(s / 60)}m ${s % 60}s ago`;
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div key="skeleton" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
          <DashboardSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-5"
        >
          <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text tracking-tight">
                Financial Overview
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Updated {secondsAgo < 5 ? 'just now' : formatTime(secondsAgo)}
            </div>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard
              title="Total Balance"
              amount={stats.balance}
              icon={<Wallet className="w-full h-full" />}
              trend={trendData.balance}
              trendUp={trendData.balance.startsWith('+')}
              index={0}
            />
            <SummaryCard
              title="Total Income"
              amount={stats.income}
              icon={<TrendingUp className="w-full h-full" />}
              trend={trendData.income}
              trendUp={trendData.income.startsWith('+')}
              index={1}
            />
            <SummaryCard
              title="Total Expenses"
              amount={stats.expenses}
              icon={<TrendingDown className="w-full h-full" />}
              trend={trendData.expenses}
              trendUp={!trendData.expenses.startsWith('+')}
              index={2}
            />
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 glass-card p-5 card-gradient-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-primary">Balance Trend</h2>
                <button
                  onClick={() => navigate('/analytics')}
                  className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors group"
                >
                  View details
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              <BalanceChart />
            </div>
            <div className="glass-card p-5 flex flex-col">
              <h2 className="text-lg font-semibold mb-3 text-primary">Spending Breakdown</h2>
              <div className="flex-1 min-h-[250px]">
                <SpendingBreakdown />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
