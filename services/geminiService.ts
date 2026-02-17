import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

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

const getAIClient = () => {
  // Never initialize without a valid API key
  if (DEMO_MODE || !apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    return null;
  }

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

// Helper to check if we should use mock mode
const shouldUseMockMode = (): boolean => {
  return DEMO_MODE || !apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '';
};

export const analyzePatientNotes = async (notes: string): Promise<AIAnalysisResult> => {
  if (shouldUseMockMode()) {
    console.warn("Gemini API Key missing or Demo Mode enabled. Returning mock data.");
    return {
      summary: "Demo Mode / Mock Data: Please provide a valid API key to use the real AI Clinical Assistant.",
      recommendedActions: ["Check API configuration", "Verify VITE_GEMINI_API_KEY"],
      diagnosisSuggestions: ["System Configuration Note", "Mock Diagnosis"]
    };
  }

  try {
    const client = getAIClient();
    if (!client) {
      console.warn("AI Client not available. Returning mock data.");
      return {
        summary: "AI service unavailable. Returning fallback data.",
        recommendedActions: ["Check API configuration", "Verify network connectivity"],
        diagnosisSuggestions: ["Service Unavailable", "Retry later"]
      };
    }

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
  if (shouldUseMockMode()) {
    return "Demo Mode: API Key Required for real AI features. Please configure VITE_GEMINI_API_KEY in your environment.";
  }

  try {
    const client = getAIClient();
    if (!client) {
      return "AI service unavailable. Please check API configuration.";
    }

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

// Export a function to check if AI is available
export const isAIAvailable = (): boolean => {
  return !shouldUseMockMode() && getAIClient() !== null;
};

// Export a function to get current AI status for debugging
export const getAIStatus = (): { available: boolean; demoMode: boolean; hasApiKey: boolean } => {
  return {
    available: isAIAvailable(),
    demoMode: DEMO_MODE,
    hasApiKey: !!apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim() !== ''
  };
};
