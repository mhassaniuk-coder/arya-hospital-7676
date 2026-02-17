/**
 * Advanced AI Service — 25 new features via backend API
 * Calls /api/ai/advanced/* endpoints on the Python backend.
 */

const API_BASE = 'http://localhost:5000/api/ai/advanced';

async function post<T>(endpoint: string, data: any): Promise<T> {
    const token = localStorage.getItem('nexus_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `AI Error: ${res.status}`);
    }
    return res.json();
}

// ── 1. Sepsis Early Warning ──
export interface SepsisInput {
    patient_name: string;
    temperature: number;
    heart_rate: number;
    respiratory_rate: number;
    wbc_count?: number;
    blood_pressure_systolic?: number;
    lactate_level?: number;
    mental_status?: string;
}
export const predictSepsis = (data: SepsisInput) => post<any>('/sepsis-predictor', data);

// ── 2. Drug-Drug Interaction Checker ──
export interface DrugInteractionInput {
    medications: string[];
    patient_age?: number;
    patient_weight?: number;
    renal_function?: string;
    hepatic_function?: string;
}
export const checkDrugInteractions = (data: DrugInteractionInput) => post<any>('/drug-interactions', data);

// ── 3. Clinical Pathway Recommender ──
export interface PathwayInput {
    diagnosis: string;
    patient_age: number;
    comorbidities?: string[];
    severity?: string;
    insurance_type?: string;
}
export const recommendPathway = (data: PathwayInput) => post<any>('/clinical-pathway', data);

// ── 4. Patient Risk Stratification ──
export interface RiskStratificationInput {
    patient_name: string;
    age: number;
    gender: string;
    diagnoses: string[];
    medications?: string[];
    lab_results?: Record<string, any>;
    social_factors?: Record<string, any>;
}
export const stratifyRisk = (data: RiskStratificationInput) => post<any>('/risk-stratification', data);

// ── 5. Smart Scheduling Optimizer ──
export interface SmartSchedulingInput {
    department: string;
    date: string;
    existing_appointments?: any[];
    available_doctors?: string[];
    patient_priorities?: any[];
}
export const optimizeScheduling = (data: SmartSchedulingInput) => post<any>('/smart-scheduling', data);

// ── 6. Surgical Complication Predictor ──
export interface SurgicalRiskInput {
    procedure: string;
    patient_age: number;
    bmi?: number;
    asa_class?: number;
    comorbidities?: string[];
    previous_surgeries?: string[];
    anesthesia_type?: string;
}
export const predictSurgicalRisk = (data: SurgicalRiskInput) => post<any>('/surgical-risk', data);

// ── 7. NLP Medical Records Analyzer ──
export interface NLPRecordsInput {
    clinical_text: string;
    extract_entities?: boolean;
    summarize?: boolean;
    identify_negations?: boolean;
}
export const analyzeRecordsNLP = (data: NLPRecordsInput) => post<any>('/nlp-records', data);

// ── 8. Cancer Screening Risk Assessor ──
export interface CancerScreeningInput {
    patient_age: number;
    gender: string;
    family_history?: string[];
    smoking_status?: string;
    bmi?: number;
    previous_screenings?: any[];
}
export const assessCancerScreening = (data: CancerScreeningInput) => post<any>('/cancer-screening', data);

// ── 9. Nutrition & Diet Planner ──
export interface NutritionPlanInput {
    patient_name: string;
    diagnosis: string;
    diet_restrictions?: string[];
    allergies?: string[];
    bmi?: number;
    caloric_target?: number;
}
export const planNutrition = (data: NutritionPlanInput) => post<any>('/nutrition-planner', data);

// ── 10. Mental Health Screening ──
export interface MentalHealthInput {
    patient_age: number;
    gender: string;
    presenting_concerns: string[];
    phq9_score?: number;
    gad7_score?: number;
    sleep_quality?: string;
    substance_use?: string;
}
export const screenMentalHealth = (data: MentalHealthInput) => post<any>('/mental-health-screening', data);

// ── 11. Pandemic Simulation ──
export interface PandemicSimInput {
    pathogen_type: string;
    current_cases: number;
    hospital_capacity: number;
    icu_beds: number;
    ventilators: number;
    staff_count: number;
    region_population: number;
}
export const simulatePandemic = (data: PandemicSimInput) => post<any>('/pandemic-simulation', data);

// ── 12. Clinical Trial Eligibility ──
export interface TrialMatchInput {
    patient_age: number;
    gender: string;
    diagnosis: string;
    stage?: string;
    biomarkers?: string[];
    previous_treatments?: string[];
    ecog_status?: number;
}
export const matchTrialEligibility = (data: TrialMatchInput) => post<any>('/trial-eligibility', data);

// ── 13. Treatment Cost Estimator ──
export interface CostEstimateInput {
    diagnosis: string;
    treatment_plan: string[];
    insurance_type?: string;
    length_of_stay_estimate?: number;
}
export const estimateTreatmentCost = (data: CostEstimateInput) => post<any>('/cost-estimator', data);

// ── 14. Genetic Risk Analysis ──
export interface GeneticRiskInput {
    patient_age: number;
    gender: string;
    family_history: string[];
    ethnicity?: string;
    known_mutations?: string[];
}
export const analyzeGeneticRisk = (data: GeneticRiskInput) => post<any>('/genetic-risk', data);

// ── 15. Emergency Response Optimizer ──
export interface EmergencyResponseInput {
    incident_type: string;
    severity: string;
    location: string;
    casualties_estimated: number;
    available_resources: Record<string, any>;
}
export const optimizeEmergencyResponse = (data: EmergencyResponseInput) => post<any>('/emergency-response', data);

// ── 16. Population Health Analytics ──
export interface PopulationHealthInput {
    demographic_data: Record<string, any>;
    disease_prevalence: Record<string, any>;
    time_period: string;
    interventions?: string[];
}
export const analyzePopulationHealth = (data: PopulationHealthInput) => post<any>('/population-health', data);

// ── 17. Patient Journey Mapper ──
export interface PatientJourneyInput {
    patient_name: string;
    encounters: any[];
    chief_complaint: string;
}
export const mapPatientJourney = (data: PatientJourneyInput) => post<any>('/patient-journey', data);

// ── 18. Chronic Disease Manager ──
export interface ChronicDiseaseInput {
    condition: string;
    patient_age: number;
    duration_years: number;
    current_medications: string[];
    recent_labs?: Record<string, any>;
    complications?: string[];
    lifestyle_factors?: Record<string, any>;
}
export const manageChronicDisease = (data: ChronicDiseaseInput) => post<any>('/chronic-disease-manager', data);

// ── 19. Wound Assessment ──
export interface WoundAssessmentInput {
    wound_type: string;
    location: string;
    size_cm?: string;
    depth?: string;
    drainage?: string;
    surrounding_skin?: string;
    duration_days: number;
    patient_comorbidities?: string[];
}
export const assessWound = (data: WoundAssessmentInput) => post<any>('/wound-assessment', data);

// ── 20. Speech-to-SOAP Note ──
export interface SpeechToSOAPInput {
    transcription: string;
    visit_type?: string;
    specialty?: string;
}
export const convertSpeechToSOAP = (data: SpeechToSOAPInput) => post<any>('/speech-to-soap', data);

// ── 21. ICD/CPT Auto-Coder ──
export interface AutoCoderInput {
    clinical_documentation: string;
    visit_type: string;
    procedures_performed?: string[];
}
export const autoCodeICDCPT = (data: AutoCoderInput) => post<any>('/auto-coder', data);

// ── 22. AI Radiology Report ──
export interface RadReportInput {
    modality: string;
    body_part: string;
    clinical_indication: string;
    findings_notes: string;
    comparison_available?: boolean;
}
export const generateRadiologyReport = (data: RadReportInput) => post<any>('/radiology-report', data);

// ── 23. Pharmacovigilance ──
export interface PharmacovigilanceInput {
    medication: string;
    adverse_event: string;
    patient_age: number;
    patient_gender: string;
    dose: string;
    duration: string;
    other_medications?: string[];
}
export const assessPharmacovigilance = (data: PharmacovigilanceInput) => post<any>('/pharmacovigilance', data);

// ── 24. Predictive Staffing ──
export interface PredictiveStaffingInput {
    department: string;
    historical_census?: any[];
    upcoming_admissions?: number;
    upcoming_surgeries?: number;
    day_of_week?: string;
    season?: string;
    special_events?: string[];
}
export const predictStaffing = (data: PredictiveStaffingInput) => post<any>('/predictive-staffing', data);

// ── 25. Quality Metrics Analyzer ──
export interface QualityMetricsInput {
    department: string;
    metric_type: string;
    time_period: string;
    current_data: Record<string, any>;
    benchmark_data?: Record<string, any>;
}
export const analyzeQualityMetrics = (data: QualityMetricsInput) => post<any>('/quality-metrics', data);
