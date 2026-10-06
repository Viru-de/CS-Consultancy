import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Student } from '../../types/index.ts';
import {
  Users,
  Search,
  Filter,
  Eye,
  FileText,
  Building2,
  Calendar,
  Sparkles,
  Phone,
  CheckCircle2,
} from 'lucide-react';

export const CSCStudentRecords: React.FC = () => {
  const { user } = useAuth();
  const cscId = user?.cscId;

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (!cscId) return;
    setLoading(true);
    api.getStudents({ cscId })
      .then((res) => setStudents(res.students || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [cscId]);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search) ||
      s.jobType.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || s.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Get Job':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Registered Student Records</h2>
          <p className="text-xs text-slate-500">
            Showing all job-seeking students submitted by your CSC Centre. Total: {students.length}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, role..."
              className="pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Get Job">Get Job (Placed)</option>
            <option value="Rejected">Rejected</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading your student records...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
          <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p>No student records matching your filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Name & Contact</th>
                  <th className="py-3 px-4">Job Looking For</th>
                  <th className="py-3 px-4">Qualification</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{s.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-500">{s.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {s.jobType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{s.qualification}</td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-700 font-bold">₹1,000</span>
                      <span className="text-[10px] text-slate-400 block">{s.paymentId}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] border ${getStatusBadge(
                          s.status
                        )}`}
                      >
                        {s.status === 'Get Job' && '🏆 '}
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-white">Student Profile: {selectedStudent.name}</h3>
                <p className="text-xs text-slate-400">ID: {selectedStudent.id} · CSC: {selectedStudent.cscCentreName}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Placement box if placed */}
              {selectedStudent.status === 'Get Job' && selectedStudent.placementDetails && (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Candidate Successfully Placed (GET JOB)!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>Company: <strong>{selectedStudent.placementDetails.companyName}</strong></div>
                    <div>Position: <strong>{selectedStudent.placementDetails.jobPosition}</strong></div>
                    <div>Salary: <strong className="text-emerald-700">{selectedStudent.placementDetails.salary}</strong></div>
                    <div>Joining: <strong>{selectedStudent.placementDetails.joiningDate}</strong></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl">
                <div>Phone: <strong>{selectedStudent.phone}</strong></div>
                <div>WhatsApp: <strong>{selectedStudent.whatsapp}</strong></div>
                <div>Gender: <strong>{selectedStudent.gender}</strong></div>
                <div>DOB: <strong>{selectedStudent.dob}</strong></div>
                <div>Qualification: <strong>{selectedStudent.qualification}</strong></div>
                <div>Experience: <strong>{selectedStudent.experience}</strong></div>
                <div>Preferred Location: <strong>{selectedStudent.preferredLocation}</strong></div>
                <div>Expected Salary: <strong>{selectedStudent.expectedSalary}</strong></div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-0.5">Permanent Address:</span>
                <p className="text-slate-600">{selectedStudent.address || 'Not specified'}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-0.5">Skills:</span>
                <p className="text-slate-600">{selectedStudent.skills || 'General'}</p>
              </div>

              {/* Status History */}
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-700 block mb-2">History & Admin Progression:</span>
                <div className="space-y-1.5">
                  {selectedStudent.history.map((h, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center text-[11px]">
                      <div>
                        <strong>{h.status}</strong>
                        {h.notes && <span className="text-slate-500 ml-2">({h.notes})</span>}
                      </div>
                      <span className="text-slate-400">
                        {new Date(h.updatedAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
