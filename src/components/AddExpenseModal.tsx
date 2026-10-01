import React, { useState } from 'react';
import { X, CheckCircle2, DollarSign, Store, Tag } from 'lucide-react';
import { CategoryType, PaymentMethod, Transaction } from '../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType>('Food & Groceries');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [itemName, setItemName] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!merchant.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const isMicro = parsedAmount <= 250;

    onAddTransaction({
      merchant: merchant.trim(),
      amount: parsedAmount,
      category,
      paymentMethod,
      date,
      isMicroExpense: isMicro,
      microTag: isMicro
        ? category === 'Transport'
          ? 'Transport'
          : category === 'Food & Groceries'
          ? 'Tea & Snacks'
          : 'Small Online Purchases'
        : undefined,
      items: itemName.trim()
        ? [{ id: `item-${Date.now()}`, name: itemName.trim(), price: parsedAmount, quantity: 1 }]
        : [{ id: `item-${Date.now()}`, name: merchant.trim(), price: parsedAmount, quantity: 1 }],
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Add Quick Expense</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Merchant / Shop Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mama Ko Chiya Pasal, Pathao, Bhat-Bhateni"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amount (NPR Rs.)
              </label>
              <input
                type="number"
                step="5"
                required
                placeholder="50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none bg-white"
              >
                <option value="Food & Groceries">Food & Groceries</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Channel
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none bg-white"
              >
                <option value="Cash">Cash (Local)</option>
                <option value="Fonepay">Fonepay QR</option>
                <option value="eSewa">eSewa Wallet</option>
                <option value="Khalti">Khalti Digital</option>
                <option value="Card">Debit/Credit Card</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Item Description (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 2x Milk Tea + Samosa"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Evening meeting with team"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {amount && Number(amount) <= 250 && (
            <div className="rounded-lg bg-amber-50 p-2.5 text-[11px] text-amber-900 border border-amber-200">
              💡 This expense is ≤ Rs. 250 and will automatically be classified into your{' '}
              <strong>Micro-Expense Tracker</strong>!
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-xs"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
