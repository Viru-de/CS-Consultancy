import React, { useState } from 'react';
import { api } from '../../services/api.ts';
import {
  Building2,
  CheckCircle,
  AlertCircle,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Phone,
  FileCheck2,
} from 'lucide-react';

interface CompanyRegistrationViewProps {
  onSuccessNavigateToRequirement: (companyId: string) => void;
}

export const CompanyRegistrationView: React.FC<CompanyRegistrationViewProps> = ({
  onSuccessNavigateToRequirement,
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    whatsapp: '',
    email: '',
    companyAddress: '',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '490001',
    industry: 'Heavy Engineering & Fabrication',
    website: '',
    description: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'UPI' | 'Netbanking' | 'Card'>('Razorpay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.companyName.trim()) {
      setError('Company Name is required.');
      return;
    }
    if (!formData.contactPerson.trim()) {
      setError('Contact Person (HR / Director) is required.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setError('Please provide a valid 10-digit phone number.');
      return;
    }
    if (!formData.companyAddress.trim()) {
      setError('Company address is required.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.registerCompany({
        ...formData,
        paymentMethod: `Online Gateway (${paymentMethod} - Test Architecture)`,
        transactionRef: `TXN-CORP-${Date.now()}`,
      });

      setSuccessReceipt({
        company: res.company,
        payment: res.payment,
      });
    } catch (err: any) {
      setError(err.message || 'Company registration & payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* If registration & ₹5,000 payment was completed successfully */}
      {successReceipt ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <span>Annual Membership Active · 1 Year Validity</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Payment Successful & Company Registered!
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Your annual registration fee of ₹5,000 has been verified. You can now post manpower requirements immediately.
            </p>
          </div>

          {/* Payment & Registration Receipt Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left max-w-lg mx-auto space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Payment ID:</span>
              <span className="font-bold text-slate-900">{successReceipt.payment.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Company Name:</span>
              <span className="font-bold text-slate-900">{successReceipt.company.companyName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Annual Fee Paid:</span>
              <span className="font-extrabold text-emerald-600 text-sm">₹5,000</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Valid Until:</span>
              <span className="font-bold text-slate-900">
                {new Date(successReceipt.company.expiryDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Reference TXN:</span>
              <span className="font-mono text-slate-700 text-[11px]">
                {successReceipt.payment.transactionRef}
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onSuccessNavigateToRequirement(successReceipt.company.id)}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>Post Manpower Requirements Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSuccessReceipt(null);
                setFormData({
                  companyName: '',
                  contactPerson: '',
                  phone: '',
                  whatsapp: '',
                  email: '',
                  companyAddress: '',
                  city: 'Bhilai',
                  state: 'Chhattisgarh',
                  pincode: '490001',
                  industry: 'Heavy Engineering & Fabrication',
                  website: '',
                  description: '',
                });
              }}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Register Another Entity
            </button>
          </div>
        </div>
      ) : (
        /* The Company Registration Form */
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Building2 className="w-3.5 h-3.5" />
              <span>Direct Corporate Registration</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Direct Company Registration
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Register your manufacturing plant, engineering workshop, or business with CS Consultancy. Enjoy uninterrupted access to pre-screened ITI candidates, skilled electricians, helpers, and staff.
            </p>
          </div>

          {/* Pricing Highlight Banner (Requirement #14) */}
          <div className="bg-amber-500/10 border-2 border-amber-400/40 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                Annual Company Registration Fee
              </span>
              <div className="text-3xl font-black text-slate-900 mt-1">₹5,000 <span className="text-xs font-medium text-slate-600">/ YEAR</span></div>
              <p className="text-xs text-slate-600 mt-1">
                Fixed 1-year corporate membership covering unlimited manpower requirement postings and priority screening.
              </p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-amber-200 text-xs font-bold text-slate-800 shadow-xs shrink-0">
              ✓ 365 Days Active Sourcing
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleRegisterAndPay} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>1. Enterprise Details</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. ABC Industries"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Person (HR / Director) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="e.g. Sanjay Aggarwal (HR Head)"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98261 77665"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="Same as phone if empty"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="hr@abcindustriesbhilai.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Industry / Sector <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  >
                    <option value="Heavy Engineering & Fabrication">Heavy Engineering & Fabrication</option>
                    <option value="Steel Plant Ancillary / Machinery">Steel Plant Ancillary / Machinery</option>
                    <option value="Manufacturing & Assemblies">Manufacturing & Assemblies</option>
                    <option value="Warehousing, Logistics & Transport">Warehousing, Logistics & Transport</option>
                    <option value="Retail, Supermarkets & FMCG">Retail, Supermarkets & FMCG</option>
                    <option value="IT, Software & Automation">IT, Software & Automation</option>
                    <option value="Construction & Infrastructure">Construction & Infrastructure</option>
                    <option value="Hospitality & Services">Hospitality & Services</option>
                    <option value="Other">Other Industry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <span>2. Factory / Office Address</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Company Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  placeholder="Plot/Shed number, Industrial Area (e.g. Hathkhoj, Light Industrial Area, Bhilai)"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Company Description & Manpower Scope
                </label>
                <textarea
                  rows={2}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Briefly describe what your factory or business does and typical positions hired"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Payment Method Selector (Razorpay Gateway abstraction) */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-500" />
                <span>3. Payment Gateway Architecture (₹5,000 Annual Fee)</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'Razorpay', label: 'Razorpay / UPI', sub: 'Instant QR & Apps' },
                  { id: 'UPI', label: 'BHIM / PhonePe', sub: 'VPA Transfer' },
                  { id: 'Netbanking', label: 'Corp Netbanking', sub: 'SBI, HDFC, ICICI' },
                  { id: 'Card', label: 'Corporate Card', sub: 'Visa / Mastercard' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === m.id
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{m.label}</div>
                    <div className={`text-[10px] mt-0.5 ${paymentMethod === m.id ? 'text-slate-300' : 'text-slate-500'}`}>
                      {m.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* REGISTER & PAY ₹5,000 BUTTON (Requirement #14) */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                🔒 Server-Validated Annual Fee: <strong>₹5,000</strong>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Processing Gateway & Registering...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-slate-950" />
                    <span>REGISTER & PAY ₹5,000</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
