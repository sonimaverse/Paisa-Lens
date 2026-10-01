import React from 'react';
import {
  ScanLine,
  ArrowUpRight,
  TrendingDown,
  Sparkles,
  Wallet,
  Coffee,
  Car,
  ShoppingBag,
  Film,
  GraduationCap,
  HeartPulse,
  MoreHorizontal,
  ChevronRight,
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { CategoryType, MonthlyBudget, Transaction } from '../types';

interface DashboardViewProps {
  transactions: Transaction[];
  budget: MonthlyBudget;
  onNavigate: (tab: string) => void;
  onSelectSampleReceipt: (receiptId: string) => void;
  onOpenReceiptScan: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  budget,
  onNavigate,
  onSelectSampleReceipt,
  onOpenReceiptScan,
}) => {
  // Calculations
  const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);
  const remainingBudget = Math.max(0, budget.totalBudget - totalSpent);
  const budgetUsedPercent = Math.min(100, Math.round((totalSpent / budget.totalBudget) * 100));

  // Micro expenses calculations
  const microTransactions = transactions.filter((t) => t.isMicroExpense);
  const microExpensesTotal = microTransactions.reduce((acc, t) => acc + t.amount, 0);
  const microPercentOfTotal = totalSpent > 0 ? Math.round((microExpensesTotal / totalSpent) * 100) : 0;

  // Breakdown of micro expenses
  const teaAndSnacks = microTransactions
    .filter((t) => t.microTag === 'Tea & Snacks' || (t.category === 'Food & Groceries' && t.amount <= 200))
    .reduce((acc, t) => acc + t.amount, 0);

  const microTransport = microTransactions
    .filter((t) => t.microTag === 'Transport' || (t.category === 'Transport' && t.amount <= 200))
    .reduce((acc, t) => acc + t.amount, 0);

  const microOnline = microTransactions
    .filter((t) => t.microTag === 'Small Online Purchases' || (t.amount <= 350 && (t.category === 'Shopping' || t.category === 'Other' || t.category === 'Education')))
    .reduce((acc, t) => acc + t.amount, 0);

  // Category spending calculations
  const categorySpending: Record<CategoryType, number> = {
    'Food & Groceries': 0,
    'Transport': 0,
    'Shopping': 0,
    'Entertainment': 0,
    'Education': 0,
    'Health': 0,
    'Other': 0,
  };

  transactions.forEach((tx) => {
    if (categorySpending[tx.category] !== undefined) {
      categorySpending[tx.category] += tx.amount;
    } else {
      categorySpending['Other'] += tx.amount;
    }
  });

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

  // Recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Good morning 👋
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Kathmandu, Nepal · Track small daily rupees before they slip away
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReceiptScan}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <ScanLine className="h-4 w-4" />
            <span>Scan Receipt</span>
          </button>
        </div>
      </div>

      {/* 4 Core Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spent */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Spent This Month</span>
            <span className="text-[11px] font-medium text-slate-400">Oct 2026</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Rs. {totalSpent.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <span>{budgetUsedPercent}% of Rs. {budget.totalBudget.toLocaleString()} budget</span>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Remaining Budget</span>
            <span className="text-[11px] font-medium text-emerald-700 font-semibold">Healthy</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-emerald-700">
              Rs. {remainingBudget.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <span>Monthly limit: Rs. {budget.totalBudget.toLocaleString()}</span>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Transactions Logged</span>
            <span className="text-[11px] font-medium text-slate-400">Nepal NPR</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {transactions.length}
            </span>
            <span className="text-xs text-slate-500">entries</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <span>{microTransactions.length} flagged as micro-expenses</span>
          </div>
        </div>

        {/* Micro-Expenses Total */}
        <div className="rounded-2xl border border-amber-200/90 bg-amber-50/40 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900">Micro-Expenses Total</span>
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
              {microPercentOfTotal}% of spend
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-amber-950">
              Rs. {microExpensesTotal.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-xs text-amber-900">
            <span>Daily tea, snacks & short transit rides</span>
          </div>
        </div>
      </div>

      {/* Prominent Quick Receipt Scanner Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
              <Sparkles className="h-3 w-3" />
              <span>Instant Receipt OCR Engine</span>
            </div>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Turn your receipt into a smart expense
            </h2>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Upload any Bhat-Bhateni bill, Pathao fare, or tea-stall slip. Our OCR automatically extracts line items, verifies VAT, classifies category, and flags micro-leaks.
            </p>

            {/* Quick demo presets buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] text-slate-400 font-medium">Quick Demo Samples:</span>
              <button
                onClick={() => onSelectSampleReceipt('bhat-bhateni')}
                className="rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-xs font-medium text-emerald-200 border border-white/10 transition-colors"
              >
                Bhat-Bhateni (Rs. 1,245)
              </button>
              <button
                onClick={() => onSelectSampleReceipt('chiya-pasal')}
                className="rounded-lg bg-amber-500/20 hover:bg-amber-500/30 px-2.5 py-1 text-xs font-medium text-amber-200 border border-amber-500/20 transition-colors"
              >
                Mama Chiya (Rs. 110 · Micro)
              </button>
              <button
                onClick={() => onSelectSampleReceipt('pathao-ride')}
                className="rounded-lg bg-sky-500/20 hover:bg-sky-500/30 px-2.5 py-1 text-xs font-medium text-sky-200 border border-sky-500/20 transition-colors"
              >
                Pathao Ride (Rs. 230)
              </button>
            </div>
          </div>

          <div className="flex shrink-0 items-center">
            <button
              onClick={onOpenReceiptScan}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-md hover:bg-emerald-400 transition-all hover:scale-102"
            >
              <ScanLine className="h-4 w-4" />
              <span>Launch Camera & OCR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Micro-Expense Insight Spotlight + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MICRO-EXPENSE INSIGHT (User explicit core WOW feature) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Your Small Expenses Are Adding Up 👀
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                The silent budget killer: Rs. 50 tea, Rs. 80 snacks, Rs. 120 rides
              </p>
            </div>
            <button
              onClick={() => onNavigate('insights')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Deep Dive
            </button>
          </div>

          {/* Micro-expense breakdown cards */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                  <Coffee className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Tea & Snacks</p>
                  <p className="text-[11px] text-slate-500">Chiya pasal, samosa, bakery bites</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-900">
                  Rs. {teaAndSnacks.toLocaleString()}
                </span>
                <p className="text-[10px] text-slate-500">42% of micro</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50/70 border border-sky-100">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-800">
                  <Car className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Transport</p>
                  <p className="text-[11px] text-slate-500">Pathao bike, Safa tempo, micro bus</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-900">
                  Rs. {microTransport.toLocaleString()}
                </span>
                <p className="text-[10px] text-slate-500">33% of micro</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/70 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-800">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Small Online Purchases</p>
                  <p className="text-[11px] text-slate-500">Flash deals, mobile recharges, xerox</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-900">
                  Rs. {microOnline.toLocaleString()}
                </span>
                <p className="text-[10px] text-slate-500">25% of micro</p>
              </div>
            </div>
          </div>

          {/* Visual Bar Proportion */}
          <div className="mt-5 rounded-xl bg-slate-50 p-4 border border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">Total micro-expenses:</span>
              <span className="font-bold text-emerald-800 text-sm">
                Rs. {microExpensesTotal.toLocaleString()}
              </span>
            </div>

            {/* Proportion Bar */}
            <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200 overflow-hidden flex">
              <div
                style={{ width: `${(teaAndSnacks / microExpensesTotal) * 100}%` }}
                className="bg-amber-500"
                title="Tea & Snacks"
              />
              <div
                style={{ width: `${(microTransport / microExpensesTotal) * 100}%` }}
                className="bg-sky-500"
                title="Transport"
              />
              <div
                style={{ width: `${(microOnline / microExpensesTotal) * 100}%` }}
                className="bg-purple-500"
                title="Small Online Purchases"
              />
            </div>

            <p className="mt-3 text-xs text-slate-600 font-medium leading-relaxed">
              These small expenses make up <span className="font-bold text-amber-800">{microPercentOfTotal}%</span> of your monthly spending.
            </p>
          </div>
        </div>

        {/* Category Breakdown & Progress */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Category Budgets</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly allocation vs current spending
              </p>
            </div>
            <button
              onClick={() => onNavigate('budget')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Adjust Limits
            </button>
          </div>

          <div className="mt-4 space-y-3.5">
            {Object.entries(budget.categories).map(([catName, allocated]) => {
              const spent = categorySpending[catName as CategoryType] || 0;
              const percent = Math.min(100, Math.round((spent / allocated) * 100));
              const isWarning = percent >= 80;

              return (
                <div key={catName} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(catName as CategoryType)}
                      <span className="font-medium text-slate-800">{catName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900">
                        Rs. {spent.toLocaleString()}
                      </span>
                      <span className="text-slate-400">/</span>
                      <span className="text-slate-500">Rs. {allocated.toLocaleString()}</span>
                      {isWarning && (
                        <AlertTriangle className="h-3 w-3 text-amber-600 ml-1" />
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent >= 90
                          ? 'bg-rose-500'
                          : percent >= 75
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Transactions</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified receipts, scanned line items, and recorded daily cash
            </p>
          </div>
          <button
            onClick={() => onNavigate('transactions')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <span>View All ({transactions.length})</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-3 hover:bg-slate-50/70 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  {getCategoryIcon(tx.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      {tx.merchant}
                    </span>
                    {tx.isMicroExpense && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800">
                        MICRO
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{tx.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{tx.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{tx.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-900">
                  Rs. {tx.amount.toLocaleString()}
                </span>
                {tx.items && tx.items.length > 0 && (
                  <p className="text-[10px] text-slate-400">
                    {tx.items.length} item{tx.items.length > 1 ? 's' : ''} parsed
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
