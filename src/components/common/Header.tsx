import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Briefcase,
  Phone,
  Mail,
  MapPin,
  LogIn,
  ChevronDown,
  Menu,
  X,
  UserCheck,
  Building2,
  FileText,
  Search,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenLogin }) => {
  const { user, isAuthenticated, isAdmin, isCSC, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Bar with Bhilai Address & Contact Hotline */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center gap-4 text-slate-300 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Sahu Boys Hostel, Near Sahkari Samiti, Dhanora, Bhilai, CG - 491001</span>
            </span>
            <span className="hidden lg:inline text-slate-600">|</span>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Helpline: +91 98261 44521 / +91 70002 88390</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] sm:text-xs text-slate-300">
            <span className="hidden sm:flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>contact@csconsultancybhilai.in</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400">Hours: Mon-Sat 9:30 AM - 7:00 PM</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-11 h-11 rounded-lg bg-slate-900 flex items-center justify-center text-white font-extrabold text-xl shadow-xs group-hover:bg-slate-800 transition-colors">
              <span className="tracking-tight text-amber-400">CS</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">CS CONSULTANCY</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Recruitment & CSC Management · Bhilai (C.G.)
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-sm font-semibold transition-colors pb-1 border-b-2 ${
                currentView === 'home'
                  ? 'text-slate-900 border-slate-900'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`text-sm font-semibold transition-colors pb-1 border-b-2 ${
                currentView === 'about'
                  ? 'text-slate-900 border-slate-900'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              About Us
            </button>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`flex items-center gap-1 text-sm font-semibold transition-colors pb-1 border-b-2 ${
                  [
                    'services',
                    'csc-register',
                    'company-register',
                    'company-requirement',
                    'job-status',
                  ].includes(currentView)
                    ? 'text-slate-900 border-slate-900'
                    : 'text-slate-600 border-transparent hover:text-slate-900'
                }`}
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Services Menu
                  </div>
                  <button
                    onClick={() => handleNavClick('csc-register')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-medium text-slate-900">1. CSC Registration</div>
                      <div className="text-xs text-slate-500">Register new CSC centre partner</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setServicesDropdownOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <div className="font-medium text-slate-900">2. CSC Registered / CSC Login</div>
                      <div className="text-xs text-slate-500">Access CSC portal & submit students</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('job-status')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <div className="font-medium text-slate-900">3. Student Job Registration</div>
                      <div className="text-xs text-slate-500">Find jobs through verified CSC centres</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('company-register')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-medium text-slate-900">4. Direct Company Registration</div>
                      <div className="text-xs text-slate-500">Annual registration fee: ₹5,000/year</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('company-requirement')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <Briefcase className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <div className="font-medium text-slate-900">5. Company Requirements</div>
                      <div className="text-xs text-slate-500">Submit industrial manpower vacancies</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('job-status')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors border-t border-slate-100"
                  >
                    <Search className="w-4 h-4 text-teal-600 shrink-0" />
                    <div>
                      <div className="font-medium text-slate-900">6. Job / Placement Status</div>
                      <div className="text-xs text-slate-500">Live tracker by Phone or Student ID</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('csc-register')}
              className={`text-sm font-semibold transition-colors pb-1 border-b-2 ${
                currentView === 'csc-register'
                  ? 'text-slate-900 border-slate-900'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              CSC Registration
            </button>

            <button
              onClick={() => handleNavClick('company-register')}
              className={`text-sm font-semibold transition-colors pb-1 border-b-2 ${
                currentView === 'company-register'
                  ? 'text-slate-900 border-slate-900'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Company Registration
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`text-sm font-semibold transition-colors pb-1 border-b-2 ${
                currentView === 'contact'
                  ? 'text-slate-900 border-slate-900'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Right Header Actions: ONE Main Login Button or Active Portal Control */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => handleNavClick(isAdmin ? 'admin-portal' : 'csc-portal')}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span>{isAdmin ? 'Admin Dashboard' : 'CSC Dashboard'}</span>
                </button>

                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-900 truncate max-w-[140px]">
                    {user?.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isAdmin ? 'Admin Office' : 'CSC Partner'}
                  </span>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* THE ONE MAIN LOGIN BUTTON (Requirement #2) */
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-xs active:scale-[0.98]"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Login</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === 'home' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === 'about' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === 'services' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => handleNavClick('csc-register')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === 'csc-register' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
              }`}
            >
              CSC Registration
            </button>
            <button
              onClick={() => handleNavClick('company-register')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === 'company-register' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
              }`}
            >
              Company Registration (₹5,000/yr)
            </button>
            <button
              onClick={() => handleNavClick('company-requirement')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === 'company-requirement' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
              }`}
            >
              Post Company Requirements
            </button>
            <button
              onClick={() => handleNavClick('job-status')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === 'job-status' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
              }`}
            >
              Check Job / Placement Status
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === 'contact' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
              }`}
            >
              Contact Us (Bhilai Office)
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {!isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Login (Admin / CSC)</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick(isAdmin ? 'admin-portal' : 'csc-portal')}
                className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Open {isAdmin ? 'Admin' : 'CSC'} Portal</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
