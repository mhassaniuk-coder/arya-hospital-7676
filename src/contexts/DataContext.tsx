import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import {
  Patient, Appointment, Invoice, UrgencyLevel, InventoryItem, Ambulance, Doctor, Task, Bed, Notice,
  LabTestRequest, RadiologyRequest, Referral, MedicalCertificate, ResearchTrial, MaternityPatient,
  QueueItem, BloodUnit, BloodBag, BloodDonor, BloodRequest
} from '../../types';
import { useAuth } from './AuthContext';
import {
  patientsAPI, appointmentsAPI, invoicesAPI, inventoryAPI, ambulancesAPI, staffAPI, tasksAPI, bedsAPI,
  noticesAPI, labRequestsAPI, radiologyAPI, referralsAPI, certificatesAPI, researchTrialsAPI,
  maternityAPI, opdQueueAPI, bloodUnitsAPI, bloodBagsAPI, bloodDonorsAPI, bloodRequestsAPI, statsAPI
} from '../../services/apiClient';

interface DataContextType {
  patients: Patient[];
  appointments: Appointment[];
  invoices: Invoice[];
  inventory: InventoryItem[];
  ambulances: Ambulance[];
  staff: Doctor[];
  tasks: Task[];
  beds: Bed[];
  notices: Notice[];
  labRequests: LabTestRequest[];
  radiologyRequests: RadiologyRequest[];
  referrals: Referral[];
  medicalCertificates: MedicalCertificate[];
  researchTrials: ResearchTrial[];
  maternityPatients: MaternityPatient[];
  opdQueue: QueueItem[];
  bloodUnits: BloodUnit[];
  bloodBags: BloodBag[];
  bloodDonors: BloodDonor[];
  bloodRequests: BloodRequest[];
  isLoading: boolean;
  refreshData: () => Promise<void>;

  addPatient: (patient: Patient) => Promise<void>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  archivePatient: (id: string) => Promise<void>;
  restorePatient: (id: string) => Promise<void>;

  addAppointment: (appointment: Appointment) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;

  addInvoice: (invoice: Invoice) => Promise<void>;
  addInventoryItem: (item: InventoryItem) => Promise<void>;
  addAmbulance: (ambulance: Ambulance) => Promise<void>;
  addStaff: (doctor: Doctor) => Promise<void>;

  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: 'Todo' | 'In Progress' | 'Done') => Promise<void>;

  addNotice: (notice: Notice) => Promise<void>;
  updateNotice: (id: string, updates: Partial<Notice>) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;

  updateBedStatus: (id: string, status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance') => Promise<void>;

  addLabRequest: (request: LabTestRequest) => Promise<void>;
  addRadiologyRequest: (request: RadiologyRequest) => Promise<void>;
  addReferral: (referral: Referral) => Promise<void>;
  addMedicalCertificate: (cert: MedicalCertificate) => Promise<void>;
  addResearchTrial: (trial: ResearchTrial) => Promise<void>;
  addMaternityPatient: (patient: MaternityPatient) => Promise<void>;

  addToQueue: (item: QueueItem) => Promise<void>;
  updateQueueItem: (id: string, updates: Partial<QueueItem>) => Promise<void>;

  addBloodUnit: (unit: BloodUnit) => Promise<void>;
  updateBloodUnit: (id: string, updates: Partial<BloodUnit>) => Promise<void>;
  addBloodBag: (bag: BloodBag) => Promise<void>;
  updateBloodBag: (id: string, updates: Partial<BloodBag>) => Promise<void>;
  deleteBloodBag: (id: string) => Promise<void>;
  addBloodDonor: (donor: BloodDonor) => Promise<void>;
  updateBloodDonor: (id: string, updates: Partial<BloodDonor>) => Promise<void>;
  deleteBloodDonor: (id: string) => Promise<void>;
  addBloodRequest: (request: BloodRequest) => Promise<void>;
  updateBloodRequest: (id: string, updates: Partial<BloodRequest>) => Promise<void>;

  getStats: () => {
    totalPatients: number;
    totalAppointments: number;
    totalRevenue: number;
    pendingRevenue: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [staff, setStaff] = useState<Doctor[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [labRequests, setLabRequests] = useState<LabTestRequest[]>([]);
  const [radiologyRequests, setRadiologyRequests] = useState<RadiologyRequest[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [medicalCertificates, setMedicalCertificates] = useState<MedicalCertificate[]>([]);
  const [researchTrials, setResearchTrials] = useState<ResearchTrial[]>([]);
  const [maternityPatients, setMaternityPatients] = useState<MaternityPatient[]>([]);
  const [opdQueue, setOpdQueue] = useState<QueueItem[]>([]);
  const [bloodUnits, setBloodUnits] = useState<BloodUnit[]>([]);
  const [bloodBags, setBloodBags] = useState<BloodBag[]>([]);
  const [bloodDonors, setBloodDonors] = useState<BloodDonor[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);

  const refreshData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const [
        p, a, i, inv, amb, s, t, b, n, l, r, ref, mc, rt, mp, q, bu, bb, bd, br
      ] = await Promise.all([
        patientsAPI.list(), appointmentsAPI.list(), invoicesAPI.list(), inventoryAPI.list(), ambulancesAPI.list(),
        staffAPI.list(), tasksAPI.list(), bedsAPI.list(), noticesAPI.list(), labRequestsAPI.list(),
        radiologyAPI.list(), referralsAPI.list(), certificatesAPI.list(), researchTrialsAPI.list(),
        maternityAPI.list(), opdQueueAPI.list(), bloodUnitsAPI.list(), bloodBagsAPI.list(),
        bloodDonorsAPI.list(), bloodRequestsAPI.list()
      ]);

      setPatients(p); setAppointments(a); setInvoices(i); setInventory(inv);
      setAmbulances(amb); setStaff(s); setTasks(t); setBeds(b); setNotices(n);
      setLabRequests(l); setRadiologyRequests(r); setReferrals(ref); setMedicalCertificates(mc);
      setResearchTrials(rt); setMaternityPatients(mp); setOpdQueue(q);
      setBloodUnits(bu); setBloodBags(bb); setBloodDonors(bd); setBloodRequests(br);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // CRUD Wrapper Helpers
  const createItem = async <T,>(api: any, item: T, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    try {
      const newItem = await api.create(item);
      setter(prev => [newItem, ...prev]);
    } catch (e) {
      console.error("Create failed", e);
      throw e;
    }
  };

  const updateItem = async <T extends { id: string }>(api: any, id: string, updates: Partial<T>, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    try {
      await api.update(id, updates); // API might return updated item, but we can also merge locally for speed if needed. For now assuming standardized return or just re-fetch is overkill.
      setter(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    } catch (e) {
      console.error("Update failed", e);
      throw e;
    }
  };

  const deleteItem = async <T extends { id: string }>(api: any, id: string, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    try {
      await api.delete(id);
      setter(prev => prev.filter(item => item.id !== id));
    } catch (e) {
      console.error("Delete failed", e);
      throw e;
    }
  };

  // Implementations
  const addPatient = (item: Patient) => createItem(patientsAPI, item, setPatients);
  const updatePatient = (id: string, updates: Partial<Patient>) => updateItem(patientsAPI, id, updates, setPatients);
  const deletePatient = (id: string) => deleteItem(patientsAPI, id, setPatients);

  const archivePatient = async (id: string) => {
    await patientsAPI.archive(id);
    refreshData(); // Easier to refresh than manually manage local state for archive logic
  };
  const restorePatient = async (id: string) => {
    await patientsAPI.restore(id);
    refreshData();
  };

  const addAppointment = (item: Appointment) => createItem(appointmentsAPI, item, setAppointments);
  const updateAppointment = (id: string, updates: Partial<Appointment>) => updateItem(appointmentsAPI, id, updates, setAppointments);
  const deleteAppointment = (id: string) => deleteItem(appointmentsAPI, id, setAppointments);

  const addInvoice = (item: Invoice) => createItem(invoicesAPI, item, setInvoices);
  const addInventoryItem = (item: InventoryItem) => createItem(inventoryAPI, item, setInventory);
  const addAmbulance = (item: Ambulance) => createItem(ambulancesAPI, item, setAmbulances);
  const addStaff = (item: Doctor) => createItem(staffAPI, item, setStaff);

  const addTask = (item: Task) => createItem(tasksAPI, item, setTasks);
  const updateTask = (id: string, updates: Partial<Task>) => updateItem<Task>(tasksAPI, id, updates, setTasks);
  const deleteTask = (id: string) => deleteItem(tasksAPI, id, setTasks);
  const updateTaskStatus = (id: string, status: 'Todo' | 'In Progress' | 'Done') => updateItem<Task>(tasksAPI, id, { status }, setTasks);

  const addNotice = (item: Notice) => createItem(noticesAPI, item, setNotices);
  const updateNotice = (id: string, updates: Partial<Notice>) => updateItem(noticesAPI, id, updates, setNotices);
  const deleteNotice = (id: string) => deleteItem(noticesAPI, id, setNotices);

  const updateBedStatus = (id: string, status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance') => updateItem<Bed>(bedsAPI, id, { status }, setBeds);

  const addLabRequest = (item: LabTestRequest) => createItem(labRequestsAPI, item, setLabRequests);
  const addRadiologyRequest = (item: RadiologyRequest) => createItem(radiologyAPI, item, setRadiologyRequests);
  const addReferral = (item: Referral) => createItem(referralsAPI, item, setReferrals);
  const addMedicalCertificate = (item: MedicalCertificate) => createItem(certificatesAPI, item, setMedicalCertificates);
  const addResearchTrial = (item: ResearchTrial) => createItem(researchTrialsAPI, item, setResearchTrials);
  const addMaternityPatient = (item: MaternityPatient) => createItem(maternityAPI, item, setMaternityPatients);

  const addToQueue = (item: QueueItem) => createItem(opdQueueAPI, item, setOpdQueue);
  const updateQueueItem = (id: string, updates: Partial<QueueItem>) => updateItem(opdQueueAPI, id, updates, setOpdQueue);

  const addBloodUnit = (item: BloodUnit) => createItem(bloodUnitsAPI, item, setBloodUnits);
  const updateBloodUnit = (id: string, updates: Partial<BloodUnit>) => updateItem(bloodUnitsAPI, id, updates, setBloodUnits);
  const addBloodBag = (item: BloodBag) => createItem(bloodBagsAPI, item, setBloodBags);
  const updateBloodBag = (id: string, updates: Partial<BloodBag>) => updateItem(bloodBagsAPI, id, updates, setBloodBags);
  const deleteBloodBag = (id: string) => deleteItem(bloodBagsAPI, id, setBloodBags);
  const addBloodDonor = (item: BloodDonor) => createItem(bloodDonorsAPI, item, setBloodDonors);
  const updateBloodDonor = (id: string, updates: Partial<BloodDonor>) => updateItem(bloodDonorsAPI, id, updates, setBloodDonors);
  const deleteBloodDonor = (id: string) => deleteItem(bloodDonorsAPI, id, setBloodDonors);
  const addBloodRequest = (item: BloodRequest) => createItem(bloodRequestsAPI, item, setBloodRequests);
  const updateBloodRequest = (id: string, updates: Partial<BloodRequest>) => updateItem(bloodRequestsAPI, id, updates, setBloodRequests);

  const getStats = () => {
    const totalPatients = patients.length;
    const totalAppointments = appointments.filter(a => a.status !== 'Cancelled').length;
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.status === 'Paid' ? inv.amount : 0), 0);
    const pendingRevenue = invoices.reduce((sum, inv) => sum + (inv.status === 'Pending' ? inv.amount : 0), 0);

    return { totalPatients, totalAppointments, totalRevenue, pendingRevenue };
  };

  return (
    <DataContext.Provider value={{
      patients, appointments, invoices, inventory, ambulances, staff, tasks, beds, notices,
      labRequests, radiologyRequests, referrals, medicalCertificates, researchTrials,
      maternityPatients, opdQueue, bloodUnits, bloodBags, bloodDonors, bloodRequests,
      isLoading, refreshData,
      addPatient, updatePatient, deletePatient, archivePatient, restorePatient,
      addAppointment, updateAppointment, deleteAppointment,
      addInvoice, addInventoryItem, addAmbulance, addStaff,
      addTask, updateTask, deleteTask, updateTaskStatus,
      addNotice, updateNotice, deleteNotice,
      updateBedStatus,
      addLabRequest, addRadiologyRequest, addReferral, addMedicalCertificate, addResearchTrial, addMaternityPatient,
      addToQueue, updateQueueItem,
      addBloodUnit, updateBloodUnit, addBloodBag, updateBloodBag, deleteBloodBag,
      addBloodDonor, updateBloodDonor, deleteBloodDonor, addBloodRequest, updateBloodRequest,
      getStats
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
