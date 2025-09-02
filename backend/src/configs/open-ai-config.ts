import { GoogleGenAI } from "@google/genai";

export const configureGoogleAI = () => {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
        throw new Error("GOOGLE_GENAI_API_KEY environment variable is required");
    }
    
    return new GoogleGenAI({ apiKey });
}

export const getDefaultModel = () => {
    // Return the latest Gemini model
    return "gemini-2.0-flash-exp"  // Latest Gemini model
}

export const getAvailableModels = () => {
    return [
        "gemini-2.0-flash-exp",     // Latest experimental version
        "gemini-2.0-flash",         // Stable flash version
        "gemini-1.5-flash",         // Previous generation
        "gemini-1.5-pro",           // Pro version
        "gemini-2.0-pro",           // Latest pro version
    ]
}