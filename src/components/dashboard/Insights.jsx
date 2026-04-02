import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, AlertTriangle, ArrowUpRight, TrendingUp, PiggyBank } from 'lucide-react';
import { useFinance } from '../../store/FinanceContext';

export default function Insights() {
  const { stats, chartData } = useFinance();

  const insights = useMemo(() => {
    const list = [];

    if (stats.income > 0 && stats.expenses > stats.income * 0.8) {
      list.push({
        type: 'warning',
        icon: AlertTriangle,
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-500/10',
        title: 'High Expense Alert',
        message: 'Your expenses exceed 80% of your income. Review your top spending categories to improve savings.',
      });
    }

    const topCategory = chartData.categoryData.sort((a, b) => b.value - a.value)[0];
    if (topCategory) {
      list.push({
        type: 'info',
        icon: TrendingUp,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-500/10',
        title: `Top Spending: ${topCategory.name}`,
        message: `₹${topCategory.value.toLocaleString()} spent on ${topCategory.name}. This is your largest expense category.`,
      });
    }

    if (stats.savingsRate > 20) {
      list.push({
        type: 'success',
        icon: PiggyBank,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-500/10',
        title: 'Strong Savings Rate',
        message: `Your savings rate is ${stats.savingsRate}%. Keep up the great financial discipline!`,
      });
    } else if (stats.income > 0) {
      list.push({
        type: 'info',
        icon: Lightbulb,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-500/10',
        title: 'Boost Your Savings',
        message: `Current savings rate is ${stats.savingsRate}%. Aim for 20%+ to build a strong financial foundation.`,
      });
    }

    if (stats.income > 0) {
      list.push({
        type: 'success',
        icon: ArrowUpRight,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-500/10',
        title: 'Income Overview',
        message: `Total income of ₹${stats.income.toLocaleString()} across ${stats.transactionCount} transactions.`,
      });
    }

    return list;
  }, [stats, chartData]);

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 border"
          style={{ background: 'hsl(var(--text-muted) / 0.06)' }}
        >
          <Lightbulb className="w-6 h-6 text-muted" />
        </div>
        <p className="text-sm text-secondary">Add transactions to see insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-3.5 border rounded-xl flex items-start gap-3 hover:bg-white/[0.02] light:hover:bg-black/[0.02] transition-colors"
          style={{ borderColor: 'hsl(var(--border))' }}
        >
          <div className={`p-2 ${insight.iconBg} rounded-lg shrink-0`}>
            <insight.icon className={`w-4 h-4 ${insight.iconColor}`} />
          </div>
          <div>
            <h4 className="text-primary font-medium text-sm">{insight.title}</h4>
            <p className="text-secondary text-xs mt-1 leading-relaxed">{insight.message}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
