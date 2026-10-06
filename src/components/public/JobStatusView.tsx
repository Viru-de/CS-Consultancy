import React, { useState } from 'react';
import { api } from '../../services/api.ts';
import { Student } from '../../types/index.ts';
import {
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  AlertCircle,
  Award,
  Sparkles,
} from 'lucide-react';

export const JobStatusView: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentResult, setStudentResult] = useState<Partial<Student> | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter a Student ID or Mobile Number.');
      return;
    }

    setError(null);
    setLoading(true);
    setStudentResult(null);

    try {
      const data = await api.trackStudentPublic(identifier.trim());
      setStudentResult(data);
    } catch (err: any) {
      setError(err.message || 'No student record found with this identifier.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'Get Job':
        return 'bg-emerald-500 text-white border-emerald-600';
      case 'Interview':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Ongoing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Closed':
        return 'bg-slate-200 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
          <Search className="w-3.5 h-3.5" />
          <span>Real-time Candidate Status Verification</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Job & Placement Status
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Students registered through our CSC partner network can verify their application progress, interview invitations, or official &quot;GET JOB&quot; joining letter details.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter Student ID (e.g. STU-1001) or Mobile Number"
            className="w-full pl-4 pr-32 py-3.5 bg-white border-2 border-slate-300 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-hidden shadow-xs"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {loading ? <span>Checking...</span> : <><span>Track Now</span> <Search className="w-3.5 h-3.5" /></>}
          </button>
        </div>

        {/* Demo Quick Try Pills */}
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
          <span>Quick demo lookup:</span>
          <button
            type="button"
            onClick={() => {
              setIdentifier('STU-1002');
            }}
            className="text-emerald-700 underline font-semibold hover:text-emerald-800 cursor-pointer"
          >
            STU-1002 (Placed / Get Job)
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => {
              setIdentifier('STU-1001');
            }}
            className="text-blue-700 underline font-semibold hover:text-blue-800 cursor-pointer"
          >
            STU-1001 (Ongoing)
          </button>
        </div>
      </form>

      {error && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed font-medium">{error}</div>
        </div>
      )}

      {/* Result Card */}
      {studentResult && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6 animate-in zoom-in-95 duration-200 max-w-2xl mx-auto">
          {/* Header of Result */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="text-xs text-slate-500 font-medium">Candidate ID: {studentResult.id}</div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{studentResult.name}</h2>
              <div className="text-xs text-slate-500 mt-0.5">
                Role: <strong className="text-slate-800">{studentResult.jobType}</strong> · Phone: {studentResult.phone}
              </div>
            </div>

            <div className="self-start sm:self-center">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-xs ${getStatusBadgeColor(
                  studentResult.status
                )}`}
              >
                {studentResult.status === 'Get Job' && <Award className="w-3.5 h-3.5 mr-1" />}
                {studentResult.status}
              </span>
            </div>
          </div>

          {/* CSC Source Info */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-1">
            <span className="text-slate-500 block font-medium">Registered CSC Partner:</span>
            <div className="font-bold text-slate-900 text-sm">{studentResult.cscCentreName}</div>
            <div className="text-slate-500 text-[11px]">
              Enrolled on:{' '}
              {studentResult.submissionDate
                ? new Date(studentResult.submissionDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Verified Date'}
            </div>
          </div>

          {/* Special Placement Box if Status is "GET JOB" (Requirement #12) */}
          {studentResult.status === 'Get Job' && studentResult.placementDetails && (
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>OFFICIAL PLACEMENT DETAILS (GET JOB)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="bg-white/80 p-3 rounded-xl border border-emerald-200">
                  <span className="text-slate-500 block text-[11px]">Placed Company:</span>
                  <strong className="text-slate-900 text-sm block">
                    {studentResult.placementDetails.companyName}
                  </strong>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-emerald-200">
                  <span className="text-slate-500 block text-[11px]">Job Position:</span>
                  <strong className="text-slate-900 text-sm block">
                    {studentResult.placementDetails.jobPosition}
                  </strong>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-emerald-200">
                  <span className="text-slate-500 block text-[11px]">Joining Date:</span>
                  <strong className="text-slate-900 block">
                    {studentResult.placementDetails.joiningDate}
                  </strong>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-emerald-200">
                  <span className="text-slate-500 block text-[11px]">Offered Salary:</span>
                  <strong className="text-emerald-700 font-bold block">
                    {studentResult.placementDetails.salary}
                  </strong>
                </div>
              </div>

              {studentResult.placementDetails.notes && (
                <div className="text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-lg border border-emerald-100">
                  <strong>HR Placement Note:</strong> {studentResult.placementDetails.notes}
                </div>
              )}
            </div>
          )}

          {/* History Timeline */}
          {studentResult.history && studentResult.history.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Status Progression History
              </h4>
              <div className="space-y-2">
                {studentResult.history.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="w-2 h-2 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <strong className="text-slate-900 font-semibold">{h.status}</strong>
                        <span className="text-[10px] text-slate-400">
                          {new Date(h.updatedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      {h.notes && <div className="text-slate-600 text-[11px] mt-0.5">{h.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
