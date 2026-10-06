import React, { useState } from 'react';
import { api } from '../../services/api.ts';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Building2,
  Navigation,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setError('Name, Phone and Message are required.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await api.sendContactMessage(formData);
      setSuccess(res.message);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit contact request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
          <MapPin className="w-3.5 h-3.5 text-amber-500" />
          <span>Bhilai, Chhattisgarh Headquarters</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact CS Consultancy
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Reach our administrative team for CSC centre onboarding, corporate candidate requisitions, or candidate interview assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Details & Official Location Box (Requirement #30) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-slate-800">
            <div>
              <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                Official Head Office
              </div>
              <h3 className="text-xl font-extrabold text-white mt-1">CS Consultancy</h3>
              <p className="text-xs text-slate-400 mt-1">Recruitment & CSC Management Desk</p>
            </div>

            {/* Exact Required Address */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-2.5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  Sahu Boys Hostel,<br />
                  Near / In Front of Sahkari Samiti,<br />
                  Dhanora,<br />
                  Bhilai, Chhattisgarh - 491001,<br />
                  India
                </div>
              </div>
            </div>

            {/* Phone, WhatsApp, Email */}
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Primary Calling Helpline:</span>
                  <a href="tel:+919826144521" className="font-bold text-white hover:text-amber-300">
                    +91 98261 44521
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">WhatsApp & Alternative Hotline:</span>
                  <a href="tel:+917000288390" className="font-bold text-white hover:text-amber-300">
                    +91 70002 88390
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Official Email:</span>
                  <span className="font-bold text-white">contact@csconsultancybhilai.in</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1 border-t border-slate-800">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Working Hours:</span>
                  <span className="text-slate-200">Monday to Saturday: 9:30 AM – 7:00 PM (IST)</span>
                </div>
              </div>
            </div>

            {/* Landmark Navigation Aid */}
            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800 flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Landmark: Right opposite Sahkari Samiti, Dhanora main approach road.</span>
            </div>
          </div>
        </div>

        {/* Message Form & Visual Map Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Send an Inquiry or Message</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Leave your details below and our Dhanora desk will call you back within 2 business hours.
              </p>
            </div>

            {success && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-semibold">{success}</div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Santosh Verma"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98261 XXXXX"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  >
                    <option value="CSC Partnership Inquiry">CSC Centre Partnership Inquiry</option>
                    <option value="Company Manpower Requisition">Company Manpower Requisition</option>
                    <option value="Student Placement Inquiry">Student Placement Inquiry</option>
                    <option value="Document Verification">Candidate Document Verification</option>
                    <option value="General Inquiry">Other General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your requirement or question..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto py-3 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Send Message to Bhilai Office</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
