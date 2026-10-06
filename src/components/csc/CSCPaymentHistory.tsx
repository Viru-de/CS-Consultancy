import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { PaymentRecord } from '../../types/index.ts';
import { CreditCard, CheckCircle, FileText, Printer, ArrowDownToLine } from 'lucide-react';

export const CSCPaymentHistory: React.FC = () => {
  const { user } = useAuth();
  const cscId = user?.cscId;

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  useEffect(() => {
    if (!cscId) return;
    setLoading(true);
    api.getPayments({ entityId: cscId })
      .then((res) => setPayments(res.payments || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [cscId]);

  const totalPaid = payments.reduce((acc, p) => acc + (p.status === 'Paid' ? p.amount : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">CSC Batch Payment History</h2>
          <p className="text-xs text-slate-500">
            Official transaction records for student registrations (₹1,000 per student)
          </p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-right">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
            Total Paid by Your Centre
          </span>
          <span className="text-base font-extrabold text-amber-400">
            ₹{totalPaid.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading payment history...</div>
      ) : payments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
          <CreditCard className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p>No payment records found yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Payment ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Student Count</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Method & Ref</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{p.id}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(p.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {p.studentCount || Math.round(p.amount / 1000)} Students
                    </td>
                    <td className="py-3 px-4 font-black text-emerald-700">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{p.paymentMethod}</div>
                      <div className="text-[10px] font-mono text-slate-400">{p.transactionRef}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        ✓ {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Payment Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-amber-500 font-extrabold text-sm block">CS CONSULTANCY</span>
                <p className="text-[11px] text-slate-500">Official Payment Voucher & Receipt</p>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Receipt No:</span>
                  <span className="font-bold text-slate-900 font-mono">{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(selectedReceipt.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CSC Partner:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.entityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Purpose:</span>
                  <span className="font-medium text-slate-700">
                    CSC Student Registration ({selectedReceipt.studentCount || selectedReceipt.amount / 1000} Candidates @ ₹1,000)
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                  <span className="font-bold text-slate-900">Total Paid:</span>
                  <span className="font-black text-emerald-700">
                    ₹{selectedReceipt.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1">
                <div>Ref / Transaction ID: <span className="font-mono">{selectedReceipt.transactionRef}</span></div>
                <div>Office: Sahu Boys Hostel, Dhanora, Bhilai, CG - 491001</div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
