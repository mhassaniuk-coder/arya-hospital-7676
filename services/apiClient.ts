/// <reference types="vite/client" />
/**
 * NexusHealth HMS API Client
 * Centralized HTTP client for communicating with the FastAPI backend.
 * 
 * MODIFIED: Added Demo Mode support to fallback to mock data when backend is unreachable.
 */

import * as Mocks from './mockData';
import { UserRole } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Force Demo Mode if environment variable is set
// Default to Mock Mode unless explicitly disabled
// This ensures the app works immediately for demo purposes without backend setup
const DEMO_MODE = import.meta.env.VITE_USE_MOCK !== 'false';

console.log(`API Client initialized. Mode: ${DEMO_MODE ? 'DEMO (Mock Data)' : 'PRODUCTION (Real API)'}`);

// ── Token Management ──
let accessToken: string | null = localStorage.getItem('nexus_token');

export const setToken = (token: string | null) => {
    accessToken = token;
    if (token) {
        localStorage.setItem('nexus_token', token);
    } else {
        localStorage.removeItem('nexus_token');
    }
};

export const getToken = () => accessToken;

// ── Core Fetch Wrapper ──
// Store the selected role for demo mode login
let selectedDemoRole: UserRole | null = null;

export const setDemoRole = (role: UserRole | null) => {
    selectedDemoRole = role;
};

export const getDemoRole = () => selectedDemoRole;

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    if (DEMO_MODE) {
        // Find matching mock handler
        // This is a simplified router for mock data
        console.log(`[Mock API] ${options.method || 'GET'} ${endpoint}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                // Auth Mocks - Demo Mode with Role Selection
                if (endpoint === '/auth/login') {
                    // Parse the request body to get the role
                    let user = Mocks.MOCK_USERS[0]; // Default to Admin
                    try {
                        const body = options.body ? JSON.parse(options.body as string) : {};
                        const requestedRole = body.role || selectedDemoRole;
                        if (requestedRole) {
                            const foundUser = Mocks.getMockUserByRole(requestedRole as UserRole);
                            if (foundUser) user = foundUser;
                        }
                    } catch (e) {
                        // Use default user if parsing fails
                    }
                    return resolve({ access_token: 'mock-jwt-token', user } as any);
                }
                if (endpoint === '/auth/register') {
                    // For register, use the role from the request body
                    let user = Mocks.MOCK_USERS[0];
                    try {
                        const body = options.body ? JSON.parse(options.body as string) : {};
                        if (body.role) {
                            const foundUser = Mocks.getMockUserByRole(body.role as UserRole);
                            if (foundUser) user = { ...foundUser, name: body.name || foundUser.name };
                        }
                    } catch (e) {
                        // Use default user if parsing fails
                    }
                    return resolve({ access_token: 'mock-jwt-token', user } as any);
                }
                if (endpoint === '/auth/me') {
                    // Return user based on stored role or default
                    const user = selectedDemoRole ? Mocks.getMockUserByRole(selectedDemoRole) || Mocks.MOCK_USERS[0] : Mocks.MOCK_USERS[0];
                    return resolve(user as any);
                }

                // Stats
                if (endpoint === '/stats') return resolve({
                    total_patients: Mocks.MOCK_PATIENTS.length,
                    total_appointments: Mocks.MOCK_APPOINTMENTS.length,
                    total_revenue: Mocks.MOCK_INVOICES.reduce((sum, i) => sum + i.amount, 0),
                    pending_revenue: 5000,
                    total_staff: Mocks.MOCK_STAFF.length,
                    available_beds: Mocks.MOCK_BEDS.filter(b => b.status === 'Available').length,
                    occupied_beds: Mocks.MOCK_BEDS.filter(b => b.status === 'Occupied').length,
                    pending_labs: Mocks.MOCK_LAB_REQUESTS.filter(l => l.status !== 'Completed').length,
                    active_ambulances: Mocks.MOCK_AMBULANCES.filter(a => a.status !== 'Available').length,
                } as any);

                // AI Mocks
                if (endpoint.startsWith('/ai/')) return resolve({
                    analysis: "Mock AI Analysis: Patient shows signs of stability.",
                    risk_score: 15,
                    recommendation: "Continue current medication."
                } as any);

                // Health Check
                if (endpoint === '/health') return resolve({ status: 'ok', service: 'NexusHealth Mock API' } as any);

                resolve({} as any);
            }, 500); // Simulate network latency
        });
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(error.detail || `API Error: ${res.status}`);
    }

    return res.json();
}

// ── Auth API ──
export const authAPI = {
    register: (data: { name: string; email: string; password: string; role?: string }) =>
        request<{ access_token: string; user: any }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    login: (data: { email: string; password: string; role?: UserRole }) =>
        request<{ access_token: string; user: any }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    me: () => request<any>('/auth/me'),
};

// ── Generic CRUD Factory ──
function createCRUD<T>(endpoint: string, mockSource: T[]) {
    return {
        list: () => DEMO_MODE ? Promise.resolve(mockSource) : request<T[]>(endpoint),
        get: (id: string) => DEMO_MODE
            ? Promise.resolve(mockSource.find((i: any) => i.id === id) as T)
            : request<T>(`${endpoint}/${id}`),
        create: (data: Partial<T>) => {
            if (DEMO_MODE) {
                const newItem = { ...data, id: Math.random().toString(36).substr(2, 9) } as T;
                mockSource.push(newItem);
                return Promise.resolve(newItem);
            }
            return request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) });
        },
        update: (id: string, data: Partial<T>) => {
            if (DEMO_MODE) {
                const index = mockSource.findIndex((i: any) => i.id === id);
                if (index !== -1) mockSource[index] = { ...mockSource[index], ...data };
                return Promise.resolve(mockSource[index]);
            }
            return request<T>(`${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        },
        delete: (id: string) => {
            if (DEMO_MODE) {
                const index = mockSource.findIndex((i: any) => i.id === id);
                if (index !== -1) mockSource.splice(index, 1);
                return Promise.resolve({ detail: "Deleted" });
            }
            return request<{ detail: string }>(`${endpoint}/${id}`, { method: 'DELETE' });
        },
    };
}

// ── Entity APIs ──
export const patientsAPI = {
    ...createCRUD<any>('/patients', Mocks.MOCK_PATIENTS),
    archive: (id: string) => DEMO_MODE ? Promise.resolve() : request<any>(`/patients/${id}/archive`, { method: 'PATCH' }),
    restore: (id: string) => DEMO_MODE ? Promise.resolve() : request<any>(`/patients/${id}/restore`, { method: 'PATCH' }),
};

export const appointmentsAPI = createCRUD<any>('/appointments', Mocks.MOCK_APPOINTMENTS);
export const invoicesAPI = createCRUD<any>('/invoices', Mocks.MOCK_INVOICES);
export const inventoryAPI = createCRUD<any>('/inventory', Mocks.MOCK_INVENTORY);
export const ambulancesAPI = createCRUD<any>('/ambulances', Mocks.MOCK_AMBULANCES);
export const staffAPI = createCRUD<any>('/staff', Mocks.MOCK_STAFF);
export const tasksAPI = createCRUD<any>('/tasks', Mocks.MOCK_TASKS);
export const bedsAPI = createCRUD<any>('/beds', Mocks.MOCK_BEDS);
export const noticesAPI = createCRUD<any>('/notices', Mocks.MOCK_NOTICES);
export const labRequestsAPI = createCRUD<any>('/lab-requests', Mocks.MOCK_LAB_REQUESTS);
export const radiologyAPI = createCRUD<any>('/radiology', Mocks.MOCK_RADIOLOGY);
export const referralsAPI = createCRUD<any>('/referrals', Mocks.MOCK_REFERRALS);
export const certificatesAPI = createCRUD<any>('/certificates', Mocks.MOCK_CERTIFICATES);
export const researchTrialsAPI = createCRUD<any>('/research-trials', Mocks.MOCK_RESEARCH);
export const maternityAPI = createCRUD<any>('/maternity', Mocks.MOCK_MATERNITY);
export const opdQueueAPI = createCRUD<any>('/opd-queue', Mocks.MOCK_QUEUE);
export const bloodUnitsAPI = createCRUD<any>('/blood-units', Mocks.MOCK_BLOOD_UNITS);
export const bloodBagsAPI = createCRUD<any>('/blood-bags', Mocks.MOCK_BLOOD_BAGS);
export const bloodDonorsAPI = createCRUD<any>('/blood-donors', Mocks.MOCK_BLOOD_DONORS);
export const bloodRequestsAPI = createCRUD<any>('/blood-requests', Mocks.MOCK_BLOOD_REQUESTS);
export const departmentsAPI = createCRUD<any>('/departments', Mocks.MOCK_DEPARTMENTS);

// ── Stats API ──
export const statsAPI = {
    getDashboard: () =>
        request<{
            total_patients: number;
            total_appointments: number;
            total_revenue: number;
            pending_revenue: number;
            total_staff: number;
            available_beds: number;
            occupied_beds: number;
            pending_labs: number;
            active_ambulances: number;
        }>('/stats'),
};

// ── AI API ──
// Use generic request which handles the mock check
export const aiAPI = {
    triage: (data: any) => request<any>('/ai/triage', { method: 'POST', body: JSON.stringify(data) }),
    analyzeNotes: (notes: string) => request<any>('/ai/analyze-notes', { method: 'POST', body: JSON.stringify({ notes }) }),
    dischargeSummary: (data: any) => request<any>('/ai/discharge-summary', { method: 'POST', body: JSON.stringify(data) }),
    generic: (prompt: string, context?: any) => request<any>('/ai/generic', { method: 'POST', body: JSON.stringify({ prompt, context }) }),
};

// ── Health Check ──
export const healthAPI = {
    check: () => request<{ status: string; service: string }>('/health'),
};
