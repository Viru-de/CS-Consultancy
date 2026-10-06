import {
  CSCCentre,
  Student,
  PaymentRecord,
  Company,
  CompanyRequirement,
  JobTypeOption,
  ContactMessage,
  User,
  NewStudentFormInput,
} from '../types/index.ts';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.error || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data as T;
}

export const api = {
  // Auth
  async login(credentials: { username: string; password: string; role: 'admin' | 'csc' }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse<{ user: User & { cscData?: any }; token: string }>(res);
  },

  // CSC Management
  async registerCSC(data: Partial<CSCCentre>) {
    const res = await fetch(`${API_BASE}/csc/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; message: string; csc: Partial<CSCCentre> }>(res);
  },

  async getCSCCentres(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/csc?${query}`);
    return handleResponse<{ cscCentres: CSCCentre[] }>(res);
  },

  async getCSCById(id: string) {
    const res = await fetch(`${API_BASE}/csc/${id}`);
    return handleResponse<CSCCentre & { stats: any }>(res);
  },

  async updateCSCStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/csc/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return handleResponse<{ success: boolean; cscId: string; status: string }>(res);
  },

  async getCSCDashboardStats(cscId: string) {
    const res = await fetch(`${API_BASE}/csc/${cscId}/dashboard-stats`);
    return handleResponse<{
      csc: any;
      stats: {
        totalStudentsAdded: number;
        pendingStudents: number;
        ongoingStudents: number;
        studentsGotJob: number;
        totalStudentsSubmitted: number;
        totalAmountPaid: number;
        pendingPayment: number;
      };
      recentStudents: Student[];
      recentPayments: PaymentRecord[];
    }>(res);
  },

  // Students & Submissions
  // Server-side calculated batch submission
  async submitStudentsBatch(data: {
    cscId: string;
    students: NewStudentFormInput[];
    paymentMethod: string;
    transactionRef?: string;
  }) {
    const res = await fetch(`${API_BASE}/students/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{
      success: boolean;
      message: string;
      paymentId: string;
      submissionId: string;
      studentCount: number;
      amountPaid: number;
      studentIds: string[];
      students: Student[];
    }>(res);
  },

  async getStudents(params?: {
    cscId?: string;
    status?: string;
    jobType?: string;
    gender?: string;
    search?: string;
  }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/students?${query}`);
    return handleResponse<{ students: Student[] }>(res);
  },

  async getStudentById(id: string) {
    const res = await fetch(`${API_BASE}/students/${id}`);
    return handleResponse<Student>(res);
  },

  async trackStudentPublic(identifier: string) {
    const res = await fetch(`${API_BASE}/students/track/${encodeURIComponent(identifier)}`);
    return handleResponse<Partial<Student>>(res);
  },

  async updateStudentStatus(
    id: string,
    data: {
      status: string;
      placementDetails?: {
        companyName: string;
        jobPosition: string;
        joiningDate: string;
        salary: string;
        location: string;
        notes?: string;
      };
      notes?: string;
    }
  ) {
    const res = await fetch(`${API_BASE}/students/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; student: Student }>(res);
  },

  // Companies
  async registerCompany(data: {
    companyName: string;
    contactPerson: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    companyAddress: string;
    city?: string;
    state?: string;
    pincode?: string;
    industry: string;
    website?: string;
    description?: string;
    paymentMethod?: string;
    transactionRef?: string;
  }) {
    const res = await fetch(`${API_BASE}/companies/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{
      success: boolean;
      message: string;
      company: Company;
      payment: PaymentRecord;
    }>(res);
  },

  async getCompanies(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/companies?${query}`);
    return handleResponse<{ companies: Company[] }>(res);
  },

  async getCompanyById(id: string) {
    const res = await fetch(`${API_BASE}/companies/${id}`);
    return handleResponse<{ company: Company; requirements: CompanyRequirement[] }>(res);
  },

  async updateCompanyStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/companies/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return handleResponse<{ success: boolean; company: Company }>(res);
  },

  async postCompanyRequirement(data: Partial<CompanyRequirement>) {
    const res = await fetch(`${API_BASE}/companies/requirements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{
      success: boolean;
      message: string;
      requirement: CompanyRequirement;
    }>(res);
  },

  async getAllRequirements(params?: { companyId?: string; status?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/companies/requirements/all?${query}`);
    return handleResponse<{ requirements: CompanyRequirement[] }>(res);
  },

  async updateRequirement(
    id: string,
    data: { status?: string; candidatesProvided?: number; candidatesJoined?: number }
  ) {
    const res = await fetch(`${API_BASE}/companies/requirements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; requirement: CompanyRequirement }>(res);
  },

  async assignCandidateToRequirement(id: string, studentId: string, notes?: string) {
    const res = await fetch(`${API_BASE}/companies/requirements/${id}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, notes }),
    });
    return handleResponse<{ success: boolean; requirement: CompanyRequirement }>(res);
  },

  // Payments
  async getPayments(params?: { type?: string; entityId?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/payments?${query}`);
    return handleResponse<{ payments: PaymentRecord[] }>(res);
  },

  // Admin Dashboard & Reports
  async getAdminDashboardReports() {
    const res = await fetch(`${API_BASE}/reports/dashboard`);
    return handleResponse<{
      kpis: {
        totalCsc: number;
        activeCsc: number;
        pendingCsc: number;
        totalStudents: number;
        newStudents: number;
        ongoingStudents: number;
        getJobStudents: number;
        totalCompanies: number;
        activeCompanies: number;
        totalRequirements: number;
        candidatesRequired: number;
        candidatesProvided: number;
        successfulPlacements: number;
        pendingPayments: number;
        cscRevenue: number;
        companyRevenue: number;
        totalRevenue: number;
      };
      cscBreakdown: Array<{
        id: string;
        centreName: string;
        operatorName: string;
        city: string;
        status: string;
        totalStudents: number;
        ongoingStudents: number;
        gotJobStudents: number;
        totalPaid: number;
      }>;
      recentStudents: Student[];
      recentPayments: PaymentRecord[];
    }>(res);
  },

  // Settings
  async getJobTypes() {
    const res = await fetch(`${API_BASE}/settings/job-types`);
    return handleResponse<{ jobTypes: JobTypeOption[] }>(res);
  },

  async addJobType(name: string, category: string) {
    const res = await fetch(`${API_BASE}/settings/job-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category }),
    });
    return handleResponse<JobTypeOption>(res);
  },

  // Public Contact
  async sendContactMessage(data: { name: string; phone: string; email?: string; subject?: string; message: string }) {
    const res = await fetch(`${API_BASE}/public/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // Reset Demo DB
  async resetDemoData() {
    const res = await fetch(`${API_BASE}/admin/reset-demo-data`, { method: 'POST' });
    return handleResponse<{ success: boolean; message: string }>(res);
  },
};
