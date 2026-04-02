import { useState, useEffect } from 'react';
import { useFinance } from '../../store/FinanceContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import DatePicker from '../ui/DatePicker';

export default function TransactionModal({ isOpen, onClose, editingTransaction }) {
  const { addTransaction, updateTransaction } = useFinance();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        description: editingTransaction.description,
        amount: String(editingTransaction.amount),
        category: editingTransaction.category,
        type: editingTransaction.type,
        date: editingTransaction.date,
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        category: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingTransaction, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category || !formData.date) return;

    const data = { ...formData, amount: parseFloat(formData.amount) };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Type</label>
          <div className="flex gap-3">
            {['expense', 'income'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, type })}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all duration-200 ${
                  formData.type === type
                    ? type === 'expense'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-glow-sm'
                    : 'text-secondary hover:text-primary hover:border-accent/30'
                }`}
                style={formData.type !== type ? { background: 'hsl(var(--input-bg))', borderColor: 'hsl(var(--input-border))' } : {}}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Description</label>
          <input
            required
            type="text"
            maxLength={100}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-muted outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
            style={{ background: 'hsl(var(--input-bg))', border: '1px solid hsl(var(--input-border))' }}
            placeholder="e.g. Server Hosting"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-secondary mb-2">Amount (₹)</label>
            <input
              required
              type="number"
              step="0.01"
              min="0.01"
              className="w-full rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-muted outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
              style={{ background: 'hsl(var(--input-bg))', border: '1px solid hsl(var(--input-border))' }}
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-secondary mb-2">Category</label>
            <Dropdown
              value={formData.category}
              onChange={(val) => setFormData({ ...formData, category: val })}
              placeholder="Select category..."
              options={[
                { value: 'Software', label: 'Software' },
                { value: 'Services', label: 'Services' },
                { value: 'Equipment', label: 'Equipment' },
                { value: 'Salary', label: 'Salary' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Food', label: 'Food' },
              ]}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Date</label>
          <DatePicker
            value={formData.date}
            onChange={(val) => setFormData({ ...formData, date: val })}
            placeholder="Select transaction date"
            size="sm"
          />
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {editingTransaction ? 'Update Transaction' : 'Save Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
