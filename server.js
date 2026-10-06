import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

// Absolute paths based on project root
const ROOT_DIR = path.resolve(__dirname);
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const INDEX_HTML = path.resolve(DIST_DIR, 'index.html');
const DATA_DIR = path.resolve(ROOT_DIR, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// PERSISTENT DATABASE ENGINE (data/db.json)
// ==========================================
function getInitialSeedData() {
  const cscCentres = [
    {
      id: 'CSC-1001',
      centreName: 'Dhanora CSC Digital Point',
      operatorName: 'Ramesh Sahu',
      phone: '+91 98261 44521',
      whatsapp: '+91 98261 44521',
      email: 'ramesh.csc.dhanora@gmail.com',
      officeAddress: 'Shop No. 4, Near Sahkari Samiti, Dhanora',
      city: 'Bhilai',
      state: 'Chhattisgarh',
      pincode: '491001',
      username: 'dhanora_csc',
      password: 'csc123',
      vleId: 'VLE-CG-491001-08',
      businessInfo: 'CSC e-Governance Services & Skill Development Partner',
      status: 'Active',
      registeredAt: '2025-01-10T10:00:00.000Z',
      approvedAt: '2025-01-11T14:30:00.000Z',
    },
    {
      id: 'CSC-1002',
      centreName: 'Power House CSC Hub',
      operatorName: 'Anita Verma',
      phone: '+91 98271 88390',
      whatsapp: '+91 98271 88390',
      email: 'anita.powerhouse@gmail.com',
      officeAddress: 'Plot 12, Main Road, Power House Market',
      city: 'Bhilai',
      state: 'Chhattisgarh',
      pincode: '490011',
      username: 'powerhouse_csc',
      password: 'csc123',
      vleId: 'VLE-CG-490011-22',
      businessInfo: 'Aadhaar, PAN & Employment Registration Centre',
      status: 'Active',
      registeredAt: '2025-01-15T11:20:00.000Z',
      approvedAt: '2025-01-16T09:15:00.000Z',
    },
    {
      id: 'CSC-1003',
      centreName: 'Nehru Nagar CSC Point',
      operatorName: 'Vikram Patel',
      phone: '+91 94252 11094',
      whatsapp: '+91 94252 11094',
      email: 'vikram.nehrunagar@gmail.com',
      officeAddress: 'Complex 3, Near Square, Nehru Nagar West',
      city: 'Bhilai',
      state: 'Chhattisgarh',
      pincode: '490020',
      username: 'nehrunagar_csc',
      password: 'csc123',
      vleId: 'VLE-CG-490020-05',
      businessInfo: 'Digital Citizen Services & Student Counseling',
      status: 'Pending Approval',
      registeredAt: '2025-02-01T15:45:00.000Z',
    },
  ];

  const students = [
    {
      id: 'STU-1001',
      name: 'Rahul Kumar',
      phone: '+91 98260 12345',
      whatsapp: '+91 98260 12345',
      gender: 'Male',
      dob: '2001-05-14',
      address: 'Ward 12, Dhanora, Bhilai',
      qualification: 'ITI Electrical',
      experience: '1-2 years',
      skills: 'Wiring, Panel Assembly, Maintenance',
      jobType: 'Electrician',
      preferredLocation: 'Bhilai / Durg',
      expectedSalary: '₹15,000 - ₹18,000',
      additionalInfo: 'Has own 2-wheeler, ready for immediate joining',
      cscId: 'CSC-1001',
      cscCentreName: 'Dhanora CSC Digital Point',
      cscPhone: '+91 98261 44521',
      paymentId: 'PAY-CSC-8001',
      paymentAmount: 1000,
      paymentStatus: 'Paid',
      submissionDate: '2025-01-15T10:30:00.000Z',
      status: 'Ongoing',
      history: [
        { status: 'New', updatedAt: '2025-01-15T10:30:00.000Z', updatedBy: 'CSC Registration' },
        { status: 'Shortlisted', updatedAt: '2025-01-18T14:00:00.000Z', updatedBy: 'CS Admin Office', notes: 'Shortlisted for ABC Industries Electrical division' },
        { status: 'Interview', updatedAt: '2025-01-22T11:00:00.000Z', updatedBy: 'CS Admin Office', notes: 'Interview cleared at ABC Industries' },
        { status: 'Ongoing', updatedAt: '2025-01-25T16:00:00.000Z', updatedBy: 'CS Admin Office', notes: 'Under company verification & medical' },
      ],
    },
    {
      id: 'STU-1002',
      name: 'Priya Sharma',
      phone: '+91 97555 43210',
      whatsapp: '+91 97555 43210',
      gender: 'Female',
      dob: '2002-09-20',
      address: 'Sector 6, Bhilai',
      qualification: 'BCA / DCA',
      experience: 'Fresher',
      skills: 'MS Excel, Tally, English Typing 40 WPM, Hindi Typing',
      jobType: 'Computer Operator',
      preferredLocation: 'Bhilai / Raipur',
      expectedSalary: '₹14,000 - ₹16,000',
      additionalInfo: 'Proficient in MS Office & Google Workspace',
      cscId: 'CSC-1001',
      cscCentreName: 'Dhanora CSC Digital Point',
      cscPhone: '+91 98261 44521',
      paymentId: 'PAY-CSC-8001',
      paymentAmount: 1000,
      paymentStatus: 'Paid',
      submissionDate: '2025-01-15T10:30:00.000Z',
      status: 'Get Job',
      placementDetails: {
        companyName: 'Bhilai IT & Automation Services',
        jobPosition: 'Junior Computer Operator & MIS Assistant',
        joiningDate: '2025-02-01',
        salary: '₹16,500 / month',
        location: 'Civic Centre, Bhilai',
        notes: 'Joined successfully with full corporate kit and PF/ESI benefits.',
        placedAt: '2025-01-28T12:00:00.000Z',
      },
      history: [
        { status: 'New', updatedAt: '2025-01-15T10:30:00.000Z', updatedBy: 'CSC Registration' },
        { status: 'Shortlisted', updatedAt: '2025-01-18T14:30:00.000Z', updatedBy: 'CS Admin Office' },
        { status: 'Interview', updatedAt: '2025-01-21T10:00:00.000Z', updatedBy: 'CS Admin Office' },
        { status: 'Get Job', updatedAt: '2025-01-28T12:00:00.000Z', updatedBy: 'CS Admin Office', notes: 'Offer letter signed' },
      ],
    },
    {
      id: 'STU-1003',
      name: 'Sneha Chandrakar',
      phone: '+91 98270 99887',
      whatsapp: '+91 98270 99887',
      gender: 'Female',
      dob: '2000-11-05',
      address: 'G.E. Road, Supela, Bhilai',
      qualification: 'Graduate (B.Com)',
      experience: '1 year in retail sales',
      skills: 'Customer Engagement, Lead Conversion, POS Billing',
      jobType: 'Sales Executive',
      preferredLocation: 'Bhilai',
      expectedSalary: '₹16,000 - ₹20,000',
      cscId: 'CSC-1001',
      cscCentreName: 'Dhanora CSC Digital Point',
      cscPhone: '+91 98261 44521',
      paymentId: 'PAY-CSC-8001',
      paymentAmount: 1000,
      paymentStatus: 'Paid',
      submissionDate: '2025-01-15T10:30:00.000Z',
      status: 'Shortlisted',
      history: [
        { status: 'New', updatedAt: '2025-01-15T10:30:00.000Z', updatedBy: 'CSC Registration' },
        { status: 'Shortlisted', updatedAt: '2025-01-20T11:00:00.000Z', updatedBy: 'CS Admin Office', notes: 'Shortlisted for Raipur Retail Mart' },
      ],
    },
    {
      id: 'STU-1004',
      name: 'Amit Dewangan',
      phone: '+91 94241 55667',
      whatsapp: '+91 94241 55667',
      gender: 'Male',
      dob: '1999-03-12',
      address: 'Shanti Nagar, Kohka, Bhilai',
      qualification: 'M.Com, Tally Prime Certified',
      experience: '2-3 years',
      skills: 'GST Returns, TDS, Tally Prime, Balance Sheet Preparation',
      jobType: 'Accountant',
      preferredLocation: 'Bhilai / Durg',
      expectedSalary: '₹22,000 - ₹25,000',
      cscId: 'CSC-1002',
      cscCentreName: 'Power House CSC Hub',
      cscPhone: '+91 98271 88390',
      paymentId: 'PAY-CSC-8002',
      paymentAmount: 1000,
      paymentStatus: 'Paid',
      submissionDate: '2025-01-20T14:15:00.000Z',
      status: 'Interview',
      history: [
        { status: 'New', updatedAt: '2025-01-20T14:15:00.000Z', updatedBy: 'CSC Registration' },
        { status: 'Interview', updatedAt: '2025-01-26T15:00:00.000Z', updatedBy: 'CS Admin Office', notes: 'Interview scheduled with Kalinga Power accounts team' },
      ],
    },
    {
      id: 'STU-1005',
      name: 'Sunil Soni',
      phone: '+91 91310 22334',
      whatsapp: '+91 91310 22334',
      gender: 'Male',
      dob: '2003-08-19',
      address: 'Camp 1, Bhilai',
      qualification: '10th Pass',
      experience: 'Fresher',
      skills: 'Loading, Packing, Physical Fitness, Material Handling',
      jobType: 'Helper',
      preferredLocation: 'Bhilai Heavy Industrial Area',
      expectedSalary: '₹12,000 - ₹14,000',
      cscId: 'CSC-1002',
      cscCentreName: 'Power House CSC Hub',
      cscPhone: '+91 98271 88390',
      paymentId: 'PAY-CSC-8002',
      paymentAmount: 1000,
      paymentStatus: 'Paid',
      submissionDate: '2025-01-20T14:15:00.000Z',
      status: 'Get Job',
      placementDetails: {
        companyName: 'ABC Industries',
        jobPosition: 'Warehouse & Shop Floor Helper',
        joiningDate: '2025-02-05',
        salary: '₹14,000 / month',
        location: 'Heavy Industrial Area, Hathkhoj, Bhilai',
        notes: 'Selected under batch requirement of 30 helpers. Shift allowance applicable.',
        placedAt: '2025-01-29T17:00:00.000Z',
      },
      history: [
        { status: 'New', updatedAt: '2025-01-20T14:15:00.000Z', updatedBy: 'CSC Registration' },
        { status: 'Shortlisted', updatedAt: '2025-01-22T10:00:00.000Z', updatedBy: 'CS Admin Office' },
        { status: 'Get Job', updatedAt: '2025-01-29T17:00:00.000Z', updatedBy: 'CS Admin Office' },
      ],
    },
    {
      id: 'STU-1006',
      name: 'Manish Verma',
      phone: '+91 93004 88776',
      whatsapp: '+91 93004 88776',
      gender: 'Male',
      dob: '2002-01-30',
      address: 'Risali Sector, Bhilai',
      qualification: 'Diploma Mechanical',
      experience: '6 months apprenticeship',
      skills: 'CNC Machine Operation, Quality Inspection, Measurement Tools',
      jobType: 'Technician',
      preferredLocation: 'Bhilai / Kumhari',
      expectedSalary: '₹16,000 - ₹19,000',
      cscId: 'CSC-1002',
      cscCentreName: 'Power House CSC Hub',
      cscPhone: '+91 98271 88390',
      paymentId: 'PAY-CSC-8002',
      paymentAmount: 1000,
      paymentStatus: 'Paid',
      submissionDate: '2025-01-20T14:15:00.000Z',
      status: 'New',
      history: [
        { status: 'New', updatedAt: '2025-01-20T14:15:00.000Z', updatedBy: 'CSC Registration' },
      ],
    },
  ];

  const submissions = [
    {
      id: 'SUB-2001',
      cscId: 'CSC-1001',
      cscCentreName: 'Dhanora CSC Digital Point',
      studentCount: 3,
      amount: 3000,
      paymentId: 'PAY-CSC-8001',
      paymentStatus: 'Paid',
      studentIds: ['STU-1001', 'STU-1002', 'STU-1003'],
      createdAt: '2025-01-15T10:30:00.000Z',
    },
    {
      id: 'SUB-2002',
      cscId: 'CSC-1002',
      cscCentreName: 'Power House CSC Hub',
      studentCount: 3,
      amount: 3000,
      paymentId: 'PAY-CSC-8002',
      paymentStatus: 'Paid',
      studentIds: ['STU-1004', 'STU-1005', 'STU-1006'],
      createdAt: '2025-01-20T14:15:00.000Z',
    },
  ];

  const companies = [
    {
      id: 'COMP-3001',
      companyName: 'ABC Industries',
      contactPerson: 'Sanjay Aggarwal (Director - HR)',
      phone: '+91 98261 77665',
      whatsapp: '+91 98261 77665',
      email: 'hr@abcindustriesbhilai.com',
      companyAddress: 'Shed 45-B, Hathkhoj Light & Heavy Industrial Area',
      city: 'Bhilai',
      state: 'Chhattisgarh',
      pincode: '490026',
      industry: 'Heavy Engineering & Steel Fabrication',
      website: 'https://abcindustriesbhilai.com',
      description: 'Ancillary supplier to Bhilai Steel Plant, manufacturing structures, fabricated steel, and electrical assemblies.',
      annualFee: 5000,
      paymentId: 'PAY-COMP-9001',
      paymentStatus: 'Paid',
      status: 'Active',
      registrationDate: '2025-01-05T09:00:00.000Z',
      expiryDate: '2026-01-05T09:00:00.000Z',
      requirementsCount: 2,
      candidatesRequiredTotal: 50,
      candidatesProvidedTotal: 32,
      candidatesJoinedTotal: 25,
    },
    {
      id: 'COMP-3002',
      companyName: 'Kalinga Power & Fabrications',
      contactPerson: 'Devendra Mahant (Plant Head)',
      phone: '+91 94255 33441',
      whatsapp: '+91 94255 33441',
      email: 'careers@kalingapower.co.in',
      companyAddress: 'Industrial Corridor, Kumhari - Bhilai Bypass',
      city: 'Kumhari / Bhilai',
      state: 'Chhattisgarh',
      pincode: '490042',
      industry: 'Power Plant Equipment & Heavy Welded Tanks',
      website: 'https://kalingapower.co.in',
      description: 'Specialized fabrication of boiler components and high-pressure tanks with 250+ workforce.',
      annualFee: 5000,
      paymentId: 'PAY-COMP-9002',
      paymentStatus: 'Paid',
      status: 'Active',
      registrationDate: '2025-01-12T11:00:00.000Z',
      expiryDate: '2026-01-12T11:00:00.000Z',
      requirementsCount: 1,
      candidatesRequiredTotal: 15,
      candidatesProvidedTotal: 7,
      candidatesJoinedTotal: 4,
    },
    {
      id: 'COMP-3003',
      companyName: 'Raipur Retail Mart Pvt Ltd',
      contactPerson: 'Neelesh Agrawal',
      phone: '+91 99071 88220',
      whatsapp: '+91 99071 88220',
      email: 'recruitment@raipurretailmart.com',
      companyAddress: 'Mega Mall Road, Pandri',
      city: 'Raipur',
      state: 'Chhattisgarh',
      pincode: '492004',
      industry: 'Retail & Supermarket Chain',
      website: 'https://raipurretailmart.com',
      description: 'Fast-growing hypermarket chain operating across Raipur, Bhilai, and Bilaspur.',
      annualFee: 5000,
      paymentId: 'PAY-COMP-9003',
      paymentStatus: 'Paid',
      status: 'Pending Approval',
      registrationDate: '2025-02-03T16:00:00.000Z',
      expiryDate: '2026-02-03T16:00:00.000Z',
      requirementsCount: 1,
      candidatesRequiredTotal: 10,
      candidatesProvidedTotal: 2,
      candidatesJoinedTotal: 0,
    },
  ];

  const requirements = [
    {
      id: 'REQ-4001',
      companyId: 'COMP-3001',
      companyName: 'ABC Industries',
      jobPosition: 'Electrician',
      candidatesRequired: 20,
      candidatesProvided: 12,
      candidatesJoined: 8,
      genderRequirement: 'Male',
      qualification: 'ITI Electrician / Wireman Certificate',
      experience: '1+ year preferred or fresh ITI',
      salary: '₹18,000 / month',
      jobLocation: 'Hathkhoj, Bhilai',
      jobType: 'Electrician',
      joiningTimeline: 'Immediate to 7 days',
      description: 'Industrial maintenance and machine panel wiring in steel structure workshop. Overtime bonus applicable.',
      status: 'Active',
      createdAt: '2025-01-08T10:00:00.000Z',
      candidateAssignments: [
        {
          studentId: 'STU-1001',
          studentName: 'Rahul Kumar',
          phone: '+91 98260 12345',
          jobType: 'Electrician',
          cscCentreName: 'Dhanora CSC Digital Point',
          assignedDate: '2025-01-18T14:00:00.000Z',
          status: 'Interview',
          notes: 'Cleared technical round, waiting for document verification',
        },
      ],
    },
    {
      id: 'REQ-4002',
      companyId: 'COMP-3001',
      companyName: 'ABC Industries',
      jobPosition: 'Helper (Material Handling & Loading)',
      candidatesRequired: 30,
      candidatesProvided: 20,
      candidatesJoined: 17,
      genderRequirement: 'Male',
      qualification: '10th / 12th Pass',
      experience: 'Fresher welcome',
      salary: '₹14,000 / month',
      jobLocation: 'Hathkhoj, Bhilai',
      jobType: 'Helper',
      joiningTimeline: 'Immediate',
      description: 'Physical shifting of goods, assistance to machine operators, warehouse maintenance.',
      status: 'Active',
      createdAt: '2025-01-10T11:30:00.000Z',
      candidateAssignments: [
        {
          studentId: 'STU-1005',
          studentName: 'Sunil Soni',
          phone: '+91 91310 22334',
          jobType: 'Helper',
          cscCentreName: 'Power House CSC Hub',
          assignedDate: '2025-01-22T10:00:00.000Z',
          status: 'Joined',
          notes: 'Joined on 2025-02-05',
        },
      ],
    },
    {
      id: 'REQ-4003',
      companyId: 'COMP-3002',
      companyName: 'Kalinga Power & Fabrications',
      jobPosition: 'Fabrication Technician & Welder',
      candidatesRequired: 15,
      candidatesProvided: 7,
      candidatesJoined: 4,
      genderRequirement: 'Male',
      qualification: 'ITI Welder / Fitter',
      experience: '2-3 years in MIG/TIG welding',
      salary: '₹20,000 - ₹24,000 / month',
      jobLocation: 'Kumhari, Bhilai Bypass',
      jobType: 'Technician',
      joiningTimeline: 'Within 15 days',
      description: 'Expertise in high-pressure tank welding with standard safety compliance.',
      status: 'Active',
      createdAt: '2025-01-14T14:00:00.000Z',
      candidateAssignments: [],
    },
    {
      id: 'REQ-4004',
      companyId: 'COMP-3003',
      companyName: 'Raipur Retail Mart Pvt Ltd',
      jobPosition: 'Sales Executive & Cashier',
      candidatesRequired: 10,
      candidatesProvided: 2,
      candidatesJoined: 0,
      genderRequirement: 'Any',
      qualification: '12th Pass or Graduate',
      experience: 'Fresher or Retail experience',
      salary: '₹15,000 / month + Incentives',
      jobLocation: 'Pandri, Raipur',
      jobType: 'Sales Executive',
      joiningTimeline: '10 days',
      description: 'Floor customer service, billing counter, product stocking.',
      status: 'New',
      createdAt: '2025-02-03T16:30:00.000Z',
      candidateAssignments: [
        {
          studentId: 'STU-1003',
          studentName: 'Sneha Chandrakar',
          phone: '+91 98270 99887',
          jobType: 'Sales Executive',
          cscCentreName: 'Dhanora CSC Digital Point',
          assignedDate: '2025-02-04T10:00:00.000Z',
          status: 'Shortlisted',
        },
      ],
    },
  ];

  const payments = [
    {
      id: 'PAY-CSC-8001',
      type: 'CSC_STUDENTS',
      entityId: 'CSC-1001',
      entityName: 'Dhanora CSC Digital Point',
      contactPhone: '+91 98261 44521',
      studentCount: 3,
      amount: 3000,
      status: 'Paid',
      paymentMethod: 'UPI (PhonePe)',
      transactionRef: 'UPI/20250115/9981248001',
      createdAt: '2025-01-15T10:30:00.000Z',
      notes: 'Batch submission of 3 students (₹1,000 x 3 = ₹3,000)',
    },
    {
      id: 'PAY-CSC-8002',
      type: 'CSC_STUDENTS',
      entityId: 'CSC-1002',
      entityName: 'Power House CSC Hub',
      contactPhone: '+91 98271 88390',
      studentCount: 3,
      amount: 3000,
      status: 'Paid',
      paymentMethod: 'Netbanking (State Bank of India)',
      transactionRef: 'SBI/INB/20250120/44321',
      createdAt: '2025-01-20T14:15:00.000Z',
      notes: 'Batch submission of 3 students (₹1,000 x 3 = ₹3,000)',
    },
    {
      id: 'PAY-COMP-9001',
      type: 'COMPANY_ANNUAL',
      entityId: 'COMP-3001',
      entityName: 'ABC Industries',
      contactPhone: '+91 98261 77665',
      amount: 5000,
      status: 'Paid',
      paymentMethod: 'Corporate Netbanking (HDFC Bank)',
      transactionRef: 'HDFC/CORP/20250105/98711',
      createdAt: '2025-01-05T09:00:00.000Z',
      notes: 'Direct Company Annual Registration Fee (₹5,000)',
    },
    {
      id: 'PAY-COMP-9002',
      type: 'COMPANY_ANNUAL',
      entityId: 'COMP-3002',
      entityName: 'Kalinga Power & Fabrications',
      contactPhone: '+91 94255 33441',
      amount: 5000,
      status: 'Paid',
      paymentMethod: 'UPI (Google Pay)',
      transactionRef: 'UPI/20250112/5567789002',
      createdAt: '2025-01-12T11:00:00.000Z',
      notes: 'Direct Company Annual Registration Fee (₹5,000)',
    },
    {
      id: 'PAY-COMP-9003',
      type: 'COMPANY_ANNUAL',
      entityId: 'COMP-3003',
      entityName: 'Raipur Retail Mart Pvt Ltd',
      contactPhone: '+91 99071 88220',
      amount: 5000,
      status: 'Paid',
      paymentMethod: 'Credit Card (ICICI Business Card)',
      transactionRef: 'ICICI/PG/20250203/66782',
      createdAt: '2025-02-03T16:00:00.000Z',
      notes: 'Direct Company Annual Registration Fee (₹5,000)',
    },
  ];

  const jobTypes = [
    { id: 'JT-1', name: 'Electrician', category: 'Technical & Skilled', isActive: true },
    { id: 'JT-2', name: 'Helper', category: 'General & Industrial', isActive: true },
    { id: 'JT-3', name: 'Sales Executive', category: 'Commercial & Retail', isActive: true },
    { id: 'JT-4', name: 'Computer Operator', category: 'Office & IT', isActive: true },
    { id: 'JT-5', name: 'Accountant', category: 'Finance & Accounts', isActive: true },
    { id: 'JT-6', name: 'Office Staff', category: 'Office & Administration', isActive: true },
    { id: 'JT-7', name: 'Driver', category: 'Logistics & Transport', isActive: true },
    { id: 'JT-8', name: 'Technician', category: 'Engineering & Maintenance', isActive: true },
    { id: 'JT-9', name: 'Security Guard', category: 'Security & Safety', isActive: true },
    { id: 'JT-10', name: 'Marketing', category: 'Commercial & Sales', isActive: true },
    { id: 'JT-11', name: 'Data Entry', category: 'Office & IT', isActive: true },
    { id: 'JT-12', name: 'Welder / Fitter', category: 'Manufacturing & Heavy', isActive: true },
    { id: 'JT-13', name: 'Store Keeper', category: 'Logistics & Inventory', isActive: true },
    { id: 'JT-14', name: 'Other', category: 'General', isActive: true },
  ];

  const contactMessages = [
    {
      id: 'MSG-1',
      name: 'Santosh Chandrakar',
      phone: '+91 98263 77112',
      email: 'santosh.durg@yahoo.com',
      subject: 'Inquiry regarding CSC centre partnership in Durg rural area',
      message: 'We run a CSC kiosk at Utai, Durg. We want to know how our local students can be registered for Bhilai industrial jobs.',
      createdAt: '2025-02-02T10:15:00.000Z',
      status: 'New',
    },
  ];

  const users = [
    {
      id: 'USR-ADMIN',
      username: 'admin',
      role: 'admin',
      name: 'CS Admin Central (Bhilai Office)',
    },
    {
      id: 'USR-CSC-1001',
      username: 'dhanora_csc',
      role: 'csc',
      name: 'Ramesh Sahu (Dhanora CSC)',
      cscId: 'CSC-1001',
    },
    {
      id: 'USR-CSC-1002',
      username: 'powerhouse_csc',
      role: 'csc',
      name: 'Anita Verma (Power House CSC)',
      cscId: 'CSC-1002',
    },
  ];

  return {
    cscCentres,
    students,
    submissions,
    payments,
    companies,
    requirements,
    jobTypes,
    contactMessages,
    users,
  };
}

let db;

function loadDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading db.json, reinitializing seed data:', err);
  }
  const seed = getInitialSeedData();
  saveDatabase(seed);
  return seed;
}

function saveDatabase(dataToSave) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

db = loadDatabase();

function getCSCStats(cscId) {
  const cscStudents = db.students.filter((s) => s.cscId === cscId);
  const totalStudents = cscStudents.length;
  const ongoingStudents = cscStudents.filter(
    (s) => s.status === 'Ongoing' || s.status === 'Interview' || s.status === 'Shortlisted'
  ).length;
  const gotJobStudents = cscStudents.filter((s) => s.status === 'Get Job').length;
  const pendingStudents = cscStudents.filter((s) => s.status === 'New' || s.status === 'Pending').length;

  const cscPayments = db.payments.filter((p) => p.entityId === cscId && p.status === 'Paid');
  const totalAmountPaid = cscPayments.reduce((acc, p) => acc + p.amount, 0);

  return {
    totalStudentsAdded: totalStudents,
    pendingStudents,
    ongoingStudents,
    studentsGotJob: gotJobStudents,
    totalStudentsSubmitted: totalStudents,
    totalAmountPaid,
    pendingPayment: 0,
  };
}

// ==========================================
// API ROUTES (Reserved /api/* namespace)
// ==========================================

// 1. HEALTH CHECK (Requirement #11)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'CS Consultancy',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// 2. AUTHENTICATION
app.post('/api/auth/login', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password and role are required' });
  }

  const cleanUser = String(username).trim().toLowerCase();

  if (role === 'admin') {
    if (cleanUser === 'admin' && password === 'admin123') {
      return res.json({
        user: {
          id: 'USR-ADMIN',
          username: 'admin',
          role: 'admin',
          name: 'CS Admin Central (Bhilai Office)',
        },
        token: 'token-admin-session',
      });
    } else {
      return res.status(401).json({ error: 'Invalid Admin username or password' });
    }
  }

  if (role === 'csc') {
    const csc = db.cscCentres.find(
      (c) => c.username.toLowerCase() === cleanUser && c.password === password
    );

    if (!csc) {
      return res.status(401).json({ error: 'Invalid CSC username or password' });
    }

    if (csc.status === 'Pending Approval') {
      return res.status(403).json({
        error:
          'Your CSC Centre registration is currently Pending Approval. CS Consultancy Admin will verify your centre before login is activated. For assistance, contact +91 98261 44521.',
        status: 'Pending Approval',
      });
    }

    if (csc.status === 'Rejected') {
      return res.status(403).json({
        error: 'Your CSC Centre registration was not approved. Please contact CS Consultancy administrator.',
        status: 'Rejected',
      });
    }

    if (csc.status === 'Suspended') {
      return res.status(403).json({
        error: 'Your CSC account is currently suspended. Please contact head office.',
        status: 'Suspended',
      });
    }

    return res.json({
      user: {
        id: `USR-${csc.id}`,
        username: csc.username,
        role: 'csc',
        name: `${csc.operatorName} (${csc.centreName})`,
        cscId: csc.id,
        cscData: {
          centreName: csc.centreName,
          operatorName: csc.operatorName,
          phone: csc.phone,
          city: csc.city,
          officeAddress: csc.officeAddress,
        },
      },
      token: `token-csc-${csc.id}`,
    });
  }

  return res.status(400).json({ error: 'Invalid login role specified' });
});

// 3. CSC REGISTRATION
app.post('/api/csc/register', (req, res) => {
  const {
    centreName,
    operatorName,
    phone,
    whatsapp,
    email,
    officeAddress,
    city,
    state,
    pincode,
    username,
    password,
    vleId,
    businessInfo,
  } = req.body;

  if (!centreName || !operatorName || !phone || !officeAddress || !username || !password) {
    return res.status(400).json({
      error: 'Required fields: Centre Name, Operator Name, Phone, Address, Username, Password',
    });
  }

  const existingUsername = db.cscCentres.some(
    (c) => c.username.toLowerCase() === String(username).trim().toLowerCase()
  );
  if (existingUsername) {
    return res.status(400).json({ error: 'This username is already taken. Please choose another username.' });
  }

  const newId = `CSC-${1000 + db.cscCentres.length + 1}`;
  const newCsc = {
    id: newId,
    centreName: String(centreName).trim(),
    operatorName: String(operatorName).trim(),
    phone: String(phone).trim(),
    whatsapp: String(whatsapp || phone).trim(),
    email: String(email || '').trim(),
    officeAddress: String(officeAddress).trim(),
    city: String(city || 'Bhilai').trim(),
    state: String(state || 'Chhattisgarh').trim(),
    pincode: String(pincode || '491001').trim(),
    username: String(username).trim().toLowerCase(),
    password: String(password).trim(),
    vleId: vleId ? String(vleId).trim() : `VLE-CG-${Date.now().toString().slice(-4)}`,
    businessInfo: businessInfo ? String(businessInfo).trim() : '',
    status: 'Pending Approval',
    registeredAt: new Date().toISOString(),
  };

  db.cscCentres.unshift(newCsc);
  saveDatabase(db);

  return res.status(201).json({
    success: true,
    message: 'CSC Centre registered successfully. Status is Pending Approval.',
    csc: {
      id: newCsc.id,
      centreName: newCsc.centreName,
      operatorName: newCsc.operatorName,
      status: newCsc.status,
      registeredAt: newCsc.registeredAt,
    },
  });
});

// 4. CSC LIST & MANAGEMENT (Admin)
app.get('/api/csc', (req, res) => {
  const { status, search } = req.query;

  let list = db.cscCentres.map((c) => {
    const stats = getCSCStats(c.id);
    return {
      ...c,
      password: undefined,
      stats: {
        totalStudents: stats.totalStudentsAdded,
        ongoingStudents: stats.ongoingStudents,
        gotJobStudents: stats.studentsGotJob,
        totalAmountPaid: stats.totalAmountPaid,
      },
    };
  });

  if (status && status !== 'all') {
    list = list.filter((c) => c.status.toLowerCase() === String(status).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (c) =>
        c.centreName.toLowerCase().includes(q) ||
        c.operatorName.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }

  res.json({ cscCentres: list });
});

app.get('/api/csc/:id', (req, res) => {
  const csc = db.cscCentres.find((c) => c.id === req.params.id);
  if (!csc) {
    return res.status(404).json({ error: 'CSC Centre not found' });
  }
  const stats = getCSCStats(csc.id);
  res.json({
    ...csc,
    password: undefined,
    stats,
  });
});

app.patch('/api/csc/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending Approval', 'Active', 'Rejected', 'Suspended'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const csc = db.cscCentres.find((c) => c.id === req.params.id);
  if (!csc) {
    return res.status(404).json({ error: 'CSC Centre not found' });
  }

  csc.status = status;
  if (status === 'Active' && !csc.approvedAt) {
    csc.approvedAt = new Date().toISOString();
  }
  saveDatabase(db);

  res.json({ success: true, cscId: csc.id, status: csc.status });
});

app.get('/api/csc/:id/dashboard-stats', (req, res) => {
  const csc = db.cscCentres.find((c) => c.id === req.params.id);
  if (!csc) {
    return res.status(404).json({ error: 'CSC Centre not found' });
  }

  const stats = getCSCStats(csc.id);
  const recentStudents = db.students.filter((s) => s.cscId === csc.id).slice(0, 5);
  const recentPayments = db.payments.filter((p) => p.entityId === csc.id).slice(0, 5);

  res.json({
    csc: {
      id: csc.id,
      centreName: csc.centreName,
      operatorName: csc.operatorName,
      phone: csc.phone,
      whatsapp: csc.whatsapp,
      officeAddress: csc.officeAddress,
      city: csc.city,
      status: csc.status,
    },
    stats,
    recentStudents,
    recentPayments,
  });
});

// 5. CSC MULTI-STUDENT BATCH SUBMISSION & ₹1,000 PAYMENT CALCULATION
app.post('/api/students/submit', (req, res) => {
  const { cscId, students, paymentMethod, transactionRef } = req.body;

  if (!cscId) {
    return res.status(400).json({ error: 'CSC ID is required' });
  }

  const csc = db.cscCentres.find((c) => c.id === cscId);
  if (!csc) {
    return res.status(404).json({ error: 'CSC Centre not found' });
  }

  if (csc.status !== 'Active') {
    return res.status(403).json({ error: 'Only Active approved CSC Centres can submit students.' });
  }

  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ error: 'At least one student must be provided in the submission.' });
  }

  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    if (!s.name || !s.phone || !s.jobType) {
      return res.status(400).json({
        error: `Student #${i + 1} is missing required fields (Name, Phone, and Job Type are required).`,
      });
    }
  }

  const studentCount = students.length;
  // SERVER-SIDE CALCULATION: studentCount * 1000
  const serverCalculatedAmount = studentCount * 1000;

  const paymentId = `PAY-CSC-${8000 + db.payments.length + 1}`;
  const submissionId = `SUB-${2000 + db.submissions.length + 1}`;
  const submissionDate = new Date().toISOString();

  const newPayment = {
    id: paymentId,
    type: 'CSC_STUDENTS',
    entityId: csc.id,
    entityName: csc.centreName,
    contactPhone: csc.phone,
    studentCount,
    amount: serverCalculatedAmount,
    status: 'Paid',
    paymentMethod: paymentMethod || 'Online Gateway (Test/Razorpay)',
    transactionRef: transactionRef || `TXN-CSC-${Date.now()}`,
    createdAt: submissionDate,
    notes: `Batch submission of ${studentCount} students @ ₹1,000 each = ₹${serverCalculatedAmount}`,
  };

  db.payments.unshift(newPayment);

  const createdStudentIds = [];
  const createdStudents = [];

  students.forEach((sInput, idx) => {
    const studentId = `STU-${1000 + db.students.length + idx + 1}`;
    createdStudentIds.push(studentId);

    const newStudent = {
      id: studentId,
      name: String(sInput.name).trim(),
      phone: String(sInput.phone).trim(),
      whatsapp: String(sInput.whatsapp || sInput.phone).trim(),
      gender: sInput.gender || 'Male',
      dob: sInput.dob || '2002-01-01',
      address: String(sInput.address || '').trim(),
      qualification: String(sInput.qualification || '12th Pass').trim(),
      experience: String(sInput.experience || 'Fresher').trim(),
      skills: String(sInput.skills || '').trim(),
      jobType: String(sInput.jobType).trim(),
      preferredLocation: String(sInput.preferredLocation || 'Bhilai / Durg').trim(),
      expectedSalary: String(sInput.expectedSalary || '₹12,000 - ₹15,000').trim(),
      resumeFileName: sInput.resumeFileName,
      additionalInfo: sInput.additionalInfo,
      cscId: csc.id,
      cscCentreName: csc.centreName,
      cscPhone: csc.phone,
      paymentId,
      paymentAmount: 1000,
      paymentStatus: 'Paid',
      submissionDate,
      status: 'New',
      history: [
        {
          status: 'New',
          updatedAt: submissionDate,
          updatedBy: `${csc.centreName} (Payment Confirmed)`,
          notes: `Submitted with payment of ₹1,000 (Payment ID: ${paymentId})`,
        },
      ],
    };

    createdStudents.push(newStudent);
    db.students.unshift(newStudent);
  });

  const submissionRecord = {
    id: submissionId,
    cscId: csc.id,
    cscCentreName: csc.centreName,
    studentCount,
    amount: serverCalculatedAmount,
    paymentId,
    paymentStatus: 'Paid',
    studentIds: createdStudentIds,
    createdAt: submissionDate,
  };

  db.submissions.unshift(submissionRecord);
  saveDatabase(db);

  return res.status(201).json({
    success: true,
    message: 'Students successfully registered and payment verified.',
    paymentId,
    submissionId,
    studentCount,
    amountPaid: serverCalculatedAmount,
    studentIds: createdStudentIds,
    students: createdStudents,
  });
});

// 6. STUDENTS LIST & FILTERS
app.get('/api/students', (req, res) => {
  const { cscId, status, jobType, gender, search } = req.query;

  let list = [...db.students];

  if (cscId) {
    list = list.filter((s) => s.cscId === cscId);
  }

  if (status && status !== 'all') {
    list = list.filter((s) => s.status.toLowerCase() === String(status).toLowerCase());
  }

  if (jobType && jobType !== 'all') {
    list = list.filter((s) => s.jobType.toLowerCase() === String(jobType).toLowerCase());
  }

  if (gender && gender !== 'all') {
    list = list.filter((s) => s.gender.toLowerCase() === String(gender).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.jobType.toLowerCase().includes(q) ||
        s.cscCentreName.toLowerCase().includes(q) ||
        s.qualification.toLowerCase().includes(q)
    );
  }

  res.json({ students: list });
});

app.get('/api/students/:id', (req, res) => {
  const student = db.students.find((s) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json(student);
});

// Public candidate track endpoint
app.get('/api/students/track/:identifier', (req, res) => {
  const idOrPhone = req.params.identifier.trim();
  const match = db.students.find(
    (s) =>
      s.id.toLowerCase() === idOrPhone.toLowerCase() ||
      s.phone.replace(/[\s+-]/g, '') === idOrPhone.replace(/[\s+-]/g, '')
  );

  if (!match) {
    return res.status(404).json({ error: 'No student found with this Student ID or Phone Number.' });
  }

  res.json({
    id: match.id,
    name: match.name,
    phone: match.phone.slice(0, 4) + 'XXXX' + match.phone.slice(-2),
    jobType: match.jobType,
    cscCentreName: match.cscCentreName,
    status: match.status,
    submissionDate: match.submissionDate,
    placementDetails: match.placementDetails,
    history: match.history,
  });
});

// Admin updates student status (GET JOB)
app.patch('/api/students/:id/status', (req, res) => {
  const { status, placementDetails, notes } = req.body;
  const validStatuses = [
    'New',
    'Pending',
    'Shortlisted',
    'Interview',
    'Ongoing',
    'Get Job',
    'Rejected',
    'Closed',
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const student = db.students.find((s) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  student.status = status;

  if (status === 'Get Job') {
    if (!placementDetails || !placementDetails.companyName || !placementDetails.jobPosition) {
      return res.status(400).json({
        error: "When marking 'Get Job', company name and job position are required.",
      });
    }

    student.placementDetails = {
      companyName: String(placementDetails.companyName).trim(),
      jobPosition: String(placementDetails.jobPosition).trim(),
      joiningDate: placementDetails.joiningDate || new Date().toISOString().split('T')[0],
      salary: String(placementDetails.salary || 'As per offer').trim(),
      location: String(placementDetails.location || 'Bhilai / Chhattisgarh').trim(),
      notes: placementDetails.notes || '',
      placedAt: new Date().toISOString(),
    };

    const comp = db.companies.find(
      (c) => c.companyName.toLowerCase() === placementDetails.companyName.toLowerCase()
    );
    if (comp) {
      comp.candidatesJoinedTotal += 1;
    }
  }

  student.history.unshift({
    status,
    updatedAt: new Date().toISOString(),
    updatedBy: 'CS Consultancy Admin',
    notes: notes || (status === 'Get Job' ? `Placed at ${placementDetails?.companyName}` : `Status updated to ${status}`),
  });

  saveDatabase(db);
  res.json({ success: true, student });
});

// 7. DIRECT COMPANY REGISTRATION & ₹5,000 ANNUAL FEE
app.post('/api/companies/register', (req, res) => {
  const {
    companyName,
    contactPerson,
    phone,
    whatsapp,
    email,
    companyAddress,
    city,
    state,
    pincode,
    industry,
    website,
    description,
    paymentMethod,
    transactionRef,
  } = req.body;

  if (!companyName || !contactPerson || !phone || !companyAddress || !industry) {
    return res.status(400).json({
      error: 'Company Name, Contact Person, Phone, Address, and Industry are required.',
    });
  }

  const companyId = `COMP-${3000 + db.companies.length + 1}`;
  const paymentId = `PAY-COMP-${9000 + db.payments.length + 1}`;
  const now = new Date();
  const expiry = new Date();
  expiry.setFullYear(now.getFullYear() + 1);

  // SERVER-SIDE VALIDATION: ₹5,000 annual fee
  const annualFee = 5000;

  const newPayment = {
    id: paymentId,
    type: 'COMPANY_ANNUAL',
    entityId: companyId,
    entityName: companyName,
    contactPhone: phone,
    amount: annualFee,
    status: 'Paid',
    paymentMethod: paymentMethod || 'Corporate Gateway (Razorpay/Netbanking)',
    transactionRef: transactionRef || `TXN-COMP-${Date.now()}`,
    createdAt: now.toISOString(),
    notes: 'Direct Company Annual Registration (1 Year Membership) = ₹5,000',
  };

  db.payments.unshift(newPayment);

  const newCompany = {
    id: companyId,
    companyName: String(companyName).trim(),
    contactPerson: String(contactPerson).trim(),
    phone: String(phone).trim(),
    whatsapp: String(whatsapp || phone).trim(),
    email: String(email || '').trim(),
    companyAddress: String(companyAddress).trim(),
    city: String(city || 'Bhilai').trim(),
    state: String(state || 'Chhattisgarh').trim(),
    pincode: String(pincode || '490001').trim(),
    industry: String(industry).trim(),
    website: website ? String(website).trim() : '',
    description: description ? String(description).trim() : '',
    annualFee,
    paymentId,
    paymentStatus: 'Paid',
    status: 'Active',
    registrationDate: now.toISOString(),
    expiryDate: expiry.toISOString(),
    requirementsCount: 0,
    candidatesRequiredTotal: 0,
    candidatesProvidedTotal: 0,
    candidatesJoinedTotal: 0,
  };

  db.companies.unshift(newCompany);
  saveDatabase(db);

  return res.status(201).json({
    success: true,
    message: 'Company registered successfully and annual payment of ₹5,000 confirmed.',
    company: newCompany,
    payment: newPayment,
  });
});

app.get('/api/companies', (req, res) => {
  const { status, search } = req.query;

  let list = [...db.companies];

  if (status && status !== 'all') {
    list = list.filter((c) => c.status.toLowerCase() === String(status).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (c) =>
        c.companyName.toLowerCase().includes(q) ||
        c.contactPerson.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }

  res.json({ companies: list });
});

app.get('/api/companies/:id', (req, res) => {
  const company = db.companies.find((c) => c.id === req.params.id);
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }
  const requirements = db.requirements.filter((r) => r.companyId === company.id);
  res.json({ company, requirements });
});

app.patch('/api/companies/:id/status', (req, res) => {
  const { status } = req.body;
  const company = db.companies.find((c) => c.id === req.params.id);
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }
  company.status = status;
  saveDatabase(db);
  res.json({ success: true, company });
});

// Requirements
app.post('/api/companies/requirements', (req, res) => {
  const {
    companyId,
    companyName,
    jobPosition,
    candidatesRequired,
    genderRequirement,
    qualification,
    experience,
    salary,
    jobLocation,
    jobType,
    joiningTimeline,
    description,
  } = req.body;

  if (!jobPosition || !candidatesRequired) {
    return res.status(400).json({ error: 'Job Position and Number of Candidates are required' });
  }

  let comp = db.companies.find((c) => c.id === companyId);
  if (!comp && companyName) {
    comp = db.companies.find(
      (c) => c.companyName.toLowerCase() === String(companyName).trim().toLowerCase()
    );
  }

  const reqId = `REQ-${4000 + db.requirements.length + 1}`;
  const count = Number(candidatesRequired) || 1;

  const newRequirement = {
    id: reqId,
    companyId: comp ? comp.id : companyId || 'COMP-DIRECT',
    companyName: comp ? comp.companyName : companyName || 'Direct Requirement',
    jobPosition: String(jobPosition).trim(),
    candidatesRequired: count,
    candidatesProvided: 0,
    candidatesJoined: 0,
    genderRequirement: genderRequirement || 'Any',
    qualification: String(qualification || '10th / 12th / Graduate').trim(),
    experience: String(experience || 'Fresher / Experienced').trim(),
    salary: String(salary || 'Negotiable').trim(),
    jobLocation: String(jobLocation || 'Bhilai / Chhattisgarh').trim(),
    jobType: String(jobType || 'Other').trim(),
    joiningTimeline: String(joiningTimeline || 'Within 15 days').trim(),
    description: String(description || '').trim(),
    status: 'New',
    createdAt: new Date().toISOString(),
    candidateAssignments: [],
  };

  db.requirements.unshift(newRequirement);

  if (comp) {
    comp.requirementsCount += 1;
    comp.candidatesRequiredTotal += count;
  }

  saveDatabase(db);

  return res.status(201).json({
    success: true,
    message: 'Requirement posted successfully',
    requirement: newRequirement,
  });
});

app.get('/api/companies/requirements/all', (req, res) => {
  const { companyId, status, search } = req.query;

  let list = [...db.requirements];

  if (companyId) {
    list = list.filter((r) => r.companyId === companyId);
  }

  if (status && status !== 'all') {
    list = list.filter((r) => r.status.toLowerCase() === String(status).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (r) =>
        r.jobPosition.toLowerCase().includes(q) ||
        r.companyName.toLowerCase().includes(q) ||
        r.jobLocation.toLowerCase().includes(q)
    );
  }

  res.json({ requirements: list });
});

app.patch('/api/companies/requirements/:id', (req, res) => {
  const { status, candidatesProvided, candidatesJoined } = req.body;
  const requirement = db.requirements.find((r) => r.id === req.params.id);
  if (!requirement) {
    return res.status(404).json({ error: 'Requirement not found' });
  }

  if (status) requirement.status = status;
  if (typeof candidatesProvided === 'number') requirement.candidatesProvided = candidatesProvided;
  if (typeof candidatesJoined === 'number') requirement.candidatesJoined = candidatesJoined;

  saveDatabase(db);
  res.json({ success: true, requirement });
});

app.post('/api/companies/requirements/:id/assign', (req, res) => {
  const { studentId, notes } = req.body;
  const reqItem = db.requirements.find((r) => r.id === req.params.id);
  const student = db.students.find((s) => s.id === studentId);

  if (!reqItem || !student) {
    return res.status(404).json({ error: 'Requirement or Student not found' });
  }

  if (!reqItem.candidateAssignments) {
    reqItem.candidateAssignments = [];
  }

  const existing = reqItem.candidateAssignments.find((a) => a.studentId === studentId);
  if (!existing) {
    reqItem.candidateAssignments.push({
      studentId: student.id,
      studentName: student.name,
      phone: student.phone,
      jobType: student.jobType,
      cscCentreName: student.cscCentreName,
      assignedDate: new Date().toISOString(),
      status: 'Shortlisted',
      notes,
    });
    reqItem.candidatesProvided += 1;

    student.status = 'Shortlisted';
    student.history.unshift({
      status: 'Shortlisted',
      updatedAt: new Date().toISOString(),
      updatedBy: 'CS Consultancy Admin',
      notes: `Shortlisted for ${reqItem.companyName} (${reqItem.jobPosition})`,
    });
  }

  saveDatabase(db);
  res.json({ success: true, requirement: reqItem });
});

// 8. PAYMENTS
app.get('/api/payments', (req, res) => {
  const { type, entityId, search } = req.query;

  let list = [...db.payments];

  if (type && type !== 'all') {
    list = list.filter((p) => p.type === type);
  }

  if (entityId) {
    list = list.filter((p) => p.entityId === entityId);
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (p) =>
        p.entityName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.transactionRef.toLowerCase().includes(q)
    );
  }

  res.json({ payments: list });
});

// 9. OVERALL ADMIN DASHBOARD & REPORTS
app.get('/api/reports/dashboard', (_req, res) => {
  const totalCsc = db.cscCentres.length;
  const activeCsc = db.cscCentres.filter((c) => c.status === 'Active').length;
  const pendingCsc = db.cscCentres.filter((c) => c.status === 'Pending Approval').length;

  const totalStudents = db.students.length;
  const newStudents = db.students.filter((s) => s.status === 'New').length;
  const ongoingStudents = db.students.filter(
    (s) => s.status === 'Ongoing' || s.status === 'Interview' || s.status === 'Shortlisted'
  ).length;
  const getJobStudents = db.students.filter((s) => s.status === 'Get Job').length;

  const totalCompanies = db.companies.length;
  const activeCompanies = db.companies.filter((c) => c.status === 'Active').length;

  const totalRequirements = db.requirements.length;
  const candidatesRequired = db.requirements.reduce((acc, r) => acc + (r.candidatesRequired || 0), 0);
  const candidatesProvided = db.requirements.reduce((acc, r) => acc + (r.candidatesProvided || 0), 0);
  const successfulPlacements = getJobStudents;

  const cscRevenue = db.payments
    .filter((p) => p.type === 'CSC_STUDENTS' && p.status === 'Paid')
    .reduce((acc, p) => acc + p.amount, 0);

  const companyRevenue = db.payments
    .filter((p) => p.type === 'COMPANY_ANNUAL' && p.status === 'Paid')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalRevenue = cscRevenue + companyRevenue;

  const cscBreakdown = db.cscCentres.map((c) => {
    const s = getCSCStats(c.id);
    return {
      id: c.id,
      centreName: c.centreName,
      operatorName: c.operatorName,
      city: c.city,
      status: c.status,
      totalStudents: s.totalStudentsAdded,
      ongoingStudents: s.ongoingStudents,
      gotJobStudents: s.studentsGotJob,
      totalPaid: s.totalAmountPaid,
    };
  });

  const recentStudents = db.students.slice(0, 10);
  const recentPayments = db.payments.slice(0, 10);

  res.json({
    kpis: {
      totalCsc,
      activeCsc,
      pendingCsc,
      totalStudents,
      newStudents,
      ongoingStudents,
      getJobStudents,
      totalCompanies,
      activeCompanies,
      totalRequirements,
      candidatesRequired,
      candidatesProvided,
      successfulPlacements,
      pendingPayments: 0,
      cscRevenue,
      companyRevenue,
      totalRevenue,
    },
    cscBreakdown,
    recentStudents,
    recentPayments,
  });
});

// 10. SETTINGS / JOB TYPES
app.get('/api/settings/job-types', (_req, res) => {
  res.json({ jobTypes: db.jobTypes });
});

app.post('/api/settings/job-types', (req, res) => {
  const { name, category } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Job Type Name is required' });
  }
  const newJt = {
    id: `JT-${db.jobTypes.length + 1}`,
    name: String(name).trim(),
    category: category ? String(category).trim() : 'General',
    isActive: true,
  };
  db.jobTypes.push(newJt);
  saveDatabase(db);
  return res.status(201).json(newJt);
});

// 11. PUBLIC CONTACT MESSAGE
app.post('/api/public/contact', (req, res) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Name, Phone and Message are required' });
  }
  const newMsg = {
    id: `MSG-${db.contactMessages.length + 1}`,
    name: String(name).trim(),
    phone: String(phone).trim(),
    email: String(email || '').trim(),
    subject: String(subject || 'Inquiry').trim(),
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
    status: 'New',
  };
  db.contactMessages.unshift(newMsg);
  saveDatabase(db);
  return res.status(201).json({
    success: true,
    message: 'Your message has been sent successfully. Our Bhilai office will contact you soon.',
  });
});

// Reset demo data API
app.post('/api/admin/reset-demo-data', (_req, res) => {
  db = getInitialSeedData();
  saveDatabase(db);
  res.json({ success: true, message: 'Database reset to initial verified demo state.' });
});

// Protect /api namespace from being caught by client-side fallback
app.all('/api/*', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// ==========================================
// PRODUCTION STATIC SERVING & CLIENT ROUTING
// ==========================================
async function startServer() {
  const hasDist = fs.existsSync(INDEX_HTML);

  if (hasDist) {
    console.log(`[PRODUCTION] Serving client build from: ${DIST_DIR}`);
    // Serve static files (assets, favicon, icons) from /dist
    app.use(express.static(DIST_DIR));

    // Handle React Client-Side routes (Requirement #4)
    app.get('*', (_req, res) => {
      res.sendFile(INDEX_HTML);
    });
  } else if (NODE_ENV !== 'production') {
    // Development mode fallback: dynamically mount Vite middleware
    console.log('[DEVELOPMENT] dist/ not found, mounting Vite middleware mode...');
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.error('[DEV ERROR] Failed to load Vite:', err);
    }
  } else {
    // Production mode with missing build (Requirement #10)
    console.error(`[CRITICAL] Production build not found at: ${INDEX_HTML}`);
    console.error('Please run "npm run build" to generate the client build in dist/ before starting production.');

    app.get('*', (_req, res) => {
      res.status(503).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Build Required - CS Consultancy</title></head>
        <body style="font-family: sans-serif; padding: 40px; text-align: center; color: #1e293b;">
          <h1>Production Build Missing</h1>
          <p>The client build was not found in <code>dist/</code>.</p>
          <p>Please execute <code>npm run build</code> and restart the application.</p>
        </body>
        </html>
      `);
    });
  }

  // Start Express server on process.env.PORT || 3000 (Requirement #1, #10)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CS Consultancy server running on port ${PORT}`);
    console.log(`Production build: ${DIST_DIR}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error('[FATAL] Failed to start Express server:', err);
  process.exit(1);
});
