import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../store/FinanceContext';
import { useFilteredTransactions } from '../hooks/useFilteredTransactions';
import {
  ArrowDownLeft, ArrowUpRight, Search, Plus,
  ChevronUp, ChevronDown, ChevronLeft, ChevronsLeft, ChevronsRight, Pencil, Trash2, Download
} from 'lucide-react';
import TransactionModal from '../components/transactions/TransactionModal';
import { TransactionsSkeleton } from '../components/ui/Skeletons';
import { Badge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import DatePicker from '../components/ui/DatePicker';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export default function TransactionsPage() {
  const { transactions, role, deleteTransaction } = useFinance();
  const {
    searchTerm, setSearchTerm,
    filterType, setFilterType,
    sortField, sortDirection, handleSort,
    dateRange, setDateRange,
    currentPage, setCurrentPage,
    totalPages,
    paginatedTransactions,
    totalCount,
  } = useFilteredTransactions(transactions);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map(t => [t.date, t.description, t.category, t.type, t.amount]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 ml-1" />
      : <ChevronDown className="w-3.5 h-3.5 ml-1" />;
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div key="skeleton" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
          <TransactionsSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold gradient-text tracking-tight">Transactions</h1>
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ background: 'hsl(var(--accent) / 0.15)', color: 'hsl(var(--text-primary))' }}
                >
                  {totalCount}
                </span>
              </div>
            </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          {role === 'admin' && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4" />
              New Transaction
            </Button>
          )}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by company or job title..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full rounded-full py-3 pl-5 pr-16 text-sm md:text-base font-medium text-primary placeholder:text-muted outline-none transition-all duration-200 focus:ring-2 focus:ring-accent/30"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--accent) / 0.09), hsl(var(--input-bg)))',
                  border: '1px solid hsl(var(--accent) / 0.22)',
                }}
              />
              <button
                type="button"
                aria-label="Search transactions"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full flex items-center justify-center text-slate-900 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'hsl(var(--accent))' }}
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-3 items-center">
              <Dropdown
                value={filterType}
                onChange={(val) => { setFilterType(val); setCurrentPage(1); }}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'income', label: 'Income' },
                  { value: 'expense', label: 'Expense' },
                ]}
                className="w-36"
              />

              <div className="hidden sm:flex items-center gap-2">
                <DatePicker
                  value={dateRange.start}
                  onChange={(nextDate) => { setDateRange({ ...dateRange, start: nextDate }); setCurrentPage(1); }}
                  placeholder="Start date"
                  className="w-40"
                />
                <span className="text-muted text-xs font-medium">to</span>
                <DatePicker
                  value={dateRange.end}
                  onChange={(nextDate) => { setDateRange({ ...dateRange, end: nextDate }); setCurrentPage(1); }}
                  placeholder="End date"
                  className="w-40"
                />
              </div>
            </div>
          </div>

          <div className="flex sm:hidden gap-3 mt-3">
            <DatePicker
              value={dateRange.start}
              onChange={(nextDate) => { setDateRange({ ...dateRange, start: nextDate }); setCurrentPage(1); }}
              placeholder="Start date"
              className="flex-1"
            />
            <span className="text-muted text-xs font-medium self-center">to</span>
            <DatePicker
              value={dateRange.end}
              onChange={(nextDate) => { setDateRange({ ...dateRange, end: nextDate }); setCurrentPage(1); }}
              placeholder="End date"
              className="flex-1"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted uppercase border-b" style={{ background: 'hsl(var(--surface) / 0.3)' }}>
              <tr>
                <th
                  className="px-6 py-4 font-medium tracking-wider cursor-pointer hover:text-primary transition-colors select-none"
                  onClick={() => handleSort('description')}
                >
                  <div className="flex items-center">
                    Transaction <SortIcon field="description" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 font-medium tracking-wider cursor-pointer hover:text-primary transition-colors select-none hidden sm:table-cell"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Category <SortIcon field="category" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 font-medium tracking-wider cursor-pointer hover:text-primary transition-colors select-none hidden md:table-cell"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Date <SortIcon field="date" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 font-medium tracking-wider text-right cursor-pointer hover:text-primary transition-colors select-none"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end">
                    Amount <SortIcon field="amount" />
                  </div>
                </th>
                {role === 'admin' && (
                  <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'hsl(var(--border) / 0.5)' }}>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={role === 'admin' ? 5 : 4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border"
                        style={{ background: 'hsl(var(--text-muted) / 0.06)' }}
                      >
                        <Search className="w-8 h-8 text-muted" />
                      </div>
                      <h3 className="text-primary text-lg font-medium mb-2">No Transactions Found</h3>
                      <p className="text-secondary text-sm leading-relaxed">
                        No records match your current filters. Try adjusting your search or add a new transaction.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedTransactions.map((tx, i) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/[0.02] light:hover:bg-black/[0.02] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-primary">{tx.description}</p>
                        <p className="text-xs text-muted sm:hidden mt-0.5">{tx.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary hidden sm:table-cell">
                    <Badge>{tx.category}</Badge>
                  </td>
                  <td className="px-6 py-4 text-secondary hidden md:table-cell">{tx.date}</td>
                  <td className="px-6 py-4 text-right font-semibold">
                    <span className={tx.type === 'income' ? 'text-emerald-500' : 'text-primary'}>
                      {tx.type === 'income' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  {role === 'admin' && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(tx)}
                          className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-white/10 light:hover:bg-black/5 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-between">
            <p className="text-sm text-secondary">
              Showing {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-muted hover:text-primary hover:bg-white/5 light:hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-muted hover:text-primary hover:bg-white/5 light:hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      page === currentPage
                        ? 'bg-accent text-slate-900 shadow-glow-sm'
                        : 'text-muted hover:text-primary hover:bg-white/5 light:hover:bg-black/5'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-muted hover:text-primary hover:bg-white/5 light:hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingTransaction={editingTransaction}
      />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
