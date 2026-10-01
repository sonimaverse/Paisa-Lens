import React from 'react';
import {
  LayoutDashboard,
  ScanLine,
  PieChart,
  Lightbulb,
  ReceiptText,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  microExpensesTotal: number;
  totalSpent: number;
  onStartDemo: () => void;
  onOpenHowItWorks: () => void;
  closeMobileMenu?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  microExpensesTotal,
  totalSpent,
  onStartDemo,
  onOpenHowItWorks,
  closeMobileMenu,
}) => {
  const microPercent = totalSpent > 0 ? Math.round((microExpensesTotal / totalSpent) * 100) : 0;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'scan',
      label: 'Scan Receipt',
      icon: ScanLine,
      badge: 'OCR',
    },
    {
      id: 'budget',
      label: 'Smart Budget',
      icon: PieChart,
      badge: null,
    },
    {
      id: 'insights',
      label: 'Micro-Expense & Insights',
      icon: Lightbulb,
      badge: `${microPercent}%`,
    },
    {
      id: 'transactions',
      label: 'Transaction History',
      icon: ReceiptText,
      badge: null,
    },
  ];

  const handleNav = (tabId: string) => {
    onSelectTab(tabId);
    if (closeMobileMenu) {
      closeMobileMenu();
    }
  };

  return (
    <aside className="flex h-full w-full flex-col justify-between p-4">
      {/* Navigation Links */}
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Platform Menu
          </p>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? 'bg-emerald-200/80 text-emerald-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Micro-Expense Alert Highlight Card */}
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-3.5 text-amber-900 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="rounded-md bg-amber-100 p-1.5 text-amber-800">
              <TrendingDown className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-950">Micro-Expense Leak</p>
              <p className="mt-1 text-[11px] leading-relaxed text-amber-900">
                You spent <span className="font-bold">Rs. {microExpensesTotal.toLocaleString()}</span> on small tea, snacks & transit ({microPercent}% of total).
              </p>
              <button
                onClick={() => handleNav('insights')}
                className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-950 hover:underline"
              >
                Inspect micro-leakage
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info & Quick Demo */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">Hackathon Flow</span>
            <button
              onClick={onOpenHowItWorks}
              className="text-[11px] text-emerald-700 hover:underline font-semibold"
            >
              How it works
            </button>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            SCAN → UNDERSTAND → TRACK → SAVE
          </p>
          <button
            onClick={() => {
              onStartDemo();
              if (closeMobileMenu) closeMobileMenu();
            }}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-800 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
            <span>Launch Demo Flow</span>
          </button>
        </div>

        <div className="text-center text-[10px] text-slate-400">
          “Every rupee counts. Even the small ones.”
        </div>
      </div>
    </aside>
  );
};
