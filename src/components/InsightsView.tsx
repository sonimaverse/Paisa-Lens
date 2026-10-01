import React, { useState } from 'react';
import {
  Coffee,
  Car,
  ShoppingBag,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Calculator,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Sliders,
  Flame
} from 'lucide-react';
import { Transaction } from '../types';
import { SMART_AI_INSIGHTS } from '../data/mockData';

interface InsightsViewProps {
  transactions: Transaction[];
  onNavigate: (tab: string) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ transactions, onNavigate }) => {
  // Micro-expense interactive simulator
  const [dailyChiyaCups, setDailyChiyaCups] = useState<number>(2);
  const [cupCost, setCupCost] = useState<number>(35); // Average Rs. 35 per cup
  const [dailySnackCost, setDailySnackCost] = useState<number>(50); // Samosa / bakery

  // Calculate micro metrics from actual transactions
  const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);
  const microTransactions = transactions.filter((t) => t.isMicroExpense);
  const microTotal = microTransactions.reduce((acc, t) => acc + t.amount, 0);
  const microPercent = totalSpent > 0 ? Math.round((microTotal / totalSpent) * 100) : 0;

  const teaAndSnacks = microTransactions
    .filter((t) => t.microTag === 'Tea & Snacks' || (t.category === 'Food & Groceries' && t.amount <= 200))
    .reduce((acc, t) => acc + t.amount, 0);

  const microTransport = microTransactions
    .filter((t) => t.microTag === 'Transport' || (t.category === 'Transport' && t.amount <= 200))
    .reduce((acc, t) => acc + t.amount, 0);

  const microOnline = microTransactions
    .filter(
      (t) =>
        t.microTag === 'Small Online Purchases' ||
        (t.amount <= 350 && (t.category === 'Shopping' || t.category === 'Other' || t.category === 'Education'))
    )
    .reduce((acc, t) => acc + t.amount, 0);

  // Chiya Calculator calculations
  const dailyChiyaSpend = dailyChiyaCups * cupCost + dailySnackCost;
  const monthlyChiyaSpend = dailyChiyaSpend * 30;
  const yearlyChiyaSpend = dailyChiyaSpend * 365;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Micro-Expense & AI Insights
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          Uncovering hidden daily leakages: Rs. 50 tea, Rs. 80 snacks, and Rs. 120 rides
        </p>
      </div>

      {/* CORE WOW FEATURE: “Your Small Expenses Are Adding Up 👀” */}
      <div className="rounded-2xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-amber-200/80 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900 mb-1.5">
              <span>Main Diagnostic Focus</span>
            </div>
            <h2 className="text-xl font-extrabold text-amber-950 sm:text-2xl">
              Your Small Expenses Are Adding Up 👀
            </h2>
            <p className="text-xs text-amber-900 mt-1 max-w-xl">
              People easily budget for Rs. 25,000 rent or Rs. 15,000 tuition, but fail to notice how small daily swipes bleed 20% to 30% of their take-home income.
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 border border-amber-200 shadow-2xs text-center shrink-0">
            <span className="text-xs font-semibold text-slate-500">Total Micro-Expenses</span>
            <div className="text-2xl font-extrabold text-amber-950 mt-0.5">
              Rs. {microTotal.toLocaleString()}
            </div>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
              {microPercent}% of monthly spending
            </span>
          </div>
        </div>

        {/* 3 Categories of Micro-Expenses */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tea & Snacks */}
          <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500">Item Breakdown</span>
                <h3 className="text-sm font-bold text-slate-900">Tea & Snacks</h3>
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-xl font-bold text-amber-950">
                Rs. {teaAndSnacks.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">
                {Math.round((teaAndSnacks / microTotal) * 100)}% of micro
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Mama ko chiya, morning milk tea, afternoon samosas, and bakery buns.
            </p>
          </div>

          {/* Transport */}
          <div className="rounded-xl border border-sky-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-800">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500">Item Breakdown</span>
                <h3 className="text-sm font-bold text-slate-900">Transport</h3>
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-xl font-bold text-sky-950">
                Rs. {microTransport.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">
                {Math.round((microTransport / microTotal) * 100)}% of micro
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Short Pathao rides, Safa tempo tokens, and local micro-bus fares.
            </p>
          </div>

          {/* Small Online Purchases */}
          <div className="rounded-xl border border-purple-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-800">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500">Item Breakdown</span>
                <h3 className="text-sm font-bold text-slate-900">Small Online Purchases</h3>
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-xl font-bold text-purple-950">
                Rs. {microOnline.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">
                {Math.round((microOnline / microTotal) * 100)}% of micro
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Rs. 190 data packs, flash sale impulse buys, stationery, and xerox.
            </p>
          </div>
        </div>

        {/* Proportional Visual Bar Chart */}
        <div className="mt-6 rounded-xl bg-white p-4 border border-amber-200">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-800">Micro-Expense Distribution</span>
            <span className="text-slate-500">Total: Rs. {microTotal.toLocaleString()}</span>
          </div>

          <div className="h-4 w-full rounded-md bg-slate-100 flex overflow-hidden">
            <div
              style={{ width: `${(teaAndSnacks / microTotal) * 100}%` }}
              className="bg-amber-500 flex items-center justify-center text-[10px] text-white font-bold"
              title={`Tea & Snacks: Rs. ${teaAndSnacks}`}
            >
              {Math.round((teaAndSnacks / microTotal) * 100)}%
            </div>
            <div
              style={{ width: `${(microTransport / microTotal) * 100}%` }}
              className="bg-sky-500 flex items-center justify-center text-[10px] text-white font-bold"
              title={`Transport: Rs. ${microTransport}`}
            >
              {Math.round((microTransport / microTotal) * 100)}%
            </div>
            <div
              style={{ width: `${(microOnline / microTotal) * 100}%` }}
              className="bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold"
              title={`Small Online: Rs. ${microOnline}`}
            >
              {Math.round((microOnline / microTotal) * 100)}%
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span>Tea & Snacks (Rs. {teaAndSnacks.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
              <span>Transport (Rs. {microTransport.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              <span>Small Online (Rs. {microOnline.toLocaleString()})</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-700 font-medium">
            💡 “These small expenses make up <span className="font-bold text-amber-900">{microPercent}%</span> of your monthly spending.”
          </div>
        </div>
      </div>

      {/* THE "NEPALI CHIYA EFFECT" INTERACTIVE SIMULATOR */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Calculator className="h-5 w-5 text-emerald-700" />
          <div>
            <h2 className="text-base font-bold text-slate-900">
              The Nepali “Chiya Effect” Calculator
            </h2>
            <p className="text-xs text-slate-500">
              Interactive simulator demonstrating how daily small habits compound over 1 year
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Daily Cups of Chiya:</span>
                <span className="text-emerald-700 font-bold">{dailyChiyaCups} cups/day</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                value={dailyChiyaCups}
                onChange={(e) => setDailyChiyaCups(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Average Chiya Price (NPR):</span>
                <span className="text-emerald-700 font-bold">Rs. {cupCost} / cup</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={cupCost}
                onChange={(e) => setCupCost(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Daily Snack / Samosa / Biscuit:</span>
                <span className="text-emerald-700 font-bold">Rs. {dailySnackCost} / day</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={dailySnackCost}
                onChange={(e) => setDailySnackCost(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-6 rounded-xl bg-slate-50 p-5 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Compounded Annual Outflow
            </span>
            <div className="mt-2 text-3xl font-extrabold text-emerald-800">
              Rs. {yearlyChiyaSpend.toLocaleString()} <span className="text-sm font-normal text-slate-500">/ year</span>
            </div>
            <div className="mt-1 text-xs text-slate-600 font-medium">
              = Rs. {monthlyChiyaSpend.toLocaleString()} per month · Rs. {dailyChiyaSpend} per day
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
              <p>
                🎯 <strong>What this Rs. {yearlyChiyaSpend.toLocaleString()} could fund:</strong>
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-500">
                <li>3 months of full high-speed Internet + Mobile recharges</li>
                <li>A roundtrip domestic flight to Pokhara or Biratnagar</li>
                <li>An emergency buffer fund in a high-yield Nepal savings account</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SMART AI INSIGHTS (Prompt section 5) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-700" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Smart AI Insights & Recommendations
              </h2>
              <p className="text-xs text-slate-500">
                Automated pattern detection from your verified receipts and transaction cadence
              </p>
            </div>
          </div>
          <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            4 Insights Active
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {SMART_AI_INSIGHTS.map((insight) => (
            <div
              key={insight.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors bg-white shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {insight.category}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    {insight.metric}
                  </span>
                </div>
                <h3 className="mt-2 text-xs font-bold text-slate-900 leading-snug">
                  {insight.title}
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {insight.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-semibold cursor-pointer hover:underline">
                  {insight.actionText} →
                </span>
                <span className="text-[10px] text-slate-400">PaisaLens AI</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
