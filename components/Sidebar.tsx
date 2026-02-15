import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Calendar, 
  Activity,
  BedDouble,
  Pill,
  CreditCard,
  UserCog,
  LogOut,
  X,
  Truck,
  Droplet,
  Building2,
  CheckSquare,
  FileHeart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Scissors,
  Wrench,
  Clock,
  ShieldCheck,
  UtensilsCrossed,
  Brush,
  Ticket,
  Syringe,
  MessageSquare,
  Megaphone,
  FlaskConical,
  Scan,
  ShoppingBag,
  Video,
  Coffee,
  Shirt,
  Skull,
  PartyPopper,
  HelpCircle,
  Car,
  Trash2,
  Accessibility,
  Flame,
  LifeBuoy,
  Baby,
  FileWarning,
  Book,
  Heart,
  Headphones,
  Scale,
  ListOrdered,
  Share2,
  FileBadge,
  ScrollText,
  Shield,
  GraduationCap,
  Hammer,
  Move,
  Microscope,
  Briefcase,
  UserPlus,
  Receipt,
  PiggyBank,
  DollarSign,
  Radio,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';
import { useTheme } from '../src/contexts/ThemeContext';
import { UserRole } from '../types';
import LogoutModal from './LogoutModal';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Grouped Menu Items for better organization
  const menuGroups = [
    {
      title: "Overview",
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'analytics', label: 'Analytics', icon: <Activity size={20} /> },
        { id: 'schedule', label: 'Schedule', icon: <Calendar size={20} /> },
        { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
        { id: 'notices', label: 'Notice Board', icon: <Megaphone size={20} /> },
      ]
    },
    {
      title: "Clinical",
      items: [
        { id: 'patients', label: 'Patients', icon: <Users size={20} /> },
        { id: 'clinical-ai', label: 'Clinical AI', icon: <Stethoscope size={20} /> },
        { id: 'opd-queue', label: 'OPD Queue', icon: <ListOrdered size={20} /> },
        { id: 'maternity', label: 'Maternity', icon: <Baby size={20} /> },
        { id: 'physio', label: 'Physiotherapy', icon: <Accessibility size={20} /> },
        { id: 'telemedicine', label: 'Telemedicine', icon: <Video size={20} /> },
        { id: 'lab', label: 'Lab & Pathology', icon: <FlaskConical size={20} /> },
        { id: 'radiology', label: 'Radiology (PACS)', icon: <Scan size={20} /> },
        { id: 'beds', label: 'Bed Management', icon: <BedDouble size={20} /> },
        { id: 'ot', label: 'OT Management', icon: <Scissors size={20} /> },
        { id: 'vaccination', label: 'Vaccination', icon: <Syringe size={20} /> },
        { id: 'referrals', label: 'Referrals', icon: <Share2 size={20} /> },
        { id: 'certificates', label: 'Medical Certs', icon: <FileBadge size={20} /> },
        { id: 'research', label: 'Clinical Research', icon: <Microscope size={20} /> },
        { id: 'records', label: 'Vital Records', icon: <FileHeart size={20} /> },
        { id: 'mortuary', label: 'Mortuary', icon: <Skull size={20} /> },
      ]
    },
    {
      title: "Services",
      items: [
        { id: 'pharmacy', label: 'Pharmacy', icon: <Pill size={20} /> },
        { id: 'blood-bank', label: 'Blood Bank', icon: <Droplet size={20} /> },
        { id: 'ambulance', label: 'Ambulance', icon: <Truck size={20} /> },
        { id: 'transport', label: 'Internal Transport', icon: <Move size={20} /> },
        { id: 'cssd', label: 'CSSD Sterilization', icon: <Flame size={20} /> },
        { id: 'waste', label: 'Bio-Medical Waste', icon: <Trash2 size={20} /> },
        { id: 'dietary', label: 'Patient Diet', icon: <UtensilsCrossed size={20} /> },
        { id: 'canteen', label: 'Canteen', icon: <Coffee size={20} /> },
        { id: 'housekeeping', label: 'Housekeeping', icon: <Brush size={20} /> },
        { id: 'facility', label: 'Maintenance', icon: <Hammer size={20} /> },
        { id: 'laundry', label: 'Laundry', icon: <Shirt size={20} /> },
        { id: 'call-center', label: 'Call Center', icon: <Headphones size={20} /> },
        { id: 'intercom', label: 'Intercom / Paging', icon: <Radio size={20} /> },
        { id: 'parking', label: 'Parking', icon: <Car size={20} /> },
      ]
    },
    {
      title: "Human Resources",
      items: [
        { id: 'staff', label: 'Staff Directory', icon: <UserCog size={20} /> },
        { id: 'attendance', label: 'Attendance', icon: <Clock size={20} /> },
        { id: 'payroll', label: 'Payroll', icon: <DollarSign size={20} /> }, // DollarSign needs import if not present, checking imports... it's not imported in Sidebar yet. Wait, I see CreditCard. Let's use Briefcase or similar if DollarSign is missing. Actually I can import DollarSign.
        { id: 'leave', label: 'Leave Requests', icon: <Calendar size={20} /> },
        { id: 'recruitment', label: 'Recruitment', icon: <UserPlus size={20} /> },
        { id: 'training', label: 'Staff Training', icon: <GraduationCap size={20} /> },
        { id: 'roster', label: 'Shift Roster', icon: <Clock size={20} /> },
      ]
    },
    {
      title: "Finance",
      items: [
        { id: 'billing', label: 'Billing', icon: <CreditCard size={20} /> },
        { id: 'insurance', label: 'Insurance Claims', icon: <ShieldCheck size={20} /> },
        { id: 'expenses', label: 'Expenses', icon: <Receipt size={20} /> },
        { id: 'revenue', label: 'Revenue', icon: <PiggyBank size={20} /> },
        { id: 'procurement', label: 'Procurement', icon: <ShoppingBag size={20} /> },
        { id: 'assets', label: 'Asset Manager', icon: <Wrench size={20} /> },
      ]
    },
    {
        title: "Administration",
        items: [
            { id: 'departments', label: 'Departments', icon: <Building2 size={20} /> },
            { id: 'help-desk', label: 'Help Desk (IT)', icon: <LifeBuoy size={20} /> },
            { id: 'legal', label: 'Legal / MLC', icon: <Scale size={20} /> },
            { id: 'security', label: 'Security Monitor', icon: <Shield size={20} /> },
            { id: 'audit', label: 'Audit Logs', icon: <ScrollText size={20} /> },
            { id: 'visitors', label: 'Visitor Pass', icon: <Ticket size={20} /> },
            { id: 'events', label: 'Events & CME', icon: <PartyPopper size={20} /> },
            { id: 'incidents', label: 'Incident Reporting', icon: <FileWarning size={20} /> },
            { id: 'lost-found', label: 'Lost & Found', icon: <HelpCircle size={20} /> },
            { id: 'library', label: 'Library', icon: <Book size={20} /> },
            { id: 'donations', label: 'Donations', icon: <Heart size={20} /> },
            { id: 'feedback', label: 'Feedback', icon: <MessageSquare size={20} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
        ]
    }
  ];

  const getFilteredMenu = () => {
    if (!user) return [];
    
    let allowedIds: string[] | 'all' = [];

    switch (user.role) {
      case UserRole.ADMIN:
        allowedIds = 'all';
        break;
      case UserRole.DOCTOR:
        allowedIds = ['dashboard', 'analytics', 'schedule', 'tasks', 'notices', 'patients', 'clinical-ai', 'opd-queue', 'maternity', 'physio', 'telemedicine', 'lab', 'radiology', 'beds', 'ot', 'vaccination', 'referrals', 'certificates', 'research', 'records', 'mortuary', 'settings'];
        break;
      case UserRole.NURSE:
        allowedIds = ['dashboard', 'schedule', 'tasks', 'notices', 'patients', 'opd-queue', 'maternity', 'vaccination', 'beds', 'records', 'dietary', 'intercom', 'settings'];
        break;
      case UserRole.PHARMACIST:
        allowedIds = ['dashboard', 'tasks', 'notices', 'pharmacy', 'inventory', 'procurement', 'settings'];
        break;
      case UserRole.LAB_TECHNICIAN:
        allowedIds = ['dashboard', 'tasks', 'notices', 'lab', 'blood-bank', 'waste', 'settings'];
        break;
      case UserRole.RADIOLOGIST:
        allowedIds = ['dashboard', 'tasks', 'notices', 'radiology', 'waste', 'settings'];
        break;
      case UserRole.ACCOUNTANT:
        allowedIds = ['dashboard', 'tasks', 'notices', 'billing', 'insurance', 'procurement', 'assets', 'settings'];
        break;
      case UserRole.RECEPTIONIST:
        allowedIds = ['dashboard', 'schedule', 'tasks', 'notices', 'patients', 'opd-queue', 'visitors', 'call-center', 'intercom', 'lost-found', 'feedback', 'settings'];
        break;
      case UserRole.HR_MANAGER:
        allowedIds = ['dashboard', 'tasks', 'notices', 'staff', 'training', 'roster', 'departments', 'events', 'settings'];
        break;
      case UserRole.FACILITY_MANAGER:
        allowedIds = ['dashboard', 'tasks', 'notices', 'ambulance', 'transport', 'cssd', 'waste', 'dietary', 'canteen', 'housekeeping', 'facility', 'laundry', 'parking', 'security', 'incidents', 'settings'];
        break;
      case UserRole.KITCHEN_MANAGER:
        allowedIds = ['dashboard', 'tasks', 'notices', 'dietary', 'canteen', 'settings'];
        break;
      case UserRole.EMERGENCY_MANAGER:
        allowedIds = ['dashboard', 'tasks', 'notices', 'ambulance', 'transport', 'incidents', 'security', 'settings'];
        break;
      case UserRole.RESEARCHER:
        allowedIds = ['dashboard', 'tasks', 'notices', 'research', 'library', 'settings'];
        break;
      case UserRole.PATIENT:
        allowedIds = ['dashboard', 'schedule', 'tasks', 'notices', 'billing', 'feedback', 'telemedicine', 'settings'];
        break;
      default:
        allowedIds = [];
    }

    if (allowedIds === 'all') return menuGroups;

    return menuGroups.map(group => ({
      ...group,
      items: group.items.filter(item => allowedIds.includes(item.id))
    })).filter(group => group.items.length > 0);
  };

  const filteredMenuGroups = getFilteredMenu();

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed md:relative inset-y-0 left-0 z-50
          bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-slate-200 dark:border-slate-800
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 flex flex-col h-full
          ${collapsed ? 'w-20' : 'w-72'}
          shadow-2xl md:shadow-none
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shrink-0">
          <div className={`flex items-center gap-3 transition-all duration-300 ${collapsed ? 'justify-center w-full' : ''}`}>
            <div className="bg-gradient-to-tr from-teal-500 to-teal-400 p-2 rounded-xl shadow-lg shadow-teal-500/20 shrink-0">
              <Activity size={22} className="text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden whitespace-nowrap">
                <span className="text-lg font-bold text-slate-800 dark:text-white tracking-tight leading-none">Nexus</span>
                <span className="text-[10px] text-teal-600 dark:text-teal-500 font-bold tracking-[0.2em] uppercase mt-0.5">Health</span>
              </div>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 custom-scrollbar space-y-6">
          {filteredMenuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="animate-fade-in" style={{ animationDelay: `${groupIdx * 50}ms` }}>
              {!collapsed && (
                <h3 className="px-4 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-opacity duration-300">
                  {group.title}
                </h3>
              )}
              {collapsed && groupIdx > 0 && <div className="h-px bg-slate-200 dark:bg-slate-800 my-4 mx-2" />}
              
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                      ${activeTab === item.id 
                        ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 shadow-sm' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}
                      ${collapsed ? 'justify-center' : ''}
                    `}
                  >
                    {/* Active Indicator */}
                    {activeTab === item.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full shadow-[0_0_8px_rgba(20,184,166,0.5)]"></div>
                    )}
                    
                    {/* Icon */}
                    <div className={`${activeTab === item.id ? 'text-teal-600 dark:text-teal-400 drop-shadow-sm' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white'} transition-colors duration-200 shrink-0`}>
                        {item.icon}
                    </div>

                    {/* Label */}
                    {!collapsed && (
                      <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
                    )}

                    {/* Tooltip for Collapsed State */}
                    {collapsed && (
                       <div className="absolute left-full ml-4 px-2 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700 transition-opacity duration-200 translate-x-1 group-hover:translate-x-0">
                          {item.label}
                          {/* Tiny Arrow */}
                          <div className="absolute top-1/2 right-full -translate-y-1/2 -mr-[1px] border-4 border-transparent border-r-slate-800"></div>
                       </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer / Toggle */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 shrink-0 relative">
            {!collapsed ? (
                <div className="space-y-3">
                   {/* Theme Toggle Button (Full Width) */}
                   <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                   >
                     <div className="flex items-center gap-2">
                       {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                       <span className="text-sm font-medium">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                     </div>
                     <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${theme === 'dark' ? 'bg-teal-500' : 'bg-slate-300'}`}>
                       <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
                     </div>
                   </button>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors group cursor-pointer">
                        <div className="relative">
                            <img src={user?.avatar || "https://ui-avatars.com/api/?name=User"} alt="User" className="w-9 h-9 rounded-full border border-teal-500/30" />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-slate-700 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{user?.name || 'User'}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.role || 'Guest'}</p>
                        </div>
                        <button onClick={() => setIsLogoutModalOpen(true)} className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors" title="Logout">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    {/* Theme Toggle (Collapsed) */}
                    <button
                        onClick={toggleTheme}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                    </button>

                    <div className="flex justify-center group relative">
                        <div className="relative cursor-pointer" onClick={() => setIsLogoutModalOpen(true)}>
                            <img src={user?.avatar || "https://ui-avatars.com/api/?name=User"} alt="User" className="w-8 h-8 rounded-full border border-teal-500/30" />
                            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-xl border border-slate-700 transition-opacity">
                            Logout
                        </div>
                    </div>
                </div>
            )}
             
            {/* Collapse Toggle for Desktop */}
            <button 
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:flex absolute -right-3 top-[-16px] bg-white dark:bg-[#0f172a] text-slate-400 border border-slate-200 dark:border-slate-700 w-6 h-6 rounded-full items-center justify-center hover:text-slate-900 dark:hover:text-white hover:bg-teal-50 dark:hover:bg-teal-600 hover:border-teal-500 transition-all shadow-lg z-50 transform hover:scale-110"
                title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </div>
      </aside>

      {/* Logout Modal */}
      {isLogoutModalOpen && <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />}
    </>
  );
};

export default Sidebar;
