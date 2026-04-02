import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { initialTransactions } from '../data/mockData';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('finance_role') || 'viewer';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('finance_theme') || 'dark';
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions');
    if (!saved) return initialTransactions;

    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return initialTransactions;

      // Keep user's saved transactions, but backfill any missing seeded records
      // so pagination demos and default analytics stay consistent after app updates.
      const existingIds = new Set(parsed.map((tx) => tx.id));
      const missingSeed = initialTransactions.filter((tx) => !existingIds.has(tx.id));
      return [...parsed, ...missingSeed];
    } catch {
      return initialTransactions;
    }
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('finance_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('finance_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach(t => {
      const amount = parseFloat(t.amount);
      if (t.type === 'income') income += amount;
      if (t.type === 'expense') expenses += amount;
    });
    return {
      balance: income - expenses,
      income,
      expenses,
      savingsRate: income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  const chartData = useMemo(() => {
    const monthMap = {};
    const categoryMap = {};

    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    sorted.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          name: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
          income: 0,
          expense: 0,
          balance: 0,
        };
      }

      const amount = parseFloat(t.amount);
      if (t.type === 'income') {
        monthMap[monthKey].income += amount;
      } else {
        monthMap[monthKey].expense += amount;
      }
    });

    let runningBalance = 0;
    const monthlyData = Object.values(monthMap).map(m => {
      runningBalance += m.income - m.expense;
      return { ...m, balance: Math.round(runningBalance * 100) / 100 };
    });

    transactions.forEach(t => {
      if (t.type === 'expense') {
        if (!categoryMap[t.category]) {
          categoryMap[t.category] = 0;
        }
        categoryMap[t.category] += parseFloat(t.amount);
      }
    });

    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
    }));

    return { monthlyData, categoryData };
  }, [transactions]);

  const trendData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let currentIncome = 0, currentExpense = 0;
    let prevIncome = 0, prevExpense = 0;

    transactions.forEach(t => {
      const d = new Date(t.date);
      const amount = parseFloat(t.amount);

      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        if (t.type === 'income') currentIncome += amount;
        else currentExpense += amount;
      } else if (d.getMonth() === currentMonth - 1 && d.getFullYear() === currentYear) {
        if (t.type === 'income') prevIncome += amount;
        else prevExpense += amount;
      }
    });

    const calcTrend = (current, prev) => {
      if (prev === 0) return current > 0 ? '+100%' : '0%';
      const pct = ((current - prev) / prev * 100).toFixed(1);
      return pct >= 0 ? `+${pct}%` : `${pct}%`;
    };

    return {
      balance: calcTrend(currentIncome - currentExpense, prevIncome - prevExpense),
      income: calcTrend(currentIncome, prevIncome),
      expenses: calcTrend(currentExpense, prevExpense),
    };
  }, [transactions]);

  const addTransaction = useCallback((transaction) => {
    setTransactions(prev => [{
      id: Date.now().toString(),
      ...transaction
    }, ...prev]);
    addToast('Transaction added successfully');
  }, [addToast]);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    addToast('Transaction deleted', 'info');
  }, [addToast]);

  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    addToast('Transaction updated successfully');
  }, [addToast]);

  const resetData = useCallback(() => {
    setTransactions(initialTransactions);
    setRole('viewer');
    addToast('Data reset to defaults', 'info');
  }, [addToast]);

  return (
    <FinanceContext.Provider value={{
      role, setRole,
      theme, setTheme,
      transactions, addTransaction, deleteTransaction, updateTransaction,
      stats, chartData, trendData,
      toasts, addToast, removeToast,
      resetData,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
