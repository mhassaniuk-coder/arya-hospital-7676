import React, { useState, useEffect, Suspense, lazy } from 'react';
import Sidebar from './components/Sidebar';
// Lazy load components to split chunks
const Dashboard = lazy(() => import('./components/Dashboard'));
const PatientManager = lazy(() => import('./components/PatientManager'));
const AIConsult = lazy(() => import('./components/AIConsult'));
const Schedule = lazy(() => import('./components/Schedule'));
const Analytics = lazy(() => import('./components/Analytics'));
const StaffDirectory = lazy(() => import('./components/StaffDirectory'));
const BedManagement = lazy(() => import('./components/BedManagement'));
const Pharmacy = lazy(() => import('./components/Pharmacy'));
const Billing = lazy(() => import('./components/Billing'));
const ChatWidget = lazy(() => import('./components/ChatWidget'));
const MedicalCalculators = lazy(() => import('./components/MedicalCalculators'));
const AmbulanceManager = lazy(() => import('./components/AmbulanceManager'));
const BloodBank = lazy(() => import('./components/BloodBank'));
const Departments = lazy(() => import('./components/Departments'));
const TaskManager = lazy(() => import('./components/TaskManager'));
const Settings = lazy(() => import('./components/Settings'));
const VitalRecords = lazy(() => import('./components/VitalRecords'));
const OTManagement = lazy(() => import('./components/OTManagement'));
const AssetManager = lazy(() => import('./components/AssetManager'));
const ShiftRoster = lazy(() => import('./components/ShiftRoster'));
const InsuranceClaims = lazy(() => import('./components/InsuranceClaims'));
const DietaryKitchen = lazy(() => import('./components/DietaryKitchen'));
const Housekeeping = lazy(() => import('./components/Housekeeping'));
const VisitorPass = lazy(() => import('./components/VisitorPass'));
const VaccinationManager = lazy(() => import('./components/VaccinationManager'));
const FeedbackSystem = lazy(() => import('./components/FeedbackSystem'));
const NoticeBoard = lazy(() => import('./components/NoticeBoard'));
const LabManagement = lazy(() => import('./components/LabManagement'));
const Radiology = lazy(() => import('./components/Radiology'));
const Procurement = lazy(() => import('./components/Procurement'));
const Telemedicine = lazy(() => import('./components/Telemedicine'));
const Canteen = lazy(() => import('./components/Canteen'));
const Laundry = lazy(() => import('./components/Laundry'));
const Mortuary = lazy(() => import('./components/Mortuary'));
const EventManagement = lazy(() => import('./components/EventManagement'));
const LostAndFound = lazy(() => import('./components/LostAndFound'));
const Parking = lazy(() => import('./components/Parking'));
const WasteManagement = lazy(() => import('./components/WasteManagement'));
const Physiotherapy = lazy(() => import('./components/Physiotherapy'));
const CSSD = lazy(() => import('./components/CSSD'));
const HelpDesk = lazy(() => import('./components/HelpDesk'));
const Maternity = lazy(() => import('./components/Maternity'));
const IncidentReporting = lazy(() => import('./components/IncidentReporting'));
const Library = lazy(() => import('./components/Library'));
const Donations = lazy(() => import('./components/Donations'));
const CallCenter = lazy(() => import('./components/CallCenter'));
const Legal = lazy(() => import('./components/Legal'));
const OPDQueue = lazy(() => import('./components/OPDQueue'));
const ReferralSystem = lazy(() => import('./components/ReferralSystem'));
const MedicalCertificates = lazy(() => import('./components/MedicalCertificates'));
const AuditLogs = lazy(() => import('./components/AuditLogs'));
const SecurityMonitor = lazy(() => import('./components/SecurityMonitor'));
const StaffTraining = lazy(() => import('./components/StaffTraining'));
const FacilityMaintenance = lazy(() => import('./components/FacilityMaintenance'));
const InternalTransport = lazy(() => import('./components/InternalTransport'));
const ClinicalResearch = lazy(() => import('./components/ClinicalResearch'));
const Intercom = lazy(() => import('./components/Intercom'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const LogoutModal = lazy(() => import('./components/LogoutModal'));
const Payroll = lazy(() => import('./components/Payroll'));
const LeaveManagement = lazy(() => import('./components/LeaveManagement'));
const Expenses = lazy(() => import('./components/Expenses'));
const Recruitment = lazy(() => import('./components/Recruitment'));
const Revenue = lazy(() => import('./components/Revenue'));
const Attendance = lazy(() => import('./components/Attendance'));
const LandingPage = lazy(() => import('./components/LandingPage'));

// AI Components
const AISymptomChecker = lazy(() => import('./components/AISymptomChecker'));
const AIHealthChatWidget = lazy(() => import('./components/AIHealthChatWidget'));
const AIHealthEducation = lazy(() => import('./components/AIHealthEducation'));
const AIMedicationReminder = lazy(() => import('./components/AIMedicationReminder'));
const AIAppointmentScheduler = lazy(() => import('./components/AIAppointmentScheduler'));
const AIDischargeFollowUp = lazy(() => import('./components/AIDischargeFollowUp'));
const AIPatientFeedbackAnalyzer = lazy(() => import('./components/AIPatientFeedbackAnalyzer'));

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