import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Search, Plus, Filter, FileText, Edit2, Trash2, Archive,
  RotateCcw, Download, ChevronLeft, ChevronRight, ChevronUp,
  ChevronDown, X, UserPlus, BedDouble, Stethoscope, ArrowRight,
  AlertTriangle, CheckCircle, Clock, Users, MoreHorizontal, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Patient, UrgencyLevel } from '../types';
import PatientDetailDrawer from './PatientDetailDrawer';
import AddPatientModal from './AddPatientModal';
import { useData } from '../src/contexts/DataContext';
import { useTheme } from '../src/contexts/ThemeContext';
import { useSearch } from '../src/contexts/SearchContext';

type ViewMode = 'table' | 'cards';
type SortField = 'name' | 'admissionDate' | 'urgency' | 'age';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'all' | 'active' | 'archived' | 'critical' | 'high';

interface PatientFormData {
  name: string;
  age: number;
  gender: string;
  contact: string;
  address: string;
  emergencyContact: string;
  bloodGroup: string;
  allergies: string;
  insurance: string;
  condition: string;
  roomNumber: string;
  urgency: UrgencyLevel;
  history: string;
}

const initialFormData: PatientFormData = {
  name: '',
  age: 0,
  gender: 'Male',
  contact: '',
  address: '',
  emergencyContact: '',
  bloodGroup: '',
  allergies: '',
  insurance: '',
  condition: '',
  roomNumber: '',
  urgency: UrgencyLevel.MEDIUM,
  history: ''
};

const PatientManager: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { patients, addPatient, updatePatient, deletePatient, archivePatient, restorePatient, addToQueue, staff } = useData();
  const { globalSearchQuery, setGlobalSearchQuery } = useSearch();

  // State (sync from global header search when navigating here with a query)
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    if (globalSearchQuery.trim()) {
      setSearchTerm(globalSearchQuery);
      setGlobalSearchQuery('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('admissionDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [editFormData, setEditFormData] = useState<PatientFormData>(initialFormData);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof PatientFormData, string>>>({});

  const itemsPerPage = 20;

  // Helper functions
  const getUrgencyColor = (level: UrgencyLevel) => {
    switch (level) {
      case UrgencyLevel.CRITICAL: return 'bg-red-500 text-white shadow-lg shadow-red-500/30 border-transparent';
      case UrgencyLevel.HIGH: return 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 border-transparent';
      case UrgencyLevel.MEDIUM: return 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30 border-transparent';
      case UrgencyLevel.LOW: return 'bg-green-500 text-white shadow-lg shadow-green-500/30 border-transparent';
      default: return 'bg-slate-500 text-white';
    }
  };

  const isArchived = (patient: Patient) => patient.condition.startsWith('Archived:');

  // Filtered and sorted patients
  const filteredPatients = useMemo(() => {
    let result = [...patients];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term) ||
        p.condition.toLowerCase().includes(term) ||
        p.roomNumber.toLowerCase().includes(term)
      );
    }

    // Status filter
    switch (filterStatus) {
      case 'archived':
        result = result.filter(p => isArchived(p));
        break;
      case 'active':
        result = result.filter(p => !isArchived(p));
        break;
      case 'critical':
        result = result.filter(p => p.urgency === UrgencyLevel.CRITICAL);
        break;
      case 'high':
        result = result.filter(p => p.urgency === UrgencyLevel.HIGH || p.urgency === UrgencyLevel.CRITICAL);
        break;
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'admissionDate':
          comparison = new Date(a.admissionDate).getTime() - new Date(b.admissionDate).getTime();
          break;
        case 'age':
          comparison = a.age - b.age;
          break;
        case 'urgency':
          const urgencyOrder = { [UrgencyLevel.CRITICAL]: 0, [UrgencyLevel.HIGH]: 1, [UrgencyLevel.MEDIUM]: 2, [UrgencyLevel.LOW]: 3 };
          comparison = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [patients, searchTerm, filterStatus, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(start, start + itemsPerPage);
  }, [filteredPatients, currentPage]);

  // Stats
  const stats = useMemo(() => ({
    total: patients.length,
    active: patients.filter(p => !isArchived(p)).length,
    archived: patients.filter(p => isArchived(p)).length,
    critical: patients.filter(p => p.urgency === UrgencyLevel.CRITICAL).length
  }), [patients]);

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleAddPatient = (newPatient: Patient) => {
    addPatient(newPatient);
  };

  const handleEditClick = (patient: Patient) => {
    setEditingPatient(patient);
    setEditFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      contact: (patient as any).contact || '',
      address: (patient as any).address || '',
      emergencyContact: (patient as any).emergencyContact || '',
      bloodGroup: (patient as any).bloodGroup || '',
      allergies: (patient as any).allergies || '',
      insurance: (patient as any).insurance || '',
      condition: patient.condition,
      roomNumber: patient.roomNumber,
      urgency: patient.urgency,
      history: patient.history
    });
    setIsEditModalOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof PatientFormData, string>> = {};

    if (!editFormData.name.trim()) errors.name = 'Name is required';
    if (editFormData.age <= 0) errors.age = 'Valid age is required';
    if (!editFormData.condition.trim()) errors.condition = 'Condition is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSubmit = () => {
    if (!validateForm() || !editingPatient) return;

    updatePatient(editingPatient.id, {
      name: editFormData.name,
      age: editFormData.age,
      gender: editFormData.gender,
      condition: editFormData.condition,
      roomNumber: editFormData.roomNumber,
      urgency: editFormData.urgency,
      history: editFormData.history,
      contact: editFormData.contact,
      address: editFormData.address,
      emergencyContact: editFormData.emergencyContact,
      bloodGroup: editFormData.bloodGroup,
      allergies: editFormData.allergies,
      insurance: editFormData.insurance
    } as Partial<Patient>);

    setIsEditModalOpen(false);
    setEditingPatient(null);
    setFormErrors({});
  };

  const handleDeleteClick = (patient: Patient) => {
    setPatientToDelete(patient);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (patientToDelete) {
      deletePatient(patientToDelete.id);
    }
    setIsDeleteDialogOpen(false);
    setPatientToDelete(null);
  };

  const handleArchive = (patient: Patient) => {
    if (isArchived(patient)) {
      restorePatient(patient.id);
    } else {
      archivePatient(patient.id);
    }
  };

  const handleAdmitToQueue = (patient: Patient) => {
    const tokenNumber = Math.floor(Math.random() * 1000) + 100;
    addToQueue({
      id: `Q-${Date.now()}`,
      tokenNumber,
      patientName: patient.name,
      doctorName: staff[0]?.name || 'Dr. General',
      department: 'General',
      status: 'Waiting',
      waitTime: '15m',
      symptoms: patient.condition
    });
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Age', 'Gender', 'Condition', 'Room', 'Urgency', 'Admission Date'];
    const rows = filteredPatients.map(p => [
      p.id, p.name, p.age, p.gender, p.condition, p.roomNumber, p.urgency, p.admissionDate
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patients-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">Patient Directory</h1>
          <p className="text-foreground-secondary">Manage patient records, admissions, and discharges.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 border border-border rounded-xl text-foreground-secondary hover:bg-background-tertiary text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Download size={18} /> Export CSV
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
            className="bg-accent text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-accent/20 flex items-center gap-2 transition-all"
          >
            <Plus size={20} />
            Admit Patient
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: stats.total, icon: <Users size={22} />, color: 'bg-blue-500' },
          { label: 'Active', value: stats.active, icon: <CheckCircle size={22} />, color: 'bg-green-500' },
          { label: 'Critical', value: stats.critical, icon: <AlertTriangle size={22} />, color: 'bg-red-500' },
          { label: 'Archived', value: stats.archived, icon: <Archive size={22} />, color: 'bg-slate-500' },
        ].map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="glass-panel p-5 rounded-2xl relative overflow-hidden group"
          >
            <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full ${s.color} opacity-10 blur-xl group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className={`p-2.5 rounded-xl ${s.color} bg-opacity-10 text-${s.color.replace('bg-', '')}-600 dark:text-${s.color.replace('bg-', '')}-400`}>
                {s.icon}
              </div>
            </div>
            <h3 className="text-foreground-secondary text-xs uppercase font-bold tracking-wider relative z-10">{s.label}</h3>
            <p className="text-2xl font-bold text-foreground-primary relative z-10">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="glass-panel p-0 rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={20} />
            <input
              type="text"
              placeholder="Search by name, ID, condition, or room..."
              className="w-full pl-10 pr-4 py-2.5 bg-background-primary/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent text-foreground-primary placeholder:text-foreground-muted transition-all"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-colors ${showFilters
                  ? 'bg-accent/10 border-accent/30 text-accent'
                  : 'border-border text-foreground-secondary hover:bg-background-tertiary'
                }`}
            >
              <Filter size={16} />
              Filters
            </button>
            <div className="flex border border-border rounded-xl overflow-hidden bg-background-primary/30">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm transition-colors ${viewMode === 'table' ? 'bg-accent text-white font-medium' : 'text-foreground-secondary hover:bg-background-tertiary'}`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 text-sm transition-colors ${viewMode === 'cards' ? 'bg-accent text-white font-medium' : 'text-foreground-secondary hover:bg-background-tertiary'}`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-border bg-background-tertiary/30 overflow-hidden"
            >
              <div className="p-4 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground-secondary">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value as FilterStatus); setCurrentPage(1); }}
                    className="px-3 py-1.5 border border-border rounded-lg bg-background-primary text-foreground-primary text-sm focus:border-accent outline-none"
                  >
                    <option value="all">All Patients</option>
                    <option value="active">Active Only</option>
                    <option value="archived">Archived Only</option>
                    <option value="critical">Critical</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground-secondary">Sort by:</span>
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value as SortField)}
                    className="px-3 py-1.5 border border-border rounded-lg bg-background-primary text-foreground-primary text-sm focus:border-accent outline-none"
                  >
                    <option value="admissionDate">Admission Date</option>
                    <option value="name">Name</option>
                    <option value="age">Age</option>
                    <option value="urgency">Urgency</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="p-1.5 border border-border rounded-lg hover:bg-background-tertiary text-foreground-secondary"
                  >
                    {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background-tertiary/50 border-b border-border text-xs uppercase tracking-wider text-foreground-muted font-semibold">
                  <th className="px-6 py-4 cursor-pointer hover:text-foreground-primary transition-colors" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">Patient Info <SortIcon field="name" /></div>
                  </th>
                  <th className="px-6 py-4">Diagnosis</th>
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-foreground-primary transition-colors" onClick={() => handleSort('urgency')}>
                    <div className="flex items-center gap-1">Status <SortIcon field="urgency" /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-foreground-primary transition-colors" onClick={() => handleSort('admissionDate')}>
                    <div className="flex items-center gap-1">Admitted <SortIcon field="admissionDate" /></div>
                  </th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <AnimatePresence>
                  {paginatedPatients.map((patient) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`hover:bg-background-tertiary/50 transition-colors group cursor-pointer ${isArchived(patient) ? 'opacity-60 grayscale' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm border-2 border-background-primary shadow-sm">
                            {patient.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground-primary">{patient.name}</p>
                            <p className="text-xs text-foreground-muted">{patient.id} • {patient.age} yrs • {patient.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground-secondary font-medium">
                        {isArchived(patient) ? patient.condition.replace('Archived: ', '') + ' (Archived)' : patient.condition}
                      </td>
                      <td className="px-6 py-4 text-foreground-secondary">
                        <div className="flex items-center gap-2">
                          <BedDouble size={16} className="text-foreground-muted" />
                          {patient.roomNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getUrgencyColor(patient.urgency)}`}>
                          {patient.urgency}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground-muted text-sm">
                        {patient.admissionDate}
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleAdmitToQueue(patient)}
                            className="p-2 text-foreground-muted hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Add to OPD Queue"
                          >
                            <UserPlus size={16} />
                          </button>
                          <button
                            onClick={() => handleEditClick(patient)}
                            className="p-2 text-foreground-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleArchive(patient)}
                            className="p-2 text-foreground-muted hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                            title={isArchived(patient) ? 'Restore' : 'Archive'}
                          >
                            {isArchived(patient) ? <RotateCcw size={16} /> : <Archive size={16} />}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(patient)}
                            className="p-2 text-foreground-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {paginatedPatients.length === 0 && (
              <div className="p-12 text-center text-foreground-muted">
                No patients found matching your criteria.
              </div>
            )}
          </div>
        )}

        {/* Cards View */}
        {viewMode === 'cards' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px]">
            <AnimatePresence>
              {paginatedPatients.map((patient) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`bg-background-primary/40 backdrop-blur-md rounded-xl p-5 border border-border hover:border-accent/50 cursor-pointer transition-all hover:shadow-lg group ${isArchived(patient) ? 'opacity-60 grayscale' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-background-tertiary flex items-center justify-center text-foreground-secondary font-bold border-2 border-border group-hover:border-accent transition-colors">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground-primary group-hover:text-accent transition-colors">{patient.name}</p>
                        <p className="text-xs text-foreground-muted">{patient.id}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getUrgencyColor(patient.urgency)}`}>
                      {patient.urgency}
                    </span>
                  </div>
                  <div className="space-y-2.5 text-sm mb-4">
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-foreground-muted">Age/Gender</span>
                      <span className="text-foreground-primary font-medium">{patient.age} yrs, {patient.gender}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-foreground-muted">Condition</span>
                      <span className="text-foreground-primary font-medium truncate max-w-[140px]">{isArchived(patient) ? patient.condition.replace('Archived: ', '') : patient.condition}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-foreground-muted">Room</span>
                      <span className="text-foreground-primary font-medium flex items-center gap-1"><BedDouble size={14} /> {patient.roomNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Admitted</span>
                      <span className="text-foreground-primary font-medium">{patient.admissionDate}</span>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAdmitToQueue(patient); }}
                      className="p-2 text-foreground-muted hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Add to OPD Queue"
                    >
                      <UserPlus size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditClick(patient); }}
                      className="p-2 text-foreground-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleArchive(patient); }}
                      className="p-2 text-foreground-muted hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                      title={isArchived(patient) ? 'Restore' : 'Archive'}
                    >
                      {isArchived(patient) ? <RotateCcw size={16} /> : <Archive size={16} />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteClick(patient); }}
                      className="p-2 text-foreground-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */
          totalPages > 1 && (
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-foreground-muted">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} patients
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-border rounded-lg hover:bg-background-tertiary disabled:opacity-50 disabled:cursor-not-allowed text-foreground-secondary"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                            ? 'bg-accent text-white shadow-lg shadow-accent/25'
                            : 'hover:bg-background-tertiary text-foreground-secondary'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-border rounded-lg hover:bg-background-tertiary disabled:opacity-50 disabled:cursor-not-allowed text-foreground-secondary"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
      </div>

      {/* Patient Detail Drawer */}
      <PatientDetailDrawer
        patient={selectedPatient}
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPatient}
      />

      {/* Edit Patient Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsEditModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-background-primary dark:bg-slate-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-border custom-scrollbar"
            >
              <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-background-primary/95 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent">
                    <Edit2 size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-foreground-primary">Edit Patient Profile</h2>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-background-tertiary rounded-full text-foreground-muted transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Patient Name *</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${formErrors.name ? 'border-red-500' : 'border-border'}`}
                      placeholder="Enter full name"
                    />
                    {formErrors.name && <p className="text-red-500 text-xs flex items-center gap-1"><AlertTriangle size={12} />{formErrors.name}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Age *</label>
                      <input
                        type="number"
                        value={editFormData.age}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                        className={`w-full px-4 py-3 border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${formErrors.age ? 'border-red-500' : 'border-border'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Gender</label>
                      <select
                        value={editFormData.gender}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Contact Number</label>
                    <input
                      type="text"
                      value={editFormData.contact}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, contact: e.target.value }))}
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Blood Group</label>
                    <select
                      value={editFormData.bloodGroup}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                    >
                      <option value="">Select Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Address</label>
                    <input
                      type="text"
                      value={editFormData.address}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                      placeholder="123 Health Ave, Medical City"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Medical Condition *</label>
                    <input
                      type="text"
                      value={editFormData.condition}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, condition: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${formErrors.condition ? 'border-red-500' : 'border-border'}`}
                      placeholder="Primary diagnosis"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Room No.</label>
                      <input
                        type="text"
                        value={editFormData.roomNumber}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                        className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                        placeholder="ICU-01"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Urgency</label>
                      <select
                        value={editFormData.urgency}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, urgency: e.target.value as UrgencyLevel }))}
                        className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                      >
                        <option value={UrgencyLevel.LOW}>Low</option>
                        <option value={UrgencyLevel.MEDIUM}>Medium</option>
                        <option value={UrgencyLevel.HIGH}>High</option>
                        <option value={UrgencyLevel.CRITICAL}>Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Insurance Provider</label>
                    <input
                      type="text"
                      value={editFormData.insurance}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, insurance: e.target.value }))}
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                      placeholder="HealthCare Plus"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Known Allergies</label>
                    <input
                      type="text"
                      value={editFormData.allergies}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, allergies: e.target.value }))}
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                      placeholder="Peanuts, Penicillin..."
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Medical History</label>
                    <textarea
                      value={editFormData.history}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, history: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none resize-none"
                      placeholder="Previous conditions, surgeries, etc..."
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-background-primary/95 backdrop-blur-sm">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-foreground-secondary hover:bg-background-tertiary font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-6 py-2.5 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all transform hover:scale-[1.02]"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {isDeleteDialogOpen && patientToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => { setIsDeleteDialogOpen(false); setPatientToDelete(null); }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-background-primary border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-background-secondary">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground-primary mb-2">Delete Patient?</h3>
              <p className="text-foreground-secondary mb-6">
                Are you sure you want to permanently delete <strong className="text-foreground-primary">{patientToDelete.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => { setIsDeleteDialogOpen(false); setPatientToDelete(null); }}
                  className="px-5 py-2.5 rounded-xl text-foreground-secondary hover:bg-background-tertiary font-medium transition-colors border border-transparent hover:border-border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PatientManager;
