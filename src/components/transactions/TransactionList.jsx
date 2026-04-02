import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../store/FinanceContext';
import { ArrowDownLeft, ArrowUpRight, Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import Dropdown from '../ui/Dropdown';
import TransactionModal from './TransactionModal';

export default function TransactionList({ limit }) {
  const { transactions, role, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch =
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    })
    .slice(0, limit || undefined);

  return (
    <div>
      <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center relative z-10"
        style={{ background: 'hsl(var(--surface) / 0.5)' }}
      >
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search by company or job title..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 rounded-full py-2.5 pl-4 pr-14 text-sm font-medium text-primary placeholder:text-muted outline-none transition-all duration-200 focus:ring-2 focus:ring-accent/30"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--accent) / 0.09), hsl(var(--input-bg)))',
                border: '1px solid hsl(var(--accent) / 0.22)',
              }}
            />
            <button
              type="button"
              aria-label="Search recent transactions"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full flex items-center justify-center text-slate-900 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'hsl(var(--accent))' }}
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
          <Dropdown
            value={filterType}
            onChange={setFilterType}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' },
            ]}
            className="w-36"
          />
        </div>

        {role === 'admin' && (
          <button
            onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-accent text-slate-900 px-4 py-2 rounded-xl text-sm font-semibold shadow-glow-sm hover:shadow-glow-md hover:opacity-90 transition-all w-full sm:w-auto justify-center active:scale-[0.97]"
          >
            <Plus className="w-4 h-4" />
            New Transaction
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-xs text-muted uppercase border-b" style={{ background: 'hsl(var(--surface) / 0.3)' }}>
            <tr>
              <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium tracking-wider">Transaction</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium tracking-wider hidden sm:table-cell">Category</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium tracking-wider hidden md:table-cell">Date</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium tracking-wider text-right">Amount</th>
              {role === 'admin' && <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium tracking-wider text-right hidden sm:table-cell">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'hsl(var(--border) / 0.5)' }}>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={role === 'admin' ? 5 : 4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border"
                      style={{ background: 'hsl(var(--text-muted) / 0.06)' }}
                    >
                      <Search className="w-8 h-8 text-muted" />
                    </div>
                    <h3 className="text-primary text-lg font-medium tracking-tight mb-2">No Transactions Found</h3>
                    <p className="text-secondary text-sm leading-relaxed">
                      No records match your current search or filter criteria. Try adjusting them or add a new transaction.
                    </p>
                  </div>
                </td>
              </tr>
            ) : filteredTransactions.map((tx, i) => (
              <motion.tr
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-white/[0.02] light:hover:bg-black/[0.02] transition-colors group"
              >
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-primary truncate max-w-[120px] sm:max-w-none">{tx.description}</p>
                      <p className="text-xs text-muted sm:hidden mt-0.5">{tx.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-secondary hidden sm:table-cell">
                  <Badge>{tx.category}</Badge>
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-secondary hidden md:table-cell">{tx.date}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold">
                  <span className={tx.type === 'income' ? 'text-emerald-500' : 'text-primary'}>
                    {tx.type === 'income' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </td>
                {role === 'admin' && (
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-right hidden sm:table-cell">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingTransaction(tx); setIsModalOpen(true); }}
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

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}
