import React from 'react';
import { ShieldCheck, Target, Users, MapPin, CheckCircle2, Award, Building, Briefcase } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <span>About CS Consultancy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Pioneering Transparent Manpower Solutions in Chhattisgarh
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Established in Bhilai, CS Consultancy operates on a mission to democratize job placement for candidates across rural and semi-urban pockets of Chhattisgarh by partnering with local Common Service Centres (CSC).
        </p>
      </div>

      {/* Grid: Mission, Vision, Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Our Core Mission</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            To provide every youth in Chhattisgarh—whether a fresher, ITI graduate, or experienced technician—a verified, legitimate direct interview avenue with genuine salary structures and zero fraudulent intermediaries.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">The CSC Aggregator Model</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            By enabling village-level entrepreneurs (VLEs) and CSC kiosks to onboard youth at a fixed, nominal fee of ₹1,000, we create a hyper-local recruitment pipeline reaching deep into Durg, Raipur, Rajnandgaon, and adjoining tehsils.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Building className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Corporate Reliability</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Over 50+ steel plant ancillary vendors, heavy equipment builders, warehousing hubs, and retail firms in Hathkhoj, Kumhari, and Raipur rely on CS Consultancy for prompt batch recruitment.
          </p>
        </div>
      </div>

      {/* Office & Operations Details */}
      <div className="bg-slate-900 rounded-3xl p-8 lg:p-12 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-2xl font-extrabold text-white">
              Centrally Located in Bhilai, Chhattisgarh
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bhilai is known as the &quot;Steel City of Central India&quot; and an educational beacon. Operating from Dhanora, right opposite the Sahkari Samiti, our office is easily accessible to both students arriving by bus/train and factory executives from the Hathkhoj and Supela industrial zones.
            </p>
            <div className="pt-2 text-xs text-amber-300 space-y-1">
              <div>📍 <strong>Address:</strong> Sahu Boys Hostel, Near / In Front of Sahkari Samiti, Dhanora, Bhilai, Chhattisgarh - 491001</div>
              <div>📞 <strong>Official Contact:</strong> +91 98261 44521 / +91 70002 88390</div>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-3">
            <button
              onClick={() => onNavigate('contact')}
              className="py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs text-center transition-colors cursor-pointer"
            >
              Get Directions & Contact Info
            </button>
            <button
              onClick={() => onNavigate('csc-register')}
              className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-colors cursor-pointer"
            >
              Join CSC Network
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
