import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import {
  CSCCentre,
  Student,
  Company,
  CompanyRequirement,
  PaymentRecord,
  JobTypeOption,
} from '../../types/index.ts';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  CreditCard,
  FileBarChart,
  Settings,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  Eye,
  LogOut,
  ChevronRight,
  TrendingUp,
  Download,
  Printer,
  Plus,
  RefreshCw,
  Building,
  Briefcase,
  UserPlus,
} from 'lucide-react';

interface AdminDashboardViewProps {
  onBackToWebsite: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onBackToWebsite }) => {
  const { user, logout } = useAuth();

  // Active Navigation Category in Admin Sidebar
  const [navSection, setNavSection] = useState<
    'dashboard' | 'csc' | 'students' | 'companies' | 'payments' | 'reports' | 'settings'
  >('dashboard');

  // Sub-tab filters
  const [cscSubTab, setCscSubTab] = useState<'all' | 'pending' | 'active' | 'history'>('all');
  const [studentSubTab, setStudentSubTab] = useState<string>('all');
  const [companySubTab, setCompanySubTab] = useState<'companies' | 'requirements'>('companies');
  const [paymentSubTab, setPaymentSubTab] = useState<'all' | 'csc' | 'company'>('all');
  const [reportType, setReportType] = useState<
    'csc' | 'students' | 'companies' | 'placements' | 'revenue'
  >('csc');

  // Data states
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [cscList, setCscList] = useState<CSCCentre[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [requirements, setRequirements] = useState<CompanyRequirement[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [jobTypes, setJobTypes] = useState<JobTypeOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters for Students
  const [studentSearch, setStudentSearch] = useState('');
  const [studentCscFilter, setStudentCscFilter] = useState('all');
  const [studentJobTypeFilter, setStudentJobTypeFilter] = useState('all');
  const [studentGenderFilter, setStudentGenderFilter] = useState('all');

  // Filters for CSC
  const [cscSearch, setCscSearch] = useState('');

  // Filters for Companies
  const [companySearch, setCompanySearch] = useState('');

  // Modals & Action States
  const [selectedStudentForStatus, setSelectedStudentForStatus] = useState<Student | null>(null);
  const [newStatus, setNewStatus] = useState<string>('New');
  const [statusNotes, setStatusNotes] = useState('');
  const [placementData, setPlacementData] = useState({
    companyName: 'ABC Industries',
    jobPosition: 'Electrician',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: '₹18,000 / month',
    location: 'Hathkhoj, Bhilai',
    notes: 'Selected after technical screening',
  });

  const [selectedCscDetails, setSelectedCscDetails] = useState<CSCCentre | null>(null);
  const [selectedCompanyHistory, setSelectedCompanyHistory] = useState<Company | null>(null);
  const [assignCandidateModalReq, setAssignCandidateModalReq] = useState<CompanyRequirement | null>(
    null
  );
  const [selectedStudentToAssign, setSelectedStudentToAssign] = useState<string>('');

  const [newJobTypeName, setNewJobTypeName] = useState('');
  const [newJobTypeCategory, setNewJobTypeCategory] = useState('Technical & Skilled');

  const [isUpdating, setIsUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Load all central administrative records
  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, cscRes, stuRes, compRes, reqRes, payRes, jtRes] = await Promise.all([
        api.getAdminDashboardReports(),
        api.getCSCCentres(),
        api.getStudents(),
        api.getCompanies(),
        api.getAllRequirements(),
        api.getPayments(),
        api.getJobTypes(),
      ]);

      setDashboardData(dashRes);
      setCscList(cscRes.cscCentres || []);
      setStudents(stuRes.students || []);
      setCompanies(compRes.companies || []);
      setRequirements(reqRes.requirements || []);
      setPayments(payRes.payments || []);
      setJobTypes(jtRes.jobTypes || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  // Handle CSC status approval/rejection/suspension
  const handleUpdateCSCStatus = async (id: string, status: string) => {
    setIsUpdating(true);
    try {
      await api.updateCSCStatus(id, status);
      setActionMessage(`CSC status changed to "${status}" successfully.`);
      fetchAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update CSC status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Student Status update (Including GET JOB)
  const handleSaveStudentStatus = async () => {
    if (!selectedStudentForStatus) return;
    setIsUpdating(true);

    try {
      const payload: any = {
        status: newStatus,
        notes: statusNotes,
      };

      if (newStatus === 'Get Job') {
        payload.placementDetails = placementData;
      }

      await api.updateStudentStatus(selectedStudentForStatus.id, payload);
      setActionMessage(
        newStatus === 'Get Job'
          ? `Candidate marked GET JOB at ${placementData.companyName}!`
          : `Student status updated to ${newStatus}.`
      );
      setSelectedStudentForStatus(null);
      fetchAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update student status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle assigning a student to a company requirement
  const handleAssignCandidate = async () => {
    if (!assignCandidateModalReq || !selectedStudentToAssign) return;
    setIsUpdating(true);

    try {
      await api.assignCandidateToRequirement(
        assignCandidateModalReq.id,
        selectedStudentToAssign,
        'Shortlisted by Admin for interview lineup'
      );
      setActionMessage('Candidate successfully assigned to requirement pipeline.');
      setAssignCandidateModalReq(null);
      setSelectedStudentToAssign('');
      fetchAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to assign candidate');
    } finally {
      setIsUpdating(false);
    }
  };

  // Add new job type
  const handleAddJobType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTypeName.trim()) return;
    try {
      await api.addJobType(newJobTypeName.trim(), newJobTypeCategory);
      setNewJobTypeName('');
      const jtRes = await api.getJobTypes();
      setJobTypes(jtRes.jobTypes || []);
      setActionMessage('New Job Type added.');
    } catch (err: any) {
      alert(err.message || 'Failed to add job type');
    }
  };

  // Reset demo database
  const handleResetDemoDb = async () => {
    if (confirm('Reset database to clean initial verified demo data? All test records will be restored.')) {
      await api.resetDemoData();
      fetchAllAdminData();
      setActionMessage('Database reset to initial demo state.');
    }
  };

  // Export report to CSV
  const handleExportCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const kpis = dashboardData?.kpis || {
    totalCsc: cscList.length,
    activeCsc: cscList.filter((c) => c.status === 'Active').length,
    pendingCsc: cscList.filter((c) => c.status === 'Pending Approval').length,
    totalStudents: students.length,
    newStudents: students.filter((s) => s.status === 'New').length,
    ongoingStudents: students.filter((s) => s.status === 'Ongoing' || s.status === 'Interview').length,
    getJobStudents: students.filter((s) => s.status === 'Get Job').length,
    totalCompanies: companies.length,
    activeCompanies: companies.filter((c) => c.status === 'Active').length,
    totalRequirements: requirements.length,
    candidatesRequired: requirements.reduce((acc, r) => acc + (r.candidatesRequired || 0), 0),
    candidatesProvided: requirements.reduce((acc, r) => acc + (r.candidatesProvided || 0), 0),
    successfulPlacements: students.filter((s) => s.status === 'Get Job').length,
    pendingPayments: 0,
    cscRevenue: payments
      .filter((p) => p.type === 'CSC_STUDENTS' && p.status === 'Paid')
      .reduce((acc, p) => acc + p.amount, 0),
    companyRevenue: payments
      .filter((p) => p.type === 'COMPANY_ANNUAL' && p.status === 'Paid')
      .reduce((acc, p) => acc + p.amount, 0),
    totalRevenue: payments
      .filter((p) => p.status === 'Paid')
      .reduce((acc, p) => acc + p.amount, 0),
  };

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.phone.includes(studentSearch) ||
      s.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.cscCentreName.toLowerCase().includes(studentSearch.toLowerCase());

    const matchesCsc = studentCscFilter === 'all' || s.cscId === studentCscFilter;
    const matchesJob =
      studentJobTypeFilter === 'all' ||
      s.jobType.toLowerCase() === studentJobTypeFilter.toLowerCase();
    const matchesGender =
      studentGenderFilter === 'all' || s.gender.toLowerCase() === studentGenderFilter.toLowerCase();
    const matchesStatus =
      studentSubTab === 'all' || s.status.toLowerCase() === studentSubTab.toLowerCase();

    return matchesSearch && matchesCsc && matchesJob && matchesGender && matchesStatus;
  });

  // Filtered CSCs
  const filteredCscList = cscList.filter((c) => {
    const matchesSearch =
      c.centreName.toLowerCase().includes(cscSearch.toLowerCase()) ||
      c.operatorName.toLowerCase().includes(cscSearch.toLowerCase()) ||
      c.phone.includes(cscSearch) ||
      c.city.toLowerCase().includes(cscSearch.toLowerCase());

    const matchesSubTab =
      cscSubTab === 'all' ||
      (cscSubTab === 'pending' && c.status === 'Pending Approval') ||
      (cscSubTab === 'active' && c.status === 'Active') ||
      cscSubTab === 'history';

    return matchesSearch && matchesSubTab;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Bar for Admin */}
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
                Admin Central Office
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300">
                Full Authorization
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-300 hidden sm:inline">
              Super Admin: <strong>{user?.name || 'Central Office'}</strong>
            </span>
            <button
              onClick={fetchAllAdminData}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
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

      {/* Action toast message */}
      {actionMessage && (
        <div className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-bold flex items-center justify-center gap-2">
          <span>✓ {actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="underline text-[11px] ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Admin Content: Sidebar + Panels */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* ADMIN SIDEBAR (Requirement #19) */}
        <aside className="w-full md:w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Admin Navigation
            </div>

            <button
              onClick={() => setNavSection('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                navSection === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => {
                setNavSection('csc');
                setCscSubTab('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                navSection === 'csc'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>CSC Management</span>
              </div>
              {kpis.pendingCsc > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                  {kpis.pendingCsc}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setNavSection('students');
                setStudentSubTab('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                navSection === 'students'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Student Management</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">{students.length}</span>
            </button>

            <button
              onClick={() => {
                setNavSection('companies');
                setCompanySubTab('companies');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                navSection === 'companies'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Company Management</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">{companies.length}</span>
            </button>

            <button
              onClick={() => setNavSection('payments')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                navSection === 'payments'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Payments & Revenue</span>
            </button>

            <button
              onClick={() => setNavSection('reports')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                navSection === 'reports'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileBarChart className="w-4 h-4 text-teal-400" />
              <span>Reports & Exports</span>
            </button>

            <button
              onClick={() => setNavSection('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                navSection === 'settings'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>System Settings</span>
            </button>
          </div>

          {/* Quick Demo Reset Card */}
          <div className="bg-slate-900 rounded-2xl p-4 text-xs text-slate-300 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              Admin Utility
            </span>
            <p className="text-[11px] text-slate-400">
              Restore clean seed data (Dhanora CSC, Power House CSC, ABC Industries, placements) anytime.
            </p>
            <button
              onClick={handleResetDemoDb}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Seed Data
            </button>
          </div>
        </aside>

        {/* Main Content View */}
        <main className="flex-1 space-y-6">
          {/* =========================================
              1. DASHBOARD OVERVIEW SECTION (Requirement #18)
             ========================================= */}
          {navSection === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Central Admin Dashboard</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      CS Consultancy · Sahu Boys Hostel, Dhanora, Bhilai - 491001
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Total Verified Revenue
                      </span>
                      <span className="text-lg font-black text-amber-400">
                        ₹{kpis.totalRevenue.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 14 KPI CARDS (Requirement #18) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Total CSCs</span>
                  <div className="text-xl font-black text-slate-900">{kpis.totalCsc}</div>
                  <span className="text-[10px] text-slate-400">All registered</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block">Active CSCs</span>
                  <div className="text-xl font-black text-emerald-700">{kpis.activeCsc}</div>
                  <span className="text-[10px] text-emerald-600">Approved kiosks</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-800 block">Pending CSCs</span>
                  <div className="text-xl font-black text-amber-600">{kpis.pendingCsc}</div>
                  <span className="text-[10px] text-amber-600">Awaiting review</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Students</span>
                  <div className="text-xl font-black text-slate-900">{kpis.totalStudents}</div>
                  <span className="text-[10px] text-slate-400">Through CSCs</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-blue-800 block">Ongoing Students</span>
                  <div className="text-xl font-black text-blue-600">{kpis.ongoingStudents}</div>
                  <span className="text-[10px] text-blue-600">Interview/Screening</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-900 block">Got Job 🏆</span>
                  <div className="text-xl font-black text-emerald-800">{kpis.getJobStudents}</div>
                  <span className="text-[10px] text-emerald-700">Placed candidates</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Companies</span>
                  <div className="text-xl font-black text-slate-900">{kpis.totalCompanies}</div>
                  <span className="text-[10px] text-slate-400">Direct employers</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Active Companies</span>
                  <div className="text-xl font-black text-slate-900">{kpis.activeCompanies}</div>
                  <span className="text-[10px] text-slate-400">Annual paid</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-purple-800 block">Total Vacancies</span>
                  <div className="text-xl font-black text-purple-700">{kpis.totalRequirements}</div>
                  <span className="text-[10px] text-purple-600">Active postings</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Candidates Req.</span>
                  <div className="text-xl font-black text-slate-900">{kpis.candidatesRequired}</div>
                  <span className="text-[10px] text-slate-400">Required headcount</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Provided Count</span>
                  <div className="text-xl font-black text-blue-700">{kpis.candidatesProvided}</div>
                  <span className="text-[10px] text-slate-400">Shortlisted/Lineup</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block">Placements</span>
                  <div className="text-xl font-black text-emerald-700">{kpis.successfulPlacements}</div>
                  <span className="text-[10px] text-emerald-600">Candidates joined</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Pending Payments</span>
                  <div className="text-xl font-black text-slate-900">₹0</div>
                  <span className="text-[10px] text-emerald-600">All settled</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-amber-300 bg-amber-50/50 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-900 block">Total Revenue</span>
                  <div className="text-xl font-black text-amber-700">₹{kpis.totalRevenue}</div>
                  <span className="text-[10px] text-amber-800">CSC + Company</span>
                </div>
              </div>

              {/* CSC Performance Table on Main Dashboard (Requirement #13) */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900">
                    CSC Partner Performance & Revenue Tracking (Requirement #13)
                  </h3>
                  <button
                    onClick={() => setNavSection('csc')}
                    className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage CSCs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">CSC Centre Name</th>
                        <th className="py-3 px-4">Operator & Phone</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Total Students</th>
                        <th className="py-3 px-4">Ongoing</th>
                        <th className="py-3 px-4">Students Got Job</th>
                        <th className="py-3 px-4 text-right">Total Amount Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cscList.map((c) => {
                        const cscStudents = students.filter((s) => s.cscId === c.id);
                        const cscOngoing = cscStudents.filter(
                          (s) => s.status === 'Ongoing' || s.status === 'Interview' || s.status === 'Shortlisted'
                        ).length;
                        const cscGotJob = cscStudents.filter((s) => s.status === 'Get Job').length;
                        const cscPaid = payments
                          .filter((p) => p.entityId === c.id && p.status === 'Paid')
                          .reduce((acc, p) => acc + p.amount, 0);

                        return (
                          <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{c.centreName}</div>
                              <span className="font-mono text-[10px] text-slate-400">{c.id}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-slate-800">{c.operatorName}</div>
                              <div className="text-[11px] text-slate-500">{c.phone}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                  c.status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : c.status === 'Pending Approval'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {c.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-800">{cscStudents.length}</td>
                            <td className="py-3 px-4 font-semibold text-blue-600">{cscOngoing}</td>
                            <td className="py-3 px-4 font-bold text-emerald-700">
                              {cscGotJob > 0 ? `🏆 ${cscGotJob}` : '0'}
                            </td>
                            <td className="py-3 px-4 text-right font-black text-slate-900">
                              ₹{cscPaid.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              2. CSC MANAGEMENT SECTION (Requirements #4, #13)
             ========================================= */}
          {navSection === 'csc' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">CSC Centre Management</h2>
                  <p className="text-xs text-slate-500">
                    Approve pending registrations, manage active VLE partners, and audit student submissions.
                  </p>
                </div>

                {/* Sub tabs */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                  {(['all', 'pending', 'active', 'history'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setCscSubTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                        cscSubTab === tab
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab === 'pending' ? `Pending (${kpis.pendingCsc})` : tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* CSC List Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="relative w-72">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={cscSearch}
                      onChange={(e) => setCscSearch(e.target.value)}
                      placeholder="Search centre, operator, phone..."
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden"
                    />
                  </div>
                  <span className="text-xs text-slate-500">
                    Showing {filteredCscList.length} Centres
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">CSC ID</th>
                        <th className="py-3 px-4">Centre & Operator</th>
                        <th className="py-3 px-4">Address / City</th>
                        <th className="py-3 px-4">Phone / WhatsApp</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions (Approve / Reject)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCscList.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-bold text-slate-700">{c.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{c.centreName}</div>
                            <div className="text-[11px] text-slate-500 font-medium">{c.operatorName}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <div>{c.officeAddress}</div>
                            <div className="text-[11px] text-slate-400">{c.city}, {c.pincode}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-800">{c.phone}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                c.status === 'Active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : c.status === 'Pending Approval'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            {c.status === 'Pending Approval' ? (
                              <>
                                <button
                                  onClick={() => handleUpdateCSCStatus(c.id, 'Active')}
                                  className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleUpdateCSCStatus(c.id, 'Rejected')}
                                  className="py-1 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            ) : c.status === 'Active' ? (
                              <button
                                onClick={() => handleUpdateCSCStatus(c.id, 'Suspended')}
                                className="py-1 px-2.5 bg-slate-100 hover:bg-rose-50 text-rose-700 rounded-lg text-[11px] font-bold cursor-pointer"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateCSCStatus(c.id, 'Active')}
                                className="py-1 px-2.5 bg-slate-100 hover:bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold cursor-pointer"
                              >
                                Activate
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedCscDetails(c)}
                              className="py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              3. STUDENT MANAGEMENT SECTION (Requirements #11, #12, #13)
             ========================================= */}
          {navSection === 'students' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Student & Placement Pipeline</h2>
                  <p className="text-xs text-slate-500">
                    Manage student interview progress, mark &quot;GET JOB&quot;, and track source CSC centres.
                  </p>
                </div>
                <div className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  Total Enrolled Candidates: {students.length}
                </div>
              </div>

              {/* Status Tabs (Requirement #11) */}
              <div className="flex flex-wrap gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200">
                {[
                  { id: 'all', label: 'All Students' },
                  { id: 'new', label: 'New Students' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'shortlisted', label: 'Shortlisted' },
                  { id: 'interview', label: 'Interview' },
                  { id: 'ongoing', label: 'Ongoing' },
                  { id: 'get job', label: 'Get Job (Placed)' },
                  { id: 'rejected', label: 'Rejected' },
                  { id: 'closed', label: 'Closed' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setStudentSubTab(t.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      studentSubTab === t.id
                        ? t.id === 'get job'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t.id === 'get job' && '🏆 '}
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Filters Bar: CSC, Job Type, Gender, Search (Requirements #11, #13) */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Filter by CSC Source
                  </label>
                  <select
                    value={studentCscFilter}
                    onChange={(e) => setStudentCscFilter(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="all">All CSC Centres</option>
                    {cscList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.centreName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Job Type
                  </label>
                  <select
                    value={studentJobTypeFilter}
                    onChange={(e) => setStudentJobTypeFilter(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="all">All Roles</option>
                    {jobTypes.map((j) => (
                      <option key={j.id} value={j.name}>
                        {j.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Gender
                  </label>
                  <select
                    value={studentGenderFilter}
                    onChange={(e) => setStudentGenderFilter(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="all">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Search Name / Phone
                  </label>
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search candidate..."
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              {/* Students Table with CSC-Source Tracking (Requirements #11, #13) */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Role & Qualification</th>
                        <th className="py-3 px-4">Submitting CSC (Source)</th>
                        <th className="py-3 px-4">Payment & Reg Date</th>
                        <th className="py-3 px-4">Current Status</th>
                        <th className="py-3 px-4 text-right">Manage Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{s.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {s.phone} · <span className="font-mono">{s.id}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-800">{s.jobType}</div>
                            <div className="text-[11px] text-slate-500">{s.qualification}</div>
                          </td>
                          {/* CSC-Source Tracking Displayed Clearly */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{s.cscCentreName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              ID: {s.cscId} · Phone: {s.cscPhone || 'Recorded'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-emerald-700">₹{s.paymentAmount} Paid</div>
                            <div className="text-[10px] text-slate-400">
                              {new Date(s.submissionDate).toLocaleDateString('en-IN')}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                s.status === 'Get Job'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : s.status === 'Interview'
                                  ? 'bg-purple-100 text-purple-800'
                                  : s.status === 'Shortlisted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {s.status === 'Get Job' && '🏆 '}
                              {s.status}
                            </span>
                            {s.status === 'Get Job' && s.placementDetails && (
                              <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                                @ {s.placementDetails.companyName}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedStudentForStatus(s);
                                setNewStatus(s.status);
                                setStatusNotes('');
                                if (s.placementDetails) {
                                  setPlacementData({
                                    companyName: s.placementDetails.companyName,
                                    jobPosition: s.placementDetails.jobPosition,
                                    joiningDate: s.placementDetails.joiningDate,
                                    salary: s.placementDetails.salary,
                                    location: s.placementDetails.location,
                                    notes: s.placementDetails.notes || '',
                                  });
                                }
                              }}
                              className="py-1 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-xs"
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              4. COMPANY MANAGEMENT SECTION (Requirements #14, #15, #16, #17)
             ========================================= */}
          {navSection === 'companies' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Direct Company & Requisition Management</h2>
                  <p className="text-xs text-slate-500">
                    Track annual ₹5,000 corporate registrations, historical requirements, and candidate assignments.
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setCompanySubTab('companies')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      companySubTab === 'companies'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Direct Companies ({companies.length})
                  </button>
                  <button
                    onClick={() => setCompanySubTab('requirements')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      companySubTab === 'requirements'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Manpower Requirements ({requirements.length})
                  </button>
                </div>
              </div>

              {/* Sub-View A: Direct Registered Companies Table (Requirement #16) */}
              {companySubTab === 'companies' && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">
                      Corporate Members (Annual Fee: ₹5,000/yr)
                    </span>
                    <span className="text-xs text-slate-500">
                      Active: {kpis.activeCompanies} | Total: {companies.length}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="py-3 px-4">Company Name</th>
                          <th className="py-3 px-4">Contact & Location</th>
                          <th className="py-3 px-4">Membership & Expiry</th>
                          <th className="py-3 px-4">Total Req.</th>
                          <th className="py-3 px-4">Req. Candidates</th>
                          <th className="py-3 px-4">Provided</th>
                          <th className="py-3 px-4">Joined</th>
                          <th className="py-3 px-4 text-right">History & Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {companies.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{c.companyName}</div>
                              <div className="text-[11px] text-slate-500">{c.industry}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-slate-800">{c.contactPerson}</div>
                              <div className="text-[11px] text-slate-500">{c.phone} · {c.city}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-emerald-700">₹5,000 Paid</span>
                              <div className="text-[10px] text-slate-400">
                                Exp: {new Date(c.expiryDate).toLocaleDateString('en-IN')}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-800">{c.requirementsCount}</td>
                            <td className="py-3 px-4 font-bold text-slate-800">
                              {c.candidatesRequiredTotal}
                            </td>
                            <td className="py-3 px-4 font-semibold text-blue-600">
                              {c.candidatesProvidedTotal}
                            </td>
                            <td className="py-3 px-4 font-black text-emerald-700">
                              {c.candidatesJoinedTotal}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedCompanyHistory(c)}
                                className="py-1 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
                              >
                                View History
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-View B: Manpower Requirements List with Assign Candidate feature */}
              {companySubTab === 'requirements' && (
                <div className="space-y-4">
                  {requirements.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-slate-900 text-base">
                              {req.companyName} — {req.jobPosition}
                            </h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                              {req.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Req ID: {req.id} · Location: {req.jobLocation} · Salary: {req.salary}
                          </p>
                        </div>

                        <button
                          onClick={() => setAssignCandidateModalReq(req)}
                          className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-center cursor-pointer shadow-xs"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                          <span>Assign Candidate</span>
                        </button>
                      </div>

                      {/* Requirement Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">
                            Required Count:
                          </span>
                          <strong className="text-slate-900 text-sm">{req.candidatesRequired} Candidates</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">
                            Gender Rule:
                          </span>
                          <strong className="text-slate-900">{req.genderRequirement}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">
                            Candidates Provided:
                          </span>
                          <strong className="text-blue-700">{req.candidatesProvided}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">
                            Joined Count:
                          </span>
                          <strong className="text-emerald-700">{req.candidatesJoined}</strong>
                        </div>
                      </div>

                      {/* Assigned Candidates List */}
                      {req.candidateAssignments && req.candidateAssignments.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <span className="text-[11px] font-bold uppercase text-slate-500 block">
                            Assigned Candidates:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {req.candidateAssignments.map((a, i) => (
                              <div
                                key={i}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs flex items-center gap-2"
                              >
                                <div>
                                  <strong>{a.studentName}</strong> ({a.phone})
                                  <span className="text-[10px] text-slate-500 block">
                                    via {a.cscCentreName}
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                                  {a.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================
              5. PAYMENTS AUDIT SECTION (Requirement #23)
             ========================================= */}
          {navSection === 'payments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Payments & Gateway Audit</h2>
                  <p className="text-xs text-slate-500">
                    Audit CSC student batches (₹1,000/student) and Direct Company annual subscriptions (₹5,000/yr).
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                  {(['all', 'csc', 'company'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setPaymentSubTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                        paymentSubTab === tab
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab === 'csc' ? 'CSC Student Fees' : tab === 'company' ? 'Company Annual' : 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payments Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Payment ID</th>
                        <th className="py-3 px-4">Entity & Category</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Method & Reference</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments
                        .filter((p) => {
                          if (paymentSubTab === 'csc') return p.type === 'CSC_STUDENTS';
                          if (paymentSubTab === 'company') return p.type === 'COMPANY_ANNUAL';
                          return true;
                        })
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-mono font-bold text-slate-700">{p.id}</td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{p.entityName}</div>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  p.type === 'CSC_STUDENTS'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {p.type === 'CSC_STUDENTS'
                                  ? `CSC Batch (${p.studentCount || p.amount / 1000} Students)`
                                  : 'Direct Company Membership'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {new Date(p.createdAt).toLocaleDateString('en-IN')}
                            </td>
                            <td className="py-3 px-4 font-black text-emerald-700 text-sm">
                              ₹{p.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-slate-800 font-medium">{p.paymentMethod}</div>
                              <div className="text-[10px] font-mono text-slate-400">
                                {p.transactionRef}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                ✓ {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              6. REPORTS & EXPORTS SECTION (Requirement #20)
             ========================================= */}
          {navSection === 'reports' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Administrative Reports</h2>
                  <p className="text-xs text-slate-500">
                    Generate filtered reports with one-click CSV export and print view.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (reportType === 'csc') {
                        handleExportCSV(
                          'CSC_Report',
                          ['CSC_ID', 'Centre_Name', 'Operator', 'City', 'Phone', 'Status'],
                          cscList.map((c) => [c.id, c.centreName, c.operatorName, c.city, c.phone, c.status])
                        );
                      } else if (reportType === 'students') {
                        handleExportCSV(
                          'Student_Report',
                          ['Student_ID', 'Name', 'Phone', 'Role', 'CSC_Centre', 'Status'],
                          students.map((s) => [s.id, s.name, s.phone, s.jobType, s.cscCentreName, s.status])
                        );
                      } else if (reportType === 'placements') {
                        handleExportCSV(
                          'Placement_Report',
                          ['Student_ID', 'Name', 'Company', 'Position', 'Salary', 'Date'],
                          students
                            .filter((s) => s.status === 'Get Job')
                            .map((s) => [
                              s.id,
                              s.name,
                              s.placementDetails?.companyName || 'N/A',
                              s.placementDetails?.jobPosition || s.jobType,
                              s.placementDetails?.salary || 'N/A',
                              s.placementDetails?.joiningDate || 'N/A',
                            ])
                        );
                      } else if (reportType === 'revenue') {
                        handleExportCSV(
                          'Revenue_Report',
                          ['Payment_ID', 'Entity_Name', 'Type', 'Amount', 'Date', 'Status'],
                          payments.map((p) => [p.id, p.entityName, p.type, p.amount, p.createdAt, p.status])
                        );
                      }
                    }}
                    className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Report Category Selector */}
              <div className="flex flex-wrap gap-2 p-1 bg-white rounded-2xl border border-slate-200">
                {(['csc', 'students', 'placements', 'revenue', 'companies'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setReportType(r as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                      reportType === r ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {r} Report
                  </button>
                ))}
              </div>

              {/* Preview of Selected Report */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900 capitalize">
                  {reportType} Master Audit Report Preview
                </h3>

                <div className="overflow-x-auto max-h-96">
                  {reportType === 'csc' && (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-2">ID</th>
                          <th className="p-2">Centre Name</th>
                          <th className="p-2">Operator</th>
                          <th className="p-2">Phone</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {cscList.map((c) => (
                          <tr key={c.id}>
                            <td className="p-2 font-mono">{c.id}</td>
                            <td className="p-2 font-bold">{c.centreName}</td>
                            <td className="p-2">{c.operatorName}</td>
                            <td className="p-2">{c.phone}</td>
                            <td className="p-2 font-bold text-emerald-700">{c.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {reportType === 'students' && (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-2">ID</th>
                          <th className="p-2">Name</th>
                          <th className="p-2">Role</th>
                          <th className="p-2">Submitting CSC</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {students.map((s) => (
                          <tr key={s.id}>
                            <td className="p-2 font-mono">{s.id}</td>
                            <td className="p-2 font-bold">{s.name}</td>
                            <td className="p-2">{s.jobType}</td>
                            <td className="p-2">{s.cscCentreName}</td>
                            <td className="p-2 font-bold">{s.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {reportType === 'placements' && (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-2">Candidate</th>
                          <th className="p-2">Placed Company</th>
                          <th className="p-2">Job Designation</th>
                          <th className="p-2">Offered Salary</th>
                          <th className="p-2">Joining Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {students
                          .filter((s) => s.status === 'Get Job')
                          .map((s) => (
                            <tr key={s.id}>
                              <td className="p-2 font-bold">{s.name}</td>
                              <td className="p-2 text-emerald-800 font-bold">
                                {s.placementDetails?.companyName}
                              </td>
                              <td className="p-2">{s.placementDetails?.jobPosition}</td>
                              <td className="p-2 font-semibold text-emerald-700">
                                {s.placementDetails?.salary}
                              </td>
                              <td className="p-2">{s.placementDetails?.joiningDate}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}

                  {reportType === 'revenue' && (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-2">ID</th>
                          <th className="p-2">Entity Name</th>
                          <th className="p-2">Category</th>
                          <th className="p-2">Amount Paid</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {payments.map((p) => (
                          <tr key={p.id}>
                            <td className="p-2 font-mono">{p.id}</td>
                            <td className="p-2 font-bold">{p.entityName}</td>
                            <td className="p-2">{p.type}</td>
                            <td className="p-2 font-black text-emerald-700">₹{p.amount}</td>
                            <td className="p-2 font-bold">✓ {p.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              7. SYSTEM SETTINGS & JOB TYPES
             ========================================= */}
          {navSection === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">System & Master Configuration</h2>
                <p className="text-xs text-slate-500">
                  Manage job type dropdown options, regional parameters, and payment architecture.
                </p>
              </div>

              {/* Job Types Manager */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900">Master Job Types (Dropdown Options)</h3>

                <form onSubmit={handleAddJobType} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newJobTypeName}
                    onChange={(e) => setNewJobTypeName(e.target.value)}
                    placeholder="New job type (e.g. CNC Operator)"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  <select
                    value={newJobTypeCategory}
                    onChange={(e) => setNewJobTypeCategory(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Technical & Skilled">Technical & Skilled</option>
                    <option value="General & Industrial">General & Industrial</option>
                    <option value="Commercial & Retail">Commercial & Retail</option>
                    <option value="Office & IT">Office & IT</option>
                  </select>
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-lg bg-slate-900 text-white font-bold text-xs cursor-pointer"
                  >
                    + Add Job Type
                  </button>
                </form>

                <div className="flex flex-wrap gap-2 pt-2">
                  {jobTypes.map((jt) => (
                    <span
                      key={jt.id}
                      className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800"
                    >
                      {jt.name} <span className="text-[10px] text-slate-400">({jt.category})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Payment Architecture Config Display */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs text-xs">
                <h3 className="font-bold text-sm text-slate-900">Payment Gateway Architecture</h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div>
                    <span className="text-slate-500">Mode:</span>{' '}
                    <strong className="text-emerald-700">Development / Test Simulation Architecture</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">CSC Pricing Rule:</span>{' '}
                    <strong>₹1,000 / Student (Server-Side Enforced)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Company Annual Pricing Rule:</span>{' '}
                    <strong>₹5,000 / Year (Server-Side Enforced)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Razorpay Configuration:</span>{' '}
                    <span className="font-mono text-slate-600">RAZORPAY_KEY_ID configured in .env</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================
          MODAL: UPDATE STUDENT STATUS & GET JOB (Requirement #12)
         ========================================= */}
      {selectedStudentForStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Update Status: {selectedStudentForStatus.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Submitting CSC: <strong className="text-slate-800">{selectedStudentForStatus.cscCentreName}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentForStatus(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Select New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900"
                >
                  <option value="New">New</option>
                  <option value="Pending">Pending</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Get Job">GET JOB (Successful Placement)</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* IF "GET JOB" IS SELECTED: PROMPT FOR MANDATORY PLACEMENT DETAILS (Requirement #12) */}
              {newStatus === 'Get Job' && (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-3">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs uppercase">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Record &quot;GET JOB&quot; Placement Details:</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={placementData.companyName}
                      onChange={(e) =>
                        setPlacementData({ ...placementData, companyName: e.target.value })
                      }
                      placeholder="e.g. ABC Industries"
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                        Job Position *
                      </label>
                      <input
                        type="text"
                        required
                        value={placementData.jobPosition}
                        onChange={(e) =>
                          setPlacementData({ ...placementData, jobPosition: e.target.value })
                        }
                        placeholder="e.g. Electrician"
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                        Joining Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={placementData.joiningDate}
                        onChange={(e) =>
                          setPlacementData({ ...placementData, joiningDate: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                        Salary Offered *
                      </label>
                      <input
                        type="text"
                        required
                        value={placementData.salary}
                        onChange={(e) =>
                          setPlacementData({ ...placementData, salary: e.target.value })
                        }
                        placeholder="e.g. ₹18,000 / month"
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={placementData.location}
                        onChange={(e) =>
                          setPlacementData({ ...placementData, location: e.target.value })
                        }
                        placeholder="e.g. Hathkhoj, Bhilai"
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                      Placement Notes
                    </label>
                    <input
                      type="text"
                      value={placementData.notes}
                      onChange={(e) =>
                        setPlacementData({ ...placementData, notes: e.target.value })
                      }
                      placeholder="e.g. Offer letter issued, PF/ESI kit provided"
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                  Admin Progression Note / History Comment
                </label>
                <input
                  type="text"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Optional note visible in history..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleSaveStudentStatus}
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Confirm Status Change'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStudentForStatus(null)}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: COMPANY HISTORY & PREVIOUS REQUIREMENTS (Requirement #16)
         ========================================= */}
      {selectedCompanyHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {selectedCompanyHistory.companyName} — Permanent Historical Record
                </h3>
                <p className="text-xs text-slate-500">
                  Registered: {new Date(selectedCompanyHistory.registrationDate).toLocaleDateString('en-IN')} · Expiry: {new Date(selectedCompanyHistory.expiryDate).toLocaleDateString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedCompanyHistory(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Aggregated History Metrics (Requirement #16) */}
              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Candidates Required:
                  </span>
                  <div className="text-xl font-black text-slate-900">
                    {selectedCompanyHistory.candidatesRequiredTotal}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Candidates Provided:
                  </span>
                  <div className="text-xl font-black text-blue-700">
                    {selectedCompanyHistory.candidatesProvidedTotal}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Candidates Joined:
                  </span>
                  <div className="text-xl font-black text-emerald-700">
                    {selectedCompanyHistory.candidatesJoinedTotal}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Pending Count:
                  </span>
                  <div className="text-xl font-black text-amber-700">
                    {Math.max(
                      0,
                      selectedCompanyHistory.candidatesRequiredTotal -
                        selectedCompanyHistory.candidatesJoinedTotal
                    )}
                  </div>
                </div>
              </div>

              {/* All Requirements of this company */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase text-slate-700">
                  All Previous & Active Requirements
                </h4>
                {requirements.filter((r) => r.companyId === selectedCompanyHistory.id).length === 0 ? (
                  <p className="text-slate-400 py-3">No requirements posted yet.</p>
                ) : (
                  requirements
                    .filter((r) => r.companyId === selectedCompanyHistory.id)
                    .map((r) => (
                      <div
                        key={r.id}
                        className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5"
                      >
                        <div className="flex justify-between items-center">
                          <strong className="text-slate-900 text-sm">
                            {r.jobPosition} ({r.candidatesRequired} Required)
                          </strong>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                            {r.status}
                          </span>
                        </div>
                        <div className="text-slate-600 text-[11px]">
                          Salary: {r.salary} · Gender: {r.genderRequirement} · Location: {r.jobLocation}
                        </div>
                        <div className="text-slate-500 text-[10px]">
                          Provided: {r.candidatesProvided} | Joined: {r.candidatesJoined}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedCompanyHistory(null)}
                className="py-2 px-5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: ASSIGN CANDIDATE TO REQUIREMENT
         ========================================= */}
      {assignCandidateModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Assign Candidate</h3>
                <p className="text-xs text-slate-500">
                  Target: {assignCandidateModalReq.companyName} ({assignCandidateModalReq.jobPosition})
                </p>
              </div>
              <button onClick={() => setAssignCandidateModalReq(null)} className="text-slate-400">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Select Registered Student
                </label>
                <select
                  value={selectedStudentToAssign}
                  onChange={(e) => setSelectedStudentToAssign(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-xs"
                >
                  <option value="">-- Choose Candidate from Pool --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.jobType} · via {s.cscCentreName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  disabled={!selectedStudentToAssign || isUpdating}
                  onClick={handleAssignCandidate}
                  className="flex-1 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs cursor-pointer disabled:opacity-50"
                >
                  Assign to Lineup
                </button>
                <button
                  type="button"
                  onClick={() => setAssignCandidateModalReq(null)}
                  className="py-3 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: CSC CENTRE FULL PROFILE VIEW
         ========================================= */}
      {selectedCscDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedCscDetails.centreName}</h3>
                <p className="text-xs text-slate-500 font-mono">ID: {selectedCscDetails.id}</p>
              </div>
              <button onClick={() => setSelectedCscDetails(null)} className="text-slate-400">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl">
              <div>Operator: <strong>{selectedCscDetails.operatorName}</strong></div>
              <div>Phone: <strong>{selectedCscDetails.phone}</strong></div>
              <div>WhatsApp: <strong>{selectedCscDetails.whatsapp}</strong></div>
              <div>Email: <strong>{selectedCscDetails.email || 'N/A'}</strong></div>
              <div>Address: <strong>{selectedCscDetails.officeAddress}, {selectedCscDetails.city} - {selectedCscDetails.pincode}</strong></div>
              <div>VLE ID: <strong className="font-mono">{selectedCscDetails.vleId || 'N/A'}</strong></div>
              <div>Username: <strong className="font-mono">{selectedCscDetails.username}</strong></div>
              <div>Status: <strong className="text-emerald-700">{selectedCscDetails.status}</strong></div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedCscDetails(null)}
                className="py-2 px-5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
