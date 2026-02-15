import { useState, useCallback } from 'react';
import {
  TriageInput,
  TriageResult,
  DosageInput,
  DosageResult,
  CDSSInput,
  CDSSResult,
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
  DiagnosticInput,
  DiagnosticResult,
  PrescriptionInput,
  PrescriptionResult,
  AIResponse,
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
} from '../types';
import {
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
  // Operational AI Functions
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
  // Administrative AI Functions
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
  // Patient-Facing AI Functions
  getHealthChatbotResponse,
  analyzeSymptoms,
  getAppointmentSchedulingAssistance,
  getDischargeFollowUpPlan,
  generateHealthEducation,
  getMedicationReminderPlan,
  analyzePatientFeedback,
  // Predictive Analytics AI Functions
  predictReadmissionRisk,
  detectDiseaseOutbreak,
  predictLengthOfStay,
  assessMortalityRisk,
  analyzeHealthTrends,
  // Medical Imaging AI Functions
  analyzeChestXRay,
  analyzeCTScan,
  analyzeUltrasound,
  analyzeMRI,
  analyzeMammography,
  analyzeRetinalImaging,
  analyzeDermatologyImage,
  analyzeECG,
} from '../services/aiService';

// Generic AI hook factory
function createAIHook<TInput, TResult>(
  aiFunction: (input: TInput) => Promise<AIResponse<TResult>>
) {
  return () => {
    const [data, setData] = useState<TResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cached, setCached] = useState(false);

    const execute = useCallback(async (input: TInput) => {
      setLoading(true);
      setError(null);
      setCached(false);

      try {
        const response = await aiFunction(input);
        if (response.success && response.data) {
          setData(response.data);
          setCached(response.cached || false);
        } else {
          setError(response.error || 'An error occurred');
        }
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        return { success: false, error: errorMessage, timestamp: new Date().toISOString() };
      } finally {
        setLoading(false);
      }
    }, []);

    const reset = useCallback(() => {
      setData(null);
      setError(null);
      setCached(false);
    }, []);

    return { data, loading, error, cached, execute, reset };
  };
}

// 1. Triage Assistant Hook
export const useTriageAssistant = createAIHook<TriageInput, TriageResult>(analyzeTriage);

// 2. Dosage Calculator Hook
export const useDosageCalculator = createAIHook<DosageInput, DosageResult>(calculateDosage);

// 3. CDSS Hook
export const useCDSS = createAIHook<CDSSInput, CDSSResult>(getClinicalDecisionSupport);

// 4. Medical Scribe Hook
export const useMedicalScribe = createAIHook<ScribeInput, ScribeResult>(generateMedicalNotes);

// 5. Allergy Check Hook
export const useAllergyCheck = createAIHook<AllergyCheckInput, AllergyCheckResult>(checkAllergiesAndContraindications);

// 6. Lab Interpretation Hook
export const useLabInterpretation = createAIHook<LabInterpretationInput, LabInterpretationResult>(interpretLabResult);

// 7. Antimicrobial Stewardship Hook
export const useAntimicrobialStewardship = createAIHook<AntimicrobialInput, AntimicrobialResult>(getAntimicrobialRecommendation);

// 8. Vital Signs Monitor Hook
export const useVitalSignsMonitor = createAIHook<VitalSignsAnalysisInput, VitalSignsAnalysisResult>(analyzeVitalSigns);

// 9. Diagnostic Engine Hook
export const useDiagnosticEngine = createAIHook<DiagnosticInput, DiagnosticResult>(getDiagnosticSuggestions);

// 10. Prescription Generator Hook
export const usePrescriptionGenerator = createAIHook<PrescriptionInput, PrescriptionResult>(generatePrescription);

// ============================================
// OPERATIONAL AI HOOKS - Batch 2
// ============================================

// 11. Bed Management Optimizer Hook
export const useBedManagementOptimizer = createAIHook<BedManagementInput, BedManagementResult>(optimizeBedManagement);

// 12. OR Scheduler Hook
export const useORScheduler = createAIHook<ORSchedulerInput, ORSchedulerResult>(optimizeORSchedule);

// 13. Inventory Forecasting Hook
export const useInventoryForecast = createAIHook<InventoryForecastInput, InventoryForecastResult>(forecastInventory);

// 14. Patient Flow Analytics Hook
export const usePatientFlowAnalytics = createAIHook<PatientFlowInput, PatientFlowResult>(analyzePatientFlow);

// 15. Ambulance Dispatch Hook
export const useAmbulanceDispatch = createAIHook<AmbulanceDispatchInput, AmbulanceDispatchResult>(optimizeAmbulanceDispatch);

// 16. Staff Scheduling Optimizer Hook
export const useStaffSchedulingOptimizer = createAIHook<StaffSchedulingInput, StaffSchedulingResult>(optimizeStaffScheduling);

// 17. Equipment Maintenance Predictor Hook
export const useEquipmentMaintenancePredictor = createAIHook<EquipmentMaintenanceInput, EquipmentMaintenanceResult>(predictEquipmentMaintenance);

// 18. Housekeeping Scheduler Hook
export const useHousekeepingScheduler = createAIHook<HousekeepingSchedulingInput, HousekeepingSchedulingResult>(optimizeHousekeepingSchedule);

// 19. Waste Management Hook
export const useWasteManagement = createAIHook<WasteManagementInput, WasteManagementResult>(optimizeWasteManagement);

// 20. Energy Management Hook
export const useEnergyManagement = createAIHook<EnergyManagementInput, EnergyManagementResult>(optimizeEnergyManagement);

// ============================================
// ADMINISTRATIVE AI HOOKS - Batch 3
// ============================================

// 21. Medical Coding Assistant Hook
export const useMedicalCodingAssistant = createAIHook<MedicalCodingInput, MedicalCodingResult>(analyzeMedicalCoding);

// 22. Claims Denial Predictor Hook
export const useClaimsDenialPredictor = createAIHook<ClaimsDenialInput, ClaimsDenialResult>(predictClaimsDenial);

// 23. Revenue Cycle Analytics Hook
export const useRevenueCycleAnalytics = createAIHook<RevenueCycleInput, RevenueCycleResult>(analyzeRevenueCycle);

// 24. Compliance Monitoring Hook
export const useComplianceMonitoring = createAIHook<ComplianceMonitoringInput, ComplianceMonitoringResult>(monitorCompliance);

// 25. Fraud Detection Hook
export const useFraudDetection = createAIHook<FraudDetectionInput, FraudDetectionResult>(detectFraud);

// 26. Document Processing Hook
export const useDocumentProcessing = createAIHook<DocumentProcessingInput, DocumentProcessingResult>(processDocument);

// 27. Audit Trail Analysis Hook
export const useAuditTrailAnalysis = createAIHook<AuditTrailInput, AuditTrailResult>(analyzeAuditTrail);

// 28. Contract Management Hook
export const useContractManagement = createAIHook<ContractManagementInput, ContractManagementResult>(manageContracts);

// 29. Policy Management Hook
export const usePolicyManagement = createAIHook<PolicyManagementInput, PolicyManagementResult>(managePolicies);

// 30. Reporting Assistant Hook
export const useReportingAssistant = createAIHook<ReportingInput, ReportingResult>(generateReport);

// ============================================
// PATIENT-FACING AI HOOKS - Batch 4
// ============================================

// 31. Health Chatbot Hook
export const useHealthChatbot = createAIHook<HealthChatbotInput, HealthChatbotResult>(getHealthChatbotResponse);

// 32. Symptom Checker Hook
export const useSymptomChecker = createAIHook<SymptomCheckerInput, SymptomCheckerResult>(analyzeSymptoms);

// 33. Appointment Scheduling Assistant Hook
export const useAppointmentSchedulingAssistant = createAIHook<AppointmentSchedulingInput, AppointmentSchedulingResult>(getAppointmentSchedulingAssistance);

// 34. Discharge Follow-Up Hook
export const useDischargeFollowUp = createAIHook<DischargeFollowUpInput, DischargeFollowUpResult>(getDischargeFollowUpPlan);

// 35. Health Education Generator Hook
export const useHealthEducationGenerator = createAIHook<HealthEducationInput, HealthEducationResult>(generateHealthEducation);

// 36. Medication Reminder Hook
export const useMedicationReminder = createAIHook<MedicationReminderInput, MedicationReminderResult>(getMedicationReminderPlan);

// 37. Patient Feedback Analyzer Hook
export const usePatientFeedbackAnalyzer = createAIHook<PatientFeedbackInput, PatientFeedbackResult>(analyzePatientFeedback);

// ============================================
// PREDICTIVE ANALYTICS AI HOOKS - Batch 5
// ============================================

// 38. Readmission Risk Predictor Hook
export const useReadmissionRiskPredictor = createAIHook<ReadmissionRiskInput, ReadmissionRiskResult>(predictReadmissionRisk);

// 39. Disease Outbreak Detection Hook
export const useOutbreakDetection = createAIHook<OutbreakDetectionInput, OutbreakDetectionResult>(detectDiseaseOutbreak);

// 40. Length of Stay Predictor Hook
export const useLengthOfStayPredictor = createAIHook<LengthOfStayInput, LengthOfStayResult>(predictLengthOfStay);

// 41. Mortality Risk Assessment Hook
export const useMortalityRiskAssessment = createAIHook<MortalityRiskInput, MortalityRiskResult>(assessMortalityRisk);

// 42. Health Trend Analyzer Hook
export const useHealthTrendAnalyzer = createAIHook<HealthTrendInput, HealthTrendResult>(analyzeHealthTrends);

// Combined hook for multiple AI features
export const useAIFeatures = () => {
  const triage = useTriageAssistant();
  const dosage = useDosageCalculator();
  const cdss = useCDSS();
  const scribe = useMedicalScribe();
  const allergy = useAllergyCheck();
  const lab = useLabInterpretation();
  const antimicrobial = useAntimicrobialStewardship();
  const vitals = useVitalSignsMonitor();
  const diagnostic = useDiagnosticEngine();
  const prescription = usePrescriptionGenerator();

  const resetAll = useCallback(() => {
    triage.reset();
    dosage.reset();
    cdss.reset();
    scribe.reset();
    allergy.reset();
    lab.reset();
    antimicrobial.reset();
    vitals.reset();
    diagnostic.reset();
    prescription.reset();
  }, [triage, dosage, cdss, scribe, allergy, lab, antimicrobial, vitals, diagnostic, prescription]);

  return {
    triage,
    dosage,
    cdss,
    scribe,
    allergy,
    lab,
    antimicrobial,
    vitals,
    diagnostic,
    prescription,
    resetAll,
  };
};

// Combined hook for operational AI features
export const useOperationalAIFeatures = () => {
  const bedManagement = useBedManagementOptimizer();
  const orScheduler = useORScheduler();
  const inventoryForecast = useInventoryForecast();
  const patientFlow = usePatientFlowAnalytics();
  const ambulanceDispatch = useAmbulanceDispatch();
  const staffScheduling = useStaffSchedulingOptimizer();
  const equipmentMaintenance = useEquipmentMaintenancePredictor();
  const housekeeping = useHousekeepingScheduler();
  const wasteManagement = useWasteManagement();
  const energyManagement = useEnergyManagement();

  const resetAll = useCallback(() => {
    bedManagement.reset();
    orScheduler.reset();
    inventoryForecast.reset();
    patientFlow.reset();
    ambulanceDispatch.reset();
    staffScheduling.reset();
    equipmentMaintenance.reset();
    housekeeping.reset();
    wasteManagement.reset();
    energyManagement.reset();
  }, [bedManagement, orScheduler, inventoryForecast, patientFlow, ambulanceDispatch, staffScheduling, equipmentMaintenance, housekeeping, wasteManagement, energyManagement]);

  return {
    bedManagement,
    orScheduler,
    inventoryForecast,
    patientFlow,
    ambulanceDispatch,
    staffScheduling,
    equipmentMaintenance,
    housekeeping,
    wasteManagement,
    energyManagement,
    resetAll,
  };
};

// Combined hook for administrative AI features
export const useAdministrativeAIFeatures = () => {
  const medicalCoding = useMedicalCodingAssistant();
  const claimsDenial = useClaimsDenialPredictor();
  const revenueCycle = useRevenueCycleAnalytics();
  const compliance = useComplianceMonitoring();
  const fraudDetection = useFraudDetection();
  const documentProcessing = useDocumentProcessing();
  const auditTrail = useAuditTrailAnalysis();
  const contractManagement = useContractManagement();
  const policyManagement = usePolicyManagement();
  const reporting = useReportingAssistant();

  const resetAll = useCallback(() => {
    medicalCoding.reset();
    claimsDenial.reset();
    revenueCycle.reset();
    compliance.reset();
    fraudDetection.reset();
    documentProcessing.reset();
    auditTrail.reset();
    contractManagement.reset();
    policyManagement.reset();
    reporting.reset();
  }, [medicalCoding, claimsDenial, revenueCycle, compliance, fraudDetection, documentProcessing, auditTrail, contractManagement, policyManagement, reporting]);

  return {
    medicalCoding,
    claimsDenial,
    revenueCycle,
    compliance,
    fraudDetection,
    documentProcessing,
    auditTrail,
    contractManagement,
    policyManagement,
    reporting,
    resetAll,
  };
};

// Combined hook for patient-facing AI features
export const usePatientFacingAIFeatures = () => {
  const healthChatbot = useHealthChatbot();
  const symptomChecker = useSymptomChecker();
  const appointmentScheduling = useAppointmentSchedulingAssistant();
  const dischargeFollowUp = useDischargeFollowUp();
  const healthEducation = useHealthEducationGenerator();
  const medicationReminder = useMedicationReminder();
  const patientFeedback = usePatientFeedbackAnalyzer();

  const resetAll = useCallback(() => {
    healthChatbot.reset();
    symptomChecker.reset();
    appointmentScheduling.reset();
    dischargeFollowUp.reset();
    healthEducation.reset();
    medicationReminder.reset();
    patientFeedback.reset();
  }, [healthChatbot, symptomChecker, appointmentScheduling, dischargeFollowUp, healthEducation, medicationReminder, patientFeedback]);

  return {
    healthChatbot,
    symptomChecker,
    appointmentScheduling,
    dischargeFollowUp,
    healthEducation,
    medicationReminder,
    patientFeedback,
    resetAll,
  };
};

// Combined hook for predictive analytics AI features
export const usePredictiveAnalyticsAIFeatures = () => {
  const readmissionRisk = useReadmissionRiskPredictor();
  const outbreakDetection = useOutbreakDetection();
  const lengthOfStay = useLengthOfStayPredictor();
  const mortalityRisk = useMortalityRiskAssessment();
  const healthTrends = useHealthTrendAnalyzer();

  const resetAll = useCallback(() => {
    readmissionRisk.reset();
    outbreakDetection.reset();
    lengthOfStay.reset();
    mortalityRisk.reset();
    healthTrends.reset();
  }, [readmissionRisk, outbreakDetection, lengthOfStay, mortalityRisk, healthTrends]);

  return {
    readmissionRisk,
    outbreakDetection,
    lengthOfStay,
    mortalityRisk,
    healthTrends,
    resetAll,
  };
};

// ============================================
// Medical Imaging AI Hooks
// ============================================

// 1. Chest X-Ray Analysis Hook
export const useChestXRayAnalysis = createAIHook<ChestXRayAnalysisInput, ChestXRayAnalysisResult>(analyzeChestXRay);

// 2. CT Scan Analysis Hook
export const useCTScanAnalysis = createAIHook<CTScanAnalysisInput, CTScanAnalysisResult>(analyzeCTScan);

// 3. Ultrasound Analysis Hook
export const useUltrasoundAnalysis = createAIHook<UltrasoundAnalysisInput, UltrasoundAnalysisResult>(analyzeUltrasound);

// 4. MRI Analysis Hook
export const useMRIAnalysis = createAIHook<MRIAnalysisInput, MRIAnalysisResult>(analyzeMRI);

// 5. Mammography Analysis Hook
export const useMammographyAnalysis = createAIHook<MammographyAnalysisInput, MammographyAnalysisResult>(analyzeMammography);

// 6. Retinal Imaging Analysis Hook
export const useRetinalImagingAnalysis = createAIHook<RetinalImagingAnalysisInput, RetinalImagingAnalysisResult>(analyzeRetinalImaging);

// 7. Dermatology Image Analysis Hook
export const useDermatologyImageAnalysis = createAIHook<DermatologyImageAnalysisInput, DermatologyImageAnalysisResult>(analyzeDermatologyImage);

// 8. ECG Analysis Hook
export const useECGAnalysis = createAIHook<ECGAnalysisInput, ECGAnalysisResult>(analyzeECG);

// Combined hook for medical imaging AI features
export const useMedicalImagingAIFeatures = () => {
  const chestXRay = useChestXRayAnalysis();
  const ctScan = useCTScanAnalysis();
  const ultrasound = useUltrasoundAnalysis();
  const mri = useMRIAnalysis();
  const mammography = useMammographyAnalysis();
  const retinalImaging = useRetinalImagingAnalysis();
  const dermatology = useDermatologyImageAnalysis();
  const ecg = useECGAnalysis();

  const resetAll = useCallback(() => {
    chestXRay.reset();
    ctScan.reset();
    ultrasound.reset();
    mri.reset();
    mammography.reset();
    retinalImaging.reset();
    dermatology.reset();
    ecg.reset();
  }, [chestXRay, ctScan, ultrasound, mri, mammography, retinalImaging, dermatology, ecg]);

  return {
    chestXRay,
    ctScan,
    ultrasound,
    mri,
    mammography,
    retinalImaging,
    dermatology,
    ecg,
    resetAll,
  };
};

export default {
  // Clinical AI Hooks
  useTriageAssistant,
  useDosageCalculator,
  useCDSS,
  useMedicalScribe,
  useAllergyCheck,
  useLabInterpretation,
  useAntimicrobialStewardship,
  useVitalSignsMonitor,
  useDiagnosticEngine,
  usePrescriptionGenerator,
  // Operational AI Hooks
  useBedManagementOptimizer,
  useORScheduler,
  useInventoryForecast,
  usePatientFlowAnalytics,
  useAmbulanceDispatch,
  useStaffSchedulingOptimizer,
  useEquipmentMaintenancePredictor,
  useHousekeepingScheduler,
  useWasteManagement,
  useEnergyManagement,
  // Administrative AI Hooks
  useMedicalCodingAssistant,
  useClaimsDenialPredictor,
  useRevenueCycleAnalytics,
  useComplianceMonitoring,
  useFraudDetection,
  useDocumentProcessing,
  useAuditTrailAnalysis,
  useContractManagement,
  usePolicyManagement,
  useReportingAssistant,
  // Patient-Facing AI Hooks
  useHealthChatbot,
  useSymptomChecker,
  useAppointmentSchedulingAssistant,
  useDischargeFollowUp,
  useHealthEducationGenerator,
  useMedicationReminder,
  usePatientFeedbackAnalyzer,
  // Predictive Analytics AI Hooks
  useReadmissionRiskPredictor,
  useOutbreakDetection,
  useLengthOfStayPredictor,
  useMortalityRiskAssessment,
  useHealthTrendAnalyzer,
  // Medical Imaging AI Hooks
  useChestXRayAnalysis,
  useCTScanAnalysis,
  useUltrasoundAnalysis,
  useMRIAnalysis,
  useMammographyAnalysis,
  useRetinalImagingAnalysis,
  useDermatologyImageAnalysis,
  useECGAnalysis,
  // Combined hooks
  useAIFeatures,
  useOperationalAIFeatures,
  useAdministrativeAIFeatures,
  usePatientFacingAIFeatures,
  usePredictiveAnalyticsAIFeatures,
  useMedicalImagingAIFeatures,
};
