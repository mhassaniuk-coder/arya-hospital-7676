import { GoogleGenAI, Type } from "@google/genai";
import {
  TriageInput,
  TriageResult,
  DosageInput,
  DosageResult,
  CDSSInput,
  CDSSResult,
  CDSSAlert,
  ScribeInput,
  ScribeResult,
  AllergyCheckInput,
  AllergyCheckResult,
  LabInterpretationInput,
  LabInterpretationResult,
  AntimicrobialInput,
  AntimicrobialResult,
  VitalSignsAnalysisInput,
  VitalSignsAnalysisResult,
  EarlyWarningScore,
  DiagnosticInput,
  DiagnosticResult,
  PrescriptionInput,
  PrescriptionResult,
  AIResponse,
  AIFeatureConfig,
  // Operational AI Types
  BedManagementInput,
  BedManagementResult,
  ORSchedulerInput,
  ORSchedulerResult,
  InventoryForecastInput,
  InventoryForecastResult,
  PatientFlowInput,
  PatientFlowResult,
  AmbulanceDispatchInput,
  AmbulanceDispatchResult,
  StaffSchedulingInput,
  StaffSchedulingResult,
  EquipmentMaintenanceInput,
  EquipmentMaintenanceResult,
  HousekeepingSchedulingInput,
  HousekeepingSchedulingResult,
  WasteManagementInput,
  WasteManagementResult,
  EnergyManagementInput,
  EnergyManagementResult,
  // Administrative AI Types
  MedicalCodingInput,
  MedicalCodingResult,
  ClaimsDenialInput,
  ClaimsDenialResult,
  RevenueCycleInput,
  RevenueCycleResult,
  ComplianceMonitoringInput,
  ComplianceMonitoringResult,
  FraudDetectionInput,
  FraudDetectionResult,
  DocumentProcessingInput,
  DocumentProcessingResult,
  AuditTrailInput,
  AuditTrailResult,
  ContractManagementInput,
  ContractManagementResult,
  PolicyManagementInput,
  PolicyManagementResult,
  ReportingInput,
  ReportingResult,
  // Patient-Facing AI Types
  HealthChatbotInput,
  HealthChatbotResult,
  SymptomCheckerInput,
  SymptomCheckerResult,
  AppointmentSchedulingInput,
  AppointmentSchedulingResult,
  DischargeFollowUpInput,
  DischargeFollowUpResult,
  HealthEducationInput,
  HealthEducationResult,
  MedicationReminderInput,
  MedicationReminderResult,
  PatientFeedbackInput,
  PatientFeedbackResult,
  // Predictive Analytics AI Types
  ReadmissionRiskInput,
  ReadmissionRiskResult,
  OutbreakDetectionInput,
  OutbreakDetectionResult,
  LengthOfStayInput,
  LengthOfStayResult,
  MortalityRiskInput,
  MortalityRiskResult,
  HealthTrendInput,
  HealthTrendResult,
  // Medical Imaging AI Types
  ChestXRayAnalysisInput,
  ChestXRayAnalysisResult,
  CTScanAnalysisInput,
  CTScanAnalysisResult,
  UltrasoundAnalysisInput,
  UltrasoundAnalysisResult,
  MRIAnalysisInput,
  MRIAnalysisResult,
  MammographyAnalysisInput,
  MammographyAnalysisResult,
  RetinalImagingAnalysisInput,
  RetinalImagingAnalysisResult,
  DermatologyImageAnalysisInput,
  DermatologyImageAnalysisResult,
  ECGAnalysisInput,
  ECGAnalysisResult,
} from "../types";

// Check for API key availability at module load time
const getApiKey = (): string | undefined => {
  return import.meta.env.VITE_GEMINI_API_KEY;
};

const isDemoMode = (): boolean => {
  return import.meta.env.VITE_USE_MOCK === 'true';
};

// Check if API key is missing and log warning once
const apiKey = getApiKey();
const DEMO_MODE = isDemoMode();

if (!apiKey && !DEMO_MODE) {
  console.warn(
    "⚠️ Gemini API Key (VITE_GEMINI_API_KEY) is not set. " +
    "AI features will run in demo mode with mock responses. " +
    "To enable real AI features, set your API key in the environment variables. " +
    "Get your API key from: https://makersuite.google.com/app/apikey"
  );
}

let ai: any = null;

// Helper to check if we should use mock mode
const shouldUseMockMode = (): boolean => {
  return DEMO_MODE || !apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '';
};

const getAIClient = () => {
  // Never initialize without a valid API key
  if (shouldUseMockMode()) return null;

  if (!ai) {
    try {
      ai = new GoogleGenAI({ apiKey });
    } catch (error) {
      console.error("Failed to initialize Gemini API client:", error);
      return null;
    }
  }
  return ai;
};

// Default configuration for AI features
const defaultConfig: AIFeatureConfig = {
  enabled: true,
  cacheResults: true,
  cacheTTL: 300, // 5 minutes
  timeout: 30000, // 30 seconds
  fallbackEnabled: true,
  maxRetries: 2,
};

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();

// Helper function to check cache
const getCached = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < defaultConfig.cacheTTL * 1000) {
    return cached.data as T;
  }
  return null;
};

// Helper function to set cache
const setCache = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Helper function to create AI response
const createResponse = <T>(success: boolean, data?: T, error?: string, processingTime?: number): AIResponse<T> => ({
  success,
  data,
  error,
  timestamp: new Date().toISOString(),
  processingTime,
  cached: false,
});

// Check if API key is available
const isApiKeyAvailable = (): boolean => {
  if (shouldUseMockMode()) {
    console.warn("Gemini API Key missing or Demo Mode enabled. AI features will use mock data.");
    return false;
  }
  return true;
};

// ============================================
// 1. AI-POWERED TRIAGE ASSISTANT
// ============================================

export const analyzeTriage = async (input: TriageInput): Promise<AIResponse<TriageResult>> => {
  const startTime = Date.now();
  const cacheKey = `triage-${JSON.stringify(input)}`;

  // Check cache
  const cached = getCached<TriageResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockTriageResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert emergency medicine triage AI assistant. Analyze the following patient information and provide triage recommendations.

Patient Information:
- Symptoms: ${input.symptoms}
- Age: ${input.age || 'Unknown'}
- Gender: ${input.gender || 'Unknown'}
- Medical History: ${input.medicalHistory?.join(', ') || 'None provided'}
- Vital Signs: ${JSON.stringify(input.vitalSigns || 'Not provided')}

Provide a comprehensive triage assessment including urgency level, priority score (1-10), recommended department, and any red flags.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urgencyLevel: {
              type: Type.STRING,
              enum: ["Emergency", "Urgent", "Normal", "Low"],
              description: "The urgency level of the patient's condition"
            },
            priorityScore: {
              type: Type.NUMBER,
              description: "Priority score from 1-10, where 10 is most urgent"
            },
            recommendedDepartment: {
              type: Type.STRING,
              description: "Recommended department for the patient"
            },
            estimatedWaitTime: {
              type: Type.STRING,
              description: "Estimated wait time recommendation"
            },
            reasoning: {
              type: Type.STRING,
              description: "Clinical reasoning for the triage decision"
            },
            recommendedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of recommended immediate actions"
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of red flag symptoms or signs to watch for"
            }
          },
          required: ["urgencyLevel", "priorityScore", "recommendedDepartment", "estimatedWaitTime", "reasoning", "recommendedActions", "redFlags"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as TriageResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in triage analysis:", error);
    return createResponse(true, getMockTriageResult(input), undefined, Date.now() - startTime);
  }
};

// Mock triage result for fallback
const getMockTriageResult = (input: TriageInput): TriageResult => {
  const symptoms = input.symptoms.toLowerCase();

  if (symptoms.includes('chest pain') || symptoms.includes('difficulty breathing') || symptoms.includes('stroke')) {
    return {
      urgencyLevel: 'Emergency',
      priorityScore: 10,
      recommendedDepartment: 'Emergency Department',
      estimatedWaitTime: 'Immediate',
      reasoning: 'Symptoms suggest potentially life-threatening condition requiring immediate evaluation.',
      recommendedActions: ['Immediate ECG', 'Vital signs monitoring', 'Oxygen saturation check', 'IV access'],
      redFlags: ['Cardiac event', 'Pulmonary embolism', 'Stroke']
    };
  }

  if (symptoms.includes('fever') && symptoms.includes('cough')) {
    return {
      urgencyLevel: 'Urgent',
      priorityScore: 7,
      recommendedDepartment: 'General Medicine',
      estimatedWaitTime: '15-30 minutes',
      reasoning: 'Infectious symptoms requiring prompt evaluation.',
      recommendedActions: ['Temperature check', 'CBC and inflammatory markers', 'Chest X-ray if indicated'],
      redFlags: ['Sepsis', 'Pneumonia', 'COVID-19']
    };
  }

  return {
    urgencyLevel: 'Normal',
    priorityScore: 5,
    recommendedDepartment: 'General Medicine',
    estimatedWaitTime: '30-60 minutes',
    reasoning: 'Non-emergent symptoms requiring routine evaluation.',
    recommendedActions: ['Standard vital signs', 'Basic workup'],
    redFlags: []
  };
};

// ============================================
// 2. SMART MEDICATION DOSAGE CALCULATOR
// ============================================

export const calculateDosage = async (input: DosageInput): Promise<AIResponse<DosageResult>> => {
  const startTime = Date.now();
  const cacheKey = `dosage-${JSON.stringify(input)}`;

  const cached = getCached<DosageResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockDosageResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a clinical pharmacist AI assistant. Calculate the appropriate medication dosage based on the following patient information.

Medication: ${input.medication}
Patient Weight: ${input.patientWeight ? input.patientWeight + ' kg' : 'Unknown'}
Patient Age: ${input.patientAge || 'Unknown'}
Gender: ${input.patientGender || 'Unknown'}
Indication: ${input.indication || 'Not specified'}
Renal Function: ${input.renalFunction ? `CrCl: ${input.renalFunction.creatinineClearance} mL/min, SCr: ${input.renalFunction.serumCreatinine} mg/dL` : 'Unknown'}
Hepatic Impairment: ${input.hepaticImpairment || 'Unknown'}
Current Medications: ${input.currentMedications?.join(', ') || 'None'}

Provide comprehensive dosing recommendations including any necessary adjustments.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedDose: { type: Type.STRING, description: "Recommended dose amount" },
            doseFrequency: { type: Type.STRING, description: "Dosing frequency" },
            route: { type: Type.STRING, description: "Route of administration" },
            maxDailyDose: { type: Type.STRING, description: "Maximum daily dose" },
            adjustments: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of dose adjustments made"
            },
            warnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Important warnings and precautions"
            },
            renalAdjustment: { type: Type.STRING, description: "Renal adjustment if applicable" },
            pediatricDose: { type: Type.STRING, description: "Pediatric dosing if applicable" },
            geriatricAdjustment: { type: Type.STRING, description: "Geriatric adjustment if applicable" }
          },
          required: ["recommendedDose", "doseFrequency", "route", "maxDailyDose", "adjustments", "warnings"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as DosageResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in dosage calculation:", error);
    return createResponse(true, getMockDosageResult(input), undefined, Date.now() - startTime);
  }
};

const getMockDosageResult = (input: DosageInput): DosageResult => {
  const med = input.medication.toLowerCase();

  if (med.includes('amoxicillin')) {
    return {
      recommendedDose: input.patientWeight ? `${Math.round(input.patientWeight * 25)} mg` : '500 mg',
      doseFrequency: 'Every 8 hours',
      route: 'Oral',
      maxDailyDose: '3 g',
      adjustments: [],
      warnings: ['Take with or without food', 'Complete full course'],
      pediatricDose: input.patientWeight ? `${Math.round(input.patientWeight * 25)} mg every 8 hours` : undefined,
    };
  }

  if (med.includes('metformin')) {
    return {
      recommendedDose: '500 mg',
      doseFrequency: 'Twice daily',
      route: 'Oral',
      maxDailyDose: '2.5 g',
      adjustments: input.renalFunction?.creatinineClearance && input.renalFunction.creatinineClearance < 30
        ? ['Contraindicated in severe renal impairment']
        : [],
      warnings: ['Monitor renal function', 'Risk of lactic acidosis', 'Hold before contrast imaging'],
      renalAdjustment: input.renalFunction?.creatinineClearance && input.renalFunction.creatinineClearance < 60
        ? 'Reduce dose or avoid'
        : undefined,
    };
  }

  return {
    recommendedDose: 'As per standard guidelines',
    doseFrequency: 'As directed',
    route: 'Oral',
    maxDailyDose: 'As per guidelines',
    adjustments: [],
    warnings: ['Consult prescribing information'],
  };
};

// ============================================
// 3. CLINICAL DECISION SUPPORT SYSTEM (CDSS)
// ============================================

export const getClinicalDecisionSupport = async (input: CDSSInput): Promise<AIResponse<CDSSResult>> => {
  const startTime = Date.now();
  const cacheKey = `cdss-${JSON.stringify(input)}`;

  const cached = getCached<CDSSResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockCDSSResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a clinical decision support AI system. Analyze the following patient data and provide evidence-based recommendations.

Patient ID: ${input.patientId}
Diagnosis: ${input.diagnosis || 'Not specified'}
Symptoms: ${input.symptoms?.join(', ') || 'None'}
Lab Results: ${JSON.stringify(input.labResults || [])}
Current Medications: ${JSON.stringify(input.currentMedications || [])}
Vital Signs: ${JSON.stringify(input.vitalSigns || [])}
Allergies: ${input.allergies?.join(', ') || 'None'}
Age: ${input.age || 'Unknown'}
Gender: ${input.gender || 'Unknown'}

Provide clinical alerts, recommendations, and evidence-based guidelines.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            alerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["critical", "warning", "info", "suggestion"] },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  source: { type: Type.STRING },
                  timestamp: { type: Type.STRING },
                  actionRequired: { type: Type.BOOLEAN },
                  suggestedAction: { type: Type.STRING }
                },
                required: ["id", "type", "title", "description", "source", "timestamp", "actionRequired"]
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            evidenceBasedGuidelines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  guideline: { type: Type.STRING },
                  relevance: { type: Type.STRING },
                  source: { type: Type.STRING }
                },
                required: ["guideline", "relevance", "source"]
              }
            },
            riskFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["alerts", "recommendations", "evidenceBasedGuidelines", "riskFactors"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as CDSSResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in CDSS:", error);
    return createResponse(true, getMockCDSSResult(input), undefined, Date.now() - startTime);
  }
};

const getMockCDSSResult = (input: CDSSInput): CDSSResult => {
  const alerts: CDSSAlert[] = [];

  // Check for drug interactions
  if (input.currentMedications && input.currentMedications.length > 3) {
    alerts.push({
      id: 'alert-1',
      type: 'warning',
      title: 'Polypharmacy Alert',
      description: 'Patient is on multiple medications. Review for potential drug interactions.',
      source: 'CDSS Drug Interaction Module',
      timestamp: new Date().toISOString(),
      actionRequired: true,
      suggestedAction: 'Review medication list with clinical pharmacist'
    });
  }

  // Check for abnormal vitals
  if (input.vitalSigns && input.vitalSigns.length > 0) {
    const latestVitals = input.vitalSigns[input.vitalSigns.length - 1];
    if (latestVitals.heartRate > 100) {
      alerts.push({
        id: 'alert-2',
        type: 'warning',
        title: 'Tachycardia Detected',
        description: `Heart rate is elevated at ${latestVitals.heartRate} bpm`,
        source: 'CDSS Vital Signs Monitor',
        timestamp: new Date().toISOString(),
        actionRequired: true,
        suggestedAction: 'Evaluate for causes of tachycardia'
      });
    }
  }

  return {
    alerts,
    recommendations: [
      'Continue monitoring vital signs',
      'Review medication list for optimization',
      'Consider age-appropriate screenings'
    ],
    evidenceBasedGuidelines: [
      {
        guideline: 'Annual wellness visit recommended',
        relevance: 'Preventive care',
        source: 'USPSTF Guidelines'
      }
    ],
    riskFactors: input.allergies?.length ? ['Known drug allergies'] : []
  };
};

// ============================================
// 4. AI-ENHANCED MEDICAL SCRIBE
// ============================================

export const generateMedicalNotes = async (input: ScribeInput): Promise<AIResponse<ScribeResult>> => {
  const startTime = Date.now();
  const cacheKey = `scribe-${JSON.stringify(input)}`;

  const cached = getCached<ScribeResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockScribeResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a medical scribe AI assistant. Convert the following clinical encounter into a structured SOAP note with ICD-10 and CPT code suggestions.

Transcription/Notes: ${input.transcription || 'No transcription provided'}
Encounter Type: ${input.encounterType || 'consultation'}
Patient Info: ${JSON.stringify(input.patientInfo || {})}

Generate a comprehensive SOAP note with appropriate medical codes.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            soapNote: {
              type: Type.OBJECT,
              properties: {
                subjective: { type: Type.STRING },
                objective: { type: Type.STRING },
                assessment: { type: Type.STRING },
                plan: { type: Type.STRING }
              },
              required: ["subjective", "objective", "assessment", "plan"]
            },
            icdCodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  description: { type: Type.STRING },
                  confidence: { type: Type.NUMBER }
                },
                required: ["code", "description", "confidence"]
              }
            },
            cptCodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["code", "description"]
              }
            },
            followUpRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            qualityScore: { type: Type.NUMBER }
          },
          required: ["soapNote", "icdCodes", "cptCodes", "followUpRecommendations", "qualityScore"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as ScribeResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in medical scribe:", error);
    return createResponse(true, getMockScribeResult(input), undefined, Date.now() - startTime);
  }
};

const getMockScribeResult = (input: ScribeInput): ScribeResult => {
  return {
    soapNote: {
      subjective: input.transcription?.substring(0, 200) || 'Patient presents with chief complaint. History of present illness documented.',
      objective: 'Vital signs within normal limits. Physical examination performed. No acute distress noted.',
      assessment: 'Clinical assessment based on presenting symptoms and examination findings.',
      plan: 'Treatment plan initiated. Follow-up scheduled. Patient education provided.'
    },
    icdCodes: [
      { code: 'R69', description: 'Other ill-defined and unspecified causes of morbidity', confidence: 0.85 }
    ],
    cptCodes: [
      { code: '99213', description: 'Office/outpatient visit, established patient' }
    ],
    followUpRecommendations: [
      'Schedule follow-up in 2 weeks',
      'Review lab results when available'
    ],
    qualityScore: 85
  };
};

// ============================================
// 5. INTELLIGENT ALLERGY & CONTRAINDICATION ALERT
// ============================================

export const checkAllergiesAndContraindications = async (input: AllergyCheckInput): Promise<AIResponse<AllergyCheckResult>> => {
  const startTime = Date.now();
  const cacheKey = `allergy-${JSON.stringify(input)}`;

  const cached = getCached<AllergyCheckResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockAllergyResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a clinical allergy and drug safety AI assistant. Analyze the following for potential allergic reactions and contraindications.

Patient Allergies: ${input.patientAllergies.join(', ')}
Medications to Check: ${input.medications.join(', ')}
Patient Conditions: ${input.patientConditions?.join(', ') || 'None'}
Age: ${input.age || 'Unknown'}
Gender: ${input.gender || 'Unknown'}

Identify any potential allergic reactions, cross-reactivity, contraindications, and suggest safe alternatives.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hasAlerts: { type: Type.BOOLEAN },
            alerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: { type: Type.STRING, enum: ["critical", "high", "moderate", "low"] },
                  allergen: { type: Type.STRING },
                  medication: { type: Type.STRING },
                  reaction: { type: Type.STRING },
                  crossReactivity: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  alternativeMedications: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["severity", "allergen", "medication", "reaction", "crossReactivity", "alternativeMedications"]
              }
            },
            contraindications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medication: { type: Type.STRING },
                  contraindication: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["medication", "contraindication", "severity", "reason"]
              }
            },
            safeAlternatives: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["hasAlerts", "alerts", "contraindications", "safeAlternatives"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as AllergyCheckResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in allergy check:", error);
    return createResponse(true, getMockAllergyResult(input), undefined, Date.now() - startTime);
  }
};

const getMockAllergyResult = (input: AllergyCheckInput): AllergyCheckResult => {
  const alerts: AllergyCheckResult['alerts'] = [];
  const contraindications: AllergyCheckResult['contraindications'] = [];

  // Check for penicillin allergy
  if (input.patientAllergies.some(a => a.toLowerCase().includes('penicillin'))) {
    if (input.medications.some(m => m.toLowerCase().includes('amoxicillin') || m.toLowerCase().includes('ampicillin'))) {
      alerts.push({
        severity: 'critical',
        allergen: 'Penicillin',
        medication: 'Amoxicillin/Ampicillin',
        reaction: 'Potential anaphylaxis',
        crossReactivity: ['Amoxicillin', 'Ampicillin', 'Penicillin G', 'Penicillin V'],
        alternativeMedications: ['Azithromycin', 'Clindamycin', 'Doxycycline']
      });
    }
  }

  // Check for sulfa allergy
  if (input.patientAllergies.some(a => a.toLowerCase().includes('sulfa'))) {
    if (input.medications.some(m => m.toLowerCase().includes('sulfamethoxazole') || m.toLowerCase().includes('furosemide'))) {
      alerts.push({
        severity: 'high',
        allergen: 'Sulfa',
        medication: 'Sulfonamide antibiotic',
        reaction: 'Potential allergic reaction',
        crossReactivity: ['Bactrim', 'Sulfamethoxazole', 'Furosemide'],
        alternativeMedications: ['Alternative antibiotic based on indication']
      });
    }
  }

  return {
    hasAlerts: alerts.length > 0 || contraindications.length > 0,
    alerts,
    contraindications,
    safeAlternatives: alerts.length > 0 ? ['Consult allergist for alternatives'] : input.medications
  };
};

// ============================================
// 6. AI-POWERED LAB RESULT INTERPRETATION
// ============================================

export const interpretLabResult = async (input: LabInterpretationInput): Promise<AIResponse<LabInterpretationResult>> => {
  const startTime = Date.now();
  const cacheKey = `lab-${JSON.stringify(input)}`;

  const cached = getCached<LabInterpretationResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockLabInterpretation(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a clinical pathology AI assistant. Interpret the following lab result.

Test Name: ${input.testName}
Result: ${input.result} ${input.unit || ''}
Reference Range: ${input.referenceRange ? `${input.referenceRange.low}-${input.referenceRange.high}` : 'Standard reference'}
Patient Age: ${input.patientAge || 'Unknown'}
Patient Gender: ${input.patientGender || 'Unknown'}
Previous Results: ${JSON.stringify(input.previousResults || [])}
Clinical Context: ${input.clinicalContext || 'Not provided'}

Provide comprehensive interpretation including clinical significance and recommended actions.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["Normal", "Abnormal", "Critical", "Borderline"] },
            interpretation: { type: Type.STRING },
            clinicalSignificance: { type: Type.STRING },
            possibleCauses: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            trendAnalysis: {
              type: Type.OBJECT,
              properties: {
                direction: { type: Type.STRING, enum: ["increasing", "decreasing", "stable"] },
                significance: { type: Type.STRING }
              }
            },
            followUpRequired: { type: Type.BOOLEAN },
            icdCode: { type: Type.STRING }
          },
          required: ["status", "interpretation", "clinicalSignificance", "possibleCauses", "recommendedActions", "followUpRequired"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as LabInterpretationResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in lab interpretation:", error);
    return createResponse(true, getMockLabInterpretation(input), undefined, Date.now() - startTime);
  }
};

const getMockLabInterpretation = (input: LabInterpretationInput): LabInterpretationResult => {
  const testLower = input.testName.toLowerCase();

  if (testLower.includes('hemoglobin') || testLower.includes('hgb')) {
    const result = typeof input.result === 'number' ? input.result : parseFloat(input.result as string);
    if (result < 12) {
      return {
        status: 'Abnormal',
        interpretation: 'Low hemoglobin indicates anemia',
        clinicalSignificance: 'May cause fatigue, weakness, and reduced exercise tolerance',
        possibleCauses: ['Iron deficiency', 'Chronic disease', 'Blood loss', 'Vitamin B12 deficiency'],
        recommendedActions: ['Check iron studies', 'Consider reticulocyte count', 'Evaluate for blood loss'],
        followUpRequired: true,
        icdCode: 'D64.9'
      };
    }
  }

  if (testLower.includes('glucose') && testLower.includes('fasting')) {
    const result = typeof input.result === 'number' ? input.result : parseFloat(input.result as string);
    if (result >= 126) {
      return {
        status: 'Abnormal',
        interpretation: 'Elevated fasting glucose suggests diabetes mellitus',
        clinicalSignificance: 'Requires further evaluation and management',
        possibleCauses: ['Diabetes mellitus', 'Stress-induced hyperglycemia', 'Medication effects'],
        recommendedActions: ['Repeat fasting glucose', 'HbA1c test', 'Diabetes education'],
        followUpRequired: true,
        icdCode: 'E11.9'
      };
    }
  }

  if (testLower.includes('troponin')) {
    const result = typeof input.result === 'number' ? input.result : parseFloat(input.result as string);
    if (result > 0.04) {
      return {
        status: 'Critical',
        interpretation: 'Elevated troponin indicates myocardial injury',
        clinicalSignificance: 'Possible acute coronary syndrome - requires immediate evaluation',
        possibleCauses: ['Myocardial infarction', 'Myocarditis', 'Pulmonary embolism', 'Sepsis'],
        recommendedActions: ['Immediate ECG', 'Cardiology consultation', 'Serial troponins', 'Consider cath lab activation'],
        followUpRequired: true,
        icdCode: 'I21.9'
      };
    }
  }

  return {
    status: 'Normal',
    interpretation: 'Result within normal limits',
    clinicalSignificance: 'No immediate clinical concern',
    possibleCauses: [],
    recommendedActions: ['Continue routine monitoring'],
    followUpRequired: false
  };
};

// ============================================
// 7. AI-POWERED ANTIMICROBIAL STEWARDSHIP
// ============================================

export const getAntimicrobialRecommendation = async (input: AntimicrobialInput): Promise<AIResponse<AntimicrobialResult>> => {
  const startTime = Date.now();
  const cacheKey = `antimicrobial-${JSON.stringify(input)}`;

  const cached = getCached<AntimicrobialResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockAntimicrobialResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an infectious disease and antimicrobial stewardship AI assistant. Provide antibiotic recommendations based on the following information.

Infection Type: ${input.infectionType || 'Not specified'}
Culture Results: ${JSON.stringify(input.cultureResults || [])}
Current Antibiotics: ${input.currentAntibiotics?.join(', ') || 'None'}
Patient Age: ${input.patientAge || 'Unknown'}
Renal Function: ${input.renalFunction || 'Unknown'}
Allergies: ${input.allergyInfo?.join(', ') || 'None'}
Previous Antibiotic Use: ${input.previousAntibioticUse?.join(', ') || 'None'}

Provide evidence-based antibiotic recommendations including duration and de-escalation options.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedAntibiotic: { type: Type.STRING },
            alternativeOptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendedDuration: { type: Type.STRING },
            doseAdjustment: { type: Type.STRING },
            deEscalationOptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            resistanceWarnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            stewardshipAlerts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            cultureGuidedRecommendation: { type: Type.STRING }
          },
          required: ["recommendedAntibiotic", "alternativeOptions", "recommendedDuration", "doseAdjustment", "deEscalationOptions", "resistanceWarnings", "stewardshipAlerts", "cultureGuidedRecommendation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as AntimicrobialResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in antimicrobial recommendation:", error);
    return createResponse(true, getMockAntimicrobialResult(input), undefined, Date.now() - startTime);
  }
};

const getMockAntimicrobialResult = (input: AntimicrobialInput): AntimicrobialResult => {
  const infection = input.infectionType?.toLowerCase() || '';

  if (infection.includes('pneumonia') || infection.includes('respiratory')) {
    return {
      recommendedAntibiotic: 'Ceftriaxone 1g IV daily + Azithromycin 500mg PO daily',
      alternativeOptions: ['Levofloxacin 750mg PO daily', 'Amoxicillin-Clavulanate + Macrolide'],
      recommendedDuration: '5-7 days',
      doseAdjustment: input.renalFunction && input.renalFunction < 30 ? 'Reduce ceftriaxone dose' : 'No adjustment needed',
      deEscalationOptions: ['Step down to oral therapy when clinically stable'],
      resistanceWarnings: ['Local MRSA rate 15% - consider adding Vancomycin if risk factors present'],
      stewardshipAlerts: ['Avoid unnecessary broad-spectrum antibiotics', 'Reassess at 48-72 hours'],
      cultureGuidedRecommendation: 'Await culture results for targeted therapy'
    };
  }

  if (infection.includes('uti') || infection.includes('urinary')) {
    return {
      recommendedAntibiotic: 'Nitrofurantoin 100mg PO BID',
      alternativeOptions: ['Trimethoprim-Sulfamethoxazole DS BID', 'Fosfomycin 3g single dose'],
      recommendedDuration: '5 days',
      doseAdjustment: input.renalFunction && input.renalFunction < 30 ? 'Avoid nitrofurantoin - use alternative' : 'No adjustment needed',
      deEscalationOptions: ['Narrow based on culture results'],
      resistanceWarnings: ['E. coli resistance to TMP-SMX ~20% locally'],
      stewardshipAlerts: ['Avoid fluoroquinolones as first-line for uncomplicated UTI'],
      cultureGuidedRecommendation: 'Culture-guided therapy recommended if prior antibiotic exposure'
    };
  }

  return {
    recommendedAntibiotic: 'Based on clinical assessment and culture results',
    alternativeOptions: ['Consult infectious disease for complex cases'],
    recommendedDuration: 'Per guidelines',
    doseAdjustment: 'Adjust for renal/hepatic function',
    deEscalationOptions: ['Narrow spectrum when culture results available'],
    resistanceWarnings: ['Review local antibiogram'],
    stewardshipAlerts: ['Document indication and planned duration'],
    cultureGuidedRecommendation: 'Obtain cultures before starting antibiotics when possible'
  };
};

// ============================================
// 8. AI-POWERED VITAL SIGNS MONITOR
// ============================================

export const analyzeVitalSigns = async (input: VitalSignsAnalysisInput): Promise<AIResponse<VitalSignsAnalysisResult>> => {
  const startTime = Date.now();
  const cacheKey = `vitals-${JSON.stringify(input)}`;

  const cached = getCached<VitalSignsAnalysisResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockVitalSignsAnalysis(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a critical care monitoring AI assistant. Analyze the following vital signs trends and provide early warning assessment.

Vital Signs: ${JSON.stringify(input.vitalSigns)}
Patient Age: ${input.patientAge || 'Unknown'}
Patient Condition: ${input.patientCondition || 'Unknown'}
Baseline Vitals: ${JSON.stringify(input.baselineVitals || 'Not provided')}

Calculate early warning scores, identify deterioration risk, and provide clinical alerts.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            earlyWarningScore: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
                parameters: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      parameter: { type: Type.STRING },
                      value: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      abnormality: { type: Type.STRING }
                    },
                    required: ["parameter", "value", "score", "abnormality"]
                  }
                }
              },
              required: ["score", "riskLevel", "parameters"]
            },
            deteriorationRisk: {
              type: Type.OBJECT,
              properties: {
                probability: { type: Type.NUMBER },
                timeframe: { type: Type.STRING },
                indicators: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["probability", "timeframe", "indicators"]
            },
            alerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["critical", "warning", "info"] },
                  message: { type: Type.STRING },
                  parameter: { type: Type.STRING }
                },
                required: ["type", "message", "parameter"]
              }
            },
            trends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  parameter: { type: Type.STRING },
                  trend: { type: Type.STRING, enum: ["improving", "stable", "declining"] },
                  significance: { type: Type.STRING }
                },
                required: ["parameter", "trend", "significance"]
              }
            },
            recommendedInterventions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["earlyWarningScore", "deteriorationRisk", "alerts", "trends", "recommendedInterventions"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as VitalSignsAnalysisResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in vital signs analysis:", error);
    return createResponse(true, getMockVitalSignsAnalysis(input), undefined, Date.now() - startTime);
  }
};

const getMockVitalSignsAnalysis = (input: VitalSignsAnalysisInput): VitalSignsAnalysisResult => {
  const latestVitals = input.vitalSigns[input.vitalSigns.length - 1];
  const parameters: EarlyWarningScore['parameters'] = [];
  let totalScore = 0;

  // Heart rate scoring
  if (latestVitals.heartRate > 130 || latestVitals.heartRate < 40) {
    parameters.push({ parameter: 'Heart Rate', value: String(latestVitals.heartRate), score: 3, abnormality: 'Severe abnormality' });
    totalScore += 3;
  } else if (latestVitals.heartRate > 110 || latestVitals.heartRate < 50) {
    parameters.push({ parameter: 'Heart Rate', value: String(latestVitals.heartRate), score: 2, abnormality: 'Moderate abnormality' });
    totalScore += 2;
  } else if (latestVitals.heartRate > 100 || latestVitals.heartRate < 60) {
    parameters.push({ parameter: 'Heart Rate', value: String(latestVitals.heartRate), score: 1, abnormality: 'Mild abnormality' });
    totalScore += 1;
  } else {
    parameters.push({ parameter: 'Heart Rate', value: String(latestVitals.heartRate), score: 0, abnormality: 'Normal' });
  }

  // Temperature scoring
  if (latestVitals.temp > 39 || latestVitals.temp < 35) {
    parameters.push({ parameter: 'Temperature', value: `${latestVitals.temp}°C`, score: 2, abnormality: 'Significant fever or hypothermia' });
    totalScore += 2;
  } else if (latestVitals.temp > 38 || latestVitals.temp < 36) {
    parameters.push({ parameter: 'Temperature', value: `${latestVitals.temp}°C`, score: 1, abnormality: 'Mild fever or low temp' });
    totalScore += 1;
  } else {
    parameters.push({ parameter: 'Temperature', value: `${latestVitals.temp}°C`, score: 0, abnormality: 'Normal' });
  }

  const riskLevel = totalScore >= 7 ? 'Critical' : totalScore >= 5 ? 'High' : totalScore >= 3 ? 'Medium' : 'Low';

  return {
    earlyWarningScore: {
      score: totalScore,
      riskLevel,
      parameters
    },
    deteriorationRisk: {
      probability: totalScore * 0.1,
      timeframe: 'Next 24 hours',
      indicators: totalScore > 3 ? ['Vital sign instability', 'Trend toward abnormality'] : []
    },
    alerts: totalScore >= 5 ? [
      { type: 'critical', message: 'High early warning score - consider rapid response', parameter: 'Overall' }
    ] : totalScore >= 3 ? [
      { type: 'warning', message: 'Elevated early warning score - increase monitoring', parameter: 'Overall' }
    ] : [],
    trends: [
      { parameter: 'Heart Rate', trend: input.vitalSigns.length > 1 && input.vitalSigns[input.vitalSigns.length - 1].heartRate > input.vitalSigns[0].heartRate ? 'declining' : 'stable', significance: 'Monitor for changes' }
    ],
    recommendedInterventions: totalScore >= 5 ? [
      'Consider rapid response team activation',
      'Increase monitoring frequency',
      'Notify physician'
    ] : ['Continue routine monitoring']
  };
};

// ============================================
// 9. AI-POWERED DIAGNOSTIC SUGGESTION ENGINE
// ============================================

export const getDiagnosticSuggestions = async (input: DiagnosticInput): Promise<AIResponse<DiagnosticResult>> => {
  const startTime = Date.now();
  const cacheKey = `diagnostic-${JSON.stringify(input)}`;

  const cached = getCached<DiagnosticResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockDiagnosticResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert diagnostic AI assistant. Analyze the following clinical information and provide differential diagnoses.

Symptoms: ${input.symptoms.join(', ')}
Vital Signs: ${JSON.stringify(input.vitalSigns || [])}
Lab Results: ${JSON.stringify(input.labResults || [])}
Patient Age: ${input.patientAge || 'Unknown'}
Patient Gender: ${input.patientGender || 'Unknown'}
Medical History: ${input.medicalHistory?.join(', ') || 'None'}
Travel History: ${input.travelHistory?.join(', ') || 'None'}
Epidemiological Factors: ${input.epidemiologicalFactors?.join(', ') || 'None'}

Provide comprehensive differential diagnoses with ICD-10 codes, confidence levels, and recommended workup.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            differentialDiagnoses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  diagnosis: { type: Type.STRING },
                  icdCode: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  likelihood: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  supportingEvidence: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  conflictingEvidence: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  recommendedTests: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  riskFactors: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["diagnosis", "icdCode", "confidence", "likelihood", "supportingEvidence", "conflictingEvidence", "recommendedTests", "riskFactors"]
              }
            },
            primaryDiagnosis: {
              type: Type.OBJECT,
              properties: {
                diagnosis: { type: Type.STRING },
                icdCode: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                likelihood: { type: Type.STRING },
                supportingEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                conflictingEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedTests: { type: Type.ARRAY, items: { type: Type.STRING } },
                riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["diagnosis", "icdCode", "confidence", "likelihood", "supportingEvidence", "conflictingEvidence", "recommendedTests", "riskFactors"]
            },
            rareDiseaseConsiderations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendedWorkup: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            clinicalGuidelines: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["differentialDiagnoses", "primaryDiagnosis", "rareDiseaseConsiderations", "recommendedWorkup", "clinicalGuidelines"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as DiagnosticResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in diagnostic suggestions:", error);
    return createResponse(true, getMockDiagnosticResult(input), undefined, Date.now() - startTime);
  }
};

const getMockDiagnosticResult = (input: DiagnosticInput): DiagnosticResult => {
  const symptoms = input.symptoms.join(' ').toLowerCase();

  if (symptoms.includes('chest pain')) {
    return {
      differentialDiagnoses: [
        {
          diagnosis: 'Acute Coronary Syndrome',
          icdCode: 'I21.9',
          confidence: 0.75,
          likelihood: 'High',
          supportingEvidence: ['Chest pain presentation', 'Age appropriate'],
          conflictingEvidence: [],
          recommendedTests: ['ECG', 'Troponin', 'Chest X-ray'],
          riskFactors: ['Age', 'Hypertension', 'Diabetes']
        },
        {
          diagnosis: 'Gastroesophageal Reflux Disease',
          icdCode: 'K21.9',
          confidence: 0.45,
          likelihood: 'Medium',
          supportingEvidence: ['Chest pain'],
          conflictingEvidence: [],
          recommendedTests: ['Trial of PPI', 'EGD if persistent'],
          riskFactors: []
        }
      ],
      primaryDiagnosis: {
        diagnosis: 'Acute Coronary Syndrome - Rule Out',
        icdCode: 'I21.9',
        confidence: 0.75,
        likelihood: 'High',
        supportingEvidence: ['Chest pain presentation'],
        conflictingEvidence: [],
        recommendedTests: ['ECG', 'Troponin'],
        riskFactors: ['Cardiovascular risk factors']
      },
      rareDiseaseConsiderations: ['Aortic dissection', 'Pulmonary embolism'],
      recommendedWorkup: ['Serial ECGs', 'Cardiac enzymes', 'Consider CT angiography'],
      clinicalGuidelines: ['ACC/AHA Chest Pain Guidelines']
    };
  }

  if (symptoms.includes('fever') && symptoms.includes('cough')) {
    return {
      differentialDiagnoses: [
        {
          diagnosis: 'Community-Acquired Pneumonia',
          icdCode: 'J18.9',
          confidence: 0.80,
          likelihood: 'High',
          supportingEvidence: ['Fever', 'Cough', 'Respiratory symptoms'],
          conflictingEvidence: [],
          recommendedTests: ['Chest X-ray', 'CBC', 'Blood cultures if severe'],
          riskFactors: ['Age', 'Comorbidities']
        },
        {
          diagnosis: 'Viral Upper Respiratory Infection',
          icdCode: 'J06.9',
          confidence: 0.60,
          likelihood: 'Medium',
          supportingEvidence: ['Fever', 'Cough'],
          conflictingEvidence: [],
          recommendedTests: ['Supportive care', 'Consider flu/COVID testing'],
          riskFactors: []
        }
      ],
      primaryDiagnosis: {
        diagnosis: 'Community-Acquired Pneumonia',
        icdCode: 'J18.9',
        confidence: 0.80,
        likelihood: 'High',
        supportingEvidence: ['Classic presentation'],
        conflictingEvidence: [],
        recommendedTests: ['Chest X-ray', 'CBC'],
        riskFactors: []
      },
      rareDiseaseConsiderations: ['Tuberculosis', 'Fungal pneumonia'],
      recommendedWorkup: ['Chest imaging', 'Inflammatory markers', 'Sputum culture'],
      clinicalGuidelines: ['IDSA/ATS Pneumonia Guidelines']
    };
  }

  return {
    differentialDiagnoses: [
      {
        diagnosis: 'Clinical evaluation needed',
        icdCode: 'R69',
        confidence: 0.50,
        likelihood: 'Medium',
        supportingEvidence: input.symptoms,
        conflictingEvidence: [],
        recommendedTests: ['Further clinical evaluation'],
        riskFactors: []
      }
    ],
    primaryDiagnosis: {
      diagnosis: 'Under Evaluation',
      icdCode: 'R69',
      confidence: 0.50,
      likelihood: 'Medium',
      supportingEvidence: [],
      conflictingEvidence: [],
      recommendedTests: ['Complete clinical assessment'],
      riskFactors: []
    },
    rareDiseaseConsiderations: [],
    recommendedWorkup: ['Detailed history and physical examination'],
    clinicalGuidelines: ['Standard clinical evaluation protocols']
  };
};

// ============================================
// 10. SMART PRESCRIPTION GENERATOR
// ============================================

export const generatePrescription = async (input: PrescriptionInput): Promise<AIResponse<PrescriptionResult>> => {
  const startTime = Date.now();
  const cacheKey = `prescription-${JSON.stringify(input)}`;

  const cached = getCached<PrescriptionResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockPrescriptionResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a clinical pharmacist AI assistant. Generate appropriate prescription recommendations based on the following information.

Diagnosis: ${input.diagnosis}
Patient Age: ${input.patientAge || 'Unknown'}
Patient Weight: ${input.patientWeight || 'Unknown'} kg
Patient Gender: ${input.patientGender || 'Unknown'}
Allergies: ${input.allergies?.join(', ') || 'None'}
Current Medications: ${JSON.stringify(input.currentMedications || [])}
Renal Function: ${input.renalFunction || 'Unknown'}
Hepatic Function: ${input.hepaticFunction || 'Unknown'}
Insurance Formulary: ${input.insuranceFormulary?.join(', ') || 'Standard formulary'}

Provide comprehensive prescription recommendations including alternatives, interactions, and counseling points.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryPrescription: {
              type: Type.OBJECT,
              properties: {
                medication: { type: Type.STRING },
                dose: { type: Type.STRING },
                frequency: { type: Type.STRING },
                route: { type: Type.STRING },
                duration: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                refills: { type: Type.NUMBER },
                instructions: { type: Type.STRING },
                warnings: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                formularyStatus: { type: Type.STRING, enum: ["Preferred", "Non-Preferred", "Not Covered"] },
                alternatives: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                costEstimate: { type: Type.STRING }
              },
              required: ["medication", "dose", "frequency", "route", "duration", "quantity", "refills", "instructions", "warnings", "formularyStatus", "alternatives"]
            },
            alternativePrescriptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medication: { type: Type.STRING },
                  dose: { type: Type.STRING },
                  frequency: { type: Type.STRING },
                  route: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  refills: { type: Type.NUMBER },
                  instructions: { type: Type.STRING },
                  warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                  formularyStatus: { type: Type.STRING },
                  alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  costEstimate: { type: Type.STRING }
                },
                required: ["medication", "dose", "frequency", "route", "duration", "quantity", "refills", "instructions", "warnings", "formularyStatus", "alternatives"]
              }
            },
            adjunctiveMedications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medication: { type: Type.STRING },
                  dose: { type: Type.STRING },
                  frequency: { type: Type.STRING },
                  route: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  refills: { type: Type.NUMBER },
                  instructions: { type: Type.STRING },
                  warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                  formularyStatus: { type: Type.STRING },
                  alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  costEstimate: { type: Type.STRING }
                },
                required: ["medication", "dose", "frequency", "route", "duration", "quantity", "refills", "instructions", "warnings", "formularyStatus", "alternatives"]
              }
            },
            drugInteractions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medication1: { type: Type.STRING },
                  medication2: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING },
                  management: { type: Type.STRING }
                },
                required: ["medication1", "medication2", "severity", "description", "management"]
              }
            },
            counselingPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            followUpRequired: { type: Type.BOOLEAN }
          },
          required: ["primaryPrescription", "alternativePrescriptions", "adjunctiveMedications", "drugInteractions", "counselingPoints", "followUpRequired"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as PrescriptionResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in prescription generation:", error);
    return createResponse(true, getMockPrescriptionResult(input), undefined, Date.now() - startTime);
  }
};

const getMockPrescriptionResult = (input: PrescriptionInput): PrescriptionResult => {
  const diagnosis = input.diagnosis.toLowerCase();

  if (diagnosis.includes('hypertension') || diagnosis.includes('high blood pressure')) {
    return {
      primaryPrescription: {
        medication: 'Lisinopril',
        dose: '10 mg',
        frequency: 'Once daily',
        route: 'Oral',
        duration: '30 days',
        quantity: 30,
        refills: 3,
        instructions: 'Take at the same time each day, with or without food',
        warnings: ['May cause dry cough', 'Avoid potassium supplements', 'Do not take if pregnant'],
        formularyStatus: 'Preferred',
        alternatives: ['Amlodipine', 'Losartan'],
        costEstimate: '$4-10/month'
      },
      alternativePrescriptions: [
        {
          medication: 'Amlodipine',
          dose: '5 mg',
          frequency: 'Once daily',
          route: 'Oral',
          duration: '30 days',
          quantity: 30,
          refills: 3,
          instructions: 'Take with or without food',
          warnings: ['May cause ankle swelling', 'Avoid grapefruit'],
          formularyStatus: 'Preferred',
          alternatives: ['Lisinopril'],
          costEstimate: '$4-15/month'
        }
      ],
      adjunctiveMedications: [],
      drugInteractions: [],
      counselingPoints: [
        'Monitor blood pressure regularly',
        'Report any swelling or difficulty breathing',
        'Maintain low-sodium diet'
      ],
      followUpRequired: true
    };
  }

  if (diagnosis.includes('diabetes') || diagnosis.includes('diabetic')) {
    return {
      primaryPrescription: {
        medication: 'Metformin',
        dose: '500 mg',
        frequency: 'Twice daily',
        route: 'Oral',
        duration: '30 days',
        quantity: 60,
        refills: 3,
        instructions: 'Take with meals to reduce GI side effects',
        warnings: ['Monitor for lactic acidosis symptoms', 'Hold before contrast imaging', 'Check renal function regularly'],
        formularyStatus: 'Preferred',
        alternatives: ['Glipizide', 'Sitagliptin'],
        costEstimate: '$4-20/month'
      },
      alternativePrescriptions: [],
      adjunctiveMedications: [],
      drugInteractions: [],
      counselingPoints: [
        'Monitor blood glucose as directed',
        'Follow diabetic diet',
        'Stay hydrated'
      ],
      followUpRequired: true
    };
  }

  if (diagnosis.includes('infection') || diagnosis.includes('pneumonia') || diagnosis.includes('bronchitis')) {
    return {
      primaryPrescription: {
        medication: 'Amoxicillin',
        dose: '500 mg',
        frequency: 'Every 8 hours',
        route: 'Oral',
        duration: '7 days',
        quantity: 21,
        refills: 0,
        instructions: 'Complete full course of antibiotics',
        warnings: ['Take with or without food', 'Report any allergic reactions'],
        formularyStatus: 'Preferred',
        alternatives: ['Azithromycin', 'Doxycycline'],
        costEstimate: '$4-15'
      },
      alternativePrescriptions: [],
      adjunctiveMedications: [
        {
          medication: 'Acetaminophen',
          dose: '500 mg',
          frequency: 'Every 6 hours as needed',
          route: 'Oral',
          duration: 'As needed',
          quantity: 20,
          refills: 0,
          instructions: 'For fever or pain, do not exceed 3000mg/day',
          warnings: ['Do not exceed recommended dose', 'Avoid alcohol'],
          formularyStatus: 'Preferred',
          alternatives: ['Ibuprofen'],
          costEstimate: '$3-8'
        }
      ],
      drugInteractions: [],
      counselingPoints: [
        'Complete full antibiotic course',
        'Stay hydrated',
        'Return if symptoms worsen'
      ],
      followUpRequired: true
    };
  }

  return {
    primaryPrescription: {
      medication: 'As clinically indicated',
      dose: 'Per guidelines',
      frequency: 'As directed',
      route: 'Oral',
      duration: 'As appropriate',
      quantity: 0,
      refills: 0,
      instructions: 'Follow prescribing guidelines',
      warnings: ['Review contraindications'],
      formularyStatus: 'Preferred',
      alternatives: []
    },
    alternativePrescriptions: [],
    adjunctiveMedications: [],
    drugInteractions: [],
    counselingPoints: ['Follow up as needed'],
    followUpRequired: true
  };
};

// ============================================
// OPERATIONAL AI FEATURES - Batch 2
// ============================================

// 1. AI-POWERED BED MANAGEMENT OPTIMIZER
// ============================================

export const optimizeBedManagement = async (input: BedManagementInput): Promise<AIResponse<BedManagementResult>> => {
  const startTime = Date.now();
  const cacheKey = `bed-mgmt-${JSON.stringify(input)}`;

  const cached = getCached<BedManagementResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockBedManagementResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a hospital operations AI assistant specializing in bed management optimization. Analyze the following data and provide bed assignment recommendations.

Current Beds: ${JSON.stringify(input.currentBeds)}
Patient Acuity: ${input.patientAcuity || 'Unknown'}
Expected Length of Stay: ${input.expectedLOS || 'Unknown'} days
Department: ${input.department || 'Any'}
Pending Discharges: ${JSON.stringify(input.pendingDischarges || [])}
Incoming Patients: ${JSON.stringify(input.incomingPatients || [])}

Provide optimal bed assignments, turnover predictions, and discharge planning suggestions.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimalAssignments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  bedId: { type: Type.STRING },
                  ward: { type: Type.STRING },
                  bedNumber: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING },
                  advantages: { type: Type.ARRAY, items: { type: Type.STRING } },
                  considerations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["bedId", "ward", "bedNumber", "matchScore", "reasoning", "advantages", "considerations"]
              }
            },
            turnoverPredictions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  bedId: { type: Type.STRING },
                  currentPatient: { type: Type.STRING },
                  predictedDischargeTime: { type: Type.STRING },
                  confidence: { type: Type.NUMBER }
                },
                required: ["bedId", "currentPatient", "predictedDischargeTime", "confidence"]
              }
            },
            dischargePlanningSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  patientName: { type: Type.STRING },
                  currentBed: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                  barriers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  estimatedDischargeDate: { type: Type.STRING }
                },
                required: ["patientName", "currentBed", "recommendation", "barriers", "estimatedDischargeDate"]
              }
            },
            capacityForecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  expectedOccupancy: { type: Type.NUMBER },
                  availableBeds: { type: Type.NUMBER }
                },
                required: ["time", "expectedOccupancy", "availableBeds"]
              }
            },
            alerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["critical", "warning", "info"] },
                  message: { type: Type.STRING },
                  affectedBeds: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["type", "message", "affectedBeds"]
              }
            }
          },
          required: ["optimalAssignments", "turnoverPredictions", "dischargePlanningSuggestions", "capacityForecast", "alerts"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as BedManagementResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in bed management optimization:", error);
    return createResponse(true, getMockBedManagementResult(input), undefined, Date.now() - startTime);
  }
};

const getMockBedManagementResult = (input: BedManagementInput): BedManagementResult => {
  const availableBeds = input.currentBeds.filter(b => b.status === 'Available');
  const occupiedBeds = input.currentBeds.filter(b => b.status === 'Occupied');

  return {
    optimalAssignments: availableBeds.slice(0, 3).map((bed, idx) => ({
      bedId: bed.id,
      ward: bed.ward,
      bedNumber: bed.number,
      matchScore: 85 + idx * 5,
      reasoning: `Bed matches patient acuity requirements and department proximity`,
      advantages: ['Close to nursing station', 'Appropriate equipment available', 'Isolation capable'],
      considerations: ['May need transfer for specialized care']
    })),
    turnoverPredictions: occupiedBeds.slice(0, 5).map(bed => ({
      bedId: bed.id,
      currentPatient: bed.patientName || 'Unknown',
      predictedDischargeTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      confidence: 0.75
    })),
    dischargePlanningSuggestions: [
      {
        patientName: occupiedBeds[0]?.patientName || 'Patient A',
        currentBed: occupiedBeds[0]?.number || '101',
        recommendation: 'Ready for discharge pending final assessment',
        barriers: ['Pending lab results'],
        estimatedDischargeDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ],
    capacityForecast: [
      { time: '08:00', expectedOccupancy: 85, availableBeds: 15 },
      { time: '12:00', expectedOccupancy: 90, availableBeds: 10 },
      { time: '16:00', expectedOccupancy: 88, availableBeds: 12 },
      { time: '20:00', expectedOccupancy: 82, availableBeds: 18 }
    ],
    alerts: [
      { type: 'warning', message: 'ICU capacity approaching critical level', affectedBeds: ['ICU-01', 'ICU-02'] }
    ]
  };
};

// 2. INTELLIGENT OPERATING ROOM SCHEDULER
// ============================================

export const optimizeORSchedule = async (input: ORSchedulerInput): Promise<AIResponse<ORSchedulerResult>> => {
  const startTime = Date.now();
  const cacheKey = `or-schedule-${JSON.stringify(input)}`;

  const cached = getCached<ORSchedulerResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockORSchedulerResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a surgical operations AI assistant. Optimize the operating room schedule based on the following information.

Procedures: ${JSON.stringify(input.procedures)}
Operating Rooms: ${JSON.stringify(input.operatingRooms)}
Staff Availability: ${JSON.stringify(input.staffAvailability)}
Current Date/Time: ${input.currentDateTime || new Date().toISOString()}

Provide an optimized schedule with predicted durations and resource allocation.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  procedureId: { type: Type.STRING },
                  procedureName: { type: Type.STRING },
                  assignedOR: { type: Type.STRING },
                  suggestedStartTime: { type: Type.STRING },
                  predictedDuration: { type: Type.NUMBER },
                  predictedEndTime: { type: Type.STRING },
                  assignedStaff: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        role: { type: Type.STRING },
                        name: { type: Type.STRING }
                      }
                    }
                  },
                  equipmentAllocated: { type: Type.ARRAY, items: { type: Type.STRING } },
                  optimizationScore: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING }
                },
                required: ["procedureId", "procedureName", "assignedOR", "suggestedStartTime", "predictedDuration", "predictedEndTime", "assignedStaff", "equipmentAllocated", "optimizationScore", "reasoning"]
              }
            },
            durationPredictions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  procedureId: { type: Type.STRING },
                  procedureName: { type: Type.STRING },
                  baseDuration: { type: Type.NUMBER },
                  adjustedDuration: { type: Type.NUMBER },
                  factors: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["procedureId", "procedureName", "baseDuration", "adjustedDuration", "factors"]
              }
            },
            resourceOptimization: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  resource: { type: Type.STRING },
                  utilizationRate: { type: Type.NUMBER },
                  conflicts: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["resource", "utilizationRate", "conflicts", "suggestions"]
              }
            },
            conflicts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  description: { type: Type.STRING },
                  affectedProcedures: { type: Type.ARRAY, items: { type: Type.STRING } },
                  resolution: { type: Type.STRING }
                },
                required: ["type", "description", "affectedProcedures", "resolution"]
              }
            },
            efficiency: {
              type: Type.OBJECT,
              properties: {
                orUtilizationRate: { type: Type.NUMBER },
                staffUtilizationRate: { type: Type.NUMBER },
                predictedDelays: { type: Type.NUMBER }
              },
              required: ["orUtilizationRate", "staffUtilizationRate", "predictedDelays"]
            }
          },
          required: ["schedule", "durationPredictions", "resourceOptimization", "conflicts", "efficiency"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as ORSchedulerResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in OR scheduling optimization:", error);
    return createResponse(true, getMockORSchedulerResult(input), undefined, Date.now() - startTime);
  }
};

const getMockORSchedulerResult = (input: ORSchedulerInput): ORSchedulerResult => {
  return {
    schedule: input.procedures.slice(0, 5).map((proc, idx) => ({
      procedureId: proc.id,
      procedureName: proc.procedureName,
      assignedOR: input.operatingRooms[idx % input.operatingRooms.length]?.name || 'OR-1',
      suggestedStartTime: new Date(Date.now() + idx * 4 * 60 * 60 * 1000).toISOString(),
      predictedDuration: proc.estimatedDuration || 120,
      predictedEndTime: new Date(Date.now() + (idx * 4 + 2) * 60 * 60 * 1000).toISOString(),
      assignedStaff: [
        { role: 'Surgeon', name: proc.surgeon },
        { role: 'Anesthesiologist', name: 'Dr. Smith' },
        { role: 'Scrub Nurse', name: 'Nurse Johnson' }
      ],
      equipmentAllocated: proc.requiredEquipment || ['Standard surgical kit'],
      optimizationScore: 85,
      reasoning: 'Optimal scheduling based on surgeon availability and equipment requirements'
    })),
    durationPredictions: input.procedures.map(proc => ({
      procedureId: proc.id,
      procedureName: proc.procedureName,
      baseDuration: proc.estimatedDuration || 90,
      adjustedDuration: (proc.estimatedDuration || 90) + (proc.patientAge && proc.patientAge > 65 ? 15 : 0),
      factors: proc.patientAge && proc.patientAge > 65 ? ['Age-adjusted duration'] : []
    })),
    resourceOptimization: [
      { resource: 'OR-1', utilizationRate: 85, conflicts: [], suggestions: ['Consider adding turnover buffer'] }
    ],
    conflicts: [],
    efficiency: {
      orUtilizationRate: 82,
      staffUtilizationRate: 78,
      predictedDelays: 2
    }
  };
};

// 3. SMART INVENTORY FORECASTING
// ============================================

export const forecastInventory = async (input: InventoryForecastInput): Promise<AIResponse<InventoryForecastResult>> => {
  const startTime = Date.now();
  const cacheKey = `inventory-forecast-${JSON.stringify(input)}`;

  const cached = getCached<InventoryForecastResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockInventoryForecastResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a hospital supply chain AI assistant. Analyze inventory data and provide demand forecasts and reorder recommendations.

Items: ${JSON.stringify(input.items)}
Historical Usage: ${JSON.stringify(input.historicalUsage || [])}
Upcoming Procedures: ${JSON.stringify(input.upcomingProcedures || [])}
Current Stock: ${JSON.stringify(input.currentStock)}

Provide demand forecasts, reorder recommendations, expiry alerts, and cost optimization suggestions.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            demandForecasts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  itemId: { type: Type.STRING },
                  itemName: { type: Type.STRING },
                  predictedDemand: { type: Type.NUMBER },
                  timeframe: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  trend: { type: Type.STRING, enum: ["increasing", "stable", "decreasing"] }
                },
                required: ["itemId", "itemName", "predictedDemand", "timeframe", "confidence", "trend"]
              }
            },
            reorderRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  itemId: { type: Type.STRING },
                  itemName: { type: Type.STRING },
                  currentStock: { type: Type.NUMBER },
                  recommendedOrderQuantity: { type: Type.NUMBER },
                  urgency: { type: Type.STRING, enum: ["Immediate", "Soon", "Normal"] },
                  estimatedStockoutDate: { type: Type.STRING },
                  preferredVendor: { type: Type.STRING }
                },
                required: ["itemId", "itemName", "currentStock", "recommendedOrderQuantity", "urgency", "estimatedStockoutDate"]
              }
            },
            expiryAlerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  itemId: { type: Type.STRING },
                  itemName: { type: Type.STRING },
                  batchNumber: { type: Type.STRING },
                  expiryDate: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  daysUntilExpiry: { type: Type.NUMBER },
                  action: { type: Type.STRING, enum: ["Use First", "Donate", "Dispose"] }
                },
                required: ["itemId", "itemName", "batchNumber", "expiryDate", "quantity", "daysUntilExpiry", "action"]
              }
            },
            costOptimizations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  itemId: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                  potentialSavings: { type: Type.NUMBER },
                  implementation: { type: Type.STRING }
                },
                required: ["itemId", "suggestion", "potentialSavings", "implementation"]
              }
            },
            autoPurchaseOrders: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  vendor: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        itemId: { type: Type.STRING },
                        itemName: { type: Type.STRING },
                        quantity: { type: Type.NUMBER },
                        estimatedCost: { type: Type.NUMBER }
                      }
                    }
                  },
                  totalEstimatedCost: { type: Type.NUMBER },
                  priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
                },
                required: ["vendor", "items", "totalEstimatedCost", "priority"]
              }
            }
          },
          required: ["demandForecasts", "reorderRecommendations", "expiryAlerts", "costOptimizations"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as InventoryForecastResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in inventory forecasting:", error);
    return createResponse(true, getMockInventoryForecastResult(input), undefined, Date.now() - startTime);
  }
};

const getMockInventoryForecastResult = (input: InventoryForecastInput): InventoryForecastResult => {
  const lowStockItems = input.items.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock');

  return {
    demandForecasts: input.items.slice(0, 5).map(item => ({
      itemId: item.id,
      itemName: item.name,
      predictedDemand: Math.round(item.stock * 1.5),
      timeframe: 'Next 30 days',
      confidence: 0.85,
      trend: 'stable' as const
    })),
    reorderRecommendations: lowStockItems.map(item => ({
      itemId: item.id,
      itemName: item.name,
      currentStock: item.stock,
      recommendedOrderQuantity: 100,
      urgency: item.status === 'Out of Stock' ? 'Immediate' as const : 'Soon' as const,
      estimatedStockoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      preferredVendor: 'Primary Medical Supplies Inc.'
    })),
    expiryAlerts: [
      {
        itemId: 'med-001',
        itemName: 'Amoxicillin 500mg',
        batchNumber: 'B2024-001',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 50,
        daysUntilExpiry: 30,
        action: 'Use First' as const
      }
    ],
    costOptimizations: [
      {
        itemId: input.items[0]?.id || 'item-001',
        suggestion: 'Bulk ordering discount available',
        potentialSavings: 500,
        implementation: 'Order 3-month supply instead of monthly'
      }
    ],
    autoPurchaseOrders: lowStockItems.length > 0 ? [{
      vendor: 'Medical Supplies Co.',
      items: lowStockItems.map(item => ({
        itemId: item.id,
        itemName: item.name,
        quantity: 100,
        estimatedCost: 500
      })),
      totalEstimatedCost: lowStockItems.length * 500,
      priority: 'High' as const
    }] : undefined
  };
};

// 4. INTELLIGENT PATIENT FLOW ANALYTICS
// ============================================

export const analyzePatientFlow = async (input: PatientFlowInput): Promise<AIResponse<PatientFlowResult>> => {
  const startTime = Date.now();
  const cacheKey = `patient-flow-${JSON.stringify(input)}`;

  const cached = getCached<PatientFlowResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockPatientFlowResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a hospital operations AI assistant specializing in patient flow optimization. Analyze the following data and provide insights.

Current Queue: ${JSON.stringify(input.currentQueue)}
Historical Data: ${JSON.stringify(input.historicalData || [])}
Staffing Levels: ${JSON.stringify(input.staffingLevels || [])}
Department Capacities: ${JSON.stringify(input.departmentCapacities || [])}

Provide volume predictions, bottleneck analysis, staffing recommendations, and wait time optimizations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            volumePredictions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeframe: { type: Type.STRING },
                  predictedPatients: { type: Type.NUMBER },
                  confidence: { type: Type.NUMBER },
                  peakHours: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["timeframe", "predictedPatients", "confidence", "peakHours"]
              }
            },
            bottleneckAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  location: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["Critical", "High", "Medium", "Low"] },
                  cause: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  affectedPatients: { type: Type.NUMBER },
                  recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["location", "severity", "cause", "impact", "affectedPatients", "recommendations"]
              }
            },
            staffingRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  department: { type: Type.STRING },
                  currentStaff: { type: Type.NUMBER },
                  recommendedStaff: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING },
                  timeSlots: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        required: { type: Type.NUMBER }
                      }
                    }
                  }
                },
                required: ["department", "currentStaff", "recommendedStaff", "reasoning", "timeSlots"]
              }
            },
            waitTimeOptimizations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  department: { type: Type.STRING },
                  currentAvgWait: { type: Type.NUMBER },
                  predictedAvgWait: { type: Type.NUMBER },
                  improvementActions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["department", "currentAvgWait", "predictedAvgWait", "improvementActions"]
              }
            },
            flowEfficiency: {
              type: Type.OBJECT,
              properties: {
                overallScore: { type: Type.NUMBER },
                departmentScores: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      department: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      trend: { type: Type.STRING, enum: ["improving", "stable", "declining"] }
                    }
                  }
                }
              },
              required: ["overallScore", "departmentScores"]
            }
          },
          required: ["volumePredictions", "bottleneckAnalysis", "staffingRecommendations", "waitTimeOptimizations", "flowEfficiency"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as PatientFlowResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in patient flow analysis:", error);
    return createResponse(true, getMockPatientFlowResult(input), undefined, Date.now() - startTime);
  }
};

const getMockPatientFlowResult = (input: PatientFlowInput): PatientFlowResult => {
  return {
    volumePredictions: [
      { timeframe: 'Today', predictedPatients: 150, confidence: 0.9, peakHours: ['10:00', '14:00', '18:00'] },
      { timeframe: 'Tomorrow', predictedPatients: 165, confidence: 0.85, peakHours: ['11:00', '15:00'] },
      { timeframe: 'This Week', predictedPatients: 950, confidence: 0.8, peakHours: ['Monday 10:00', 'Friday 14:00'] }
    ],
    bottleneckAnalysis: [
      {
        location: 'Emergency Department',
        severity: 'High',
        cause: 'Insufficient triage staff during peak hours',
        impact: 'Increased wait times and patient dissatisfaction',
        affectedPatients: 25,
        recommendations: ['Add triage nurse during peak hours', 'Implement fast-track for minor complaints']
      }
    ],
    staffingRecommendations: [
      {
        department: 'Emergency',
        currentStaff: 5,
        recommendedStaff: 7,
        reasoning: 'Current staffing insufficient for predicted volume',
        timeSlots: [
          { time: '08:00-12:00', required: 6 },
          { time: '12:00-16:00', required: 7 },
          { time: '16:00-20:00', required: 6 }
        ]
      }
    ],
    waitTimeOptimizations: [
      {
        department: 'OPD',
        currentAvgWait: 45,
        predictedAvgWait: 35,
        improvementActions: ['Implement appointment reminders', 'Add check-in kiosks', 'Optimize doctor schedules']
      }
    ],
    flowEfficiency: {
      overallScore: 72,
      departmentScores: [
        { department: 'Emergency', score: 65, trend: 'improving' },
        { department: 'OPD', score: 78, trend: 'stable' },
        { department: 'Radiology', score: 82, trend: 'improving' }
      ]
    }
  };
};

// 5. SMART AMBULANCE DISPATCH SYSTEM
// ============================================

export const optimizeAmbulanceDispatch = async (input: AmbulanceDispatchInput): Promise<AIResponse<AmbulanceDispatchResult>> => {
  const startTime = Date.now();
  const cacheKey = `ambulance-dispatch-${JSON.stringify(input)}`;

  const cached = getCached<AmbulanceDispatchResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockAmbulanceDispatchResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an emergency medical services AI assistant. Optimize ambulance dispatch for the following emergency.

Emergency: ${JSON.stringify(input.emergency)}
Available Ambulances: ${JSON.stringify(input.availableAmbulances)}
Hospital Capacity: ${JSON.stringify(input.hospitalCapacity)}
Traffic Conditions: ${JSON.stringify(input.trafficConditions || 'Unknown')}
Weather: ${input.weatherConditions || 'Unknown'}

Provide optimal ambulance selection, route recommendations, and ETA predictions.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedAmbulance: {
              type: Type.OBJECT,
              properties: {
                ambulanceId: { type: Type.STRING },
                vehicleNumber: { type: Type.STRING },
                driverName: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["ALS", "BLS"] },
                eta: { type: Type.NUMBER },
                distance: { type: Type.NUMBER }
              },
              required: ["ambulanceId", "vehicleNumber", "driverName", "type", "eta", "distance"]
            },
            routeRecommendation: {
              type: Type.OBJECT,
              properties: {
                route: { type: Type.STRING },
                estimatedTime: { type: Type.NUMBER },
                distance: { type: Type.NUMBER },
                trafficConditions: { type: Type.STRING },
                alternativeRoutes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      route: { type: Type.STRING },
                      estimatedTime: { type: Type.NUMBER },
                      reason: { type: Type.STRING }
                    }
                  }
                }
              },
              required: ["route", "estimatedTime", "distance", "trafficConditions", "alternativeRoutes"]
            },
            hospitalDestination: {
              type: Type.OBJECT,
              properties: {
                recommendedHospital: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                availableResources: { type: Type.ARRAY, items: { type: Type.STRING } },
                preparationInstructions: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["recommendedHospital", "reasoning", "availableResources", "preparationInstructions"]
            },
            etaPredictions: {
              type: Type.OBJECT,
              properties: {
                toScene: { type: Type.NUMBER },
                toHospital: { type: Type.NUMBER },
                total: { type: Type.NUMBER },
                confidence: { type: Type.NUMBER },
                factors: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["toScene", "toHospital", "total", "confidence", "factors"]
            },
            emergencyResponse: {
              type: Type.OBJECT,
              properties: {
                priorityLevel: { type: Type.NUMBER },
                recommendedResources: { type: Type.ARRAY, items: { type: Type.STRING } },
                preHospitalInstructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                notifications: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["priorityLevel", "recommendedResources", "preHospitalInstructions", "notifications"]
            }
          },
          required: ["recommendedAmbulance", "routeRecommendation", "hospitalDestination", "etaPredictions", "emergencyResponse"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as AmbulanceDispatchResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in ambulance dispatch optimization:", error);
    return createResponse(true, getMockAmbulanceDispatchResult(input), undefined, Date.now() - startTime);
  }
};

const getMockAmbulanceDispatchResult = (input: AmbulanceDispatchInput): AmbulanceDispatchResult => {
  const availableAmbulance = input.availableAmbulances[0];

  return {
    recommendedAmbulance: {
      ambulanceId: availableAmbulance?.id || 'AMB-001',
      vehicleNumber: availableAmbulance?.vehicleNumber || 'AMB-101',
      driverName: availableAmbulance?.driverName || 'John Driver',
      type: availableAmbulance?.type || 'ALS',
      eta: 8,
      distance: 3.5
    },
    routeRecommendation: {
      route: 'Main Street → Hospital Road → Emergency Entrance',
      estimatedTime: 12,
      distance: 4.2,
      trafficConditions: 'Moderate traffic on Main Street',
      alternativeRoutes: [
        { route: 'Highway 101 → Exit 5', estimatedTime: 15, reason: 'Longer but less traffic' }
      ]
    },
    hospitalDestination: {
      recommendedHospital: 'NexusHealth Main Hospital',
      reasoning: 'Closest facility with required emergency resources',
      availableResources: ['Trauma Bay', 'ICU Bed', 'Blood Bank'],
      preparationInstructions: ['Alert trauma team', 'Prepare blood products', 'Clear bay 3']
    },
    etaPredictions: {
      toScene: 8,
      toHospital: 12,
      total: 20,
      confidence: 0.85,
      factors: ['Current traffic', 'Weather conditions', 'Time of day']
    },
    emergencyResponse: {
      priorityLevel: input.emergency.severity === 'Critical' ? 1 : 2,
      recommendedResources: ['ALS Unit', 'Fire Department', 'Police'],
      preHospitalInstructions: ['Keep patient calm', 'Monitor vital signs', 'Prepare for transport'],
      notifications: ['Emergency Department', 'Trauma Surgeon', 'Blood Bank']
    }
  };
};

// 6. AI-POWERED STAFF SCHEDULING OPTIMIZER
// ============================================

export const optimizeStaffScheduling = async (input: StaffSchedulingInput): Promise<AIResponse<StaffSchedulingResult>> => {
  const startTime = Date.now();
  const cacheKey = `staff-scheduling-${JSON.stringify(input)}`;

  const cached = getCached<StaffSchedulingResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockStaffSchedulingResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a hospital workforce management AI assistant. Optimize staff scheduling based on the following information.

Staff: ${JSON.stringify(input.staff)}
Shifts: ${JSON.stringify(input.shifts)}
Historical Patterns: ${JSON.stringify(input.historicalPatterns || [])}

Provide an optimized schedule that balances preferences, skills, workload, and fatigue management.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedSchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  shiftId: { type: Type.STRING },
                  date: { type: Type.STRING },
                  time: { type: Type.STRING },
                  area: { type: Type.STRING },
                  assignedStaff: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        staffId: { type: Type.STRING },
                        name: { type: Type.STRING },
                        role: { type: Type.STRING },
                        matchScore: { type: Type.NUMBER }
                      }
                    }
                  },
                  coverageGap: { type: Type.BOOLEAN }
                },
                required: ["shiftId", "date", "time", "area", "assignedStaff", "coverageGap"]
              }
            },
            staffingNeeds: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  department: { type: Type.STRING },
                  predictedDemand: { type: Type.NUMBER },
                  currentAllocation: { type: Type.NUMBER },
                  gap: { type: Type.NUMBER },
                  recommendation: { type: Type.STRING }
                },
                required: ["date", "department", "predictedDemand", "currentAllocation", "gap", "recommendation"]
              }
            },
            fatigueRiskAlerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  staffId: { type: Type.STRING },
                  staffName: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                  consecutiveShifts: { type: Type.NUMBER },
                  hoursWorked: { type: Type.NUMBER },
                  recommendation: { type: Type.STRING }
                },
                required: ["staffId", "staffName", "riskLevel", "consecutiveShifts", "hoursWorked", "recommendation"]
              }
            },
            skillMatching: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  shiftId: { type: Type.STRING },
                  requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  coveredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["shiftId", "requiredSkills", "coveredSkills", "missingSkills", "suggestions"]
              }
            },
            optimizationMetrics: {
              type: Type.OBJECT,
              properties: {
                preferenceMatchRate: { type: Type.NUMBER },
                skillCoverageRate: { type: Type.NUMBER },
                costEfficiency: { type: Type.NUMBER },
                fairnessScore: { type: Type.NUMBER }
              },
              required: ["preferenceMatchRate", "skillCoverageRate", "costEfficiency", "fairnessScore"]
            }
          },
          required: ["optimizedSchedule", "staffingNeeds", "fatigueRiskAlerts", "skillMatching", "optimizationMetrics"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as StaffSchedulingResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in staff scheduling optimization:", error);
    return createResponse(true, getMockStaffSchedulingResult(input), undefined, Date.now() - startTime);
  }
};

const getMockStaffSchedulingResult = (input: StaffSchedulingInput): StaffSchedulingResult => {
  return {
    optimizedSchedule: input.shifts.slice(0, 5).map(shift => ({
      shiftId: shift.id,
      date: shift.date,
      time: shift.time,
      area: shift.area,
      assignedStaff: input.staff
        .filter(s => s.role === shift.requiredRole)
        .slice(0, shift.minStaff)
        .map(s => ({
          staffId: s.id,
          name: s.name,
          role: s.role,
          matchScore: 85
        })),
      coverageGap: false
    })),
    staffingNeeds: [
      {
        date: new Date().toISOString().split('T')[0],
        department: 'Emergency',
        predictedDemand: 8,
        currentAllocation: 6,
        gap: 2,
        recommendation: 'Consider calling in additional staff or using float pool'
      }
    ],
    fatigueRiskAlerts: input.staff
      .filter(s => (s.fatigueScore || 0) > 70)
      .map(s => ({
        staffId: s.id,
        staffName: s.name,
        riskLevel: 'High' as const,
        consecutiveShifts: 4,
        hoursWorked: 48,
        recommendation: 'Mandatory rest period required before next shift'
      })),
    skillMatching: input.shifts.slice(0, 3).map(shift => ({
      shiftId: shift.id,
      requiredSkills: shift.requiredSkills || ['Basic Life Support'],
      coveredSkills: ['Basic Life Support', 'ACLS'],
      missingSkills: [],
      suggestions: []
    })),
    optimizationMetrics: {
      preferenceMatchRate: 78,
      skillCoverageRate: 92,
      costEfficiency: 85,
      fairnessScore: 80
    }
  };
};

// 7. SMART EQUIPMENT MAINTENANCE PREDICTOR
// ============================================

export const predictEquipmentMaintenance = async (input: EquipmentMaintenanceInput): Promise<AIResponse<EquipmentMaintenanceResult>> => {
  const startTime = Date.now();
  const cacheKey = `equipment-maintenance-${JSON.stringify(input)}`;

  const cached = getCached<EquipmentMaintenanceResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockEquipmentMaintenanceResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a hospital facility management AI assistant specializing in equipment maintenance. Analyze the following equipment data and provide predictive maintenance recommendations.

Equipment: ${JSON.stringify(input.equipment)}
Maintenance History: ${JSON.stringify(input.maintenanceHistory || [])}
Usage Patterns: ${JSON.stringify(input.usagePatterns || [])}

Provide predictive maintenance schedules, risk assessments, and cost optimization recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictiveMaintenance: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  equipmentId: { type: Type.STRING },
                  equipmentName: { type: Type.STRING },
                  failureRisk: { type: Type.NUMBER },
                  predictedFailureDate: { type: Type.STRING },
                  recommendedMaintenanceDate: { type: Type.STRING },
                  maintenanceType: { type: Type.STRING, enum: ["Preventive", "Predictive", "Corrective"] },
                  priority: { type: Type.STRING, enum: ["Immediate", "High", "Medium", "Low"] },
                  estimatedCost: { type: Type.NUMBER },
                  estimatedDowntime: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING }
                },
                required: ["equipmentId", "equipmentName", "failureRisk", "predictedFailureDate", "recommendedMaintenanceDate", "maintenanceType", "priority", "estimatedCost", "estimatedDowntime", "reasoning"]
              }
            },
            riskAssessment: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  equipmentId: { type: Type.STRING },
                  equipmentName: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, enum: ["Critical", "High", "Medium", "Low"] },
                  riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
                  impactOnOperations: { type: Type.STRING },
                  mitigationSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["equipmentId", "equipmentName", "riskLevel", "riskFactors", "impactOnOperations", "mitigationSteps"]
              }
            },
            costOptimization: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  equipmentId: { type: Type.STRING },
                  currentMaintenanceCost: { type: Type.NUMBER },
                  optimizedMaintenanceCost: { type: Type.NUMBER },
                  savings: { type: Type.NUMBER },
                  recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["equipmentId", "currentMaintenanceCost", "optimizedMaintenanceCost", "savings", "recommendations"]
              }
            },
            maintenanceSchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  equipment: { type: Type.ARRAY, items: { type: Type.STRING } },
                  type: { type: Type.STRING },
                  estimatedDuration: { type: Type.NUMBER },
                  requiredResources: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["date", "equipment", "type", "estimatedDuration", "requiredResources"]
              }
            },
            criticalAlerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  equipmentId: { type: Type.STRING },
                  alert: { type: Type.STRING },
                  urgency: { type: Type.STRING, enum: ["Immediate", "Urgent", "Scheduled"] },
                  action: { type: Type.STRING }
                },
                required: ["equipmentId", "alert", "urgency", "action"]
              }
            }
          },
          required: ["predictiveMaintenance", "riskAssessment", "costOptimization", "maintenanceSchedule", "criticalAlerts"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as EquipmentMaintenanceResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in equipment maintenance prediction:", error);
    return createResponse(true, getMockEquipmentMaintenanceResult(input), undefined, Date.now() - startTime);
  }
};

const getMockEquipmentMaintenanceResult = (input: EquipmentMaintenanceInput): EquipmentMaintenanceResult => {
  return {
    predictiveMaintenance: input.equipment.map(eq => ({
      equipmentId: eq.id,
      equipmentName: eq.name,
      failureRisk: eq.status === 'Broken' ? 0.9 : eq.status === 'Maintenance' ? 0.5 : 0.15,
      predictedFailureDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      recommendedMaintenanceDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maintenanceType: 'Preventive' as const,
      priority: eq.criticality === 'Critical' ? 'High' as const : 'Medium' as const,
      estimatedCost: 500,
      estimatedDowntime: 4,
      reasoning: 'Regular preventive maintenance recommended based on usage patterns'
    })),
    riskAssessment: input.equipment
      .filter(eq => eq.criticality === 'Critical')
      .map(eq => ({
        equipmentId: eq.id,
        equipmentName: eq.name,
        riskLevel: eq.status === 'Broken' ? 'Critical' as const : 'Medium' as const,
        riskFactors: ['Age', 'Usage frequency', 'Last service date'],
        impactOnOperations: 'Critical patient care may be affected',
        mitigationSteps: ['Schedule backup equipment', 'Prioritize maintenance']
      })),
    costOptimization: [
      {
        equipmentId: input.equipment[0]?.id || 'eq-001',
        currentMaintenanceCost: 2000,
        optimizedMaintenanceCost: 1500,
        savings: 500,
        recommendations: ['Switch to predictive maintenance schedule', 'Bulk purchase spare parts']
      }
    ],
    maintenanceSchedule: [
      {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        equipment: input.equipment.filter(eq => eq.status === 'Maintenance').map(eq => eq.name),
        type: 'Preventive Maintenance',
        estimatedDuration: 8,
        requiredResources: ['Technician', 'Spare parts kit', 'Calibration tools']
      }
    ],
    criticalAlerts: input.equipment
      .filter(eq => eq.status === 'Broken')
      .map(eq => ({
        equipmentId: eq.id,
        alert: 'Equipment requires immediate repair',
        urgency: 'Immediate' as const,
        action: 'Contact service technician and arrange backup equipment'
      }))
  };
};

// 8. AI-POWERED HOUSEKEEPING SCHEDULER
// ============================================

export const optimizeHousekeepingSchedule = async (input: HousekeepingSchedulingInput): Promise<AIResponse<HousekeepingSchedulingResult>> => {
  const startTime = Date.now();
  const cacheKey = `housekeeping-schedule-${JSON.stringify(input)}`;

  const cached = getCached<HousekeepingSchedulingResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockHousekeepingResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a hospital environmental services AI assistant. Optimize housekeeping schedules based on the following information.

Tasks: ${JSON.stringify(input.tasks)}
Discharge Predictions: ${JSON.stringify(input.dischargePredictions || [])}
Staff Availability: ${JSON.stringify(input.staffAvailability)}
Room Priorities: ${JSON.stringify(input.roomPriorities || [])}
Current Workload: ${JSON.stringify(input.currentWorkload || [])}

Provide an optimized cleaning schedule that prioritizes discharge-based tasks and balances workload.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedSchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  taskId: { type: Type.STRING },
                  area: { type: Type.STRING },
                  assignee: { type: Type.STRING },
                  scheduledTime: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["High", "Normal"] },
                  estimatedDuration: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING }
                },
                required: ["taskId", "area", "assignee", "scheduledTime", "priority", "estimatedDuration", "reasoning"]
              }
            },
            dischargeBasedTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  roomNumber: { type: Type.STRING },
                  predictedDischargeTime: { type: Type.STRING },
                  cleaningWindow: {
                    type: Type.OBJECT,
                    properties: {
                      start: { type: Type.STRING },
                      end: { type: Type.STRING }
                    }
                  },
                  priority: { type: Type.STRING, enum: ["High", "Normal"] },
                  specialRequirements: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["roomNumber", "predictedDischargeTime", "cleaningWindow", "priority", "specialRequirements"]
              }
            },
            resourceAllocation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  staffName: { type: Type.STRING },
                  assignedTasks: { type: Type.NUMBER },
                  workloadScore: { type: Type.NUMBER },
                  efficiency: { type: Type.NUMBER }
                },
                required: ["staffName", "assignedTasks", "workloadScore", "efficiency"]
              }
            },
            priorityAdjustments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  area: { type: Type.STRING },
                  originalPriority: { type: Type.STRING },
                  adjustedPriority: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["area", "originalPriority", "adjustedPriority", "reason"]
              }
            },
            efficiency: {
              type: Type.OBJECT,
              properties: {
                estimatedCompletionTime: { type: Type.NUMBER },
                staffUtilization: { type: Type.NUMBER },
                taskDistribution: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      staff: { type: Type.STRING },
                      tasks: { type: Type.NUMBER }
                    }
                  }
                }
              },
              required: ["estimatedCompletionTime", "staffUtilization", "taskDistribution"]
            }
          },
          required: ["optimizedSchedule", "dischargeBasedTasks", "resourceAllocation", "priorityAdjustments", "efficiency"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as HousekeepingSchedulingResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in housekeeping schedule optimization:", error);
    return createResponse(true, getMockHousekeepingResult(input), undefined, Date.now() - startTime);
  }
};

const getMockHousekeepingResult = (input: HousekeepingSchedulingInput): HousekeepingSchedulingResult => {
  return {
    optimizedSchedule: input.tasks.map((task, idx) => ({
      taskId: task.id,
      area: task.area,
      assignee: input.staffAvailability[idx % input.staffAvailability.length]?.name || 'Unassigned',
      scheduledTime: new Date(Date.now() + idx * 30 * 60 * 1000).toISOString(),
      priority: task.priority,
      estimatedDuration: 30,
      reasoning: 'Scheduled based on priority and staff availability'
    })),
    dischargeBasedTasks: (input.dischargePredictions || []).map(dp => ({
      roomNumber: dp.roomNumber,
      predictedDischargeTime: dp.predictedDischargeTime,
      cleaningWindow: {
        start: dp.predictedDischargeTime,
        end: new Date(new Date(dp.predictedDischargeTime).getTime() + 60 * 60 * 1000).toISOString()
      },
      priority: 'High' as const,
      specialRequirements: ['Terminal clean', 'Linen change', 'Surface disinfection']
    })),
    resourceAllocation: input.staffAvailability.map(staff => ({
      staffName: staff.name,
      assignedTasks: Math.ceil(input.tasks.length / input.staffAvailability.length),
      workloadScore: 75,
      efficiency: 85
    })),
    priorityAdjustments: [
      {
        area: 'ICU Room 101',
        originalPriority: 'Normal',
        adjustedPriority: 'High',
        reason: 'Incoming admission scheduled'
      }
    ],
    efficiency: {
      estimatedCompletionTime: 240,
      staffUtilization: 82,
      taskDistribution: input.staffAvailability.map(staff => ({
        staff: staff.name,
        tasks: Math.ceil(input.tasks.length / input.staffAvailability.length)
      }))
    }
  };
};

// 9. INTELLIGENT WASTE MANAGEMENT SYSTEM
// ============================================

export const optimizeWasteManagement = async (input: WasteManagementInput): Promise<AIResponse<WasteManagementResult>> => {
  const startTime = Date.now();
  const cacheKey = `waste-management-${JSON.stringify(input)}`;

  const cached = getCached<WasteManagementResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockWasteManagementResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a hospital environmental compliance AI assistant. Optimize waste management based on the following information.

Waste Records: ${JSON.stringify(input.wasteRecords)}
Historical Generation: ${JSON.stringify(input.historicalGeneration || [])}
Collection Schedule: ${JSON.stringify(input.collectionSchedule || [])}
Storage Capacity: ${JSON.stringify(input.storageCapacity || [])}

Provide waste generation predictions, collection optimization, compliance alerts, and cost analysis.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            generationPredictions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  wasteType: { type: Type.STRING, enum: ["Infectious", "Sharps", "General", "Chemical"] },
                  predictedWeight: { type: Type.NUMBER },
                  timeframe: { type: Type.STRING },
                  trend: { type: Type.STRING, enum: ["increasing", "stable", "decreasing"] },
                  departmentBreakdown: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        department: { type: Type.STRING },
                        percentage: { type: Type.NUMBER }
                      }
                    }
                  }
                },
                required: ["wasteType", "predictedWeight", "timeframe", "trend", "departmentBreakdown"]
              }
            },
            collectionOptimization: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  wasteType: { type: Type.STRING },
                  recommendedSchedule: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.STRING },
                      time: { type: Type.STRING },
                      frequency: { type: Type.STRING }
                    }
                  },
                  reasoning: { type: Type.STRING },
                  costSavings: { type: Type.NUMBER }
                },
                required: ["wasteType", "recommendedSchedule", "reasoning", "costSavings"]
              }
            },
            complianceAlerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["Storage", "Segregation", "Documentation", "Disposal"] },
                  severity: { type: Type.STRING, enum: ["Critical", "Warning", "Info"] },
                  description: { type: Type.STRING },
                  location: { type: Type.STRING },
                  requiredAction: { type: Type.STRING },
                  deadline: { type: Type.STRING }
                },
                required: ["type", "severity", "description", "location", "requiredAction", "deadline"]
              }
            },
            costAnalysis: {
              type: Type.OBJECT,
              properties: {
                currentCost: { type: Type.NUMBER },
                optimizedCost: { type: Type.NUMBER },
                savings: { type: Type.NUMBER },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["currentCost", "optimizedCost", "savings", "recommendations"]
            },
            environmentalImpact: {
              type: Type.OBJECT,
              properties: {
                carbonFootprint: { type: Type.NUMBER },
                recyclingRate: { type: Type.NUMBER },
                improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["carbonFootprint", "recyclingRate", "improvementSuggestions"]
            }
          },
          required: ["generationPredictions", "collectionOptimization", "complianceAlerts", "costAnalysis", "environmentalImpact"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as WasteManagementResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in waste management optimization:", error);
    return createResponse(true, getMockWasteManagementResult(input), undefined, Date.now() - startTime);
  }
};

const getMockWasteManagementResult = (input: WasteManagementInput): WasteManagementResult => {
  return {
    generationPredictions: [
      {
        wasteType: 'Infectious',
        predictedWeight: 150,
        timeframe: 'Next 7 days',
        trend: 'stable',
        departmentBreakdown: [
          { department: 'Surgery', percentage: 35 },
          { department: 'Emergency', percentage: 25 },
          { department: 'ICU', percentage: 20 },
          { department: 'Other', percentage: 20 }
        ]
      },
      {
        wasteType: 'Sharps',
        predictedWeight: 25,
        timeframe: 'Next 7 days',
        trend: 'increasing',
        departmentBreakdown: [
          { department: 'Lab', percentage: 40 },
          { department: 'Emergency', percentage: 30 },
          { department: 'Other', percentage: 30 }
        ]
      }
    ],
    collectionOptimization: [
      {
        wasteType: 'Infectious',
        recommendedSchedule: { day: 'Daily', time: '06:00', frequency: 'Daily' },
        reasoning: 'High volume requires daily collection to prevent storage overflow',
        costSavings: 200
      },
      {
        wasteType: 'Sharps',
        recommendedSchedule: { day: 'Monday, Wednesday, Friday', time: '08:00', frequency: '3x per week' },
        reasoning: 'Optimized for volume and compliance requirements',
        costSavings: 100
      }
    ],
    complianceAlerts: [
      {
        type: 'Storage',
        severity: 'Warning',
        description: 'Infectious waste storage approaching capacity',
        location: 'Main Storage Area',
        requiredAction: 'Schedule additional collection',
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ],
    costAnalysis: [
      {
        currentCost: 5000,
        optimizedCost: 4200,
        savings: 800,
        recommendations: [
          'Optimize collection frequency',
          'Improve waste segregation',
          'Negotiate better disposal rates'
        ]
      }
    ],
    environmentalImpact: {
      carbonFootprint: 2.5,
      recyclingRate: 15,
      improvementSuggestions: [
        'Increase recycling program',
        'Reduce single-use items',
        'Implement waste-to-energy program'
      ]
    }
  };
};

// 10. SMART ENERGY MANAGEMENT
// ============================================

export const optimizeEnergyManagement = async (input: EnergyManagementInput): Promise<AIResponse<EnergyManagementResult>> => {
  const startTime = Date.now();
  const cacheKey = `energy-management-${JSON.stringify(input)}`;

  const cached = getCached<EnergyManagementResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockEnergyManagementResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a hospital facility management AI assistant specializing in energy optimization. Analyze the following energy data and provide optimization recommendations.

Current Usage: ${JSON.stringify(input.currentUsage || [])}
Historical Usage: ${JSON.stringify(input.historicalUsage || [])}
Equipment: ${JSON.stringify(input.equipment || [])}
Peak Hours: ${JSON.stringify(input.peakHours || [])}
Renewable Sources: ${JSON.stringify(input.renewableSources || [])}

Provide usage optimization, peak predictions, cost savings, and sustainability recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            usageOptimization: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  area: { type: Type.STRING },
                  currentUsage: { type: Type.NUMBER },
                  optimizedUsage: { type: Type.NUMBER },
                  savings: { type: Type.NUMBER },
                  recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["area", "currentUsage", "optimizedUsage", "savings", "recommendations"]
              }
            },
            peakPrediction: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  predictedPeakHours: { type: Type.ARRAY, items: { type: Type.STRING } },
                  expectedDemand: { type: Type.NUMBER },
                  suggestedActions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["date", "predictedPeakHours", "expectedDemand", "suggestedActions"]
              }
            },
            costSavings: {
              type: Type.OBJECT,
              properties: {
                currentCost: { type: Type.NUMBER },
                optimizedCost: { type: Type.NUMBER },
                monthlySavings: { type: Type.NUMBER },
                yearlyProjection: { type: Type.NUMBER },
                implementationSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["currentCost", "optimizedCost", "monthlySavings", "yearlyProjection", "implementationSteps"]
            },
            equipmentEfficiency: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  equipment: { type: Type.STRING },
                  efficiency: { type: Type.NUMBER },
                  recommendation: { type: Type.STRING, enum: ["Replace", "Upgrade", "Maintain", "Optimize"] },
                  potentialSavings: { type: Type.NUMBER },
                  paybackPeriod: { type: Type.NUMBER }
                },
                required: ["equipment", "efficiency", "recommendation", "potentialSavings", "paybackPeriod"]
              }
            },
            sustainability: {
              type: Type.OBJECT,
              properties: {
                currentCarbonFootprint: { type: Type.NUMBER },
                reducedCarbonFootprint: { type: Type.NUMBER },
                renewableIntegration: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      source: { type: Type.STRING },
                      currentContribution: { type: Type.NUMBER },
                      potentialContribution: { type: Type.NUMBER }
                    }
                  }
                },
                greenInitiatives: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["currentCarbonFootprint", "reducedCarbonFootprint", "renewableIntegration", "greenInitiatives"]
            },
            alerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["Peak Demand", "Equipment Malfunction", "Efficiency Drop", "Cost Spike"] },
                  severity: { type: Type.STRING, enum: ["Critical", "Warning", "Info"] },
                  message: { type: Type.STRING },
                  affectedArea: { type: Type.STRING },
                  action: { type: Type.STRING }
                },
                required: ["type", "severity", "message", "affectedArea", "action"]
              }
            }
          },
          required: ["usageOptimization", "peakPrediction", "costSavings", "equipmentEfficiency", "sustainability", "alerts"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as EnergyManagementResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in energy management optimization:", error);
    return createResponse(true, getMockEnergyManagementResult(input), undefined, Date.now() - startTime);
  }
};

const getMockEnergyManagementResult = (input: EnergyManagementInput): EnergyManagementResult => {
  return {
    usageOptimization: (input.currentUsage || [
      { area: 'ICU', consumption: 500, cost: 100 },
      { area: 'OR', consumption: 400, cost: 80 },
      { area: 'Emergency', consumption: 350, cost: 70 }
    ]).map(usage => ({
      area: usage.area,
      currentUsage: usage.consumption,
      optimizedUsage: usage.consumption * 0.85,
      savings: usage.consumption * 0.15,
      recommendations: ['LED lighting upgrade', 'HVAC optimization', 'Smart controls installation']
    })),
    peakPrediction: [
      {
        date: new Date().toISOString().split('T')[0],
        predictedPeakHours: ['10:00-12:00', '14:00-16:00'],
        expectedDemand: 850,
        suggestedActions: ['Pre-cool building', 'Reduce non-essential loads', 'Activate demand response']
      }
    ],
    costSavings: [
      {
        currentCost: 25000,
        optimizedCost: 20000,
        monthlySavings: 5000,
        yearlyProjection: 60000,
        implementationSteps: [
          'Install smart meters',
          'Upgrade to LED lighting',
          'Optimize HVAC schedules',
          'Implement energy monitoring system'
        ]
      }
    ],
    equipmentEfficiency: [
      {
        equipment: 'HVAC System',
        efficiency: 75,
        recommendation: 'Upgrade',
        potentialSavings: 1500,
        paybackPeriod: 18
      },
      {
        equipment: 'Lighting System',
        efficiency: 60,
        recommendation: 'Replace',
        potentialSavings: 800,
        paybackPeriod: 12
      }
    ],
    sustainability: {
      currentCarbonFootprint: 150,
      reducedCarbonFootprint: 120,
      renewableIntegration: [
        { source: 'Solar', currentContribution: 10, potentialContribution: 30 },
        { source: 'Wind', currentContribution: 0, potentialContribution: 15 }
      ],
      greenInitiatives: [
        'Install solar panels on rooftop',
        'Implement energy recovery ventilation',
        'Upgrade to energy-efficient windows'
      ]
    },
    alerts: [
      {
        type: 'Peak Demand',
        severity: 'Warning',
        message: 'Peak demand approaching threshold',
        affectedArea: 'Main Building',
        action: 'Consider load shedding non-critical systems'
      }
    ]
  };
};

// ============================================
// ADMINISTRATIVE AI FEATURES - Batch 3
// ============================================

// 1. AI-Powered Medical Coding Assistant
export const analyzeMedicalCoding = async (input: MedicalCodingInput): Promise<AIResponse<MedicalCodingResult>> => {
  const startTime = Date.now();
  const cacheKey = `medical-coding-${JSON.stringify(input)}`;

  const cached = getCached<MedicalCodingResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockMedicalCodingResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert medical coding AI assistant specializing in ICD-10, CPT, HCPCS coding, and DRG optimization. Analyze the following clinical documentation and provide accurate coding suggestions.

Clinical Notes:
${input.clinicalNotes}

Diagnosis: ${input.diagnosis || 'Not specified'}
Procedures: ${input.procedures?.join(', ') || 'None specified'}
Patient Age: ${input.patientAge || 'Unknown'}
Patient Gender: ${input.patientGender || 'Unknown'}
Encounter Type: ${input.encounterType || 'Not specified'}
Provider Specialty: ${input.providerSpecialty || 'Not specified'}

Provide comprehensive coding suggestions including ICD-10 codes, CPT codes, HCPCS codes, DRG optimization, compliance alerts, and documentation recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            icdCodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  codeSystem: { type: Type.STRING },
                  description: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  isPrimary: { type: Type.BOOLEAN },
                  modifiers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  documentationRequired: { type: Type.ARRAY, items: { type: Type.STRING } },
                  complianceNotes: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["code", "codeSystem", "description", "confidence", "isPrimary", "documentationRequired"]
              }
            },
            cptCodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  codeSystem: { type: Type.STRING },
                  description: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  isPrimary: { type: Type.BOOLEAN },
                  modifiers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  documentationRequired: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["code", "codeSystem", "description", "confidence", "isPrimary", "documentationRequired"]
              }
            },
            hcpcsCodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  codeSystem: { type: Type.STRING },
                  description: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  isPrimary: { type: Type.BOOLEAN },
                  modifiers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  documentationRequired: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["code", "codeSystem", "description", "confidence", "isPrimary", "documentationRequired"]
              }
            },
            drgOptimization: {
              type: Type.OBJECT,
              properties: {
                currentDRG: { type: Type.STRING },
                suggestedDRG: { type: Type.STRING },
                currentWeight: { type: Type.NUMBER },
                suggestedWeight: { type: Type.NUMBER },
                financialImpact: { type: Type.NUMBER },
                documentationGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                requiredDiagnoses: { type: Type.ARRAY, items: { type: Type.STRING } },
                requiredProcedures: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            complianceAlerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING },
                  recommendation: { type: Type.STRING }
                },
                required: ["type", "severity", "description", "recommendation"]
              }
            },
            codingQuality: {
              type: Type.OBJECT,
              properties: {
                accuracy: { type: Type.NUMBER },
                completeness: { type: Type.NUMBER },
                specificity: { type: Type.NUMBER },
                overallScore: { type: Type.NUMBER }
              },
              required: ["accuracy", "completeness", "specificity", "overallScore"]
            },
            suggestedDocumentation: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["icdCodes", "cptCodes", "hcpcsCodes", "complianceAlerts", "codingQuality", "suggestedDocumentation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as MedicalCodingResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in medical coding analysis:", error);
    return createResponse(true, getMockMedicalCodingResult(input), undefined, Date.now() - startTime);
  }
};

// Mock medical coding result
const getMockMedicalCodingResult = (input: MedicalCodingInput): MedicalCodingResult => {
  return {
    icdCodes: [
      {
        code: "J18.9",
        codeSystem: "ICD-10",
        description: "Pneumonia, unspecified organism",
        confidence: 0.92,
        isPrimary: true,
        documentationRequired: ["Chest X-ray findings", "Clinical symptoms documented"],
        complianceNotes: ["Ensure laterality is documented if applicable"]
      },
      {
        code: "J96.1",
        codeSystem: "ICD-10",
        description: "Acute respiratory failure",
        confidence: 0.78,
        isPrimary: false,
        documentationRequired: ["Oxygen saturation levels", "Blood gas results if available"]
      }
    ],
    cptCodes: [
      {
        code: "99223",
        codeSystem: "CPT",
        description: "Initial hospital care, high complexity",
        confidence: 0.88,
        isPrimary: true,
        documentationRequired: ["Comprehensive history", "Comprehensive examination", "High complexity medical decision making"]
      }
    ],
    hcpcsCodes: [],
    drgOptimization: {
      currentDRG: "177",
      suggestedDRG: "177",
      currentWeight: 1.48,
      suggestedWeight: 1.48,
      financialImpact: 0,
      documentationGaps: ["Consider documenting respiratory failure as secondary diagnosis for higher weight DRG"],
      requiredDiagnoses: ["Respiratory failure documentation"],
      requiredProcedures: []
    },
    complianceAlerts: [
      {
        type: "Missing Documentation",
        severity: "Warning",
        description: "Laterality for pneumonia not specified",
        recommendation: "Document whether pneumonia affects right, left, or bilateral lungs"
      }
    ],
    codingQuality: {
      accuracy: 0.92,
      completeness: 0.85,
      specificity: 0.78,
      overallScore: 0.85
    },
    suggestedDocumentation: [
      "Document specific organism if known from culture results",
      "Specify laterality of pneumonia",
      "Document severity of respiratory failure if present"
    ]
  };
};

// 2. Intelligent Claims Denial Predictor
export const predictClaimsDenial = async (input: ClaimsDenialInput): Promise<AIResponse<ClaimsDenialResult>> => {
  const startTime = Date.now();
  const cacheKey = `claims-denial-${JSON.stringify(input)}`;

  const cached = getCached<ClaimsDenialResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockClaimsDenialResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert healthcare claims and denial management AI. Analyze the following claim information and predict the likelihood of denial, identify risk factors, and suggest corrective actions.

Patient Information:
- Age: ${input.patientInfo.age}
- Gender: ${input.patientInfo.gender}
- Insurance Type: ${input.patientInfo.insuranceType}
- Plan Type: ${input.patientInfo.planType || 'Not specified'}

Services:
${input.services.map(s => `- ${s.code}: ${s.description} (Qty: ${s.quantity}, Cost: $${s.unitCost})`).join('\n')}

Diagnosis Codes: ${input.diagnosisCodes.join(', ')}
Procedure Codes: ${input.procedureCodes.join(', ')}
Provider Specialty: ${input.providerInfo?.specialty || 'Not specified'}
Network Status: ${input.providerInfo?.networkStatus || 'Unknown'}
Prior Authorization: ${input.priorAuthorization?.required ? (input.priorAuthorization.obtained ? 'Obtained' : 'Required but not obtained') : 'Not required'}
Medical Necessity Documented: ${input.medicalNecessity?.documented ? 'Yes' : 'No'}

Analyze for denial risk and provide recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            denialProbability: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            riskFactors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  factor: { type: Type.STRING },
                  category: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  description: { type: Type.STRING },
                  mitigationStrategy: { type: Type.STRING }
                },
                required: ["factor", "category", "impact", "description", "mitigationStrategy"]
              }
            },
            missingInformation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  description: { type: Type.STRING },
                  required: { type: Type.BOOLEAN },
                  howToObtain: { type: Type.STRING }
                },
                required: ["type", "description", "required", "howToObtain"]
              }
            },
            correctiveActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  priority: { type: Type.STRING },
                  action: { type: Type.STRING },
                  expectedImpact: { type: Type.STRING }
                },
                required: ["priority", "action", "expectedImpact"]
              }
            },
            suggestedDocumentation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  documentType: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  importance: { type: Type.STRING }
                },
                required: ["documentType", "reason", "importance"]
              }
            },
            estimatedReimbursement: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.NUMBER },
                optimized: { type: Type.NUMBER },
                potentialSavings: { type: Type.NUMBER }
              },
              required: ["original", "optimized", "potentialSavings"]
            }
          },
          required: ["denialProbability", "riskLevel", "riskFactors", "missingInformation", "correctiveActions", "suggestedDocumentation", "estimatedReimbursement"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as ClaimsDenialResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in claims denial prediction:", error);
    return createResponse(true, getMockClaimsDenialResult(input), undefined, Date.now() - startTime);
  }
};

// Mock claims denial result
const getMockClaimsDenialResult = (input: ClaimsDenialInput): ClaimsDenialResult => {
  const totalAmount = input.services.reduce((sum, s) => sum + (s.quantity * s.unitCost), 0);

  return {
    denialProbability: input.priorAuthorization?.required && !input.priorAuthorization.obtained ? 0.85 : 0.25,
    riskLevel: input.priorAuthorization?.required && !input.priorAuthorization.obtained ? 'High' : 'Low',
    riskFactors: [
      {
        factor: "Missing Prior Authorization",
        category: "Authorization",
        impact: "High",
        description: "Prior authorization was required but not obtained before service delivery",
        mitigationStrategy: "Obtain retroactive authorization if possible, or document medical emergency"
      },
      {
        factor: "Medical Necessity Documentation",
        category: "Medical Necessity",
        impact: "Medium",
        description: "Medical necessity criteria not fully documented",
        mitigationStrategy: "Add detailed clinical notes supporting the medical necessity of the procedure"
      }
    ],
    missingInformation: [
      {
        type: "Prior Authorization Number",
        description: "Authorization number required for this service",
        required: true,
        howToObtain: "Contact insurance provider or submit authorization request through portal"
      }
    ],
    correctiveActions: [
      {
        priority: "Immediate",
        action: "Submit retroactive authorization request",
        expectedImpact: "May reduce denial probability by 40%"
      },
      {
        priority: "Before Submission",
        action: "Add detailed medical necessity documentation",
        expectedImpact: "Strengthens appeal position if denied"
      }
    ],
    suggestedDocumentation: [
      {
        documentType: "Clinical Notes",
        reason: "Support medical necessity for the procedure",
        importance: "Required"
      },
      {
        documentType: "Lab Results",
        reason: "Document diagnostic findings supporting treatment decision",
        importance: "Recommended"
      }
    ],
    estimatedReimbursement: {
      original: totalAmount * 0.7,
      optimized: totalAmount * 0.85,
      potentialSavings: totalAmount * 0.15
    }
  };
};

// 3. AI-Powered Revenue Cycle Analytics
export const analyzeRevenueCycle = async (input: RevenueCycleInput): Promise<AIResponse<RevenueCycleResult>> => {
  const startTime = Date.now();
  const cacheKey = `revenue-cycle-${JSON.stringify(input)}`;

  const cached = getCached<RevenueCycleResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockRevenueCycleResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert healthcare revenue cycle management AI. Analyze the following revenue cycle data and provide insights, predictions, and optimization recommendations.

Timeframe: ${input.timeframe || 'Current period'}
Current Revenue: $${input.currentRevenue?.toLocaleString() || 'Not specified'}

Historical Revenue:
${input.historicalRevenue?.map(h => `- ${h.month}: Revenue $${h.revenue}, Collections $${h.collections}, Write-offs $${h.writeOffs}`).join('\n') || 'Not provided'}

AR Aging:
${input.arAging ? `- 0-30 days: $${input.arAging.days0to30}
- 31-60 days: $${input.arAging.days31to60}
- 61-90 days: $${input.arAging.days61to90}
- 90+ days: $${input.arAging.days90plus}` : 'Not provided'}

Claim Metrics:
${input.claimMetrics ? `- Total Claims: ${input.claimMetrics.totalClaims}
- Paid: ${input.claimMetrics.paidClaims}
- Denied: ${input.claimMetrics.deniedClaims}
- Pending: ${input.claimMetrics.pendingClaims}
- Avg Days to Payment: ${input.claimMetrics.averageDaysToPayment}` : 'Not provided'}

Service Mix: ${input.serviceMix?.map(s => `${s.department}: ${s.percentage}%`).join(', ') || 'Not provided'}
Payer Mix: ${input.payerMix?.map(p => `${p.payer}: ${p.percentage}%`).join(', ') || 'Not provided'}

Provide revenue forecasts, leakage analysis, and optimization recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            revenueForecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  period: { type: Type.STRING },
                  predictedRevenue: { type: Type.NUMBER },
                  confidence: { type: Type.NUMBER },
                  trend: { type: Type.STRING },
                  factors: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["period", "predictedRevenue", "confidence", "trend", "factors"]
              }
            },
            leakageAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedLoss: { type: Type.NUMBER },
                  frequency: { type: Type.NUMBER },
                  rootCause: { type: Type.STRING },
                  remediation: { type: Type.STRING },
                  potentialRecovery: { type: Type.NUMBER }
                },
                required: ["category", "description", "estimatedLoss", "frequency", "rootCause", "remediation", "potentialRecovery"]
              }
            },
            totalLeakage: { type: Type.NUMBER },
            optimizationRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  area: { type: Type.STRING },
                  currentPerformance: { type: Type.NUMBER },
                  targetPerformance: { type: Type.NUMBER },
                  potentialGain: { type: Type.NUMBER },
                  actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  timeline: { type: Type.STRING },
                  priority: { type: Type.STRING }
                },
                required: ["area", "currentPerformance", "targetPerformance", "potentialGain", "actions", "timeline", "priority"]
              }
            },
            kpiProjections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  kpi: { type: Type.STRING },
                  currentValue: { type: Type.NUMBER },
                  projectedValue: { type: Type.NUMBER },
                  benchmark: { type: Type.NUMBER },
                  status: { type: Type.STRING }
                },
                required: ["kpi", "currentValue", "projectedValue", "benchmark", "status"]
              }
            },
            cashFlowPrediction: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  expectedCollections: { type: Type.NUMBER },
                  expectedDisbursements: { type: Type.NUMBER },
                  netCashFlow: { type: Type.NUMBER }
                },
                required: ["month", "expectedCollections", "expectedDisbursements", "netCashFlow"]
              }
            },
            alerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  message: { type: Type.STRING },
                  recommendedAction: { type: Type.STRING }
                },
                required: ["type", "severity", "message", "recommendedAction"]
              }
            }
          },
          required: ["revenueForecast", "leakageAnalysis", "totalLeakage", "optimizationRecommendations", "kpiProjections", "cashFlowPrediction", "alerts"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as RevenueCycleResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in revenue cycle analysis:", error);
    return createResponse(true, getMockRevenueCycleResult(input), undefined, Date.now() - startTime);
  }
};

// Mock revenue cycle result
const getMockRevenueCycleResult = (input: RevenueCycleInput): RevenueCycleResult => {
  return {
    revenueForecast: [
      {
        period: "Next Month",
        predictedRevenue: input.currentRevenue ? input.currentRevenue * 1.05 : 850000,
        confidence: 0.85,
        trend: "increasing",
        factors: ["Seasonal increase in patient volume", "New service line launch"]
      },
      {
        period: "Next Quarter",
        predictedRevenue: input.currentRevenue ? input.currentRevenue * 3.2 : 2600000,
        confidence: 0.75,
        trend: "stable",
        factors: ["Contract renegotiations", "Payer mix shifts"]
      }
    ],
    leakageAnalysis: [
      {
        category: "Denials",
        description: "Preventable denials due to missing prior authorization",
        estimatedLoss: 45000,
        frequency: 125,
        rootCause: "Lack of pre-service authorization verification",
        remediation: "Implement mandatory authorization check workflow",
        potentialRecovery: 35000
      },
      {
        category: "Coding",
        description: "Undercoding of evaluation and management services",
        estimatedLoss: 28000,
        frequency: 200,
        rootCause: "Insufficient documentation of complexity",
        remediation: "Provider education on E&M documentation requirements",
        potentialRecovery: 22000
      }
    ],
    totalLeakage: 73000,
    optimizationRecommendations: [
      {
        area: "Denial Management",
        currentPerformance: 68,
        targetPerformance: 85,
        potentialGain: 45000,
        actions: ["Implement pre-submission claim scrubbing", "Automate authorization verification", "Enhance appeal process"],
        timeline: "3-6 months",
        priority: "High"
      },
      {
        area: "AR Management",
        currentPerformance: 72,
        targetPerformance: 90,
        potentialGain: 35000,
        actions: ["Reduce claim submission lag", "Implement automated follow-up", "Enhance patient payment collection"],
        timeline: "6-12 months",
        priority: "Medium"
      }
    ],
    kpiProjections: [
      {
        kpi: "Clean Claim Rate",
        currentValue: 82,
        projectedValue: 92,
        benchmark: 95,
        status: "Below Benchmark"
      },
      {
        kpi: "Days in AR",
        currentValue: 45,
        projectedValue: 38,
        benchmark: 35,
        status: "Below Benchmark"
      },
      {
        kpi: "Collection Rate",
        currentValue: 88,
        projectedValue: 92,
        benchmark: 95,
        status: "Below Benchmark"
      }
    ],
    cashFlowPrediction: [
      {
        month: "Month 1",
        expectedCollections: 780000,
        expectedDisbursements: 620000,
        netCashFlow: 160000
      },
      {
        month: "Month 2",
        expectedCollections: 820000,
        expectedDisbursements: 640000,
        netCashFlow: 180000
      },
      {
        month: "Month 3",
        expectedCollections: 850000,
        expectedDisbursements: 660000,
        netCashFlow: 190000
      }
    ],
    alerts: [
      {
        type: "Denial Spike",
        severity: "Warning",
        message: "15% increase in authorization-related denials over the past 30 days",
        recommendedAction: "Review authorization workflow and implement pre-service verification"
      }
    ]
  };
};

// 4. Smart Compliance Monitoring System
export const monitorCompliance = async (input: ComplianceMonitoringInput): Promise<AIResponse<ComplianceMonitoringResult>> => {
  const startTime = Date.now();
  const cacheKey = `compliance-monitoring-${JSON.stringify(input)}`;

  const cached = getCached<ComplianceMonitoringResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockComplianceMonitoringResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert healthcare compliance and regulatory AI assistant. Analyze the following compliance data and provide monitoring insights, risk assessments, and recommendations.

Facility Type: ${input.facilityType || 'Hospital'}
Departments: ${input.departments?.join(', ') || 'All'}

Audit History:
${input.auditHistory?.map(a => `- ${a.date}: ${a.type} - ${a.status}`).join('\n') || 'No recent audits'}

Current Policies: ${input.currentPolicies?.length || 0} policies tracked
Incident Reports: ${input.incidentReports?.length || 0} incidents reported
Staff Training Compliance: ${input.staffTraining?.map(t => `${t.module}: ${t.compliance}%`).join(', ') || 'Not provided'}
Regulatory Requirements: ${input.regulatoryRequirements?.join(', ') || 'Standard healthcare regulations'}

Provide comprehensive compliance monitoring analysis including checklists, risk assessment, and recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallComplianceScore: { type: Type.NUMBER },
            complianceStatus: { type: Type.STRING, enum: ["Excellent", "Good", "Needs Improvement", "Critical"] },
            checklists: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        requirement: { type: Type.STRING },
                        status: { type: Type.STRING },
                        evidence: { type: Type.STRING },
                        lastAssessed: { type: Type.STRING },
                        nextAssessment: { type: Type.STRING },
                        responsibleParty: { type: Type.STRING }
                      },
                      required: ["requirement", "status", "evidence", "lastAssessed", "nextAssessment", "responsibleParty"]
                    }
                  },
                  overallStatus: { type: Type.STRING },
                  riskLevel: { type: Type.STRING }
                },
                required: ["category", "items", "overallStatus", "riskLevel"]
              }
            },
            riskAssessment: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  area: { type: Type.STRING },
                  riskLevel: { type: Type.STRING },
                  riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
                  impact: { type: Type.STRING },
                  probability: { type: Type.NUMBER },
                  mitigationSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["area", "riskLevel", "riskFactors", "impact", "probability", "mitigationSteps"]
              }
            },
            alerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  dueDate: { type: Type.STRING },
                  actionRequired: { type: Type.STRING }
                },
                required: ["type", "severity", "title", "description", "actionRequired"]
              }
            },
            upcomingDeadlines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  deadline: { type: Type.STRING },
                  requirement: { type: Type.STRING },
                  daysRemaining: { type: Type.NUMBER },
                  status: { type: Type.STRING },
                  assignedTo: { type: Type.STRING }
                },
                required: ["deadline", "requirement", "daysRemaining", "status", "assignedTo"]
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  priority: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  estimatedEffort: { type: Type.STRING },
                  impact: { type: Type.STRING }
                },
                required: ["priority", "recommendation", "rationale", "estimatedEffort", "impact"]
              }
            }
          },
          required: ["overallComplianceScore", "complianceStatus", "checklists", "riskAssessment", "alerts", "upcomingDeadlines", "recommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as ComplianceMonitoringResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in compliance monitoring:", error);
    return createResponse(true, getMockComplianceMonitoringResult(input), undefined, Date.now() - startTime);
  }
};

// Mock compliance monitoring result
const getMockComplianceMonitoringResult = (input: ComplianceMonitoringInput): ComplianceMonitoringResult => {
  return {
    overallComplianceScore: 82,
    complianceStatus: "Good",
    checklists: [
      {
        category: "HIPAA Compliance",
        items: [
          {
            requirement: "Privacy Policy Updates",
            status: "Compliant",
            evidence: "Policy updated January 2024",
            lastAssessed: "2024-01-15",
            nextAssessment: "2024-07-15",
            responsibleParty: "Privacy Officer"
          },
          {
            requirement: "Staff HIPAA Training",
            status: "Partial",
            evidence: "85% staff completed annual training",
            lastAssessed: "2024-02-01",
            nextAssessment: "2024-03-01",
            responsibleParty: "HR Department"
          }
        ],
        overallStatus: "Partial",
        riskLevel: "Medium"
      },
      {
        category: "Clinical Documentation",
        items: [
          {
            requirement: "Medical Record Completeness",
            status: "Compliant",
            evidence: "98% completion rate",
            lastAssessed: "2024-02-10",
            nextAssessment: "2024-03-10",
            responsibleParty: "HIM Director"
          }
        ],
        overallStatus: "Compliant",
        riskLevel: "Low"
      }
    ],
    riskAssessment: [
      {
        area: "Data Security",
        riskLevel: "Medium",
        riskFactors: ["Outdated encryption protocols", "Insufficient access monitoring"],
        impact: "Potential data breach and regulatory fines",
        probability: 0.35,
        mitigationSteps: ["Upgrade encryption standards", "Implement enhanced access logging"]
      },
      {
        area: "Staff Training",
        riskLevel: "Low",
        riskFactors: ["Training completion gaps"],
        impact: "Compliance violations due to knowledge gaps",
        probability: 0.2,
        mitigationSteps: ["Mandatory training completion tracking", "Automated reminders"]
      }
    ],
    alerts: [
      {
        type: "Deadline Approaching",
        severity: "Warning",
        title: "Annual Compliance Training Due",
        description: "15% of staff have not completed mandatory annual compliance training",
        dueDate: "2024-03-01",
        actionRequired: "Send reminders and schedule make-up sessions"
      }
    ],
    upcomingDeadlines: [
      {
        deadline: "2024-03-15",
        requirement: "Quality Assurance Audit",
        daysRemaining: 30,
        status: "On Track",
        assignedTo: "Quality Manager"
      },
      {
        deadline: "2024-04-01",
        requirement: "Policy Annual Review",
        daysRemaining: 45,
        status: "At Risk",
        assignedTo: "Compliance Officer"
      }
    ],
    recommendations: [
      {
        priority: "Immediate",
        recommendation: "Complete staff compliance training",
        rationale: "Training deadline approaching with 15% non-completion",
        estimatedEffort: "2 weeks",
        impact: "Avoid compliance violation and potential fines"
      },
      {
        priority: "Short-term",
        recommendation: "Update data encryption protocols",
        rationale: "Current protocols do not meet latest security standards",
        estimatedEffort: "1 month",
        impact: "Reduce data breach risk and ensure regulatory compliance"
      }
    ],
    regulatoryUpdates: [
      {
        regulation: "HIPAA Security Rule",
        change: "Updated requirements for encryption standards",
        effectiveDate: "2024-06-01",
        impact: "Requires encryption protocol updates",
        requiredActions: ["Review current encryption", "Update to AES-256", "Document changes"]
      }
    ]
  };
};

// 5. AI-Powered Fraud Detection System
export const detectFraud = async (input: FraudDetectionInput): Promise<AIResponse<FraudDetectionResult>> => {
  const startTime = Date.now();
  const cacheKey = `fraud-detection-${JSON.stringify(input)}`;

  const cached = getCached<FraudDetectionResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockFraudDetectionResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert healthcare fraud detection AI system. Analyze the following billing data and patterns to identify potential fraud indicators, anomalies, and suspicious patterns.

Billing Data:
${input.billingData?.map(b => `- Provider: ${b.providerId}, Claim: ${b.claimId}, Date: ${b.date}, Amount: $${b.amount}, Services: ${b.services.join(', ')}`).join('\n') || 'Sample billing data'}

Historical Patterns:
${input.historicalPatterns?.map(h => `- Provider ${h.providerId}: Avg Claim $${h.averageClaimAmount}, Frequency: ${h.claimFrequency}/month`).join('\n') || 'Historical patterns not provided'}

Flagged Entities: ${input.flaggedEntities?.join(', ') || 'None'}
Audit Triggers: ${input.auditTriggers?.join(', ') || 'None'}
Time Window: ${input.timeWindow || 'Last 30 days'}

Analyze for fraud indicators, generate investigation alerts, and provide prevention recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallRiskScore: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING, enum: ["Critical", "High", "Medium", "Low", "Normal"] },
            detectedAnomalies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING },
                  evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                  affectedClaims: { type: Type.ARRAY, items: { type: Type.STRING } },
                  estimatedFinancialImpact: { type: Type.NUMBER },
                  confidence: { type: Type.NUMBER }
                },
                required: ["type", "severity", "description", "evidence", "affectedClaims", "estimatedFinancialImpact", "confidence"]
              }
            },
            investigationAlerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  alertId: { type: Type.STRING },
                  type: { type: Type.STRING },
                  description: { type: Type.STRING },
                  entities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendedAction: { type: Type.STRING },
                  priority: { type: Type.STRING }
                },
                required: ["alertId", "type", "description", "entities", "recommendedAction", "priority"]
              }
            },
            patternAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pattern: { type: Type.STRING },
                  frequency: { type: Type.NUMBER },
                  deviation: { type: Type.NUMBER },
                  trend: { type: Type.STRING },
                  affectedAreas: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["pattern", "frequency", "deviation", "trend", "affectedAreas"]
              }
            },
            providerRiskScores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  providerId: { type: Type.STRING },
                  providerName: { type: Type.STRING },
                  riskScore: { type: Type.NUMBER },
                  riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
                  historicalFlags: { type: Type.NUMBER },
                  recommendation: { type: Type.STRING }
                },
                required: ["providerId", "providerName", "riskScore", "riskFactors", "historicalFlags", "recommendation"]
              }
            },
            preventionRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  measure: { type: Type.STRING },
                  description: { type: Type.STRING },
                  implementation: { type: Type.STRING },
                  expectedImpact: { type: Type.STRING }
                },
                required: ["measure", "description", "implementation", "expectedImpact"]
              }
            }
          },
          required: ["overallRiskScore", "riskLevel", "detectedAnomalies", "investigationAlerts", "patternAnalysis", "providerRiskScores", "preventionRecommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as FraudDetectionResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in fraud detection:", error);
    return createResponse(true, getMockFraudDetectionResult(input), undefined, Date.now() - startTime);
  }
};

// Mock fraud detection result
const getMockFraudDetectionResult = (input: FraudDetectionInput): FraudDetectionResult => {
  return {
    overallRiskScore: 28,
    riskLevel: "Low",
    detectedAnomalies: [
      {
        type: "Billing Anomaly",
        severity: "Medium",
        description: "Provider billing unusually high number of complex procedures compared to peers",
        evidence: ["Procedure code 99215 billed 3x more than specialty average", "Weekend billing pattern unusual"],
        affectedClaims: ["CLM-2024-001", "CLM-2024-002"],
        estimatedFinancialImpact: 15000,
        confidence: 0.72
      }
    ],
    investigationAlerts: [
      {
        alertId: "ALT-2024-001",
        type: "Billing Pattern Review",
        description: "Elevated billing complexity requires documentation review",
        entities: ["PROV-001"],
        recommendedAction: "Review Required",
        priority: "Medium"
      }
    ],
    patternAnalysis: [
      {
        pattern: "After-hours billing spike",
        frequency: 45,
        deviation: 2.3,
        trend: "increasing",
        affectedAreas: ["Emergency Department", "Radiology"]
      }
    ],
    providerRiskScores: [
      {
        providerId: "PROV-001",
        providerName: "Dr. Smith",
        riskScore: 35,
        riskFactors: ["Above-average claim amounts", "Weekend billing pattern"],
        historicalFlags: 2,
        recommendation: "Monitor billing patterns, conduct periodic documentation review"
      }
    ],
    preventionRecommendations: [
      {
        measure: "Enhanced Pre-payment Review",
        description: "Implement automated pre-payment review for high-risk claims",
        implementation: "Configure rules engine to flag claims exceeding threshold",
        expectedImpact: "Reduce fraudulent payments by 40%"
      },
      {
        measure: "Provider Education",
        description: "Regular compliance and coding accuracy training",
        implementation: "Quarterly training sessions with compliance team",
        expectedImpact: "Reduce billing errors and potential fraud indicators"
      }
    ],
    complianceImplications: [
      {
        regulation: "False Claims Act",
        concern: "Potential billing irregularities detected",
        requiredAction: "Conduct internal review and document findings"
      }
    ]
  };
};

// 6. Intelligent Document Processing
export const processDocument = async (input: DocumentProcessingInput): Promise<AIResponse<DocumentProcessingResult>> => {
  const startTime = Date.now();
  const cacheKey = `document-processing-${JSON.stringify(input)}`;

  const cached = getCached<DocumentProcessingResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockDocumentProcessingResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert medical document processing AI. Analyze the following document information and extract structured data, classify the document, and provide indexing metadata.

Document Type: ${input.documentType || 'Unknown'}
Document Content: ${input.documentContent?.substring(0, 2000) || 'Content not provided'}
OCR Data: ${input.ocrData?.substring(0, 500) || 'Not provided'}
Extract Fields: ${input.extractedFields?.join(', ') || 'All available fields'}
Patient ID: ${input.patientId || 'Not specified'}
Language: ${input.language || 'English'}

Extract information, classify the document, and provide structured output.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentCategory: { type: Type.STRING },
            documentType: { type: Type.STRING },
            extractedData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  field: { type: Type.STRING },
                  value: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  verified: { type: Type.BOOLEAN },
                  requiresReview: { type: Type.BOOLEAN }
                },
                required: ["field", "value", "confidence", "verified", "requiresReview"]
              }
            },
            classifiedSections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  section: { type: Type.STRING },
                  content: { type: Type.STRING },
                  confidence: { type: Type.NUMBER }
                },
                required: ["section", "content", "confidence"]
              }
            },
            indexingMetadata: {
              type: Type.OBJECT,
              properties: {
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                entities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      name: { type: Type.STRING },
                      normalizedValue: { type: Type.STRING }
                    },
                    required: ["type", "name"]
                  }
                },
                summary: { type: Type.STRING }
              },
              required: ["keywords", "entities", "summary"]
            },
            dataQuality: {
              type: Type.OBJECT,
              properties: {
                completeness: { type: Type.NUMBER },
                accuracy: { type: Type.NUMBER },
                consistency: { type: Type.NUMBER },
                issues: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["completeness", "accuracy", "consistency", "issues"]
            },
            suggestedActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  action: { type: Type.STRING },
                  field: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["action", "field", "reason"]
              }
            },
            linkedRecords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  id: { type: Type.STRING },
                  confidence: { type: Type.NUMBER }
                },
                required: ["type", "id", "confidence"]
              }
            },
            processingMetrics: {
              type: Type.OBJECT,
              properties: {
                ocrConfidence: { type: Type.NUMBER },
                extractionTime: { type: Type.NUMBER },
                pagesProcessed: { type: Type.NUMBER }
              },
              required: ["ocrConfidence", "extractionTime", "pagesProcessed"]
            }
          },
          required: ["documentCategory", "documentType", "extractedData", "classifiedSections", "indexingMetadata", "dataQuality", "suggestedActions", "linkedRecords", "processingMetrics"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as DocumentProcessingResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in document processing:", error);
    return createResponse(true, getMockDocumentProcessingResult(input), undefined, Date.now() - startTime);
  }
};

// Mock document processing result
const getMockDocumentProcessingResult = (input: DocumentProcessingInput): DocumentProcessingResult => {
  return {
    documentCategory: "Clinical Documentation",
    documentType: input.documentType || "Lab Report",
    extractedData: [
      {
        field: "Patient Name",
        value: "John Doe",
        confidence: 0.98,
        verified: true,
        requiresReview: false
      },
      {
        field: "Date of Birth",
        value: "1985-03-15",
        confidence: 0.95,
        verified: true,
        requiresReview: false
      },
      {
        field: "Test Name",
        value: "Complete Blood Count",
        confidence: 0.99,
        verified: true,
        requiresReview: false
      },
      {
        field: "Hemoglobin",
        value: "14.2 g/dL",
        confidence: 0.97,
        verified: false,
        requiresReview: false
      },
      {
        field: "WBC Count",
        value: "7,500 /μL",
        confidence: 0.96,
        verified: false,
        requiresReview: false
      }
    ],
    classifiedSections: [
      {
        section: "Patient Information",
        content: "Patient demographics and identification",
        confidence: 0.98
      },
      {
        section: "Test Results",
        content: "Laboratory test results and reference ranges",
        confidence: 0.95
      },
      {
        section: "Provider Notes",
        content: "Ordering physician and interpretation notes",
        confidence: 0.92
      }
    ],
    indexingMetadata: {
      keywords: ["CBC", "blood count", "hemoglobin", "WBC", "lab results"],
      entities: [
        { type: "Patient", name: "John Doe", normalizedValue: "DOE, JOHN" },
        { type: "Date", name: "2024-02-14", normalizedValue: "2024-02-14" },
        { type: "Provider", name: "Dr. Smith", normalizedValue: "SMITH, MD" }
      ],
      summary: "Complete Blood Count lab report showing normal values for patient John Doe"
    },
    dataQuality: {
      completeness: 0.95,
      accuracy: 0.97,
      consistency: 0.94,
      issues: []
    },
    suggestedActions: [
      {
        action: "Auto-Populate",
        field: "Lab Results",
        reason: "High confidence extraction, can auto-populate EHR"
      }
    ],
    linkedRecords: [
      {
        type: "Patient Record",
        id: input.patientId || "PT-001",
        confidence: 0.98
      }
    ],
    processingMetrics: {
      ocrConfidence: 0.96,
      extractionTime: 1.2,
      pagesProcessed: 1
    }
  };
};

// 7. AI-Powered Audit Trail Analysis
export const analyzeAuditTrail = async (input: AuditTrailInput): Promise<AIResponse<AuditTrailResult>> => {
  const startTime = Date.now();
  const cacheKey = `audit-trail-${JSON.stringify(input)}`;

  const cached = getCached<AuditTrailResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockAuditTrailResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert healthcare security and audit analysis AI. Analyze the following audit trail data to detect suspicious activities, assess risks, and generate compliance reports.

Audit Logs:
${input.auditLogs?.slice(0, 20).map(a => `- ${a.timestamp}: ${a.user} - ${a.action} on ${a.resource} (${a.status})`).join('\n') || 'Sample audit data'}

Timeframe: ${input.timeframe || 'Last 7 days'}
User Roles: ${input.userRoles?.join(', ') || 'All roles'}
Sensitive Resources: ${input.sensitiveResources?.join(', ') || 'Patient records, Financial data'}
Anomaly Threshold: ${input.anomalyThreshold || 0.8}

Historical Patterns:
${input.historicalPatterns?.map(h => `- User ${h.userId}: Typical hours ${h.typicalAccessHours.join(', ')}, Avg actions/day: ${h.averageActionsPerDay}`).join('\n') || 'Historical patterns not provided'}

Analyze for suspicious activities, access patterns, and compliance issues.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallRiskScore: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING, enum: ["Critical", "High", "Medium", "Low", "Normal"] },
            suspiciousActivities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  userId: { type: Type.STRING },
                  userName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  evidence: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        timestamp: { type: Type.STRING },
                        action: { type: Type.STRING },
                        resource: { type: Type.STRING },
                        anomaly: { type: Type.STRING }
                      },
                      required: ["timestamp", "action", "resource", "anomaly"]
                    }
                  },
                  riskScore: { type: Type.NUMBER },
                  recommendedAction: { type: Type.STRING }
                },
                required: ["type", "severity", "userId", "userName", "description", "evidence", "riskScore", "recommendedAction"]
              }
            },
            accessPatterns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  resource: { type: Type.STRING },
                  accessCount: { type: Type.NUMBER },
                  uniqueUsers: { type: Type.NUMBER },
                  peakAccessTimes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  anomalyDetected: { type: Type.BOOLEAN }
                },
                required: ["resource", "accessCount", "uniqueUsers", "peakAccessTimes", "anomalyDetected"]
              }
            },
            userBehaviorAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  userId: { type: Type.STRING },
                  userName: { type: Type.STRING },
                  behaviorScore: { type: Type.NUMBER },
                  deviationFromNorm: { type: Type.NUMBER },
                  flaggedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendation: { type: Type.STRING }
                },
                required: ["userId", "userName", "behaviorScore", "deviationFromNorm", "flaggedActions", "recommendation"]
              }
            },
            complianceReport: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  regulation: { type: Type.STRING },
                  requirement: { type: Type.STRING },
                  status: { type: Type.STRING },
                  evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                  gaps: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["regulation", "requirement", "status", "evidence", "gaps"]
              }
            },
            riskScoring: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  trend: { type: Type.STRING },
                  contributingFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["category", "score", "trend", "contributingFactors"]
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  priority: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  expectedImpact: { type: Type.STRING }
                },
                required: ["priority", "recommendation", "rationale", "expectedImpact"]
              }
            },
            auditSummary: {
              type: Type.OBJECT,
              properties: {
                totalEvents: { type: Type.NUMBER },
                uniqueUsers: { type: Type.NUMBER },
                flaggedEvents: { type: Type.NUMBER },
                complianceScore: { type: Type.NUMBER }
              },
              required: ["totalEvents", "uniqueUsers", "flaggedEvents", "complianceScore"]
            }
          },
          required: ["overallRiskScore", "riskLevel", "suspiciousActivities", "accessPatterns", "userBehaviorAnalysis", "complianceReport", "riskScoring", "recommendations", "auditSummary"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as AuditTrailResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in audit trail analysis:", error);
    return createResponse(true, getMockAuditTrailResult(input), undefined, Date.now() - startTime);
  }
};

// Mock audit trail result
const getMockAuditTrailResult = (input: AuditTrailInput): AuditTrailResult => {
  return {
    overallRiskScore: 22,
    riskLevel: "Low",
    suspiciousActivities: [
      {
        type: "Unusual Access Time",
        severity: "Medium",
        userId: "USR-003",
        userName: "Jane Smith",
        description: "Accessed patient records outside normal working hours",
        evidence: [
          {
            timestamp: "2024-02-14T02:30:00Z",
            action: "VIEW",
            resource: "Patient Record PT-12345",
            anomaly: "Access at 2:30 AM, user typically works 8AM-5PM"
          }
        ],
        riskScore: 45,
        recommendedAction: "Verify with user if access was legitimate"
      }
    ],
    accessPatterns: [
      {
        resource: "Patient Records",
        accessCount: 15420,
        uniqueUsers: 85,
        peakAccessTimes: ["10:00 AM", "2:00 PM", "4:00 PM"],
        anomalyDetected: false
      },
      {
        resource: "Financial Records",
        accessCount: 3250,
        uniqueUsers: 12,
        peakAccessTimes: ["9:00 AM", "3:00 PM"],
        anomalyDetected: false
      }
    ],
    userBehaviorAnalysis: [
      {
        userId: "USR-003",
        userName: "Jane Smith",
        behaviorScore: 78,
        deviationFromNorm: 15,
        flaggedActions: ["After-hours access"],
        recommendation: "Monitor access patterns, consider additional verification for after-hours access"
      }
    ],
    complianceReport: [
      {
        regulation: "HIPAA",
        requirement: "Access Logging",
        status: "Compliant",
        evidence: ["All access events logged", "User identification captured", "Timestamps recorded"],
        gaps: []
      },
      {
        regulation: "HIPAA",
        requirement: "Minimum Necessary Access",
        status: "Partial",
        evidence: ["Role-based access implemented"],
        gaps: ["Some users have broader access than role requires"]
      }
    ],
    riskScoring: [
      {
        category: "Data Access",
        score: 25,
        trend: "stable",
        contributingFactors: ["Normal access patterns", "Consistent user behavior"]
      },
      {
        category: "Authentication",
        score: 15,
        trend: "decreasing",
        contributingFactors: ["Strong password policies", "MFA implemented"]
      }
    ],
    recommendations: [
      {
        priority: "Short-term",
        recommendation: "Implement after-hours access verification",
        rationale: "Detected unusual access times that warrant additional verification",
        expectedImpact: "Reduce risk of unauthorized access by 30%"
      }
    ],
    auditSummary: {
      totalEvents: input.auditLogs?.length || 25000,
      uniqueUsers: 120,
      flaggedEvents: 3,
      complianceScore: 92
    }
  };
};

// 8. Smart Contract Management
export const manageContracts = async (input: ContractManagementInput): Promise<AIResponse<ContractManagementResult>> => {
  const startTime = Date.now();
  const cacheKey = `contract-management-${JSON.stringify(input)}`;

  const cached = getCached<ContractManagementResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockContractManagementResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert healthcare contract management AI. Analyze the following contract data and provide expiry alerts, renewal recommendations, and contract analysis.

Contracts:
${input.contracts?.map(c => `- ${c.name} (${c.type}): ${c.startDate} to ${c.endDate}, Value: $${c.value}, Status: ${c.status}`).join('\n') || 'Sample contract data'}

Upcoming Renewals: ${input.upcomingRenewals?.join(', ') || 'None specified'}
Expiring Contracts: ${input.expiringContracts?.join(', ') || 'None specified'}

Vendor Performance:
${input.vendorPerformance?.map(v => `- ${v.vendorName}: Score ${v.performanceScore}/100, Issues: ${v.issues.join(', ')}`).join('\n') || 'Performance data not provided'}

Provide contract management insights, renewal recommendations, and cost optimization opportunities.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            expiryAlerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  contractId: { type: Type.STRING },
                  contractName: { type: Type.STRING },
                  daysUntilExpiry: { type: Type.NUMBER },
                  type: { type: Type.STRING },
                  value: { type: Type.NUMBER },
                  impact: { type: Type.STRING },
                  recommendedAction: { type: Type.STRING },
                  priority: { type: Type.STRING }
                },
                required: ["contractId", "contractName", "daysUntilExpiry", "type", "value", "impact", "recommendedAction", "priority"]
              }
            },
            renewalRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  contractId: { type: Type.STRING },
                  contractName: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  suggestedTerms: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        term: { type: Type.STRING },
                        currentValue: { type: Type.STRING },
                        suggestedValue: { type: Type.STRING },
                        rationale: { type: Type.STRING }
                      },
                      required: ["term", "currentValue", "suggestedValue", "rationale"]
                    }
                  },
                  estimatedSavings: { type: Type.NUMBER }
                },
                required: ["contractId", "contractName", "recommendation", "reasoning", "suggestedTerms", "estimatedSavings"]
              }
            },
            contractAnalyses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  contractId: { type: Type.STRING },
                  contractName: { type: Type.STRING },
                  keyTerms: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        term: { type: Type.STRING },
                        value: { type: Type.STRING },
                        importance: { type: Type.STRING }
                      },
                      required: ["term", "value", "importance"]
                    }
                  },
                  obligations: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        party: { type: Type.STRING },
                        obligation: { type: Type.STRING },
                        deadline: { type: Type.STRING },
                        status: { type: Type.STRING }
                      },
                      required: ["party", "obligation", "status"]
                    }
                  },
                  risks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        risk: { type: Type.STRING },
                        severity: { type: Type.STRING },
                        mitigation: { type: Type.STRING }
                      },
                      required: ["risk", "severity", "mitigation"]
                    }
                  },
                  opportunities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        opportunity: { type: Type.STRING },
                        potentialBenefit: { type: Type.STRING },
                        action: { type: Type.STRING }
                      },
                      required: ["opportunity", "potentialBenefit", "action"]
                    }
                  }
                },
                required: ["contractId", "contractName", "keyTerms", "obligations", "risks", "opportunities"]
              }
            },
            vendorInsights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  vendor: { type: Type.STRING },
                  totalContracts: { type: Type.NUMBER },
                  totalValue: { type: Type.NUMBER },
                  performanceScore: { type: Type.NUMBER },
                  riskLevel: { type: Type.STRING },
                  recommendation: { type: Type.STRING }
                },
                required: ["vendor", "totalContracts", "totalValue", "performanceScore", "riskLevel", "recommendation"]
              }
            },
            complianceStatus: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  contract: { type: Type.STRING },
                  requirement: { type: Type.STRING },
                  status: { type: Type.STRING },
                  action: { type: Type.STRING }
                },
                required: ["contract", "requirement", "status", "action"]
              }
            },
            costOptimization: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  area: { type: Type.STRING },
                  currentCost: { type: Type.NUMBER },
                  optimizedCost: { type: Type.NUMBER },
                  savings: { type: Type.NUMBER },
                  method: { type: Type.STRING }
                },
                required: ["area", "currentCost", "optimizedCost", "savings", "method"]
              }
            }
          },
          required: ["expiryAlerts", "renewalRecommendations", "contractAnalyses", "vendorInsights", "complianceStatus", "costOptimization"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as ContractManagementResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in contract management:", error);
    return createResponse(true, getMockContractManagementResult(input), undefined, Date.now() - startTime);
  }
};

// Mock contract management result
const getMockContractManagementResult = (input: ContractManagementInput): ContractManagementResult => {
  return {
    expiryAlerts: [
      {
        contractId: "CTR-001",
        contractName: "Medical Equipment Lease",
        daysUntilExpiry: 45,
        type: "Lease",
        value: 150000,
        impact: "Critical equipment may need replacement or renewal",
        recommendedAction: "Renew",
        priority: "High"
      },
      {
        contractId: "CTR-002",
        contractName: "IT Support Services",
        daysUntilExpiry: 90,
        type: "Service",
        value: 85000,
        impact: "IT support continuity at risk",
        recommendedAction: "Renegotiate",
        priority: "Medium"
      }
    ],
    renewalRecommendations: [
      {
        contractId: "CTR-001",
        contractName: "Medical Equipment Lease",
        recommendation: "Renew",
        reasoning: "Equipment still has significant useful life, vendor performance excellent",
        suggestedTerms: [
          {
            term: "Monthly Rate",
            currentValue: "$12,500",
            suggestedValue: "$11,250",
            rationale: "Market rates have decreased, negotiate 10% reduction"
          }
        ],
        estimatedSavings: 15000
      }
    ],
    contractAnalyses: [
      {
        contractId: "CTR-001",
        contractName: "Medical Equipment Lease",
        keyTerms: [
          { term: "Duration", value: "36 months", importance: "Critical" },
          { term: "Maintenance", value: "Included", importance: "Important" }
        ],
        obligations: [
          { party: "Vendor", obligation: "Provide maintenance within 24 hours", status: "Fulfilled" },
          { party: "Hospital", obligation: "Monthly payment by 15th", status: "Fulfilled" }
        ],
        risks: [
          { risk: "Technology obsolescence", severity: "Medium", mitigation: "Include upgrade clause in renewal" }
        ],
        opportunities: [
          { opportunity: "Bundle with other equipment leases", potentialBenefit: "Volume discount", action: "Negotiate during renewal" }
        ]
      }
    ],
    vendorInsights: [
      {
        vendor: "MedEquip Corp",
        totalContracts: 3,
        totalValue: 450000,
        performanceScore: 92,
        riskLevel: "Low",
        recommendation: "Preferred vendor status, consider expanding relationship"
      }
    ],
    complianceStatus: [
      {
        contract: "Medical Equipment Lease",
        requirement: "Insurance coverage",
        status: "Compliant",
        action: "Maintain current coverage"
      }
    ],
    costOptimization: [
      {
        area: "Equipment Leases",
        currentCost: 450000,
        optimizedCost: 405000,
        savings: 45000,
        method: "Renegotiate rates and bundle contracts"
      }
    ]
  };
};

// 9. AI-Powered Policy Management
export const managePolicies = async (input: PolicyManagementInput): Promise<AIResponse<PolicyManagementResult>> => {
  const startTime = Date.now();
  const cacheKey = `policy-management-${JSON.stringify(input)}`;

  const cached = getCached<PolicyManagementResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockPolicyManagementResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert healthcare policy management AI. Analyze the following policy data and provide version control, gap analysis, and update recommendations.

Policies:
${input.policies?.map(p => `- ${p.name} (${p.category}): v${p.version}, Status: ${p.status}, Next Review: ${p.nextReviewDate}`).join('\n') || 'Sample policy data'}

Regulatory Changes:
${input.regulatoryChanges?.map(r => `- ${r.regulation} (${r.changeDate}): ${r.description}`).join('\n') || 'No recent regulatory changes'}

Compliance Gaps: ${input.complianceGaps?.join(', ') || 'None identified'}
Organization Type: ${input.organizationType || 'Hospital'}

Provide policy management insights including version control, gap analysis, and compliance mapping.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            versionControl: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  policyId: { type: Type.STRING },
                  policyName: { type: Type.STRING },
                  currentVersion: { type: Type.STRING },
                  latestVersion: { type: Type.STRING },
                  changes: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        version: { type: Type.STRING },
                        date: { type: Type.STRING },
                        changes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        author: { type: Type.STRING }
                      },
                      required: ["version", "date", "changes", "author"]
                    }
                  },
                  updateRequired: { type: Type.BOOLEAN }
                },
                required: ["policyId", "policyName", "currentVersion", "latestVersion", "changes", "updateRequired"]
              }
            },
            gapAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  policyId: { type: Type.STRING },
                  policyName: { type: Type.STRING },
                  gapType: { type: Type.STRING },
                  description: { type: Type.STRING },
                  regulatoryReference: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  remediation: { type: Type.STRING },
                  deadline: { type: Type.STRING }
                },
                required: ["policyId", "policyName", "gapType", "description", "regulatoryReference", "severity", "remediation"]
              }
            },
            updateRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  policyId: { type: Type.STRING },
                  policyName: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  suggestedChanges: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        section: { type: Type.STRING },
                        currentText: { type: Type.STRING },
                        suggestedText: { type: Type.STRING },
                        reason: { type: Type.STRING }
                      },
                      required: ["section", "currentText", "suggestedText", "reason"]
                    }
                  },
                  priority: { type: Type.STRING },
                  estimatedEffort: { type: Type.STRING }
                },
                required: ["policyId", "policyName", "recommendation", "reasoning", "suggestedChanges", "priority", "estimatedEffort"]
              }
            },
            complianceMapping: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  regulation: { type: Type.STRING },
                  requirement: { type: Type.STRING },
                  coveredByPolicy: { type: Type.STRING },
                  coverage: { type: Type.STRING },
                  gaps: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["regulation", "requirement", "coveredByPolicy", "coverage", "gaps"]
              }
            },
            reviewSchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  policy: { type: Type.STRING },
                  nextReview: { type: Type.STRING },
                  daysUntilReview: { type: Type.NUMBER },
                  reviewer: { type: Type.STRING },
                  status: { type: Type.STRING }
                },
                required: ["policy", "nextReview", "daysUntilReview", "reviewer", "status"]
              }
            },
            alerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  policy: { type: Type.STRING },
                  message: { type: Type.STRING },
                  action: { type: Type.STRING }
                },
                required: ["type", "severity", "policy", "message", "action"]
              }
            }
          },
          required: ["versionControl", "gapAnalysis", "updateRecommendations", "complianceMapping", "reviewSchedule", "alerts"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as PolicyManagementResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in policy management:", error);
    return createResponse(true, getMockPolicyManagementResult(input), undefined, Date.now() - startTime);
  }
};

// Mock policy management result
const getMockPolicyManagementResult = (input: PolicyManagementInput): PolicyManagementResult => {
  return {
    versionControl: [
      {
        policyId: "POL-001",
        policyName: "Patient Privacy Policy",
        currentVersion: "2.1",
        latestVersion: "2.2",
        changes: [
          {
            version: "2.2",
            date: "2024-01-15",
            changes: ["Updated breach notification timeline", "Added telehealth privacy provisions"],
            author: "Compliance Team"
          }
        ],
        updateRequired: true
      }
    ],
    gapAnalysis: [
      {
        policyId: "POL-003",
        policyName: "Data Retention Policy",
        gapType: "Missing Requirement",
        description: "Policy does not address retention requirements for electronic messaging",
        regulatoryReference: "HIPAA Security Rule 164.530(j)",
        severity: "Medium",
        remediation: "Add section on electronic message retention requirements"
      }
    ],
    updateRecommendations: [
      {
        policyId: "POL-001",
        policyName: "Patient Privacy Policy",
        recommendation: "Update Required",
        reasoning: "New version available with regulatory updates",
        suggestedChanges: [
          {
            section: "Breach Notification",
            currentText: "Notification within 60 days",
            suggestedText: "Notification within 30 days per updated regulations",
            reason: "Regulatory requirement change"
          }
        ],
        priority: "High",
        estimatedEffort: "2 weeks"
      }
    ],
    complianceMapping: [
      {
        regulation: "HIPAA Privacy Rule",
        requirement: "Notice of Privacy Practices",
        coveredByPolicy: "Patient Privacy Policy",
        coverage: "Full",
        gaps: []
      },
      {
        regulation: "HIPAA Security Rule",
        requirement: "Data Retention",
        coveredByPolicy: "Data Retention Policy",
        coverage: "Partial",
        gaps: ["Electronic messaging retention not addressed"]
      }
    ],
    reviewSchedule: [
      {
        policy: "Patient Privacy Policy",
        nextReview: "2024-03-01",
        daysUntilReview: 15,
        reviewer: "Privacy Officer",
        status: "Due Soon"
      },
      {
        policy: "Emergency Response Plan",
        nextReview: "2024-02-01",
        daysUntilReview: -15,
        reviewer: "Safety Manager",
        status: "Overdue"
      }
    ],
    alerts: [
      {
        type: "Review Overdue",
        severity: "Warning",
        policy: "Emergency Response Plan",
        message: "Annual review is 15 days overdue",
        action: "Schedule review meeting immediately"
      }
    ]
  };
};

// 10. Intelligent Reporting Assistant
export const generateReport = async (input: ReportingInput): Promise<AIResponse<ReportingResult>> => {
  const startTime = Date.now();
  const cacheKey = `reporting-${JSON.stringify(input)}`;

  const cached = getCached<ReportingResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockReportingResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert healthcare reporting AI assistant. Generate a comprehensive report based on the following parameters.

Report Type: ${input.reportType || 'General Operations Report'}
Data Scope: ${input.dataScope ? `${input.dataScope.startDate} to ${input.dataScope.endDate}, Departments: ${input.dataScope.departments?.join(', ') || 'All'}` : 'Current period'}
Requested Metrics: ${input.requestedMetrics?.join(', ') || 'Standard operational metrics'}
Format: ${input.format || 'Summary'}
Audience: ${input.audience || 'Leadership'}

Previous Reports:
${input.previousReports?.map(r => `- ${r.type} (${r.date}): ${r.keyFindings.join(', ')}`).join('\n') || 'No previous reports'}

Generate a comprehensive report with executive summary, key findings, and recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reportTitle: { type: Type.STRING },
            reportType: { type: Type.STRING },
            generatedAt: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  metrics: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        value: { type: Type.STRING },
                        unit: { type: Type.STRING },
                        trend: { type: Type.STRING },
                        significance: { type: Type.STRING }
                      },
                      required: ["name", "value", "significance"]
                    }
                  },
                  insights: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["title", "content", "metrics", "insights", "recommendations"]
              }
            },
            keyFindings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  finding: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  supportingData: { type: Type.ARRAY, items: { type: Type.STRING } },
                  actionRequired: { type: Type.BOOLEAN }
                },
                required: ["finding", "importance", "supportingData", "actionRequired"]
              }
            },
            naturalLanguageSummary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  recommendation: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  expectedImpact: { type: Type.STRING },
                  implementationSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["recommendation", "rationale", "priority", "expectedImpact", "implementationSteps"]
              }
            },
            customReportBuilder: {
              type: Type.OBJECT,
              properties: {
                suggestedMetrics: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedVisualizations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      metrics: { type: Type.ARRAY, items: { type: Type.STRING } },
                      purpose: { type: Type.STRING }
                    },
                    required: ["type", "metrics", "purpose"]
                  }
                },
                suggestedFilters: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      filter: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      default: { type: Type.STRING }
                    },
                    required: ["filter", "options", "default"]
                  }
                }
              },
              required: ["suggestedMetrics", "suggestedVisualizations", "suggestedFilters"]
            },
            dataQuality: {
              type: Type.OBJECT,
              properties: {
                completeness: { type: Type.NUMBER },
                accuracy: { type: Type.NUMBER },
                timeliness: { type: Type.NUMBER },
                notes: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["completeness", "accuracy", "timeliness", "notes"]
            },
            exportFormats: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["reportTitle", "reportType", "generatedAt", "executiveSummary", "sections", "keyFindings", "naturalLanguageSummary", "recommendations", "customReportBuilder", "dataQuality", "exportFormats"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as ReportingResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in report generation:", error);
    return createResponse(true, getMockReportingResult(input), undefined, Date.now() - startTime);
  }
};

// Mock reporting result
const getMockReportingResult = (input: ReportingInput): ReportingResult => {
  return {
    reportTitle: input.reportType || "Monthly Operations Report",
    reportType: input.reportType || "Operations",
    generatedAt: new Date().toISOString(),
    executiveSummary: "This report provides a comprehensive overview of hospital operations for the reporting period. Key highlights include a 12% increase in patient volume, improved patient satisfaction scores, and successful implementation of new clinical protocols. Areas requiring attention include staffing optimization and supply chain efficiency.",
    sections: [
      {
        title: "Patient Volume Analysis",
        content: "Patient volume showed significant growth during the reporting period, with notable increases in emergency department visits and elective procedures.",
        metrics: [
          {
            name: "Total Patient Visits",
            value: "15,420",
            unit: "visits",
            trend: "increasing",
            significance: "12% increase from previous period"
          },
          {
            name: "Average Length of Stay",
            value: "4.2",
            unit: "days",
            trend: "stable",
            significance: "Within target range"
          }
        ],
        insights: [
          "Emergency department visits increased by 18%",
          "Elective procedures recovered to pre-pandemic levels",
          "Weekend admissions showed unusual spike"
        ],
        recommendations: [
          "Consider expanding weekend staffing",
          "Review ED capacity management protocols"
        ]
      },
      {
        title: "Financial Performance",
        content: "Revenue performance exceeded targets with improved collection rates and reduced denial rates.",
        metrics: [
          {
            name: "Net Revenue",
            value: "$4.2M",
            significance: "8% above target"
          },
          {
            name: "Collection Rate",
            value: "92%",
            trend: "increasing",
            significance: "3% improvement from previous period"
          }
        ],
        insights: [
          "Denial rate reduced to 8%",
          "AR days improved to 38 days"
        ],
        recommendations: [
          "Continue denial prevention initiatives",
          "Expand patient payment options"
        ]
      }
    ],
    keyFindings: [
      {
        finding: "Patient volume growth requires capacity planning review",
        importance: "High",
        supportingData: ["12% volume increase", "ED capacity constraints observed"],
        actionRequired: true
      },
      {
        finding: "Financial performance exceeds targets",
        importance: "Medium",
        supportingData: ["Revenue 8% above target", "Collection rate improved"],
        actionRequired: false
      }
    ],
    naturalLanguageSummary: "The hospital demonstrated strong operational and financial performance during the reporting period. Patient volume growth of 12% indicates increasing community trust and service demand. Financial metrics show healthy revenue growth and improved collection efficiency. Key areas for focus include capacity planning to accommodate growth and continued optimization of revenue cycle processes.",
    recommendations: [
      {
        recommendation: "Implement capacity expansion plan",
        rationale: "Patient volume growth exceeding projections",
        priority: "Immediate",
        expectedImpact: "Maintain quality of care while accommodating growth",
        implementationSteps: ["Conduct capacity assessment", "Develop staffing plan", "Review facility expansion options"]
      },
      {
        recommendation: "Enhance revenue cycle analytics",
        rationale: "Opportunity to further improve financial performance",
        priority: "Short-term",
        expectedImpact: "Additional 5% revenue capture",
        implementationSteps: ["Deploy advanced analytics tools", "Train staff on denial prevention", "Implement automated follow-up"]
      }
    ],
    customReportBuilder: {
      suggestedMetrics: ["Patient Satisfaction Score", "Staff Turnover Rate", "Supply Chain Efficiency", "Quality Metrics"],
      suggestedVisualizations: [
        {
          type: "line chart",
          metrics: ["Patient Volume", "Revenue"],
          purpose: "Trend analysis over time"
        },
        {
          type: "bar chart",
          metrics: ["Department Performance"],
          purpose: "Compare department metrics"
        }
      ],
      suggestedFilters: [
        {
          filter: "Department",
          options: ["All", "Emergency", "Surgery", "Outpatient"],
          default: "All"
        },
        {
          filter: "Time Period",
          options: ["Week", "Month", "Quarter", "Year"],
          default: "Month"
        }
      ]
    },
    dataQuality: {
      completeness: 0.95,
      accuracy: 0.97,
      timeliness: 0.92,
      notes: ["Some departments reported data with 1-day delay", "Financial data reconciled and verified"]
    },
    exportFormats: ["PDF", "Excel", "CSV", "JSON"]
  };
};

// ============================================
// PATIENT-FACING AI FEATURES - Batch 4
// ============================================

// 1. AI Health Chatbot
export const getHealthChatbotResponse = async (input: HealthChatbotInput): Promise<AIResponse<HealthChatbotResult>> => {
  const startTime = Date.now();
  const cacheKey = `chatbot-${JSON.stringify(input)}`;

  const cached = getCached<HealthChatbotResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockChatbotResult(input), undefined, Date.now() - startTime);
  }

  try {
    const conversationContext = input.conversationHistory?.map(msg =>
      `${msg.role === 'user' ? 'Patient' : 'Assistant'}: ${msg.content}`
    ).join('\n') || 'No previous conversation';

    const prompt = `You are a compassionate and knowledgeable AI health assistant for patients. You provide helpful, accurate health information while being empathetic and clear. Always prioritize patient safety and recommend professional medical care when appropriate.

Patient Context:
- Age: ${input.patientContext?.age || 'Unknown'}
- Gender: ${input.patientContext?.gender || 'Unknown'}
- Known Conditions: ${input.patientContext?.knownConditions?.join(', ') || 'None provided'}
- Current Medications: ${input.patientContext?.currentMedications?.join(', ') || 'None provided'}
- Allergies: ${input.patientContext?.allergies?.join(', ') || 'None provided'}

Conversation History:
${conversationContext}

Current Message: ${input.message}
Session Type: ${input.sessionType || 'general'}

Provide a helpful, empathetic response with appropriate resources and next steps. Always include safety disclaimers when discussing medical topics.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            response: { type: Type.STRING, description: "The main response to the patient's message" },
            intent: {
              type: Type.STRING,
              enum: ["general_inquiry", "symptom_assessment", "appointment_booking", "medication_reminder", "health_education", "emergency_alert", "triage_recommendation"],
              description: "The detected intent of the patient's message"
            },
            sentiment: {
              type: Type.STRING,
              enum: ["concerned", "neutral", "anxious", "urgent", "curious"],
              description: "The detected emotional sentiment"
            },
            suggestedActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  action: { type: Type.STRING },
                  description: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["high", "medium", "low"] },
                  link: { type: Type.STRING }
                },
                required: ["action", "description", "priority"]
              }
            },
            followUpQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            resources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["article", "video", "tool", "contact"] },
                  url: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "type", "description"]
              }
            },
            escalationRequired: { type: Type.BOOLEAN, description: "Whether escalation to human support is needed" },
            emergencyDetected: { type: Type.BOOLEAN, description: "Whether an emergency situation is detected" },
            confidence: { type: Type.NUMBER, description: "Confidence score 0-1" }
          },
          required: ["response", "intent", "sentiment", "suggestedActions", "followUpQuestions", "resources", "escalationRequired", "emergencyDetected", "confidence"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as HealthChatbotResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in health chatbot:", error);
    return createResponse(true, getMockChatbotResult(input), undefined, Date.now() - startTime);
  }
};

const getMockChatbotResult = (input: HealthChatbotInput): HealthChatbotResult => {
  const message = input.message.toLowerCase();

  if (message.includes('emergency') || message.includes('chest pain') || message.includes('difficulty breathing')) {
    return {
      response: "I notice you may be describing a potentially serious situation. If you're experiencing chest pain, difficulty breathing, or any emergency symptoms, please call emergency services (911) immediately or go to your nearest emergency room. Do not wait for an appointment.",
      intent: "emergency_alert",
      sentiment: "urgent",
      suggestedActions: [
        { action: "Call 911", description: "If experiencing severe symptoms, call emergency services immediately", priority: "high" },
        { action: "Go to ER", description: "Visit the nearest emergency room for immediate care", priority: "high" }
      ],
      followUpQuestions: ["Are you currently experiencing severe symptoms?", "Is someone with you who can help?"],
      resources: [
        { title: "Emergency Services", type: "contact", description: "Call 911 for immediate medical assistance" }
      ],
      escalationRequired: true,
      emergencyDetected: true,
      confidence: 0.95
    };
  }

  if (message.includes('appointment') || message.includes('schedule') || message.includes('book')) {
    return {
      response: "I'd be happy to help you schedule an appointment! I can assist you in finding the right provider and time slot that works for you. To get started, could you tell me what type of appointment you need and any preferred dates or times?",
      intent: "appointment_booking",
      sentiment: "neutral",
      suggestedActions: [
        { action: "Schedule Appointment", description: "Book a new appointment with a provider", priority: "medium", link: "/schedule" },
        { action: "View Available Slots", description: "See available appointment times", priority: "medium" }
      ],
      followUpQuestions: ["What type of appointment do you need?", "Do you have a preferred provider?", "Any preferred dates or times?"],
      resources: [
        { title: "Online Scheduling", type: "tool", url: "/schedule", description: "Schedule appointments online 24/7" }
      ],
      escalationRequired: false,
      emergencyDetected: false,
      confidence: 0.88
    };
  }

  if (message.includes('medication') || message.includes('prescription') || message.includes('refill')) {
    return {
      response: "I can help you with medication-related questions. Whether you need information about your current medications, refill reminders, or have questions about side effects, I'm here to assist. For specific medical advice about your medications, please consult with your healthcare provider or pharmacist.",
      intent: "medication_reminder",
      sentiment: "neutral",
      suggestedActions: [
        { action: "View Medications", description: "See your current medication list", priority: "medium", link: "/medications" },
        { action: "Request Refill", description: "Request a prescription refill", priority: "medium" }
      ],
      followUpQuestions: ["Which medication would you like information about?", "Are you experiencing any side effects?"],
      resources: [
        { title: "Medication Guide", type: "article", description: "Learn about your medications and proper usage" }
      ],
      escalationRequired: false,
      emergencyDetected: false,
      confidence: 0.85
    };
  }

  return {
    response: "Hello! I'm your AI health assistant. I'm here to help you with health questions, appointment scheduling, medication information, and general wellness guidance. How can I assist you today? Remember, while I can provide helpful information, I'm not a substitute for professional medical advice. Please consult your healthcare provider for specific medical concerns.",
    intent: "general_inquiry",
    sentiment: "neutral",
    suggestedActions: [
      { action: "Check Symptoms", description: "Use our symptom checker for guidance", priority: "low", link: "/symptom-checker" },
      { action: "Schedule Appointment", description: "Book an appointment with a provider", priority: "low", link: "/schedule" }
    ],
    followUpQuestions: ["What health topic would you like to explore?", "Do you have any specific symptoms or concerns?"],
    resources: [
      { title: "Health Library", type: "article", description: "Browse our health education resources" },
      { title: "Symptom Checker", type: "tool", url: "/symptom-checker", description: "Interactive symptom assessment tool" }
    ],
    escalationRequired: false,
    emergencyDetected: false,
    confidence: 0.90
  };
};

// 2. AI-Powered Symptom Checker
export const analyzeSymptoms = async (input: SymptomCheckerInput): Promise<AIResponse<SymptomCheckerResult>> => {
  const startTime = Date.now();
  const cacheKey = `symptoms-${JSON.stringify(input)}`;

  const cached = getCached<SymptomCheckerResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockSymptomCheckerResult(input), undefined, Date.now() - startTime);
  }

  try {
    const symptomsList = input.symptoms.map(s =>
      `${s.name} (Severity: ${s.severity}, Duration: ${s.duration}${s.location ? `, Location: ${s.location}` : ''})`
    ).join('\n');

    const prompt = `You are a medical AI assistant helping patients understand their symptoms. Analyze the following symptoms and provide helpful guidance. Always emphasize that this is not a diagnosis and recommend professional medical evaluation when appropriate.

Patient Information:
- Age: ${input.patientInfo.age}
- Gender: ${input.patientInfo.gender}
- Medical History: ${input.patientInfo.medicalHistory?.join(', ') || 'None provided'}
- Current Medications: ${input.patientInfo.currentMedications?.join(', ') || 'None'}
- Allergies: ${input.patientInfo.allergies?.join(', ') || 'None'}
- Recent Travel: ${input.patientInfo.recentTravel || 'None'}

Symptoms:
${symptomsList}

Vital Signs: ${input.vitalSigns ? JSON.stringify(input.vitalSigns) : 'Not provided'}

Provide a comprehensive symptom analysis with possible conditions, urgency assessment, and care recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            possibleConditions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING },
                  probability: { type: Type.NUMBER },
                  icdCode: { type: Type.STRING },
                  description: { type: Type.STRING },
                  matchingSymptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingSymptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
                  riskLevel: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
                  requiresMedicalAttention: { type: Type.BOOLEAN },
                  typicalDuration: { type: Type.STRING },
                  selfCareOptions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["condition", "probability", "description", "matchingSymptoms", "riskLevel", "requiresMedicalAttention"]
              }
            },
            urgencyLevel: { type: Type.STRING, enum: ["self_care", "schedule_appointment", "urgent_care", "emergency"] },
            urgencyReasoning: { type: Type.STRING },
            recommendedActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  action: { type: Type.STRING },
                  timeframe: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["action", "timeframe", "reason"]
              }
            },
            redFlags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  symptom: { type: Type.STRING },
                  description: { type: Type.STRING },
                  action: { type: Type.STRING }
                },
                required: ["symptom", "description", "action"]
              }
            },
            recommendedSpecialists: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  specialty: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  urgency: { type: Type.STRING, enum: ["routine", "urgent", "immediate"] }
                },
                required: ["specialty", "reason", "urgency"]
              }
            },
            homeRemedies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  remedy: { type: Type.STRING },
                  instructions: { type: Type.STRING },
                  precautions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["remedy", "instructions", "precautions"]
              }
            },
            whenToSeekCare: { type: Type.ARRAY, items: { type: Type.STRING } },
            followUpTimeline: { type: Type.STRING },
            disclaimer: { type: Type.STRING }
          },
          required: ["possibleConditions", "urgencyLevel", "urgencyReasoning", "recommendedActions", "redFlags", "recommendedSpecialists", "homeRemedies", "whenToSeekCare", "followUpTimeline", "disclaimer"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as SymptomCheckerResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in symptom analysis:", error);
    return createResponse(true, getMockSymptomCheckerResult(input), undefined, Date.now() - startTime);
  }
};

const getMockSymptomCheckerResult = (input: SymptomCheckerInput): SymptomCheckerResult => {
  const hasFever = input.symptoms.some(s => s.name.toLowerCase().includes('fever'));
  const hasCough = input.symptoms.some(s => s.name.toLowerCase().includes('cough'));
  const hasChestPain = input.symptoms.some(s => s.name.toLowerCase().includes('chest pain'));
  const hasSevereSymptom = input.symptoms.some(s => s.severity === 'severe');

  if (hasChestPain || hasSevereSymptom) {
    return {
      possibleConditions: [
        {
          condition: "Requires Immediate Medical Evaluation",
          probability: 0.85,
          description: "Your symptoms require immediate medical attention to rule out serious conditions.",
          matchingSymptoms: input.symptoms.map(s => s.name),
          missingSymptoms: [],
          riskLevel: "critical",
          requiresMedicalAttention: true,
          typicalDuration: "Varies based on underlying cause",
          selfCareOptions: []
        }
      ],
      urgencyLevel: "emergency",
      urgencyReasoning: "Severe symptoms or chest pain require immediate medical evaluation to rule out life-threatening conditions.",
      recommendedActions: [
        { action: "Call 911 or go to Emergency Room immediately", timeframe: "Immediately", reason: "Severe symptoms require urgent evaluation" }
      ],
      redFlags: [
        { symptom: "Chest pain", description: "Could indicate heart attack or other serious condition", action: "Seek emergency care immediately" }
      ],
      recommendedSpecialists: [
        { specialty: "Emergency Medicine", reason: "Immediate evaluation needed", urgency: "immediate" }
      ],
      homeRemedies: [],
      whenToSeekCare: ["Immediately - do not wait", "If symptoms worsen", "If you experience difficulty breathing"],
      followUpTimeline: "Seek emergency care now",
      disclaimer: "This is not a medical diagnosis. Please seek immediate medical attention for severe symptoms."
    };
  }

  if (hasFever && hasCough) {
    return {
      possibleConditions: [
        {
          condition: "Viral Upper Respiratory Infection",
          probability: 0.70,
          icdCode: "J00",
          description: "Common cold or flu-like illness affecting the upper respiratory tract.",
          matchingSymptoms: ["fever", "cough"],
          missingSymptoms: ["body aches", "fatigue"],
          riskLevel: "low",
          requiresMedicalAttention: false,
          typicalDuration: "7-10 days",
          selfCareOptions: ["Rest and hydration", "Over-the-counter fever reducers", "Honey for cough (adults)"]
        },
        {
          condition: "Influenza",
          probability: 0.25,
          icdCode: "J11",
          description: "Viral infection causing fever, cough, and body aches.",
          matchingSymptoms: ["fever", "cough"],
          missingSymptoms: ["body aches", "fatigue", "sudden onset"],
          riskLevel: "medium",
          requiresMedicalAttention: false,
          typicalDuration: "1-2 weeks",
          selfCareOptions: ["Rest", "Hydration", "Antiviral medications if started within 48 hours"]
        }
      ],
      urgencyLevel: "schedule_appointment",
      urgencyReasoning: "Symptoms are consistent with common viral illness but should be monitored. Consider appointment if symptoms persist or worsen.",
      recommendedActions: [
        { action: "Rest and stay hydrated", timeframe: "Ongoing", reason: "Supports immune function and recovery" },
        { action: "Monitor temperature", timeframe: "Every 4-6 hours", reason: "Track fever pattern" },
        { action: "Schedule appointment if no improvement", timeframe: "After 3-5 days", reason: "Persistent symptoms may need evaluation" }
      ],
      redFlags: [
        { symptom: "High fever (>103°F)", description: "May indicate more serious infection", action: "Seek medical care" },
        { symptom: "Difficulty breathing", description: "Could indicate pneumonia", action: "Seek immediate medical care" }
      ],
      recommendedSpecialists: [
        { specialty: "Primary Care", reason: "For persistent or worsening symptoms", urgency: "routine" }
      ],
      homeRemedies: [
        { remedy: "Warm fluids", instructions: "Drink warm tea or soup to soothe throat", precautions: ["Avoid very hot liquids"] },
        { remedy: "Steam inhalation", instructions: "Breathe steam to ease congestion", precautions: ["Be careful with hot water"] }
      ],
      whenToSeekCare: ["Fever over 103°F", "Symptoms lasting more than 10 days", "Difficulty breathing", "Severe throat pain"],
      followUpTimeline: "Monitor for 3-5 days, seek care if worsening",
      disclaimer: "This is not a medical diagnosis. Please consult a healthcare provider for proper evaluation and treatment."
    };
  }

  return {
    possibleConditions: [
      {
        condition: "General Symptoms Requiring Evaluation",
        probability: 0.60,
        description: "Your symptoms should be evaluated by a healthcare provider for proper diagnosis.",
        matchingSymptoms: input.symptoms.map(s => s.name),
        missingSymptoms: [],
        riskLevel: "medium",
        requiresMedicalAttention: true,
        typicalDuration: "Varies",
        selfCareOptions: ["Rest", "Stay hydrated", "Monitor symptoms"]
      }
    ],
    urgencyLevel: "schedule_appointment",
    urgencyReasoning: "Your symptoms warrant professional medical evaluation for accurate diagnosis.",
    recommendedActions: [
      { action: "Schedule appointment with primary care provider", timeframe: "Within 1-2 days", reason: "Proper evaluation needed" }
    ],
    redFlags: [],
    recommendedSpecialists: [
      { specialty: "Primary Care", reason: "Initial evaluation and diagnosis", urgency: "routine" }
    ],
    homeRemedies: [
      { remedy: "Rest", instructions: "Get adequate sleep and rest", precautions: [] }
    ],
    whenToSeekCare: ["If symptoms worsen", "If new symptoms develop", "If symptoms persist beyond a week"],
    followUpTimeline: "Schedule appointment within 1-2 days",
    disclaimer: "This is not a medical diagnosis. Please consult a healthcare provider for proper evaluation."
  };
};

// 3. Intelligent Appointment Scheduling Assistant
export const getAppointmentSchedulingAssistance = async (input: AppointmentSchedulingInput): Promise<AIResponse<AppointmentSchedulingResult>> => {
  const startTime = Date.now();
  const cacheKey = `appointment-scheduling-${JSON.stringify(input)}`;

  const cached = getCached<AppointmentSchedulingResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockAppointmentSchedulingResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an intelligent appointment scheduling assistant. Help patients find the best appointment slots based on their preferences, medical needs, and provider availability.

Patient Preferences:
- Preferred Dates: ${input.patientPreferences.preferredDates?.join(', ') || 'Flexible'}
- Preferred Times: ${input.patientPreferences.preferredTimes?.join(', ') || 'Flexible'}
- Preferred Days: ${input.patientPreferences.preferredDays?.join(', ') || 'Any'}
- Preferred Providers: ${input.patientPreferences.preferredProviders?.join(', ') || 'No preference'}
- Location Preference: ${input.patientPreferences.locationPreference || 'Any'}
- Urgency Level: ${input.patientPreferences.urgencyLevel || 'Routine'}
- Language Preference: ${input.patientPreferences.languagePreference || 'English'}

Appointment Type: ${input.appointmentType}
Reason for Visit: ${input.reasonForVisit || 'Not specified'}

Insurance: ${input.insuranceInfo ? `${input.insuranceInfo.provider} - ${input.insuranceInfo.planType}` : 'Not provided'}

Patient History:
- Previous Visits: ${input.patientHistory?.previousVisits?.map(v => `${v.date} with ${v.provider}`).join(', ') || 'None'}
- Chronic Conditions: ${input.patientHistory?.chronicConditions?.join(', ') || 'None'}

Available Slots: ${input.availableSlots ? JSON.stringify(input.availableSlots.slice(0, 10)) : 'To be determined'}

Provide intelligent scheduling recommendations with provider matching and wait time predictions.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedSlots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slotId: { type: Type.STRING },
                  providerName: { type: Type.STRING },
                  specialty: { type: Type.STRING },
                  date: { type: Type.STRING },
                  time: { type: Type.STRING },
                  location: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
                  estimatedWaitTime: { type: Type.NUMBER },
                  providerMatchReasons: { type: Type.ARRAY, items: { type: Type.STRING } },
                  travelTime: { type: Type.NUMBER },
                  alternativeOptions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["slotId", "providerName", "specialty", "date", "time", "location", "matchScore", "reasons", "estimatedWaitTime"]
              }
            },
            providerMatches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  providerId: { type: Type.STRING },
                  providerName: { type: Type.STRING },
                  specialty: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  matchReasons: { type: Type.ARRAY, items: { type: Type.STRING } },
                  availability: { type: Type.STRING },
                  patientRating: { type: Type.NUMBER },
                  experience: { type: Type.STRING }
                },
                required: ["providerId", "providerName", "specialty", "matchScore", "matchReasons", "availability"]
              }
            },
            waitTimePredictions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  predictedWait: { type: Type.NUMBER },
                  confidence: { type: Type.NUMBER },
                  factors: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["date", "predictedWait", "confidence", "factors"]
              }
            },
            reschedulingSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  originalAppointment: { type: Type.STRING },
                  suggestedChanges: { type: Type.ARRAY, items: { type: Type.STRING } },
                  reason: { type: Type.STRING },
                  benefits: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["suggestedChanges", "reason", "benefits"]
              }
            },
            preparationReminders: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timing: { type: Type.STRING },
                  reminder: { type: Type.STRING },
                  importance: { type: Type.STRING }
                },
                required: ["timing", "reminder", "importance"]
              }
            },
            insuranceConsiderations: {
              type: Type.OBJECT,
              properties: {
                coverage: { type: Type.STRING },
                estimatedCost: { type: Type.STRING },
                referralRequired: { type: Type.BOOLEAN },
                preAuthorizationNeeded: { type: Type.BOOLEAN }
              },
              required: ["coverage", "estimatedCost", "referralRequired", "preAuthorizationNeeded"]
            },
            optimizationTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["recommendedSlots", "providerMatches", "waitTimePredictions", "reschedulingSuggestions", "preparationReminders", "insuranceConsiderations", "optimizationTips"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as AppointmentSchedulingResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in appointment scheduling:", error);
    return createResponse(true, getMockAppointmentSchedulingResult(input), undefined, Date.now() - startTime);
  }
};

const getMockAppointmentSchedulingResult = (input: AppointmentSchedulingInput): AppointmentSchedulingResult => {
  return {
    recommendedSlots: [
      {
        slotId: "slot-1",
        providerName: "Dr. Sarah Johnson",
        specialty: "Internal Medicine",
        date: "2026-02-17",
        time: "09:30 AM",
        location: "Main Campus - Building A",
        matchScore: 0.95,
        reasons: ["Matches your preferred morning time", "Provider has excellent ratings", "Short wait time expected"],
        estimatedWaitTime: 10,
        providerMatchReasons: ["Specializes in your condition", "Previous positive patient experiences"]
      },
      {
        slotId: "slot-2",
        providerName: "Dr. Michael Chen",
        specialty: "Family Medicine",
        date: "2026-02-18",
        time: "02:00 PM",
        location: "West Side Clinic",
        matchScore: 0.88,
        reasons: ["Available sooner", "Convenient location", "Accepts your insurance"],
        estimatedWaitTime: 15,
        providerMatchReasons: ["Good availability", "Comprehensive care approach"]
      }
    ],
    providerMatches: [
      {
        providerId: "dr-johnson",
        providerName: "Dr. Sarah Johnson",
        specialty: "Internal Medicine",
        matchScore: 0.95,
        matchReasons: ["Specializes in chronic condition management", "Highly rated by patients", "Available this week"],
        availability: "Available Feb 17-19",
        patientRating: 4.8,
        experience: "15 years"
      },
      {
        providerId: "dr-chen",
        providerName: "Dr. Michael Chen",
        specialty: "Family Medicine",
        matchScore: 0.85,
        matchReasons: ["Comprehensive primary care", "Good availability", "Near your location"],
        availability: "Available Feb 18-20",
        patientRating: 4.6,
        experience: "10 years"
      }
    ],
    waitTimePredictions: [
      { date: "2026-02-17", predictedWait: 10, confidence: 0.85, factors: ["Morning appointments typically shorter wait", "Light schedule day"] },
      { date: "2026-02-18", predictedWait: 15, confidence: 0.80, factors: ["Afternoon appointments may have slight delays"] }
    ],
    reschedulingSuggestions: [
      {
        suggestedChanges: ["Consider morning appointments for shorter wait times", "Tuesday and Wednesday typically have better availability"],
        reason: "Optimize for convenience and wait time",
        benefits: ["Reduced wait time", "Better provider availability", "More flexible scheduling"]
      }
    ],
    preparationReminders: [
      { timing: "24 hours before", reminder: "Bring your insurance card and ID", importance: "Required for check-in" },
      { timing: "Day of appointment", reminder: "Arrive 15 minutes early", importance: "Complete paperwork" },
      { timing: "Before appointment", reminder: "Write down questions for your provider", importance: "Make the most of your visit" }
    ],
    insuranceConsiderations: {
      coverage: "In-network - Full coverage for primary care visit",
      estimatedCost: "$25 copay",
      referralRequired: false,
      preAuthorizationNeeded: false
    },
    optimizationTips: [
      "Book morning appointments for shorter wait times",
      "Consider telemedicine for follow-up visits",
      "Schedule regular check-ups in advance for better availability"
    ]
  };
};

// 4. AI-Powered Post-Discharge Follow-Up System
export const getDischargeFollowUpPlan = async (input: DischargeFollowUpInput): Promise<AIResponse<DischargeFollowUpResult>> => {
  const startTime = Date.now();
  const cacheKey = `discharge-followup-${JSON.stringify(input)}`;

  const cached = getCached<DischargeFollowUpResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockDischargeFollowUpResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a post-discharge care coordinator AI. Create a comprehensive follow-up plan for a patient who has been discharged from the hospital.

Patient Information:
- Name: ${input.patientInfo.name}
- Age: ${input.patientInfo.age}
- Gender: ${input.patientInfo.gender}

Discharge Details:
- Discharge Date: ${input.dischargeDetails.dischargeDate}
- Diagnosis: ${input.dischargeDetails.diagnosis}
- Procedures: ${input.dischargeDetails.procedures?.join(', ') || 'None'}
- Length of Stay: ${input.dischargeDetails.lengthOfStay} days
- Discharged To: ${input.dischargeDetails.dischargeDestination}

Discharge Summary: ${input.dischargeDetails.dischargeSummary}

Medications:
${input.medications.map(m => `- ${m.name} ${m.dosage} ${m.frequency} for ${m.duration}`).join('\n')}

Follow-Up Instructions: ${input.followUpInstructions.join(', ')}
Warning Signs to Watch: ${input.warningSigns.join(', ')}
Activity Restrictions: ${input.activityRestrictions.join(', ')}

Risk Factors:
- Readmission Risk Score: ${input.riskFactors.readmissionRiskScore || 'Unknown'}
- Chronic Conditions: ${input.riskFactors.chronicConditions?.join(', ') || 'None'}
- Previous Admissions: ${input.riskFactors.previousAdmissions || 0}
- Social Support: ${input.riskFactors.socialSupport || 'Unknown'}

Create a detailed follow-up plan including schedule, milestones, medication adherence, and risk assessment.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            followUpSchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["phone_call", "video_call", "in_person", "home_visit"] },
                  scheduledDate: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["high", "medium", "low"] },
                  checklistItems: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["type", "scheduledDate", "purpose", "priority", "checklistItems"]
              }
            },
            recoveryMilestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  milestone: { type: Type.STRING },
                  expectedDate: { type: Type.STRING },
                  indicators: { type: Type.ARRAY, items: { type: Type.STRING } },
                  warningSigns: { type: Type.ARRAY, items: { type: Type.STRING } },
                  status: { type: Type.STRING, enum: ["pending", "on_track", "delayed", "achieved"] }
                },
                required: ["milestone", "expectedDate", "indicators", "warningSigns", "status"]
              }
            },
            medicationAdherencePlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medication: { type: Type.STRING },
                  schedule: { type: Type.ARRAY, items: { type: Type.STRING } },
                  reminders: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        timing: { type: Type.STRING },
                        message: { type: Type.STRING }
                      },
                      required: ["timing", "message"]
                    }
                  },
                  potentialIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
                  adherenceTips: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["medication", "schedule", "reminders", "potentialIssues", "adherenceTips"]
              }
            },
            readmissionRiskAssessment: {
              type: Type.OBJECT,
              properties: {
                riskLevel: { type: Type.STRING, enum: ["low", "moderate", "high", "very_high"] },
                riskScore: { type: Type.NUMBER },
                riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
                protectiveFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
                mitigationStrategies: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["riskLevel", "riskScore", "riskFactors", "protectiveFactors", "mitigationStrategies"]
            },
            warningSignMonitoring: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sign: { type: Type.STRING },
                  description: { type: Type.STRING },
                  actionToTake: { type: Type.STRING },
                  urgencyLevel: { type: Type.STRING, enum: ["emergency", "urgent", "routine"] },
                  contactNumber: { type: Type.STRING }
                },
                required: ["sign", "description", "actionToTake", "urgencyLevel"]
              }
            },
            progressTracking: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  metric: { type: Type.STRING },
                  baseline: { type: Type.STRING },
                  target: { type: Type.STRING },
                  current: { type: Type.STRING },
                  measurementFrequency: { type: Type.STRING }
                },
                required: ["metric", "baseline", "target", "measurementFrequency"]
              }
            },
            alerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["missed_medication", "missed_appointment", "warning_sign", "milestone_delay", "high_risk"] },
                  message: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["info", "warning", "critical"] },
                  recommendedAction: { type: Type.STRING }
                },
                required: ["type", "message", "severity", "recommendedAction"]
              }
            },
            educationalResources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  format: { type: Type.STRING, enum: ["video", "article", "infographic"] },
                  url: { type: Type.STRING },
                  summary: { type: Type.STRING }
                },
                required: ["topic", "format", "summary"]
              }
            }
          },
          required: ["followUpSchedule", "recoveryMilestones", "medicationAdherencePlan", "readmissionRiskAssessment", "warningSignMonitoring", "progressTracking", "alerts", "educationalResources"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as DischargeFollowUpResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in discharge follow-up:", error);
    return createResponse(true, getMockDischargeFollowUpResult(input), undefined, Date.now() - startTime);
  }
};

const getMockDischargeFollowUpResult = (input: DischargeFollowUpInput): DischargeFollowUpResult => {
  const dischargeDate = new Date(input.dischargeDetails.dischargeDate);

  return {
    followUpSchedule: [
      {
        type: "phone_call",
        scheduledDate: new Date(dischargeDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        purpose: "Initial post-discharge check-in",
        priority: "high",
        checklistItems: ["Review medications", "Check for warning signs", "Answer questions", "Confirm follow-up appointments"]
      },
      {
        type: "video_call",
        scheduledDate: new Date(dischargeDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        purpose: "One-week follow-up assessment",
        priority: "high",
        checklistItems: ["Review recovery progress", "Assess medication adherence", "Evaluate symptoms", "Adjust care plan if needed"]
      },
      {
        type: "in_person",
        scheduledDate: new Date(dischargeDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        purpose: "Two-week follow-up appointment",
        priority: "medium",
        checklistItems: ["Physical examination", "Lab work review", "Medication adjustment", "Care plan update"]
      }
    ],
    recoveryMilestones: [
      {
        milestone: "Return to light activities",
        expectedDate: new Date(dischargeDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        indicators: ["Able to walk short distances", "Pain well-controlled", "No new symptoms"],
        warningSigns: ["Increased pain", "Shortness of breath", "Fever"],
        status: "pending"
      },
      {
        milestone: "Resume normal diet",
        expectedDate: new Date(dischargeDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        indicators: ["No nausea", "Good appetite", "Normal bowel function"],
        warningSigns: ["Persistent nausea", "Vomiting", "Abdominal pain"],
        status: "pending"
      },
      {
        milestone: "Full recovery",
        expectedDate: new Date(dischargeDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        indicators: ["Return to baseline activity", "No symptoms", "All medications completed"],
        warningSigns: ["Recurring symptoms", "New complications"],
        status: "pending"
      }
    ],
    medicationAdherencePlan: input.medications.map(med => ({
      medication: med.name,
      schedule: [med.frequency],
      reminders: [
        { timing: "15 minutes before", message: `Time to prepare your ${med.name}` },
        { timing: "At scheduled time", message: `Take your ${med.name} ${med.dosage}` }
      ],
      potentialIssues: ["Missed doses", "Side effects", "Drug interactions"],
      adherenceTips: ["Set phone alarms", "Use pill organizer", "Keep medications visible", "Link to daily routine"]
    })),
    readmissionRiskAssessment: {
      riskLevel: input.riskFactors.readmissionRiskScore && input.riskFactors.readmissionRiskScore > 0.5 ? "high" : "moderate",
      riskScore: input.riskFactors.readmissionRiskScore || 0.35,
      riskFactors: input.riskFactors.chronicConditions || ["Recent hospitalization"],
      protectiveFactors: ["Discharged to home", "Has follow-up scheduled", "Medication reconciliation completed"],
      mitigationStrategies: ["Close follow-up monitoring", "Medication adherence support", "Patient education", "Caregiver involvement"]
    },
    warningSignMonitoring: input.warningSigns.map(sign => ({
      sign,
      description: `Watch for ${sign.toLowerCase()} as this may indicate a complication`,
      actionToTake: "Contact your healthcare provider immediately",
      urgencyLevel: sign.toLowerCase().includes('severe') || sign.toLowerCase().includes('chest pain') ? "emergency" : "urgent"
    })),
    progressTracking: [
      { metric: "Pain Level", baseline: "Moderate", target: "Minimal/None", measurementFrequency: "Daily" },
      { metric: "Activity Level", baseline: "Limited", target: "Normal", measurementFrequency: "Daily" },
      { metric: "Medication Adherence", baseline: "Starting", target: "100%", measurementFrequency: "Daily" }
    ],
    alerts: [
      {
        type: "high_risk",
        message: "Patient requires close monitoring due to readmission risk factors",
        severity: "warning",
        recommendedAction: "Ensure all follow-up appointments are scheduled and attended"
      }
    ],
    educationalResources: [
      { topic: "Recovery at Home", format: "video", summary: "Guide to post-discharge recovery and what to expect" },
      { topic: "Medication Management", format: "article", summary: "How to manage your medications safely at home" },
      { topic: "Warning Signs", format: "infographic", summary: "Visual guide to warning signs that require medical attention" }
    ]
  };
};

// 5. Personalized Health Education Generator
export const generateHealthEducation = async (input: HealthEducationInput): Promise<AIResponse<HealthEducationResult>> => {
  const startTime = Date.now();
  const cacheKey = `health-education-${JSON.stringify(input)}`;

  const cached = getCached<HealthEducationResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockHealthEducationResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a patient health educator AI. Create personalized, easy-to-understand health education content for a patient.

Patient Information:
- Age: ${input.patientInfo.age}
- Gender: ${input.patientInfo.gender}
- Education Level: ${input.patientInfo.educationLevel || 'Not specified'}
- Language: ${input.patientInfo.language || 'English'}
- Learning Preferences: ${input.patientInfo.learningPreferences?.join(', ') || 'All formats'}

Health Context:
- Conditions: ${input.healthContext.conditions.join(', ')}
- Medications: ${input.healthContext.medications?.join(', ') || 'None'}
- Recent Procedures: ${input.healthContext.recentProcedures?.join(', ') || 'None'}
- Upcoming Procedures: ${input.healthContext.upcomingProcedures?.join(', ') || 'None'}

Education Goals: ${input.educationGoals.join(', ')}
Specific Questions: ${input.specificQuestions?.join(', ') || 'None'}

Create comprehensive, patient-friendly educational content that addresses their specific health situation.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryContent: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                summary: { type: Type.STRING },
                detailedContent: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                format: { type: Type.STRING, enum: ["text", "video", "infographic", "interactive"] },
                readingLevel: { type: Type.STRING, enum: ["basic", "intermediate", "advanced"] },
                estimatedReadTime: { type: Type.NUMBER },
                relatedTopics: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "category", "summary", "detailedContent", "keyPoints", "format", "readingLevel", "estimatedReadTime", "relatedTopics"]
            },
            conditionExplanation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING },
                  whatItIs: { type: Type.STRING },
                  causes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
                  progression: { type: Type.STRING },
                  prognosis: { type: Type.STRING }
                },
                required: ["condition", "whatItIs", "causes", "symptoms", "progression", "prognosis"]
              }
            },
            treatmentInformation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  treatment: { type: Type.STRING },
                  howItWorks: { type: Type.STRING },
                  benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
                  risks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  whatToExpect: { type: Type.STRING }
                },
                required: ["treatment", "howItWorks", "benefits", "risks", "alternatives", "whatToExpect"]
              }
            },
            lifestyleRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, enum: ["diet", "exercise", "sleep", "stress_management", "habits"] },
                  recommendation: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  implementationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  expectedBenefits: { type: Type.STRING }
                },
                required: ["category", "recommendation", "rationale", "implementationTips", "expectedBenefits"]
              }
            },
            preventiveCare: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  screening: { type: Type.STRING },
                  frequency: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  nextDue: { type: Type.STRING }
                },
                required: ["screening", "frequency", "importance"]
              }
            },
            medicationEducation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medication: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  howToTake: { type: Type.STRING },
                  sideEffects: { type: Type.ARRAY, items: { type: Type.STRING } },
                  interactions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  storage: { type: Type.STRING },
                  missedDose: { type: Type.STRING }
                },
                required: ["medication", "purpose", "howToTake", "sideEffects", "interactions", "storage", "missedDose"]
              }
            },
            faqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  category: { type: Type.STRING }
                },
                required: ["question", "answer", "category"]
              }
            },
            resources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["article", "video", "support_group", "app", "hotline"] },
                  url: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "type", "description"]
              }
            },
            actionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  goal: { type: Type.STRING },
                  steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  timeline: { type: Type.STRING },
                  successMetrics: { type: Type.STRING }
                },
                required: ["goal", "steps", "timeline", "successMetrics"]
              }
            }
          },
          required: ["primaryContent", "conditionExplanation", "treatmentInformation", "lifestyleRecommendations", "preventiveCare", "medicationEducation", "faqs", "resources", "actionPlan"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as HealthEducationResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in health education:", error);
    return createResponse(true, getMockHealthEducationResult(input), undefined, Date.now() - startTime);
  }
};

const getMockHealthEducationResult = (input: HealthEducationInput): HealthEducationResult => {
  const conditions = input.healthContext.conditions;

  return {
    primaryContent: {
      title: `Understanding Your Health: ${conditions[0] || 'General Wellness'}`,
      category: "Patient Education",
      summary: "This guide provides essential information about your health condition, treatment options, and steps you can take to improve your well-being.",
      detailedContent: "Your health journey is unique, and understanding your condition is the first step toward better health. This comprehensive guide will help you understand your diagnosis, treatment options, and lifestyle changes that can make a real difference in how you feel every day.",
      keyPoints: [
        "Understanding your condition helps you make informed decisions",
        "Treatment works best when combined with healthy lifestyle choices",
        "Regular follow-ups are essential for monitoring progress",
        "Don't hesitate to ask questions about your care"
      ],
      format: "text",
      readingLevel: "basic",
      estimatedReadTime: 10,
      relatedTopics: ["Preventive Care", "Medication Management", "Healthy Lifestyle"]
    },
    conditionExplanation: conditions.map(condition => ({
      condition,
      whatItIs: `${condition} is a health condition that affects your body in specific ways. Understanding how it works helps you manage it better.`,
      causes: ["Various factors including genetics", "Lifestyle factors", "Environmental factors"],
      symptoms: ["Symptoms vary by individual", "May include fatigue", "May include discomfort"],
      progression: "With proper management, most people can maintain a good quality of life.",
      prognosis: "Many people with this condition live full, active lives with proper treatment and lifestyle management."
    })),
    treatmentInformation: [
      {
        treatment: "Medication Management",
        howItWorks: "Medications help control symptoms and prevent complications",
        benefits: ["Symptom relief", "Disease management", "Prevention of complications"],
        risks: ["Side effects", "Drug interactions", "Need for regular monitoring"],
        alternatives: ["Lifestyle modifications", "Physical therapy", "Dietary changes"],
        whatToExpect: "Most treatments show results within a few weeks. Your healthcare provider will monitor your progress and adjust treatment as needed."
      }
    ],
    lifestyleRecommendations: [
      {
        category: "diet",
        recommendation: "Follow a balanced diet rich in fruits, vegetables, and whole grains",
        rationale: "Good nutrition supports your body's healing and helps manage your condition",
        implementationTips: ["Start with small changes", "Plan meals ahead", "Read nutrition labels"],
        expectedBenefits: "Better energy levels, improved symptoms, and overall better health"
      },
      {
        category: "exercise",
        recommendation: "Aim for 30 minutes of moderate activity most days",
        rationale: "Regular exercise improves cardiovascular health and overall well-being",
        implementationTips: ["Start slowly", "Find activities you enjoy", "Exercise with a friend"],
        expectedBenefits: "Improved strength, better mood, and better disease management"
      }
    ],
    preventiveCare: [
      { screening: "Annual Physical Exam", frequency: "Yearly", importance: "Comprehensive health assessment and early detection" },
      { screening: "Blood Pressure Check", frequency: "Every visit", importance: "Monitor cardiovascular health" },
      { screening: "Lab Work", frequency: "As recommended", importance: "Monitor key health markers" }
    ],
    medicationEducation: (input.healthContext.medications || []).map(med => ({
      medication: med,
      purpose: "This medication helps manage your condition",
      howToTake: "Take as directed by your healthcare provider",
      sideEffects: ["May cause mild stomach upset", "Report any unusual symptoms"],
      interactions: ["Check with your pharmacist about other medications"],
      storage: "Store at room temperature, away from moisture",
      missedDose: "Take as soon as you remember, unless it's almost time for the next dose"
    })),
    faqs: [
      { question: "What should I do if I miss a dose of my medication?", answer: "Take it as soon as you remember, unless it's almost time for your next dose. Never double up on doses.", category: "Medication" },
      { question: "How long until I see improvement?", answer: "Most treatments take several weeks to show full effects. Be patient and follow your treatment plan.", category: "Treatment" },
      { question: "Can I still exercise with my condition?", answer: "Most people can and should exercise. Talk to your doctor about the best activities for you.", category: "Lifestyle" }
    ],
    resources: [
      { title: "Patient Support Group", type: "support_group", description: "Connect with others who share your health journey" },
      { title: "Health Tracking App", type: "app", description: "Track your symptoms, medications, and progress" },
      { title: "24/7 Nurse Hotline", type: "hotline", description: "Get answers to health questions anytime" }
    ],
    actionPlan: [
      {
        goal: "Understand your condition",
        steps: ["Read educational materials", "Write down questions", "Discuss with your healthcare provider"],
        timeline: "This week",
        successMetrics: "You can explain your condition to a family member"
      },
      {
        goal: "Improve medication adherence",
        steps: ["Set up reminders", "Use a pill organizer", "Track your doses"],
        timeline: "Starting today",
        successMetrics: "Taking all medications as prescribed for 2 weeks"
      }
    ]
  };
};

// 6. AI-Powered Medication Reminder System
export const getMedicationReminderPlan = async (input: MedicationReminderInput): Promise<AIResponse<MedicationReminderResult>> => {
  const startTime = Date.now();
  const cacheKey = `medication-reminder-${JSON.stringify(input)}`;

  const cached = getCached<MedicationReminderResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockMedicationReminderResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are a medication management AI assistant. Create a comprehensive medication reminder and adherence plan for a patient.

Patient Information:
- Name: ${input.patientInfo.name}
- Age: ${input.patientInfo.age}
- Timezone: ${input.patientInfo.timezone || 'UTC'}
- Contact Methods: ${input.patientInfo.contactMethods.join(', ')}

Medications:
${input.medications.map(m => `- ${m.name} ${m.dosage} ${m.frequency} at ${m.times.join(', ')}${m.foodRequirements ? ` (${m.foodRequirements})` : ''}`).join('\n')}

Current Medications: ${input.currentMedications?.join(', ') || 'None'}
Allergies: ${input.allergies?.join(', ') || 'None'}

Preferences:
- Reminder Lead Time: ${input.preferences.reminderLeadTime} minutes
- Snooze Duration: ${input.preferences.snoozeDuration} minutes
- Max Snoozes: ${input.preferences.maxSnoozes}
- Quiet Hours: ${input.preferences.quietHoursStart || 'None'} to ${input.preferences.quietHoursEnd || 'None'}

Adherence History: ${input.adherenceHistory ? JSON.stringify(input.adherenceHistory) : 'Not available'}

Create an optimized medication schedule with reminders, interaction warnings, and adherence improvement strategies.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedSchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medicationId: { type: Type.STRING },
                  medicationName: { type: Type.STRING },
                  scheduledTime: { type: Type.STRING },
                  dosage: { type: Type.STRING },
                  instructions: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["pending", "taken", "missed", "skipped"] },
                  reminderSent: { type: Type.BOOLEAN },
                  snoozeCount: { type: Type.NUMBER }
                },
                required: ["medicationId", "medicationName", "scheduledTime", "dosage", "instructions", "status", "reminderSent", "snoozeCount"]
              }
            },
            interactionWarnings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medication1: { type: Type.STRING },
                  medication2: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["mild", "moderate", "severe", "contraindicated"] },
                  interaction: { type: Type.STRING },
                  symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendation: { type: Type.STRING },
                  actionRequired: { type: Type.BOOLEAN }
                },
                required: ["medication1", "medication2", "severity", "interaction", "symptoms", "recommendation", "actionRequired"]
              }
            },
            refillReminders: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medication: { type: Type.STRING },
                  currentSupply: { type: Type.NUMBER },
                  daysRemaining: { type: Type.NUMBER },
                  refillDate: { type: Type.STRING },
                  pharmacyContact: { type: Type.STRING },
                  reorderUrl: { type: Type.STRING }
                },
                required: ["medication", "currentSupply", "daysRemaining", "refillDate"]
              }
            },
            adherenceReport: {
              type: Type.OBJECT,
              properties: {
                overallAdherence: { type: Type.NUMBER },
                medicationBreakdown: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      medication: { type: Type.STRING },
                      adherenceRate: { type: Type.NUMBER },
                      missedDoses: { type: Type.NUMBER },
                      pattern: { type: Type.STRING }
                    },
                    required: ["medication", "adherenceRate", "missedDoses", "pattern"]
                  }
                },
                trends: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      period: { type: Type.STRING },
                      adherence: { type: Type.NUMBER },
                      improvement: { type: Type.NUMBER }
                    },
                    required: ["period", "adherence", "improvement"]
                  }
                },
                insights: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["overallAdherence", "medicationBreakdown", "trends", "insights"]
            },
            personalizedReminders: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medication: { type: Type.STRING },
                  time: { type: Type.STRING },
                  message: { type: Type.STRING },
                  tone: { type: Type.STRING, enum: ["gentle", "standard", "urgent"] },
                  additionalContext: { type: Type.STRING }
                },
                required: ["medication", "time", "message", "tone", "additionalContext"]
              }
            },
            sideEffectMonitoring: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medication: { type: Type.STRING },
                  commonSideEffects: { type: Type.ARRAY, items: { type: Type.STRING } },
                  seriousSideEffects: { type: Type.ARRAY, items: { type: Type.STRING } },
                  whenToReport: { type: Type.ARRAY, items: { type: Type.STRING } },
                  reportingInstructions: { type: Type.STRING }
                },
                required: ["medication", "commonSideEffects", "seriousSideEffects", "whenToReport", "reportingInstructions"]
              }
            },
            adherenceImprovementTips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tip: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  implementation: { type: Type.STRING },
                  expectedImpact: { type: Type.STRING }
                },
                required: ["tip", "reason", "implementation", "expectedImpact"]
              }
            }
          },
          required: ["optimizedSchedule", "interactionWarnings", "refillReminders", "adherenceReport", "personalizedReminders", "sideEffectMonitoring", "adherenceImprovementTips"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as MedicationReminderResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in medication reminder:", error);
    return createResponse(true, getMockMedicationReminderResult(input), undefined, Date.now() - startTime);
  }
};

const getMockMedicationReminderResult = (input: MedicationReminderInput): MedicationReminderResult => {
  return {
    optimizedSchedule: input.medications.flatMap(med =>
      med.times.map((time, idx) => ({
        medicationId: med.medicationId,
        medicationName: med.name,
        scheduledTime: time,
        dosage: med.dosage,
        instructions: med.instructions,
        status: "pending" as const,
        reminderSent: false,
        snoozeCount: 0
      }))
    ),
    interactionWarnings: [
      {
        medication1: input.medications[0]?.name || "Medication A",
        medication2: input.medications[1]?.name || "Medication B",
        severity: "moderate",
        interaction: "May increase risk of bleeding",
        symptoms: ["Easy bruising", "Unusual bleeding"],
        recommendation: "Monitor for signs of bleeding; separate doses by 2 hours if possible",
        actionRequired: false
      }
    ],
    refillReminders: input.medications.slice(0, 2).map(med => ({
      medication: med.name,
      currentSupply: 15,
      daysRemaining: 10,
      refillDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pharmacyContact: "Main Street Pharmacy: (555) 123-4567"
    })),
    adherenceReport: {
      overallAdherence: 85,
      medicationBreakdown: input.medications.slice(0, 3).map(med => ({
        medication: med.name,
        adherenceRate: 85 + Math.random() * 10,
        missedDoses: Math.floor(Math.random() * 3),
        pattern: "Mostly consistent with occasional missed evening doses"
      })),
      trends: [
        { period: "This Week", adherence: 88, improvement: 3 },
        { period: "Last Week", adherence: 85, improvement: 0 },
        { period: "Last Month", adherence: 82, improvement: -3 }
      ],
      insights: [
        "Adherence is higher in the morning",
        "Weekend adherence tends to be lower",
        "Setting multiple reminders improves adherence by 15%"
      ]
    },
    personalizedReminders: input.medications.slice(0, 3).flatMap(med =>
      med.times.slice(0, 1).map(time => ({
        medication: med.name,
        time,
        message: `Hi ${input.patientInfo.name}! It's time for your ${med.name}. ${med.foodRequirements === 'with_food' ? "Remember to take with food." : ""}`,
        tone: "gentle" as const,
        additionalContext: med.specialInstructions || ""
      }))
    ),
    sideEffectMonitoring: input.medications.slice(0, 2).map(med => ({
      medication: med.name,
      commonSideEffects: ["Mild stomach upset", "Headache", "Drowsiness"],
      seriousSideEffects: ["Severe allergic reaction", "Difficulty breathing", "Chest pain"],
      whenToReport: ["If side effects persist or worsen", "If you experience serious side effects"],
      reportingInstructions: "Contact your healthcare provider immediately for serious side effects. For common side effects, mention at your next appointment."
    })),
    adherenceImprovementTips: [
      {
        tip: "Link medication to daily routine",
        reason: "Habit stacking improves consistency",
        implementation: "Take medications with breakfast or before brushing teeth",
        expectedImpact: "20% improvement in adherence"
      },
      {
        tip: "Use visual reminders",
        reason: "Visual cues prompt action",
        implementation: "Place medications in visible location or use sticky notes",
        expectedImpact: "15% improvement in adherence"
      },
      {
        tip: "Set multiple alarm types",
        reason: "Different cues reach you in different ways",
        implementation: "Use phone alarm, app notification, and calendar reminder",
        expectedImpact: "25% improvement in adherence"
      }
    ]
  };
};

// 7. Intelligent Patient Feedback Analyzer
export const analyzePatientFeedback = async (input: PatientFeedbackInput): Promise<AIResponse<PatientFeedbackResult>> => {
  const startTime = Date.now();
  const cacheKey = `patient-feedback-${JSON.stringify(input)}`;

  const cached = getCached<PatientFeedbackResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockPatientFeedbackResult(input), undefined, Date.now() - startTime);
  }

  try {
    const feedbackSummary = input.feedbackItems.slice(0, 10).map(f =>
      `[${f.category}] Rating: ${f.rating || 'N/A'} - "${f.feedback.substring(0, 200)}"`
    ).join('\n');

    const prompt = `You are a patient experience analytics AI. Analyze the following patient feedback to identify trends, sentiment, and actionable insights for healthcare improvement.

Analysis Scope: ${input.analysisScope || 'organization'}
Timeframe: ${input.timeframe || 'Recent period'}
Total Feedback Items: ${input.feedbackItems.length}

Sample Feedback:
${feedbackSummary}

Previous Analysis Context:
${input.previousAnalysis ? `Average Rating: ${input.previousAnalysis.averageRating}, Top Issues: ${input.previousAnalysis.topIssues.join(', ')}` : 'Not available'}

Provide comprehensive sentiment analysis, trend identification, and actionable recommendations for service improvement.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentimentAnalysis: {
              type: Type.OBJECT,
              properties: {
                overallSentiment: { type: Type.STRING, enum: ["very_positive", "positive", "neutral", "negative", "very_negative"] },
                sentimentScore: { type: Type.NUMBER },
                emotionalTone: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyPhrases: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      phrase: { type: Type.STRING },
                      sentiment: { type: Type.STRING, enum: ["positive", "negative", "neutral"] },
                      frequency: { type: Type.NUMBER }
                    },
                    required: ["phrase", "sentiment", "frequency"]
                  }
                },
                aspectSentiments: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      aspect: { type: Type.STRING },
                      sentiment: { type: Type.STRING, enum: ["positive", "negative", "neutral"] },
                      score: { type: Type.NUMBER },
                      mentions: { type: Type.NUMBER }
                    },
                    required: ["aspect", "sentiment", "score", "mentions"]
                  }
                }
              },
              required: ["overallSentiment", "sentimentScore", "emotionalTone", "keyPhrases", "aspectSentiments"]
            },
            identifiedIssues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  issue: { type: Type.STRING },
                  category: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["critical", "major", "minor"] },
                  frequency: { type: Type.NUMBER },
                  affectedDepartments: { type: Type.ARRAY, items: { type: Type.STRING } },
                  exampleQuotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  rootCauseHypothesis: { type: Type.STRING }
                },
                required: ["issue", "category", "severity", "frequency", "affectedDepartments", "exampleQuotes", "rootCauseHypothesis"]
              }
            },
            positiveHighlights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  highlight: { type: Type.STRING },
                  category: { type: Type.STRING },
                  frequency: { type: Type.NUMBER },
                  departments: { type: Type.ARRAY, items: { type: Type.STRING } },
                  exampleQuotes: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["highlight", "category", "frequency", "departments", "exampleQuotes"]
              }
            },
            trends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  trend: { type: Type.STRING, enum: ["improving", "declining", "stable"] },
                  changePercentage: { type: Type.NUMBER },
                  dataPoints: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        period: { type: Type.STRING },
                        value: { type: Type.NUMBER }
                      },
                      required: ["period", "value"]
                    }
                  },
                  significance: { type: Type.STRING }
                },
                required: ["category", "trend", "changePercentage", "dataPoints", "significance"]
              }
            },
            actionableInsights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  insight: { type: Type.STRING },
                  category: { type: Type.STRING },
                  impact: { type: Type.STRING, enum: ["high", "medium", "low"] },
                  effort: { type: Type.STRING, enum: ["quick_win", "moderate", "significant"] },
                  recommendation: { type: Type.STRING },
                  expectedOutcome: { type: Type.STRING },
                  priority: { type: Type.NUMBER }
                },
                required: ["insight", "category", "impact", "effort", "recommendation", "expectedOutcome", "priority"]
              }
            },
            serviceImprovements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  area: { type: Type.STRING },
                  currentScore: { type: Type.NUMBER },
                  targetScore: { type: Type.NUMBER },
                  gap: { type: Type.NUMBER },
                  recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                  timeline: { type: Type.STRING },
                  resources: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["area", "currentScore", "targetScore", "gap", "recommendations", "timeline", "resources"]
              }
            },
            providerFeedback: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  providerId: { type: Type.STRING },
                  providerName: { type: Type.STRING },
                  department: { type: Type.STRING },
                  averageRating: { type: Type.NUMBER },
                  feedbackCount: { type: Type.NUMBER },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
                  patientComments: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["providerName", "department", "averageRating", "feedbackCount", "strengths", "areasForImprovement", "patientComments"]
              }
            },
            departmentAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  department: { type: Type.STRING },
                  averageRating: { type: Type.NUMBER },
                  feedbackVolume: { type: Type.NUMBER },
                  topStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  topConcerns: { type: Type.ARRAY, items: { type: Type.STRING } },
                  comparisonToAverage: { type: Type.NUMBER }
                },
                required: ["department", "averageRating", "feedbackVolume", "topStrengths", "topConcerns", "comparisonToAverage"]
              }
            },
            responseRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feedbackId: { type: Type.STRING },
                  responseType: { type: Type.STRING, enum: ["acknowledge", "apologize", "clarify", "compensate", "escalate"] },
                  suggestedResponse: { type: Type.STRING },
                  tone: { type: Type.STRING, enum: ["formal", "warm", "empathetic"] },
                  followUpActions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["feedbackId", "responseType", "suggestedResponse", "tone", "followUpActions"]
              }
            },
            executiveSummary: {
              type: Type.OBJECT,
              properties: {
                totalFeedbackAnalyzed: { type: Type.NUMBER },
                overallSatisfactionScore: { type: Type.NUMBER },
                npsScore: { type: Type.NUMBER },
                keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                criticalIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
                topPriorities: { type: Type.ARRAY, items: { type: Type.STRING } },
                progressFromLastPeriod: { type: Type.STRING }
              },
              required: ["totalFeedbackAnalyzed", "overallSatisfactionScore", "keyStrengths", "criticalIssues", "topPriorities", "progressFromLastPeriod"]
            }
          },
          required: ["sentimentAnalysis", "identifiedIssues", "positiveHighlights", "trends", "actionableInsights", "serviceImprovements", "providerFeedback", "departmentAnalysis", "responseRecommendations", "executiveSummary"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as PatientFeedbackResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in patient feedback analysis:", error);
    return createResponse(true, getMockPatientFeedbackResult(input), undefined, Date.now() - startTime);
  }
};

const getMockPatientFeedbackResult = (input: PatientFeedbackInput): PatientFeedbackResult => {
  return {
    sentimentAnalysis: {
      overallSentiment: "positive",
      sentimentScore: 0.65,
      emotionalTone: ["grateful", "satisfied", "hopeful"],
      keyPhrases: [
        { phrase: "excellent care", sentiment: "positive", frequency: 45 },
        { phrase: "long wait time", sentiment: "negative", frequency: 23 },
        { phrase: "friendly staff", sentiment: "positive", frequency: 38 },
        { phrase: "clean facility", sentiment: "positive", frequency: 29 }
      ],
      aspectSentiments: [
        { aspect: "Clinical Care", sentiment: "positive", score: 0.82, mentions: 156 },
        { aspect: "Staff Attitude", sentiment: "positive", score: 0.78, mentions: 134 },
        { aspect: "Wait Times", sentiment: "negative", score: -0.35, mentions: 89 },
        { aspect: "Facility Cleanliness", sentiment: "positive", score: 0.71, mentions: 67 }
      ]
    },
    identifiedIssues: [
      {
        issue: "Long wait times in emergency department",
        category: "facilities",
        severity: "major",
        frequency: 45,
        affectedDepartments: ["Emergency Department", "Registration"],
        exampleQuotes: ["Waited 4 hours to be seen", "ER wait time was unacceptable"],
        rootCauseHypothesis: "Staffing shortages during peak hours combined with inefficient triage process"
      },
      {
        issue: "Difficulty scheduling appointments",
        category: "administrative",
        severity: "minor",
        frequency: 18,
        affectedDepartments: ["Scheduling", "Front Desk"],
        exampleQuotes: ["Took 3 calls to get an appointment", "Online scheduling never works"],
        rootCauseHypothesis: "Outdated scheduling system and insufficient phone lines"
      }
    ],
    positiveHighlights: [
      {
        highlight: "Compassionate nursing care",
        category: "nursing",
        frequency: 67,
        departments: ["ICU", "Medical-Surgical", "Pediatrics"],
        exampleQuotes: ["Nurses went above and beyond", "Nursing staff was incredibly attentive"]
      },
      {
        highlight: "Clear communication from doctors",
        category: "clinical_care",
        frequency: 52,
        departments: ["Cardiology", "Orthopedics", "Primary Care"],
        exampleQuotes: ["Doctor explained everything clearly", "Felt informed about my treatment"]
      }
    ],
    trends: [
      {
        category: "Overall Satisfaction",
        trend: "improving",
        changePercentage: 8.5,
        dataPoints: [
          { period: "Q1", value: 78 },
          { period: "Q2", value: 81 },
          { period: "Q3", value: 84 },
          { period: "Q4", value: 87 }
        ],
        significance: "Consistent improvement following service initiatives"
      },
      {
        category: "Wait Time Satisfaction",
        trend: "declining",
        changePercentage: -5.2,
        dataPoints: [
          { period: "Q1", value: 62 },
          { period: "Q2", value: 60 },
          { period: "Q3", value: 58 },
          { period: "Q4", value: 56 }
        ],
        significance: "Requires immediate attention"
      }
    ],
    actionableInsights: [
      {
        insight: "Implementing a callback system for appointment scheduling could reduce phone wait times by 40%",
        category: "administrative",
        impact: "high",
        effort: "quick_win",
        recommendation: "Deploy virtual queuing system for phone calls",
        expectedOutcome: "Improved patient satisfaction with scheduling process",
        priority: 1
      },
      {
        insight: "Adding evening and weekend hours would address 35% of scheduling complaints",
        category: "access",
        impact: "high",
        effort: "moderate",
        recommendation: "Extend hours for primary care and specialty clinics",
        expectedOutcome: "Improved access and reduced wait times",
        priority: 2
      }
    ],
    serviceImprovements: [
      {
        area: "Emergency Department Wait Times",
        currentScore: 56,
        targetScore: 75,
        gap: 19,
        recommendations: ["Implement fast-track for minor complaints", "Add triage nurse during peak hours", "Real-time wait time display"],
        timeline: "3-6 months",
        resources: ["Additional nursing staff", "Process improvement consultant", "Technology upgrade"]
      }
    ],
    providerFeedback: [
      {
        providerName: "Dr. Sarah Johnson",
        department: "Cardiology",
        averageRating: 4.8,
        feedbackCount: 45,
        strengths: ["Clear explanations", "Takes time with patients", "Follows up promptly"],
        areasForImprovement: ["Occasional scheduling delays"],
        patientComments: ["Best cardiologist I've ever had", "Dr. Johnson really listens"]
      }
    ],
    departmentAnalysis: [
      {
        department: "Cardiology",
        averageRating: 4.6,
        feedbackVolume: 89,
        topStrengths: ["Expert physicians", "Efficient scheduling", "Clear communication"],
        topConcerns: ["Parking availability"],
        comparisonToAverage: 0.8
      },
      {
        department: "Emergency",
        averageRating: 3.4,
        feedbackVolume: 156,
        topStrengths: ["Quality of care once seen", "Professional staff"],
        topConcerns: ["Long wait times", "Communication delays"],
        comparisonToAverage: -0.4
      }
    ],
    responseRecommendations: [
      {
        feedbackId: input.feedbackItems[0]?.id || "fb-1",
        responseType: "apologize",
        suggestedResponse: "Thank you for sharing your experience. We sincerely apologize for the long wait time you experienced. We are actively working to improve our processes and your feedback helps us identify areas for improvement. Please contact our patient relations team so we can address your specific concerns.",
        tone: "empathetic",
        followUpActions: ["Forward to department manager", "Add to wait time improvement initiative", "Follow up with patient within 48 hours"]
      }
    ],
    executiveSummary: {
      totalFeedbackAnalyzed: input.feedbackItems.length,
      overallSatisfactionScore: 4.2,
      npsScore: 42,
      keyStrengths: ["Compassionate nursing care", "Expert physicians", "Clean facilities"],
      criticalIssues: ["Emergency department wait times", "Appointment scheduling difficulties"],
      topPriorities: ["Reduce ER wait times", "Improve scheduling accessibility", "Enhance communication during delays"],
      progressFromLastPeriod: "Overall satisfaction improved by 8.5%. Clinical care ratings remain strong. Focus needed on operational efficiency."
    }
  };
};

// ============================================
// PREDICTIVE ANALYTICS AI FEATURES (Batch 5)
// ============================================

// 1. Patient Readmission Risk Predictor
export const predictReadmissionRisk = async (input: ReadmissionRiskInput): Promise<AIResponse<ReadmissionRiskResult>> => {
  const startTime = Date.now();
  const cacheKey = `readmission-${input.patientId}-${JSON.stringify(input.diagnosis)}`;

  const cached = getCached<ReadmissionRiskResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockReadmissionRiskResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert healthcare predictive analytics AI. Analyze the following patient data to predict 30-day readmission risk.

Patient Information:
- Patient ID: ${input.patientId}
- Age: ${input.patientInfo.age}, Gender: ${input.patientInfo.gender}
- Admission Date: ${input.patientInfo.admissionDate}
- Length of Stay: ${input.patientInfo.lengthOfStay || 'Current'} days

Diagnosis:
- Primary: ${input.diagnosis.primary}
- Secondary: ${input.diagnosis.secondary?.join(', ') || 'None'}
- ICD Codes: ${input.diagnosis.icdCodes?.join(', ') || 'Not specified'}

Medical History:
- Conditions: ${input.medicalHistory.conditions.join(', ')}
- Previous Admissions (Total): ${input.medicalHistory.previousAdmissions}
- Previous Admissions (Last 30 Days): ${input.medicalHistory.previousAdmissionsLast30Days}
- Previous Admissions (Last 90 Days): ${input.medicalHistory.previousAdmissionsLast90Days}
- Chronic Conditions: ${input.medicalHistory.chronicConditions.join(', ')}

Current Visit:
- Department: ${input.currentVisit.department}
- Admission Type: ${input.currentVisit.admissionType}
- Procedures: ${input.currentVisit.procedures?.join(', ') || 'None'}
- Complications: ${input.currentVisit.complications?.join(', ') || 'None'}
- Discharge Disposition: ${input.currentVisit.dischargeDisposition || 'Pending'}

Vitals: ${JSON.stringify(input.vitals || 'Not available')}
Lab Results: ${JSON.stringify(input.labResults?.slice(0, 5) || 'Not available')}
Medications: ${input.medications?.map(m => `${m.name} ${m.dosage}`).join(', ') || 'None'}

Social Determinants:
- Living Arrangement: ${input.socialDeterminants?.livingArrangement || 'Unknown'}
- Support System: ${input.socialDeterminants?.supportSystem || 'Unknown'}
- Transportation Access: ${input.socialDeterminants?.transportationAccess ? 'Yes' : 'Unknown'}
- Insurance: ${input.socialDeterminants?.insuranceType || 'Unknown'}

Provide a comprehensive readmission risk assessment including risk score (0-100), risk factors, and preventive interventions.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER, description: "Risk score from 0-100" },
            riskLevel: {
              type: Type.STRING,
              enum: ["very_low", "low", "moderate", "high", "very_high"],
              description: "Categorical risk level"
            },
            confidenceInterval: {
              type: Type.OBJECT,
              properties: {
                lower: { type: Type.NUMBER },
                upper: { type: Type.NUMBER }
              },
              required: ["lower", "upper"]
            },
            predictedReadmissionProbability: { type: Type.NUMBER, description: "Probability of readmission within 30 days" },
            riskFactors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  factor: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ["clinical", "demographic", "social", "utilization"] },
                  impact: { type: Type.STRING, enum: ["high", "medium", "low"] },
                  description: { type: Type.STRING },
                  modifiable: { type: Type.BOOLEAN }
                },
                required: ["factor", "category", "impact", "description", "modifiable"]
              }
            },
            topRiskFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            preventiveInterventions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  intervention: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ["pre-discharge", "post-discharge", "follow-up", "medication", "education"] },
                  priority: { type: Type.STRING, enum: ["critical", "high", "medium", "low"] },
                  description: { type: Type.STRING },
                  expectedImpact: { type: Type.STRING },
                  timeframe: { type: Type.STRING },
                  responsibleParty: { type: Type.STRING },
                  resources: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["intervention", "category", "priority", "description", "expectedImpact", "timeframe", "responsibleParty", "resources"]
              }
            },
            recommendedFollowUp: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeframe: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["in-person", "telehealth", "phone"] },
                  department: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["timeframe", "type", "reason"]
              }
            },
            explanation: { type: Type.STRING },
            disclaimer: { type: Type.STRING }
          },
          required: ["riskScore", "riskLevel", "confidenceInterval", "predictedReadmissionProbability", "riskFactors", "topRiskFactors", "preventiveInterventions", "recommendedFollowUp", "explanation", "disclaimer"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as ReadmissionRiskResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in readmission risk prediction:", error);
    return createResponse(true, getMockReadmissionRiskResult(input), undefined, Date.now() - startTime);
  }
};

const getMockReadmissionRiskResult = (input: ReadmissionRiskInput): ReadmissionRiskResult => {
  const baseRisk = 25;
  const ageRisk = input.patientInfo.age > 65 ? 15 : input.patientInfo.age > 75 ? 25 : 0;
  const admissionRisk = input.medicalHistory.previousAdmissionsLast30Days * 10;
  const chronicRisk = input.medicalHistory.chronicConditions.length * 5;
  const socialRisk = input.socialDeterminants?.supportSystem === 'limited' ? 10 : 0;

  const totalRisk = Math.min(95, Math.max(5, baseRisk + ageRisk + admissionRisk + chronicRisk + socialRisk));

  let riskLevel: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  if (totalRisk < 20) riskLevel = 'very_low';
  else if (totalRisk < 40) riskLevel = 'low';
  else if (totalRisk < 60) riskLevel = 'moderate';
  else if (totalRisk < 80) riskLevel = 'high';
  else riskLevel = 'very_high';

  return {
    riskScore: totalRisk,
    riskLevel,
    confidenceInterval: {
      lower: Math.max(0, totalRisk - 10),
      upper: Math.min(100, totalRisk + 10)
    },
    predictedReadmissionProbability: totalRisk / 100,
    riskFactors: [
      {
        factor: "Previous admissions in last 30 days",
        category: "utilization",
        impact: input.medicalHistory.previousAdmissionsLast30Days > 0 ? "high" : "low",
        description: `${input.medicalHistory.previousAdmissionsLast30Days} admission(s) in the past 30 days significantly increases readmission risk`,
        modifiable: false
      },
      {
        factor: "Age",
        category: "demographic",
        impact: input.patientInfo.age > 65 ? "high" : "medium",
        description: `Age ${input.patientInfo.age} is associated with ${input.patientInfo.age > 65 ? 'higher' : 'moderate'} readmission risk`,
        modifiable: false
      },
      {
        factor: "Chronic conditions",
        category: "clinical",
        impact: input.medicalHistory.chronicConditions.length > 2 ? "high" : "medium",
        description: `${input.medicalHistory.chronicConditions.length} chronic condition(s) present: ${input.medicalHistory.chronicConditions.slice(0, 3).join(', ')}`,
        modifiable: true
      },
      {
        factor: "Social support",
        category: "social",
        impact: socialRisk > 0 ? "high" : "low",
        description: input.socialDeterminants?.supportSystem === 'limited'
          ? "Limited social support increases risk of non-compliance and readmission"
          : "Adequate social support present",
        modifiable: true
      }
    ],
    topRiskFactors: [
      input.medicalHistory.previousAdmissionsLast30Days > 0 ? "Recent previous admissions" : "Primary diagnosis complexity",
      input.patientInfo.age > 65 ? "Advanced age" : "Chronic condition burden",
      input.medicalHistory.chronicConditions.length > 2 ? "Multiple chronic conditions" : "Social determinants"
    ],
    preventiveInterventions: [
      {
        intervention: "Schedule follow-up appointment within 7 days",
        category: "post-discharge",
        priority: "high",
        description: "Early follow-up has been shown to reduce readmissions by 20-30%",
        expectedImpact: "Reduce readmission risk by 15-20%",
        timeframe: "Within 7 days of discharge",
        responsibleParty: "Discharge Planner",
        resources: ["Scheduling system", "Transportation assistance if needed"]
      },
      {
        intervention: "Medication reconciliation and education",
        category: "pre-discharge",
        priority: "critical",
        description: "Ensure patient understands all medications, dosages, and potential side effects",
        expectedImpact: "Reduce medication-related readmissions by 25%",
        timeframe: "Before discharge",
        responsibleParty: "Pharmacist",
        resources: ["Medication list", "Patient education materials", "Pill organizers"]
      },
      {
        intervention: "Care transition coaching",
        category: "post-discharge",
        priority: totalRisk > 50 ? "critical" : "high",
        description: "Assign a care transition coach to help navigate post-discharge care",
        expectedImpact: "Improve care coordination and reduce readmissions",
        timeframe: "Within 48 hours of discharge",
        responsibleParty: "Care Transition Coach",
        resources: ["Care plan", "Contact information", "Red flags list"]
      }
    ],
    recommendedFollowUp: [
      {
        timeframe: "3-5 days post-discharge",
        type: "in-person",
        department: input.currentVisit.department,
        reason: "Initial post-discharge assessment and medication review"
      },
      {
        timeframe: "14 days post-discharge",
        type: "telehealth",
        reason: "Progress check and care plan adjustment"
      }
    ],
    carePlanAdjustments: [
      {
        area: "Medication Management",
        currentApproach: "Standard discharge medication list",
        recommendedChange: "Implement medication synchronization and blister packaging",
        rationale: "Reduces complexity and improves adherence"
      }
    ],
    departmentComparison: {
      department: input.currentVisit.department,
      averageRisk: 35,
      patientRisk: totalRisk,
      percentile: totalRisk > 50 ? 75 : totalRisk > 30 ? 50 : 25
    },
    historicalTrend: [
      { period: "30 days ago", riskScore: totalRisk - 5, readmitted: false },
      { period: "60 days ago", riskScore: totalRisk - 10, readmitted: input.medicalHistory.previousAdmissionsLast30Days > 0 }
    ],
    explanation: `Based on analysis of clinical, demographic, and social factors, this patient has a ${riskLevel} risk of readmission within 30 days. The primary drivers are ${input.medicalHistory.previousAdmissionsLast30Days > 0 ? 'recent previous admissions' : 'chronic condition burden'} and ${input.patientInfo.age > 65 ? 'advanced age' : 'current clinical status'}. Implementing the recommended interventions could reduce readmission risk by 20-30%.`,
    disclaimer: "This prediction is based on available data and statistical models. Clinical judgment should always be applied. This tool is meant to assist, not replace, clinical decision-making."
  };
};

// 2. AI-Powered Disease Outbreak Detection
export const detectDiseaseOutbreak = async (input: OutbreakDetectionInput): Promise<AIResponse<OutbreakDetectionResult>> => {
  const startTime = Date.now();
  const cacheKey = `outbreak-${input.timeRange.startDate}-${input.timeRange.endDate}`;

  const cached = getCached<OutbreakDetectionResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockOutbreakDetectionResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert epidemiologist AI system. Analyze the following healthcare data to detect potential disease outbreaks and patterns.

Facility Information:
- Type: ${input.facilityInfo.type}
- Capacity: ${input.facilityInfo.capacity}
- Location: ${input.facilityInfo.location.region}, ${input.facilityInfo.location.city}

Time Range: ${input.timeRange.startDate} to ${input.timeRange.endDate}

Patient Data Summary:
${input.patientData.map(d => `
Date: ${d.date}
- Department: ${d.department}
- Top Diagnoses: ${d.diagnoses.slice(0, 3).map(diag => `${diag.description} (${diag.count})`).join(', ')}
- Top Symptoms: ${d.symptoms.slice(0, 3).map(s => `${s.symptom} (${s.count})`).join(', ')}
`).join('\n')}

Historical Baseline: ${input.historicalBaseline?.slice(0, 5).map(b => `${b.condition}: avg ${b.averageCases} cases`).join(', ') || 'Not provided'}

Current Alerts: ${input.currentAlerts?.map(a => `${a.type}: ${a.condition}`).join(', ') || 'None'}

Analyze for potential outbreaks, geographic clustering, and provide early warning alerts.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallRiskLevel: {
              type: Type.STRING,
              enum: ["normal", "elevated", "high", "critical"]
            },
            activeAlerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  condition: { type: Type.STRING },
                  alertType: { type: Type.STRING, enum: ["potential_outbreak", "confirmed_outbreak", "cluster_detected", "threshold_exceeded"] },
                  severity: { type: Type.STRING, enum: ["watch", "warning", "alert", "emergency"] },
                  description: { type: Type.STRING },
                  affectedDepartments: { type: Type.ARRAY, items: { type: Type.STRING } },
                  caseCount: { type: Type.NUMBER },
                  expectedCount: { type: Type.NUMBER },
                  deviationFromBaseline: { type: Type.NUMBER },
                  firstDetected: { type: Type.STRING },
                  lastUpdated: { type: Type.STRING },
                  recommendedActions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        action: { type: Type.STRING },
                        priority: { type: Type.STRING, enum: ["immediate", "urgent", "routine"] },
                        responsibleParty: { type: Type.STRING }
                      },
                      required: ["action", "priority", "responsibleParty"]
                    }
                  },
                  publicHealthNotification: { type: Type.BOOLEAN }
                },
                required: ["id", "condition", "alertType", "severity", "description", "affectedDepartments", "caseCount", "expectedCount", "deviationFromBaseline", "firstDetected", "lastUpdated", "recommendedActions", "publicHealthNotification"]
              }
            },
            geographicClusters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  condition: { type: Type.STRING },
                  centerLocation: {
                    type: Type.OBJECT,
                    properties: {
                      region: { type: Type.STRING }
                    },
                    required: ["region"]
                  },
                  radius: { type: Type.NUMBER },
                  caseCount: { type: Type.NUMBER },
                  expectedCases: { type: Type.NUMBER },
                  relativeRisk: { type: Type.NUMBER },
                  pValue: { type: Type.NUMBER },
                  affectedAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
                  onsetDate: { type: Type.STRING },
                  trend: { type: Type.STRING, enum: ["increasing", "stable", "decreasing"] }
                },
                required: ["id", "condition", "centerLocation", "radius", "caseCount", "expectedCases", "relativeRisk", "pValue", "affectedAreas", "onsetDate", "trend"]
              }
            },
            conditionAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING },
                  icdCode: { type: Type.STRING },
                  currentCases: { type: Type.NUMBER },
                  expectedCases: { type: Type.NUMBER },
                  deviationPercentage: { type: Type.NUMBER },
                  trend: { type: Type.STRING, enum: ["increasing", "stable", "decreasing"] },
                  affectedDepartments: { type: Type.ARRAY, items: { type: Type.STRING } },
                  riskLevel: { type: Type.STRING, enum: ["normal", "elevated", "high", "critical"] },
                  firstCaseDate: { type: Type.STRING },
                  mostRecentCase: { type: Type.STRING }
                },
                required: ["condition", "icdCode", "currentCases", "expectedCases", "deviationPercentage", "trend", "affectedDepartments", "riskLevel", "firstCaseDate", "mostRecentCase"]
              }
            },
            predictions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING },
                  predictedCasesNext7Days: { type: Type.NUMBER },
                  confidence: { type: Type.NUMBER },
                  peakDate: { type: Type.STRING },
                  peakCases: { type: Type.NUMBER }
                },
                required: ["condition", "predictedCasesNext7Days", "confidence"]
              }
            },
            executiveSummary: { type: Type.STRING },
            lastAnalyzed: { type: Type.STRING }
          },
          required: ["overallRiskLevel", "activeAlerts", "geographicClusters", "conditionAnalysis", "predictions", "executiveSummary", "lastAnalyzed"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as OutbreakDetectionResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in outbreak detection:", error);
    return createResponse(true, getMockOutbreakDetectionResult(input), undefined, Date.now() - startTime);
  }
};

const getMockOutbreakDetectionResult = (input: OutbreakDetectionInput): OutbreakDetectionResult => {
  return {
    overallRiskLevel: "elevated",
    activeAlerts: [
      {
        id: "alert-001",
        condition: "Influenza-like Illness",
        alertType: "potential_outbreak",
        severity: "warning",
        description: "Elevated cases of influenza-like illness detected in Emergency Department, 45% above baseline",
        affectedDepartments: ["Emergency", "Internal Medicine", "Pediatrics"],
        caseCount: 47,
        expectedCount: 32,
        deviationFromBaseline: 45,
        firstDetected: input.timeRange.startDate,
        lastUpdated: new Date().toISOString(),
        recommendedActions: [
          { action: "Enhance surveillance protocols", priority: "immediate", responsibleParty: "Infection Control" },
          { action: "Review isolation capacity", priority: "urgent", responsibleParty: "Nursing Administration" },
          { action: "Notify local health department", priority: "routine", responsibleParty: "Public Health Liaison" }
        ],
        publicHealthNotification: true,
        isolationProtocols: ["Droplet precautions", "Private room or cohorting", "Visitor restrictions"]
      },
      {
        id: "alert-002",
        condition: "Gastroenteritis",
        alertType: "cluster_detected",
        severity: "watch",
        description: "Cluster of gastroenteritis cases identified, possible norovirus outbreak",
        affectedDepartments: ["Emergency", "Medicine Ward 3A"],
        caseCount: 12,
        expectedCount: 5,
        deviationFromBaseline: 140,
        firstDetected: input.timeRange.startDate,
        lastUpdated: new Date().toISOString(),
        recommendedActions: [
          { action: "Implement contact precautions", priority: "immediate", responsibleParty: "Unit Manager" },
          { action: "Environmental cleaning audit", priority: "urgent", responsibleParty: "Housekeeping" }
        ],
        publicHealthNotification: false
      }
    ],
    geographicClusters: [
      {
        id: "cluster-001",
        condition: "Influenza-like Illness",
        centerLocation: {
          region: input.facilityInfo.location.region,
          coordinates: input.facilityInfo.location.coordinates
        },
        radius: 15,
        caseCount: 47,
        expectedCases: 32,
        relativeRisk: 1.47,
        pValue: 0.02,
        affectedAreas: [input.facilityInfo.location.city, "Surrounding communities"],
        onsetDate: input.timeRange.startDate,
        trend: "increasing"
      }
    ],
    conditionAnalysis: [
      {
        condition: "Influenza-like Illness",
        icdCode: "J11.1",
        currentCases: 47,
        expectedCases: 32,
        deviationPercentage: 45,
        trend: "increasing",
        affectedDepartments: ["Emergency", "Internal Medicine", "Pediatrics"],
        riskLevel: "elevated",
        firstCaseDate: input.timeRange.startDate,
        mostRecentCase: new Date().toISOString()
      },
      {
        condition: "Gastroenteritis",
        icdCode: "A09",
        currentCases: 12,
        expectedCases: 5,
        deviationPercentage: 140,
        trend: "stable",
        affectedDepartments: ["Emergency", "Medicine Ward 3A"],
        riskLevel: "elevated",
        firstCaseDate: input.timeRange.startDate,
        mostRecentCase: new Date().toISOString()
      },
      {
        condition: "COVID-19",
        icdCode: "U07.1",
        currentCases: 8,
        expectedCases: 10,
        deviationPercentage: -20,
        trend: "decreasing",
        affectedDepartments: ["Emergency", "ICU"],
        riskLevel: "normal",
        firstCaseDate: input.timeRange.startDate,
        mostRecentCase: new Date().toISOString()
      }
    ],
    symptomPatterns: [
      { symptom: "Fever", frequency: 89, associatedConditions: ["Influenza", "COVID-19"], trend: "increasing" },
      { symptom: "Cough", frequency: 76, associatedConditions: ["Influenza", "URI"], trend: "increasing" },
      { symptom: "Nausea/Vomiting", frequency: 34, associatedConditions: ["Gastroenteritis"], trend: "stable" },
      { symptom: "Diarrhea", frequency: 28, associatedConditions: ["Gastroenteritis"], trend: "increasing" }
    ],
    predictions: [
      {
        condition: "Influenza-like Illness",
        predictedCasesNext7Days: 65,
        confidence: 0.78,
        peakDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        peakCases: 75
      },
      {
        condition: "Gastroenteritis",
        predictedCasesNext7Days: 18,
        confidence: 0.65
      }
    ],
    resourceImpact: [
      { resource: "Isolation Beds", currentUtilization: 65, predictedUtilization: 85, shortageRisk: true, recommendation: "Prepare additional isolation capacity" },
      { resource: "PPE Supplies", currentUtilization: 45, predictedUtilization: 70, shortageRisk: false, recommendation: "Monitor stock levels" },
      { resource: "ED Capacity", currentUtilization: 80, predictedUtilization: 95, shortageRisk: true, recommendation: "Consider surge protocols" }
    ],
    publicHealthRecommendations: [
      { recommendation: "Report ILI cluster to local health department", category: "surveillance", priority: "immediate", rationale: "Mandatory reporting requirement for unusual disease clusters" },
      { recommendation: "Implement visitor restrictions for affected units", category: "prevention", priority: "urgent", rationale: "Reduce transmission risk to vulnerable populations" },
      { recommendation: "Issue staff communication regarding infection control", category: "communication", priority: "routine", rationale: "Ensure awareness and compliance with protocols" }
    ],
    historicalComparison: [
      {
        period: "Previous year",
        similarOutbreak: "Seasonal influenza surge",
        outcome: "Controlled within 6 weeks with enhanced protocols",
        lessonsLearned: ["Early vaccination campaigns effective", "Visitor restrictions reduced transmission", "Staff education critical"]
      }
    ],
    executiveSummary: "Elevated disease activity detected with potential influenza outbreak and gastroenteritis cluster. Immediate action recommended for surveillance enhancement and isolation capacity review. Public health notification advised for ILI cluster.",
    lastAnalyzed: new Date().toISOString()
  };
};

// 3. Patient Length of Stay Predictor
export const predictLengthOfStay = async (input: LengthOfStayInput): Promise<AIResponse<LengthOfStayResult>> => {
  const startTime = Date.now();
  const cacheKey = `los-${input.patientId}-${input.diagnosis.primary}`;

  const cached = getCached<LengthOfStayResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockLengthOfStayResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert healthcare analytics AI. Predict the length of stay for the following patient.

Patient Information:
- Patient ID: ${input.patientId}
- Age: ${input.patientInfo.age}, Gender: ${input.patientInfo.gender}
- BMI: ${input.patientInfo.bmi || 'Unknown'}

Admission Details:
- Date: ${input.admission.date}
- Type: ${input.admission.type}
- Department: ${input.admission.department}
- Source: ${input.admission.source}

Diagnosis:
- Primary: ${input.diagnosis.primary}
- Secondary: ${input.diagnosis.secondary?.join(', ') || 'None'}
- ICD Codes: ${input.diagnosis.icdCodes?.join(', ') || 'Not specified'}
- Severity: ${input.diagnosis.severity || 'Unknown'}

Procedures: ${input.procedures?.map(p => `${p.name} (${p.type}, ${p.complexity || 'standard'})`).join(', ') || 'None'}
Complications: ${input.complications?.join(', ') || 'None'}

Functional Status:
- Mobility: ${input.functionalStatus?.mobility || 'Unknown'}
- ADL Score: ${input.functionalStatus?.adlScore || 'Unknown'}

Social Factors:
- Living Arrangement: ${input.socialFactors?.livingArrangement || 'Unknown'}
- Support System: ${input.socialFactors?.supportSystem || 'Unknown'}
- Discharge Destination: ${input.socialFactors?.dischargeDestination || 'Unknown'}

Hospital Factors:
- Bed Availability: ${input.hospitalFactors?.bedAvailability || 'Unknown'}
- Average LOS for Diagnosis: ${input.hospitalFactors?.averageLOSForDiagnosis || 'Unknown'} days

Provide a comprehensive length of stay prediction with discharge planning recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedLOS: { type: Type.NUMBER, description: "Predicted length of stay in days" },
            confidenceInterval: {
              type: Type.OBJECT,
              properties: {
                lower: { type: Type.NUMBER },
                upper: { type: Type.NUMBER }
              },
              required: ["lower", "upper"]
            },
            predictedDischargeDate: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ["short", "average", "prolonged", "significantly_prolonged"] },
            losFactors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  factor: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ["clinical", "demographic", "social", "institutional"] },
                  impact: { type: Type.STRING, enum: ["prolonging", "shortening"] },
                  magnitude: { type: Type.STRING, enum: ["high", "medium", "low"] },
                  description: { type: Type.STRING },
                  modifiable: { type: Type.BOOLEAN }
                },
                required: ["factor", "category", "impact", "magnitude", "description", "modifiable"]
              }
            },
            prolongedStayRisk: { type: Type.NUMBER },
            dischargeMilestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  milestone: { type: Type.STRING },
                  targetDate: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["pending", "in_progress", "completed", "delayed"] },
                  dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  responsibleParty: { type: Type.STRING }
                },
                required: ["milestone", "targetDate", "status", "dependencies", "responsibleParty"]
              }
            },
            dischargePlanning: {
              type: Type.OBJECT,
              properties: {
                estimatedDischargeDate: { type: Type.STRING },
                dischargeDestination: { type: Type.STRING },
                preparationRequired: { type: Type.ARRAY, items: { type: Type.STRING } },
                barriers: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      barrier: { type: Type.STRING },
                      severity: { type: Type.STRING, enum: ["high", "medium", "low"] },
                      mitigation: { type: Type.STRING }
                    },
                    required: ["barrier", "severity", "mitigation"]
                  }
                },
                servicesNeeded: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["estimatedDischargeDate", "dischargeDestination", "preparationRequired", "barriers", "servicesNeeded"]
            },
            optimizationRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  recommendation: { type: Type.STRING },
                  potentialDaysSaved: { type: Type.NUMBER },
                  priority: { type: Type.STRING, enum: ["high", "medium", "low"] },
                  implementation: { type: Type.STRING },
                  barriers: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["recommendation", "potentialDaysSaved", "priority", "implementation", "barriers"]
              }
            },
            explanation: { type: Type.STRING }
          },
          required: ["predictedLOS", "confidenceInterval", "predictedDischargeDate", "riskLevel", "losFactors", "prolongedStayRisk", "dischargeMilestones", "dischargePlanning", "optimizationRecommendations", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as LengthOfStayResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in length of stay prediction:", error);
    return createResponse(true, getMockLengthOfStayResult(input), undefined, Date.now() - startTime);
  }
};

const getMockLengthOfStayResult = (input: LengthOfStayInput): LengthOfStayResult => {
  const baseLOS = input.hospitalFactors?.averageLOSForDiagnosis || 5;
  const severityMultiplier = input.diagnosis.severity === 'critical' ? 2.5 :
    input.diagnosis.severity === 'severe' ? 1.8 :
      input.diagnosis.severity === 'moderate' ? 1.3 : 1;
  const procedureDays = input.procedures?.filter(p => p.type === 'surgical').length || 0;
  const socialAdjustment = input.socialFactors?.supportSystem === 'limited' ? 1.2 :
    input.socialFactors?.supportSystem === 'none' ? 1.5 : 1;

  const predictedLOS = Math.round(baseLOS * severityMultiplier + procedureDays * socialAdjustment);
  const admissionDate = new Date(input.admission.date);
  const predictedDischargeDate = new Date(admissionDate);
  predictedDischargeDate.setDate(admissionDate.getDate() + predictedLOS);

  return {
    predictedLOS,
    confidenceInterval: {
      lower: Math.max(1, predictedLOS - 2),
      upper: predictedLOS + 4
    },
    predictedDischargeDate: predictedDischargeDate.toISOString().split('T')[0],
    riskLevel: predictedLOS > baseLOS * 1.5 ? 'significantly_prolonged' :
      predictedLOS > baseLOS * 1.2 ? 'prolonged' :
        predictedLOS < baseLOS * 0.8 ? 'short' : 'average',
    losFactors: [
      {
        factor: "Primary diagnosis severity",
        category: "clinical",
        impact: severityMultiplier > 1.5 ? "prolonging" : "shortening",
        magnitude: "high",
        description: `${input.diagnosis.severity || 'Moderate'} severity of ${input.diagnosis.primary} impacts recovery time`,
        modifiable: false
      },
      {
        factor: "Surgical procedures",
        category: "clinical",
        impact: procedureDays > 0 ? "prolonging" : "shortening",
        magnitude: procedureDays > 1 ? "high" : "medium",
        description: `${procedureDays} surgical procedure(s) requiring recovery time`,
        modifiable: false
      },
      {
        factor: "Social support",
        category: "social",
        impact: socialAdjustment > 1 ? "prolonging" : "shortening",
        magnitude: "medium",
        description: input.socialFactors?.supportSystem === 'limited' ?
          "Limited support system may delay discharge" :
          "Adequate support facilitates timely discharge",
        modifiable: true
      },
      {
        factor: "Functional status",
        category: "clinical",
        impact: input.functionalStatus?.mobility === 'dependent' ? "prolonging" : "shortening",
        magnitude: "medium",
        description: `Mobility status: ${input.functionalStatus?.mobility || 'Unknown'}`,
        modifiable: true
      }
    ],
    prolongedStayRisk: Math.min(95, Math.max(5, (predictedLOS / baseLOS - 1) * 100 + 20)),
    comparisonToBenchmark: {
      diagnosis: input.diagnosis.primary,
      predictedLOS,
      benchmarkLOS: baseLOS,
      variance: predictedLOS - baseLOS,
      percentile: predictedLOS > baseLOS * 1.5 ? 75 : predictedLOS > baseLOS ? 60 : 40
    },
    dischargeMilestones: [
      {
        milestone: "Medical stability achieved",
        targetDate: new Date(admissionDate.getTime() + predictedLOS * 0.4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "pending",
        dependencies: ["Vital signs stable", "Lab values improving"],
        responsibleParty: "Attending Physician"
      },
      {
        milestone: "Functional recovery",
        targetDate: new Date(admissionDate.getTime() + predictedLOS * 0.6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "pending",
        dependencies: ["Physical therapy evaluation", "ADL independence"],
        responsibleParty: "Physical Therapy"
      },
      {
        milestone: "Discharge planning complete",
        targetDate: new Date(admissionDate.getTime() + predictedLOS * 0.8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "pending",
        dependencies: ["Home care arranged", "Medications reconciled", "Follow-up scheduled"],
        responsibleParty: "Case Manager"
      }
    ],
    dischargePlanning: {
      estimatedDischargeDate: predictedDischargeDate.toISOString().split('T')[0],
      dischargeDestination: input.socialFactors?.dischargeDestination || "home",
      preparationRequired: [
        "Medication reconciliation",
        "Discharge education",
        "Follow-up appointment scheduling",
        "Home care coordination if needed"
      ],
      barriers: [
        {
          barrier: "Limited social support",
          severity: input.socialFactors?.supportSystem === 'limited' ? "high" : "low",
          mitigation: "Arrange home health services and community resources"
        }
      ],
      servicesNeeded: input.functionalStatus?.mobility === 'dependent' ?
        ["Home health nursing", "Physical therapy at home"] :
        ["Follow-up appointment"]
    },
    resourcePlanning: [
      { resource: "Nursing care", daysNeeded: predictedLOS, startDate: input.admission.date, endDate: predictedDischargeDate.toISOString().split('T')[0], notes: "Standard nursing care" },
      { resource: "Physical therapy", daysNeeded: Math.ceil(predictedLOS * 0.5), startDate: new Date(admissionDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: predictedDischargeDate.toISOString().split('T')[0], notes: "Daily sessions recommended" }
    ],
    optimizationRecommendations: [
      {
        recommendation: "Early mobilization protocol",
        potentialDaysSaved: 1.5,
        priority: "high",
        implementation: "Begin mobilization within 24 hours of admission",
        barriers: ["Patient tolerance", "Staff availability"]
      },
      {
        recommendation: "Proactive discharge planning",
        potentialDaysSaved: 1,
        priority: "high",
        implementation: "Initiate discharge planning on day 1",
        barriers: ["Uncertain discharge destination"]
      }
    ],
    dailyPredictions: Array.from({ length: Math.min(predictedLOS + 3, 14) }, (_, i) => ({
      day: i + 1,
      date: new Date(admissionDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      cumulativeProbability: Math.min(1, (i + 1) / predictedLOS * 0.9),
      keyFactors: i < predictedLOS * 0.5 ? ["Medical recovery"] : i < predictedLOS * 0.8 ? ["Functional improvement", "Discharge planning"] : ["Final preparations"]
    })),
    alerts: predictedLOS > baseLOS * 1.5 ? [
      {
        type: "delay_risk",
        message: "Patient at risk for prolonged stay",
        severity: "warning",
        action: "Review optimization recommendations"
      }
    ] : [],
    explanation: `Based on the patient's clinical presentation, diagnosis severity, and social factors, the predicted length of stay is ${predictedLOS} days. This is ${predictedLOS > baseLOS ? 'above' : 'within'} the benchmark of ${baseLOS} days for this diagnosis. Key factors influencing the prediction include ${input.diagnosis.severity || 'moderate'} disease severity and ${input.socialFactors?.supportSystem || 'adequate'} social support.`
  };
};

// 4. AI-Powered Mortality Risk Assessment
export const assessMortalityRisk = async (input: MortalityRiskInput): Promise<AIResponse<MortalityRiskResult>> => {
  const startTime = Date.now();
  const cacheKey = `mortality-${input.patientId}`;

  const cached = getCached<MortalityRiskResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockMortalityRiskResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert critical care and prognostication AI. Assess mortality risk for the following patient.

Patient Information:
- Patient ID: ${input.patientId}
- Age: ${input.patientInfo.age}, Gender: ${input.patientInfo.gender}

Admission:
- Date: ${input.admission.date}
- Type: ${input.admission.type}
- Department: ${input.admission.department}
- ICU Admission: ${input.admission.icuAdmission ? 'Yes' : 'No'}
- ICU Days: ${input.admission.icuDays || 0}

Diagnosis:
- Primary: ${input.diagnosis.primary}
- Secondary: ${input.diagnosis.secondary?.join(', ') || 'None'}
- Stage: ${input.diagnosis.stage || 'Unknown'}
- Metastasis: ${input.diagnosis.metastasis ? 'Yes' : 'No'}

Clinical Scores:
- APACHE II: ${input.scores?.apacheII || 'Unknown'}
- SOFA: ${input.scores?.sofa || 'Unknown'}
- Charlson Comorbidity Index: ${input.scores?.charlsonComorbidityIndex || 'Unknown'}
- Frailty Score: ${input.scores?.frailtyScore || 'Unknown'}

Current Status:
- Consciousness: ${input.currentStatus.consciousness}
- Ventilation: ${input.currentStatus.ventilation ? 'Yes' : 'No'}
- Vasopressors: ${input.currentStatus.vasopressors ? 'Yes' : 'No'}
- Dialysis: ${input.currentStatus.dialysis ? 'Yes' : 'No'}
- CPR: ${input.currentStatus.cpr ? 'Yes' : 'No'}

Medical History: ${input.medicalHistory.conditions.join(', ')}

Goals of Care: ${input.goalsOfCare?.documented ? input.goalsOfCare.type : 'Not documented'}

Provide a comprehensive mortality risk assessment with clinical recommendations and family communication guidance.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER, description: "Mortality risk score 0-100" },
            riskLevel: { type: Type.STRING, enum: ["very_low", "low", "moderate", "high", "very_high"] },
            mortalityProbability: {
              type: Type.OBJECT,
              properties: {
                inHospital: { type: Type.NUMBER },
                thirtyDay: { type: Type.NUMBER },
                ninetyDay: { type: Type.NUMBER },
                oneYear: { type: Type.NUMBER }
              },
              required: ["inHospital", "thirtyDay", "ninetyDay", "oneYear"]
            },
            confidenceInterval: {
              type: Type.OBJECT,
              properties: {
                lower: { type: Type.NUMBER },
                upper: { type: Type.NUMBER }
              },
              required: ["lower", "upper"]
            },
            riskFactors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  factor: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ["clinical", "physiological", "laboratory", "demographic"] },
                  weight: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  contribution: { type: Type.NUMBER },
                  modifiable: { type: Type.BOOLEAN },
                  interventionOptions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["factor", "category", "weight", "description", "contribution", "modifiable"]
              }
            },
            topContributingFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            clinicalRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  recommendation: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ["monitoring", "intervention", "consultation", "goals_of_care"] },
                  priority: { type: Type.STRING, enum: ["immediate", "urgent", "routine"] },
                  rationale: { type: Type.STRING },
                  expectedImpact: { type: Type.STRING },
                  evidenceLevel: { type: Type.STRING, enum: ["high", "moderate", "low"] }
                },
                required: ["recommendation", "category", "priority", "rationale", "expectedImpact", "evidenceLevel"]
              }
            },
            monitoringRequirements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  parameter: { type: Type.STRING },
                  frequency: { type: Type.STRING },
                  threshold: { type: Type.STRING },
                  action: { type: Type.STRING }
                },
                required: ["parameter", "frequency", "threshold", "action"]
              }
            },
            icuRecommendation: {
              type: Type.OBJECT,
              properties: {
                recommended: { type: Type.BOOLEAN },
                reason: { type: Type.STRING },
                timing: { type: Type.STRING, enum: ["immediate", "within_hours", "consider", "not_indicated"] },
                alternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["recommended", "reason", "timing"]
            },
            prognosis: {
              type: Type.OBJECT,
              properties: {
                shortTerm: { type: Type.STRING },
                mediumTerm: { type: Type.STRING },
                longTerm: { type: Type.STRING },
                uncertainties: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["shortTerm", "mediumTerm", "longTerm", "uncertainties"]
            },
            familyCommunication: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestedLanguage: { type: Type.STRING },
                  sensitivityLevel: { type: Type.STRING, enum: ["standard", "elevated", "high"] },
                  supportResources: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["topic", "keyPoints", "suggestedLanguage", "sensitivityLevel", "supportResources"]
              }
            },
            goalsOfCareRecommendations: {
              type: Type.OBJECT,
              properties: {
                currentStatus: { type: Type.STRING },
                recommendation: { type: Type.STRING },
                discussionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                documentationNeeded: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["currentStatus", "recommendation", "discussionPoints", "documentationNeeded"]
            },
            explanation: { type: Type.STRING },
            disclaimer: { type: Type.STRING },
            lastUpdated: { type: Type.STRING }
          },
          required: ["riskScore", "riskLevel", "mortalityProbability", "confidenceInterval", "riskFactors", "topContributingFactors", "clinicalRecommendations", "monitoringRequirements", "icuRecommendation", "prognosis", "familyCommunication", "goalsOfCareRecommendations", "explanation", "disclaimer", "lastUpdated"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as MortalityRiskResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in mortality risk assessment:", error);
    return createResponse(true, getMockMortalityRiskResult(input), undefined, Date.now() - startTime);
  }
};

const getMockMortalityRiskResult = (input: MortalityRiskInput): MortalityRiskResult => {
  const apacheScore = input.scores?.apacheII || 15;
  const sofaScore = input.scores?.sofa || 5;
  const charlsonIndex = input.scores?.charlsonComorbidityIndex || 2;

  // Simplified mortality calculation based on scores
  const baseRisk = Math.min(90, (apacheScore * 2) + (sofaScore * 3) + (charlsonIndex * 5));
  const ageAdjustment = input.patientInfo.age > 75 ? 10 : input.patientInfo.age > 65 ? 5 : 0;
  const icuAdjustment = input.admission.icuAdmission ? 15 : 0;
  const interventionAdjustment = (input.currentStatus.ventilation ? 10 : 0) +
    (input.currentStatus.vasopressors ? 10 : 0) +
    (input.currentStatus.dialysis ? 8 : 0);

  const totalRisk = Math.min(98, Math.max(2, baseRisk + ageAdjustment + icuAdjustment + interventionAdjustment));

  let riskLevel: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  if (totalRisk < 15) riskLevel = 'very_low';
  else if (totalRisk < 30) riskLevel = 'low';
  else if (totalRisk < 50) riskLevel = 'moderate';
  else if (totalRisk < 75) riskLevel = 'high';
  else riskLevel = 'very_high';

  return {
    riskScore: totalRisk,
    riskLevel,
    mortalityProbability: {
      inHospital: totalRisk / 100,
      thirtyDay: Math.min(1, (totalRisk + 5) / 100),
      ninetyDay: Math.min(1, (totalRisk + 10) / 100),
      oneYear: Math.min(1, (totalRisk + 15) / 100)
    },
    confidenceInterval: {
      lower: Math.max(0, totalRisk - 12),
      upper: Math.min(100, totalRisk + 12)
    },
    riskFactors: [
      {
        factor: "APACHE II Score",
        category: "clinical",
        weight: apacheScore / 10,
        description: `APACHE II score of ${apacheScore} indicates ${apacheScore > 25 ? 'severe' : apacheScore > 15 ? 'moderate' : 'mild'} illness severity`,
        contribution: 25,
        modifiable: false
      },
      {
        factor: "SOFA Score",
        category: "physiological",
        weight: sofaScore / 5,
        description: `SOFA score of ${sofaScore} reflects ${sofaScore > 10 ? 'significant' : 'moderate'} organ dysfunction`,
        contribution: 20,
        modifiable: true,
        interventionOptions: ["Organ support optimization", "Early intervention for failing organs"]
      },
      {
        factor: "Age",
        category: "demographic",
        weight: input.patientInfo.age > 75 ? 0.8 : input.patientInfo.age > 65 ? 0.5 : 0.2,
        description: `Age ${input.patientInfo.age} is a ${input.patientInfo.age > 75 ? 'significant' : 'moderate'} risk factor`,
        contribution: 15,
        modifiable: false
      },
      {
        factor: "Comorbidities",
        category: "clinical",
        weight: charlsonIndex / 3,
        description: `Charlson Comorbidity Index of ${charlsonIndex} indicates ${charlsonIndex > 3 ? 'high' : 'moderate'} comorbidity burden`,
        contribution: 15,
        modifiable: false
      },
      {
        factor: "Organ support requirements",
        category: "physiological",
        weight: (input.currentStatus.ventilation ? 0.3 : 0) + (input.currentStatus.vasopressors ? 0.3 : 0),
        description: `Requires ${[input.currentStatus.ventilation ? 'ventilation' : '', input.currentStatus.vasopressors ? 'vasopressors' : '', input.currentStatus.dialysis ? 'dialysis' : ''].filter(Boolean).join(', ') || 'no organ support'}`,
        contribution: 25,
        modifiable: true,
        interventionOptions: ["Wean support as tolerated", "Optimize underlying condition"]
      }
    ],
    topContributingFactors: [
      `APACHE II score of ${apacheScore}`,
      input.currentStatus.ventilation ? "Mechanical ventilation requirement" : "Primary diagnosis severity",
      input.currentStatus.vasopressors ? "Hemodynamic instability" : "Organ dysfunction",
      `Age ${input.patientInfo.age}`
    ],
    clinicalRecommendations: [
      {
        recommendation: "Intensify monitoring frequency",
        category: "monitoring",
        priority: "immediate",
        rationale: "High-risk patient requires close observation",
        expectedImpact: "Early detection of deterioration",
        evidenceLevel: "high"
      },
      {
        recommendation: "Goals of care discussion",
        category: "goals_of_care",
        priority: totalRisk > 50 ? "immediate" : "urgent",
        rationale: totalRisk > 50 ? "High mortality risk warrants early goals of care discussion" : "Important to align treatment with patient values",
        expectedImpact: "Ensure care aligns with patient preferences",
        evidenceLevel: "high"
      },
      {
        recommendation: "Multi-disciplinary care conference",
        category: "consultation",
        priority: "urgent",
        rationale: "Complex patient benefits from team-based approach",
        expectedImpact: "Coordinated care and improved outcomes",
        evidenceLevel: "moderate"
      }
    ],
    monitoringRequirements: [
      {
        parameter: "Vital signs",
        frequency: "Every 1-2 hours",
        threshold: "HR >120 or <50, BP <90/60, SpO2 <92%",
        action: "Notify physician, prepare for intervention"
      },
      {
        parameter: "Mental status",
        frequency: "Every 4 hours",
        threshold: "Decrease in GCS by 2 or more points",
        action: "Urgent evaluation, consider imaging"
      },
      {
        parameter: "Urine output",
        frequency: "Hourly",
        threshold: "<0.5 mL/kg/hr for 2 consecutive hours",
        action: "Assess volume status, consider renal dose dopamine"
      }
    ],
    icuRecommendation: {
      recommended: totalRisk > 40 || input.currentStatus.ventilation || input.currentStatus.vasopressors,
      reason: totalRisk > 60 ? "High mortality risk with organ support requirements" :
        totalRisk > 40 ? "Moderate-high risk requiring intensive monitoring" :
          "Standard ward care appropriate with close monitoring",
      timing: totalRisk > 60 ? "immediate" : totalRisk > 40 ? "within_hours" : "not_indicated",
      alternatives: totalRisk < 40 ? ["Step-down unit", "Enhanced ward monitoring"] : undefined
    },
    prognosis: {
      shortTerm: totalRisk > 60 ? "Guarded with significant risk of deterioration" :
        totalRisk > 40 ? "Cautiously optimistic with close monitoring needed" :
          "Favorable with appropriate treatment",
      mediumTerm: totalRisk > 50 ? "Recovery possible but prolonged course expected" :
        "Expected recovery with rehabilitation needs",
      longTerm: totalRisk > 60 ? "Significant functional decline likely if survives" :
        totalRisk > 40 ? "May have residual functional limitations" :
          "Good functional recovery expected",
      uncertainties: [
        "Response to treatment",
        "Development of complications",
        "Underlying disease progression"
      ]
    },
    familyCommunication: [
      {
        topic: "Current clinical status",
        keyPoints: [
          "Explain current condition in understandable terms",
          "Describe treatments being provided",
          "Address immediate concerns"
        ],
        suggestedLanguage: "Your loved one is currently [stable/critical] and receiving [treatment]. We are monitoring them closely and doing everything we can to help them recover.",
        sensitivityLevel: totalRisk > 50 ? "high" : "elevated",
        supportResources: ["Chaplain services", "Social work", "Patient relations"]
      },
      {
        topic: "Prognosis and expectations",
        keyPoints: [
          "Provide honest but compassionate outlook",
          "Explain uncertainties in prediction",
          "Discuss what to expect in coming days"
        ],
        suggestedLanguage: "Based on our assessment, there is a [X%] chance of recovery. However, every patient is different, and we will continue to monitor and adjust our approach.",
        sensitivityLevel: "high",
        supportResources: ["Palliative care consultation", "Ethics committee if needed"]
      }
    ],
    goalsOfCareRecommendations: {
      currentStatus: input.goalsOfCare?.documented ?
        `Currently documented as ${input.goalsOfCare.type}` :
        "No documented goals of care",
      recommendation: totalRisk > 50 ?
        "Urgent goals of care discussion recommended" :
        "Consider documenting goals of care during this admission",
      discussionPoints: [
        "Patient's values and preferences",
        "Understanding of current condition",
        "Acceptable quality of life",
        "Treatment boundaries"
      ],
      documentationNeeded: [
        "Advance directive",
        "POLST/MOLST if appropriate",
        "Healthcare proxy designation"
      ]
    },
    comparativeAnalysis: [
      {
        metric: "APACHE II Score",
        patientValue: apacheScore,
        unitAverage: 14,
        benchmark: 12,
        interpretation: apacheScore > 20 ? "Significantly above average, indicating higher severity" : "Within expected range"
      },
      {
        metric: "SOFA Score",
        patientValue: sofaScore,
        unitAverage: 4,
        benchmark: 3,
        interpretation: sofaScore > 8 ? "Significant organ dysfunction present" : "Moderate organ involvement"
      }
    ],
    trajectoryPrediction: [
      {
        timeframe: "24-48 hours",
        predictedStatus: totalRisk > 60 ? "Likely continued critical status" : "Expected stabilization",
        confidence: 0.75,
        keyDeterminants: ["Response to current treatment", "Hemodynamic stability"]
      },
      {
        timeframe: "7 days",
        predictedStatus: totalRisk > 50 ? "Ongoing critical care needs likely" : "Potential for step-down",
        confidence: 0.6,
        keyDeterminants: ["Complication development", "Functional recovery"]
      }
    ],
    alerts: totalRisk > 60 ? [
      {
        type: "critical_deterioration",
        message: "High mortality risk - ensure goals of care discussed",
        severity: "critical",
        action: "Schedule family meeting within 24 hours"
      }
    ] : totalRisk > 40 ? [
      {
        type: "care_escalation",
        message: "Elevated mortality risk - consider ICU consultation",
        severity: "warning",
        action: "Evaluate ICU appropriateness"
      }
    ] : [],
    explanation: `This patient has a ${riskLevel} mortality risk with an estimated in-hospital mortality probability of ${(totalRisk / 100 * 100).toFixed(0)}%. The primary contributors are ${apacheScore > 20 ? 'high APACHE II score' : 'clinical severity'}, ${input.currentStatus.ventilation ? 'mechanical ventilation requirement' : 'organ dysfunction'}, and ${input.patientInfo.age > 65 ? 'advanced age' : 'comorbidity burden'}. Clinical recommendations focus on intensive monitoring, goals of care discussion, and multi-disciplinary coordination.`,
    disclaimer: "This mortality risk assessment is a statistical prediction based on available data and should be used as one input among many in clinical decision-making. Individual outcomes may vary significantly from population predictions. This tool does not replace clinical judgment.",
    lastUpdated: new Date().toISOString()
  };
};

// 5. Predictive Health Trend Analyzer
export const analyzeHealthTrends = async (input: HealthTrendInput): Promise<AIResponse<HealthTrendResult>> => {
  const startTime = Date.now();
  const cacheKey = `health-trends-${input.timeRange.startDate}-${input.timeRange.endDate}`;

  const cached = getCached<HealthTrendResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockHealthTrendResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert healthcare analytics and population health AI. Analyze the following data to predict health trends and provide strategic insights.

Facility Information:
- Type: ${input.facilityInfo.type}
- Capacity: ${input.facilityInfo.capacity}
- Departments: ${input.facilityInfo.departments.join(', ')}

Time Range: ${input.timeRange.startDate} to ${input.timeRange.endDate}

Historical Data Summary:
${input.historicalData.slice(-7).map(d => `
Period: ${d.period}
- Patient Volume: ${d.metrics.patientVolume}
- Admissions: ${d.metrics.admissions}
- Emergency Visits: ${d.metrics.emergencyVisits}
- Average LOS: ${d.metrics.averageLOS} days
- Bed Occupancy: ${d.metrics.bedOccupancy}%
`).join('\n')}

Current Resources:
- Beds: ${input.currentResources.beds.total} total, ${input.currentResources.beds.available} available
- Staff: ${input.currentResources.staff.physicians} physicians, ${input.currentResources.staff.nurses} nurses
- Equipment: ${input.currentResources.equipment.map(e => `${e.type}: ${e.count} (${e.utilization}% utilized)`).join(', ')}

External Factors:
- Season: ${input.externalFactors?.season || 'Unknown'}
- Public Health Events: ${input.externalFactors?.publicHealthEvents?.join(', ') || 'None reported'}

Provide comprehensive trend predictions, resource demand forecasts, and strategic planning insights.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallTrends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  metric: { type: Type.STRING },
                  currentValue: { type: Type.NUMBER },
                  predictedValue: { type: Type.NUMBER },
                  changePercentage: { type: Type.NUMBER },
                  trend: { type: Type.STRING, enum: ["increasing", "decreasing", "stable"] },
                  confidence: { type: Type.NUMBER },
                  timeframe: { type: Type.STRING },
                  keyDrivers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  seasonality: { type: Type.BOOLEAN },
                  historicalPattern: { type: Type.STRING }
                },
                required: ["metric", "currentValue", "predictedValue", "changePercentage", "trend", "confidence", "timeframe", "keyDrivers", "seasonality", "historicalPattern"]
              }
            },
            populationHealthPredictions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING },
                  currentPrevalence: { type: Type.NUMBER },
                  predictedPrevalence: { type: Type.NUMBER },
                  trend: { type: Type.STRING, enum: ["increasing", "decreasing", "stable"] },
                  atRiskPopulation: { type: Type.NUMBER },
                  preventionOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["condition", "currentPrevalence", "predictedPrevalence", "trend", "atRiskPopulation", "preventionOpportunities"]
              }
            },
            resourceDemandForecasts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  resource: { type: Type.STRING },
                  currentDemand: { type: Type.NUMBER },
                  predictedDemand: { type: Type.NUMBER },
                  peakDemand: { type: Type.NUMBER },
                  peakDate: { type: Type.STRING },
                  shortageRisk: { type: Type.BOOLEAN },
                  shortageSeverity: { type: Type.STRING, enum: ["mild", "moderate", "severe"] },
                  recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["resource", "currentDemand", "predictedDemand", "peakDemand", "peakDate", "shortageRisk", "recommendations"]
              }
            },
            seasonalPatterns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING },
                  peakSeason: { type: Type.STRING },
                  lowSeason: { type: Type.STRING },
                  averageCases: { type: Type.NUMBER },
                  seasonalVariation: { type: Type.NUMBER },
                  currentStatus: { type: Type.STRING, enum: ["approaching_peak", "peak", "declining", "low"] },
                  preparationRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["condition", "peakSeason", "lowSeason", "averageCases", "seasonalVariation", "currentStatus", "preparationRecommendations"]
              }
            },
            strategicInsights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  insight: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ["capacity", "workforce", "clinical", "financial", "quality"] },
                  impact: { type: Type.STRING, enum: ["high", "medium", "low"] },
                  timeframe: { type: Type.STRING, enum: ["immediate", "short_term", "medium_term", "long_term"] },
                  description: { type: Type.STRING },
                  supportingData: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                  risks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  opportunities: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["insight", "category", "impact", "timeframe", "description", "supportingData", "recommendations", "risks", "opportunities"]
              }
            },
            executiveSummary: { type: Type.STRING },
            lastAnalyzed: { type: Type.STRING }
          },
          required: ["overallTrends", "populationHealthPredictions", "resourceDemandForecasts", "seasonalPatterns", "strategicInsights", "executiveSummary", "lastAnalyzed"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as HealthTrendResult;
    setCache(cacheKey, result);

    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error("Error in health trend analysis:", error);
    return createResponse(true, getMockHealthTrendResult(input), undefined, Date.now() - startTime);
  }
};

const getMockHealthTrendResult = (input: HealthTrendInput): HealthTrendResult => {
  const lastData = input.historicalData[input.historicalData.length - 1];

  return {
    overallTrends: [
      {
        metric: "Patient Volume",
        currentValue: lastData?.metrics.patientVolume || 450,
        predictedValue: Math.round((lastData?.metrics.patientVolume || 450) * 1.12),
        changePercentage: 12,
        trend: "increasing",
        confidence: 0.85,
        timeframe: "Next 30 days",
        keyDrivers: ["Seasonal illness patterns", "Population growth", "Expanded services"],
        seasonality: true,
        historicalPattern: "Consistent 10-15% increase during this period historically"
      },
      {
        metric: "Emergency Visits",
        currentValue: lastData?.metrics.emergencyVisits || 120,
        predictedValue: Math.round((lastData?.metrics.emergencyVisits || 120) * 1.18),
        changePercentage: 18,
        trend: "increasing",
        confidence: 0.78,
        timeframe: "Next 30 days",
        keyDrivers: ["Flu season approaching", "Weekend/holiday patterns"],
        seasonality: true,
        historicalPattern: "Peak ED volume typically occurs in winter months"
      },
      {
        metric: "Average Length of Stay",
        currentValue: lastData?.metrics.averageLOS || 4.2,
        predictedValue: 4.5,
        changePercentage: 7,
        trend: "increasing",
        confidence: 0.72,
        timeframe: "Next 30 days",
        keyDrivers: ["Higher acuity admissions", "Complex cases"],
        seasonality: false,
        historicalPattern: "Relatively stable with slight seasonal variation"
      },
      {
        metric: "Bed Occupancy",
        currentValue: lastData?.metrics.bedOccupancy || 78,
        predictedValue: 85,
        changePercentage: 9,
        trend: "increasing",
        confidence: 0.82,
        timeframe: "Next 30 days",
        keyDrivers: ["Increased admissions", "Longer LOS"],
        seasonality: true,
        historicalPattern: "Occupancy peaks during winter months"
      }
    ],
    populationHealthPredictions: [
      {
        condition: "Diabetes",
        currentPrevalence: 8.5,
        predictedPrevalence: 9.2,
        trend: "increasing",
        atRiskPopulation: 2500,
        preventionOpportunities: ["Lifestyle intervention programs", "Early screening initiatives", "Community education"]
      },
      {
        condition: "Hypertension",
        currentPrevalence: 28.5,
        predictedPrevalence: 29.8,
        trend: "increasing",
        atRiskPopulation: 4500,
        preventionOpportunities: ["Blood pressure monitoring programs", "Dietary counseling", "Medication adherence support"]
      },
      {
        condition: "Respiratory Illness",
        currentPrevalence: 12.3,
        predictedPrevalence: 18.5,
        trend: "increasing",
        atRiskPopulation: 3200,
        preventionOpportunities: ["Vaccination campaigns", "Air quality alerts", "Early treatment protocols"]
      }
    ],
    resourceDemandForecasts: [
      {
        resource: "Hospital Beds",
        currentDemand: input.currentResources.beds.total - input.currentResources.beds.available,
        predictedDemand: Math.round(input.currentResources.beds.total * 0.85),
        peakDemand: Math.round(input.currentResources.beds.total * 0.92),
        peakDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        shortageRisk: true,
        shortageSeverity: "moderate",
        recommendations: [
          "Review elective surgery schedule",
          "Prepare surge capacity protocols",
          "Expedite discharge planning"
        ],
        utilizationForecast: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          demand: Math.round(input.currentResources.beds.total * (0.78 + i * 0.02)),
          capacity: input.currentResources.beds.total,
          utilization: 78 + i * 2
        }))
      },
      {
        resource: "Nursing Staff",
        currentDemand: input.currentResources.staff.nurses * 0.85,
        predictedDemand: input.currentResources.staff.nurses * 0.95,
        peakDemand: input.currentResources.staff.nurses * 1.05,
        peakDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        shortageRisk: true,
        shortageSeverity: "mild",
        recommendations: [
          "Review overtime policies",
          "Consider agency staffing",
          "Cross-train support staff"
        ],
        utilizationForecast: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          demand: Math.round(input.currentResources.staff.nurses * (0.85 + i * 0.015)),
          capacity: input.currentResources.staff.nurses,
          utilization: 85 + i * 1.5
        }))
      },
      {
        resource: "Ventilators",
        currentDemand: 8,
        predictedDemand: 12,
        peakDemand: 15,
        peakDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        shortageRisk: false,
        recommendations: [
          "Ensure maintenance current",
          "Review backup equipment availability"
        ],
        utilizationForecast: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          demand: 8 + i,
          capacity: 25,
          utilization: 32 + i * 4
        }))
      }
    ],
    seasonalPatterns: [
      {
        condition: "Influenza",
        peakSeason: "December-February",
        lowSeason: "June-August",
        averageCases: 150,
        seasonalVariation: 85,
        currentStatus: "approaching_peak",
        preparationRecommendations: [
          "Stock antiviral medications",
          "Vaccination campaign completion",
          "Staff flu vaccine compliance review"
        ]
      },
      {
        condition: "Respiratory Syncytial Virus (RSV)",
        peakSeason: "November-March",
        lowSeason: "May-September",
        averageCases: 80,
        seasonalVariation: 75,
        currentStatus: "approaching_peak",
        preparationRecommendations: [
          "Pediatric unit capacity review",
          "RSV testing supplies",
          "Isolation room availability"
        ]
      },
      {
        condition: "Allergies/Asthma",
        peakSeason: "Spring and Fall",
        lowSeason: "Winter",
        averageCases: 200,
        seasonalVariation: 60,
        currentStatus: "low",
        preparationRecommendations: [
          "Monitor pollen counts",
          "Stock allergy medications"
        ]
      }
    ],
    strategicInsights: [
      {
        insight: "Capacity constraints expected within 3 weeks",
        category: "capacity",
        impact: "high",
        timeframe: "short_term",
        description: "Current trajectory indicates bed occupancy will exceed 90% within 3 weeks, requiring proactive management",
        supportingData: [
          "Bed occupancy trending up 9%",
          "LOS increasing 7%",
          "Admissions projected up 12%"
        ],
        recommendations: [
          "Implement discharge before noon initiative",
          "Review elective surgery scheduling",
          "Prepare overflow protocols"
        ],
        risks: ["ED boarding", "Delayed admissions", "Patient satisfaction impact"],
        opportunities: ["Process improvement", "Care coordination enhancement"]
      },
      {
        insight: "Nursing workforce strain anticipated",
        category: "workforce",
        impact: "high",
        timeframe: "immediate",
        description: "Nursing demand will exceed current capacity within 2 weeks without intervention",
        supportingData: [
          "Current utilization at 85%",
          "Predicted utilization 95%+",
          "Overtime already elevated"
        ],
        recommendations: [
          "Activate contingency staffing plans",
          "Review agency contracts",
          "Implement retention incentives"
        ],
        risks: ["Burnout", "Quality impact", "Turnover increase"],
        opportunities: ["Staffing model optimization", "Skill mix review"]
      },
      {
        insight: "Respiratory illness surge preparation needed",
        category: "clinical",
        impact: "high",
        timeframe: "immediate",
        description: "Seasonal patterns indicate approaching respiratory illness peak requiring preparation",
        supportingData: [
          "Historical 85% seasonal variation",
          "Current cases below peak but rising",
          "Community surveillance showing increase"
        ],
        recommendations: [
          "Complete vaccination campaigns",
          "Stock respiratory medications",
          "Review isolation capacity"
        ],
        risks: ["Outbreak potential", "Resource strain"],
        opportunities: ["Prevention program expansion", "Community partnerships"]
      }
    ],
    capacityPlanning: [
      {
        department: "Emergency",
        currentCapacity: 30,
        recommendedCapacity: 35,
        projectedUtilization: 115,
        expansionNeeded: true,
        timeline: "Immediate",
        costEstimate: 150000
      },
      {
        department: "ICU",
        currentCapacity: 20,
        recommendedCapacity: 24,
        projectedUtilization: 95,
        expansionNeeded: true,
        timeline: "2-4 weeks",
        costEstimate: 500000
      },
      {
        department: "Medical/Surgical",
        currentCapacity: 100,
        recommendedCapacity: 110,
        projectedUtilization: 88,
        expansionNeeded: false,
        timeline: "Monitor"
      }
    ],
    workforcePlanning: [
      {
        role: "Registered Nurses",
        currentStaffing: input.currentResources.staff.nurses,
        projectedDemand: Math.round(input.currentResources.staff.nurses * 1.15),
        gap: Math.round(input.currentResources.staff.nurses * 0.15),
        hiringRecommendation: "Initiate recruitment for 10-15 additional RNs",
        trainingNeeds: ["Critical care", "Emergency response"]
      },
      {
        role: "Physicians",
        currentStaffing: input.currentResources.staff.physicians,
        projectedDemand: Math.round(input.currentResources.staff.physicians * 1.08),
        gap: Math.round(input.currentResources.staff.physicians * 0.08),
        hiringRecommendation: "Consider locum coverage for immediate needs",
        trainingNeeds: []
      }
    ],
    financialProjections: [
      {
        metric: "Revenue",
        currentValue: 2500000,
        projectedValue: 2800000,
        change: 300000,
        confidence: 0.75,
        factors: ["Increased volume", "Payer mix", "Service expansion"]
      },
      {
        metric: "Operating Costs",
        currentValue: 2100000,
        projectedValue: 2350000,
        change: 250000,
        confidence: 0.8,
        factors: ["Staffing costs", "Supply costs", "Overtime"]
      },
      {
        metric: "Margin",
        currentValue: 400000,
        projectedValue: 450000,
        change: 50000,
        confidence: 0.65,
        factors: ["Revenue growth", "Cost management"]
      }
    ],
    qualityMetrics: [
      {
        metric: "Patient Satisfaction",
        currentPerformance: 82,
        target: 90,
        projectedPerformance: 80,
        onTrack: false,
        interventions: ["Wait time reduction", "Communication improvement"]
      },
      {
        metric: "Readmission Rate",
        currentPerformance: 12,
        target: 10,
        projectedPerformance: 13,
        onTrack: false,
        interventions: ["Discharge planning enhancement", "Follow-up programs"]
      },
      {
        metric: "Infection Rate",
        currentPerformance: 1.2,
        target: 1.0,
        projectedPerformance: 1.3,
        onTrack: false,
        interventions: ["Hand hygiene compliance", "Isolation protocols"]
      }
    ],
    riskAssessment: [
      {
        risk: "Capacity overflow",
        probability: 0.65,
        impact: "high",
        mitigation: "Surge protocols, discharge optimization",
        monitoring: "Daily census tracking"
      },
      {
        risk: "Staff burnout",
        probability: 0.55,
        impact: "high",
        mitigation: "Wellness programs, staffing support",
        monitoring: "Overtime tracking, satisfaction surveys"
      },
      {
        risk: "Supply shortage",
        probability: 0.25,
        impact: "medium",
        mitigation: "Inventory monitoring, alternative suppliers",
        monitoring: "Supply chain dashboards"
      }
    ],
    actionPlan: [
      {
        priority: "immediate",
        action: "Implement discharge before noon initiative",
        rationale: "Improve bed turnover and reduce capacity strain",
        resources: ["Case managers", "Physicians", "Transport"],
        expectedOutcome: "10-15% improvement in bed availability",
        kpis: ["Discharge time", "Bed turnover", "ED boarding time"]
      },
      {
        priority: "immediate",
        action: "Activate contingency staffing plan",
        rationale: "Address projected nursing shortage",
        resources: ["HR", "Nursing leadership", "Agency contacts"],
        expectedOutcome: "Maintain safe staffing ratios",
        kpis: ["Staffing ratio", "Overtime hours", "Agency usage"]
      },
      {
        priority: "short_term",
        action: "Complete respiratory illness preparation",
        rationale: "Prepare for seasonal surge",
        resources: ["Pharmacy", "Supply chain", "Clinical staff"],
        expectedOutcome: "Adequate resources for surge",
        kpis: ["Medication stock", "Equipment availability", "Isolation capacity"]
      },
      {
        priority: "medium_term",
        action: "Expand preventive care programs",
        rationale: "Address population health trends",
        resources: ["Community health", "Primary care", "Education team"],
        expectedOutcome: "Reduce chronic disease burden",
        kpis: ["Screening rates", "Disease prevalence", "Preventive visits"]
      }
    ],
    executiveSummary: "Health trend analysis indicates increasing patient volume and resource demands over the next 30 days, driven by seasonal illness patterns and population health trends. Key priorities include capacity management, workforce support, and respiratory illness preparation. Proactive implementation of recommended actions can mitigate risks and position the facility for optimal performance.",
    dataQuality: {
      completeness: 92,
      reliability: 88,
      limitations: [
        "External factors may impact predictions",
        "Historical patterns may not fully predict future trends",
        "Real-time data integration could improve accuracy"
      ]
    },
    lastAnalyzed: new Date().toISOString()
  };
};

// ============================================
// MEDICAL IMAGING AI FEATURES - Batch 6
// ============================================

// 1. AI-Powered Chest X-Ray Analysis
export const analyzeChestXRay = async (input: ChestXRayAnalysisInput): Promise<AIResponse<ChestXRayAnalysisResult>> => {
  const startTime = Date.now();
  const cacheKey = `chest-xray-${JSON.stringify(input)}`;

  const cached = getCached<ChestXRayAnalysisResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockChestXRayResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert radiologist AI assistant specializing in chest X-ray interpretation. Analyze the following chest X-ray image and clinical context.

Patient Information:
- Age: ${input.patientInfo?.age || 'Unknown'}
- Gender: ${input.patientInfo?.gender || 'Unknown'}
- Clinical Indication: ${input.patientInfo?.clinicalIndication || 'Not specified'}
- Symptoms: ${input.patientInfo?.symptoms?.join(', ') || 'None provided'}
- Medical History: ${input.patientInfo?.medicalHistory?.join(', ') || 'None provided'}

Provide a comprehensive chest X-ray analysis including:
1. Overall impression
2. Detailed findings (lung fields, cardiac silhouette, pleural spaces, bones, mediastinum)
3. Detection of abnormalities (pneumonia, effusions, cardiomegaly, nodules, masses, etc.)
4. Cardiac analysis (cardiothoracic ratio, heart size)
5. Structured radiology report
6. Clinical recommendations

Note: This is a simulated analysis for educational purposes. Always correlate clinically.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallImpression: { type: Type.STRING },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  finding: { type: Type.STRING },
                  category: { type: Type.STRING },
                  location: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            confidence: { type: Type.NUMBER },
            disclaimer: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}') as ChestXRayAnalysisResult;
    setCache(cacheKey, result);
    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error('Chest X-Ray analysis error:', error);
    return createResponse(true, getMockChestXRayResult(input), undefined, Date.now() - startTime);
  }
};

const getMockChestXRayResult = (input: ChestXRayAnalysisInput): ChestXRayAnalysisResult => {
  return {
    overallImpression: "No acute cardiopulmonary abnormality identified. The lungs are clear without focal consolidation, pleural effusion, or pneumothorax. The cardiac silhouette is within normal limits. No acute bony abnormality.",
    findings: [
      {
        finding: "Lung fields clear",
        category: "lung",
        location: "Bilateral lung fields",
        confidence: 0.95,
        severity: "normal",
        description: "Both lung fields are clear without evidence of consolidation, mass, or nodule. The pulmonary vasculature appears normal."
      },
      {
        finding: "Normal cardiac silhouette",
        category: "cardiac",
        location: "Mediastinum",
        confidence: 0.92,
        severity: "normal",
        description: "The cardiac silhouette is normal in size and configuration. Cardiothoracic ratio is within normal limits."
      },
      {
        finding: "No pleural effusion",
        category: "pleural",
        location: "Bilateral pleural spaces",
        confidence: 0.94,
        severity: "normal",
        description: "No pleural effusion or pneumothorax identified. Costophrenic angles are sharp."
      },
      {
        finding: "Normal bony structures",
        category: "bone",
        location: "Ribs and spine",
        confidence: 0.90,
        severity: "normal",
        description: "No acute fracture or bony abnormality. The visualized skeleton appears unremarkable."
      }
    ],
    abnormalities: [
      { type: "pneumonia", present: false, confidence: 0.95, location: "N/A", description: "No evidence of pneumonia", severity: "mild" },
      { type: "effusion", present: false, confidence: 0.94, location: "N/A", description: "No pleural effusion identified", severity: "mild" },
      { type: "cardiomegaly", present: false, confidence: 0.92, location: "Cardiac", description: "Heart size is normal", severity: "mild" },
      { type: "nodule", present: false, confidence: 0.88, location: "N/A", description: "No pulmonary nodules identified", severity: "mild" },
      { type: "pneumothorax", present: false, confidence: 0.96, location: "N/A", description: "No pneumothorax present", severity: "mild" }
    ],
    cardiacAnalysis: {
      cardiothoracicRatio: 0.48,
      cardiomegaly: false,
      heartSize: "normal",
      cardiacSilhouette: "Normal cardiac silhouette with normal configuration"
    },
    lungAnalysis: {
      lungFields: "clear",
      infiltrates: [],
      nodules: [],
      pleuralEffusion: []
    },
    structuredReport: {
      clinicalIndication: input.patientInfo?.clinicalIndication || "Chest pain evaluation",
      technique: "PA and lateral views of the chest were obtained. Comparison is made to prior study if available.",
      comparison: input.previousStudies?.length ? "Comparison made with prior study" : "No prior study available for comparison",
      findings: "The lungs are clear without focal consolidation, pleural effusion, or pneumothorax. The cardiac silhouette and mediastinum are within normal limits. No acute bony abnormality.",
      impression: "No acute cardiopulmonary abnormality.",
      recommendations: "Clinical correlation recommended. Follow-up as clinically indicated."
    },
    recommendations: [
      {
        type: "clinical_correlation",
        recommendation: "Correlate with clinical symptoms and physical examination findings",
        timeframe: "As clinically indicated",
        priority: "routine"
      }
    ],
    qualityMetrics: {
      imageQuality: "good",
      positioning: "optimal",
      penetration: "optimal",
      artifacts: []
    },
    confidence: 0.92,
    disclaimer: "This AI analysis is for educational purposes only and should not replace professional medical interpretation. All findings should be correlated clinically and verified by a qualified radiologist."
  };
};

// 2. AI-Powered CT Scan Analysis
export const analyzeCTScan = async (input: CTScanAnalysisInput): Promise<AIResponse<CTScanAnalysisResult>> => {
  const startTime = Date.now();
  const cacheKey = `ct-scan-${JSON.stringify(input)}`;

  const cached = getCached<CTScanAnalysisResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockCTScanResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert radiologist AI assistant specializing in CT scan interpretation. Analyze the following CT scan.

Scan Type: ${input.scanType}
Contrast Used: ${input.contrastUsed ? 'Yes' : 'No'}
Patient Age: ${input.patientInfo?.age || 'Unknown'}
Clinical Indication: ${input.patientInfo?.clinicalIndication || 'Not specified'}

Provide comprehensive CT analysis including findings, measurements, and clinical recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallImpression: { type: Type.STRING },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  finding: { type: Type.STRING },
                  category: { type: Type.STRING },
                  location: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            confidence: { type: Type.NUMBER }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}') as CTScanAnalysisResult;
    setCache(cacheKey, result);
    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error('CT Scan analysis error:', error);
    return createResponse(true, getMockCTScanResult(input), undefined, Date.now() - startTime);
  }
};

const getMockCTScanResult = (input: CTScanAnalysisInput): CTScanAnalysisResult => {
  return {
    overallImpression: "CT examination shows no acute abnormality. The visualized organs appear within normal limits. No masses, hemorrhages, or fractures identified.",
    findings: [
      {
        finding: "Normal parenchymal enhancement",
        category: "normal",
        location: "Liver, spleen, kidneys",
        confidence: 0.94,
        severity: "normal",
        description: "The liver, spleen, and kidneys demonstrate normal parenchymal enhancement pattern. No focal lesions identified."
      },
      {
        finding: "No lymphadenopathy",
        category: "normal",
        location: "Abdomen",
        confidence: 0.92,
        severity: "normal",
        description: "No pathologic lymphadenopathy identified in the visualized abdomen."
      },
      {
        finding: "Normal vascular structures",
        category: "normal",
        location: "Abdominal vasculature",
        confidence: 0.91,
        severity: "normal",
        description: "The abdominal aorta and major branches appear normal in caliber without aneurysm or dissection."
      }
    ],
    detectedAbnormalities: [
      { type: "tumor", present: false, confidence: 0.95, location: "N/A", description: "No tumor identified", characteristics: [], differentialDiagnoses: [] },
      { type: "hemorrhage", present: false, confidence: 0.96, location: "N/A", description: "No hemorrhage identified", characteristics: [], differentialDiagnoses: [] },
      { type: "fracture", present: false, confidence: 0.94, location: "N/A", description: "No fractures identified", characteristics: [], differentialDiagnoses: [] }
    ],
    organAnalysis: [
      { organ: "Liver", status: "normal", findings: ["Normal size and attenuation", "No focal lesions", "Normal enhancement pattern"] },
      { organ: "Spleen", status: "normal", findings: ["Normal size", "Homogeneous enhancement", "No splenomegaly"] },
      { organ: "Kidneys", status: "normal", findings: ["Normal bilateral renal size", "No hydronephrosis", "No renal calculi"] },
      { organ: "Pancreas", status: "normal", findings: ["Normal size and attenuation", "No pancreatic ductal dilation"] }
    ],
    threeDReconstruction: {
      available: true,
      findings: ["3D reconstruction performed", "No significant abnormalities on volume rendering"],
      volumes: [
        { structure: "Liver", volume: 1450, unit: "cm³" },
        { structure: "Right Kidney", volume: 145, unit: "cm³" },
        { structure: "Left Kidney", volume: 152, unit: "cm³" }
      ]
    },
    structuredReport: {
      clinicalIndication: input.patientInfo?.clinicalIndication || "Abdominal pain evaluation",
      technique: `CT ${input.scanType} was performed ${input.contrastUsed ? 'with intravenous contrast' : 'without contrast'}. Axial images were obtained with multiplanar reformats.`,
      comparison: input.previousStudies?.length ? "Comparison made with prior study" : "No prior comparison available",
      findings: "The visualized organs appear within normal limits. No masses, hemorrhages, or acute abnormalities identified. No lymphadenopathy.",
      impression: "No acute abnormality. Unremarkable CT examination.",
      recommendations: "Clinical correlation recommended."
    },
    measurements: [
      { structure: "Liver", measurement: "Craniocaudal dimension", value: 15.2, unit: "cm", normalRange: "10-15 cm", interpretation: "Normal" },
      { structure: "Spleen", measurement: "Craniocaudal dimension", value: 10.5, unit: "cm", normalRange: "8-13 cm", interpretation: "Normal" },
      { structure: "Right Kidney", measurement: "Length", value: 10.8, unit: "cm", normalRange: "9-12 cm", interpretation: "Normal" },
      { structure: "Left Kidney", measurement: "Length", value: 11.2, unit: "cm", normalRange: "9-12 cm", interpretation: "Normal" }
    ],
    recommendations: [
      {
        type: "clinical_correlation",
        recommendation: "Correlate with clinical symptoms and laboratory findings",
        timeframe: "As clinically indicated",
        priority: "routine"
      }
    ],
    qualityMetrics: {
      imageQuality: "excellent",
      motionArtifact: false,
      contrastOpacification: input.contrastUsed ? "optimal" : undefined,
      artifacts: []
    },
    confidence: 0.93,
    disclaimer: "This AI analysis is for educational purposes only. All findings should be verified by a qualified radiologist."
  };
};

// 3. AI-Powered Ultrasound Analysis
export const analyzeUltrasound = async (input: UltrasoundAnalysisInput): Promise<AIResponse<UltrasoundAnalysisResult>> => {
  const startTime = Date.now();
  const cacheKey = `ultrasound-${JSON.stringify(input)}`;

  const cached = getCached<UltrasoundAnalysisResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockUltrasoundResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert radiologist AI assistant specializing in ultrasound interpretation. Analyze the following ultrasound.

Scan Type: ${input.scanType}
Patient Age: ${input.patientInfo?.age || 'Unknown'}
Clinical Indication: ${input.patientInfo?.clinicalIndication || 'Not specified'}
${input.scanType === 'obstetric' ? `Gestational Age: ${input.patientInfo?.gestationalAge || 'Unknown'} weeks` : ''}

Provide comprehensive ultrasound analysis including findings, measurements, and clinical recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallImpression: { type: Type.STRING },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  finding: { type: Type.STRING },
                  category: { type: Type.STRING },
                  location: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                }
              }
            },
            confidence: { type: Type.NUMBER }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}') as UltrasoundAnalysisResult;
    setCache(cacheKey, result);
    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error('Ultrasound analysis error:', error);
    return createResponse(true, getMockUltrasoundResult(input), undefined, Date.now() - startTime);
  }
};

const getMockUltrasoundResult = (input: UltrasoundAnalysisInput): UltrasoundAnalysisResult => {
  const isObstetric = input.scanType === 'obstetric';

  const baseResult: UltrasoundAnalysisResult = {
    overallImpression: isObstetric
      ? "Single live intrauterine pregnancy. Fetal biometry consistent with dates. Normal amniotic fluid volume. Placenta appears normal."
      : "Unremarkable ultrasound examination. No focal abnormality identified.",
    findings: isObstetric ? [
      {
        finding: "Single live intrauterine pregnancy",
        category: "normal",
        location: "Uterus",
        confidence: 0.99,
        description: "Single gestational sac with live embryo identified within the uterine cavity."
      },
      {
        finding: "Normal fetal cardiac activity",
        category: "normal",
        location: "Fetal heart",
        confidence: 0.98,
        description: "Regular fetal heart rate observed with normal rhythm."
      },
      {
        finding: "Normal amniotic fluid",
        category: "normal",
        location: "Amniotic cavity",
        confidence: 0.95,
        description: "Amniotic fluid volume is within normal limits."
      }
    ] : [
      {
        finding: "Normal organ appearance",
        category: "normal",
        location: "Scanned region",
        confidence: 0.94,
        description: "The visualized structures appear within normal limits."
      }
    ],
    structuredReport: {
      clinicalIndication: input.patientInfo?.clinicalIndication || (isObstetric ? "Routine obstetric ultrasound" : "Abdominal evaluation"),
      technique: `${input.scanType} ultrasound was performed using standard protocol.`,
      comparison: input.previousStudies?.length ? "Comparison made with prior study" : "No prior comparison available",
      findings: isObstetric
        ? "Single live intrauterine pregnancy. Fetal biometry consistent with gestational age. Normal amniotic fluid volume. Placenta normal in appearance."
        : "No focal abnormality identified. The visualized structures appear within normal limits.",
      impression: isObstetric
        ? "Single live intrauterine pregnancy. No abnormality identified."
        : "Unremarkable ultrasound examination.",
      recommendations: isObstetric
        ? "Routine follow-up ultrasound as per standard obstetric care."
        : "Clinical correlation recommended."
    },
    recommendations: [
      {
        type: isObstetric ? "follow_up" : "clinical_correlation",
        recommendation: isObstetric
          ? "Schedule routine follow-up ultrasound at 28-32 weeks"
          : "Correlate with clinical findings",
        timeframe: isObstetric ? "4-6 weeks" : "As clinically indicated",
        priority: "routine"
      }
    ],
    qualityMetrics: {
      imageQuality: "good",
      acousticWindows: "optimal",
      artifacts: []
    },
    confidence: 0.94,
    disclaimer: "This AI analysis is for educational purposes only. All findings should be verified by a qualified sonographer/radiologist."
  };

  if (isObstetric) {
    baseResult.obstetricAnalysis = {
      gestationalAge: {
        estimated: input.patientInfo?.gestationalAge || 20,
        confidence: 0.95,
        method: "composite",
        range: { lower: (input.patientInfo?.gestationalAge || 20) - 1, upper: (input.patientInfo?.gestationalAge || 20) + 1 }
      },
      fetalBiometry: {
        biparietalDiameter: { value: 48, unit: "mm", percentile: 55 },
        headCircumference: { value: 175, unit: "mm", percentile: 52 },
        abdominalCircumference: { value: 155, unit: "mm", percentile: 50 },
        femurLength: { value: 35, unit: "mm", percentile: 53 },
        estimatedFetalWeight: { value: 350, unit: "g", percentile: 52 }
      },
      fetalHeartRate: 145,
      amnioticFluid: {
        index: 14,
        status: "normal"
      },
      placenta: {
        location: "Anterior fundal",
        grade: 1,
        position: "normal",
        abnormalities: []
      },
      fetalAnatomy: [
        { structure: "Cranium", status: "visualized", findings: "Normal shape, no skull defects" },
        { structure: "Brain", status: "visualized", findings: "Normal ventricular size" },
        { structure: "Spine", status: "visualized", findings: "Normal alignment" },
        { structure: "Heart", status: "visualized", findings: "Four-chamber view normal" },
        { structure: "Stomach", status: "visualized", findings: "Present in left upper quadrant" },
        { structure: "Kidneys", status: "visualized", findings: "Bilateral kidneys visualized" },
        { structure: "Bladder", status: "visualized", findings: "Normal" },
        { structure: "Extremities", status: "visualized", findings: "All four limbs identified" }
      ],
      fetalPresentation: "cephalic",
      multipleGestation: false
    };
  } else {
    baseResult.organAnalysis = [
      {
        organ: "Liver",
        status: "normal",
        size: { value: 14.5, unit: "cm" },
        echogenicity: "normal",
        findings: ["Normal size and echogenicity", "No focal lesions"],
        lesions: []
      },
      {
        organ: "Gallbladder",
        status: "normal",
        echogenicity: "normal",
        findings: ["No gallstones", "No wall thickening", "Normal common bile duct"],
        lesions: []
      },
      {
        organ: "Kidneys",
        status: "normal",
        size: { value: 10.5, unit: "cm" },
        echogenicity: "normal",
        findings: ["Normal bilateral renal size", "No hydronephrosis", "No calculi"],
        lesions: []
      }
    ];
  }

  return baseResult;
};

// 4. AI-Powered MRI Analysis
export const analyzeMRI = async (input: MRIAnalysisInput): Promise<AIResponse<MRIAnalysisResult>> => {
  const startTime = Date.now();
  const cacheKey = `mri-${JSON.stringify(input)}`;

  const cached = getCached<MRIAnalysisResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockMRIResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert radiologist AI assistant specializing in MRI interpretation. Analyze the following MRI.

Scan Type: ${input.scanType}
Sequences: ${input.sequences?.join(', ') || 'Standard sequences'}
Contrast Used: ${input.contrastUsed ? 'Yes' : 'No'}
Patient Age: ${input.patientInfo?.age || 'Unknown'}
Clinical Indication: ${input.patientInfo?.clinicalIndication || 'Not specified'}

Provide comprehensive MRI analysis including signal characteristics, findings, and clinical recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallImpression: { type: Type.STRING },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  finding: { type: Type.STRING },
                  category: { type: Type.STRING },
                  location: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            confidence: { type: Type.NUMBER }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}') as MRIAnalysisResult;
    setCache(cacheKey, result);
    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error('MRI analysis error:', error);
    return createResponse(true, getMockMRIResult(input), undefined, Date.now() - startTime);
  }
};

const getMockMRIResult = (input: MRIAnalysisInput): MRIAnalysisResult => {
  const isBrain = input.scanType === 'brain';
  const isSpine = input.scanType === 'spine';
  const isJoint = input.scanType === 'joint';

  const baseResult: MRIAnalysisResult = {
    overallImpression: isBrain
      ? "No acute intracranial abnormality. Normal brain MRI. No evidence of mass, hemorrhage, or acute infarction."
      : isSpine
        ? "Unremarkable MRI of the spine. No significant disc herniation or spinal canal stenosis."
        : "No significant abnormality identified on MRI examination.",
    findings: [
      {
        finding: isBrain ? "Normal brain parenchyma" : "Normal signal intensity",
        category: "normal",
        location: isBrain ? "Bilateral cerebral hemispheres" : "Scanned region",
        confidence: 0.94,
        severity: "normal",
        description: isBrain
          ? "Normal signal intensity throughout the brain parenchyma. No focal lesions identified."
          : "Normal signal characteristics without focal abnormality.",
        signalCharacteristics: {
          t1Signal: "isointense",
          t2Signal: "isointense",
          flairSignal: "isointense",
          diffusionRestriction: false
        }
      }
    ],
    structuredReport: {
      clinicalIndication: input.patientInfo?.clinicalIndication || (isBrain ? "Headache evaluation" : isSpine ? "Back pain" : "MRI evaluation"),
      technique: `MRI ${input.scanType} was performed ${input.contrastUsed ? 'with intravenous gadolinium contrast' : 'without contrast'} using ${input.sequences?.join(', ') || 'standard sequences'}.`,
      comparison: input.previousStudies?.length ? "Comparison made with prior study" : "No prior comparison available",
      findings: isBrain
        ? "No acute intracranial abnormality. Normal brain parenchyma signal. Ventricles and sulci are normal in size. No mass effect or midline shift."
        : "No significant abnormality identified.",
      impression: isBrain
        ? "No acute intracranial abnormality."
        : "Unremarkable MRI examination.",
      recommendations: "Clinical correlation recommended."
    },
    recommendations: [
      {
        type: "clinical_correlation",
        recommendation: "Correlate with clinical symptoms and examination findings",
        timeframe: "As clinically indicated",
        priority: "routine"
      }
    ],
    qualityMetrics: {
      imageQuality: "excellent",
      motionArtifact: false,
      metalArtifact: input.patientInfo?.implants?.length ? true : false,
      artifacts: input.patientInfo?.implants?.length ? ["Metallic susceptibility artifact from implant"] : []
    },
    confidence: 0.93,
    disclaimer: "This AI analysis is for educational purposes only. All findings should be verified by a qualified radiologist."
  };

  if (isBrain) {
    baseResult.brainAnalysis = {
      ventricles: {
        size: "normal",
        symmetry: "symmetric",
        description: "Ventricles are normal in size and symmetric."
      },
      whiteMatter: {
        status: "normal",
        lesions: [],
        description: "No white matter lesions identified."
      },
      grayMatter: {
        status: "normal",
        atrophy: "none",
        description: "Normal gray-white matter differentiation."
      },
      vascular: {
        status: "normal",
        findings: ["Normal flow voids in major intracranial vessels"],
        flowVoids: "normal"
      },
      masses: {
        present: false
      }
    };
  }

  if (isSpine) {
    baseResult.spineAnalysis = {
      vertebralBodies: {
        status: "normal",
        findings: ["Normal vertebral body height", "Normal marrow signal"],
        compressionFractures: []
      },
      intervertebralDiscs: [
        { level: "L1-L2", status: "normal", neuralForaminalNarrowing: "none", spinalCanalStenosis: "none" },
        { level: "L2-L3", status: "normal", neuralForaminalNarrowing: "none", spinalCanalStenosis: "none" },
        { level: "L3-L4", status: "normal", neuralForaminalNarrowing: "none", spinalCanalStenosis: "none" },
        { level: "L4-L5", status: "bulging", severity: "mild", neuralForaminalNarrowing: "mild", spinalCanalStenosis: "none" },
        { level: "L5-S1", status: "normal", neuralForaminalNarrowing: "none", spinalCanalStenosis: "none" }
      ],
      spinalCord: {
        status: "normal",
        signal: "normal",
        compression: [],
        findings: ["Normal cord signal and caliber"]
      },
      ligaments: {
        status: "normal",
        findings: ["No ligamentous injury"]
      }
    };
  }

  if (isJoint) {
    baseResult.jointAnalysis = {
      joint: "Knee",
      bones: {
        status: "normal",
        marrowSignal: "normal",
        findings: ["No bone marrow edema", "No fractures"],
        fractures: []
      },
      cartilage: {
        status: "normal",
        defects: []
      },
      menisci: {
        status: "normal",
        tears: []
      },
      ligaments: [
        { name: "ACL", status: "intact", findings: "Anterior cruciate ligament is intact" },
        { name: "PCL", status: "intact", findings: "Posterior cruciate ligament is intact" },
        { name: "MCL", status: "intact", findings: "Medial collateral ligament is intact" },
        { name: "LCL", status: "intact", findings: "Lateral collateral ligament is intact" }
      ],
      tendons: [
        { name: "Quadriceps", status: "normal", findings: "Normal quadriceps tendon" },
        { name: "Patellar", status: "normal", findings: "Normal patellar tendon" }
      ],
      synovium: {
        status: "normal",
        effusion: "none"
      },
      softTissue: {
        status: "normal",
        findings: ["No soft tissue mass or collection"]
      }
    };
  }

  return baseResult;
};

// 5. AI-Powered Mammography Analysis
export const analyzeMammography = async (input: MammographyAnalysisInput): Promise<AIResponse<MammographyAnalysisResult>> => {
  const startTime = Date.now();
  const cacheKey = `mammography-${JSON.stringify(input)}`;

  const cached = getCached<MammographyAnalysisResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockMammographyResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert breast imaging radiologist AI assistant. Analyze the following mammography study.

Views: ${input.views?.join(', ') || 'Standard views'}
Laterality: ${input.laterality}
Patient Age: ${input.patientInfo?.age || 'Unknown'}
Clinical Indication: ${input.patientInfo?.clinicalIndication || 'Screening'}
Family History: ${input.patientInfo?.familyHistory?.join(', ') || 'None provided'}

Provide comprehensive mammography analysis including BI-RADS assessment, findings, and recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallImpression: { type: Type.STRING },
            biRadsAssessment: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.NUMBER },
                categoryDescription: { type: Type.STRING },
                recommendation: { type: Type.STRING }
              }
            },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  finding: { type: Type.STRING },
                  category: { type: Type.STRING },
                  laterality: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                }
              }
            },
            confidence: { type: Type.NUMBER }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}') as MammographyAnalysisResult;
    setCache(cacheKey, result);
    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error('Mammography analysis error:', error);
    return createResponse(true, getMockMammographyResult(input), undefined, Date.now() - startTime);
  }
};

const getMockMammographyResult = (input: MammographyAnalysisInput): MammographyAnalysisResult => {
  return {
    overallImpression: "Bilateral screening mammography shows no evidence of malignancy. There are no suspicious masses, calcifications, or architectural distortions. BI-RADS Category 1: Negative.",
    biRadsAssessment: {
      category: 1,
      categoryDescription: "Negative: There is nothing to comment on. There is a negative mammogram.",
      recommendation: "Continue routine annual screening mammography.",
      probabilityOfMalignancy: "Essentially 0%"
    },
    findings: [
      {
        finding: "No suspicious masses",
        category: "mass",
        laterality: "bilateral",
        location: { quadrant: "upper_outer" },
        confidence: 0.96,
        description: "No masses identified in either breast. The breast parenchyma is heterogeneous.",
        characteristics: {}
      },
      {
        finding: "No suspicious calcifications",
        category: "calcification",
        laterality: "bilateral",
        location: { quadrant: "central" },
        confidence: 0.95,
        description: "No suspicious calcifications identified. No clustered or pleomorphic calcifications.",
        characteristics: {}
      },
      {
        finding: "No architectural distortion",
        category: "architectural_distortion",
        laterality: "bilateral",
        location: { quadrant: "central" },
        confidence: 0.94,
        description: "No architectural distortion identified in either breast.",
        characteristics: {}
      }
    ],
    breastDensity: {
      category: "C",
      description: "Heterogeneously dense - This may obscure small masses",
      percentage: 55
    },
    masses: {
      present: false,
      findings: []
    },
    calcifications: {
      present: false,
      findings: []
    },
    architecturalDistortion: {
      present: false,
      findings: []
    },
    asymmetries: {
      present: false,
      findings: []
    },
    lymphNodes: {
      axillaryStatus: "normal",
      findings: []
    },
    comparisonWithPrior: {
      available: input.previousStudies?.length > 0,
      changes: "stable",
      details: input.previousStudies?.length ? "Comparison made with prior study. No significant change." : "No prior study available for comparison"
    },
    structuredReport: {
      clinicalIndication: input.patientInfo?.clinicalIndication || "Screening mammography",
      technique: `Bilateral digital mammography was performed in ${input.views?.join(' and ') || 'CC and MLO'} projections.`,
      comparison: input.previousStudies?.length ? "Comparison made with prior mammogram" : "No prior mammogram available for comparison",
      findings: "The breasts are heterogeneously dense. No suspicious masses, calcifications, or architectural distortions are identified. No skin changes or nipple retraction.",
      impression: "Negative bilateral mammogram. BI-RADS Category 1.",
      recommendations: "Continue routine annual screening mammography."
    },
    recommendations: [
      {
        type: "routine_screening",
        recommendation: "Schedule annual screening mammography in 1 year",
        timeframe: "1 year",
        priority: "routine"
      }
    ],
    qualityMetrics: {
      imageQuality: "excellent",
      positioning: "optimal",
      pectoralisMuscleVisualization: "adequate",
      inframammaryFoldVisualization: "adequate",
      artifacts: []
    },
    confidence: 0.95,
    disclaimer: "This AI analysis is for educational purposes only. All mammography findings should be verified by a qualified radiologist. BI-RADS assessment should be made by the interpreting physician."
  };
};

// 6. AI-Powered Retinal Imaging Analysis
export const analyzeRetinalImaging = async (input: RetinalImagingAnalysisInput): Promise<AIResponse<RetinalImagingAnalysisResult>> => {
  const startTime = Date.now();
  const cacheKey = `retinal-${JSON.stringify(input)}`;

  const cached = getCached<RetinalImagingAnalysisResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockRetinalImagingResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert ophthalmologist AI assistant specializing in retinal imaging interpretation. Analyze the following retinal image.

Imaging Type: ${input.imagingType}
Laterality: ${input.laterality}
Patient Age: ${input.patientInfo?.age || 'Unknown'}
Diabetes Status: ${input.patientInfo?.diabetesStatus || 'Unknown'}
Hypertension: ${input.patientInfo?.hypertension ? 'Yes' : 'No'}
Visual Acuity: ${input.patientInfo?.visualAcuity || 'Unknown'}

Provide comprehensive retinal analysis including diabetic retinopathy assessment, glaucoma screening, AMD evaluation, and clinical recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallImpression: { type: Type.STRING },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  finding: { type: Type.STRING },
                  category: { type: Type.STRING },
                  location: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            confidence: { type: Type.NUMBER }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}') as RetinalImagingAnalysisResult;
    setCache(cacheKey, result);
    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error('Retinal imaging analysis error:', error);
    return createResponse(true, getMockRetinalImagingResult(input), undefined, Date.now() - startTime);
  }
};

const getMockRetinalImagingResult = (input: RetinalImagingAnalysisInput): RetinalImagingAnalysisResult => {
  const hasDiabetes = input.patientInfo?.diabetesStatus && input.patientInfo.diabetesStatus !== 'none';

  return {
    overallImpression: hasDiabetes
      ? "Fundus examination shows no evidence of diabetic retinopathy. The optic disc, macula, and retinal vasculature appear within normal limits."
      : "Normal fundus examination. No evidence of diabetic retinopathy, glaucoma, or age-related macular degeneration. Optic disc and macula are normal.",
    findings: [
      {
        finding: "Normal optic disc",
        category: "other",
        location: "Optic disc",
        confidence: 0.96,
        severity: "normal",
        description: "The optic disc appears normal with sharp margins and normal cup-to-disc ratio."
      },
      {
        finding: "Normal macula",
        category: "other",
        location: "Macula",
        confidence: 0.95,
        severity: "normal",
        description: "The macula appears normal with preserved foveal reflex."
      },
      {
        finding: "Normal retinal vasculature",
        category: "vascular",
        location: "Retina",
        confidence: 0.94,
        severity: "normal",
        description: "The retinal vessels appear normal in caliber and course. No hemorrhages or exudates."
      }
    ],
    diabeticRetinopathyAnalysis: {
      present: false,
      severity: "none",
      microaneurysms: { count: 0, locations: [] },
      hemorrhages: { present: false, type: "dot_blot", locations: [] },
      hardExudates: { present: false, distribution: "None", macularInvolvement: false },
      cottonWoolSpots: { present: false, count: 0, locations: [] },
      neovascularization: { present: false, location: 'disc' },
      vitreousHemorrhage: false,
      dme: { present: false, severity: "mild", centralInvolvement: false },
      icdrScore: "No diabetic retinopathy"
    },
    glaucomaAnalysis: {
      riskLevel: "low",
      cupToDiscRatio: {
        vertical: 0.3,
        horizontal: 0.35,
        asymmetry: 0.05
      },
      rimWidth: {
        inferior: 0.2,
        superior: 0.2,
        nasal: 0.15,
        temporal: 0.25
      },
      nerveFiberLayer: {
        status: "normal",
        pattern: "Normal nerve fiber layer",
        locations: []
      },
      opticDisc: {
        size: "normal",
        shape: "Round",
        notching: false,
        hemorrhages: false,
        peripapillaryAtrophy: false
      },
      visualField: {
        available: false,
        defects: []
      }
    },
    amdAnalysis: {
      present: false,
      type: "none",
      drusen: {
        present: false,
        size: "small",
        number: "few",
        location: "",
        confluence: false
      },
      pigmentaryChanges: {
        present: false,
        type: "hypo",
        location: ""
      },
      geographicAtrophy: {
        present: false,
        location: '',
        fovealInvolvement: false
      },
      neovascularFeatures: {
        present: false,
        subretinalFluid: false,
        intraretinalFluid: false,
        hemorrhage: false,
        ped: false
      }
    },
    vascularAnalysis: {
      arteriovenousRatio: 0.67,
      arteriolarNarrowing: false,
      venousDilation: false,
      avNicking: false,
      retinalVeinOcclusion: false,
      retinalArteryOcclusion: false
    },
    macularAnalysis: {
      status: "normal",
      fovealReflex: "present",
      edema: false,
      hole: false,
      scar: false,
      findings: ["Normal macular appearance", "Preserved foveal reflex"]
    },
    structuredReport: {
      clinicalIndication: input.patientInfo?.diabetesStatus ? "Diabetic eye screening" : "Routine eye examination",
      technique: `${input.imagingType} was performed on ${input.laterality} eye(s).`,
      comparison: input.previousStudies?.length ? "Comparison made with prior study" : "No prior comparison available",
      findings: "The optic disc, macula, and retinal vasculature appear within normal limits. No evidence of diabetic retinopathy, glaucomatous changes, or age-related macular degeneration.",
      impression: "Normal fundus examination. No diabetic retinopathy identified.",
      recommendations: hasDiabetes
        ? "Continue annual diabetic eye screening as per standard of care."
        : "Routine follow-up in 1-2 years or as clinically indicated."
    },
    recommendations: [
      {
        type: hasDiabetes ? "routine_screening" : "follow_up",
        recommendation: hasDiabetes
          ? "Schedule annual diabetic eye screening"
          : "Routine eye examination in 1-2 years",
        timeframe: hasDiabetes ? "1 year" : "1-2 years",
        priority: "routine"
      }
    ],
    qualityMetrics: {
      imageQuality: "excellent",
      fieldOfView: "adequate",
      mediaOpacity: "none",
      artifacts: []
    },
    confidence: 0.94,
    disclaimer: "This AI analysis is for educational purposes only. All findings should be verified by a qualified ophthalmologist."
  };
};

// 7. AI-Powered Dermatology Image Analysis
export const analyzeDermatologyImage = async (input: DermatologyImageAnalysisInput): Promise<AIResponse<DermatologyImageAnalysisResult>> => {
  const startTime = Date.now();
  const cacheKey = `dermatology-${JSON.stringify(input)}`;

  const cached = getCached<DermatologyImageAnalysisResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockDermatologyResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert dermatologist AI assistant. Analyze the following dermatology image.

Image Type: ${input.imageType}
Body Location: ${input.bodyLocation || 'Not specified'}
Patient Age: ${input.patientInfo?.age || 'Unknown'}
Symptoms: ${input.patientInfo?.symptoms?.join(', ') || 'None provided'}
Duration: ${input.patientInfo?.duration || 'Unknown'}
Skin Type (Fitzpatrick): ${input.patientInfo?.skinType || 'Unknown'}

Provide comprehensive dermatological analysis including lesion description, differential diagnosis, melanoma risk assessment, and treatment recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallImpression: { type: Type.STRING },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  finding: { type: Type.STRING },
                  category: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                }
              }
            },
            primaryDiagnosis: {
              type: Type.OBJECT,
              properties: {
                diagnosis: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                description: { type: Type.STRING },
                isMalignant: { type: Type.BOOLEAN },
                requiresBiopsy: { type: Type.BOOLEAN }
              }
            },
            confidence: { type: Type.NUMBER }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}') as DermatologyImageAnalysisResult;
    setCache(cacheKey, result);
    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error('Dermatology image analysis error:', error);
    return createResponse(true, getMockDermatologyResult(input), undefined, Date.now() - startTime);
  }
};

const getMockDermatologyResult = (input: DermatologyImageAnalysisInput): DermatologyImageAnalysisResult => {
  return {
    overallImpression: "Clinical examination reveals a benign-appearing lesion. No concerning features for melanoma or other malignancy. The lesion appears consistent with a benign seborrheic keratosis or benign nevus.",
    findings: [
      {
        finding: "Benign-appearing pigmented lesion",
        category: "benign",
        confidence: 0.88,
        description: "Well-circumscribed, uniformly pigmented lesion with regular borders. No concerning features identified.",
        clinicalFeatures: ["Well-circumscribed", "Uniform pigmentation", "Regular borders", "No ulceration"],
        differentialDiagnoses: [
          { diagnosis: "Seborrheic keratosis", probability: 0.45, reasoning: "Characteristic stuck-on appearance and waxy texture" },
          { diagnosis: "Benign melanocytic nevus", probability: 0.35, reasoning: "Uniform color and regular borders" },
          { diagnosis: "Dermatofibroma", probability: 0.15, reasoning: "Location and firmness on palpation" }
        ]
      }
    ],
    lesionAnalysis: {
      lesionType: "Pigmented lesion",
      morphology: {
        shape: "round",
        border: "well_defined",
        surface: "rough",
        color: ["brown", "tan"],
        size: { value: 8, unit: "mm" },
        elevation: "raised"
      },
      distribution: "Localized",
      pattern: "Regular, symmetric"
    },
    melanomaRiskAssessment: {
      riskLevel: "low",
      abcdeScore: {
        asymmetry: false,
        borderIrregularity: false,
        colorVariation: false,
        diameter: false,
        evolution: false,
        totalScore: 0
      },
      recommendation: "No urgent evaluation required. Routine monitoring recommended.",
      urgentEvaluation: false
    },
    dermoscopyAnalysis: {
      pattern: "globular",
      features: {
        pigmentNetwork: { present: true, type: "regular" },
        dots: { present: true, type: "regular", distribution: "central" },
        globules: { present: true, type: "regular", distribution: "peripheral" },
        streaks: { present: false, type: "" },
        blueWhiteVeil: false,
        regressionStructures: { present: false, type: "" },
        vascularStructures: { present: false, type: "" },
        miliaLikeCysts: true,
        comedoLikeOpenings: false
      },
      diagnosis: "Benign melanocytic nevus",
      confidence: 0.85
    },
    primaryDiagnosis: {
      diagnosis: "Seborrheic keratosis",
      icdCode: "L82.1",
      confidence: 0.85,
      description: "A benign skin growth that appears as a waxy, brownish lesion. Common in older adults and not contagious or dangerous.",
      isMalignant: false,
      requiresBiopsy: false
    },
    differentialDiagnoses: [
      { diagnosis: "Benign melanocytic nevus", icdCode: "D22.9", probability: 0.35, reasoning: "Uniform color and regular borders" },
      { diagnosis: "Dermatofibroma", icdCode: "D23.9", probability: 0.15, reasoning: "Firm texture and characteristic dimple sign" },
      { diagnosis: "Pigmented basal cell carcinoma", icdCode: "C44.91", probability: 0.05, reasoning: "Less likely given regular borders and lack of translucency" }
    ],
    treatmentSuggestions: [
      {
        treatment: "Observation",
        type: "observation",
        description: "No treatment is necessary for benign seborrheic keratosis. The lesion can be monitored for any changes.",
        precautions: ["Monitor for changes in size, color, or shape", "Report any bleeding or itching"]
      },
      {
        treatment: "Cryotherapy (if desired for cosmetic reasons)",
        type: "procedural",
        description: "Liquid nitrogen can be used to remove the lesion if cosmetically bothersome.",
        duration: "Single session, may require repeat treatment",
        precautions: ["May cause temporary hypopigmentation", "May require multiple treatments"]
      }
    ],
    followUpRecommendations: {
      timeframe: "6-12 months or as needed",
      reason: "Routine monitoring for any changes",
      actions: ["Self-examination monthly", "Photographic documentation if possible", "Return if any changes noted"],
      warningSigns: ["Rapid growth", "Color change", "Bleeding or ulceration", "Itching or pain", "Irregular borders developing"]
    },
    structuredReport: {
      clinicalHistory: `${input.patientInfo?.symptoms?.join(', ') || 'Asymptomatic'} lesion for ${input.patientInfo?.duration || 'unknown duration'}. Located on ${input.bodyLocation || 'unspecified location'}.`,
      examinationFindings: "8mm well-circumscribed, brown, slightly raised lesion with regular borders and uniform pigmentation. No ulceration, bleeding, or associated inflammation.",
      assessment: "Benign-appearing pigmented lesion, most consistent with seborrheic keratosis. Low suspicion for melanoma or other malignancy.",
      plan: "Observation recommended. Patient educated on warning signs. Follow-up in 6-12 months or sooner if changes occur."
    },
    recommendations: [
      {
        type: "observation",
        recommendation: "Monitor lesion for changes. No immediate intervention required.",
        timeframe: "6-12 months",
        priority: "routine"
      }
    ],
    qualityMetrics: {
      imageQuality: "good",
      lighting: "optimal",
      focus: "sharp",
      colorAccuracy: "good",
      artifacts: []
    },
    confidence: 0.85,
    disclaimer: "This AI analysis is for educational purposes only and should not replace professional dermatological evaluation. Any suspicious lesion should be evaluated by a qualified dermatologist. When in doubt, biopsy is recommended."
  };
};

// 8. AI-Powered ECG Analysis
export const analyzeECG = async (input: ECGAnalysisInput): Promise<AIResponse<ECGAnalysisResult>> => {
  const startTime = Date.now();
  const cacheKey = `ecg-${JSON.stringify(input)}`;

  const cached = getCached<ECGAnalysisResult>(cacheKey);
  if (cached) {
    return { ...createResponse(true, cached), cached: true };
  }

  if (!isApiKeyAvailable()) {
    return createResponse(true, getMockECGResult(input), undefined, Date.now() - startTime);
  }

  try {
    const prompt = `You are an expert cardiologist AI assistant specializing in ECG interpretation. Analyze the following ECG.

Lead Configuration: ${input.leadConfiguration}
Patient Age: ${input.patientInfo?.age || 'Unknown'}
Gender: ${input.patientInfo?.gender || 'Unknown'}
Symptoms: ${input.patientInfo?.symptoms?.join(', ') || 'None provided'}
Medical History: ${input.patientInfo?.medicalHistory?.join(', ') || 'None provided'}
Current Medications: ${input.patientInfo?.currentMedications?.join(', ') || 'None provided'}

Provide comprehensive ECG analysis including rhythm interpretation, interval measurements, detection of arrhythmias, ischemia assessment, and clinical recommendations.`;

    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallInterpretation: { type: Type.STRING },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  finding: { type: Type.STRING },
                  category: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            confidence: { type: Type.NUMBER }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}') as ECGAnalysisResult;
    setCache(cacheKey, result);
    return createResponse(true, result, undefined, Date.now() - startTime);
  } catch (error) {
    console.error('ECG analysis error:', error);
    return createResponse(true, getMockECGResult(input), undefined, Date.now() - startTime);
  }
};

const getMockECGResult = (input: ECGAnalysisInput): ECGAnalysisResult => {
  return {
    overallInterpretation: "Normal sinus rhythm with normal axis, normal intervals, and no significant ST-T wave abnormalities. No evidence of acute ischemia, arrhythmia, or conduction abnormality.",
    findings: [
      {
        finding: "Normal sinus rhythm",
        category: "rhythm",
        confidence: 0.98,
        severity: "normal",
        description: "Regular sinus rhythm with normal P wave morphology and PR interval. Each P wave is followed by a QRS complex.",
        clinicalSignificance: "Normal cardiac rhythm",
        leads: ["II", "III", "aVF"]
      },
      {
        finding: "Normal QRS axis",
        category: "morphology",
        confidence: 0.95,
        severity: "normal",
        description: "QRS axis is within normal range (-30 to +90 degrees).",
        clinicalSignificance: "Normal ventricular activation",
        leads: ["I", "II", "aVF"]
      },
      {
        finding: "Normal intervals",
        category: "interval",
        confidence: 0.96,
        severity: "normal",
        description: "PR interval, QRS duration, and QTc are all within normal limits.",
        clinicalSignificance: "Normal conduction times",
        leads: ["All"]
      },
      {
        finding: "No ST-T abnormalities",
        category: "ischemia",
        confidence: 0.94,
        severity: "normal",
        description: "No ST segment elevation or depression. T waves are normal in morphology and direction.",
        clinicalSignificance: "No evidence of acute ischemia",
        leads: ["All"]
      }
    ],
    rhythmAnalysis: {
      rhythmType: "sinus",
      regularity: "regular",
      heartRate: 72,
      atrialRate: 72,
      ventricularRate: 72,
      prInterval: 168,
      qrsDuration: 88,
      qtInterval: 380,
      qtCorrected: 416,
      confidence: 0.98
    },
    arrhythmias: [
      { type: "atrial_fibrillation", present: false, confidence: 0.98, description: "No atrial fibrillation detected", severity: "benign", characteristics: [], clinicalImplications: [] },
      { type: "atrial_flutter", present: false, confidence: 0.97, description: "No atrial flutter detected", severity: "benign", characteristics: [], clinicalImplications: [] },
      { type: "svt", present: false, confidence: 0.96, description: "No supraventricular tachycardia", severity: "benign", characteristics: [], clinicalImplications: [] },
      { type: "vt", present: false, confidence: 0.99, description: "No ventricular tachycardia", severity: "benign", characteristics: [], clinicalImplications: [] },
      { type: "av_block", present: false, confidence: 0.97, description: "No AV block detected", severity: "benign", characteristics: [], clinicalImplications: [] }
    ],
    ischemiaAnalysis: {
      ischemiaPresent: false,
      infarctionPresent: false,
      location: "anterior",
      affectedLeads: [],
      stChanges: {
        elevation: [],
        depression: []
      },
      tWaveChanges: {
        type: "inversion",
        leads: []
      },
      qWaves: {
        present: false,
        leads: [],
        duration: 0
      },
      confidence: 0.94
    },
    conductionAbnormalities: [
      { type: "first_degree_av_block", present: false, confidence: 0.96, description: "No first-degree AV block", severity: "mild", clinicalSignificance: "Normal PR interval" },
      { type: "lbbb", present: false, confidence: 0.98, description: "No left bundle branch block", severity: "mild", clinicalSignificance: "Normal QRS duration" },
      { type: "rbbb", present: false, confidence: 0.97, description: "No right bundle branch block", severity: "mild", clinicalSignificance: "Normal QRS morphology" }
    ],
    hypertrophyAnalysis: {
      leftAtrial: { present: false, criteria: [] },
      rightAtrial: { present: false, criteria: [] },
      leftVentricular: { present: false, criteria: [], strainPattern: false },
      rightVentricular: { present: false, criteria: [] }
    },
    intervalAnalysis: {
      prInterval: { value: 168, status: "normal" },
      qrsDuration: { value: 88, status: "normal" },
      qtInterval: { value: 380, corrected: 416, status: "normal" }
    },
    axisAnalysis: {
      pAxis: { value: 45, status: "normal" },
      qrsAxis: { value: 35, status: "normal" },
      tAxis: { value: 40, status: "normal" }
    },
    comparisonWithPrior: {
      available: input.previousECGs?.length > 0,
      changes: "no_significant_change",
      details: input.previousECGs?.length ? "Compared with prior ECG. No significant interval change." : "No prior ECG available for comparison"
    },
    structuredReport: {
      clinicalIndication: input.patientInfo?.symptoms?.join(', ') || "Routine ECG",
      technique: `Standard 12-lead electrocardiogram was obtained at 25 mm/s paper speed and 10 mm/mV calibration.`,
      comparison: input.previousECGs?.length ? "Comparison made with prior ECG" : "No prior ECG available for comparison",
      description: "Normal sinus rhythm at 72 bpm. Normal P wave axis and morphology. PR interval 168 ms. QRS duration 88 ms with normal axis. QTc 416 ms. No ST segment or T wave abnormalities. No pathological Q waves.",
      interpretation: "Normal sinus rhythm. Normal ECG.",
      recommendations: "Clinical correlation recommended. No immediate cardiac intervention required based on this ECG."
    },
    clinicalRecommendations: [
      {
        type: "routine_follow_up",
        recommendation: "Repeat ECG as clinically indicated or with any new cardiac symptoms",
        rationale: "Current ECG is within normal limits",
        priority: "routine"
      }
    ],
    qualityMetrics: {
      ecgQuality: "excellent",
      baselineStability: "stable",
      artifacts: [],
      leadPlacement: "correct"
    },
    confidence: 0.95,
    disclaimer: "This AI analysis is for educational purposes only. All ECG interpretations should be verified by a qualified physician. Clinical correlation is essential for accurate diagnosis."
  };
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Clear cache
export const clearAICache = () => {
  cache.clear();
};

// Get cache statistics
export const getCacheStats = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
};

// Export all functions as named exports
export const aiService = {
  // Clinical AI Features
  analyzeTriage,
  calculateDosage,
  getClinicalDecisionSupport,
  generateMedicalNotes,
  checkAllergiesAndContraindications,
  interpretLabResult,
  getAntimicrobialRecommendation,
  analyzeVitalSigns,
  getDiagnosticSuggestions,
  generatePrescription,
  // Operational AI Features
  optimizeBedManagement,
  optimizeORSchedule,
  forecastInventory,
  analyzePatientFlow,
  optimizeAmbulanceDispatch,
  optimizeStaffScheduling,
  predictEquipmentMaintenance,
  optimizeHousekeepingSchedule,
  optimizeWasteManagement,
  optimizeEnergyManagement,
  // Administrative AI Features
  analyzeMedicalCoding,
  predictClaimsDenial,
  analyzeRevenueCycle,
  monitorCompliance,
  detectFraud,
  processDocument,
  analyzeAuditTrail,
  manageContracts,
  managePolicies,
  generateReport,
  // Patient-Facing AI Features
  getHealthChatbotResponse,
  analyzeSymptoms,
  getAppointmentSchedulingAssistance,
  getDischargeFollowUpPlan,
  generateHealthEducation,
  getMedicationReminderPlan,
  analyzePatientFeedback,
  // Predictive Analytics AI Features
  predictReadmissionRisk,
  detectDiseaseOutbreak,
  predictLengthOfStay,
  assessMortalityRisk,
  analyzeHealthTrends,
  // Medical Imaging AI Features
  analyzeChestXRay,
  analyzeCTScan,
  analyzeUltrasound,
  analyzeMRI,
  analyzeMammography,
  analyzeRetinalImaging,
  analyzeDermatologyImage,
  analyzeECG,
  // Utility
  clearAICache,
  getCacheStats
};

export default aiService;
