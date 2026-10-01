import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Camera,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Tag,
  Calendar,
  Store,
  DollarSign,
  AlertCircle,
  FileText,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CategoryType, OCRScanResult, PaymentMethod, SampleReceiptPreset, Transaction } from '../types';
import { SAMPLE_RECEIPTS } from '../data/mockData';
import { processReceipt, ScanProgressUpdate } from '../services/ocrService';
import { ThermalReceiptGraphic } from './ThermalReceiptGraphic';

interface ScanReceiptViewProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  presetToAutoLoad?: string | null;
  onClearAutoLoadPreset?: () => void;
  onNavigate: (tab: string) => void;
}

export const ScanReceiptView: React.FC<ScanReceiptViewProps> = ({
  onAddTransaction,
  presetToAutoLoad,
  onClearAutoLoadPreset,
  onNavigate,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<SampleReceiptPreset>(SAMPLE_RECEIPTS[0]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<ScanProgressUpdate | null>(null);
  const [extractedData, setExtractedData] = useState<OCRScanResult | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Editable fields in extracted data
  const [editMerchant, setEditMerchant] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editCategory, setEditCategory] = useState<CategoryType>('Food & Groceries');
  const [editPaymentMethod, setEditPaymentMethod] = useState<PaymentMethod>('Fonepay');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Auto trigger if presetToAutoLoad is passed
  useEffect(() => {
    if (presetToAutoLoad) {
      const match = SAMPLE_RECEIPTS.find((r) => r.id === presetToAutoLoad) || SAMPLE_RECEIPTS[0];
      setSelectedPreset(match);
      handleRunOCR(match);
      if (onClearAutoLoadPreset) {
        onClearAutoLoadPreset();
      }
    }
  }, [presetToAutoLoad]);

  const handleRunOCR = async (target: SampleReceiptPreset | File) => {
    setIsProcessing(true);
    setExtractedData(null);
    setAddedSuccess(false);

    try {
      const result = await processReceipt(target, (progress) => {
        setScanProgress(progress);
      });

      setExtractedData(result);
      setEditMerchant(result.merchant);
      setEditDate(result.date);
      setEditCategory(result.suggestedCategory);
      setEditPaymentMethod(result.paymentMethod);
    } catch (err) {
      console.error('OCR processing error:', err);
    } finally {
      setIsProcessing(false);
      setScanProgress(null);
    }
  };

  const handleSelectPreset = (preset: SampleReceiptPreset) => {
    setSelectedPreset(preset);
    setCustomImagePreview(null);
    handleRunOCR(preset);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCustomImagePreview(previewUrl);
      handleRunOCR(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCustomImagePreview(previewUrl);
      handleRunOCR(file);
    }
  };

  const handleConfirmAddToExpenses = () => {
    if (!extractedData) return;

    const newTx: Omit<Transaction, 'id'> = {
      merchant: editMerchant || extractedData.merchant,
      date: editDate || extractedData.date,
      amount: extractedData.total,
      category: editCategory,
      paymentMethod: editPaymentMethod,
      isMicroExpense: extractedData.isMicroExpense,
      microTag: extractedData.isMicroExpense ? (editCategory === 'Transport' ? 'Transport' : 'Tea & Snacks') : undefined,
      vatAmount: extractedData.vatAmount,
      invoiceNo: extractedData.invoiceNumber,
      items: extractedData.items.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      notes: extractedData.microReason || `Scanned receipt from ${editMerchant || extractedData.merchant}`,
    };

    onAddTransaction(newTx);
    setAddedSuccess(true);

    // Delightful Confetti celebration
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#059669', '#10b981', '#34d399', '#f59e0b', '#3b82f6'],
      });
    } catch {
      // Ignore if confetti fails
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Scan Receipt
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Turn your physical receipt into a smart categorized expense with line-item extraction
          </p>
        </div>

        {/* Demo Preset quick-switch buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-500 font-medium mr-1">Sample Bills:</span>
          {SAMPLE_RECEIPTS.slice(0, 3).map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                selectedPreset.id === preset.id && !customImagePreview
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {preset.name.split(' ')[0]} (Rs. {preset.total})
            </button>
          ))}
        </div>
      </div>

      {/* Main OCR Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Upload Dropzone & Sample Selector (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center hover:border-emerald-600 transition-colors shadow-2xs cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,.pdf"
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-8 ring-emerald-50/50 group-hover:scale-105 transition-transform">
              <UploadCloud className="h-7 w-7" />
            </div>

            <h2 className="mt-4 text-sm font-bold text-slate-900">
              Upload receipt image
            </h2>
            <p className="mt-1 text-xs text-slate-500 max-w-xs leading-relaxed">
              Drag & drop your thermal bill, invoice, or screenshot here, or click to browse.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                <Camera className="h-3.5 w-3.5 text-emerald-700" />
                <span>Take Photo</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-800"
              >
                <span>Select File</span>
              </button>
            </div>
            <p className="mt-3 text-[10px] text-slate-400">
              Supports JPEG, PNG, WEBP · Realistic OCR parser
            </p>
          </div>

          {/* Sample Receipts selector panel for quick demo */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">
                Demo Sample Receipts (Nepal)
              </span>
              <span className="text-[10px] text-slate-400">1-click test</span>
            </div>

            <div className="mt-3 space-y-2">
              {SAMPLE_RECEIPTS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id && !customImagePreview;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex w-full items-center justify-between rounded-xl p-2.5 text-left transition-all ${
                      isSelected
                        ? 'border border-emerald-600 bg-emerald-50/70'
                        : 'border border-slate-100 bg-slate-50/50 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                          preset.isMicroExpense
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {preset.isMicroExpense ? '☕' : '🛒'}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-900 truncate">
                            {preset.name}
                          </span>
                          {preset.isMicroExpense && (
                            <span className="rounded bg-amber-100 px-1 py-0.2 text-[9px] font-bold text-amber-800 shrink-0">
                              MICRO
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          {preset.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className="text-xs font-bold text-slate-900">
                        Rs. {preset.total}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: OCR Scanner Animation & Extracted Information (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Scanning Status Display */}
          {isProcessing && scanProgress && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-2xs animate-pulse-glow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white animate-spin">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-emerald-950">
                      {scanProgress.label}
                    </h2>
                    <p className="text-[11px] text-emerald-800">
                      {scanProgress.sublabel}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 font-mono">
                  {scanProgress.progressPercent}%
                </span>
              </div>

              {/* Stepper bar */}
              <div className="mt-3.5 h-2 w-full rounded-full bg-emerald-200/70 overflow-hidden">
                <div
                  className="h-full bg-emerald-700 transition-all duration-300 rounded-full"
                  style={{ width: `${scanProgress.progressPercent}%` }}
                />
              </div>

              {/* Steps ticker */}
              <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[10px] text-emerald-800">
                <span className={scanProgress.step >= 1 ? 'font-bold text-emerald-950' : 'opacity-60'}>
                  1. Scan
                </span>
                <span className={scanProgress.step >= 2 ? 'font-bold text-emerald-950' : 'opacity-60'}>
                  2. Extract
                </span>
                <span className={scanProgress.step >= 3 ? 'font-bold text-emerald-950' : 'opacity-60'}>
                  3. Categorize
                </span>
                <span className={scanProgress.step >= 4 ? 'font-bold text-emerald-950' : 'opacity-60'}>
                  4. Budget
                </span>
              </div>
            </div>
          )}

          {/* Visual Receipt Graphic + Extracted Bill side-by-side or stacked */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Extracted Receipt Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Extracted via optical character recognition with line items & tax breakdown
                </p>
              </div>

              {extractedData && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{extractedData.confidenceScore}% OCR match</span>
                </div>
              )}
            </div>

            {/* Extracted form & items */}
            {extractedData ? (
              <div className="mt-5 space-y-5">
                {/* Micro-expense insight callout banner if applicable */}
                {extractedData.isMicroExpense && (
                  <div className="rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-amber-900">
                    <div className="flex items-start gap-2.5">
                      <span className="text-base">👀</span>
                      <div>
                        <span className="text-xs font-bold text-amber-950">
                          Micro-Expense Detected (Rs. {extractedData.total})
                        </span>
                        <p className="mt-0.5 text-xs text-amber-900 leading-relaxed">
                          {extractedData.microReason ||
                            'Small daily purchases like this silently accumulate into 20%+ of monthly expenses!'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Primary Metadata Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Merchant */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Merchant Name
                    </label>
                    <div className="relative">
                      <Store className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={editMerchant}
                        onChange={(e) => setEditMerchant(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Receipt Date
                    </label>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Expense Category
                    </label>
                    <div className="relative">
                      <Tag className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as CategoryType)}
                        className="w-full appearance-none rounded-xl border border-slate-200 py-2 pl-9 pr-8 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none bg-white"
                      >
                        <option value="Food & Groceries">Food & Groceries</option>
                        <option value="Transport">Transport</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Education">Education</option>
                        <option value="Health">Health</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Payment Channel
                    </label>
                    <select
                      value={editPaymentMethod}
                      onChange={(e) => setEditPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none bg-white"
                    >
                      <option value="Fonepay">Fonepay QR</option>
                      <option value="eSewa">eSewa Wallet</option>
                      <option value="Khalti">Khalti Digital</option>
                      <option value="Cash">Cash (Local)</option>
                      <option value="Card">Debit / Credit Card</option>
                    </select>
                  </div>
                </div>

                {/* Itemized Line Items Table */}
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between text-[11px] font-bold text-slate-600">
                    <span>ITEM NAME</span>
                    <span>PRICE</span>
                  </div>
                  <div className="divide-y divide-slate-100 bg-white">
                    {extractedData.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center px-4 py-2.5 text-xs">
                        <span className="text-slate-800 font-medium">{item.name}</span>
                        <span className="font-semibold text-slate-900">
                          Rs. {item.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total calculation strip */}
                  <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span>Rs. {extractedData.subtotal.toLocaleString()}</span>
                    </div>
                    {extractedData.vatAmount !== undefined && extractedData.vatAmount > 0 && (
                      <div className="flex justify-between text-slate-500">
                        <span>VAT (13%)</span>
                        <span>Rs. {extractedData.vatAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                      <span>Total Amount</span>
                      <span className="text-emerald-700 text-base">
                        Rs. {extractedData.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => handleRunOCR(selectedPreset)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Re-scan Receipt</span>
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {addedSuccess ? (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" /> Added to Expenses!
                        </span>
                        <button
                          onClick={() => onNavigate('dashboard')}
                          className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
                        >
                          View Dashboard
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleConfirmAddToExpenses}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition-all hover:scale-102"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Add to Expenses</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Fallback view when no receipt processed yet */
              <div className="my-6">
                <ThermalReceiptGraphic
                  receipt={selectedPreset}
                  isScanning={isProcessing}
                />
                <div className="mt-4 text-center">
                  <button
                    onClick={() => handleRunOCR(selectedPreset)}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Process {selectedPreset.name} (OCR)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
