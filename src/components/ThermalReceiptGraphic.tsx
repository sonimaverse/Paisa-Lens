import React from 'react';
import { OCRScanResult, SampleReceiptPreset } from '../types';

interface ThermalReceiptProps {
  receipt: OCRScanResult | SampleReceiptPreset;
  isScanning?: boolean;
}

export const ThermalReceiptGraphic: React.FC<ThermalReceiptProps> = ({ receipt, isScanning = false }) => {
  const isPreset = 'badge' in receipt;
  const merchant = receipt.merchant;
  const date = receipt.date;
  const items = receipt.items;
  const total = receipt.total;
  const subtotal = 'subtotal' in receipt ? receipt.subtotal : items.reduce((s, i) => s + i.price, 0);
  const vat = 'vatAmount' in receipt ? receipt.vatAmount : ('vat' in receipt ? receipt.vat : 0);
  const invoiceNo = 'invoiceNumber' in receipt ? receipt.invoiceNumber : ('invoiceNo' in receipt ? receipt.invoiceNo : 'INV-78921');
  const pan = 'panNumber' in receipt ? receipt.panNumber : ('pan' in receipt ? receipt.pan : '300054812');

  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-sm bg-white p-6 shadow-md border border-slate-200 font-mono text-slate-800 text-xs">
      {/* Top jagged paper effect */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-100 via-white to-slate-100 border-b border-dashed border-slate-300" />

      {/* Scanning beam overlay */}
      {isScanning && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          <div className="animate-scan-beam absolute left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.85)]" />
          <div className="absolute inset-0 bg-emerald-500/5 backdrop-contrast-125" />
        </div>
      )}

      {/* Header */}
      <div className="text-center pb-3 border-b border-dashed border-slate-300">
        <div className="text-sm font-bold tracking-wider text-slate-900 uppercase">{merchant}</div>
        <div className="text-[10px] text-slate-500 mt-0.5">VAT / TAX INVOICE (NEPAL)</div>
        <div className="text-[10px] text-slate-500">PAN: {pan} · INV: {invoiceNo}</div>
        <div className="text-[10px] text-slate-500">Date: {date} · Time: 13:42</div>
      </div>

      {/* Table Header */}
      <div className="mt-3 flex justify-between font-bold text-slate-600 pb-1 border-b border-slate-200 text-[11px]">
        <span>ITEM / DESCRIPTION</span>
        <span>AMOUNT (NPR)</span>
      </div>

      {/* Items */}
      <div className="my-2 space-y-1.5 text-[11px]">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start gap-2">
            <span className="truncate text-slate-700">{item.name}</span>
            <span className="font-semibold text-slate-900 whitespace-nowrap">
              Rs. {item.price.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Calculations */}
      <div className="pt-2 border-t border-dashed border-slate-300 space-y-1 text-[11px]">
        <div className="flex justify-between text-slate-500">
          <span>Subtotal</span>
          <span>Rs. {subtotal.toLocaleString()}</span>
        </div>
        {vat !== undefined && vat > 0 && (
          <div className="flex justify-between text-slate-500">
            <span>Govt VAT (13%)</span>
            <span>Rs. {vat.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-900 mt-1">
          <span>TOTAL PAYABLE</span>
          <span className="text-emerald-700">Rs. {total.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment info & barcode */}
      <div className="mt-4 pt-3 border-t border-dashed border-slate-300 text-center">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest">
          PAID VIA {('paymentMethod' in receipt && receipt.paymentMethod) || 'FONEPAY QR'}
        </div>
        
        {/* Mock Barcode */}
        <div className="my-2 flex justify-center items-center gap-[2px] h-9 px-4">
          {[4, 2, 6, 2, 4, 1, 8, 3, 2, 5, 1, 7, 2, 4, 2, 6, 3, 1, 5, 2, 6, 2, 4, 1].map((h, i) => (
            <div
              key={i}
              className="bg-slate-800"
              style={{
                width: i % 3 === 0 ? '3px' : '1.5px',
                height: `${20 + (h % 3) * 6}px`,
              }}
            />
          ))}
        </div>
        <div className="text-[9px] text-slate-400">THANK YOU FOR VISITING · VISIT AGAIN</div>
      </div>

      {/* Bottom zig-zag tear */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-100 via-white to-slate-100 border-t border-dashed border-slate-300" />
    </div>
  );
};
