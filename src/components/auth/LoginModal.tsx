import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { X, Shield, Users, LogIn, AlertCircle, Key, User, CheckCircle, Info } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: 'admin' | 'csc') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'csc' | 'admin'>('csc');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({
        username: username.trim(),
        password,
        role: selectedRole,
      });
      onSuccess(selectedRole);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (u: string, p: string, r: 'admin' | 'csc') => {
    setSelectedRole(r);
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-sm">
              CS
            </div>
            <div>
              <h3 className="font-bold text-base text-white">CS Consultancy Portal</h3>
              <p className="text-xs text-slate-400">Select your account type to proceed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selection Tabs (Option A: Admin Login, Option B: CSC Customer Login) */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('csc');
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'csc'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>B. CSC Customer Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-600" />
              <span>A. Admin Login</span>
            </button>
          </div>

          {/* Role Description Card */}
          <div className="mb-5 text-xs rounded-xl p-3 bg-slate-50 border border-slate-200">
            {selectedRole === 'csc' ? (
              <div className="text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">CSC Centre Portal:</span>
                <p>
                  Access your centre&apos;s dashboard, submit multiple students at ₹1,000/student, download payment receipts, and track placement status.
                </p>
              </div>
            ) : (
              <div className="text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">Central Administration:</span>
                <p>
                  Full access to approve CSC centres, review student pipelines, update &quot;GET JOB&quot; status, manage direct companies, and view financial reports.
                </p>
              </div>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {selectedRole === 'admin' ? 'Admin Username' : 'CSC Username / Centre ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={selectedRole === 'admin' ? 'admin' : 'e.g. dhanora_csc'}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-amber-400" />
                  <span>Log In to {selectedRole === 'admin' ? 'Admin Portal' : 'CSC Portal'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons for Testing */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Quick Demo Fill for Testing</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'admin123', 'admin')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-left font-medium truncate"
              >
                🔐 Central Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('dhanora_csc', 'csc123', 'csc')}
                className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md text-left font-medium truncate"
              >
                🏢 Dhanora CSC (Active)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('powerhouse_csc', 'csc123', 'csc')}
                className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-md text-left font-medium truncate"
              >
                🏢 Power House CSC
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('nehrunagar_csc', 'csc123', 'csc')}
                className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-md text-left font-medium truncate"
                title="Test pending approval error"
              >
                ⏳ Nehru Nagar (Pending)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
