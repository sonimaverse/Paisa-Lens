/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ScanReceiptView } from './components/ScanReceiptView';
import { BudgetView } from './components/BudgetView';
import { InsightsView } from './components/InsightsView';
import { TransactionsView } from './components/TransactionsView';
import { AddExpenseModal } from './components/AddExpenseModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { CALIBRATED_TRANSACTIONS, INITIAL_MONTHLY_BUDGET } from './data/mockData';
import { MonthlyBudget, Transaction } from './types';
import { Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';

const STORAGE_KEYS = {
  TRANSACTIONS: 'paisalens_transactions_v1',
  BUDGET: 'paisalens_budget_v1',
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [presetToAutoLoad, setPresetToAutoLoad] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Transactions State with persistence fallback
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return CALIBRATED_TRANSACTIONS;
  });

  // Monthly Budget State
  const [budget, setBudget] = useState<MonthlyBudget>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGET);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.totalBudget) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_MONTHLY_BUDGET;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [budget]);

  // Notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Add Transaction
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(
      `Logged Rs. ${newTx.amount.toLocaleString()} for ${newTx.merchant} (${newTx.category})`
    );
  };

  // Delete Transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction removed');
  };

  // Reset demo state back to calibrated defaults
  const handleResetDemoData = () => {
    setTransactions(CALIBRATED_TRANSACTIONS);
    setBudget(INITIAL_MONTHLY_BUDGET);
    showToast('Reset data to default hackathon demo state');
  };

  // Quick Demo Trigger
  const handleStartDemo = () => {
    setPresetToAutoLoad('bhat-bhateni');
    setCurrentTab('scan');
    setIsMobileMenuOpen(false);
    showToast('Demo Flow: Loaded Bhat-Bhateni receipt and initiated OCR scanning!');
  };

  const handleSelectSampleReceipt = (receiptId: string) => {
    setPresetToAutoLoad(receiptId);
    setCurrentTab('scan');
  };

  // Calculate totals for sidebar badge
  const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);
  const microExpensesTotal = transactions
    .filter((t) => t.isMicroExpense)
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Header */}
      <Header
        onStartDemo={handleStartDemo}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onNavigate={(tab) => setCurrentTab(tab)}
        currentTab={currentTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Body with Sidebar */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden md:block w-64 shrink-0 rounded-2xl border border-slate-200 bg-white shadow-2xs h-[calc(100vh-6.5rem)] sticky top-20 overflow-y-auto">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            microExpensesTotal={microExpensesTotal}
            totalSpent={totalSpent}
            onStartDemo={handleStartDemo}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          />
        </div>

        {/* Mobile Slide-out Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden bg-slate-900/60 backdrop-blur-xs">
            <div className="relative w-72 max-w-[80vw] bg-white p-4 shadow-xl">
              <Sidebar
                currentTab={currentTab}
                onSelectTab={(tab) => {
                  setCurrentTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                microExpensesTotal={microExpensesTotal}
                totalSpent={totalSpent}
                onStartDemo={handleStartDemo}
                onOpenHowItWorks={() => {
                  setIsHowItWorksOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                closeMobileMenu={() => setIsMobileMenuOpen(false)}
              />
            </div>
            <div
              className="flex-1"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0 pb-12">
          {/* Subtle Demo Mode Indicator Bar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-100/90 px-3.5 py-1.5 text-[11px] text-slate-600 border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-800">PaisaLens Live Demo</span>
              <span className="text-slate-400">·</span>
              <span>Nepal NPR · Bhat-Bhateni / Chiya OCR Active</span>
            </div>
            <button
              onClick={handleResetDemoData}
              className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900 hover:underline"
              title="Reset transactions and budget to clean demo state"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Data</span>
            </button>
          </div>

          {/* Tab Views */}
          {currentTab === 'dashboard' && (
            <DashboardView
              transactions={transactions}
              budget={budget}
              onNavigate={(tab) => setCurrentTab(tab)}
              onSelectSampleReceipt={handleSelectSampleReceipt}
              onOpenReceiptScan={() => setCurrentTab('scan')}
            />
          )}

          {currentTab === 'scan' && (
            <ScanReceiptView
              onAddTransaction={handleAddTransaction}
              presetToAutoLoad={presetToAutoLoad}
              onClearAutoLoadPreset={() => setPresetToAutoLoad(null)}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'budget' && (
            <BudgetView
              budget={budget}
              onUpdateBudget={(b) => setBudget(b)}
              transactions={transactions}
              onOpenReceiptScan={() => setCurrentTab('scan')}
            />
          )}

          {currentTab === 'insights' && (
            <InsightsView
              transactions={transactions}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenReceiptScan={() => setCurrentTab('scan')}
            />
          )}
        </main>
      </div>

      {/* Floating Bottom Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStartDemo={handleStartDemo}
      />
    </div>
  );
}
