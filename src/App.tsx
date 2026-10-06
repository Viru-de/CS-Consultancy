import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';
import { LoginModal } from './components/auth/LoginModal.tsx';

// Public Views
import { HomeView } from './components/public/HomeView.tsx';
import { AboutView } from './components/public/AboutView.tsx';
import { ServicesView } from './components/public/ServicesView.tsx';
import { CSCRegistrationView } from './components/public/CSCRegistrationView.tsx';
import { CompanyRegistrationView } from './components/public/CompanyRegistrationView.tsx';
import { CompanyRequirementView } from './components/public/CompanyRequirementView.tsx';
import { JobStatusView } from './components/public/JobStatusView.tsx';
import { ContactView } from './components/public/ContactView.tsx';

// Portal Views
import { CSCDashboardView } from './components/csc/CSCDashboardView.tsx';
import { AdminDashboardView } from './components/admin/AdminDashboardView.tsx';

function AppContent() {
  const { user, isAuthenticated, isAdmin, isCSC } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [targetCompanyIdForReq, setTargetCompanyIdForReq] = useState<string | undefined>(undefined);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (role: 'admin' | 'csc') => {
    if (role === 'admin') {
      setCurrentView('admin-portal');
    } else {
      setCurrentView('csc-portal');
    }
  };

  // If in dedicated admin portal view
  if (currentView === 'admin-portal') {
    return (
      <AdminDashboardView
        onBackToWebsite={() => setCurrentView('home')}
      />
    );
  }

  // If in dedicated CSC customer portal view
  if (currentView === 'csc-portal') {
    return (
      <CSCDashboardView
        onBackToWebsite={() => setCurrentView('home')}
      />
    );
  }

  // Public Website Shell (Multi-page website: Home, About Us, Services, CSC Registration, Company Registration, Contact Us, Login)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans">
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {currentView === 'about' && (
          <AboutView onNavigate={handleNavigate} />
        )}

        {currentView === 'services' && (
          <ServicesView
            onNavigate={handleNavigate}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {currentView === 'csc-register' && (
          <CSCRegistrationView
            onSuccessNavigateToLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {currentView === 'company-register' && (
          <CompanyRegistrationView
            onSuccessNavigateToRequirement={(compKey) => {
              setTargetCompanyIdForReq(compKey);
              setCurrentView('company-requirement');
            }}
          />
        )}

        {currentView === 'company-requirement' && (
          <CompanyRequirementView
            initialCompanyId={targetCompanyIdForReq}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'job-status' && (
          <JobStatusView />
        )}

        {currentView === 'contact' && (
          <ContactView />
        )}
      </main>

      <Footer
        onNavigate={handleNavigate}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* The ONE Login Modal (Requirement #2) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
