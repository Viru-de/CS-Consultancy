import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { NewStudentFormInput } from '../../types/index.ts';
import {
  UserPlus,
  Trash2,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Users,
  ShieldCheck,
  Building2,
  Briefcase,
  FileText,
  DollarSign,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';

interface CSCAddStudentWorkflowProps {
  onSuccessViewRecords: () => void;
}

const DEFAULT_JOB_TYPES = [
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
];

export const CSCAddStudentWorkflow: React.FC<CSCAddStudentWorkflowProps> = ({
  onSuccessViewRecords,
}) => {
  const { user, cscData } = useAuth();
  const cscId = user?.cscId || 'CSC-1001';

  // Batch of students to be submitted together
  const [studentBatch, setStudentBatch] = useState<NewStudentFormInput[]>([]);

  // Current student form state
  const [currentForm, setCurrentForm] = useState<NewStudentFormInput>({
    name: '',
    phone: '',
    whatsapp: '',
    gender: 'Male',
    dob: '2002-01-01',
    address: '',
    qualification: '12th Pass',
    experience: 'Fresher',
    skills: '',
    jobType: 'Electrician',
    preferredLocation: 'Bhilai / Durg',
    expectedSalary: '₹12,000 - ₹15,000',
    resumeFileName: '',
    additionalInfo: '',
  });

  const [customJobType, setCustomJobType] = useState('');
  const [isOtherJobType, setIsOtherJobType] = useState(false);

  // Form validation errors
  const [formError, setFormError] = useState<string | null>(null);

  // Payment checkout states
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'UPI' | 'Netbanking' | 'Card' | 'Gateway'>(
    'UPI'
  );
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Successful submission result
  const [submissionResult, setSubmissionResult] = useState<{
    paymentId: string;
    studentCount: number;
    amountPaid: number;
    studentIds: string[];
  } | null>(null);

  // Price rule: EXACTLY ₹1,000 PER STUDENT (Requirement #8)
  const PRICE_PER_STUDENT = 1000;
  const totalAmount = studentBatch.length * PRICE_PER_STUDENT;

  // Handle current form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'jobType') {
      if (value === 'Other') {
        setIsOtherJobType(true);
      } else {
        setIsOtherJobType(false);
      }
    }
    setCurrentForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add current student into the batch list (+ ADD STUDENT button)
  const handleAddStudentToBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validations (Requirement #26)
    if (!currentForm.name.trim()) {
      setFormError('Student name is required.');
      return;
    }
    if (!currentForm.phone.trim() || currentForm.phone.trim().length < 10) {
      setFormError('Please enter a valid 10-digit phone number.');
      return;
    }
    const finalJobType = isOtherJobType ? customJobType.trim() : currentForm.jobType;
    if (!finalJobType) {
      setFormError('Please select or specify a job type.');
      return;
    }

    const newStudentToAdd: NewStudentFormInput = {
      ...currentForm,
      jobType: finalJobType,
      whatsapp: currentForm.whatsapp.trim() || currentForm.phone.trim(),
    };

    // Add to batch list
    setStudentBatch((prev) => [...prev, newStudentToAdd]);

    // Reset current form for next student entry without losing previously entered students
    setCurrentForm({
      name: '',
      phone: '',
      whatsapp: '',
      gender: 'Male',
      dob: '2002-01-01',
      address: '',
      qualification: '12th Pass',
      experience: 'Fresher',
      skills: '',
      jobType: 'Electrician',
      preferredLocation: 'Bhilai / Durg',
      expectedSalary: '₹12,000 - ₹15,000',
      resumeFileName: '',
      additionalInfo: '',
    });
    setIsOtherJobType(false);
    setCustomJobType('');
  };

  // Remove a student from review table
  const handleRemoveStudent = (indexToRemove: number) => {
    setStudentBatch((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Execute payment and submit batch to backend
  const handleProcessPayment = async () => {
    if (studentBatch.length === 0) return;

    setIsPaying(true);
    setPaymentError(null);

    try {
      const res = await api.submitStudentsBatch({
        cscId,
        students: studentBatch,
        paymentMethod: `Online Gateway (${selectedPaymentMethod} - Live Simulation)`,
        transactionRef: `TXN-CSC-${Date.now()}`,
      });

      setSubmissionResult({
        paymentId: res.paymentId,
        studentCount: res.studentCount,
        amountPaid: res.amountPaid,
        studentIds: res.studentIds,
      });

      // Clear batch
      setStudentBatch([]);
      setIsCheckoutModalOpen(false);
    } catch (err: any) {
      setPaymentError(err.message || 'Payment could not be completed.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* SUCCESS SCREEN AFTER PAYMENT (Requirement #10) */}
      {submissionResult ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-200 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <span>Payment Verified & Submitted</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Payment Successful!
            </h2>
            <p className="text-sm text-slate-600">
              Students Successfully Submitted to CS Consultancy Central Office.
            </p>
          </div>

          {/* Submission Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Payment ID:</span>
              <span className="font-bold text-slate-900 font-mono">{submissionResult.paymentId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Number of Students:</span>
              <span className="font-bold text-slate-900">{submissionResult.studentCount} Students</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Amount Paid:</span>
              <span className="font-extrabold text-emerald-600 text-sm">
                ₹{submissionResult.amountPaid.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Submitting CSC:</span>
              <span className="font-bold text-slate-900">{cscData?.centreName || user?.name}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Assigned Student IDs:</span>
              <span className="font-bold text-slate-700 font-mono text-[11px]">
                {submissionResult.studentIds.join(', ')}
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onSuccessViewRecords}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>View Submitted Student Records</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSubmissionResult(null)}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              + Add More Students
            </button>
          </div>
        </div>
      ) : (
        /* THE WORKFLOW: Multi-Student Entry + Live Review Table + Dynamic Payment Summary */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Student Details Entry Form (6 cols on LG) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Step 1: Enter Student Information
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter candidate profile. Click <strong className="text-slate-900">+ ADD STUDENT</strong> to add multiple candidates into your batch.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    ₹1,000 / Student
                  </span>
                </div>
              </div>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="font-semibold">{formError}</div>
              </div>
            )}

            <form onSubmit={handleAddStudentToBatch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={currentForm.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Kumar"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={currentForm.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98260 XXXXX"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={currentForm.whatsapp}
                    onChange={handleInputChange}
                    placeholder="Leave empty if same"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={currentForm.gender}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={currentForm.dob}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Job Type / Looking For <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="jobType"
                    value={currentForm.jobType}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden font-medium"
                  >
                    {DEFAULT_JOB_TYPES.map((jt) => (
                      <option key={jt} value={jt}>
                        {jt}
                      </option>
                    ))}
                  </select>
                </div>

                {isOtherJobType && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Specify Custom Job Type <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customJobType}
                      onChange={(e) => setCustomJobType(e.target.value)}
                      placeholder="e.g. CNC Operator / Welder"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={currentForm.qualification}
                    onChange={handleInputChange}
                    placeholder="e.g. ITI Electrical, 12th, B.Com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={currentForm.experience}
                    onChange={handleInputChange}
                    placeholder="e.g. Fresher / 1-2 years"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Preferred Location
                  </label>
                  <input
                    type="text"
                    name="preferredLocation"
                    value={currentForm.preferredLocation}
                    onChange={handleInputChange}
                    placeholder="e.g. Bhilai / Durg / Raipur"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Expected Salary
                  </label>
                  <input
                    type="text"
                    name="expectedSalary"
                    value={currentForm.expectedSalary}
                    onChange={handleInputChange}
                    placeholder="e.g. ₹15,000 / month"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Permanent Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={currentForm.address}
                  onChange={handleInputChange}
                  placeholder="Village / Ward, Tehsil, District (e.g. Dhanora, Bhilai)"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Key Technical / Work Skills
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={currentForm.skills}
                    onChange={handleInputChange}
                    placeholder="e.g. House wiring, Panel repair, Typing"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Resume / Document Attachment
                  </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setCurrentForm((prev) => ({
                          ...prev,
                          resumeFileName: e.target.files![0].name,
                        }));
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Additional Notes
                </label>
                <input
                  type="text"
                  name="additionalInfo"
                  value={currentForm.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="e.g. Owns 2-wheeler, ready for immediate joining"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              {/* CLEARLY VISIBLE: + ADD STUDENT BUTTON (Requirement #7) */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <UserPlus className="w-5 h-5 text-white" />
                  <span>+ ADD STUDENT TO BATCH</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Review Table & Live Automatic Payment Calculation (5 cols on LG) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Payment Summary Card (Requirements #8, #9) */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base text-white">Live Payment Calculation</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full">
                  Formula: Students × ₹1,000
                </span>
              </div>

              {/* Live breakdown metrics */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Students in Current Batch:</span>
                  <span className="font-bold text-white text-base">
                    {studentBatch.length} {studentBatch.length === 1 ? 'Student' : 'Students'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Registration Price per Student:</span>
                  <span className="font-semibold text-slate-200">₹1,000</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-300 block">Total Calculated Payment:</span>
                    <span className="text-[11px] text-slate-400">
                      {studentBatch.length > 0
                        ? `${studentBatch.length} × ₹1,000`
                        : 'Add at least 1 student'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-amber-400">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* DYNAMIC PAYMENT BUTTON (Requirement #9) */}
              {/* Must display: Pay ₹1,000, Pay ₹2,000, Pay ₹3,000, etc. dynamically generated! */}
              <button
                type="button"
                disabled={studentBatch.length === 0}
                onClick={() => setIsCheckoutModalOpen(true)}
                className={`w-full py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                  studentBatch.length > 0
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:shadow-amber-400/20 active:scale-[0.98]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <CreditCard className="w-5 h-5 text-slate-950" />
                <span>
                  {studentBatch.length > 0
                    ? `PAY ₹${totalAmount.toLocaleString('en-IN')}`
                    : 'Add Students to Enable Payment'}
                </span>
                {studentBatch.length > 0 && <ArrowRight className="w-5 h-5 text-slate-950" />}
              </button>

              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Server-validated batch submission & instant receipt generation</span>
              </div>
            </div>

            {/* Review Table (Requirement #7) */}
            {/* | S.No | Student Name | Phone | Job Type | Amount | Remove | */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">
                  Batch Review Table ({studentBatch.length})
                </h3>
                {studentBatch.length > 0 && (
                  <button
                    onClick={() => setStudentBatch([])}
                    className="text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {studentBatch.length === 0 ? (
                <div className="py-8 text-center space-y-2 text-slate-400 text-xs">
                  <Users className="w-8 h-8 mx-auto text-slate-300" />
                  <p>No students added to current batch yet.</p>
                  <p className="text-[11px] text-slate-500">
                    Fill the form on the left and click <strong>&quot;+ ADD STUDENT TO BATCH&quot;</strong>.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="pb-2">S.No</th>
                        <th className="pb-2">Student Name</th>
                        <th className="pb-2">Phone</th>
                        <th className="pb-2">Job Type</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2 text-right">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentBatch.map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 font-bold text-slate-500">{idx + 1}</td>
                          <td className="py-2.5 font-bold text-slate-900">{s.name}</td>
                          <td className="py-2.5 text-slate-600">{s.phone}</td>
                          <td className="py-2.5 text-slate-800 font-medium">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              {s.jobType}
                            </span>
                          </td>
                          <td className="py-2.5 font-bold text-emerald-600">₹1,000</td>
                          <td className="py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveStudent(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                              title="Remove student from batch"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL (Requirement #9) */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Student Registration Payment</h3>
                <p className="text-xs text-slate-400">Complete batch payment for {studentBatch.length} students</p>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {paymentError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>{paymentError}</div>
                </div>
              )}

              {/* Order Breakdown Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Submitting CSC:</span>
                  <span className="font-bold text-slate-900">{cscData?.centreName || user?.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Number of Students:</span>
                  <span className="font-bold text-slate-900">{studentBatch.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Price per Student:</span>
                  <span className="font-bold text-slate-900">₹1,000</span>
                </div>
                <div className="flex justify-between py-1 pt-2 items-center">
                  <span className="text-slate-700 font-bold text-sm">Total Amount:</span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Payment Architecture Options */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Payment Method (Indian PG / Razorpay Architecture)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / QR Code', sub: 'PhonePe, GPay, Paytm' },
                    { id: 'Netbanking', label: 'Net Banking', sub: 'SBI, HDFC, ICICI, PNB' },
                    { id: 'Card', label: 'Debit / Credit Card', sub: 'RuPay, Visa, Master' },
                    { id: 'Gateway', label: 'Razorpay PG Direct', sub: 'All Indian gateways' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedPaymentMethod === m.id
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{m.label}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          selectedPaymentMethod === m.id ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {m.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pay Button inside Modal */}
              <button
                type="button"
                disabled={isPaying}
                onClick={handleProcessPayment}
                className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isPaying ? (
                  <span>Verifying & Submitting Batch...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-slate-950" />
                    <span>CONFIRM & PAY ₹{totalAmount.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
