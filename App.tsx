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

import { Menu, Search, Bell, Plus, Calculator, Siren, LogOut, Loader2, Maximize2 } from 'lucide-react';
import { useAuth } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SearchProvider, useSearch } from './src/contexts/SearchContext';
import { NavProvider } from './src/contexts/NavContext';
import ThemeToggle from './components/ThemeToggle';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

function HeaderSearch({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { globalSearchQuery, setGlobalSearchQuery } = useSearch();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Mobile Search Trigger */}
      <button 
        className="md:hidden btn-icon"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Search size={20} />
      </button>

      {/* Desktop Search */}
      <div className="hidden md:flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 w-64 lg:w-96 focus-within:ring-2 focus-within:ring-teal-500/50 transition-all shadow-sm hover:shadow-md">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && globalSearchQuery.trim()) setActiveTab('patients');
          }}
          className="bg-transparent outline-none text-sm w-full text-slate-900 dark:text-white placeholder:text-slate-400"
        />
        <div className="flex gap-1">
          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">⌘K</span>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl z-20 md:hidden"
          >
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3">
              <Search size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search everything..."
                autoFocus
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setActiveTab('patients');
                    setIsExpanded(false);
                  }
                }}
                className="bg-transparent outline-none text-base w-full text-slate-900 dark:text-white"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse"></div>
        <Loader2 className="w-10 h-10 text-accent animate-spin relative z-10" />
      </div>
    </div>
  );
}

function DashboardLayout() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrolled(e.currentTarget.scrollTop > 20);
  };

  // Handle window resize for responsive sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="page-transition-wrapper p-4 md:p-6 lg:p-8"
        >
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
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <SearchProvider>
      <NavProvider setActiveTab={setActiveTab}>
        <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans transition-colors duration-300">
          {/* Emergency Overlay */}
          <AnimatePresence>
            {isEmergencyActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-red-600/90 backdrop-blur-sm flex items-center justify-center pointer-events-auto"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-lg w-full mx-4"
                >
                  <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Siren size={48} className="text-red-600" />
                  </div>
                  <h1 className="text-4xl font-black text-red-600 mb-2 uppercase tracking-wider">Code Blue</h1>
                  <p className="text-slate-600 mb-8 font-medium text-lg">Emergency Alert Broadcasted to all Departments.</p>
                  <button
                    onClick={() => setIsEmergencyActive(false)}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  >
                    Stand Down Alert
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sidebar Navigation */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            isMobile={isMobile}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full w-full relative overflow-hidden">

            {/* Floating Glass Header */}
            <header className={`
              h-16 flex items-center justify-between px-4 md:px-6 z-30 transition-all duration-300
              ${scrolled ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm' : 'bg-transparent'}
            `}>
              <div className="flex items-center gap-3">
                <button
                  className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <Menu size={20} />
                </button>
                
                {/* Global Search - Responsive */}
                <div className={`${scrolled ? 'opacity-100' : 'opacity-100'} transition-opacity`}>
                   <HeaderSearch setActiveTab={setActiveTab} />
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                {/* Theme Toggle */}
                <ThemeToggle variant="icon" size="md" />

                {/* Tools Menu */}
                <button
                  onClick={() => setIsCalculatorOpen(true)}
                  className="hidden md:flex btn-icon" title="Calculators"
                >
                  <Calculator size={20} />
                </button>

                {/* Emergency Trigger */}
                <button
                  onClick={() => setIsEmergencyActive(true)}
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all border border-red-100 dark:border-red-900 shadow-sm animate-pulse" title="Emergency Alert"
                >
                  <Siren size={20} />
                </button>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-foreground-secondary hover:bg-background-tertiary rounded-full transition-colors"
                  >
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950 shadow-sm"></span>
                  </button>
                  {/* Notification Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl z-50 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl"
                      >
                        <div className="p-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-slate-50 text-sm flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                          <span>Notifications</span>
                          <span className="text-[10px] bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-1.5 py-0.5 rounded-full">3 New</span>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700/50 cursor-pointer transition-colors group">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Lab Results Ready</p>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 pl-4">Patient: John Doe • 5m ago</p>
                          </div>
                          <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700/50 cursor-pointer transition-colors group">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Low Stock Alert: Insulin</p>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 pl-4">Pharmacy • 10m ago</p>
                          </div>
                        </div>
                        <button className="w-full py-2 text-center text-xs font-medium text-teal-600 dark:text-teal-400 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">View All</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="hidden md:flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</p>
                  </div>
                  <div className="relative">
                    <img src={user?.avatar || "https://picsum.photos/40/40"} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm object-cover" alt="Profile" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
                  </div>
                  <button onClick={() => setIsLogoutModalOpen(true)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
                <img src={user?.avatar || "https://picsum.photos/32/32"} className="md:hidden rounded-full border border-slate-200 dark:border-slate-700" alt="Profile" />
              </div>
            </header>

            {/* Scrollable Content */}
            <main
              className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 w-full max-w-[1600px] mx-auto relative custom-scrollbar scroll-smooth bg-white dark:bg-slate-950 transition-colors duration-300"
              onScroll={handleScroll}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="h-full"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Mobile FAB */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab('patients')}
              className="md:hidden fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-500 text-white p-4 rounded-full shadow-lg shadow-teal-500/30 z-20 transition-all"
            >
              <Plus size={24} />
            </motion.button>

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