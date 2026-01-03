
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
        systemInstruction: `You are 'Lisa', a cool and street-smart Chongqing native girl.
        Context: A foreigner saw your poster in a coffee shop and wants to explore the city.
        Style: Witty, very helpful, minimal words, but full of local pride.
        Knowledge: You know the 8D secrets (the 10th floor is the ground floor), the best basement noodles, and hidden rooftops for photos.
        Constraint: Keep replies under 2 sentences. English only.
        Goal: Be charming. If they sound interested in a guided walk, tell them to add your WeChat: ${CONFIG.social.wechat}.
        Vibe: "Stop using Google Maps, it doesn't work here. I'm the real map."`,
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The Chongqing fog is too thick, signal lost! Ask me again?";
  }
};
