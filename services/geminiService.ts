
import { GoogleGenAI } from "@google/genai";
import { GlossaryEntry } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export const extractTranscript = async (audioFile: File): Promise<string> => {
  if (!audioFile) {
    throw new Error("No audio file provided for transcription.");
  }
  
  const base64Audio = await fileToBase64(audioFile);
  
  const audioPart = {
    inlineData: {
      mimeType: audioFile.type,
      data: base64Audio,
    },
  };

  const textPart = {
    text: "Please transcribe the audio from this audio file into English. Provide only the transcribed text.",
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [audioPart, textPart] },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for transcription:", error);
    throw new Error("Failed to extract transcript from the Gemini API.");
  }
};


export const translateText = async (text: string, glossary: GlossaryEntry[]): Promise<string> => {
  if (!text.trim()) {
    return "";
  }

  const glossaryPromptPart = glossary.length > 0
    ? `
      You must strictly follow this custom glossary. This is a critical instruction.
      ${glossary.map(entry => `- Translate "${entry.english}" as "${entry.vietnamese}"`).join('\n')}
    `
    : "";

  const systemInstruction = `You are an expert translator specializing in academic and technical poker terminology. Your task is to translate English text into Vietnamese. You must ensure the translation is accurate, natural-sounding, and contextually appropriate for a lecture setting.
    ${glossaryPromptPart}`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: text,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get translation from the Gemini API.");
  }
};
