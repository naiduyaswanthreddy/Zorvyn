import { useFinance } from '../../store/FinanceContext';
import SummaryCard from './SummaryCard';
import BalanceChart from './BalanceChart';
import SpendingBreakdown from './SpendingBreakdown';
import Insights from './Insights';
import TransactionList from '../transactions/TransactionList';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

export default function DashboardOverview() {
  const { stats } = useFinance();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Financial Overview
          </h1>
          <p className="text-slate-400 mt-1">Track, manage, and analyze your activity.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Balance" 
          amount={stats.balance} 
          icon={<Wallet className="w-6 h-6 text-blue-400" />} 
          trend="+12.5%" 
          trendUp={true} 
        />
        <SummaryCard 
          title="Total Income" 
          amount={stats.income} 
          icon={<TrendingUp className="w-6 h-6 text-emerald-400" />} 
          trend="+8.2%" 
          trendUp={true} 
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={stats.expenses} 
          icon={<TrendingDown className="w-6 h-6 text-rose-400" />} 
          trend="-2.4%" 
          trendUp={false} 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold mb-4 text-white">Balance Trend</h2>
          <BalanceChart />
        </div>
        <div className="glass-card p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-white">Spending Breakdown</h2>
          <div className="flex-1 min-h-[300px]">
            <SpendingBreakdown />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-0 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
          </div>
          <TransactionList />
        </div>
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4 text-white">AI Insights</h2>
          <Insights />
        </div>
      </div>
    </div>
  );
}
