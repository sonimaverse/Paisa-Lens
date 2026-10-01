import React from 'react';
import {
  X,
  Sparkles,
  Camera,
  Brain,
  TrendingDown,
  PiggyBank,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDemo: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStartDemo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide border border-emerald-200 mb-1.5">
              Hackathon Pitch & Architecture
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              PaisaLens — Smart Personal Finance & Micro-Expense OCR
            </h2>
            <p className="mt-1 text-xs text-emerald-800 font-semibold italic">
              “Every rupee counts. Even the small ones.”
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* The Core Problem & Solution */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
              The Real Problem
            </span>
            <p className="mt-1 text-xs text-rose-950 font-medium leading-relaxed">
              People remember big purchases (rent, gadgets, fees) but lose track of small daily outlays like Rs. 50 tea, Rs. 80 snacks, and Rs. 120 rides. These micro-expenses silently bleed <strong>20% to 30%</strong> of monthly earnings.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              The PaisaLens Solution
            </span>
            <p className="mt-1 text-xs text-emerald-950 font-medium leading-relaxed">
              Users snap or upload any receipt. PaisaLens runs instant OCR, extracts itemized costs, auto-categorizes, updates remaining budget in NPR, and spotlights micro-leakages before money runs out.
            </p>
          </div>
        </div>

        {/* 4-Step Pipeline: SCAN -> UNDERSTAND -> TRACK -> SAVE */}
        <div className="mt-6">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
            How It Works (4-Step Pipeline)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Step 1: SCAN */}
            <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs mb-2">
                1
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">SCAN</h4>
              <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                Camera capture or drag & drop thermal receipts, invoices, or delivery slips.
              </p>
            </div>

            {/* Step 2: UNDERSTAND */}
            <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-800 font-bold text-xs mb-2">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">UNDERSTAND</h4>
              <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                Extract merchant, date, NPR line items, 13% VAT, and flag micro-expenses.
              </p>
            </div>

            {/* Step 3: TRACK */}
            <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800 font-bold text-xs mb-2">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">TRACK</h4>
              <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                Instantly adjusts Food, Transport, and Shopping category limits with warning alerts.
              </p>
            </div>

            {/* Step 4: SAVE */}
            <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-800 font-bold text-xs mb-2">
                4
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">SAVE</h4>
              <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                Uncovers the “Nepali Chiya Effect” and gives actionable advice to save Rs. 800-1,200/mo.
              </p>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-6 rounded-xl bg-slate-900 p-4 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Hackathon Demo Mode Ready
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                Experience full OCR flow in 5 seconds
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Loads realistic Bhat-Bhateni or Chiya Pasal receipt, parses items, updates balance, and logs insight.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onStartDemo();
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch Demo Now</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
