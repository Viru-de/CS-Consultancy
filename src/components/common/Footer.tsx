import React from 'react';
import { MapPin, Phone, Mail, Shield, CheckCircle2, Building2, UserCheck, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLogin }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-extrabold text-lg">
                <span className="text-amber-400">CS</span>
              </div>
              <div>
                <span className="font-bold text-base text-white tracking-tight">CS CONSULTANCY</span>
                <p className="text-xs text-slate-400 font-medium">Bhilai, Chhattisgarh</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Premier recruitment consultancy and CSC partner aggregator based in Bhilai. We connect rural and urban job seekers from across Chhattisgarh with reputed manufacturing, engineering, and service enterprises.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Registered CSC VLE & Corporate Placement Desk</span>
            </div>
          </div>

          {/* Location & Office Details (Prominently displaying required Bhilai address) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Office Location</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-white block font-medium">CS Consultancy Head Office:</strong>
                  Sahu Boys Hostel,<br />
                  Near / In Front of Sahkari Samiti,<br />
                  Dhanora, Bhilai,<br />
                  Chhattisgarh - 491001, India
                </div>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 98261 44521 / +91 70002 88390</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>contact@csconsultancybhilai.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Services Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('csc-register')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span>1. CSC Centre Registration</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLogin}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span>2. CSC Registered / CSC Login</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('job-status')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span>3. Student Job Registration</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('company-register')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span>4. Direct Company Registration (₹5,000/yr)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('company-requirement')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span>5. Company Manpower Requirements</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('job-status')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span>6. Check Job / Placement Status</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Pricing & Business Rule Highlights */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Business Policies</h4>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">CSC Candidate Fee</span>
                <span className="font-bold text-emerald-400 text-sm">₹1,000 per Student</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  CSC centres submit multi-student batches with transparent automatic billing.
                </p>
              </div>
              <div className="border-t border-slate-800 pt-2">
                <span className="text-slate-400 block text-[11px]">Company Membership</span>
                <span className="font-bold text-amber-400 text-sm">₹5,000 / Year</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Direct corporate registration with year-round manpower requisition access.
                </p>
              </div>
            </div>
            <div className="pt-1">
              <button
                onClick={onOpenLogin}
                className="w-full text-center py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Access Portal Login
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} CS Consultancy, Bhilai, Chhattisgarh. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Dhanora Office · Sahkari Samiti Road · Bhilai - 491001</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
