import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts';
import { useFinance } from '../store/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { AnalyticsSkeleton } from '../components/ui/Skeletons';
import { TrendingDown, PiggyBank, Target, Calendar } from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const periods = [
  { label: 'All Time', value: 'all' },
  { label: '3 Months', value: '3' },
  { label: '6 Months', value: '6' },
  { label: '1 Year', value: '12' },
];

function parseISODate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function buildAnalyticsData(transactions) {
  const sorted = [...transactions].sort((a, b) => parseISODate(a.date) - parseISODate(b.date));
  const monthMap = {};
  const categoryMap = {};

  sorted.forEach((tx) => {
    const date = parseISODate(tx.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthMap[key]) {
      monthMap[key] = {
        key,
        name: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
        income: 0,
        expense: 0,
        balance: 0,
      };
    }

    const amount = parseFloat(tx.amount);
    if (tx.type === 'income') {
      monthMap[key].income += amount;
    } else {
      monthMap[key].expense += amount;
      if (!categoryMap[tx.category]) categoryMap[tx.category] = 0;
      categoryMap[tx.category] += amount;
    }
  });

  let runningBalance = 0;
  const monthlyData = Object.values(monthMap).map((month) => {
    runningBalance += month.income - month.expense;
    return {
      name: month.name,
      income: Math.round(month.income * 100) / 100,
      expense: Math.round(month.expense * 100) / 100,
      balance: Math.round(runningBalance * 100) / 100,
    };
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
  }));

  return { monthlyData, categoryData };
}

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 shadow-xl border" style={{ background: 'hsl(var(--tooltip-bg))', borderColor: 'hsl(var(--tooltip-border))' }}>
      <p className="text-xs text-secondary mb-2 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-secondary">{entry.name}</span>
          <span className="text-xs font-semibold text-primary ml-auto">
            {formatter ? formatter(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const { transactions } = useFinance();
  const [period, setPeriod] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const filteredTransactions = useMemo(() => {
    if (period === 'all') return transactions;

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - parseInt(period, 10), now.getDate());
    return transactions.filter((tx) => parseISODate(tx.date) >= start);
  }, [transactions, period]);

  const filteredData = useMemo(() => {
    return buildAnalyticsData(filteredTransactions);
  }, [filteredTransactions]);

  const filteredStats = useMemo(() => {
    const totals = filteredTransactions.reduce(
      (acc, tx) => {
        const amount = parseFloat(tx.amount);
        if (tx.type === 'income') acc.income += amount;
        else acc.expense += amount;
        return acc;
      },
      { income: 0, expense: 0 },
    );

    const savingsRate = totals.income > 0
      ? (((totals.income - totals.expense) / totals.income) * 100).toFixed(1)
      : '0.0';

    const avgMonthlySpend = filteredData.monthlyData.length > 0
      ? Math.round(filteredData.monthlyData.reduce((sum, month) => sum + month.expense, 0) / filteredData.monthlyData.length)
      : 0;

    return {
      savingsRate,
      avgMonthlySpend,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions, filteredData]);

  const savingsRateData = useMemo(() => {
    return filteredData.monthlyData.map((month) => ({
      name: month.name,
      rate: month.income > 0 ? Math.round(((month.income - month.expense) / month.income) * 100) : 0,
    }));
  }, [filteredData]);

  const topCategories = useMemo(() => {
    return [...filteredData.categoryData]
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredData]);

  const totalCategorySpend = useMemo(() => {
    return filteredData.categoryData.reduce((sum, cat) => sum + cat.value, 0);
  }, [filteredData]);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div key="skeleton" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
          <AnalyticsSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text tracking-tight">Analytics</h1>
            </div>
            <div className="flex items-center gap-2 p-1 rounded-xl border" style={{ background: 'hsl(var(--surface))' }}>
              {periods.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    period === p.value
                      ? 'bg-accent text-slate-900 shadow-glow-sm'
                      : 'text-secondary hover:text-primary hover:bg-white/5 light:hover:bg-black/5'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Savings Rate', value: `${filteredStats.savingsRate}%`, icon: PiggyBank, color: 'text-emerald-400/40', ring: 'border-emerald-400/20', bg: 'bg-emerald-500/10' },
              { label: 'Avg Monthly Spend', value: `₹${filteredStats.avgMonthlySpend.toLocaleString()}`, icon: TrendingDown, color: 'text-rose-400/40', ring: 'border-rose-400/20', bg: 'bg-rose-500/10' },
              { label: 'Transactions', value: filteredStats.transactionCount, icon: Calendar, color: 'text-blue-400/40', ring: 'border-blue-400/20', bg: 'bg-blue-500/10' },
              { label: 'Categories', value: filteredData.categoryData.length, icon: Target, color: 'text-amber-400/40', ring: 'border-amber-400/20', bg: 'bg-amber-500/10' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="glass-card relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 card-gradient-border">
                  <div className="absolute -right-5 -bottom-5 pointer-events-none transition-transform duration-500 group-hover:scale-110">
                    <div className={`w-24 h-24 rounded-full ${stat.bg} ${stat.ring} border-2 flex items-center justify-center`}>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="relative p-4 z-10">
                    <p className="text-muted text-sm font-medium mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredData.monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--text-muted) / 0.08)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: 'hsl(var(--text-muted))', fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: 'hsl(var(--text-muted))', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                      <Tooltip content={<ChartTooltip formatter={(v) => `₹${v.toLocaleString()}`} />} />
                      <Legend wrapperStyle={{ fontSize: 12, color: 'hsl(var(--text-muted))' }} />
                      <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} name="Income" />
                      <Bar dataKey="expense" fill="#F43F5E" radius={[6, 6, 0, 0]} name="Expense" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Savings Rate Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={savingsRateData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--text-muted) / 0.08)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: 'hsl(var(--text-muted))', fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: 'hsl(var(--text-muted))', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                      <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
                      <Area type="monotone" dataKey="rate" stroke="#3B82F6" strokeWidth={3} fill="url(#savingsGradient)" name="Savings Rate" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={filteredData.categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {filteredData.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--tooltip-bg))',
                          border: '1px solid hsl(var(--tooltip-border))',
                          borderRadius: '12px',
                          color: 'hsl(var(--text-primary))',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        }}
                        formatter={(v) => `₹${v.toLocaleString()}`}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12, color: 'hsl(var(--text-muted))' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Spending Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topCategories.map((cat, i) => {
                  const pct = totalCategorySpend > 0 ? (cat.value / totalCategorySpend * 100) : 0;
                  return (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-sm font-medium text-primary">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-primary">₹{cat.value.toLocaleString()}</span>
                          <span className="text-xs text-muted w-12 text-right">{pct.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'hsl(var(--text-muted) / 0.1)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
                {topCategories.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-secondary">
                    <Target className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm">No expense data for this period</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
