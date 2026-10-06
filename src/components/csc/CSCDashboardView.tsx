import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import {
  LayoutDashboard,
  User,
  UserPlus,
  Users,
  CreditCard,
  Award,
  LogOut,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  Briefcase,
} from 'lucide-react';

import { CSCAddStudentWorkflow } from './CSCAddStudentWorkflow.tsx';
import { CSCStudentRecords } from './CSCStudentRecords.tsx';
import { CSCPaymentHistory } from './CSCPaymentHistory.tsx';
import { CSCPlacementStatus } from './CSCPlacementStatus.tsx';
import { CSCProfile } from './CSCProfile.tsx';

interface CSCDashboardViewProps {
  onBackToWebsite: () => void;
}

export const CSCDashboardView: React.FC<CSCDashboardViewProps> = ({ onBackToWebsite }) => {
  const { user, cscData, logout } = useAuth();
  const cscId = user?.cscId || 'CSC-1001';

  // Active tab in CSC sidebar (Requirement #5)
  // Dashboard | My Profile | Add Student | Student Records | Payment History | Placement Status | Logout
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'profile' | 'add-student' | 'records' | 'payments' | 'placement'
  >('dashboard');

  const [statsData, setStatsData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = () => {
    setLoading(true);
    api.getCSCDashboardStats(cscId)
      .then((res) => {
        setStatsData(res);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [cscId, activeTab]);

  const stats = statsData?.stats || {
    totalStudentsAdded: 0,
    pendingStudents: 0,
    ongoingStudents: 0,
    studentsGotJob: 0,
    totalStudentsSubmitted: 0,
    totalAmountPaid: 0,
    pendingPayment: 0,
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Bar inside Portal */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>← Back to Public Website</span>
            </button>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                CSC Customer Portal
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                Active Partner
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-300 hidden sm:inline">
              Welcome, <strong>{cscData?.centreName || user?.name}</strong>
            </span>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-300 hover:text-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation (Requirement #5) */}
        <aside className="w-full md:w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              CSC Menu
            </div>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('add-student')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'add-student'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <UserPlus className="w-4 h-4 text-emerald-300" />
              <span>Add Student (Batch)</span>
            </button>

            <button
              onClick={() => setActiveTab('records')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'records'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span>Student Records</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'payments'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Payment History</span>
            </button>

            <button
              onClick={() => setActiveTab('placement')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'placement'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Placement Status</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>My Profile</span>
            </button>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Quick Pricing reminder widget */}
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-4 text-xs space-y-2 border border-slate-800">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              CSC Standard Rate
            </span>
            <div className="text-base font-extrabold text-white">₹1,000 / Student</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Add multiple candidates in the builder; total automatically updates before payment checkout.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header banner */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    CSC Customer Dashboard
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                    {cscData?.centreName || 'Dhanora CSC Digital Point'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Operator: {cscData?.operatorName || 'Ramesh Sahu'} · Location: {cscData?.city || 'Bhilai'}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('add-student')}
                  className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all self-start sm:self-center"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Add Students to Batch</span>
                </button>
              </div>

              {/* 8 DASHBOARD CARDS (Requirement #5) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* 1. Total Students Added */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    Total Students Added
                  </span>
                  <div className="text-2xl font-black text-slate-900">{stats.totalStudentsAdded}</div>
                  <span className="text-[10px] text-slate-400">Enrolled through your kiosk</span>
                </div>

                {/* 2. Pending Students */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    Pending Students
                  </span>
                  <div className="text-2xl font-black text-amber-600">{stats.pendingStudents}</div>
                  <span className="text-[10px] text-slate-400">Awaiting admin review</span>
                </div>

                {/* 3. Ongoing Students */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    Ongoing Students
                  </span>
                  <div className="text-2xl font-black text-blue-600">{stats.ongoingStudents}</div>
                  <span className="text-[10px] text-slate-400">Under corporate screening</span>
                </div>

                {/* 4. Students Got Job */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-xs space-y-1">
                  <span className="text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                    Students Got Job 🏆
                  </span>
                  <div className="text-2xl font-black text-emerald-700">{stats.studentsGotJob}</div>
                  <span className="text-[10px] text-emerald-600">Successfully placed in jobs</span>
                </div>

                {/* 5. Total Students Submitted */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    Total Submitted
                  </span>
                  <div className="text-2xl font-black text-slate-900">{stats.totalStudentsSubmitted}</div>
                  <span className="text-[10px] text-slate-400">All submitted candidates</span>
                </div>

                {/* 6. Total Amount Paid */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    Total Amount Paid
                  </span>
                  <div className="text-2xl font-black text-emerald-700">
                    ₹{stats.totalAmountPaid.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-400">Verified batch fees</span>
                </div>

                {/* 7. Pending Payment */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    Pending Payment
                  </span>
                  <div className="text-2xl font-black text-slate-900">₹0</div>
                  <span className="text-[10px] text-emerald-600">All batches up to date</span>
                </div>

                {/* 8. Recent Submissions count */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    Recent Submissions
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    {statsData?.recentStudents?.length || 0}
                  </div>
                  <span className="text-[10px] text-slate-400">Active recent applications</span>
                </div>
              </div>

              {/* Recent Students Table (Requirement #5) */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900">
                    Recent Student Submissions from Your Centre
                  </h3>
                  <button
                    onClick={() => setActiveTab('records')}
                    className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Records</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {statsData?.recentStudents && statsData.recentStudents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                          <th className="pb-2">ID</th>
                          <th className="pb-2">Student Name</th>
                          <th className="pb-2">Role</th>
                          <th className="pb-2">Phone</th>
                          <th className="pb-2">Date</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {statsData.recentStudents.map((s: any) => (
                          <tr key={s.id} className="hover:bg-slate-50">
                            <td className="py-2.5 font-mono font-bold text-slate-700">{s.id}</td>
                            <td className="py-2.5 font-bold text-slate-900">{s.name}</td>
                            <td className="py-2.5 text-slate-700">{s.jobType}</td>
                            <td className="py-2.5 text-slate-600">{s.phone}</td>
                            <td className="py-2.5 text-slate-500">
                              {new Date(s.submissionDate).toLocaleDateString('en-IN')}
                            </td>
                            <td className="py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                  s.status === 'Get Job'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-800'
                                }`}
                              >
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No submissions yet. Click &quot;Add Student&quot; to begin.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'add-student' && (
            <CSCAddStudentWorkflow onSuccessViewRecords={() => setActiveTab('records')} />
          )}

          {activeTab === 'records' && <CSCStudentRecords />}

          {activeTab === 'payments' && <CSCPaymentHistory />}

          {activeTab === 'placement' && <CSCPlacementStatus />}

          {activeTab === 'profile' && <CSCProfile />}
        </main>
      </div>
    </div>
  );
};
