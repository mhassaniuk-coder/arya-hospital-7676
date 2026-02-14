import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

// Initialize the API client
// Note: In a real environment, ensure process.env.API_KEY is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzePatientNotes = async (notes: string): Promise<AIAnalysisResult> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing. Returning mock data.");
    return {
      summary: "API Key missing. Please provide a valid API key to use the AI Clinical Assistant.",
      recommendedActions: ["Check API configuration"],
      diagnosisSuggestions: ["System Configuration Error"]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
    throw error;
  }
};

export const generateDischargeSummary = async (patientName: string, history: string, condition: string): Promise<string> => {
    if (!process.env.API_KEY) return "API Key Required for AI features.";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
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
