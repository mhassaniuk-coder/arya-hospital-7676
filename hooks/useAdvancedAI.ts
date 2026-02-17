/**
 * React hooks for 25 Advanced AI Features
 * Uses the same createAIHook pattern as the existing useAI.ts
 */
import { useState, useCallback } from 'react';
import {
    predictSepsis, SepsisInput,
    checkDrugInteractions, DrugInteractionInput,
    recommendPathway, PathwayInput,
    stratifyRisk, RiskStratificationInput,
    optimizeScheduling, SmartSchedulingInput,
    predictSurgicalRisk, SurgicalRiskInput,
    analyzeRecordsNLP, NLPRecordsInput,
    assessCancerScreening, CancerScreeningInput,
    planNutrition, NutritionPlanInput,
    screenMentalHealth, MentalHealthInput,
    simulatePandemic, PandemicSimInput,
    matchTrialEligibility, TrialMatchInput,
    estimateTreatmentCost, CostEstimateInput,
    analyzeGeneticRisk, GeneticRiskInput,
    optimizeEmergencyResponse, EmergencyResponseInput,
    analyzePopulationHealth, PopulationHealthInput,
    mapPatientJourney, PatientJourneyInput,
    manageChronicDisease, ChronicDiseaseInput,
    assessWound, WoundAssessmentInput,
    convertSpeechToSOAP, SpeechToSOAPInput,
    autoCodeICDCPT, AutoCoderInput,
    generateRadiologyReport, RadReportInput,
    assessPharmacovigilance, PharmacovigilanceInput,
    predictStaffing, PredictiveStaffingInput,
    analyzeQualityMetrics, QualityMetricsInput,
} from '../services/advancedAiService';

// Generic hook factory for backend AI calls
function createAdvancedAIHook<TInput>(
    apiFn: (input: TInput) => Promise<any>
) {
    return () => {
        const [data, setData] = useState<any>(null);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);

        const execute = useCallback(async (input: TInput) => {
            setLoading(true);
            setError(null);
            try {
                const result = await apiFn(input);
                setData(result);
                return result;
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'An error occurred';
                setError(msg);
                return null;
            } finally {
                setLoading(false);
            }
        }, []);

        const reset = useCallback(() => {
            setData(null);
            setError(null);
        }, []);

        return { data, loading, error, execute, reset };
    };
}

// ═══════════════════════════════════════════════
// 25 Advanced AI Hooks
// ═══════════════════════════════════════════════

export const useSepsisPredictor = createAdvancedAIHook<SepsisInput>(predictSepsis);
export const useDrugInteractionChecker = createAdvancedAIHook<DrugInteractionInput>(checkDrugInteractions);
export const useClinicalPathway = createAdvancedAIHook<PathwayInput>(recommendPathway);
export const useRiskStratification = createAdvancedAIHook<RiskStratificationInput>(stratifyRisk);
export const useSmartScheduling = createAdvancedAIHook<SmartSchedulingInput>(optimizeScheduling);
export const useSurgicalRiskPredictor = createAdvancedAIHook<SurgicalRiskInput>(predictSurgicalRisk);
export const useNLPRecordsAnalyzer = createAdvancedAIHook<NLPRecordsInput>(analyzeRecordsNLP);
export const useCancerScreening = createAdvancedAIHook<CancerScreeningInput>(assessCancerScreening);
export const useNutritionPlanner = createAdvancedAIHook<NutritionPlanInput>(planNutrition);
export const useMentalHealthScreening = createAdvancedAIHook<MentalHealthInput>(screenMentalHealth);
export const usePandemicSimulation = createAdvancedAIHook<PandemicSimInput>(simulatePandemic);
export const useTrialEligibility = createAdvancedAIHook<TrialMatchInput>(matchTrialEligibility);
export const useTreatmentCostEstimator = createAdvancedAIHook<CostEstimateInput>(estimateTreatmentCost);
export const useGeneticRiskAnalysis = createAdvancedAIHook<GeneticRiskInput>(analyzeGeneticRisk);
export const useEmergencyResponseOptimizer = createAdvancedAIHook<EmergencyResponseInput>(optimizeEmergencyResponse);
export const usePopulationHealthAnalytics = createAdvancedAIHook<PopulationHealthInput>(analyzePopulationHealth);
export const usePatientJourneyMapper = createAdvancedAIHook<PatientJourneyInput>(mapPatientJourney);
export const useChronicDiseaseManager = createAdvancedAIHook<ChronicDiseaseInput>(manageChronicDisease);
export const useWoundAssessment = createAdvancedAIHook<WoundAssessmentInput>(assessWound);
export const useSpeechToSOAP = createAdvancedAIHook<SpeechToSOAPInput>(convertSpeechToSOAP);
export const useICDAutoCoder = createAdvancedAIHook<AutoCoderInput>(autoCodeICDCPT);
export const useRadiologyReportGenerator = createAdvancedAIHook<RadReportInput>(generateRadiologyReport);
export const usePharmacovigilance = createAdvancedAIHook<PharmacovigilanceInput>(assessPharmacovigilance);
export const usePredictiveStaffing = createAdvancedAIHook<PredictiveStaffingInput>(predictStaffing);
export const useQualityMetricsAnalyzer = createAdvancedAIHook<QualityMetricsInput>(analyzeQualityMetrics);

// ═══════════════════════════════════════════════
// Combined hook for all 25 advanced features
// ═══════════════════════════════════════════════
export const useAllAdvancedAI = () => {
    const sepsis = useSepsisPredictor();
    const drugInteractions = useDrugInteractionChecker();
    const pathway = useClinicalPathway();
    const riskStrat = useRiskStratification();
    const scheduling = useSmartScheduling();
    const surgicalRisk = useSurgicalRiskPredictor();
    const nlpRecords = useNLPRecordsAnalyzer();
    const cancerScreening = useCancerScreening();
    const nutrition = useNutritionPlanner();
    const mentalHealth = useMentalHealthScreening();
    const pandemic = usePandemicSimulation();
    const trialMatch = useTrialEligibility();
    const costEstimate = useTreatmentCostEstimator();
    const geneticRisk = useGeneticRiskAnalysis();
    const emergencyResponse = useEmergencyResponseOptimizer();
    const populationHealth = usePopulationHealthAnalytics();
    const patientJourney = usePatientJourneyMapper();
    const chronicDisease = useChronicDiseaseManager();
    const wound = useWoundAssessment();
    const speechToSOAP = useSpeechToSOAP();
    const autoCoder = useICDAutoCoder();
    const radReport = useRadiologyReportGenerator();
    const pharma = usePharmacovigilance();
    const staffing = usePredictiveStaffing();
    const quality = useQualityMetricsAnalyzer();

    const resetAll = useCallback(() => {
        sepsis.reset(); drugInteractions.reset(); pathway.reset(); riskStrat.reset();
        scheduling.reset(); surgicalRisk.reset(); nlpRecords.reset(); cancerScreening.reset();
        nutrition.reset(); mentalHealth.reset(); pandemic.reset(); trialMatch.reset();
        costEstimate.reset(); geneticRisk.reset(); emergencyResponse.reset(); populationHealth.reset();
        patientJourney.reset(); chronicDisease.reset(); wound.reset(); speechToSOAP.reset();
        autoCoder.reset(); radReport.reset(); pharma.reset(); staffing.reset(); quality.reset();
    }, []);

    return {
        sepsis, drugInteractions, pathway, riskStrat, scheduling,
        surgicalRisk, nlpRecords, cancerScreening, nutrition, mentalHealth,
        pandemic, trialMatch, costEstimate, geneticRisk, emergencyResponse,
        populationHealth, patientJourney, chronicDisease, wound, speechToSOAP,
        autoCoder, radReport, pharma, staffing, quality,
        resetAll,
    };
};
