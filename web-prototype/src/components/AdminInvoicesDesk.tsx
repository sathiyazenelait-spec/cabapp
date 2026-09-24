import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Eye, 
  Plus, 
  Building2,
  Users,
  Percent,
  RefreshCw
} from 'lucide-react';
import { MOCK_ADMIN_ALL_INVOICES, type Invoice } from '../types/billing';
import { InvoiceModal } from './InvoiceModal';
import { adminApi } from '../services/api';

export const AdminInvoicesDesk: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_ADMIN_ALL_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'CAB_OWNER' | 'PARENT' | 'INSTITUTION'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'PROCESSING'>('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  React.useEffect(() => {
    adminApi.getPayments().then(payments => {
      if (Array.isArray(payments) && payments.length > 0) {
        const mapped: Invoice[] = payments.map((p: any, idx: number) => {
          const amount = Number(p.amount) || 3200;
          const commAmt = amount * 0.10;
          const gst = amount * 0.18;
          return {
            id: String(p.id || idx),
            invoiceNumber: p.invoiceNumber || `INV-2026-${1000 + idx}`,
            recipientType: (p.recipientType as any) || 'PARENT',
            recipientName: p.parentEmail ? `Parent (${p.parentEmail})` : (p.payerName || 'Priya Sharma'),
            recipientEmail: p.parentEmail || 'priya@safepassage.ai',
            recipientPhone: '+91 98401 23456',
            recipientAddress: 'Mehta Nagar, Chennai - 600029',
            billingPeriod: 'Aug 01 - Aug 31, 2026',
            issueDate: p.paymentDate ? String(p.paymentDate).substring(0, 10) : '2026-08-25',
            dueDate: '2026-09-05',
            items: [
              {
                id: `item-${idx}-1`,
                description: p.planType ? `${p.planType} Student Transit Subscription` : 'Monthly Transit Plan',
                sacCode: 'SAC 9964',
                quantity: 1,
                unitPrice: amount,
                amount: amount,
              },
            ],
            subtotal: amount,
            platformCommissionRate: 0.10,
            platformCommissionAmount: commAmt,
            taxableAmount: amount,
            cgstRate: 0.09,
            cgstAmount: gst / 2,
            sgstRate: 0.09,
            sgstAmount: gst / 2,
            totalGst: gst,
            netPayable: amount - commAmt,
            status: (p.status === 'SUCCESS' ? 'PAID' : p.status === 'FAILED' ? 'PENDING' : 'PAID') as any,
            paymentMethod: 'UPI_INSTANT',
            utrNumber: `UTR-RZP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            notes: 'Authorized by SafePassage Mobility Network',
          };
        });
        setInvoices(mapped);
      }
    }).catch(() => {});
  }, []);

  // New Invoice Form State
  const [newRecipientType, setNewRecipientType] = useState<'PARENT' | 'CAB_OWNER' | 'INSTITUTION'>('PARENT');
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newAmount, setNewAmount] = useState('3200');
  const [newDescription, setNewDescription] = useState('Monthly Student Cab Subscription');

  // Calculations
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.subtotal, 0);
  const totalCommission = invoices.reduce((acc, inv) => acc + inv.platformCommissionAmount, 0);
  const totalNetDisbursed = invoices
    .filter(inv => inv.recipientType === 'CAB_OWNER')
    .reduce((acc, inv) => acc + inv.netPayable, 0);
  const totalGst = invoices.reduce((acc, inv) => acc + inv.totalGst, 0);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.utrNumber && inv.utrNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || inv.recipientType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipientName || !newAmount) return;

    const baseAmount = parseFloat(newAmount);
    const commRate = newRecipientType === 'CAB_OWNER' ? 0.10 : 0;
    const commAmt = baseAmount * commRate;
    const taxable = baseAmount - commAmt;
    const cgst = taxable * 0.025;
    const sgst = taxable * 0.025;
    const totalGstAmt = cgst + sgst;
    const net = newRecipientType === 'CAB_OWNER' ? taxable : taxable + totalGstAmt;

    const newInv: Invoice = {
      id: `inv_gen_${Date.now()}`,
      invoiceNumber: `INV-${newRecipientType.substring(0, 3)}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      recipientType: newRecipientType,
      recipientName: newRecipientName,
      recipientEmail: 'commuter.billing@safepassage.ai',
      recipientPhone: '+91 98401 00000',
      recipientAddress: 'Chennai Metropolitan Region, Tamil Nadu',
      billingPeriod: 'September 2026',
      issueDate: '02 Sep 2026',
      dueDate: '07 Sep 2026',
      items: [
        {
          id: `item_${Date.now()}`,
          description: newDescription,
          sacCode: '9964',
          quantity: 1,
          unitPrice: baseAmount,
          amount: baseAmount
        }
      ],
      subtotal: baseAmount,
      platformCommissionRate: commRate,
      platformCommissionAmount: commAmt,
      taxableAmount: taxable,
      cgstRate: 0.025,
      cgstAmount: cgst,
      sgstRate: 0.025,
      sgstAmount: sgst,
      totalGst: totalGstAmt,
      netPayable: net,
      status: 'PAID',
      paymentMethod: 'NEFT_RTGS',
      utrNumber: `RAZ_MANUAL_${Date.now().toString().slice(-6)}`,
      notes: 'Generated via Super Admin Master Billing Desk.'
    };

    setInvoices([newInv, ...invoices]);
    setShowCreateModal(false);
    setNewRecipientName('');
  };

  const handleMarkPaid = (invId: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invId) {
        return {
          ...inv,
          status: 'PAID',
          utrNumber: `SETTLED_${Date.now().toString().slice(-6)}`
        };
      }
      return inv;
    }));
  };

  const exportAuditCsv = () => {
    const headers = "Invoice Number,Recipient Name,Type,Billing Period,Gross Amount,Commission,Total GST,Net Payable,Status,UTR Number\n";
    const rows = filteredInvoices.map(i => 
      `"${i.invoiceNumber}","${i.recipientName}","${i.recipientType}","${i.billingPeriod}",${i.subtotal},${i.platformCommissionAmount},${i.totalGst},${i.netPayable},"${i.status}","${i.utrNumber || 'N/A'}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SafePassage_Tax_Invoices_Audit_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Desk Header & Actions */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900/90 p-5 rounded-2xl border border-gray-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Receipt className="h-5 w-5 text-indigo-400" />
              Master Invoicing, GST Ledger & Vendor Settlement Desk
            </h2>
            <span className="bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              SAC 9964 Transport
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Complete dual-ledger accounting for Parent Subscription Invoices and Cab Owner Payout Disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportAuditCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-bold flex items-center gap-1.5 transition shadow"
          >
            <Download className="h-4 w-4 text-gray-400" />
            <span>Export GST Audit (CSV)</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Invoiced Billing</span>
          <h4 className="text-2xl font-black text-white">₹{totalBilled.toLocaleString('en-IN')}</h4>
          <span className="text-[10px] text-indigo-400 font-semibold block">{invoices.length} Registered Tax Invoices</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Platform Take Rate (10%)</span>
          <h4 className="text-2xl font-black text-emerald-400">₹{totalCommission.toLocaleString('en-IN')}</h4>
          <span className="text-[10px] text-emerald-400 font-semibold block">Earned from Cab Fleet Runs</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cab Owner Disbursements</span>
          <h4 className="text-2xl font-black text-sky-400">₹{totalNetDisbursed.toLocaleString('en-IN')}</h4>
          <span className="text-[10px] text-gray-400 font-semibold block">Net NEFT settlements to fleet vendors</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">GST Tax Compliance (5%)</span>
          <h4 className="text-2xl font-black text-amber-400">₹{totalGst.toLocaleString('en-IN')}</h4>
          <span className="text-[10px] text-amber-300 font-semibold block">CGST 2.5% + SGST 2.5% for road transit</span>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-gray-800 flex flex-wrap justify-between items-center gap-3">
        
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Invoice #, Commuter, Cab Owner, or UTR Ref..."
            className="w-full bg-slate-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Ledger Type Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-gray-800 text-xs">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              typeFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            All Ledgers
          </button>
          <button
            onClick={() => setTypeFilter('PARENT')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              typeFilter === 'PARENT' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Parents Subscriptions
          </button>
          <button
            onClick={() => setTypeFilter('CAB_OWNER')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              typeFilter === 'CAB_OWNER' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Cab Owner Payouts
          </button>
          <button
            onClick={() => setTypeFilter('INSTITUTION')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              typeFilter === 'INSTITUTION' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Corporate / College
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-gray-800 text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${
              statusFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('PAID')}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${
              statusFilter === 'PAID' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Paid
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${
              statusFilter === 'PENDING' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Pending
          </button>
        </div>

      </div>

      {/* Invoices Master Table */}
      <div className="glass-card p-6 rounded-3xl border border-gray-800 space-y-4 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-[10px] text-gray-400 uppercase tracking-wider">
                <th className="pb-3 px-3">Invoice #</th>
                <th className="pb-3 px-3">Recipient & Entity</th>
                <th className="pb-3 px-3">Ledger Type</th>
                <th className="pb-3 px-3">Billing Period</th>
                <th className="pb-3 px-3">Gross Subtotal</th>
                <th className="pb-3 px-3">GST Tax (5%)</th>
                <th className="pb-3 px-3 font-bold text-white">Net Total</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-3 px-3 font-sans font-bold text-white flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{inv.invoiceNumber}</span>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <strong className="text-white block text-xs">{inv.recipientName}</strong>
                    <span className="text-gray-400 text-[10px]">{inv.recipientEmail}</span>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      inv.recipientType === 'CAB_OWNER' 
                        ? 'bg-teal-500/15 text-teal-300' 
                        : inv.recipientType === 'PARENT'
                        ? 'bg-indigo-500/15 text-indigo-300'
                        : 'bg-purple-500/15 text-purple-300'
                    }`}>
                      {inv.recipientType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-gray-300 text-[11px]">{inv.billingPeriod}</td>
                  <td className="py-3 px-3 text-gray-300">₹{inv.subtotal.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-amber-400">₹{inv.totalGst.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">₹{inv.netPayable.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      inv.status === 'PAID'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : inv.status === 'PROCESSING'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 font-sans">
                      {inv.status !== 'PAID' && (
                        <button
                          onClick={() => handleMarkPaid(inv.id)}
                          className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-[10px] font-bold transition"
                          title="Mark Payout Settled"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View GST Invoice</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Invoice Generation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-fadeIn">
            <h3 className="text-base font-bold text-white mb-2">Create Formal Tax Invoice</h3>
            <p className="text-xs text-gray-400 mb-4">
              Issue a GST-compliant passenger road transit invoice (SAC 9964) with automated platform fee calculation.
            </p>

            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Invoice Recipient Type</label>
                <select
                  value={newRecipientType}
                  onChange={(e) => setNewRecipientType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="PARENT">Parent / Commuter Student (Subscription)</option>
                  <option value="CAB_OWNER">Cab Owner / Fleet Operator (Vendor Payout)</option>
                  <option value="INSTITUTION">College / Corporate Commute Corridor</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Recipient Full Name / Entity</label>
                <input
                  type="text"
                  required
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  placeholder="e.g. Anantharaman S or SRS Travels Ltd."
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Gross Subscription Fare (₹)</label>
                <input
                  type="number"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Service Description</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-gray-800 text-[10px] text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>SAC Code:</span>
                  <strong className="text-gray-200">9964 (Passenger Transport)</strong>
                </div>
                <div className="flex justify-between">
                  <span>CGST (2.5%) + SGST (2.5%):</span>
                  <strong className="text-emerald-400">5% Total GST</strong>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-800 text-gray-300 py-2 rounded-xl text-xs font-bold hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-purple-500 transition"
                >
                  Issue Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-Screen Digital Tax Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

    </div>
  );
};
