import React, { useState } from 'react';
import {
  LayoutDashboard, Users, Calendar, BarChart2, Settings,
  FileText, Pill, ClipboardList, Menu, X, ChevronLeft, ChevronRight,
  Truck, Thermometer, Activity, Shield, Phone, Coffee,
  Database, Globe, MapPin, Briefcase, DollarSign, PenTool,
  Clock, Heart, Zap, Lock, Grid, Speaker, Radio,
  Trash2, AlertTriangle, UserPlus, FileCheck, Stethoscope,
  Microscope, Building2, Ticket, Car, Baby, Search, Sparkles, Bell, Box, Book,
  CheckSquare, Megaphone, BedDouble, Scissors, Syringe, FileBadge,
  Skull, Droplet, UtensilsCrossed, Brush, Shirt, UserCog, CreditCard,
  ShieldCheck, ShoppingBag, Wrench, PartyPopper, HelpCircle, MessageSquare,
  LogOut, GraduationCap, Video, FlaskConical, Scan, Share2, Move, Flame,
  Hammer, Headphones, Receipt, PiggyBank, LifeBuoy, Scale, ScrollText, FileWarning
} from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';
import { useTheme } from '../src/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile?: boolean;
}

const MENU_GROUPS = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'analytics', label: 'Analytics', icon: BarChart2 },
      { id: 'schedule', label: 'Schedule', icon: Calendar },
      { id: 'tasks', label: 'My Tasks', icon: ClipboardList },
      { id: 'notices', label: 'Notice Board', icon: Bell },
      { id: 'audit', label: 'Audit Logs', icon: FileCheck },
      { id: 'security', label: 'Security Monitor', icon: Shield },
    ]
  },
  {
    title: 'Clinical',
    items: [
      { id: 'patients', label: 'Patients', icon: Users },
      { id: 'clinical-ai', label: 'Clinical AI', icon: Sparkles },
      { id: 'opd-queue', label: 'OPD Queue', icon: Clock },
      { id: 'lab', label: 'Laboratory', icon: Microscope },
      { id: 'radiology', label: 'Radiology', icon: Radio },
      { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
      { id: 'blood-bank', label: 'Blood Bank', icon: Heart },
      { id: 'ot', label: 'OT Management', icon: Activity },
      { id: 'maternity', label: 'Maternity', icon: Baby },
      { id: 'physio', label: 'Physiotherapy', icon: Activity },
      { id: 'telemedicine', label: 'Telemedicine', icon: Phone },
      { id: 'vaccination', label: 'Vaccination', icon: Stethoscope },
      { id: 'records', label: 'Vital Records', icon: FileText },
      { id: 'certificates', label: 'Med. Certificates', icon: FileCheck },
      { id: 'research', label: 'Clinical Research', icon: Microscope },
    ]
  },
  {
    title: 'Services',
    items: [
      { id: 'ambulance', label: 'Ambulance', icon: Truck },
      { id: 'mortuary', label: 'Mortuary', icon: AlertTriangle },
      { id: 'cssd', label: 'CSSD Sterilization', icon: Thermometer },
      { id: 'waste', label: 'Bio-Medical Waste', icon: Trash2 },
      { id: 'dietary', label: 'Patient Diet', icon: Coffee },
      { id: 'canteen', label: 'Canteen', icon: Coffee },
      { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles },
      { id: 'facility', label: 'Maintenance', icon: PenTool },
      { id: 'laundry', label: 'Laundry', icon: Shirt },
      { id: 'call-center', label: 'Call Center', icon: Phone },
      { id: 'intercom', label: 'Intercom/Paging', icon: Speaker },
      { id: 'parking', label: 'Parking', icon: Car },
      { id: 'transport', label: 'Transport', icon: Truck },
      { id: 'lost-found', label: 'Lost & Found', icon: Search },
      { id: 'donations', label: 'Donations', icon: Heart },
      { id: 'library', label: 'Library', icon: Database },
      { id: 'events', label: 'Events', icon: Calendar },
      { id: 'help-desk', label: 'Help Desk', icon: UserPlus },
    ]
  },
  {
    title: 'Human Resources',
    items: [
      { id: 'staff', label: 'Staff Directory', icon: Users },
      { id: 'roster', label: 'Shift Roster', icon: Calendar },
      { id: 'leave', label: 'Leave Mgmt', icon: Calendar },
      { id: 'payroll', label: 'Payroll', icon: DollarSign },
      { id: 'attendance', label: 'Attendance', icon: Clock },
      { id: 'recruitment', label: 'Recruitment', icon: Briefcase },
      { id: 'training', label: 'Staff Training', icon: Book },
    ]
  },
  {
    title: 'Finance',
    items: [
      { id: 'billing', label: 'Billing', icon: DollarSign },
      { id: 'insurance', label: 'Insurance Claims', icon: Shield },
      { id: 'expenses', label: 'Expenses', icon: DollarSign },
      { id: 'revenue', label: 'Revenue', icon: BarChart2 },
      { id: 'procurement', label: 'Procurement', icon: Truck },
      { id: 'assets', label: 'Asset Manager', icon: Box },
    ]
  },
  {
    title: 'Administration',
    items: [
      { id: 'departments', label: 'Departments', icon: Building2 },
      { id: 'beds', label: 'Bed Management', icon: Grid },
      { id: 'referrals', label: 'Referral System', icon: Users },
      { id: 'visitors', label: 'Visitor Pass', icon: Ticket },
      { id: 'legal', label: 'Legal/Compliance', icon: Lock },
      { id: 'incidents', label: 'Incident Reporting', icon: AlertTriangle },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen, isMobile = false }) => {
  const { user } = useAuth();
  const { theme, setTheme, isDark } = useTheme();

  // Role-based filtering
  const getFilteredMenu = () => {
    let allowedIds: string[] | 'all' = [];

    // Default assignments for common roles
    switch (user?.role) {
      case UserRole.ADMIN:
        allowedIds = 'all';
        break;
      case UserRole.DOCTOR:
        allowedIds = ['dashboard', 'clinical-ai', 'patients', 'schedule', 'tasks', 'notices', 'opd-queue', 'lab', 'radiology', 'pharmacy', 'ot', 'records', 'research', 'telemedicine', 'certificates'];
        break;
      case UserRole.NURSE:
        allowedIds = ['dashboard', 'patients', 'schedule', 'tasks', 'notices', 'beds', 'vitals', 'vaccination', 'dietary', 'maternity', 'housekeeping', 'laundry', 'incidents'];
        break;
      case UserRole.PHARMACIST:
        allowedIds = ['dashboard', 'pharmacy', 'tasks', 'notices', 'procurement', 'billing'];
        break;
      case UserRole.RECEPTIONIST:
        allowedIds = ['dashboard', 'patients', 'schedule', 'tasks', 'notices', 'billing', 'visitors', 'opd-queue', 'referrals', 'call-center', 'help-desk', 'lost-found'];
        break;
      case UserRole.LAB_TECHNICIAN:
        allowedIds = ['dashboard', 'lab', 'tasks', 'notices', 'records'];
        break;
      case UserRole.RADIOLOGIST:
        allowedIds = ['dashboard', 'radiology', 'tasks', 'notices', 'records'];
        break;
      case UserRole.ACCOUNTANT:
        allowedIds = ['dashboard', 'billing', 'insurance', 'expenses', 'revenue', 'payroll', 'assets', 'procurement', 'tasks', 'notices'];
        break;
      case UserRole.HR_MANAGER:
        allowedIds = ['dashboard', 'staff', 'roster', 'leave', 'payroll', 'attendance', 'recruitment', 'training', 'tasks', 'notices', 'incidents', 'legal'];
        break;
      case UserRole.FACILITY_MANAGER:
        allowedIds = ['dashboard', 'facility', 'housekeeping', 'canteen', 'dietary', 'laundry', 'waste', 'security', 'transport', 'parking', 'fire-safety', 'assets', 'tasks', 'notices'];
        break;
      default:
        // Fallback for other roles or unassigned
        allowedIds = ['dashboard', 'tasks', 'notices'];
    }

    return MENU_GROUPS.map(group => ({
      ...group,
      items: group.items.filter(item => allowedIds === 'all' || allowedIds.includes(item.id))
    })).filter(group => group.items.length > 0);
  };

  const menu = getFilteredMenu();

  // Sidebar Framer Motion Variants
  const sidebarVariants = {
    open: {
      width: "280px",
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: {
      width: "80px",
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    mobileOpen: {
      width: "280px",
      x: 0,
      opacity: 1,
      position: "fixed",
      zIndex: 50,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    mobileClosed: {
      width: "280px",
      x: "-100%",
      opacity: 0,
      position: "fixed",
      zIndex: 50,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0, display: "block", transition: { delay: 0.1 } },
    closed: { opacity: 0, x: -10, transitionEnd: { display: "none" } }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={isMobile ? (isOpen ? "mobileOpen" : "mobileClosed") : (isOpen ? "open" : "closed")}
        variants={sidebarVariants}
        className={`flex flex-col border-r border-slate-200 dark:border-slate-800 glass-panel h-screen
          ${!isMobile ? 'sticky top-0' : 'fixed inset-y-0 left-0'}
        `}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-teal-500/30 blur-lg rounded-full animate-pulse"></div>
              <img src="/arya-logo.svg" alt="Logo" className="w-9 h-9 relative z-10" />
            </div>
            <motion.span
              variants={itemVariants}
              className="font-bold text-xl bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent whitespace-nowrap"
            >
              NexusHealth
            </motion.span>
          </div>

          {/* Toggle Button (Desktop) */}
          {!isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-500 transition-colors"
            >
              {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          )}

          {/* Close Button (Mobile) */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Scrollable Menu */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-6 custom-scrollbar">
          {menu.map((group, idx) => (
            <div key={idx}>
              <motion.h3
                variants={itemVariants}
                className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2"
              >
                {group.title}
              </motion.h3>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (isMobile) setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative
                        ${isActive
                          ? 'text-teal-600 dark:text-teal-400 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                        }
                      `}
                    >
                      {/* Active Indicator Glow */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 dark:from-teal-500/20 dark:to-emerald-500/20 rounded-xl border border-teal-100 dark:border-teal-900/30"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}

                      {/* Icon */}
                      <span className={`relative z-10 ${isActive ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                        <Icon size={20} className={isActive ? 'drop-shadow-sm' : ''} />
                      </span>

                      {/* Label */}
                      <motion.span
                        variants={itemVariants}
                        className="relative z-10 whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>

                      {/* Tooltip for collapsed state */}
                      {!isOpen && !isMobile && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[60] shadow-lg">
                          {item.label}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Profile Snippet (Collapsed Mode) */}
        {!isOpen && !isMobile && (
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-3">
            {/* Theme Toggle */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  if (theme === 'light') setTheme('dark');
                  else if (theme === 'dark') setTheme('system');
                  else setTheme('light');
                }}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-500 transition-colors"
                title={`Theme: ${theme} (click to change)`}
              >
                {theme === 'system' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
                  </svg>
                ) : theme === 'light' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.828a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 7a3 3 0 100 6 3 3 0 000-6zm-7 3a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm14 0a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-11.22 5.22a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.828a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-xs ring-2 ring-white dark:ring-slate-900 mx-auto">
              {user?.name.charAt(0)}
            </div>
          </div>
        )}

        {/* User Profile Snippet (Expanded Mode) */}
        {(isOpen || isMobile) && (
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                if (theme === 'light') setTheme('dark');
                else if (theme === 'dark') setTheme('system');
                else setTheme('light');
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors text-sm font-medium"
              title={`Theme: ${theme} (click to change)`}
            >
              {theme === 'system' ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
                  </svg>
                  <span>System</span>
                </>
              ) : theme === 'light' ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.828a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 7a3 3 0 100 6 3 3 0 000-6zm-7 3a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm14 0a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-11.22 5.22a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.828a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            {/* User Profile */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-9 h-9 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold ring-2 ring-white dark:ring-slate-900">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.role}</p>
              </div>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
};

export default Sidebar;
