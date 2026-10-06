import React from 'react';
import {
  Users,
  Building2,
  Briefcase,
  CheckCircle,
  MapPin,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award,
  Clock,
  PhoneCall,
  Search,
  FileCheck2,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onOpenLogin: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenLogin }) => {
  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-16 lg:py-24 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Regional Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-amber-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Headquartered at Dhanora, Bhilai · Serving All Chhattisgarh</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Empowering Youth & Connecting Industries Through Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                  CSC Partner Network
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                CS Consultancy is Bhilai’s premier recruitment hub and CSC aggregator. We bridge grassroots job seekers across Chhattisgarh with leading manufacturing, engineering, and service enterprises through verified Common Service Centre (CSC) operators.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('csc-register')}
                  className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-amber-400/20 transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4 text-slate-950" />
                  <span>Register CSC Centre</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <button
                  onClick={() => onNavigate('company-register')}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Company Registration (₹5,000/yr)</span>
                </button>

                <button
                  onClick={() => onNavigate('job-status')}
                  className="px-5 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4 text-teal-400" />
                  <span>Track Candidate Status</span>
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">₹1,000</div>
                  <div className="text-xs text-slate-400 mt-0.5">Fixed per Student Fee</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">45+</div>
                  <div className="text-xs text-slate-400 mt-0.5">Verified CSC Partners</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">1,200+</div>
                  <div className="text-xs text-slate-400 mt-0.5">Youth Placed in Jobs</div>
                </div>
              </div>
            </div>

            {/* Hero Quick Highlight Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                      CS
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Official Consultancy Desk</h4>
                      <p className="text-[11px] text-slate-400">Bhilai Central Coordination</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    Active Placements
                  </span>
                </div>

                <div className="space-y-4 py-5 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">For CSC Centres:</strong>
                      Register local candidates in multi-student batches. Pay ₹1,000 per student only upon batch checkout.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">For Students:</strong>
                      Direct interview lineups with industrial & commercial units in Bhilai, Durg, and Raipur.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">For Companies:</strong>
                      Subscribe annually for ₹5,000 to post industrial requirements (Electrician, Helper, Operators, etc.).
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={onOpenLogin}
                    className="w-full py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Already a Registered CSC? Login Here</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars / Workflows: CSC, Student, Company */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600">
            How The Ecosystem Works
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Transparent Sourcing for Candidates, Centres & Employers
          </h2>
          <p className="text-sm text-slate-600">
            Every step is structured with verified authentication, dedicated dashboards, and real-time status tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1: CSC Centre */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. For CSC Centres</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Empower your local community. CSC VLEs register their centre online, get approved by admin, and submit job-seeking youth directly into our corporate pipeline.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Register multiple students in one batch</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Automatic calculation: ₹1,000 × students</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Permanent tracking of your centre&apos;s placements</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={() => onNavigate('csc-register')}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Register Your CSC Centre</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pillar 2: Students */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. For Students & Youth</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Whether you are an ITI Electrician, Helper, Accountant, or Computer Operator, get registered via an authorized CSC partner and receive direct employment calls.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Direct screening with verified employers</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Transparent recruitment & offer letters</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Track your interview & &quot;GET JOB&quot; status</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={() => onNavigate('job-status')}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Track Placement Status</span>
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pillar 3: Companies */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. For Direct Companies</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Industrial firms, fabricators, and businesses in Hathkhoj, Bhilai, Raipur, and Kumhari can source pre-screened manpower with continuous support.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Annual Membership: ₹5,000 / Year</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Post unlimited batch vacancies (e.g. 20-50 helpers)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Candidates provided and joined tracking</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={() => onNavigate('company-register')}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Register Company (₹5,000)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Job Profiles in Demand */}
      <section className="bg-slate-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Placement Roles
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Key Industrial & Office Job Profiles Handled
              </h2>
            </div>
            <p className="text-xs text-slate-600 max-w-md">
              Targeted staffing solutions matching the industrial profile of Bhilai Steel Plant ancillaries and regional businesses.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { title: 'Electrician', count: '120+ Placed', tag: 'Industrial/ITI' },
              { title: 'Helper', count: '450+ Placed', tag: 'Material Handling' },
              { title: 'Computer Operator', count: '180+ Placed', tag: 'Office/DCA' },
              { title: 'Sales Executive', count: '140+ Placed', tag: 'Retail & Field' },
              { title: 'Accountant', count: '90+ Placed', tag: 'Tally/GST' },
              { title: 'Technician & Welder', count: '110+ Placed', tag: 'Plant Machinery' },
            ].map((job, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 border border-slate-200 text-center space-y-1 shadow-xs"
              >
                <div className="font-bold text-sm text-slate-900">{job.title}</div>
                <div className="text-[11px] font-semibold text-emerald-600">{job.count}</div>
                <div className="text-[10px] text-slate-400">{job.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office & Location Spotlight (Requirement #1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 rounded-3xl p-8 lg:p-12 text-white border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Visit Our Bhilai Coordination Office</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Located in Dhanora, Bhilai — The Heart of Chhattisgarh’s Industrial Belt
              </h2>
              <div className="space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
                <p>
                  <strong>Address:</strong><br />
                  Sahu Boys Hostel, Near / In Front of Sahkari Samiti,<br />
                  Dhanora, Bhilai, Chhattisgarh - 491001, India
                </p>
                <p>
                  Our centralized office facilitates face-to-face candidate verification, corporate HR tie-ups, and CSC partner onboarding throughout Durg, Bhilai, Raipur, and Rajnandgaon districts.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <PhoneCall className="w-4 h-4" />
                  <span>Call: +91 98261 44521</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <Clock className="w-4 h-4" />
                  <span>Mon - Sat: 9:30 AM to 7:00 PM</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-6 border border-slate-700 text-center space-y-4">
              <div className="text-amber-400 font-bold text-sm">Need Personalized Guidance?</div>
              <p className="text-xs text-slate-300">
                Are you a CSC owner looking to register? Or an industrial unit seeking 20+ helpers? Speak directly with our placement coordinators.
              </p>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Contact Bhilai Office
                </button>
                <button
                  onClick={() => onNavigate('csc-register')}
                  className="w-full py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Submit CSC Centre Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
