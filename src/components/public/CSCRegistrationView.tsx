import React, { useState } from 'react';
import { api } from '../../services/api.ts';
import {
  UserCheck,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Shield,
  MapPin,
  Building,
  User,
  Phone,
  Mail,
  Lock,
} from 'lucide-react';

interface CSCRegistrationViewProps {
  onSuccessNavigateToLogin: () => void;
}

export const CSCRegistrationView: React.FC<CSCRegistrationViewProps> = ({
  onSuccessNavigateToLogin,
}) => {
  const [formData, setFormData] = useState({
    centreName: '',
    operatorName: '',
    phone: '',
    whatsapp: '',
    email: '',
    officeAddress: '',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    pincode: '491001',
    username: '',
    password: '',
    confirmPassword: '',
    vleId: '',
    businessInfo: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.centreName.trim()) {
      setError('CSC Centre Name is required.');
      return;
    }
    if (!formData.operatorName.trim()) {
      setError('Owner / Operator Name is required.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile phone number.');
      return;
    }
    if (!formData.officeAddress.trim()) {
      setError('Office address is required.');
      return;
    }
    if (!formData.username.trim() || formData.username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (!formData.password || formData.password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.registerCSC({
        centreName: formData.centreName,
        operatorName: formData.operatorName,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        email: formData.email,
        officeAddress: formData.officeAddress,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        username: formData.username,
        password: formData.password,
        vleId: formData.vleId,
        businessInfo: formData.businessInfo,
      });

      setSuccessData(res.csc);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check form values.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* If registration succeeded, show Pending Approval confirmation card */}
      {successData ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              <span>Status: Pending Approval</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Registration Submitted Successfully!
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Your CSC Centre application has been received by CS Consultancy central office. Our Bhilai administration will verify your details and approve your login credentials.
            </p>
          </div>

          {/* Registration Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left max-w-md mx-auto space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Centre ID:</span>
              <span className="font-bold text-slate-900">{successData.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">CSC Centre Name:</span>
              <span className="font-bold text-slate-900">{successData.centreName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Owner / Operator:</span>
              <span className="font-bold text-slate-900">{successData.operatorName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Current Status:</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Pending Admin Approval
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onSuccessNavigateToLogin}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Go to Login Screen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSuccessData(null);
                setFormData({
                  centreName: '',
                  operatorName: '',
                  phone: '',
                  whatsapp: '',
                  email: '',
                  officeAddress: '',
                  city: 'Bhilai',
                  state: 'Chhattisgarh',
                  pincode: '491001',
                  username: '',
                  password: '',
                  confirmPassword: '',
                  vleId: '',
                  businessInfo: '',
                });
              }}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Register Another Centre
            </button>
          </div>
        </div>
      ) : (
        /* The CSC Registration Form */
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <UserCheck className="w-3.5 h-3.5" />
              <span>CSC Centre Partner Onboarding</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Register Your CSC Centre
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Join our network of village-level entrepreneurs & digital kiosk operators across Chhattisgarh. Submit your centre profile to begin forwarding student job seekers at ₹1,000/student.
            </p>
          </div>

          {/* Workflow policy highlight box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-xs text-slate-700 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Approval Workflow Notice:</span>
            </div>
            <p className="leading-relaxed">
              Upon submitting this form, your centre status will be set to <strong>Pending Approval</strong>. Our administration reviews credentials for location verification. Only approved/active CSC centres can log in and submit students.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Centre & Operator Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-500" />
                <span>1. Centre & Operator Identification</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CSC Centre Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="centreName"
                    value={formData.centreName}
                    onChange={handleChange}
                    placeholder="e.g. Dhanora CSC Digital Point"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Owner / Operator Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="operatorName"
                    value={formData.operatorName}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Sahu"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98261 44521"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="Same as phone if empty"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="operator@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>2. Physical Office Location</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Office / Kiosk Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  name="officeAddress"
                  value={formData.officeAddress}
                  onChange={handleChange}
                  placeholder="Shop No, Landmark, Ward / Street name"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City / Town
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Bhilai"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Chhattisgarh"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="491001"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Portal Login Credentials */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <span>3. Portal Login Credentials & Identification</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Desired Username <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. dhanora_csc"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 4 characters"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CSC / VLE ID (If applicable)
                  </label>
                  <input
                    type="text"
                    name="vleId"
                    value={formData.vleId}
                    onChange={handleChange}
                    placeholder="e.g. VLE-CG-491001-99"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Other Business / Services Information
                  </label>
                  <input
                    type="text"
                    name="businessInfo"
                    value={formData.businessInfo}
                    onChange={handleChange}
                    placeholder="e.g. Aadhaar Seva, Insurance, PAN, Online Forms"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                🔒 Free Registration · Admin will review for activation
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto py-3 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Submitting Registration...</span>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Submit CSC Registration</span>
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
