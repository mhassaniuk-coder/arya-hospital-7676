import React, { useState } from 'react';
import {
    useSepsisPredictor,
    useDrugInteractionChecker,
    useClinicalPathway,
    useRiskStratification,
    useSmartScheduling,
    useSurgicalRiskPredictor,
    useNLPRecordsAnalyzer,
    useCancerScreening,
    useNutritionPlanner,
    useMentalHealthScreening,
    usePandemicSimulation,
    useTrialEligibility,
    useTreatmentCostEstimator,
    useGeneticRiskAnalysis,
    useEmergencyResponseOptimizer,
    usePopulationHealthAnalytics,
    usePatientJourneyMapper,
    useChronicDiseaseManager,
    useWoundAssessment,
    useSpeechToSOAP,
    useICDAutoCoder,
    useRadiologyReportGenerator,
    usePharmacovigilance,
    usePredictiveStaffing,
    useQualityMetricsAnalyzer,
} from '../hooks/useAdvancedAI';

interface AIFeatureCard {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    color: string;
}

const AI_FEATURES: AIFeatureCard[] = [
    { id: 'sepsis', name: 'Sepsis Early Warning', description: 'Predict sepsis risk using qSOFA/SIRS criteria with real-time vital analysis', category: 'Clinical Intelligence', icon: '🔴', color: '#ef4444' },
    { id: 'drug-interactions', name: 'Drug-Drug Interactions', description: 'Analyze multi-drug interactions with severity scoring and alternatives', category: 'Clinical Intelligence', icon: '💊', color: '#f97316' },
    { id: 'pathway', name: 'Clinical Pathway', description: 'Evidence-based day-by-day treatment pathways with milestones', category: 'Clinical Intelligence', icon: '🛤️', color: '#eab308' },
    { id: 'risk-strat', name: 'Risk Stratification', description: 'Multi-dimensional scoring: Morse, Braden, Padua, VTE, malnutrition', category: 'Clinical Intelligence', icon: '📊', color: '#22c55e' },
    { id: 'surgical-risk', name: 'Surgical Complication', description: 'Pre-op risk assessment with ACS-NSQIP morbidity estimates', category: 'Clinical Intelligence', icon: '🔪', color: '#06b6d4' },
    { id: 'scheduling', name: 'Smart Scheduling', description: 'AI-optimized appointment scheduling with wait time prediction', category: 'Operational', icon: '📅', color: '#8b5cf6' },
    { id: 'nlp-records', name: 'NLP Records Analyzer', description: 'Extract entities, negations, temporal relations from clinical text', category: 'Data Intelligence', icon: '🔍', color: '#ec4899' },
    { id: 'cancer-screen', name: 'Cancer Screening', description: 'USPSTF/ACS/NCCN-guided screening recommendations by risk', category: 'Preventive Care', icon: '🎗️', color: '#f43f5e' },
    { id: 'nutrition', name: 'Nutrition Planner', description: 'Hospital diet planning with macro/micro breakdown and transitions', category: 'Patient Care', icon: '🥗', color: '#10b981' },
    { id: 'mental-health', name: 'Mental Health Screen', description: 'PHQ-9/GAD-7 interpretation with safety planning and referrals', category: 'Behavioral Health', icon: '🧠', color: '#6366f1' },
    { id: 'pandemic', name: 'Pandemic Simulation', description: '30-day projections with capacity timeline and surge planning', category: 'Public Health', icon: '🦠', color: '#dc2626' },
    { id: 'trial-match', name: 'Clinical Trial Match', description: 'Match patients to eligible clinical trials with scoring', category: 'Research', icon: '🧪', color: '#0ea5e9' },
    { id: 'cost-estimate', name: 'Cost Estimator', description: 'Itemized treatment costs with DRG, insurance, and optimization', category: 'Financial', icon: '💰', color: '#84cc16' },
    { id: 'genetic-risk', name: 'Genetic Risk Analysis', description: 'Hereditary disease risk with pharmacogenomic considerations', category: 'Genomics', icon: '🧬', color: '#a855f7' },
    { id: 'emergency', name: 'Emergency Response', description: 'Mass casualty triage, resource deployment, surge activation', category: 'Emergency', icon: '🚨', color: '#ef4444' },
    { id: 'pop-health', name: 'Population Health', description: 'Health disparities, HEDIS measures, trend analysis', category: 'Public Health', icon: '📈', color: '#14b8a6' },
    { id: 'journey', name: 'Patient Journey Map', description: 'Visualize care continuum, identify gaps, predict next encounters', category: 'Patient Experience', icon: '🗺️', color: '#f59e0b' },
    { id: 'chronic', name: 'Chronic Disease Mgr', description: 'Personalized care plans with quarterly goals and telehealth', category: 'Patient Care', icon: '♻️', color: '#3b82f6' },
    { id: 'wound', name: 'Wound Assessment', description: 'Wagner/Bates-Jensen scoring with healing trajectory prediction', category: 'Nursing', icon: '🩹', color: '#e11d48' },
    { id: 'soap', name: 'Speech → SOAP Note', description: 'Convert dictation to structured SOAP with ICD-10/CPT codes', category: 'Documentation', icon: '🎤', color: '#7c3aed' },
    { id: 'auto-coder', name: 'ICD/CPT Auto-Coder', description: 'AI-powered medical coding with HCC and DRG assignment', category: 'Revenue Cycle', icon: '🏷️', color: '#059669' },
    { id: 'rad-report', name: 'Radiology Report AI', description: 'Structured radiology reports with BI-RADS/Lung-RADS scoring', category: 'Radiology', icon: '🩻', color: '#2563eb' },
    { id: 'pharma-vig', name: 'Pharmacovigilance', description: 'Naranjo score, WHO-UMC assessment, MedWatch reporting', category: 'Drug Safety', icon: '⚠️', color: '#d97706' },
    { id: 'staffing', name: 'Predictive Staffing', description: 'Census prediction with optimal nurse-to-patient ratios', category: 'Workforce', icon: '👩‍⚕️', color: '#0891b2' },
    { id: 'quality', name: 'Quality Metrics', description: 'CMS Star Rating, Leapfrog Grade, HCAHPS performance analysis', category: 'Quality', icon: '⭐', color: '#ca8a04' },
];

const CATEGORIES = [...new Set(AI_FEATURES.map(f => f.category))];

const AICommandCenter: React.FC = () => {
    const [activeFeature, setActiveFeature] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Record<string, any>>({});
    const [formData, setFormData] = useState<Record<string, any>>({});

    // Feature hooks
    const sepsis = useSepsisPredictor();
    const drugInteractions = useDrugInteractionChecker();
    const pathway = useClinicalPathway();
    const riskStrat = useRiskStratification();
    const scheduling = useSmartScheduling();
    const surgicalRisk = useSurgicalRiskPredictor();
    const nlpRecords = useNLPRecordsAnalyzer();
    const cancerScreen = useCancerScreening();
    const nutrition = useNutritionPlanner();
    const mentalHealth = useMentalHealthScreening();
    const pandemic = usePandemicSimulation();
    const trialMatch = useTrialEligibility();
    const costEstimate = useTreatmentCostEstimator();
    const geneticRisk = useGeneticRiskAnalysis();
    const emergency = useEmergencyResponseOptimizer();
    const popHealth = usePopulationHealthAnalytics();
    const journey = usePatientJourneyMapper();
    const chronic = useChronicDiseaseManager();
    const wound = useWoundAssessment();
    const soap = useSpeechToSOAP();
    const autoCoder = useICDAutoCoder();
    const radReport = useRadiologyReportGenerator();
    const pharmaVig = usePharmacovigilance();
    const staffing = usePredictiveStaffing();
    const quality = useQualityMetricsAnalyzer();

    const hookMap: Record<string, any> = {
        sepsis, 'drug-interactions': drugInteractions, pathway, 'risk-strat': riskStrat,
        scheduling, 'surgical-risk': surgicalRisk, 'nlp-records': nlpRecords,
        'cancer-screen': cancerScreen, nutrition, 'mental-health': mentalHealth,
        pandemic, 'trial-match': trialMatch, 'cost-estimate': costEstimate,
        'genetic-risk': geneticRisk, emergency, 'pop-health': popHealth,
        journey, chronic, wound, soap, 'auto-coder': autoCoder,
        'rad-report': radReport, 'pharma-vig': pharmaVig, staffing, quality,
    };

    const filtered = AI_FEATURES.filter(f => {
        const matchCat = activeCategory === 'All' || f.category === activeCategory;
        const matchSearch = !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    const getFormConfig = (id: string): { label: string; key: string; type: string; placeholder: string }[] => {
        const configs: Record<string, any[]> = {
            sepsis: [
                { label: 'Patient Name', key: 'patient_name', type: 'text', placeholder: 'John Doe' },
                { label: 'Temperature (°C)', key: 'temperature', type: 'number', placeholder: '38.5' },
                { label: 'Heart Rate (bpm)', key: 'heart_rate', type: 'number', placeholder: '110' },
                { label: 'Respiratory Rate', key: 'respiratory_rate', type: 'number', placeholder: '22' },
                { label: 'WBC Count', key: 'wbc_count', type: 'number', placeholder: '15000' },
                { label: 'Systolic BP', key: 'blood_pressure_systolic', type: 'number', placeholder: '90' },
            ],
            'drug-interactions': [
                { label: 'Medications (comma-separated)', key: 'medications', type: 'text', placeholder: 'Warfarin, Aspirin, Omeprazole' },
                { label: 'Patient Age', key: 'patient_age', type: 'number', placeholder: '65' },
                { label: 'Renal Function', key: 'renal_function', type: 'text', placeholder: 'Normal / eGFR 30' },
            ],
            pathway: [
                { label: 'Diagnosis', key: 'diagnosis', type: 'text', placeholder: 'Community-acquired pneumonia' },
                { label: 'Patient Age', key: 'patient_age', type: 'number', placeholder: '72' },
                { label: 'Comorbidities', key: 'comorbidities', type: 'text', placeholder: 'COPD, Diabetes' },
                { label: 'Severity', key: 'severity', type: 'text', placeholder: 'Moderate' },
            ],
            'risk-strat': [
                { label: 'Patient Name', key: 'patient_name', type: 'text', placeholder: 'Jane Smith' },
                { label: 'Age', key: 'age', type: 'number', placeholder: '78' },
                { label: 'Gender', key: 'gender', type: 'text', placeholder: 'Female' },
                { label: 'Diagnoses', key: 'diagnoses', type: 'text', placeholder: 'CHF, CKD Stage 3' },
            ],
            'surgical-risk': [
                { label: 'Procedure', key: 'procedure', type: 'text', placeholder: 'Total hip replacement' },
                { label: 'Patient Age', key: 'patient_age', type: 'number', placeholder: '68' },
                { label: 'BMI', key: 'bmi', type: 'number', placeholder: '31.5' },
                { label: 'ASA Class', key: 'asa_class', type: 'number', placeholder: '3' },
                { label: 'Comorbidities', key: 'comorbidities', type: 'text', placeholder: 'Diabetes, HTN' },
            ],
            scheduling: [
                { label: 'Department', key: 'department', type: 'text', placeholder: 'Cardiology' },
                { label: 'Date', key: 'date', type: 'text', placeholder: '2024-02-20' },
                { label: 'Available Doctors', key: 'available_doctors', type: 'text', placeholder: 'Dr. Chen, Dr. Ross' },
            ],
            'nlp-records': [
                { label: 'Clinical Text', key: 'clinical_text', type: 'textarea', placeholder: 'Paste clinical notes here...' },
            ],
            'cancer-screen': [
                { label: 'Patient Age', key: 'patient_age', type: 'number', placeholder: '55' },
                { label: 'Gender', key: 'gender', type: 'text', placeholder: 'Male' },
                { label: 'Family History', key: 'family_history', type: 'text', placeholder: 'Breast cancer, Colon cancer' },
                { label: 'Smoking Status', key: 'smoking_status', type: 'text', placeholder: 'Former smoker, 20 pack-years' },
            ],
            nutrition: [
                { label: 'Patient Name', key: 'patient_name', type: 'text', placeholder: 'John Doe' },
                { label: 'Diagnosis', key: 'diagnosis', type: 'text', placeholder: 'Diabetes T2' },
                { label: 'Diet Restrictions', key: 'diet_restrictions', type: 'text', placeholder: 'Low sodium, Diabetic' },
                { label: 'Allergies', key: 'allergies', type: 'text', placeholder: 'Peanuts, Shellfish' },
            ],
            'mental-health': [
                { label: 'Patient Age', key: 'patient_age', type: 'number', placeholder: '32' },
                { label: 'Gender', key: 'gender', type: 'text', placeholder: 'Female' },
                { label: 'Presenting Concerns', key: 'presenting_concerns', type: 'text', placeholder: 'Insomnia, low mood, fatigue' },
                { label: 'PHQ-9 Score', key: 'phq9_score', type: 'number', placeholder: '14' },
                { label: 'GAD-7 Score', key: 'gad7_score', type: 'number', placeholder: '10' },
            ],
            pandemic: [
                { label: 'Pathogen Type', key: 'pathogen_type', type: 'text', placeholder: 'Respiratory virus' },
                { label: 'Current Cases', key: 'current_cases', type: 'number', placeholder: '250' },
                { label: 'Hospital Capacity', key: 'hospital_capacity', type: 'number', placeholder: '500' },
                { label: 'ICU Beds', key: 'icu_beds', type: 'number', placeholder: '40' },
                { label: 'Staff Count', key: 'staff_count', type: 'number', placeholder: '800' },
                { label: 'Region Population', key: 'region_population', type: 'number', placeholder: '500000' },
            ],
            'trial-match': [
                { label: 'Patient Age', key: 'patient_age', type: 'number', placeholder: '58' },
                { label: 'Gender', key: 'gender', type: 'text', placeholder: 'Male' },
                { label: 'Diagnosis', key: 'diagnosis', type: 'text', placeholder: 'Non-small cell lung cancer' },
                { label: 'Stage', key: 'stage', type: 'text', placeholder: 'IIIB' },
                { label: 'Biomarkers', key: 'biomarkers', type: 'text', placeholder: 'EGFR+, PD-L1 60%' },
            ],
            'cost-estimate': [
                { label: 'Diagnosis', key: 'diagnosis', type: 'text', placeholder: 'Hip fracture' },
                { label: 'Treatment Plan', key: 'treatment_plan', type: 'text', placeholder: 'ORIF, PT, Pain management' },
                { label: 'Insurance', key: 'insurance_type', type: 'text', placeholder: 'Medicare' },
                { label: 'Est. Length of Stay', key: 'length_of_stay_estimate', type: 'number', placeholder: '5' },
            ],
            'genetic-risk': [
                { label: 'Patient Age', key: 'patient_age', type: 'number', placeholder: '35' },
                { label: 'Gender', key: 'gender', type: 'text', placeholder: 'Female' },
                { label: 'Family History', key: 'family_history', type: 'text', placeholder: 'BRCA1, Colon cancer in father' },
                { label: 'Ethnicity', key: 'ethnicity', type: 'text', placeholder: 'Ashkenazi Jewish' },
            ],
            emergency: [
                { label: 'Incident Type', key: 'incident_type', type: 'text', placeholder: 'Multi-vehicle accident' },
                { label: 'Severity', key: 'severity', type: 'text', placeholder: 'Major' },
                { label: 'Location', key: 'location', type: 'text', placeholder: 'Highway 101, Mile 45' },
                { label: 'Est. Casualties', key: 'casualties_estimated', type: 'number', placeholder: '15' },
            ],
            'pop-health': [
                { label: 'Time Period', key: 'time_period', type: 'text', placeholder: 'Q4 2024' },
                { label: 'Interventions', key: 'interventions', type: 'text', placeholder: 'Flu vaccination drive, Diabetes screening' },
            ],
            journey: [
                { label: 'Patient Name', key: 'patient_name', type: 'text', placeholder: 'Sarah Johnson' },
                { label: 'Chief Complaint', key: 'chief_complaint', type: 'text', placeholder: 'Recurring chest pain' },
            ],
            chronic: [
                { label: 'Condition', key: 'condition', type: 'text', placeholder: 'Type 2 Diabetes' },
                { label: 'Patient Age', key: 'patient_age', type: 'number', placeholder: '55' },
                { label: 'Duration (years)', key: 'duration_years', type: 'number', placeholder: '8' },
                { label: 'Current Medications', key: 'current_medications', type: 'text', placeholder: 'Metformin, Lisinopril' },
            ],
            wound: [
                { label: 'Wound Type', key: 'wound_type', type: 'text', placeholder: 'Diabetic foot ulcer' },
                { label: 'Location', key: 'location', type: 'text', placeholder: 'Right plantar surface' },
                { label: 'Size (cm)', key: 'size_cm', type: 'text', placeholder: '3x2x0.5' },
                { label: 'Duration (days)', key: 'duration_days', type: 'number', placeholder: '14' },
            ],
            soap: [
                { label: 'Transcription', key: 'transcription', type: 'textarea', placeholder: 'Patient presents with a three-day history of cough and fever...' },
                { label: 'Visit Type', key: 'visit_type', type: 'text', placeholder: 'Follow-up' },
                { label: 'Specialty', key: 'specialty', type: 'text', placeholder: 'Internal Medicine' },
            ],
            'auto-coder': [
                { label: 'Clinical Documentation', key: 'clinical_documentation', type: 'textarea', placeholder: 'Paste clinical note for coding...' },
                { label: 'Visit Type', key: 'visit_type', type: 'text', placeholder: 'Inpatient' },
                { label: 'Procedures', key: 'procedures_performed', type: 'text', placeholder: 'Chest X-ray, CBC, BMP' },
            ],
            'rad-report': [
                { label: 'Modality', key: 'modality', type: 'text', placeholder: 'CT Scan' },
                { label: 'Body Part', key: 'body_part', type: 'text', placeholder: 'Chest' },
                { label: 'Clinical Indication', key: 'clinical_indication', type: 'text', placeholder: 'Rule out PE' },
                { label: 'Findings Notes', key: 'findings_notes', type: 'textarea', placeholder: 'Describe preliminary findings...' },
            ],
            'pharma-vig': [
                { label: 'Medication', key: 'medication', type: 'text', placeholder: 'Amoxicillin' },
                { label: 'Adverse Event', key: 'adverse_event', type: 'text', placeholder: 'Severe rash, angioedema' },
                { label: 'Patient Age', key: 'patient_age', type: 'number', placeholder: '45' },
                { label: 'Gender', key: 'patient_gender', type: 'text', placeholder: 'Male' },
                { label: 'Dose', key: 'dose', type: 'text', placeholder: '500mg TID' },
                { label: 'Duration', key: 'duration', type: 'text', placeholder: '5 days' },
            ],
            staffing: [
                { label: 'Department', key: 'department', type: 'text', placeholder: 'Medical-Surgical' },
                { label: 'Day of Week', key: 'day_of_week', type: 'text', placeholder: 'Monday' },
                { label: 'Season', key: 'season', type: 'text', placeholder: 'Winter' },
                { label: 'Upcoming Admissions', key: 'upcoming_admissions', type: 'number', placeholder: '12' },
                { label: 'Upcoming Surgeries', key: 'upcoming_surgeries', type: 'number', placeholder: '5' },
            ],
            quality: [
                { label: 'Department', key: 'department', type: 'text', placeholder: 'ICU' },
                { label: 'Metric Type', key: 'metric_type', type: 'text', placeholder: 'readmission' },
                { label: 'Time Period', key: 'time_period', type: 'text', placeholder: 'Q4 2024' },
            ],
        };
        return configs[id] || [];
    };

    const handleSubmit = async (featureId: string) => {
        const hook = hookMap[featureId];
        if (!hook) return;

        const data = { ...formData[featureId] };
        // Parse comma-separated strings to arrays where needed
        const arrayFields = ['medications', 'comorbidities', 'diagnoses', 'family_history', 'presenting_concerns',
            'biomarkers', 'previous_treatments', 'diet_restrictions', 'allergies', 'current_medications',
            'patient_comorbidities', 'procedures_performed', 'other_medications', 'treatment_plan',
            'special_events', 'interventions', 'available_doctors', 'known_mutations', 'previous_surgeries'];
        for (const field of arrayFields) {
            if (data[field] && typeof data[field] === 'string') {
                data[field] = data[field].split(',').map((s: string) => s.trim()).filter(Boolean);
            }
        }
        // Parse number fields
        const numFields = ['temperature', 'heart_rate', 'respiratory_rate', 'wbc_count', 'blood_pressure_systolic',
            'patient_age', 'age', 'bmi', 'asa_class', 'phq9_score', 'gad7_score', 'current_cases', 'hospital_capacity',
            'icu_beds', 'ventilators', 'staff_count', 'region_population', 'duration_years', 'duration_days',
            'casualties_estimated', 'caloric_target', 'length_of_stay_estimate', 'upcoming_admissions', 'upcoming_surgeries',
            'ecog_status', 'patient_weight', 'lactate_level'];
        for (const field of numFields) {
            if (data[field]) data[field] = Number(data[field]);
        }
        // Special handling for emergency response
        if (featureId === 'emergency' && !data.available_resources) {
            data.available_resources = { ambulances: 10, doctors: 20, nurses: 40, beds: 100 };
        }
        if (featureId === 'pop-health') {
            data.demographic_data = { total_population: 100000, median_age: 38 };
            data.disease_prevalence = { diabetes: 12.5, hypertension: 30.2, obesity: 28.1 };
        }
        if (featureId === 'quality' && !data.current_data) {
            data.current_data = { rate: 14.2, national_avg: 15.5, target: 12.0, sample_size: 450 };
        }
        if (featureId === 'journey' && !data.encounters) {
            data.encounters = [
                { date: '2024-01-05', type: 'ED Visit', provider: 'Dr. Chen' },
                { date: '2024-01-12', type: 'Follow-up', provider: 'Dr. Ross' },
                { date: '2024-02-01', type: 'Lab Work', provider: 'Lab' },
            ];
        }

        const result = await hook.execute(data);
        setResults(prev => ({ ...prev, [featureId]: result }));
    };

    const updateForm = (featureId: string, key: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [featureId]: { ...(prev[featureId] || {}), [key]: value },
        }));
    };

    const isLoading = (id: string) => hookMap[id]?.loading || false;

    return (
        <div className="p-6 min-h-screen bg-background-secondary text-foreground-primary theme-transition font-sans">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30 text-white">
                        🧠
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            AI Command Center
                        </h1>
                        <p className="text-sm text-foreground-secondary font-medium">
                            25 Advanced AI-Powered Clinical & Operational Features
                        </p>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="flex gap-4 mt-6 flex-wrap">
                    {[
                        { label: 'Total Features', value: '25', color: 'bg-indigo-500' },
                        { label: 'Categories', value: String(CATEGORIES.length), color: 'bg-emerald-500' },
                        { label: 'Active', value: activeFeature ? '1' : '0', color: 'bg-amber-500' },
                        { label: 'API Status', value: 'Online', color: 'bg-green-500' },
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-background-primary border border-border shadow-sm theme-transition">
                            <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                            <div>
                                <div className="text-lg font-bold text-foreground-primary leading-none">{s.value}</div>
                                <div className="text-[10px] text-foreground-secondary uppercase tracking-wider font-semibold mt-1">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
                <input
                    type="text"
                    placeholder="🔍 Search AI features..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-border bg-background-primary text-foreground-primary placeholder:text-foreground-muted text-sm w-72 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm theme-transition"
                />
                <div className="flex gap-2 flex-wrap">
                    {['All', ...CATEGORIES].map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border theme-transition ${activeCategory === cat
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                                : 'bg-background-primary text-foreground-secondary border-border hover:bg-background-tertiary'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feature Grid + Detail Panel */}
            <div className="flex gap-6 items-start">
                {/* Grid */}
                <div className={`grid gap-4 transition-all duration-300 ${activeFeature ? 'w-[55%] grid-cols-1 lg:grid-cols-2' : 'w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                    {filtered.map(f => (
                        <div key={f.id} onClick={() => setActiveFeature(f.id === activeFeature ? null : f.id)}
                            className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border relative overflow-hidden group theme-transition ${f.id === activeFeature
                                ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-500 dark:border-indigo-500 shadow-lg ring-1 ring-indigo-500 transform scale-[1.02]'
                                : 'bg-background-primary border-border hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md'
                                }`}
                        >
                            <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${f.id === activeFeature ? 'bg-indigo-500' : 'bg-transparent group-hover:bg-indigo-500/50'}`} />
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-3xl">{f.icon}</span>
                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-background-tertiary text-foreground-secondary">
                                    {f.category}
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-foreground-primary mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{f.name}</h3>
                            <p className="text-xs text-foreground-secondary leading-relaxed mb-0">{f.description}</p>
                            {results[f.id] && (
                                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success-light text-success-dark text-[10px] font-bold">
                                    <span>✓</span> Result Ready
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Detail Panel */}
                {activeFeature && (
                    <div className="w-[42%] bg-background-primary rounded-2xl border border-border p-6 max-h-[calc(100vh-100px)] overflow-y-auto sticky top-24 shadow-xl custom-scrollbar theme-transition">
                        {(() => {
                            const feat = AI_FEATURES.find(f => f.id === activeFeature)!;
                            const fields = getFormConfig(activeFeature);
                            const result = results[activeFeature] || hookMap[activeFeature]?.data;
                            const loading = isLoading(activeFeature);
                            const error = hookMap[activeFeature]?.error;

                            return (
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl">{feat.icon}</span>
                                            <div>
                                                <h2 className="text-xl font-bold text-foreground-primary" style={{ color: feat.color }}>{feat.name}</h2>
                                                <p className="text-xs text-foreground-secondary font-medium uppercase tracking-wide">{feat.category}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setActiveFeature(null)} className="text-foreground-muted hover:text-foreground-primary transition-colors">
                                            <span className="text-xl">✕</span>
                                        </button>
                                    </div>
                                    <p className="text-sm text-foreground-secondary mb-6 leading-relaxed bg-background-secondary p-4 rounded-xl border border-border theme-transition">
                                        {feat.description}
                                    </p>

                                    {/* Form */}
                                    <div className="space-y-4 mb-6">
                                        {fields.map(field => (
                                            <div key={field.key}>
                                                <label className="text-xs font-bold text-foreground-secondary block mb-1.5 uppercase tracking-wide">
                                                    {field.label}
                                                </label>
                                                {field.type === 'textarea' ? (
                                                    <textarea
                                                        placeholder={field.placeholder}
                                                        value={formData[activeFeature]?.[field.key] || ''}
                                                        onChange={e => updateForm(activeFeature!, field.key, e.target.value)}
                                                        rows={4}
                                                        className="w-full px-3 py-2.5 rounded-xl border border-border bg-background-secondary text-foreground-primary text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans theme-transition"
                                                    />
                                                ) : (
                                                    <input
                                                        type={field.type}
                                                        placeholder={field.placeholder}
                                                        value={formData[activeFeature]?.[field.key] || ''}
                                                        onChange={e => updateForm(activeFeature!, field.key, e.target.value)}
                                                        className="w-full px-3 py-2.5 rounded-xl border border-border bg-background-secondary text-foreground-primary text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all theme-transition"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Submit */}
                                    <button onClick={() => handleSubmit(activeFeature!)} disabled={loading}
                                        className="w-full py-3.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                        style={{ background: loading ? '#4b5563' : feat.color, boxShadow: loading ? 'none' : `0 8px 20px -4px ${feat.color}66` }}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="animate-spin text-lg">⚙️</span>
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>🚀 Run AI Analysis</>
                                        )}
                                    </button>

                                    {/* Error */}
                                    {error && (
                                        <div className="mt-4 p-3 rounded-xl bg-danger-light border border-danger text-danger-dark text-sm flex items-start gap-2">
                                            <span>⚠️</span> {error}
                                        </div>
                                    )}

                                    {/* Result */}
                                    {result && (
                                        <div className="mt-6 animate-fade-in">
                                            <h4 className="text-sm font-bold text-success-dark mb-2 flex items-center gap-2">
                                                ✅ Analysis Result
                                            </h4>
                                            <div className="p-4 rounded-xl bg-background-elevated border border-border text-cyan-300 text-xs font-mono max-h-96 overflow-auto custom-scrollbar theme-transition">
                                                <pre className="whitespace-pre-wrap break-words">
                                                    {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};


export default AICommandCenter;
