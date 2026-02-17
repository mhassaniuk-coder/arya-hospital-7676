import React, { useState, useEffect, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import { lazyWithRetry } from './utils/lazyLoad';

// Lazy load components with retry mechanism for chunk load errors
const Dashboard = lazyWithRetry(() => import('./components/Dashboard'));
const PatientManager = lazyWithRetry(() => import('./components/PatientManager'));
const AIConsult = lazyWithRetry(() => import('./components/AIConsult'));
const Schedule = lazyWithRetry(() => import('./components/Schedule'));
const Analytics = lazyWithRetry(() => import('./components/Analytics'));
const StaffDirectory = lazyWithRetry(() => import('./components/StaffDirectory'));
const BedManagement = lazyWithRetry(() => import('./components/BedManagement'));
const Pharmacy = lazyWithRetry(() => import('./components/Pharmacy'));
const Billing = lazyWithRetry(() => import('./components/Billing'));
const ChatWidget = lazyWithRetry(() => import('./components/ChatWidget'));
const MedicalCalculators = lazyWithRetry(() => import('./components/MedicalCalculators'));
const AmbulanceManager = lazyWithRetry(() => import('./components/AmbulanceManager'));
const BloodBank = lazyWithRetry(() => import('./components/BloodBank'));
const Departments = lazyWithRetry(() => import('./components/Departments'));
const TaskManager = lazyWithRetry(() => import('./components/TaskManager'));
const Settings = lazyWithRetry(() => import('./components/Settings'));
const VitalRecords = lazyWithRetry(() => import('./components/VitalRecords'));
const OTManagement = lazyWithRetry(() => import('./components/OTManagement'));
const AssetManager = lazyWithRetry(() => import('./components/AssetManager'));
const ShiftRoster = lazyWithRetry(() => import('./components/ShiftRoster'));
const InsuranceClaims = lazyWithRetry(() => import('./components/InsuranceClaims'));
const DietaryKitchen = lazyWithRetry(() => import('./components/DietaryKitchen'));
const Housekeeping = lazyWithRetry(() => import('./components/Housekeeping'));
const VisitorPass = lazyWithRetry(() => import('./components/VisitorPass'));
const VaccinationManager = lazyWithRetry(() => import('./components/VaccinationManager'));
const FeedbackSystem = lazyWithRetry(() => import('./components/FeedbackSystem'));
const NoticeBoard = lazyWithRetry(() => import('./components/NoticeBoard'));
const LabManagement = lazyWithRetry(() => import('./components/LabManagement'));
const Radiology = lazyWithRetry(() => import('./components/Radiology'));
const Procurement = lazyWithRetry(() => import('./components/Procurement'));
const Telemedicine = lazyWithRetry(() => import('./components/Telemedicine'));
const Canteen = lazyWithRetry(() => import('./components/Canteen'));
const Laundry = lazyWithRetry(() => import('./components/Laundry'));
const Mortuary = lazyWithRetry(() => import('./components/Mortuary'));
const EventManagement = lazyWithRetry(() => import('./components/EventManagement'));
const LostAndFound = lazyWithRetry(() => import('./components/LostAndFound'));
const Parking = lazyWithRetry(() => import('./components/Parking'));
const WasteManagement = lazyWithRetry(() => import('./components/WasteManagement'));
const Physiotherapy = lazyWithRetry(() => import('./components/Physiotherapy'));
const CSSD = lazyWithRetry(() => import('./components/CSSD'));
const HelpDesk = lazyWithRetry(() => import('./components/HelpDesk'));
const Maternity = lazyWithRetry(() => import('./components/Maternity'));
const IncidentReporting = lazyWithRetry(() => import('./components/IncidentReporting'));
const Library = lazyWithRetry(() => import('./components/Library'));
const Donations = lazyWithRetry(() => import('./components/Donations'));
const CallCenter = lazyWithRetry(() => import('./components/CallCenter'));
const Legal = lazyWithRetry(() => import('./components/Legal'));
const OPDQueue = lazyWithRetry(() => import('./components/OPDQueue'));
const ReferralSystem = lazyWithRetry(() => import('./components/ReferralSystem'));
const MedicalCertificates = lazyWithRetry(() => import('./components/MedicalCertificates'));
const AuditLogs = lazyWithRetry(() => import('./components/AuditLogs'));
const SecurityMonitor = lazyWithRetry(() => import('./components/SecurityMonitor'));
const StaffTraining = lazyWithRetry(() => import('./components/StaffTraining'));
const FacilityMaintenance = lazyWithRetry(() => import('./components/FacilityMaintenance'));
const InternalTransport = lazyWithRetry(() => import('./components/InternalTransport'));
const ClinicalResearch = lazyWithRetry(() => import('./components/ClinicalResearch'));
const Intercom = lazyWithRetry(() => import('./components/Intercom'));
const LoginPage = lazyWithRetry(() => import('./components/LoginPage'));
const LogoutModal = lazyWithRetry(() => import('./components/LogoutModal'));
const Payroll = lazyWithRetry(() => import('./components/Payroll'));
const LeaveManagement = lazyWithRetry(() => import('./components/LeaveManagement'));
const Expenses = lazyWithRetry(() => import('./components/Expenses'));
const Recruitment = lazyWithRetry(() => import('./components/Recruitment'));
const Revenue = lazyWithRetry(() => import('./components/Revenue'));
const Attendance = lazyWithRetry(() => import('./components/Attendance'));
const LandingPage = lazyWithRetry(() => import('./components/LandingPage'));

// AI Components
const AISymptomChecker = lazyWithRetry(() => import('./components/AISymptomChecker'));
const AIHealthChatWidget = lazyWithRetry(() => import('./components/AIHealthChatWidget'));
const AIHealthEducation = lazyWithRetry(() => import('./components/AIHealthEducation'));
const AIMedicationReminder = lazyWithRetry(() => import('./components/AIMedicationReminder'));
const AIAppointmentScheduler = lazyWithRetry(() => import('./components/AIAppointmentScheduler'));
const AIDischargeFollowUp = lazyWithRetry(() => import('./components/AIDischargeFollowUp'));
const AIPatientFeedbackAnalyzer = lazyWithRetry(() => import('./components/AIPatientFeedbackAnalyzer'));

import { Menu, Search, Bell, Plus, Calculator, Siren, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SearchProvider, useSearch } from './src/contexts/SearchContext';
import { NavProvider } from './src/contexts/NavContext';
import ThemeToggle from './components/ThemeToggle';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

function HeaderSearch({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { globalSearchQuery, setGlobalSearchQuery } = useSearch();
  return (
    <div className="hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 w-80 lg:w-96 focus-within:ring-2 focus-within:ring-teal-500 transition-all">
      <Search size={18} className="text-slate-400" />
      <input
        type="text"
        placeholder="Search patients, staff..."
        value={globalSearchQuery}
        onChange={(e) => setGlobalSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && globalSearchQuery.trim()) setActiveTab('patients');
        }}
        className="bg-transparent outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
      />
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
    </div>
  );
}

function DashboardLayout() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const renderContent = () => {
    return (
      <Suspense fallback={<PageLoader />}>
        {(() => {
          switch (activeTab) {
            case 'dashboard': return <Dashboard />;
            case 'patients': return <PatientManager />;
            case 'clinical-ai': return <AIConsult />;
            case 'schedule': return <Schedule />;
            case 'analytics': return <Analytics />;
            case 'staff': return <StaffDirectory />;
            case 'beds': return <BedManagement />;
            case 'pharmacy': return <Pharmacy />;
            case 'billing': return <Billing />;
            case 'ambulance': return <AmbulanceManager />;
            case 'blood-bank': return <BloodBank />;
            case 'departments': return <Departments />;
            case 'tasks': return <TaskManager />;
            case 'settings': return <Settings />;
            case 'records': return <VitalRecords />;
            case 'ot': return <OTManagement />;
            case 'assets': return <AssetManager />;
            case 'roster': return <ShiftRoster />;
            case 'insurance': return <InsuranceClaims />;
            case 'dietary': return <DietaryKitchen />;
            case 'housekeeping': return <Housekeeping />;
            case 'visitors': return <VisitorPass />;
            case 'vaccination': return <VaccinationManager />;
            case 'feedback': return <FeedbackSystem />;
            case 'notices': return <NoticeBoard />;
            case 'lab': return <LabManagement />;
            case 'radiology': return <Radiology />;
            case 'procurement': return <Procurement />;
            case 'telemedicine': return <Telemedicine />;
            case 'canteen': return <Canteen />;
            case 'laundry': return <Laundry />;
            case 'mortuary': return <Mortuary />;
            case 'events': return <EventManagement />;
            case 'lost-found': return <LostAndFound />;
            case 'parking': return <Parking />;
            case 'waste': return <WasteManagement />;
            case 'physio': return <Physiotherapy />;
            case 'cssd': return <CSSD />;
            case 'help-desk': return <HelpDesk />;
            case 'maternity': return <Maternity />;
            case 'incidents': return <IncidentReporting />;
            case 'library': return <Library />;
            case 'donations': return <Donations />;
            case 'call-center': return <CallCenter />;
            case 'legal': return <Legal />;
            case 'opd-queue': return <OPDQueue />;
            case 'referrals': return <ReferralSystem />;
            case 'certificates': return <MedicalCertificates />;
            case 'audit': return <AuditLogs />;
            case 'security': return <SecurityMonitor />;
            case 'facility': return <FacilityMaintenance />;
            case 'transport': return <InternalTransport />;
            case 'research': return <ClinicalResearch />;
            case 'intercom': return <Intercom />;
            case 'payroll': return <Payroll />;
            case 'leave': return <LeaveManagement />;
            case 'expenses': return <Expenses />;
            case 'recruitment': return <Recruitment />;
            case 'training': return <StaffTraining />;
            case 'revenue': return <Revenue />;
            case 'attendance': return <Attendance />;
            case 'ai-symptom-checker': return <AISymptomChecker />;
            case 'ai-health-chat': return <AIHealthChatWidget />;
            case 'ai-health-education': return <AIHealthEducation />;
            case 'ai-med-reminder': return <AIMedicationReminder />;
            case 'ai-appointment-scheduler': return <AIAppointmentScheduler />;
            case 'ai-discharge-followup': return <AIDischargeFollowUp />;
            case 'ai-feedback-analyzer': return <AIPatientFeedbackAnalyzer />;
            default: return <Dashboard />;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <SearchProvider>
      <NavProvider setActiveTab={setActiveTab}>
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans theme-transition">
          {/* Emergency Overlay */}
          {isEmergencyActive && (
            <div className="fixed inset-0 z-[60] bg-red-600/90 animate-pulse flex items-center justify-center pointer-events-auto">
              <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-lg w-full mx-4 animate-bounce-short">
                <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Siren size={40} className="text-red-600" />
                </div>
                <h1 className="text-4xl font-black text-red-600 mb-2 uppercase tracking-wider">Code Blue</h1>
                <p className="text-slate-600 mb-8 font-medium text-lg">Emergency Alert Broadcasted to all Departments.</p>
                <button
                  onClick={() => setIsEmergencyActive(false)}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all"
                >
                  Stand Down Alert
                </button>
              </div>
            </div>
          )}

          {/* Sidebar Navigation */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full w-full relative">

            {/* Header */}
            <header className="bg-background-secondary/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-4 md:px-6 z-30 theme-transition">
              <div className="flex items-center gap-3">
                <button
                  className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu size={20} />
                </button>
                {/* Global Search */}
                <HeaderSearch setActiveTab={setActiveTab} />
                <span className="md:hidden font-bold text-slate-800 dark:text-white">Arya Hospital</span>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                {/* Theme Toggle */}
                <ThemeToggle variant="icon" size="md" />

                {/* Tools Menu */}
                <button
                  onClick={() => setIsCalculatorOpen(true)}
                  className="hidden md:flex p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" title="Calculators"
                >
                  <Calculator size={20} />
                </button>

                {/* Emergency Trigger */}
                <button
                  onClick={() => setIsEmergencyActive(true)}
                  className="bg-red-50 text-red-600 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all border border-red-100" title="Emergency Alert"
                >
                  <Siren size={20} />
                </button>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-fade-in overflow-hidden">
                      <div className="p-3 border-b border-slate-100 font-semibold text-slate-800 text-sm">Notifications</div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="p-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer">
                          <p className="text-sm font-medium text-slate-800">Lab Results Ready</p>
                          <p className="text-xs text-slate-500">Patient: John Doe • 5m ago</p>
                        </div>
                        <div className="p-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer">
                          <p className="text-sm font-medium text-slate-800">Low Stock Alert: Insulin</p>
                          <p className="text-xs text-slate-500">Pharmacy • 10m ago</p>
                        </div>
                      </div>
                      <button className="w-full py-2 text-center text-xs font-medium text-teal-600 bg-slate-50 hover:bg-slate-100">View All</button>
                    </div>
                  )}
                </div>

                <div className="hidden md:flex items-center gap-3 border-l border-slate-200 pl-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.role}</p>
                  </div>
                  <img src={user?.avatar || "https://picsum.photos/40/40"} className="rounded-full border-2 border-white shadow-sm" alt="Profile" />
                  <button onClick={() => setIsLogoutModalOpen(true)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
                <img src={user?.avatar || "https://picsum.photos/32/32"} className="md:hidden rounded-full border border-slate-200" alt="Profile" />
              </div>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-auto p-4 md:p-8 w-full max-w-[1600px] mx-auto relative custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Mobile FAB */}
            <button
              onClick={() => setActiveTab('patients')}
              className="md:hidden fixed bottom-6 right-6 bg-teal-600 text-white p-4 rounded-full shadow-xl shadow-teal-600/30 z-20 hover:scale-105 transition-transform"
            >
              <Plus size={24} />
            </button>

            {/* Chat Widget */}
            <ChatWidget />

            {/* Modals */}
            <MedicalCalculators isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
            {isLogoutModalOpen && <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />}
          </div>
        </div>
      </NavProvider>
    </SearchProvider>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/dashboard/*" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;