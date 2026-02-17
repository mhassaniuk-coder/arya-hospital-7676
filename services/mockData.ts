import {
    Patient, Appointment, Invoice, InventoryItem, Ambulance, Doctor, Task, Bed, Notice,
    LabTestRequest, RadiologyRequest, Referral, MedicalCertificate, ResearchTrial, MaternityPatient,
    QueueItem, BloodUnit, BloodBag, BloodDonor, BloodRequest, User, UserRole
} from '../types';

export const MOCK_USERS: User[] = [
    {
        id: "admin-001",
        name: "Admin User",
        email: "admin@nexushealth.com",
        role: "Admin",
        avatar: "https://ui-avatars.com/api/?name=Admin&background=0D9488&color=fff"
    },
    {
        id: "doc-001",
        name: "Dr. Sarah Chen",
        email: "sarah.chen@nexushealth.com",
        role: "Doctor",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=0D9488&color=fff"
    }
];

export const MOCK_PATIENTS: Patient[] = [
    { id: "P-101", name: "Sarah Johnson", age: 34, gender: "Female", admissionDate: "2023-10-24", condition: "Migraine", roomNumber: "304-A", urgency: "Medium", history: "Chronic migraines since 2018.", contact: "555-0101", insuranceProvider: "BlueCross", lastVisit: "2023-09-15" },
    { id: "P-102", name: "Michael Chen", age: 58, gender: "Male", admissionDate: "2023-10-22", condition: "Cardiac Arrest", roomNumber: "ICU-02", urgency: "Critical", history: "Hypertension, High Cholesterol.", contact: "555-0102", insuranceProvider: "Aetna", lastVisit: "2023-10-20" },
    { id: "P-103", name: "Emily Davis", age: 24, gender: "Female", admissionDate: "2023-10-25", condition: "Fractured Tibia", roomNumber: "201-B", urgency: "Low", history: "No major history.", contact: "555-0103", insuranceProvider: "UnitedHealth", lastVisit: "2023-01-10" },
    { id: "P-104", name: "James Wilson", age: 45, gender: "Male", admissionDate: "2023-10-23", condition: "Pneumonia", roomNumber: "305-C", urgency: "High", history: "Smoker for 20 years.", contact: "555-0104", insuranceProvider: "Cigna", lastVisit: "2022-11-05" },
    { id: "P-105", name: "Anita Patel", age: 62, gender: "Female", admissionDate: "2023-10-21", condition: "Diabetes T2", roomNumber: "104-A", urgency: "Medium", history: "Insulin dependent.", contact: "555-0105", insuranceProvider: "Medicare", lastVisit: "2023-08-12" },
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
    { id: "1", name: "Dr. Sarah Chen", specialty: "Cardiology", status: "Online", patients: 12, image: "https://picsum.photos/seed/doc1/200", email: "sarah.chen@nexus.com", phone: "555-DOC1", role: "Doctor", department: "Cardiology", joinDate: "2020-01-01" },
    { id: "2", name: "Dr. Michael Ross", specialty: "Neurology", status: "In Surgery", patients: 8, image: "https://picsum.photos/seed/doc2/200", email: "m.ross@nexus.com", phone: "555-DOC2", role: "Doctor", department: "Neurology", joinDate: "2019-05-15" },
    { id: "3", name: "Dr. James Wilson", specialty: "Oncology", status: "Offline", patients: 0, image: "https://picsum.photos/seed/doc3/200", email: "j.wilson@nexus.com", phone: "555-DOC3", role: "Doctor", department: "Oncology", joinDate: "2021-08-20" },
    { id: "4", name: "Dr. Emily House", specialty: "General Surgery", status: "On Break", patients: 5, image: "https://picsum.photos/seed/doc4/200", email: "e.house@nexus.com", phone: "555-DOC4", role: "Doctor", department: "Surgery", joinDate: "2018-11-10" },
    { id: "5", name: "Dr. Lisa Cuddy", specialty: "Administration", status: "Online", patients: 2, image: "https://picsum.photos/seed/doc5/200", email: "l.cuddy@nexus.com", phone: "555-DOC5", role: "Admin", department: "Administration", joinDate: "2015-03-01" },
    { id: "6", name: "Dr. Eric Foreman", specialty: "Neurology", status: "Online", patients: 15, image: "https://picsum.photos/seed/doc6/200", email: "e.foreman@nexus.com", phone: "555-DOC6", role: "Doctor", department: "Neurology", joinDate: "2022-02-14" },
];

export const MOCK_TASKS: Task[] = [
    { id: "1", title: "Review MRI Results for Bed 3", assignee: "Dr. Chen", priority: "High", status: "Todo", dueDate: "2023-10-27", description: "Check for anomalies in T2 sequence." },
    { id: "2", title: "Restock Insulin", assignee: "Pharmacy", priority: "Medium", status: "Todo", dueDate: "2023-10-26", description: "Order batch #4521 from central supply." },
    { id: "3", title: "Prepare Discharge Summary P-101", assignee: "Nurse Joy", priority: "Low", status: "In Progress", dueDate: "2023-10-28", description: "Patient stable, ready for discharge." },
    { id: "4", title: "Sanitize OT-2", assignee: "Staff A", priority: "High", status: "Done", dueDate: "2023-10-25", description: "Post-surgery cleanup required." },
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
    { id: "1", title: "System Maintenance", content: "The server will be down for maintenance on Sunday 2 AM to 4 AM.", date: "Oct 26", priority: "Urgent", type: "System", author: "IT Dept" },
    { id: "2", title: "New COVID Protocols", content: "Please review the updated safety guidelines for the ICU.", date: "Oct 25", priority: "Normal", type: "Policy", author: "Administration" },
    { id: "3", title: "Staff Meeting", content: "General staff meeting on Friday at 3 PM in the Conference Hall.", date: "Oct 24", priority: "Normal", type: "Event", author: "HR" },
];

export const MOCK_LAB_REQUESTS: LabTestRequest[] = [
    { id: "LAB-001", patientName: "Sarah Johnson", testName: "Complete Blood Count (CBC)", priority: "Routine", status: "Completed", date: "2023-10-26", doctorName: "Dr. Chen" },
    { id: "LAB-002", patientName: "Michael Chen", testName: "Liver Function Test", priority: "Urgent", status: "Processing", date: "2023-10-26", doctorName: "Dr. Ross" },
    { id: "LAB-003", patientName: "John Doe", testName: "Lipid Profile", priority: "Routine", status: "Sample Collected", date: "2023-10-25", doctorName: "Dr. House" },
];

export const MOCK_RADIOLOGY: RadiologyRequest[] = [
    { id: "RAD-001", patientName: "Anita Patel", modality: "MRI", bodyPart: "Brain", status: "Report Ready", date: "2023-10-26", priority: "Urgent", doctorName: "Dr. Chen" },
    { id: "RAD-002", patientName: "Emily Davis", modality: "X-Ray", bodyPart: "Left Tibia", status: "Imaging", date: "2023-10-26", priority: "High", doctorName: "Dr. House" },
    { id: "RAD-003", patientName: "James Wilson", modality: "CT Scan", bodyPart: "Chest", status: "Scheduled", date: "2023-10-27", priority: "Routine", doctorName: "Dr. Ross" },
];

export const MOCK_REFERRALS: Referral[] = [
    { id: "REF-001", patientName: "Jane Doe", direction: "Outbound", hospital: "City General", reason: "Advanced Neurology", status: "Accepted", date: "2023-10-26", doctorName: "Dr. Chen", department: "Neurology" },
    { id: "REF-002", patientName: "Mark Smith", direction: "Inbound", hospital: "Rural Clinic A", reason: "ICU Requirement", status: "Pending", date: "2023-10-25", doctorName: "Dr. House", department: "Emergency" },
];

export const MOCK_CERTIFICATES: MedicalCertificate[] = [
    { id: "MC-101", patientName: "Sarah Johnson", type: "Sick Leave", issueDate: "2023-10-26", doctor: "Dr. Chen", status: "Issued", description: "Viral fever, 3 days rest." },
    { id: "MC-102", patientName: "Michael Chen", type: "Fitness", issueDate: "2023-10-25", doctor: "Dr. Ross", status: "Draft", description: "Fit to resume work." },
];

export const MOCK_RESEARCH: ResearchTrial[] = [
    { id: "1", title: "Cardio-X Drug Trial", phase: "Phase III", participants: 120, status: "Active", leadResearcher: "Dr. S. Chen", startDate: "2023-01-01", endDate: "2023-12-31" },
    { id: "2", title: "Diabetes Management Study", phase: "Phase I", participants: 15, status: "Recruiting", leadResearcher: "Dr. J. Doe", startDate: "2023-09-01", endDate: "2024-03-31" },
];

export const MOCK_MATERNITY: MaternityPatient[] = [
    { id: "1", name: "Maria Garcia", weeksPregnant: 39, doctor: "Dr. Cuddy", status: "Labor", room: "LDR-01", admissionDate: "2023-10-26" },
    { id: "2", name: "Sarah Lee", weeksPregnant: 34, doctor: "Dr. Cuddy", status: "Ante-natal", room: "302", admissionDate: "2023-10-24" },
];

export const MOCK_QUEUE: QueueItem[] = [
    { id: "1", tokenNumber: 101, patientName: "John Doe", doctorName: "Dr. Sarah Chen", department: "Cardiology", status: "In Consultation", waitTime: "0m", checkInTime: "09:00 AM" },
    { id: "2", tokenNumber: 102, patientName: "Alice Smith", doctorName: "Dr. Sarah Chen", department: "Cardiology", status: "Waiting", waitTime: "15m", checkInTime: "09:15 AM" },
    { id: "3", tokenNumber: 103, patientName: "Bob Brown", doctorName: "Dr. Sarah Chen", department: "Cardiology", status: "Waiting", waitTime: "30m", checkInTime: "09:30 AM" },
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
    { id: "D-001", name: "John Smith", age: 32, gender: "Male", bloodGroup: "A+", contact: "555-0101", email: "john.smith@email.com", address: "123 Main St, City", lastDonationDate: "2024-01-15", totalDonations: 5, status: "Active" },
    { id: "D-002", name: "Mary Johnson", age: 28, gender: "Female", bloodGroup: "A+", contact: "555-0102", email: "mary.j@email.com", address: "456 Oak Ave, Town", lastDonationDate: "2024-01-16", totalDonations: 3, status: "Active" },
];

export const MOCK_BLOOD_REQUESTS: BloodRequest[] = [
    { id: "BR-001", patientId: "P-102", patientName: "Michael Chen", bloodGroup: "B-", unitsRequired: 2, urgency: "Emergency", department: "ICU", doctor: "Dr. Sarah Chen", status: "Pending", requestDate: "2024-01-20", requiredDate: "2024-01-20", crossMatchStatus: "Pending" },
    { id: "BR-002", patientId: "P-108", patientName: "Lisa Anderson", bloodGroup: "A+", unitsRequired: 1, urgency: "Routine", department: "Surgery", doctor: "Dr. Michael Ross", status: "Approved", requestDate: "2024-01-19", requiredDate: "2024-01-22", crossMatchStatus: "Compatible" },
];
