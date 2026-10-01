export type CategoryType = 
  | 'Food & Groceries'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Education'
  | 'Health'
  | 'Other';

export type PaymentMethod = 'eSewa' | 'Khalti' | 'Fonepay' | 'Cash' | 'Card';

export interface ExpenseItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  category?: CategoryType;
}

export interface Transaction {
  id: string;
  date: string; // ISO date string or formatted (e.g. 2026-10-01)
  merchant: string;
  category: CategoryType;
  amount: number;
  paymentMethod: PaymentMethod;
  isMicroExpense: boolean;
  microTag?: string; // e.g. "Tea & Snacks", "Local Bus", "Impulse Buy"
  items?: ExpenseItem[];
  receiptUrl?: string;
  notes?: string;
  vatAmount?: number;
  invoiceNo?: string;
}

export interface CategoryBudget {
  category: CategoryType;
  allocated: number;
  iconName: string;
  color: string;
}

export interface MonthlyBudget {
  totalBudget: number; // e.g. Rs. 20,000
  categories: Record<CategoryType, number>;
}

export interface OCRScanResult {
  merchant: string;
  merchantAddress?: string;
  panNumber?: string;
  invoiceNumber?: string;
  date: string;
  items: Array<{ name: string; price: number; quantity?: number }>;
  subtotal: number;
  vatAmount?: number;
  serviceCharge?: number;
  discount?: number;
  total: number;
  suggestedCategory: CategoryType;
  isMicroExpense: boolean;
  microReason?: string;
  confidenceScore: number;
  paymentMethod: PaymentMethod;
  rawText?: string;
  receiptPresetId?: string;
}

export interface SampleReceiptPreset {
  id: string;
  name: string;
  subtitle: string;
  merchant: string;
  date: string;
  total: number;
  category: CategoryType;
  isMicroExpense: boolean;
  items: Array<{ name: string; price: number }>;
  vat: number;
  pan: string;
  invoiceNo: string;
  badge: string;
  description: string;
}
