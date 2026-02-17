"""
25 Advanced AI Features for NexusHealth HMS
Each endpoint provides sophisticated AI-powered analysis via Gemini.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.config import get_settings

router = APIRouter(prefix="/api/ai/advanced", tags=["Advanced AI Features"])
settings = get_settings()


# ── Shared Gemini caller ──
async def _gemini(prompt: str) -> dict:
    api_key = settings.GEMINI_API_KEY
    # Check for missing or placeholder key
    if not api_key or "PLACEHOLDER" in api_key:
        import json
        import random
        
        # Default mock response
        mock_content = {
            "note": "This is a MOCK response. Valid GEMINI_API_KEY not found in .env.",
            "analysis": "AI analysis simulation in progress...",
            "confidence": 0.99
        }

        # Simple keyword matching for more realistic demos
        p_lower = prompt.lower()
        if "sepsis" in p_lower:
            mock_content.update({
                "risk_level": "Moderate",
                "qsofa_score": 1,
                "sirs_criteria": 2,
                "recommendation": "Monitor vitals q1h, consider lactate re-check."
            })
        elif "drug" in p_lower:
            mock_content = [{"interaction": "Major", "severity": "High", "description": "Simulated interaction detected.", "recommendation": "Monitor closely."}]
        elif "risk" in p_lower:
            mock_content.update({"risk_score": 75, "risk_category": "High", "factors": ["Age", "Comorbidities"]})
        elif "schedule" in p_lower:
            mock_content = {"optimized_slots": ["09:00", "09:30", "10:15"], "efficiency_gain": "15%"}

        # If strict JSON requested, return JSON string
        if "Respond in JSON" in prompt or "Respond in structured JSON" in prompt:
            return {"status": "mock", "response": json.dumps(mock_content, indent=2)}
            
        return {"status": "mock", "response": "Mock AI Response: Configure GEMINI_API_KEY in .env for real analysis."}

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        resp = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
        return {"status": "success", "response": resp.text}
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {"status": "error", "response": f"AI Error: {str(e)}"}


# ═══════════════════════════════════════════════
# 1. SEPSIS EARLY WARNING PREDICTOR
# ═══════════════════════════════════════════════
class SepsisInput(BaseModel):
    patient_name: str
    temperature: float
    heart_rate: int
    respiratory_rate: int
    wbc_count: Optional[float] = None
    blood_pressure_systolic: Optional[int] = None
    lactate_level: Optional[float] = None
    mental_status: Optional[str] = None

@router.post("/sepsis-predictor")
async def sepsis_predictor(data: SepsisInput):
    prompt = f"""You are a sepsis early warning AI system. Analyze these vitals for sepsis risk:
    Patient: {data.patient_name}
    Temperature: {data.temperature}°C, HR: {data.heart_rate} bpm, RR: {data.respiratory_rate}/min
    WBC: {data.wbc_count}, SBP: {data.blood_pressure_systolic}, Lactate: {data.lactate_level}
    Mental Status: {data.mental_status}
    
    Calculate qSOFA score, SIRS criteria, and provide:
    1. Sepsis risk level (Low/Moderate/High/Critical)
    2. qSOFA score breakdown
    3. SIRS criteria met
    4. Recommended interventions (antibiotics, cultures, IV fluids)
    5. Time-critical actions
    Respond in structured JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 2. DRUG-DRUG INTERACTION CHECKER
# ═══════════════════════════════════════════════
class DrugInteractionInput(BaseModel):
    medications: list[str]
    patient_age: Optional[int] = None
    patient_weight: Optional[float] = None
    renal_function: Optional[str] = None
    hepatic_function: Optional[str] = None

@router.post("/drug-interactions")
async def drug_interaction_checker(data: DrugInteractionInput):
    meds = ", ".join(data.medications)
    prompt = f"""You are a clinical pharmacology AI. Analyze drug-drug interactions:
    Medications: {meds}
    Patient Age: {data.patient_age}, Weight: {data.patient_weight}kg
    Renal: {data.renal_function}, Hepatic: {data.hepatic_function}
    
    For each pair, provide:
    1. Interaction severity (None/Minor/Moderate/Major/Contraindicated)
    2. Mechanism of interaction
    3. Clinical significance
    4. Management recommendations
    5. Alternative medications if contraindicated
    Respond in JSON with an interactions array."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 3. CLINICAL PATHWAY RECOMMENDER
# ═══════════════════════════════════════════════
class PathwayInput(BaseModel):
    diagnosis: str
    patient_age: int
    comorbidities: list[str] = []
    severity: Optional[str] = None
    insurance_type: Optional[str] = None

@router.post("/clinical-pathway")
async def clinical_pathway_recommender(data: PathwayInput):
    comorbid = ", ".join(data.comorbidities) if data.comorbidities else "None"
    prompt = f"""You are a clinical pathway optimization AI. Design an evidence-based care pathway:
    Diagnosis: {data.diagnosis}, Severity: {data.severity}
    Patient Age: {data.patient_age}, Comorbidities: {comorbid}
    
    Provide a structured pathway with:
    1. Day-by-day treatment plan (milestones + interventions)
    2. Expected length of stay
    3. Key decision points
    4. Lab/imaging schedule
    5. Medication protocol
    6. Discharge criteria
    7. Follow-up plan
    8. Cost-quality optimization notes
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 4. PATIENT RISK STRATIFICATION ENGINE
# ═══════════════════════════════════════════════
class RiskStratificationInput(BaseModel):
    patient_name: str
    age: int
    gender: str
    diagnoses: list[str]
    medications: list[str] = []
    lab_results: Optional[dict] = None
    social_factors: Optional[dict] = None

@router.post("/risk-stratification")
async def risk_stratification(data: RiskStratificationInput):
    prompt = f"""You are a patient risk stratification AI. Perform comprehensive risk assessment:
    Patient: {data.patient_name}, Age: {data.age}, Gender: {data.gender}
    Diagnoses: {data.diagnoses}, Medications: {data.medications}
    Labs: {data.lab_results}, Social Factors: {data.social_factors}
    
    Provide multi-dimensional risk scores:
    1. 30-day mortality risk (0-100%)
    2. Fall risk score (Morse scale)
    3. Pressure ulcer risk (Braden scale)
    4. VTE risk (Padua score)
    5. Malnutrition risk
    6. Polypharmacy risk
    7. Overall acuity level (1-5)
    8. Personalized interventions for each risk
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 5. AI SMART SCHEDULING OPTIMIZER
# ═══════════════════════════════════════════════
class SmartSchedulingInput(BaseModel):
    department: str
    date: str
    existing_appointments: list[dict] = []
    available_doctors: list[str] = []
    patient_priorities: list[dict] = []

@router.post("/smart-scheduling")
async def smart_scheduling(data: SmartSchedulingInput):
    prompt = f"""You are a hospital scheduling optimization AI. Optimize the schedule:
    Department: {data.department}, Date: {data.date}
    Existing Appointments: {data.existing_appointments}
    Available Doctors: {data.available_doctors}
    Patient Priorities: {data.patient_priorities}
    
    Provide:
    1. Optimized schedule with time slots
    2. Doctor-patient assignments
    3. Buffer times for emergencies
    4. Predicted wait times per patient
    5. Utilization percentage per doctor
    6. Bottleneck identification
    7. Overbooking recommendations
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 6. SURGICAL COMPLICATION PREDICTOR
# ═══════════════════════════════════════════════
class SurgicalRiskInput(BaseModel):
    procedure: str
    patient_age: int
    bmi: Optional[float] = None
    asa_class: Optional[int] = None
    comorbidities: list[str] = []
    previous_surgeries: list[str] = []
    anesthesia_type: Optional[str] = None

@router.post("/surgical-risk")
async def surgical_risk_predictor(data: SurgicalRiskInput):
    prompt = f"""You are a surgical risk assessment AI. Predict complications:
    Procedure: {data.procedure}
    Patient: Age {data.patient_age}, BMI {data.bmi}, ASA Class {data.asa_class}
    Comorbidities: {data.comorbidities}
    Previous Surgeries: {data.previous_surgeries}
    Anesthesia: {data.anesthesia_type}
    
    Provide:
    1. Overall complication risk (Low/Moderate/High)
    2. Specific risks: SSI, DVT/PE, cardiac, respiratory, bleeding
    3. ACS-NSQIP estimated morbidity
    4. Pre-op optimization recommendations
    5. Intra-op precautions
    6. Post-op monitoring priorities
    7. Enhanced recovery protocol suggestions
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 7. NLP MEDICAL RECORDS ANALYZER
# ═══════════════════════════════════════════════
class NLPRecordsInput(BaseModel):
    clinical_text: str
    extract_entities: bool = True
    summarize: bool = True
    identify_negations: bool = True

@router.post("/nlp-records")
async def nlp_records_analyzer(data: NLPRecordsInput):
    prompt = f"""You are a medical NLP AI. Analyze this clinical text:
    "{data.clinical_text}"
    
    Extract and provide:
    1. Named entities: medications, diagnoses, procedures, anatomical sites, lab values
    2. Temporal relationships between events
    3. Negated findings (what was ruled out)
    4. Assertion status for each finding (present/absent/possible/conditional)
    5. Structured summary in SOAP format
    6. ICD-10 codes for identified conditions
    7. CPT codes for identified procedures
    8. Key clinical concerns flagged
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 8. CANCER SCREENING RISK ASSESSOR
# ═══════════════════════════════════════════════
class CancerScreeningInput(BaseModel):
    patient_age: int
    gender: str
    family_history: list[str] = []
    smoking_status: Optional[str] = None
    bmi: Optional[float] = None
    previous_screenings: list[dict] = []

@router.post("/cancer-screening")
async def cancer_screening(data: CancerScreeningInput):
    prompt = f"""You are a cancer screening AI advisor. Assess screening needs:
    Age: {data.patient_age}, Gender: {data.gender}
    Family History: {data.family_history}
    Smoking: {data.smoking_status}, BMI: {data.bmi}
    Previous Screenings: {data.previous_screenings}
    
    Provide evidence-based recommendations:
    1. Applicable screening types (breast, cervical, colorectal, lung, prostate, skin)
    2. Risk level for each cancer type (Low/Average/High)
    3. Recommended screening schedule with intervals
    4. Guideline source (USPSTF, ACS, NCCN)
    5. Genetic testing recommendations
    6. Lifestyle modification recommendations
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 9. AI NUTRITION & DIET PLANNER
# ═══════════════════════════════════════════════
class NutritionPlanInput(BaseModel):
    patient_name: str
    diagnosis: str
    diet_restrictions: list[str] = []
    allergies: list[str] = []
    bmi: Optional[float] = None
    caloric_target: Optional[int] = None

@router.post("/nutrition-planner")
async def nutrition_planner(data: NutritionPlanInput):
    prompt = f"""You are a clinical nutrition AI. Create a hospital meal plan:
    Patient: {data.patient_name}, Diagnosis: {data.diagnosis}
    Diet Restrictions: {data.diet_restrictions}, Allergies: {data.allergies}
    BMI: {data.bmi}, Caloric Target: {data.caloric_target}
    
    Provide:
    1. 3-day meal plan (breakfast, lunch, dinner, snacks)
    2. Macro breakdown (protein/carbs/fat per meal)
    3. Micronutrient considerations
    4. Fluid recommendations
    5. Supplementation needs
    6. Contraindicated foods
    7. Transition plan (NPO → clear liquid → regular diet)
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 10. MENTAL HEALTH SCREENING AI
# ═══════════════════════════════════════════════
class MentalHealthInput(BaseModel):
    patient_age: int
    gender: str
    presenting_concerns: list[str]
    phq9_score: Optional[int] = None
    gad7_score: Optional[int] = None
    sleep_quality: Optional[str] = None
    substance_use: Optional[str] = None

@router.post("/mental-health-screening")
async def mental_health_screening(data: MentalHealthInput):
    prompt = f"""You are a mental health screening AI. Assess and recommend:
    Age: {data.patient_age}, Gender: {data.gender}
    Concerns: {data.presenting_concerns}
    PHQ-9: {data.phq9_score}, GAD-7: {data.gad7_score}
    Sleep: {data.sleep_quality}, Substance Use: {data.substance_use}
    
    Provide:
    1. Depression severity (PHQ-9 interpretation)
    2. Anxiety severity (GAD-7 interpretation)
    3. Suicide risk assessment level
    4. Recommended screening tools to administer
    5. Treatment recommendations (therapy type, medication class)
    6. Referral priority (Routine/Urgent/Emergent)
    7. Safety planning recommendations
    8. Lifestyle interventions
    Respond in JSON. IMPORTANT: Include disclaimer that this is a screening tool, not a diagnosis."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 11. PANDEMIC SIMULATION & PREPAREDNESS
# ═══════════════════════════════════════════════
class PandemicSimInput(BaseModel):
    pathogen_type: str
    current_cases: int
    hospital_capacity: int
    icu_beds: int
    ventilators: int
    staff_count: int
    region_population: int

@router.post("/pandemic-simulation")
async def pandemic_simulation(data: PandemicSimInput):
    prompt = f"""You are a pandemic preparedness AI. Simulate and plan:
    Pathogen: {data.pathogen_type}, Current Cases: {data.current_cases}
    Hospital Capacity: {data.hospital_capacity} beds, ICU: {data.icu_beds}, Ventilators: {data.ventilators}
    Staff: {data.staff_count}, Population: {data.region_population}
    
    Provide:
    1. 30-day case projection (optimistic/moderate/worst)
    2. Hospital capacity timeline (when overflow)
    3. ICU and ventilator demand curve
    4. Staff burnout/shortage projections
    5. PPE consumption forecast
    6. Surge capacity recommendations
    7. Triage protocol recommendations
    8. Resource reallocation strategy
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 12. CLINICAL TRIAL ELIGIBILITY MATCHER
# ═══════════════════════════════════════════════
class TrialMatchInput(BaseModel):
    patient_age: int
    gender: str
    diagnosis: str
    stage: Optional[str] = None
    biomarkers: list[str] = []
    previous_treatments: list[str] = []
    ecog_status: Optional[int] = None

@router.post("/trial-eligibility")
async def trial_eligibility_matcher(data: TrialMatchInput):
    prompt = f"""You are a clinical trial matching AI. Find eligible trials:
    Patient: Age {data.patient_age}, Gender {data.gender}
    Diagnosis: {data.diagnosis}, Stage: {data.stage}
    Biomarkers: {data.biomarkers}, Prior Treatments: {data.previous_treatments}
    ECOG: {data.ecog_status}
    
    Provide:
    1. 5 matching clinical trials (simulated realistic examples)
    2. Eligibility score for each (0-100%)
    3. Key inclusion/exclusion criteria analysis
    4. Trial phase and endpoints
    5. Nearest trial sites
    6. Patient information sheet summary
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 13. TREATMENT COST ESTIMATOR
# ═══════════════════════════════════════════════
class CostEstimateInput(BaseModel):
    diagnosis: str
    treatment_plan: list[str]
    insurance_type: Optional[str] = None
    length_of_stay_estimate: Optional[int] = None

@router.post("/cost-estimator")
async def treatment_cost_estimator(data: CostEstimateInput):
    prompt = f"""You are a healthcare cost estimation AI. Estimate treatment costs:
    Diagnosis: {data.diagnosis}
    Treatment Plan: {data.treatment_plan}
    Insurance: {data.insurance_type}, Estimated LOS: {data.length_of_stay_estimate} days
    
    Provide:
    1. Itemized cost breakdown (room, medications, procedures, labs, imaging)
    2. Total estimated cost range (low/medium/high)
    3. Insurance coverage estimate
    4. Out-of-pocket estimate
    5. DRG classification and weight
    6. Cost optimization opportunities
    7. Financial assistance program eligibility
    Respond in JSON with all amounts in USD."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 14. GENETIC RISK ANALYSIS
# ═══════════════════════════════════════════════
class GeneticRiskInput(BaseModel):
    patient_age: int
    gender: str
    family_history: list[str]
    ethnicity: Optional[str] = None
    known_mutations: list[str] = []

@router.post("/genetic-risk")
async def genetic_risk_analysis(data: GeneticRiskInput):
    prompt = f"""You are a genetic risk analysis AI. Assess hereditary disease risk:
    Age: {data.patient_age}, Gender: {data.gender}, Ethnicity: {data.ethnicity}
    Family History: {data.family_history}
    Known Mutations: {data.known_mutations}
    
    Provide:
    1. Hereditary cancer risk assessment
    2. Cardiovascular genetic risk factors
    3. Pharmacogenomic considerations
    4. Recommended genetic tests
    5. Carrier screening recommendations
    6. Risk communication summary for the patient
    7. Genetic counseling referral recommendation
    Respond in JSON. Include disclaimer about clinical genetic testing."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 15. EMERGENCY RESPONSE OPTIMIZER
# ═══════════════════════════════════════════════
class EmergencyResponseInput(BaseModel):
    incident_type: str
    severity: str
    location: str
    casualties_estimated: int
    available_resources: dict

@router.post("/emergency-response")
async def emergency_response_optimizer(data: EmergencyResponseInput):
    prompt = f"""You are an emergency response optimization AI. Plan response:
    Incident: {data.incident_type}, Severity: {data.severity}
    Location: {data.location}, Estimated Casualties: {data.casualties_estimated}
    Available Resources: {data.available_resources}
    
    Provide:
    1. Mass casualty triage protocol (START/SALT)
    2. Resource deployment plan
    3. Ambulance routing optimization
    4. Hospital notification cascade
    5. Surge capacity activation steps
    6. Blood product mobilization plan
    7. Communication protocols
    8. Decontamination procedures (if applicable)
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 16. POPULATION HEALTH ANALYTICS
# ═══════════════════════════════════════════════
class PopulationHealthInput(BaseModel):
    demographic_data: dict
    disease_prevalence: dict
    time_period: str
    interventions: list[str] = []

@router.post("/population-health")
async def population_health_analytics(data: PopulationHealthInput):
    prompt = f"""You are a population health analytics AI. Analyze trends:
    Demographics: {data.demographic_data}
    Disease Prevalence: {data.disease_prevalence}
    Period: {data.time_period}, Interventions: {data.interventions}
    
    Provide:
    1. Top health concerns by prevalence
    2. Age-adjusted rates
    3. Health disparities identification
    4. Preventive care gap analysis
    5. Cost-effectiveness of interventions
    6. Predicted trend for next 12 months
    7. Community health improvement priorities
    8. HEDIS measure performance
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 17. PATIENT JOURNEY MAPPER
# ═══════════════════════════════════════════════
class PatientJourneyInput(BaseModel):
    patient_name: str
    encounters: list[dict]
    chief_complaint: str

@router.post("/patient-journey")
async def patient_journey_mapper(data: PatientJourneyInput):
    prompt = f"""You are a patient journey mapping AI. Analyze the care continuum:
    Patient: {data.patient_name}, Chief Complaint: {data.chief_complaint}
    Encounters: {data.encounters}
    
    Provide:
    1. Timeline visualization data (events + dates)
    2. Care gaps identified
    3. Unnecessary visits/tests flagged
    4. Care coordination issues
    5. Patient experience pain points
    6. Treatment adherence assessment
    7. Optimization recommendations
    8. Predicted next encounter
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 18. CHRONIC DISEASE MANAGEMENT AI
# ═══════════════════════════════════════════════
class ChronicDiseaseInput(BaseModel):
    condition: str
    patient_age: int
    duration_years: int
    current_medications: list[str]
    recent_labs: dict = {}
    complications: list[str] = []
    lifestyle_factors: dict = {}

@router.post("/chronic-disease-manager")
async def chronic_disease_manager(data: ChronicDiseaseInput):
    prompt = f"""You are a chronic disease management AI. Create care plan:
    Condition: {data.condition}, Duration: {data.duration_years} years
    Patient Age: {data.patient_age}
    Medications: {data.current_medications}, Labs: {data.recent_labs}
    Complications: {data.complications}, Lifestyle: {data.lifestyle_factors}
    
    Provide:
    1. Disease control status (Well-controlled/Suboptimal/Uncontrolled)
    2. Medication optimization recommendations
    3. Target lab values and monitoring schedule
    4. Complication screening plan
    5. Lifestyle modification program
    6. Patient self-management education
    7. Telehealth monitoring plan
    8. Quarterly milestone goals
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 19. AI WOUND ASSESSMENT
# ═══════════════════════════════════════════════
class WoundAssessmentInput(BaseModel):
    wound_type: str
    location: str
    size_cm: Optional[str] = None
    depth: Optional[str] = None
    drainage: Optional[str] = None
    surrounding_skin: Optional[str] = None
    duration_days: int
    patient_comorbidities: list[str] = []

@router.post("/wound-assessment")
async def wound_assessment(data: WoundAssessmentInput):
    prompt = f"""You are a wound care AI specialist. Assess and recommend:
    Wound Type: {data.wound_type}, Location: {data.location}
    Size: {data.size_cm}, Depth: {data.depth}
    Drainage: {data.drainage}, Surrounding Skin: {data.surrounding_skin}
    Duration: {data.duration_days} days, Comorbidities: {data.patient_comorbidities}
    
    Provide:
    1. Wound classification (Wagner/Bates-Jensen scoring)
    2. Healing trajectory prediction
    3. Infection risk assessment
    4. Recommended dressing protocol
    5. Debridement recommendation
    6. Offloading/positioning advice
    7. Nutritional support for healing
    8. Follow-up schedule
    9. When to escalate to wound specialist
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 20. SPEECH-TO-SOAP NOTE CONVERTER
# ═══════════════════════════════════════════════
class SpeechToSOAPInput(BaseModel):
    transcription: str
    visit_type: Optional[str] = None
    specialty: Optional[str] = None

@router.post("/speech-to-soap")
async def speech_to_soap(data: SpeechToSOAPInput):
    prompt = f"""You are a medical transcription AI. Convert this dictation into a SOAP note:
    Visit Type: {data.visit_type}, Specialty: {data.specialty}
    
    Transcription: "{data.transcription}"
    
    Generate a complete SOAP note with:
    1. Subjective: Chief complaint, HPI, ROS, PMH, medications, allergies
    2. Objective: Vitals, physical exam findings, labs/imaging
    3. Assessment: Differential diagnoses with ICD-10 codes
    4. Plan: Medications, procedures, referrals, follow-up, patient education
    5. Billing codes: E&M level, CPT codes
    Respond in JSON with clear SOAP sections."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 21. INTELLIGENT ICD/CPT AUTO-CODER
# ═══════════════════════════════════════════════
class AutoCoderInput(BaseModel):
    clinical_documentation: str
    visit_type: str
    procedures_performed: list[str] = []

@router.post("/auto-coder")
async def icd_cpt_auto_coder(data: AutoCoderInput):
    prompt = f"""You are a medical coding AI (CCS/CPC certified level). Auto-code:
    Visit Type: {data.visit_type}
    Procedures: {data.procedures_performed}
    Clinical Documentation: "{data.clinical_documentation}"
    
    Provide:
    1. Primary ICD-10-CM diagnosis code with description
    2. Secondary diagnosis codes (up to 10)
    3. PCS procedure codes (if inpatient)
    4. CPT codes for procedures/services
    5. E&M level with justification (time or complexity)
    6. Modifier recommendations
    7. HCC risk adjustment codes
    8. DRG assignment
    9. Coding confidence level
    10. Documentation improvement suggestions
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 22. AI RADIOLOGY REPORT GENERATOR
# ═══════════════════════════════════════════════
class RadReportInput(BaseModel):
    modality: str
    body_part: str
    clinical_indication: str
    findings_notes: str
    comparison_available: bool = False

@router.post("/radiology-report")
async def radiology_report_generator(data: RadReportInput):
    prompt = f"""You are an AI radiology report generator. Create a structured report:
    Modality: {data.modality}, Body Part: {data.body_part}
    Clinical Indication: {data.clinical_indication}
    Comparison: {"Available" if data.comparison_available else "None available"}
    Findings Notes: "{data.findings_notes}"
    
    Generate a complete radiology report:
    1. Exam type and technique
    2. Clinical history
    3. Comparison
    4. Findings (organized by anatomical structure)
    5. Impression (numbered, most critical first)
    6. BI-RADS/Lung-RADS/LI-RADS (if applicable)
    7. Critical/urgent findings flagged
    8. Recommended follow-up imaging
    Respond in JSON with structured sections."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 23. PHARMACOVIGILANCE AI
# ═══════════════════════════════════════════════
class PharmacovigilanceInput(BaseModel):
    medication: str
    adverse_event: str
    patient_age: int
    patient_gender: str
    dose: str
    duration: str
    other_medications: list[str] = []

@router.post("/pharmacovigilance")
async def pharmacovigilance(data: PharmacovigilanceInput):
    prompt = f"""You are a pharmacovigilance AI. Assess this adverse drug reaction:
    Medication: {data.medication}, Dose: {data.dose}, Duration: {data.duration}
    Adverse Event: {data.adverse_event}
    Patient: Age {data.patient_age}, Gender {data.patient_gender}
    Concomitant Medications: {data.other_medications}
    
    Provide:
    1. Naranjo causality score
    2. WHO-UMC causality assessment
    3. Severity grade (mild/moderate/severe/life-threatening)
    4. Expected vs unexpected classification
    5. Rechallenge/dechallenge analysis
    6. Seriousness criteria met
    7. Recommended action (continue/dose adjust/discontinue)
    8. MedWatch report recommendation
    9. Alternative medication suggestions
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 24. PREDICTIVE STAFFING AI
# ═══════════════════════════════════════════════
class PredictiveStaffingInput(BaseModel):
    department: str
    historical_census: list[dict] = []
    upcoming_admissions: int = 0
    upcoming_surgeries: int = 0
    day_of_week: str = "Monday"
    season: str = "Winter"
    special_events: list[str] = []

@router.post("/predictive-staffing")
async def predictive_staffing(data: PredictiveStaffingInput):
    prompt = f"""You are a nurse staffing prediction AI. Optimize staffing levels:
    Department: {data.department}
    Day: {data.day_of_week}, Season: {data.season}
    Historical Census: {data.historical_census}
    Upcoming: {data.upcoming_admissions} admissions, {data.upcoming_surgeries} surgeries
    Special Events: {data.special_events}
    
    Provide:
    1. Predicted patient census (next 24/48/72 hours)
    2. Recommended RN staffing per shift (day/evening/night)
    3. Nurse-to-patient ratio recommendation
    4. CNA/Tech staffing needs
    5. Float pool/agency nurse recommendations
    6. Skill mix optimization
    7. Overtime risk prediction
    8. Cost impact analysis
    Respond in JSON."""
    return await _gemini(prompt)


# ═══════════════════════════════════════════════
# 25. QUALITY METRICS & OUTCOMES ANALYZER
# ═══════════════════════════════════════════════
class QualityMetricsInput(BaseModel):
    department: str
    metric_type: str  # readmission, infection, satisfaction, mortality
    time_period: str
    current_data: dict
    benchmark_data: Optional[dict] = None

@router.post("/quality-metrics")
async def quality_metrics_analyzer(data: QualityMetricsInput):
    prompt = f"""You are a healthcare quality analytics AI. Analyze performance:
    Department: {data.department}, Metric: {data.metric_type}
    Period: {data.time_period}
    Current Data: {data.current_data}
    Benchmark: {data.benchmark_data}
    
    Provide:
    1. Current performance vs national benchmarks
    2. Trend analysis (improving/stable/declining)
    3. Root cause analysis for underperformance
    4. Statistical significance of variations
    5. CMS Star Rating impact
    6. Leapfrog Grade impact
    7. Action plan with SMART goals
    8. Projected improvement with interventions
    9. HCAHPS/patient satisfaction correlation
    Respond in JSON."""
    return await _gemini(prompt)
