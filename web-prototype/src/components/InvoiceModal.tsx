import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ShieldCheck,
  CreditCard,
  Receipt
} from 'lucide-react';
import type { Invoice } from '../types/billing';

interface InvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate a downloadable text/json or simulated receipt
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(invoice, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${invoice.invoiceNumber}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-gray-700 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8 animate-fadeIn cursor-default"
      >
        
        {/* Top Actions Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-gray-800 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Official GST Tax Invoice • {invoice.invoiceNumber}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20"
            >
              <Download className="h-4 w-4" />
              <span>Download Statement</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Invoice Paper */}
        <div className="p-8 space-y-6 text-gray-200 bg-slate-900 print:bg-white print:text-black">
          
          {/* Header & Logo */}
          <div className="flex flex-wrap justify-between items-start gap-4 pb-6 border-b border-gray-800 print:border-gray-300">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-black tracking-tight text-white print:text-black">SafePassage AI</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 print:text-indigo-800 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                  Transport Fleet Portal
                </span>
              </div>
              <p className="text-xs text-gray-400 print:text-gray-600 font-medium">SafePassage Technologies Private Limited</p>
              <p className="text-xs text-gray-400 print:text-gray-600">GSTIN: <strong className="text-gray-200 print:text-black">33AAACS9821M1ZB</strong> • PAN: AAACS9821M</p>
              <p className="text-xs text-gray-400 print:text-gray-600">SAC 9964: Passenger Transport Services</p>
              <p className="text-xs text-gray-400 print:text-gray-600">Software Corridor 8, Taramani, Chennai, TN 600113</p>
            </div>

            {/* Status Stamp */}
            <div className="text-right space-y-1">
              <div className="inline-block">
                <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider border uppercase flex items-center gap-1.5 ${
                  invoice.status === 'PAID'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 print:text-emerald-800'
                    : invoice.status === 'PROCESSING'
                    ? 'bg-sky-500/15 text-sky-400 border-sky-500/40 print:text-sky-800'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/40 print:text-amber-800'
                }`}>
                  {invoice.status === 'PAID' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                  {invoice.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 print:text-gray-600">Invoice: <strong className="text-white print:text-black">{invoice.invoiceNumber}</strong></p>
              <p className="text-xs text-gray-400 print:text-gray-600">Date: {invoice.issueDate}</p>
              <p className="text-xs text-gray-400 print:text-gray-600">Period: {invoice.billingPeriod}</p>
            </div>
          </div>

          {/* Billed To / Recipient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/80 print:bg-gray-100 border border-gray-800 print:border-gray-300">
            <div>
              <span className="text-[10px] text-indigo-400 print:text-indigo-700 font-extrabold uppercase tracking-wider block mb-1">
                {invoice.recipientType === 'CAB_OWNER' ? 'Vendor / Fleet Operator (Payee)' : 'Billed To (Commuter / Parent)'}
              </span>
              <strong className="text-sm text-white print:text-black block">{invoice.recipientName}</strong>
              <p className="text-xs text-gray-400 print:text-gray-700 mt-0.5">{invoice.recipientAddress}</p>
              <p className="text-xs text-gray-400 print:text-gray-700 mt-0.5">Phone: {invoice.recipientPhone} • Email: {invoice.recipientEmail}</p>
              {invoice.recipientGstin && (
                <p className="text-xs text-amber-400 print:text-amber-700 font-semibold mt-0.5">
                  Recipient GSTIN: {invoice.recipientGstin}
                </p>
              )}
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] text-gray-400 print:text-gray-600 font-extrabold uppercase tracking-wider block mb-1">
                Settlement & Payment Details
              </span>
              <p className="text-xs text-gray-300 print:text-gray-700">Payment Mode: <strong className="text-white print:text-black">{invoice.paymentMethod}</strong></p>
              {invoice.utrNumber && (
                <p className="text-xs text-emerald-400 print:text-emerald-700 font-mono font-bold">
                  UTR Ref: {invoice.utrNumber}
                </p>
              )}
              <p className="text-xs text-gray-400 print:text-gray-600">Due Date: {invoice.dueDate}</p>
            </div>
          </div>

          {/* Itemized Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-800 print:border-gray-300 text-[10px] text-gray-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Service Description</th>
                  <th className="py-2.5 px-3 text-center">SAC Code</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Gross Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 print:divide-gray-200">
                {invoice.items.map((it, idx) => (
                  <tr key={it.id || idx}>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-white print:text-black block">{it.description}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-gray-400 print:text-gray-600">{it.sacCode}</td>
                    <td className="py-3 px-3 text-center text-gray-300 print:text-gray-800">{it.quantity}</td>
                    <td className="py-3 px-3 text-right font-bold text-white print:text-black">₹{it.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Summary Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-gray-800 print:border-gray-300">
            <div className="text-xs text-gray-400 print:text-gray-600 max-w-sm">
              <p className="font-bold text-gray-300 print:text-gray-700 mb-1 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                GST & Compliance Notice:
              </p>
              <p className="text-[11px] leading-relaxed">
                {invoice.notes || 'Invoiced under GST rules for passenger road transport aggregators. Platform facilitation fee deducted at 10%. Retain this invoice for commercial tax filing.'}
              </p>
            </div>

            <div className="w-full sm:w-72 bg-slate-950 p-4 rounded-2xl border border-gray-800 print:border-gray-300 print:bg-gray-50 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400 print:text-gray-600">
                <span>Gross Subtotal:</span>
                <span className="font-semibold text-gray-200 print:text-black">₹{invoice.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {invoice.platformCommissionAmount > 0 && (
                <div className="flex justify-between text-red-400 print:text-red-700">
                  <span>SafePassage Platform Fee (10%):</span>
                  <span>-₹{invoice.platformCommissionAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-400 print:text-gray-600">
                <span>Taxable Amount:</span>
                <span className="font-semibold text-gray-200 print:text-black">₹{invoice.taxableAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-gray-400 print:text-gray-600 pt-1 border-t border-gray-800/80">
                <span>CGST (2.5%):</span>
                <span>₹{invoice.cgstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-gray-400 print:text-gray-600">
                <span>SGST (2.5%):</span>
                <span>₹{invoice.sgstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-sm font-black pt-2 border-t border-gray-700 print:border-gray-400 text-white print:text-black">
                <span>{invoice.recipientType === 'CAB_OWNER' ? 'Net Payout Disbursed:' : 'Total Payable:'}</span>
                <span className="text-emerald-400 print:text-emerald-800">₹{invoice.netPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Signoff & Close */}
          <div className="pt-6 border-t border-gray-800/80 text-[10px] text-gray-500 print:text-gray-600 flex flex-wrap justify-between items-center gap-4">
            <div>
              <p>Computer generated tax invoice. No physical signature required.</p>
              <p className="mt-0.5">SafePassage AI Technologies Pvt. Ltd. • CIN: U72900TN2026PTC109823</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-gray-200 hover:text-white rounded-xl text-xs font-bold transition print:hidden"
            >
              Close Invoice
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
