from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.config import get_settings

router = APIRouter(prefix="/api/ai", tags=["AI Services"])
settings = get_settings()


class TriageRequest(BaseModel):
    patient_name: str
    symptoms: list[str]
    age: Optional[int] = None
    gender: Optional[str] = None
    vital_signs: Optional[dict] = None

class NoteAnalysisRequest(BaseModel):
    notes: str

class DischargeSummaryRequest(BaseModel):
    patient_name: str
    condition: str
    history: str

class GenericAIRequest(BaseModel):
    prompt: str
    context: Optional[dict] = None


async def _call_gemini(prompt: str) -> dict:
    """Call Gemini API with the given prompt. Returns parsed JSON or text response."""
    import logging
    logger = logging.getLogger(__name__)
    
    api_key = settings.GEMINI_API_KEY
    
    # Check for missing or placeholder API key
    if not api_key or api_key == "PLACEHOLDER_API_KEY" or api_key == "your_gemini_api_key_here" or api_key.strip() == "":
        logger.warning(
            "⚠️ GEMINI_API_KEY is not configured. AI features will return mock responses. "
            "Set GEMINI_API_KEY in server/.env to enable real AI features. "
            "Get your API key from: https://makersuite.google.com/app/apikey"
        )
        return {
            "response": "AI features require a valid GEMINI_API_KEY in server/.env",
            "status": "mock",
            "summary": "Configure your Gemini API key to enable AI features.",
            "recommendations": ["Set GEMINI_API_KEY in server/.env"],
        }

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        return {"response": response.text, "status": "success"}
    except Exception as e:
        logger.error(f"Error calling Gemini API: {str(e)}")
        return {"response": str(e), "status": "error"}


@router.post("/triage")
async def ai_triage(data: TriageRequest):
    prompt = f"""You are an expert medical AI triage assistant. Analyze this patient:
    Name: {data.patient_name}
    Symptoms: {', '.join(data.symptoms)}
    Age: {data.age or 'Unknown'}
    Gender: {data.gender or 'Unknown'}
    Vitals: {data.vital_signs or 'Not provided'}
    
    Provide: urgency level (Critical/High/Medium/Low), recommended department, immediate actions, and estimated wait time.
    Respond in JSON format."""
    return await _call_gemini(prompt)


@router.post("/analyze-notes")
async def ai_analyze_notes(data: NoteAnalysisRequest):
    prompt = f"""You are an expert medical AI assistant. Analyze these clinical notes:
    "{data.notes}"
    
    Provide: summary, recommended actions, and diagnosis suggestions.
    Respond in JSON format."""
    return await _call_gemini(prompt)


@router.post("/discharge-summary")
async def ai_discharge_summary(data: DischargeSummaryRequest):
    prompt = f"""Draft a professional hospital discharge summary:
    Patient: {data.patient_name}
    Condition: {data.condition}
    History: {data.history}
    Keep it formal, empathetic, and clear."""
    return await _call_gemini(prompt)


@router.post("/generic")
async def ai_generic(data: GenericAIRequest):
    context_str = ""
    if data.context:
        context_str = f"\n\nContext: {data.context}"
    return await _call_gemini(f"{data.prompt}{context_str}")
