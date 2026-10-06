import React from 'react';
import {
  UserCheck,
  LogIn,
  FileText,
  Building2,
  Briefcase,
  Search,
  ArrowRight,
  CheckCircle2,
  Shield,
  Clock,
} from 'lucide-react';

interface ServicesViewProps {
  onNavigate: (view: string) => void;
  onOpenLogin: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate, onOpenLogin }) => {
  const services = [
    {
      id: '1',
      title: '1. CSC Registration',
      subtitle: 'For Common Service Centre Owners & VLEs',
      description:
        'Register your CSC Centre or citizen kiosk with CS Consultancy. Once approved by our Bhilai administration, access the dedicated portal to upload candidate batches.',
      fee: 'Free Registration (Admin Approval Required)',
      icon: UserCheck,
      iconColor: 'text-emerald-600 bg-emerald-50',
      actionText: 'Register CSC Centre',
      action: () => onNavigate('csc-register'),
    },
    {
      id: '2',
      title: '2. CSC Registered / CSC Login',
      subtitle: 'For Existing Approved CSC Partners',
      description:
        'Log in to your authenticated CSC dashboard. Add multiple job-seeking students, utilize our automatic ₹1,000 calculation builder, and track candidate interview updates.',
      fee: 'Secure Role-Based Portal Access',
      icon: LogIn,
      iconColor: 'text-blue-600 bg-blue-50',
      actionText: 'Open CSC Login',
      action: () => onOpenLogin(),
    },
    {
      id: '3',
      title: '3. Student Job Registration',
      subtitle: 'For Job Seekers & Educational Youth',
      description:
        'Job seekers can find suitable opportunities across Bhilai, Durg, and Raipur industrial units. Registration is routed through our verified CSC network for authentic document verification.',
      fee: 'Nominal ₹1,000 One-time Processing Fee',
      icon: FileText,
      iconColor: 'text-indigo-600 bg-indigo-50',
      actionText: 'Explore Placement Tracking',
      action: () => onNavigate('job-status'),
    },
    {
      id: '4',
      title: '4. Direct Company Registration',
      subtitle: 'For Employers, Factories & Commercial Units',
      description:
        'Register your company with our centralized talent pool. Benefit from verified candidates, continuous helper and technician supplies, and dedicated relationship manager support.',
      fee: 'Fixed Annual Fee: ₹5,000 / Year',
      icon: Building2,
      iconColor: 'text-amber-600 bg-amber-50',
      actionText: 'Register & Pay ₹5,000',
      action: () => onNavigate('company-register'),
    },
    {
      id: '5',
      title: '5. Company Requirements',
      subtitle: 'Manpower Requisition & Bulk Hiring',
      description:
        'Post industrial vacancies with specific criteria: required number of candidates, gender (Male/Female/Any), qualification, experience, salary bracket, and urgent joining timeline.',
      fee: 'Included with Active Company Membership',
      icon: Briefcase,
      iconColor: 'text-purple-600 bg-purple-50',
      actionText: 'Submit Requirement Now',
      action: () => onNavigate('company-requirement'),
    },
    {
      id: '6',
      title: '6. Job / Placement Status',
      subtitle: 'Real-Time Verification & Transparency Desk',
      description:
        'Check the live progression of any registered student using their Student ID or Mobile Number. View interview schedules, screening notes, and official &quot;GET JOB&quot; confirmation.',
      fee: 'Free Public Verification Tool',
      icon: Search,
      iconColor: 'text-teal-600 bg-teal-50',
      actionText: 'Track Status by Phone / ID',
      action: () => onNavigate('job-status'),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-600">
          Our Services Catalog
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Comprehensive Recruitment & CSC Solutions
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Every service is engineered with real operational workflows. Select a service below to initiate registration, access portal accounts, or submit requirements.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${s.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.subtitle}</div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-lg py-1.5 px-3">
                    {s.fee}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={s.action}
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>{s.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
