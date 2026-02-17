import {
    Patient, Appointment, Invoice, InventoryItem, Ambulance, Doctor, Task, Bed, Notice,
    LabTestRequest, RadiologyRequest, Referral, MedicalCertificate, ResearchTrial, MaternityPatient,
    QueueItem, BloodUnit, BloodBag, BloodDonor, BloodRequest, User, UserRole, UrgencyLevel
} from '../types';

// ============================================
// DEMO MODE MOCK USERS
// Mock accounts for all 14 roles for demo mode access
// ============================================
export const MOCK_USERS: User[] = [
    {
        id: "admin-001",
        name: "Admin User",
        email: "admin@nexushealth.com",
        role: UserRole.ADMIN,
        avatar: "https://ui-avatars.com/api/?name=Admin+User&background=0D9488&color=fff",
        department: "Administration"
    },
    {
        id: "doc-001",
        name: "Dr. Sarah Chen",
        email: "sarah.chen@nexushealth.com",
        role: UserRole.DOCTOR,
        avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=0D9488&color=fff",
        department: "Cardiology",
        specialization: "Cardiologist"
    },
    {
        id: "nurse-001",
        name: "Emily Rodriguez",
        email: "emily.rodriguez@nexushealth.com",
        role: UserRole.NURSE,
        avatar: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=0D9488&color=fff",
        department: "Emergency",
        specialization: "Emergency Care"
    },
    {
        id: "pharm-001",
        name: "David Kim",
        email: "david.kim@nexushealth.com",
        role: UserRole.PHARMACIST,
        avatar: "https://ui-avatars.com/api/?name=David+Kim&background=0D9488&color=fff",
        department: "Pharmacy",
        specialization: "Clinical Pharmacy"
    },
    {
        id: "reception-001",
        name: "Lisa Wang",
        email: "lisa.wang@nexushealth.com",
        role: UserRole.RECEPTIONIST,
        avatar: "https://ui-avatars.com/api/?name=Lisa+Wang&background=0D9488&color=fff",
        department: "Front Desk"
    },
    {
        id: "lab-001",
        name: "James Patterson",
        email: "james.patterson@nexushealth.com",
        role: UserRole.LAB_TECHNICIAN,
        avatar: "https://ui-avatars.com/api/?name=James+Patterson&background=0D9488&color=fff",
        department: "Laboratory",
        specialization: "Pathology"
    },
    {
        id: "radio-001",
        name: "Dr. Michael Torres",
        email: "michael.torres@nexushealth.com",
        role: UserRole.RADIOLOGIST,
        avatar: "https://ui-avatars.com/api/?name=Michael+Torres&background=0D9488&color=fff",
        department: "Radiology",
        specialization: "Diagnostic Radiology"
    },
    {
        id: "acct-001",
        name: "Jennifer Adams",
        email: "jennifer.adams@nexushealth.com",
        role: UserRole.ACCOUNTANT,
        avatar: "https://ui-avatars.com/api/?name=Jennifer+Adams&background=0D9488&color=fff",
        department: "Finance"
    },
    {
        id: "hr-001",
        name: "Robert Williams",
        email: "robert.williams@nexushealth.com",
        role: UserRole.HR_MANAGER,
        avatar: "https://ui-avatars.com/api/?name=Robert+Williams&background=0D9488&color=fff",
        department: "Human Resources"
    },
    {
        id: "facility-001",
        name: "Mark Johnson",
        email: "mark.johnson@nexushealth.com",
        role: UserRole.FACILITY_MANAGER,
        avatar: "https://ui-avatars.com/api/?name=Mark+Johnson&background=0D9488&color=fff",
        department: "Facilities"
    },
    {
        id: "kitchen-001",
        name: "Maria Garcia",
        email: "maria.garcia@nexushealth.com",
        role: UserRole.KITCHEN_MANAGER,
        avatar: "https://ui-avatars.com/api/?name=Maria+Garcia&background=0D9488&color=fff",
        department: "Dietary Services"
    },
    {
        id: "emergency-001",
        name: "Dr. Eric Foreman",
        email: "eric.foreman@nexushealth.com",
        role: UserRole.EMERGENCY_MANAGER,
        avatar: "https://ui-avatars.com/api/?name=Eric+Foreman&background=0D9488&color=fff",
        department: "Emergency",
        specialization: "Emergency Medicine"
    },
    {
        id: "research-001",
        name: "Dr. Amanda Brooks",
        email: "amanda.brooks@nexushealth.com",
        role: UserRole.RESEARCHER,
        avatar: "https://ui-avatars.com/api/?name=Amanda+Brooks&background=0D9488&color=fff",
        department: "Research",
        specialization: "Clinical Trials"
    },
    {
        id: "patient-001",
        name: "John Smith",
        email: "john.smith@email.com",
        role: UserRole.PATIENT,
        avatar: "https://ui-avatars.com/api/?name=John+Smith&background=0D9488&color=fff"
    }
];

// Helper function to find mock user by role (for demo mode login)
export const getMockUserByRole = (role: UserRole): User | undefined => {
    return MOCK_USERS.find(user => user.role === role);
};

export const MOCK_PATIENTS: Patient[] = [
    { id: "P-101", name: "Sarah Johnson", age: 34, gender: "Female", admissionDate: "2023-10-24", condition: "Migraine", roomNumber: "304-A", urgency: UrgencyLevel.MEDIUM, history: "Chronic migraines since 2018." },
    { id: "P-102", name: "Michael Chen", age: 58, gender: "Male", admissionDate: "2023-10-22", condition: "Cardiac Arrest", roomNumber: "ICU-02", urgency: UrgencyLevel.CRITICAL, history: "Hypertension, High Cholesterol." },
    { id: "P-103", name: "Emily Davis", age: 24, gender: "Female", admissionDate: "2023-10-25", condition: "Fractured Tibia", roomNumber: "201-B", urgency: UrgencyLevel.LOW, history: "No major history." },
    { id: "P-104", name: "James Wilson", age: 45, gender: "Male", admissionDate: "2023-10-23", condition: "Pneumonia", roomNumber: "305-C", urgency: UrgencyLevel.HIGH, history: "Smoker for 20 years." },
    { id: "P-105", name: "Anita Patel", age: 62, gender: "Female", admissionDate: "2023-10-21", condition: "Diabetes T2", roomNumber: "104-A", urgency: UrgencyLevel.MEDIUM, history: "Insulin dependent." },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
    { id: "1", patientName: "Sarah Johnson", doctorName: "Dr. Chen", time: "09:00 AM", date: "Today", type: "General Checkup", status: "Confirmed", isOnline: false },
    { id: "2", patientName: "Mike Ross", doctorName: "Dr. Smith", time: "10:30 AM", date: "Today", type: "Tele-Consult", status: "Pending", isOnline: true },
    { id: "3", patientName: "Emma Watson", doctorName: "Dr. Chen", time: "02:00 PM", date: "Today", type: "Follow-up", status: "Confirmed", isOnline: false },
    { id: "4", patientName: "John Doe", doctorName: "Dr. House", time: "04:15 PM", date: "Tomorrow", type: "Neurology", status: "Cancelled", isOnline: false },
];

export const MOCK_INVOICES: Invoice[] = [
    { id: "INV-001", patientName: "Sarah Johnson", date: "2023-10-25", amount: 450.00, status: "Paid", items: ["Consultation", "Blood Test"] },
    { id: "INV-002", patientName: "Michael Chen", date: "2023-10-24", amount: 1250.00, status: "Pending", items: ["MRI Scan", "Consultation"] },
    { id: "INV-003", patientName: "Emily Davis", date: "2023-10-20", amount: 120.00, status: "Overdue", items: ["Follow-up"] },
];

export const MOCK_INVENTORY: InventoryItem[] = [
    { id: "MED-001", name: "Paracetamol", category: "Medicine", stock: 500, unit: "Tablets", lastUpdated: "2023-10-25", status: "In Stock" },
    { id: "MED-002", name: "Insulin", category: "Medicine", stock: 20, unit: "Vials", lastUpdated: "2023-10-24", status: "Low Stock" },
    { id: "SUP-001", name: "Surgical Masks", category: "Supply", stock: 1000, unit: "Pieces", lastUpdated: "2023-10-20", status: "In Stock" },
    { id: "SUP-002", name: "Gloves (L)", category: "Supply", stock: 0, unit: "Boxes", lastUpdated: "2023-10-22", status: "Out of Stock" },
];

export const MOCK_AMBULANCES: Ambulance[] = [
    { id: "1", vehicleNumber: "AMB-101", driverName: "John Doe", status: "Available", location: "Hospital Base", type: "ALS" },
    { id: "2", vehicleNumber: "AMB-102", driverName: "Mike Smith", status: "On Route", location: "Downtown", type: "BLS" },
    { id: "3", vehicleNumber: "AMB-103", driverName: "Sarah Connor", status: "Maintenance", location: "Workshop", type: "ALS" },
    { id: "4", vehicleNumber: "AMB-104", driverName: "David Lee", status: "Available", location: "Station 2", type: "BLS" },
];

export const MOCK_STAFF: Doctor[] = [
    { id: 'ST-001', name: 'Dr. Sarah Chen', role: 'Chief Physician', department: 'Cardiology', email: 'sarah.chen@nexus.com', phone: '+1 (555) 123-4567', status: 'Online', joinDate: '2020-03-15', salary: 250000, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300', specialty: 'Cardiology', patients: 12 },
    { id: 'ST-002', name: 'James Wilson', role: 'Senior Nurse', department: 'Emergency', email: 'james.wilson@nexus.com', phone: '+1 (555) 234-5678', status: 'Active', joinDate: '2021-06-10', salary: 85000, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300', patients: 0 },
    { id: 'ST-003', name: 'Dr. Michael Ross', role: 'Surgeon', department: 'Surgery', email: 'michael.ross@nexus.com', phone: '+1 (555) 345-6789', status: 'In Surgery', joinDate: '2019-11-20', salary: 300000, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300', specialty: 'Neuro', patients: 8 },
    { id: 'ST-004', name: 'Emily Davis', role: 'Lab Technician', department: 'Laboratory', email: 'emily.davis@nexus.com', phone: '+1 (555) 456-7890', status: 'Active', joinDate: '2022-01-05', salary: 65000, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300', patients: 0 },
    { id: 'ST-005', name: 'David Kim', role: 'Pharmacist', department: 'Pharmacy', email: 'david.kim@nexus.com', phone: '+1 (555) 567-8901', status: 'Active', joinDate: '2021-09-15', salary: 95000, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300', patients: 0 },
    { id: 'ST-006', name: 'Lisa Wang', role: 'Receptionist', department: 'Administration', email: 'lisa.wang@nexus.com', phone: '+1 (555) 678-9012', status: 'Active', joinDate: '2023-02-01', salary: 45000, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300', patients: 0 },
];

export const MOCK_TASKS: Task[] = [
    { id: "1", title: "Review MRI Results for Bed 3", assignee: "Dr. Chen", priority: "High", status: "Todo" },
    { id: "2", title: "Restock Insulin", assignee: "Pharmacy", priority: "Medium", status: "Todo" },
    { id: "3", title: "Prepare Discharge Summary P-101", assignee: "Nurse Joy", priority: "Low", status: "In Progress" },
    { id: "4", title: "Sanitize OT-2", assignee: "Staff A", priority: "High", status: "Done" },
];

export const MOCK_BEDS: Bed[] = Array.from({ length: 12 }).map((_, i) => ({
    id: `B-${i + 1}`,
    ward: i < 4 ? "ICU" : "General Ward A",
    number: `${i < 4 ? 'ICU' : 'G'}-${i + 1}`,
    status: [1, 5, 8].includes(i) ? "Occupied" : (i === 2 ? "Cleaning" : "Available"),
    patientName: { 1: "John Doe", 5: "Jane Smith", 8: "Bob Jones" }[i],
    type: i < 4 ? "ICU" : "General"
}));

export const MOCK_NOTICES: Notice[] = [
    { id: "1", title: "System Maintenance", content: "The server will be down for maintenance on Sunday 2 AM to 4 AM.", date: "Oct 26", priority: "Urgent" },
    { id: "2", title: "New COVID Protocols", content: "Please review the updated safety guidelines for the ICU.", date: "Oct 25", priority: "Normal" },
    { id: "3", title: "Staff Meeting", content: "General staff meeting on Friday at 3 PM in the Conference Hall.", date: "Oct 24", priority: "Normal" },
];

// ... (other mocks can stay simplified or omitted if not critical for first pass, or I can add them back if needed. 
// For now, I'll keep the ones I've fixed and add back the others in a clean state if they were used.
// The list was long, I should include them to avoid missing data errors.)

export const MOCK_LAB_REQUESTS: LabTestRequest[] = [
    { id: "LAB-001", patientName: "Sarah Johnson", testName: "Complete Blood Count (CBC)", priority: "Routine", status: "Completed", date: "2023-10-26" },
    { id: "LAB-002", patientName: "Michael Chen", testName: "Liver Function Test", priority: "Urgent", status: "Processing", date: "2023-10-26" },
    { id: "LAB-003", patientName: "John Doe", testName: "Lipid Profile", priority: "Routine", status: "Sample Collected", date: "2023-10-25" },
];

export const MOCK_RADIOLOGY: RadiologyRequest[] = [
    { id: "RAD-001", patientName: "Anita Patel", modality: "MRI", bodyPart: "Brain", status: "Report Ready", date: "2023-10-26" },
    { id: "RAD-002", patientName: "Emily Davis", modality: "X-Ray", bodyPart: "Left Tibia", status: "Imaging", date: "2023-10-26" },
    { id: "RAD-003", patientName: "James Wilson", modality: "CT Scan", bodyPart: "Chest", status: "Scheduled", date: "2023-10-27" },
];

export const MOCK_REFERRALS: Referral[] = [
    { id: "REF-001", patientName: "Jane Doe", direction: "Outbound", hospital: "City General", reason: "Advanced Neurology", status: "Accepted", date: "2023-10-26" },
    { id: "REF-002", patientName: "Mark Smith", direction: "Inbound", hospital: "Rural Clinic A", reason: "ICU Requirement", status: "Pending", date: "2023-10-25" },
];

export const MOCK_CERTIFICATES: MedicalCertificate[] = [
    { id: "MC-101", patientName: "Sarah Johnson", type: "Sick Leave", issueDate: "2023-10-26", doctor: "Dr. Chen", status: "Issued" },
    { id: "MC-102", patientName: "Michael Chen", type: "Fitness", issueDate: "2023-10-25", doctor: "Dr. Ross", status: "Draft" },
];

export const MOCK_RESEARCH: ResearchTrial[] = [
    { id: "1", title: "Cardio-X Drug Trial", phase: "Phase III", participants: 120, status: "Active", leadResearcher: "Dr. S. Chen" },
    { id: "2", title: "Diabetes Management Study", phase: "Phase I", participants: 15, status: "Recruiting", leadResearcher: "Dr. J. Doe" },
];

export const MOCK_MATERNITY: MaternityPatient[] = [
    { id: "1", name: "Maria Garcia", weeksPregnant: 39, doctor: "Dr. Cuddy", status: "Labor", room: "LDR-01" },
    { id: "2", name: "Sarah Lee", weeksPregnant: 34, doctor: "Dr. Cuddy", status: "Ante-natal", room: "302" },
];

export const MOCK_QUEUE: QueueItem[] = [
    { id: "1", tokenNumber: 101, patientName: "John Doe", doctorName: "Dr. Sarah Chen", department: "Cardiology", status: "In Consultation", waitTime: "0m" },
    { id: "2", tokenNumber: 102, patientName: "Alice Smith", doctorName: "Dr. Sarah Chen", department: "Cardiology", status: "Waiting", waitTime: "15m" },
    { id: "3", tokenNumber: 103, patientName: "Bob Brown", doctorName: "Dr. Sarah Chen", department: "Cardiology", status: "Waiting", waitTime: "30m" },
];

export const MOCK_BLOOD_UNITS: BloodUnit[] = [
    { id: "BU-001", group: "A+", bags: 12, status: "Adequate" }, { id: "BU-002", group: "A-", bags: 3, status: "Low" },
    { id: "BU-003", group: "B+", bags: 15, status: "Adequate" }, { id: "BU-004", group: "B-", bags: 2, status: "Critical" },
    { id: "BU-005", group: "O+", bags: 20, status: "Adequate" }, { id: "BU-006", group: "O-", bags: 4, status: "Low" },
    { id: "BU-007", group: "AB+", bags: 8, status: "Adequate" }, { id: "BU-008", group: "AB-", bags: 1, status: "Critical" },
];

export const MOCK_BLOOD_BAGS: BloodBag[] = [
    { id: "BB-001", bloodGroup: "A+", donorId: "D-001", donorName: "John Smith", collectionDate: "2024-01-15", expiryDate: "2024-02-15", volume: 450, status: "Available", location: "Freezer A-1" },
    { id: "BB-002", bloodGroup: "A+", donorId: "D-002", donorName: "Mary Johnson", collectionDate: "2024-01-16", expiryDate: "2024-02-16", volume: 450, status: "Available", location: "Freezer A-1" },
    { id: "BB-003", bloodGroup: "B+", donorId: "D-003", donorName: "Robert Brown", collectionDate: "2024-01-14", expiryDate: "2024-02-14", volume: 450, status: "Reserved", location: "Freezer B-1" },
];

export const MOCK_BLOOD_DONORS: BloodDonor[] = [
    { id: "D-001", name: "John Smith", age: 32, gender: "Male", bloodGroup: "A+", contact: "555-0101", address: "123 Main St, City", totalDonations: 5, status: "Active", createdAt: "2023-01-01" },
    { id: "D-002", name: "Mary Johnson", age: 28, gender: "Female", bloodGroup: "A+", contact: "555-0102", address: "456 Oak Ave, Town", totalDonations: 3, status: "Active", createdAt: "2023-01-01" },
];

export const MOCK_BLOOD_REQUESTS: BloodRequest[] = [
    { id: "BR-001", patientId: "P-102", patientName: "Michael Chen", bloodGroup: "B-", unitsRequired: 2, urgency: "Emergency", department: "ICU", doctor: "Dr. Sarah Chen", status: "Pending", requestDate: "2024-01-20", requiredDate: "2024-01-20" },
    { id: "BR-002", patientId: "P-108", patientName: "Lisa Anderson", bloodGroup: "A+", unitsRequired: 1, urgency: "Routine", department: "Surgery", doctor: "Dr. Michael Ross", status: "Approved", requestDate: "2024-01-19", requiredDate: "2024-01-22" },
];

export const MOCK_DEPARTMENTS: import('../types').Department[] = [
    { id: "DEP-001", name: "Cardiology", head: "Dr. Sarah Chen", staffCount: 12, status: "Active" },
    { id: "DEP-002", name: "Neurology", head: "Dr. Michael Ross", staffCount: 8, status: "Active" },
    { id: "DEP-003", name: "Oncology", head: "Dr. James Wilson", staffCount: 5, status: "Active" },
    { id: "DEP-004", name: "Pediatrics", head: "Dr. Lisa Cuddy", staffCount: 10, status: "Active" },
    { id: "DEP-005", name: "Surgery", head: "Dr. Emily House", staffCount: 15, status: "Active" },
    { id: "DEP-006", name: "Emergency", head: "Dr. Eric Foreman", staffCount: 20, status: "Active" },
];
