import React, { useState } from 'react';
import {
  PieChart,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Coffee,
  Car,
  ShoppingBag,
  Film,
  GraduationCap,
  HeartPulse,
  MoreHorizontal,
  Info
} from 'lucide-react';
import { CategoryType, MonthlyBudget, Transaction } from '../types';

interface BudgetViewProps {
  budget: MonthlyBudget;
  onUpdateBudget: (newBudget: MonthlyBudget) => void;
  transactions: Transaction[];
  onOpenReceiptScan: () => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  budget,
  onUpdateBudget,
  transactions,
  onOpenReceiptScan,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTotal, setEditedTotal] = useState(budget.totalBudget);
  const [editedCategories, setEditedCategories] = useState<Record<CategoryType, number>>({
    ...budget.categories,
  });

  // Calculate actual spending per category
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

  const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const remainingTotal = Math.max(0, budget.totalBudget - totalSpent);
  const totalPercent = Math.min(100, Math.round((totalSpent / budget.totalBudget) * 100));

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBudget({
      totalBudget: Number(editedTotal),
      categories: editedCategories,
    });
    setIsEditing(false);
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

  // Find categories that have exceeded or near limits
  const warningCategories = Object.entries(budget.categories).filter(([cat, limit]) => {
    const spent = categorySpending[cat as CategoryType] || 0;
    return spent / limit >= 0.75;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Smart Budget
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Set monthly guardrails and prevent micro-expenses from breaking your targets
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <Sliders className="h-3.5 w-3.5 text-slate-500" />
          <span>{isEditing ? 'Cancel Editing' : 'Adjust Monthly Budget'}</span>
        </button>
      </div>

      {/* Editing Drawer / Modal if active */}
      {isEditing && (
        <form
          onSubmit={handleSaveBudget}
          className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Configure Budget Allocations (NPR)
              </h2>
              <p className="text-xs text-slate-500">
                Modify your overall monthly cap and per-category limits
              </p>
            </div>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-2xs"
            >
              Save Changes
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Overall Monthly Budget (Rs.)
            </label>
            <input
              type="number"
              step="500"
              value={editedTotal}
              onChange={(e) => setEditedTotal(Math.max(1000, Number(e.target.value)))}
              className="w-full max-w-xs rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {(Object.keys(editedCategories) as CategoryType[]).map((cat) => (
              <div key={cat} className="space-y-1">
                <label className="text-xs font-medium text-slate-600">{cat}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-2 text-xs text-slate-400 font-semibold">
                    Rs.
                  </span>
                  <input
                    type="number"
                    step="250"
                    value={editedCategories[cat]}
                    onChange={(e) =>
                      setEditedCategories({
                        ...editedCategories,
                        [cat]: Math.max(0, Number(e.target.value)),
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 py-1.5 pl-10 pr-3 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </form>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Monthly Budget Ceiling</span>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            Rs. {budget.totalBudget.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">October 2026 target</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Total Spent So Far</span>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            Rs. {totalSpent.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">{totalPercent}% of monthly ceiling</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Remaining Cushion</span>
          <div className="mt-2 text-2xl font-bold text-emerald-700">
            Rs. {remainingTotal.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            ~Rs. {Math.round(remainingTotal / 21).toLocaleString()} / day safe spend
          </p>
        </div>
      </div>

      {/* Warning Banners if any category approaching limits */}
      {warningCategories.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-amber-950">
                Budget Warning Alerts ({warningCategories.length} categories)
              </h2>
              <ul className="mt-1.5 space-y-1 text-xs text-amber-900">
                {warningCategories.map(([cat, limit]) => {
                  const spent = categorySpending[cat as CategoryType] || 0;
                  const pct = Math.round((spent / limit) * 100);
                  return (
                    <li key={cat} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                      <span>
                        <strong className="font-semibold">{cat}</strong> has reached{' '}
                        <strong className="font-semibold">{pct}%</strong> (Rs. {spent.toLocaleString()} / Rs. {limit.toLocaleString()}).
                        {pct >= 80 ? ' Reduce discretionary spend or reallocate.' : ''}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Category Progress Bars Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Category Budget Breakdown
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live comparison of allocated limits vs actual verified receipts
            </p>
          </div>
          <span className="text-xs text-slate-400">Values in Nepali Rupees (Rs.)</span>
        </div>

        <div className="mt-6 space-y-6">
          {(Object.entries(budget.categories) as [CategoryType, number][]).map(([catName, allocated]) => {
            const spent = categorySpending[catName] || 0;
            const percent = Math.min(100, Math.round((spent / allocated) * 100));
            const remaining = Math.max(0, allocated - spent);
            const isDanger = percent >= 90;
            const isWarning = percent >= 75 && percent < 90;

            return (
              <div key={catName} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                      {getCategoryIcon(catName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{catName}</span>
                        {isDanger ? (
                          <span className="rounded bg-rose-100 px-1.5 py-0.2 text-[9px] font-bold text-rose-800">
                            90%+ LIMIT
                          </span>
                        ) : isWarning ? (
                          <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800">
                            WARNING
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Remaining: Rs. {remaining.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:text-right">
                    <div className="text-xs font-bold text-slate-900">
                      Rs. {spent.toLocaleString()} <span className="font-normal text-slate-400">/ Rs. {allocated.toLocaleString()}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {percent}% consumed
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDanger
                        ? 'bg-rose-500'
                        : isWarning
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
  );
};
