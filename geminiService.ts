
import { GoogleGenAI } from "@google/genai";
import { CONFIG } from "./constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiResponse = async (userInput: string, history: any[]) => {
  try {
    const contents = [
      ...history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      { role: 'user', parts: [{ text: userInput }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: `You are 'Lisa', a bold and street-smart Chongqing native. 
        Context: You are talking to an international traveler in a coffee shop looking at your poster.
        Personality: Witty, helpful, confident, and proud of your home.
        Core Rule: Never use more than 2 sentences. English only.
        Goal: Show you are the real expert. If they are curious about a tour, mention your WeChat: ${CONFIG.social.wechat}.
        Vibe: "Stop using Google Maps. In this city, I am the only navigation system that works."`,
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The Chongqing fog is too thick. Ask me again?";
  }
};
