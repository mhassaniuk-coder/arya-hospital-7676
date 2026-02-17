import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

// Initialize the API client lazily
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const DEMO_MODE = import.meta.env.VITE_USE_MOCK === 'true' || true;

let ai: any = null;

const getAIClient = () => {
  if (!ai && apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const analyzePatientNotes = async (notes: string): Promise<AIAnalysisResult> => {
  if (DEMO_MODE || !apiKey) {
    console.warn("Gemini API Key missing or Demo Mode enabled. Returning mock data.");
    return {
      summary: "Demo Mode / Mock Data: Please provide a valid API key to use the real AI Clinical Assistant.",
      recommendedActions: ["Check API configuration", "Verify VITE_GEMINI_API_KEY"],
      diagnosisSuggestions: ["System Configuration Note", "Mock Diagnosis"]
    };
  }

  try {
    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash", // Updated to consistent model version
      contents: `You are an expert medical AI assistant. Analyze the following patient clinical notes. 
      Provide a concise summary, a list of recommended immediate actions for the nurse/doctor, and potential diagnosis suggestions based on symptoms.
      
      Patient Notes: "${notes}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A brief professional medical summary of the patient's current state." },
            recommendedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of actionable steps for medical staff."
            },
            diagnosisSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Potential diagnoses based on the text."
            }
          },
          required: ["summary", "recommendedActions", "diagnosisSuggestions"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Error analyzing notes:", error);
    // Fallback to mock data on error
    return {
      summary: "Error connecting to AI service. Returning fallback data.",
      recommendedActions: ["Retry later", "Check network connection"],
      diagnosisSuggestions: ["Service Unavailable"]
    };
  }
};

export const generateDischargeSummary = async (patientName: string, history: string, condition: string): Promise<string> => {
  if (DEMO_MODE || !apiKey) return "Demo Mode: API Key Required for real AI features.";

  try {
    const client = getAIClient();
    if (!client) throw new Error("AI Client not initialized");

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Draft a professional hospital discharge summary for patient ${patientName}. 
            Condition: ${condition}. 
            Medical History/Notes: ${history}.
            Keep it formal, empathetic, and clear.`
    });
    return response.text || "Failed to generate summary.";
  } catch (error) {
    console.error("Error generating discharge summary", error);
    return "An error occurred while contacting the AI service.";
  }
}
