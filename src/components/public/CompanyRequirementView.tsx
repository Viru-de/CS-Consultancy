import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { Company } from '../../types/index.ts';
import {
  Briefcase,
  CheckCircle,
  AlertCircle,
  Building2,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  FileCheck2,
} from 'lucide-react';

interface CompanyRequirementViewProps {
  initialCompanyId?: string;
  onNavigate: (view: string) => void;
}

export const CompanyRequirementView: React.FC<CompanyRequirementViewProps> = ({
  initialCompanyId,
  onNavigate,
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(initialCompanyId || '');
  const [customCompanyName, setCustomCompanyName] = useState('');

  const [formData, setFormData] = useState({
    jobPosition: '',
    candidatesRequired: 10,
    genderRequirement: 'Any' as 'Male' | 'Female' | 'Any',
    qualification: 'ITI / 10th / 12th',
    experience: 'Fresher to 1 Year',
    salary: '₹14,000 - ₹18,000 / month',
    jobLocation: 'Hathkhoj Industrial Area, Bhilai',
    jobType: 'Electrician',
    joiningTimeline: 'Immediate (within 7 days)',
    description: '',
  });

  const [jobTypes, setJobTypes] = useState<string[]>([
    'Electrician',
    'Helper',
    'Sales Executive',
    'Computer Operator',
    'Accountant',
    'Office Staff',
    'Driver',
    'Technician',
    'Security Guard',
    'Marketing',
    'Data Entry',
    'Welder / Fitter',
    'Store Keeper',
    'Other',
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successRequirement, setSuccessRequirement] = useState<any | null>(null);

  useEffect(() => {
    api.getCompanies()
      .then((res) => {
        setCompanies(res.companies || []);
        if (initialCompanyId) {
          const match = res.companies.find((c) => c.id === initialCompanyId);
          if (match) {
            setSelectedCompanyId(match.id);
          }
        } else if (res.companies.length > 0) {
          setSelectedCompanyId(res.companies[0].id);
        }
      })
      .catch(() => {});
  }, [initialCompanyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const comp = companies.find((c) => c.id === selectedCompanyId);
    const companyName = comp ? comp.companyName : customCompanyName;

    if (!companyName.trim()) {
      setError('Company Name is required.');
      return;
    }
    if (!formData.jobPosition.trim()) {
      setError('Job Position is required.');
      return;
    }
    if (Number(formData.candidatesRequired) < 1) {
      setError('Number of candidates required must be at least 1.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.postCompanyRequirement({
        companyId: comp ? comp.id : undefined,
        companyName,
        jobPosition: formData.jobPosition,
        candidatesRequired: Number(formData.candidatesRequired),
        genderRequirement: formData.genderRequirement,
        qualification: formData.qualification,
        experience: formData.experience,
        salary: formData.salary,
        jobLocation: formData.jobLocation,
        jobType: formData.jobType,
        joiningTimeline: formData.joiningTimeline,
        description: formData.description,
      });

      setSuccessRequirement(res.requirement);
    } catch (err: any) {
      setError(err.message || 'Failed to submit requirement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {successRequirement ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <span>Requirement Registered</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Requirement Received Successfully!
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Our central Bhilai recruitment desk has forwarded your vacancy to active CSC partners across the district. Screening & candidate assignment will commence immediately.
            </p>
          </div>

          {/* Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left max-w-md mx-auto space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Requirement ID:</span>
              <span className="font-bold text-slate-900">{successRequirement.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Company:</span>
              <span className="font-bold text-slate-900">{successRequirement.companyName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Position:</span>
              <span className="font-bold text-slate-900">{successRequirement.jobPosition}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Candidates Required:</span>
              <span className="font-bold text-slate-900">{successRequirement.candidatesRequired}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Salary / Location:</span>
              <span className="font-bold text-slate-900">
                {successRequirement.salary} · {successRequirement.jobLocation}
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setSuccessRequirement(null);
                setFormData({
                  jobPosition: '',
                  candidatesRequired: 10,
                  genderRequirement: 'Any',
                  qualification: 'ITI / 10th / 12th',
                  experience: 'Fresher to 1 Year',
                  salary: '₹14,000 - ₹18,000 / month',
                  jobLocation: 'Hathkhoj Industrial Area, Bhilai',
                  jobType: 'Helper',
                  joiningTimeline: 'Immediate (within 7 days)',
                  description: '',
                });
              }}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Submit Another Requirement</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Back to Homepage
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Manpower Requisition Desk</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Submit Company Manpower Requirements
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Specify your factory or business workforce vacancies. Our central team matches your requirements with qualified students enrolled by verified CSC centres throughout Chhattisgarh.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Company Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>1. Employer Details</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Select Registered Company
                  </label>
                  <select
                    value={selectedCompanyId}
                    onChange={(e) => {
                      setSelectedCompanyId(e.target.value);
                      if (e.target.value !== 'other') {
                        setCustomCompanyName('');
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName} ({c.city})
                      </option>
                    ))}
                    <option value="other">+ Enter Unlisted Company Name</option>
                  </select>
                </div>

                {selectedCompanyId === 'other' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Enter Company Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customCompanyName}
                      onChange={(e) => setCustomCompanyName(e.target.value)}
                      placeholder="e.g. Bhilai Engineering Works"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Position & Candidate Requirements */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                <span>2. Position & Workforce Requirements</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Job Position / Role <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="jobPosition"
                    value={formData.jobPosition}
                    onChange={handleChange}
                    placeholder="e.g. Electrician or Helper"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Job Category
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  >
                    {jobTypes.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Number of Candidates Required <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    required
                    name="candidatesRequired"
                    value={formData.candidatesRequired}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden font-bold"
                  />
                </div>
              </div>

              {/* Gender Requirement: Male / Female / Any (Requirement #15) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gender Requirement <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Male', 'Female', 'Any'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, genderRequirement: g }))}
                        className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all text-center ${
                          formData.genderRequirement === g
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="e.g. ITI Electrician, 10th Pass, B.Com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Experience Requirement
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. Fresher or 1-2 years"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Salary (₹ / month) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g. ₹18,000 / month"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Job Location <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="jobLocation"
                    value={formData.jobLocation}
                    onChange={handleChange}
                    placeholder="e.g. Hathkhoj, Bhilai"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Joining Timeline
                  </label>
                  <input
                    type="text"
                    name="joiningTimeline"
                    value={formData.joiningTimeline}
                    onChange={handleChange}
                    placeholder="e.g. Immediate / 7 days"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detailed Requirement Description & Shifts
                </label>
                <textarea
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe specific duties, tools used, shift hours, lunch/tea allowance, transport facilities, etc."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                🚀 Permanent Requirement Tracking in Central Admin
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto py-3 px-8 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Posting Requirement...</span>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4 text-purple-300" />
                    <span>Submit Manpower Requirement</span>
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
