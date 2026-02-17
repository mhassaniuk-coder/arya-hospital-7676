/// <reference types="vite/client" />
/**
 * NexusHealth HMS API Client
 * Centralized HTTP client for communicating with the FastAPI backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
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
    login: (data: { email: string; password: string }) =>
        request<{ access_token: string; user: any }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    me: () => request<any>('/auth/me'),
};

// ── Generic CRUD Factory ──
function createCRUD<T>(endpoint: string) {
    return {
        list: () => request<T[]>(endpoint),
        get: (id: string) => request<T>(`${endpoint}/${id}`),
        create: (data: Partial<T>) =>
            request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: Partial<T>) =>
            request<T>(`${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) =>
            request<{ detail: string }>(`${endpoint}/${id}`, { method: 'DELETE' }),
    };
}

// ── Entity APIs ──
export const patientsAPI = {
    ...createCRUD<any>('/patients'),
    archive: (id: string) =>
        request<any>(`/patients/${id}/archive`, { method: 'PATCH' }),
    restore: (id: string) =>
        request<any>(`/patients/${id}/restore`, { method: 'PATCH' }),
};

export const appointmentsAPI = createCRUD<any>('/appointments');
export const invoicesAPI = createCRUD<any>('/invoices');
export const inventoryAPI = createCRUD<any>('/inventory');
export const ambulancesAPI = createCRUD<any>('/ambulances');
export const staffAPI = createCRUD<any>('/staff');
export const tasksAPI = createCRUD<any>('/tasks');
export const bedsAPI = createCRUD<any>('/beds');
export const noticesAPI = createCRUD<any>('/notices');
export const labRequestsAPI = createCRUD<any>('/lab-requests');
export const radiologyAPI = createCRUD<any>('/radiology');
export const referralsAPI = createCRUD<any>('/referrals');
export const certificatesAPI = createCRUD<any>('/certificates');
export const researchTrialsAPI = createCRUD<any>('/research-trials');
export const maternityAPI = createCRUD<any>('/maternity');
export const opdQueueAPI = createCRUD<any>('/opd-queue');
export const bloodUnitsAPI = createCRUD<any>('/blood-units');
export const bloodBagsAPI = createCRUD<any>('/blood-bags');
export const bloodDonorsAPI = createCRUD<any>('/blood-donors');
export const bloodRequestsAPI = createCRUD<any>('/blood-requests');

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
export const aiAPI = {
    triage: (data: { patient_name: string; symptoms: string[]; age?: number; gender?: string; vital_signs?: Record<string, any> }) =>
        request<any>('/ai/triage', { method: 'POST', body: JSON.stringify(data) }),
    analyzeNotes: (notes: string) =>
        request<any>('/ai/analyze-notes', { method: 'POST', body: JSON.stringify({ notes }) }),
    dischargeSummary: (data: { patient_name: string; condition: string; history: string }) =>
        request<any>('/ai/discharge-summary', { method: 'POST', body: JSON.stringify(data) }),
    generic: (prompt: string, context?: Record<string, any>) =>
        request<any>('/ai/generic', { method: 'POST', body: JSON.stringify({ prompt, context }) }),
};

// ── Health Check ──
export const healthAPI = {
    check: () => request<{ status: string; service: string }>('/health'),
};
