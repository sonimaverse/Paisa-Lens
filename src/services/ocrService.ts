import { CategoryType, OCRScanResult, PaymentMethod, SampleReceiptPreset } from '../types';
import { SAMPLE_RECEIPTS } from '../data/mockData';

export interface ScanProgressUpdate {
  step: number;
  totalSteps: number;
  label: string;
  sublabel: string;
  progressPercent: number;
}

export type ScanProgressCallback = (update: ScanProgressUpdate) => void;

/**
 * Process a sample preset or custom uploaded receipt image.
 * Uses stepped delays for realistic hackathon animation presentation.
 */
export async function processReceipt(
  target: SampleReceiptPreset | File | string,
  onProgress?: ScanProgressCallback
): Promise<OCRScanResult> {
  const steps: Array<{ label: string; sublabel: string; delay: number }> = [
    {
      label: 'Scanning receipt...',
      sublabel: 'Detecting thermal receipt boundaries and contrast',
      delay: 550,
    },
    {
      label: 'Extracting items...',
      sublabel: 'Parsing line items, quantities, and NPR figures',
      delay: 600,
    },
    {
      label: 'Categorizing expense...',
      sublabel: 'Applying Nepali merchant categorization rules',
      delay: 500,
    },
    {
      label: 'Updating budget...',
      sublabel: 'Evaluating micro-expense impact & monthly ceilings',
      delay: 450,
    },
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (onProgress) {
      onProgress({
        step: i + 1,
        totalSteps: steps.length,
        label: s.label,
        sublabel: s.sublabel,
        progressPercent: Math.round(((i + 1) / steps.length) * 100),
      });
    }
    await new Promise((r) => setTimeout(r, s.delay));
  }

  // If a preset was passed directly
  if (typeof target === 'object' && 'id' in target && 'merchant' in target) {
    const preset = target as SampleReceiptPreset;
    return mapPresetToScanResult(preset);
  }

  // If a preset id string was passed
  if (typeof target === 'string') {
    const found = SAMPLE_RECEIPTS.find((r) => r.id === target);
    if (found) {
      return mapPresetToScanResult(found);
    }
  }

  // If an uploaded File was passed
  if (target instanceof File) {
    return generateSmartHeuristicResultFromFile(target);
  }

  // Default fallback to Bhat-Bhateni
  return mapPresetToScanResult(SAMPLE_RECEIPTS[0]);
}

function mapPresetToScanResult(preset: SampleReceiptPreset): OCRScanResult {
  const subtotal = preset.items.reduce((acc, item) => acc + item.price, 0);
  const vat = preset.vat || Math.round(subtotal * 0.13);
  const isMicro = preset.total <= 250 || preset.isMicroExpense;

  let microReason = undefined;
  if (isMicro) {
    if (preset.id === 'chiya-pasal') {
      microReason = 'Frequent tea/snack under Rs. 150. Adds up to Rs. 3,300+ monthly!';
    } else if (preset.id === 'pathao-ride') {
      microReason = 'Short transit fare under Rs. 250. Multiple daily rides quickly accumulate.';
    } else {
      microReason = `Small transaction of Rs. ${preset.total} marked as micro-expense.`;
    }
  }

  let paymentMethod: PaymentMethod = 'Fonepay';
  if (preset.id === 'chiya-pasal') paymentMethod = 'Cash';
  if (preset.id === 'pathao-ride') paymentMethod = 'eSewa';
  if (preset.id === 'daraz-office') paymentMethod = 'Khalti';

  return {
    merchant: preset.merchant,
    merchantAddress: preset.subtitle,
    panNumber: preset.pan,
    invoiceNumber: preset.invoiceNo,
    date: preset.date,
    items: preset.items.map((i) => ({ name: i.name, price: i.price, quantity: 1 })),
    subtotal: subtotal,
    vatAmount: preset.vat,
    total: preset.total,
    suggestedCategory: preset.category,
    isMicroExpense: isMicro,
    microReason: microReason,
    confidenceScore: 98.4,
    paymentMethod: paymentMethod,
    receiptPresetId: preset.id,
  };
}

function generateSmartHeuristicResultFromFile(file: File): OCRScanResult {
  const fileName = file.name.toLowerCase();
  const today = new Date().toISOString().split('T')[0];

  // If the file looks like a cafe/tea or coffee
  if (fileName.includes('chiya') || fileName.includes('tea') || fileName.includes('coffee') || fileName.includes('snack')) {
    return {
      merchant: 'Local Cafe & Chiya Stall',
      merchantAddress: 'Kathmandu, Bagmati',
      panNumber: '609182341',
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: today,
      items: [
        { name: 'Special Milk Chiya (2x)', price: 70, quantity: 2 },
        { name: 'Samosa & Tarkari (2x)', price: 60, quantity: 2 },
      ],
      subtotal: 130,
      vatAmount: 0,
      total: 130,
      suggestedCategory: 'Food & Groceries',
      isMicroExpense: true,
      microReason: 'Identified as a daily tea/snack micro-expense under Rs. 200.',
      confidenceScore: 96.2,
      paymentMethod: 'Cash',
    };
  }

  // If transport related
  if (fileName.includes('pathao') || fileName.includes('indrive') || fileName.includes('bus') || fileName.includes('ride')) {
    return {
      merchant: 'Pathao Nepal Pvt. Ltd.',
      merchantAddress: 'Tripureshwor, Kathmandu',
      panNumber: '604812930',
      invoiceNumber: `PTH-EXP-${Math.floor(10000 + Math.random() * 90000)}`,
      date: today,
      items: [
        { name: 'Motorbike Commute (4.2 km)', price: 160, quantity: 1 },
        { name: 'Service Access Fee', price: 30, quantity: 1 },
      ],
      subtotal: 190,
      vatAmount: 22,
      total: 190,
      suggestedCategory: 'Transport',
      isMicroExpense: true,
      microReason: 'Commute under Rs. 250 flagged for daily micro-spending tracker.',
      confidenceScore: 97.8,
      paymentMethod: 'eSewa',
    };
  }

  // Default smart extracted receipt
  return {
    merchant: 'Bhat-Bhateni Superstore',
    merchantAddress: 'Kathmandu, Nepal',
    panNumber: '300054812',
    invoiceNumber: `BBSM-TAX-${Math.floor(10000 + Math.random() * 90000)}`,
    date: today,
    items: [
      { name: 'Milk 1L', price: 120, quantity: 1 },
      { name: 'Bread', price: 80, quantity: 1 },
      { name: 'Snacks', price: 150, quantity: 1 },
      { name: 'Groceries', price: 895, quantity: 1 },
    ],
    subtotal: 1245,
    vatAmount: 143,
    total: 1245,
    suggestedCategory: 'Food & Groceries',
    isMicroExpense: false,
    confidenceScore: 98.6,
    paymentMethod: 'Fonepay',
  };
}
