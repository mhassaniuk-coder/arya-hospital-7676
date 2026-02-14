import React from 'react';

export enum UrgencyLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export interface VitalSign {
  time: string;
  heartRate: number;
  bloodPressure: string;
  temp: number;
}

export interface LabResult {
  id: string;
  testName: string;
  date: string;
  result: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
}

export interface PatientFile {
  id: string;
  name: string;
  type: 'PDF' | 'Image' | 'DICOM';
  date: string;
  size: string;
}

export interface DietItem {
  meal: string;
  description: string;
  calories: number;
  status: 'Planned' | 'Consumed';
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'Admission' | 'Surgery' | 'Medication' | 'Discharge';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  admissionDate: string;
  condition: string;
  roomNumber: string;
  urgency: UrgencyLevel;
  history: string;
  medications?: Medication[];
  vitals?: VitalSign[];
  labResults?: LabResult[];
  files?: PatientFile[];
  diet?: DietItem[];
  timeline?: TimelineEvent[];
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  time: string;
  date: string;
  type: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  isOnline?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  status: 'Online' | 'Offline' | 'In Surgery' | 'On Break';
  patients: number;
  image: string;
}

export interface Bed {
  id: string;
  ward: string;
  number: string;
  status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
  patientName?: string;
  type: 'General' | 'ICU' | 'Emergency';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  lastUpdated: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Invoice {
  id: string;
  patientName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: string[];
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  driverName: string;
  status: 'Available' | 'On Route' | 'Maintenance';
  location: string;
  type: 'ALS' | 'BLS';
}

export interface BloodUnit {
  id: string;
  group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  bags: number;
  status: 'Low' | 'Adequate' | 'Critical';
}

export interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
  status: 'Active' | 'Inactive';
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'In Progress' | 'Done';
}

export interface VitalRecord {
  id: string;
  type: 'Birth' | 'Death';
  name: string;
  date: string;
  time: string;
  doctor: string;
}

export interface OTStatus {
    id: string;
    name: string;
    status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
    currentProcedure?: string;
    doctor?: string;
    startTime?: string;
}

export interface Asset {
    id: string;
    name: string;
    type: string;
    serialNumber: string;
    status: 'Operational' | 'Maintenance' | 'Broken';
    lastService: string;
}

export interface Shift {
    id: string;
    staffName: string;
    role: string;
    day: string;
    time: string;
    area: string;
}

export interface InsuranceClaim {
    id: string;
    patientName: string;
    provider: string;
    amount: number;
    status: 'Approved' | 'Pending' | 'Rejected';
    date: string;
}

export interface KitchenOrder {
    id: string;
    patientName: string;
    room: string;
    dietType: string;
    status: 'Pending' | 'Cooking' | 'Delivered';
}

export interface HousekeepingTask {
    id: string;
    area: string;
    assignee: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    priority: 'High' | 'Normal';
}

export interface Visitor {
    id: string;
    visitorName: string;
    patientName: string;
    checkInTime: string;
    status: 'Active' | 'Checked Out';
}

export interface Vaccine {
    id: string;
    name: string;
    stock: number;
    batchNo: string;
    expiry: string;
}

export interface Feedback {
    id: string;
    patientName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    date: string;
    priority: 'Normal' | 'Urgent';
}

export interface LabTestRequest {
    id: string;
    patientName: string;
    testName: string;
    priority: 'Routine' | 'Urgent';
    status: 'Sample Collected' | 'Processing' | 'Completed';
    date: string;
}

export interface RadiologyRequest {
    id: string;
    patientName: string;
    modality: 'X-Ray' | 'MRI' | 'CT Scan' | 'Ultrasound';
    bodyPart: string;
    status: 'Scheduled' | 'Imaging' | 'Report Ready';
    date: string;
}

export interface ProcurementItem {
    id: string;
    itemName: string;
    vendor: string;
    quantity: number;
    status: 'Ordered' | 'Received' | 'Pending';
    cost: number;
}

export interface TeleConsultation {
    id: string;
    doctorName: string;
    patientName: string;
    startTime: string;
    duration: string;
    platform: 'Zoom' | 'In-App' | 'Meet';
    status: 'Scheduled' | 'Live' | 'Completed';
}

export interface CanteenItem {
    id: string;
    name: string;
    category: 'Meal' | 'Snack' | 'Beverage';
    price: number;
    available: boolean;
}

export interface LaundryBatch {
    id: string;
    type: 'Bed Sheets' | 'Gowns' | 'Towels';
    weight: string;
    status: 'Washing' | 'Drying' | 'Folded' | 'Dispatched';
    department: string;
}

export interface MortuaryRecord {
    id: string;
    deceasedName: string;
    dateOfDeath: string;
    freezerNo: string;
    status: 'Occupied' | 'Released';
    relativeName: string;
}

export interface HospitalEvent {
    id: string;
    title: string;
    type: 'Training' | 'Conference' | 'Workshop';
    date: string;
    location: string;
    attendees: number;
}

export interface LostItem {
    id: string;
    item: string;
    foundLocation: string;
    dateFound: string;
    status: 'Unclaimed' | 'Returned';
    finder: string;
}

export interface ParkingSpot {
    id: string;
    number: string;
    section: 'Staff' | 'Visitor' | 'Ambulance';
    status: 'Available' | 'Occupied';
}

export interface WasteRecord {
  id: string;
  type: 'Infectious' | 'Sharps' | 'General' | 'Chemical';
  weight: number;
  collectionTime: string;
  disposalStatus: 'Collected' | 'Incinerated' | 'Pending';
}

export interface TherapySession {
    id: string;
    patientName: string;
    therapyType: string;
    therapist: string;
    date: string;
    status: 'Scheduled' | 'Completed';
}

export interface SterilizationBatch {
    id: string;
    setName: string;
    cycleNumber: string;
    sterilizationDate: string;
    expiryDate: string;
    status: 'Sterile' | 'Processing' | 'Expired';
}

export interface SupportTicket {
    id: string;
    subject: string;
    department: string;
    requester: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Open' | 'In Progress' | 'Resolved';
}

export interface MaternityPatient {
    id: string;
    name: string;
    weeksPregnant: number;
    doctor: string;
    status: 'Ante-natal' | 'Labor' | 'Post-natal';
    room: string;
}

export interface Incident {
    id: string;
    type: string;
    location: string;
    reportedBy: string;
    date: string;
    severity: 'Low' | 'Medium' | 'High';
    status: 'Investigating' | 'Closed';
}

export interface LibraryItem {
    id: string;
    title: string;
    author: string;
    category: string;
    status: 'Available' | 'Checked Out';
}

export interface Donation {
    id: string;
    donor: string;
    amount: number;
    cause: string;
    date: string;
}

export interface CallLog {
    id: string;
    caller: string;
    type: 'Inquiry' | 'Emergency' | 'Appointment';
    agent: string;
    duration: string;
    time: string;
}

export interface LegalCase {
    id: string;
    caseNumber: string;
    patientName: string;
    type: 'Accident' | 'Assault' | 'Other';
    policeStation: string;
    status: 'Active' | 'Closed';
}

// 10 NEW FEATURES TYPES

export interface QueueItem {
    id: string;
    tokenNumber: number;
    patientName: string;
    doctorName: string;
    department: string;
    status: 'Waiting' | 'In Consultation' | 'Completed';
    waitTime: string;
    priority?: 'Routine' | 'Urgent' | 'Emergency';
    symptoms?: string;
}

export interface Referral {
    id: string;
    patientName: string;
    direction: 'Inbound' | 'Outbound';
    hospital: string;
    reason: string;
    status: 'Pending' | 'Accepted' | 'Completed';
    date: string;
}

export interface MedicalCertificate {
    id: string;
    patientName: string;
    type: 'Sick Leave' | 'Fitness' | 'Death';
    issueDate: string;
    doctor: string;
    status: 'Draft' | 'Issued';
}

export interface AuditLog {
    id: string;
    user: string;
    action: string;
    resource: string;
    timestamp: string;
    status: 'Success' | 'Failed';
}

export interface SecurityLog {
    id: string;
    location: string;
    event: string;
    timestamp: string;
    type: 'Entry' | 'Exit' | 'Alert';
    personnel: string;
}

export interface TrainingModule {
    id: string;
    title: string;
    assignedTo: string;
    dueDate: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
    score?: number;
}

export interface FacilityJob {
    id: string;
    issue: string;
    location: string;
    type: 'Electrical' | 'Plumbing' | 'HVAC';
    status: 'Reported' | 'Fixing' | 'Resolved';
    technician: string;
}

export interface TransportRequest {
    id: string;
    patientName: string;
    from: string;
    to: string;
    priority: 'Routine' | 'Urgent';
    status: 'Pending' | 'In Transit' | 'Completed';
    porter: string;
}

export interface ResearchTrial {
    id: string;
    title: string;
    phase: string;
    participants: number;
    status: 'Recruiting' | 'Active' | 'Completed';
    leadResearcher: string;
}

export interface IntercomLog {
    id: string;
    sender: string;
    recipient: string; // "All Staff", "Dr. X", "ICU Ward"
    message: string;
    time: string;
    priority: 'Normal' | 'Emergency';
}

export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  color: string;
}

export interface ChartDataPoint {
  name: string;
  patients: number;
  appointments: number;
}

export interface AIAnalysisResult {
  summary: string;
  recommendedActions: string[];
  diagnosisSuggestions: string[];
}

export enum UserRole {
  ADMIN = 'Admin',
  DOCTOR = 'Doctor',
  NURSE = 'Nurse',
  PHARMACIST = 'Pharmacist',
  RECEPTIONIST = 'Receptionist',
  LAB_TECHNICIAN = 'Lab Technician',
  RADIOLOGIST = 'Radiologist',
  ACCOUNTANT = 'Accountant',
  HR_MANAGER = 'HR Manager',
  FACILITY_MANAGER = 'Facility Manager',
  KITCHEN_MANAGER = 'Kitchen Manager',
  EMERGENCY_MANAGER = 'Emergency Manager',
  RESEARCHER = 'Researcher',
  PATIENT = 'Patient'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}