import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Student } from '../../types/index.ts';
import { Award, Briefcase, Building2, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const CSCPlacementStatus: React.FC = () => {
  const { user } = useAuth();
  const cscId = user?.cscId;

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cscId) return;
    setLoading(true);
    api.getStudents({ cscId })
      .then((res) => setStudents(res.students || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [cscId]);

  const placedStudents = students.filter((s) => s.status === 'Get Job');
  const interviewStudents = students.filter((s) => s.status === 'Interview');
  const ongoingStudents = students.filter((s) => s.status === 'Ongoing' || s.status === 'Shortlisted');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Placement & Recruitment Progression</h2>
        <p className="text-xs text-slate-500">
          Track interview calls and successful placements for candidates registered from your CSC centre.
        </p>
      </div>

      {/* Placement KPI summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Students Got Job
            </span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-900 mt-2">{placedStudents.length}</div>
          <p className="text-[11px] text-emerald-700 mt-1">Confirmed industrial offers & appointments</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
              In Interview Stage
            </span>
            <Briefcase className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-900 mt-2">{interviewStudents.length}</div>
          <p className="text-[11px] text-purple-700 mt-1">Shortlisted & interview scheduled</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Ongoing Screening
            </span>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-900 mt-2">{ongoingStudents.length}</div>
          <p className="text-[11px] text-blue-700 mt-1">Document verification & skill matching</p>
        </div>
      </div>

      {/* Confirmed Placements List (GET JOB Spotlight) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Confirmed Placements (&quot;GET JOB&quot;)</span>
        </h3>

        {placedStudents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
            No students currently marked with &quot;GET JOB&quot; status. Once interviews conclude, admin updates offer letters here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {placedStudents.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl border-2 border-emerald-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500">{s.id}</span>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{s.name}</h4>
                    <span className="text-xs text-slate-600 font-medium">Role: {s.jobType}</span>
                  </div>
                  <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs">
                    GET JOB ✓
                  </span>
                </div>

                {s.placementDetails && (
                  <div className="bg-emerald-50/70 p-3.5 rounded-xl text-xs space-y-1.5 border border-emerald-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Company:</span>
                      <strong className="text-slate-900">{s.placementDetails.companyName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Designation:</span>
                      <strong className="text-slate-900">{s.placementDetails.jobPosition}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Salary:</span>
                      <strong className="text-emerald-800">{s.placementDetails.salary}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Joining Date:</span>
                      <strong className="text-slate-900">{s.placementDetails.joiningDate}</strong>
                    </div>
                    {s.placementDetails.notes && (
                      <div className="text-[11px] text-slate-600 pt-1 border-t border-emerald-200">
                        Note: {s.placementDetails.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
