export type UserRole = 'admin' | 'csc';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  cscId?: string;
}

export type CSCStatus = 'Pending Approval' | 'Active' | 'Rejected' | 'Suspended';

export interface CSCCentre {
  id: string;
  centreName: string;
  operatorName: string;
  phone: string;
  whatsapp: string;
  email: string;
  officeAddress: string;
  city: string;
  state: string;
  pincode: string;
  username: string;
  password?: string;
  vleId?: string;
  businessInfo?: string;
  status: CSCStatus;
  registeredAt: string;
  approvedAt?: string;
  stats?: {
    totalStudents: number;
    ongoingStudents: number;
    gotJobStudents: number;
    totalAmountPaid: number;
  };
}

export type StudentStatus =
  | 'New'
  | 'Pending'
  | 'Shortlisted'
  | 'Interview'
  | 'Ongoing'
  | 'Get Job'
  | 'Rejected'
  | 'Closed';

export interface PlacementDetails {
  companyName: string;
  jobPosition: string;
  joiningDate: string;
  salary: string;
  location: string;
  notes?: string;
  placedAt: string;
}

export interface StudentHistoryEntry {
  status: StudentStatus;
  updatedAt: string;
  updatedBy: string;
  notes?: string;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  address: string;
  qualification: string;
  experience: string;
  skills: string;
  jobType: string;
  preferredLocation: string;
  expectedSalary: string;
  resumeFileName?: string;
  resumeUrl?: string;
  additionalInfo?: string;
  
  // CSC Source Tracking
  cscId: string;
  cscCentreName: string;
  cscPhone?: string;

  // Payment Tracking
  paymentId: string;
  paymentAmount: number; // Always ₹1,000 per student
  paymentStatus: 'Paid' | 'Pending';
  submissionDate: string;

  // Status & Placement
  status: StudentStatus;
  placementDetails?: PlacementDetails;
  history: StudentHistoryEntry[];
}

export interface NewStudentFormInput {
  name: string;
  phone: string;
  whatsapp: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  address: string;
  qualification: string;
  experience: string;
  skills: string;
  jobType: string;
  preferredLocation: string;
  expectedSalary: string;
  resumeFileName?: string;
  additionalInfo?: string;
}

export interface CSCStudentSubmission {
  id: string;
  cscId: string;
  cscCentreName: string;
  studentCount: number;
  amount: number; // studentCount * 1000
  paymentId: string;
  paymentStatus: 'Paid' | 'Pending';
  studentIds: string[];
  createdAt: string;
}

export type PaymentType = 'CSC_STUDENTS' | 'COMPANY_ANNUAL';
export type PaymentStatus = 'Pending' | 'Processing' | 'Paid' | 'Failed' | 'Refunded';

export interface PaymentRecord {
  id: string;
  type: PaymentType;
  entityId: string; // cscId or companyId
  entityName: string; // cscCentreName or companyName
  contactPhone: string;
  studentCount?: number;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  transactionRef: string;
  createdAt: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  notes?: string;
}

export type CompanyStatus = 'Pending Payment' | 'Payment Received' | 'Pending Approval' | 'Active' | 'Expired' | 'Suspended';

export interface Company {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  whatsapp: string;
  email: string;
  companyAddress: string;
  city: string;
  state: string;
  pincode: string;
  industry: string;
  website?: string;
  description?: string;
  annualFee: number; // Always ₹5,000
  paymentId: string;
  paymentStatus: 'Paid' | 'Pending Payment';
  status: CompanyStatus;
  registrationDate: string;
  expiryDate: string; // 1 year after registration
  requirementsCount: number;
  candidatesRequiredTotal: number;
  candidatesProvidedTotal: number;
  candidatesJoinedTotal: number;
}

export type RequirementStatus = 'New' | 'Active' | 'Partially Filled' | 'Filled' | 'Closed';

export interface CandidateAssignment {
  studentId: string;
  studentName: string;
  phone: string;
  jobType: string;
  cscCentreName: string;
  assignedDate: string;
  status: 'Shortlisted' | 'Interview' | 'Joined' | 'Rejected';
  notes?: string;
}

export interface CompanyRequirement {
  id: string;
  companyId: string;
  companyName: string;
  jobPosition: string;
  candidatesRequired: number;
  candidatesProvided: number;
  candidatesJoined: number;
  genderRequirement: 'Male' | 'Female' | 'Any';
  qualification: string;
  experience: string;
  salary: string;
  jobLocation: string;
  jobType: string;
  joiningTimeline: string;
  description: string;
  status: RequirementStatus;
  createdAt: string;
  candidateAssignments?: CandidateAssignment[];
}

export interface JobTypeOption {
  id: string;
  name: string;
  category: string;
  isActive: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Read' | 'Replied';
}
