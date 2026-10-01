import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Receipt,
  Coffee,
  Car,
  ShoppingBag,
  Film,
  GraduationCap,
  HeartPulse,
  MoreHorizontal,
  X
} from 'lucide-react';
import { CategoryType, PaymentMethod, Transaction } from '../types';

interface TransactionsViewProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenReceiptScan: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onDeleteTransaction,
  onOpenAddModal,
  onOpenReceiptScan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPayment, setSelectedPayment] = useState<string>('All');
  const [onlyMicro, setOnlyMicro] = useState<boolean>(false);
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);

  const categories: Array<CategoryType | 'All'> = [
    'All',
    'Food & Groceries',
    'Transport',
    'Shopping',
    'Entertainment',
    'Education',
    'Health',
    'Other',
  ];

  const paymentMethods: Array<PaymentMethod | 'All'> = [
    'All',
    'Fonepay',
    'eSewa',
    'Khalti',
    'Cash',
    'Card',
  ];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search
      const matchesSearch =
        tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.items && tx.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase())));

      if (!matchesSearch) return false;

      // Category filter
      if (selectedCategory !== 'All' && tx.category !== selectedCategory) return false;

      // Payment filter
      if (selectedPayment !== 'All' && tx.paymentMethod !== selectedPayment) return false;

      // Micro filter
      if (onlyMicro && !tx.isMicroExpense && tx.amount > 250) return false;

      return true;
    });
  }, [transactions, searchQuery, selectedCategory, selectedPayment, onlyMicro]);

  const toggleExpand = (id: string) => {
    setExpandedTxId(expandedTxId === id ? null : id);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Merchant', 'Category', 'Payment Method', 'Amount (NPR)', 'Is Micro Expense', 'Notes'];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.date,
      `"${t.merchant.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.paymentMethod,
      t.amount,
      t.isMicroExpense ? 'YES' : 'NO',
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PaisaLens_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryIcon = (category: CategoryType) => {
    switch (category) {
      case 'Food & Groceries':
        return <Coffee className="h-4 w-4 text-amber-700" />;
      case 'Transport':
        return <Car className="h-4 w-4 text-sky-700" />;
      case 'Shopping':
        return <ShoppingBag className="h-4 w-4 text-purple-700" />;
      case 'Entertainment':
        return <Film className="h-4 w-4 text-rose-700" />;
      case 'Education':
        return <GraduationCap className="h-4 w-4 text-indigo-700" />;
      case 'Health':
        return <HeartPulse className="h-4 w-4 text-emerald-700" />;
      default:
        return <MoreHorizontal className="h-4 w-4 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Transaction History
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Search, filter, and audit your verified line items and daily payments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenReceiptScan}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-800"
          >
            <Receipt className="h-3.5 w-3.5 text-emerald-200" />
            <span>Scan Receipt</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search merchant, item, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-8 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs font-semibold text-slate-700 focus:border-emerald-600 focus:outline-none bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs font-semibold text-slate-700 focus:border-emerald-600 focus:outline-none bg-white"
            >
              {paymentMethods.map((p) => (
                <option key={p} value={p}>
                  Paid: {p}
                </option>
              ))}
            </select>
          </div>

          {/* Micro-expense Toggle Button */}
          <div className="md:col-span-2 flex items-center">
            <button
              onClick={() => setOnlyMicro(!onlyMicro)}
              className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold transition-all border ${
                onlyMicro
                  ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {onlyMicro ? '✓ Only Micro (≤Rs.250)' : 'Show Micro-only'}
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="text-xs font-bold text-slate-800">
            Showing {filteredTransactions.length} of {transactions.length} Transactions
          </div>
          <span className="text-[11px] text-slate-500">Amounts shown in NPR (Rs.)</span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No transactions found matching your search and filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((tx) => {
              const isExpanded = expandedTxId === tx.id;
              return (
                <div key={tx.id} className="transition-colors hover:bg-slate-50/60">
                  <div
                    onClick={() => toggleExpand(tx.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 cursor-pointer gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        {getCategoryIcon(tx.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {tx.merchant}
                          </span>
                          {tx.isMicroExpense && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800">
                              MICRO
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>{tx.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{tx.date}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-slate-700">{tx.paymentMethod}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-left sm:text-right">
                        <span className="text-sm font-bold text-slate-900">
                          Rs. {tx.amount.toLocaleString()}
                        </span>
                        {tx.items && tx.items.length > 0 && (
                          <div className="text-[10px] text-slate-400">
                            {tx.items.length} item{tx.items.length > 1 ? 's' : ''} parsed
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTransaction(tx.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 text-slate-400 hover:text-slate-600"
                          aria-label="Expand details"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Itemized Bill Lines */}
                  {isExpanded && (
                    <div className="bg-slate-50/90 px-6 py-4 border-t border-slate-100 text-xs">
                      <div className="max-w-xl">
                        <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2">
                          Scanned Receipt Breakdown
                        </div>

                        {tx.items && tx.items.length > 0 ? (
                          <div className="space-y-1.5 rounded-xl border border-slate-200 bg-white p-3">
                            {tx.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <span className="text-slate-700">{item.name}</span>
                                <span className="font-semibold text-slate-900">
                                  Rs. {item.price.toLocaleString()}
                                </span>
                              </div>
                            ))}
                            {tx.vatAmount !== undefined && tx.vatAmount > 0 && (
                              <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-100 text-slate-500">
                                <span>Govt VAT (13%)</span>
                                <span>Rs. {tx.vatAmount.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-slate-500 text-xs italic">
                            Manual single-entry record.
                          </p>
                        )}

                        {tx.notes && (
                          <p className="mt-2 text-[11px] text-slate-500">
                            <strong>Note:</strong> {tx.notes}
                          </p>
                        )}
                        {tx.invoiceNo && (
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Tax Invoice No: {tx.invoiceNo}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
