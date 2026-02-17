import React, { useState, useMemo } from 'react';
import {
  Clock,
  UserCheck,
  UserX,
  Download,
  Search,
  Filter,
  Users,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useData } from '../src/contexts/DataContext';

type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave' | 'Half Day' | 'On Duty';

interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  workHours: string;
  remarks?: string;
}

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  Present: 'bg-success-light text-success-dark border-success-dark',
  Absent: 'bg-danger-light text-danger-dark border-danger-dark',
  Late: 'bg-warning-light text-warning-dark border-warning-dark',
  Leave: 'bg-background-tertiary text-foreground-secondary border-border',
  'Half Day': 'bg-info-light text-info-dark border-info-dark',
  'On Duty': 'bg-info-light text-info-dark border-info-dark',
};

// Generate mock attendance from staff for current month
function buildMockAttendance(staff: { id: string; name: string; specialty: string }[]): AttendanceRecord[] {
  const today = new Date();
  const records: AttendanceRecord[] = [];
  const statuses: AttendanceStatus[] = ['Present', 'Present', 'Present', 'Late', 'Present', 'Leave', 'Half Day'];
  const depts = ['Cardiology', 'Neurology', 'General Surgery', 'ICU', 'Emergency', 'Administration'];

  staff.forEach((s, idx) => {
    for (let d = 1; d <= 5; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      const status = statuses[(idx + d) % statuses.length];
      const checkIn = status === 'Absent' ? '--' : status === 'Late' ? '09:45' : '08:00';
      const checkOut = status === 'Absent' || status === 'Leave' ? '--' : status === 'Half Day' ? '13:00' : '17:00';
      const workHours = status === 'Absent' || status === 'Leave' ? '0h' : status === 'Half Day' ? '5h' : '9h';
      records.push({
        id: `${s.id}-${date.toISOString().slice(0, 10)}`,
        staffId: s.id,
        staffName: s.name,
        role: s.specialty,
        department: depts[idx % depts.length],
        date: date.toISOString().slice(0, 10),
        checkIn,
        checkOut,
        status,
        workHours,
      });
    }
  });
  return records;
}

const Attendance: React.FC = () => {
  const { staff } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const allRecords = useMemo(() => buildMockAttendance(staff), [staff]);

  const filteredRecords = useMemo(() => {
    let result = [...allRecords];
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.staffName.toLowerCase().includes(t) ||
          r.role.toLowerCase().includes(t) ||
          r.department.toLowerCase().includes(t)
      );
    }
    if (dateFilter) result = result.filter((r) => r.date === dateFilter);
    if (departmentFilter) result = result.filter((r) => r.department === departmentFilter);
    if (statusFilter) result = result.filter((r) => r.status === statusFilter);
    return result.sort((a, b) => b.date.localeCompare(a.date));
  }, [allRecords, searchTerm, dateFilter, departmentFilter, statusFilter]);

  const departments = useMemo(() => Array.from(new Set(allRecords.map((r) => r.department))).sort(), [allRecords]);
  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = allRecords.filter((r) => r.date === today);
  const presentCount = todayRecords.filter((r) => r.status === 'Present' || r.status === 'Late' || r.status === 'Half Day').length;
  const absentCount = todayRecords.filter((r) => r.status === 'Absent' || r.status === 'Leave').length;

  const handleExport = () => {
    const headers = ['Date', 'Staff Name', 'Role', 'Department', 'Check In', 'Check Out', 'Status', 'Work Hours'];
    const rows = filteredRecords.map((r) => [r.date, r.staffName, r.role, r.department, r.checkIn, r.checkOut, r.status, r.workHours]);
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Attendance</h1>
          <p className="text-foreground-muted">Track staff check-in, check-out, and attendance reports.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 theme-transition shadow-md"
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-lg border border-border text-foreground-secondary hover:bg-background-tertiary flex items-center gap-2 text-sm font-medium theme-transition"
          >
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-elevated p-5 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info-light">
              <Users className="text-info-dark" size={22} />
            </div>
            <div>
              <p className="text-foreground-muted text-sm font-medium">Total Today</p>
              <p className="text-xl font-bold text-foreground-primary">{todayRecords.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-background-elevated p-5 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success-light">
              <UserCheck className="text-success-dark" size={22} />
            </div>
            <div>
              <p className="text-foreground-muted text-sm font-medium">Present</p>
              <p className="text-xl font-bold text-foreground-primary">{presentCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-background-elevated p-5 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-danger-light">
              <UserX className="text-danger-dark" size={22} />
            </div>
            <div>
              <p className="text-foreground-muted text-sm font-medium">Absent / Leave</p>
              <p className="text-xl font-bold text-foreground-primary">{absentCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-background-elevated p-5 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning-light">
              <Clock className="text-warning-dark" size={22} />
            </div>
            <div>
              <p className="text-foreground-muted text-sm font-medium">Late Today</p>
              <p className="text-xl font-bold text-foreground-primary">
                {todayRecords.filter((r) => r.status === 'Late').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-background-elevated rounded-xl border border-border shadow-sm p-4 theme-transition">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={20} />
            <input
              type="text"
              placeholder="Search by name, role, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background-secondary text-foreground-primary placeholder:text-foreground-muted focus:ring-2 focus:ring-accent outline-none theme-transition"
            />
          </div>
          {showFilters && (
            <>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2.5 border border-border rounded-lg bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent theme-transition"
              />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2.5 border border-border rounded-lg bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent theme-transition"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AttendanceStatus | '')}
                className="px-4 py-2.5 border border-border rounded-lg bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent theme-transition"
              >
                <option value="">All Status</option>
                {(Object.keys(STATUS_COLORS) as AttendanceStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-background-elevated rounded-xl border border-border shadow-sm overflow-hidden theme-transition">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-background-secondary border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-foreground-secondary">Date</th>
                <th className="px-6 py-4 font-semibold text-foreground-secondary">Staff</th>
                <th className="px-6 py-4 font-semibold text-foreground-secondary">Department</th>
                <th className="px-6 py-4 font-semibold text-foreground-secondary">Check In</th>
                <th className="px-6 py-4 font-semibold text-foreground-secondary">Check Out</th>
                <th className="px-6 py-4 font-semibold text-foreground-secondary">Status</th>
                <th className="px-6 py-4 font-semibold text-foreground-secondary">Work Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-foreground-muted">
                    No attendance records match your filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.slice(0, 50).map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-background-tertiary theme-transition"
                  >
                    <td className="px-6 py-4 text-foreground-secondary font-medium">{record.date}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground-primary">{record.staffName}</p>
                        <p className="text-xs text-foreground-muted">{record.role}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground-secondary">{record.department}</td>
                    <td className="px-6 py-4 text-foreground-secondary">{record.checkIn}</td>
                    <td className="px-6 py-4 text-foreground-secondary">{record.checkOut}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[record.status]}`}
                      >
                        {record.status === 'Present' && <CheckCircle size={12} className="mr-1" />}
                        {record.status === 'Absent' && <AlertCircle size={12} className="mr-1" />}
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground-primary">{record.workHours}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredRecords.length > 50 && (
          <div className="px-6 py-3 border-t border-border text-sm text-foreground-muted">
            Showing 50 of {filteredRecords.length} records. Use filters to narrow down.
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
