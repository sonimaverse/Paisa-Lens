import React from 'react';
import { Camera, Sparkles, HelpCircle, Plus, Menu, X, Receipt } from 'lucide-react';

interface HeaderProps {
  onStartDemo: () => void;
  onOpenHowItWorks: () => void;
  onOpenAddModal: () => void;
  onNavigate: (tab: string) => void;
  currentTab: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onStartDemo,
  onOpenHowItWorks,
  onOpenAddModal,
  onNavigate,
  currentTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-800">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Paisa<span className="text-emerald-700">Lens</span>
                </span>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 uppercase tracking-wide border border-emerald-200">
                  Hackathon Prototype
                </span>
              </div>
              <p className="hidden text-[11px] text-slate-500 sm:block">
                Smart Personal Finance & Micro-Expense OCR Tracker
              </p>
            </div>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* How It Works Button */}
          <button
            onClick={onOpenHowItWorks}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="How PaisaLens works & Hackathon demo overview"
          >
            <HelpCircle className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">How It Works</span>
          </button>

          {/* Quick Add Manual Expense */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <Plus className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Add Expense</span>
          </button>

          {/* TRY DEMO BUTTON (Main hackathon demo CTA) */}
          <button
            onClick={onStartDemo}
            className="relative inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 transition-all focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-200 animate-pulse" />
            <span>Try Demo</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
