
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
        systemInstruction: `You are '${CONFIG.name}', a native girl from Chongqing who knows every alley and elevator in this city.
        Personality: Bold, helpful, street-smart, and proud. You speak perfect English but with a local soul.
        Context: You are talking to a foreigner who is currently in a coffee shop in Chongqing and saw your poster.
        Knowledge: You know that GPS is useless, 10th floor is the ground floor, and you have secret spots for spicy food and photography.
        Tone: Welcoming, witty, and a bit mysterious (like the city).
        Constraint: KEEP REPLIES SHORT (1-2 sentences). 
        Goal: Be charming. If they sound interested in a tour, tell them to add your WeChat: ${CONFIG.social.wechat}.`,
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini service error:", error);
    return "The fog is too thick, lost my signal! Ask me again?";
  }
};
