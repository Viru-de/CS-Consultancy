import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Building, User, Phone, MapPin, ShieldCheck, Mail, CheckCircle } from 'lucide-react';

export const CSCProfile: React.FC = () => {
  const { user, cscData } = useAuth();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">CSC Partner Profile</h2>
        <p className="text-xs text-slate-500">
          Official centre credentials and regional operator verification details
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 font-black text-xl flex items-center justify-center">
            CSC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900">
                {cscData?.centreName || 'Dhanora CSC Digital Point'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Active & Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Partner ID: {user?.cscId || 'CSC-1001'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-slate-500 block font-medium">Owner / Operator:</span>
            <strong className="text-slate-900 text-sm block">
              {cscData?.operatorName || 'Ramesh Sahu'}
            </strong>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-slate-500 block font-medium">Authorized Contact Phone:</span>
            <strong className="text-slate-900 text-sm block">
              {cscData?.phone || '+91 98261 44521'}
            </strong>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-slate-500 block font-medium">City & District:</span>
            <strong className="text-slate-900 text-sm block">
              {cscData?.city || 'Bhilai'}, Chhattisgarh
            </strong>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-slate-500 block font-medium">Pricing Agreement:</span>
            <strong className="text-emerald-700 text-sm block">₹1,000 / Student (Batch Calculation)</strong>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-1">
          <span className="text-slate-500 block font-medium">Registered Centre Address:</span>
          <p className="text-slate-800 font-semibold leading-relaxed">
            {cscData?.officeAddress || 'Shop No. 4, Near Sahkari Samiti, Dhanora, Bhilai - 491001'}
          </p>
        </div>

        <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified under CS Consultancy Bhilai VLE Aggregator Charter</span>
        </div>
      </div>
    </div>
  );
};
