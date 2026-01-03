
import { GoogleGenAI } from "@google/genai";
import { CONFIG } from "../constants";

// Correctly initialize GoogleGenAI with an object containing the apiKey
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiResponse = async (userInput: string, history: any[]) => {
  try {
    // Correctly format history and append the current user input to contents
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
        Core Knowledge: You know that GPS is useless here, you know where the best spicy 'fly restaurants' are, and you can explain why the 10th floor is also the ground floor.
        Constraint: Keep replies very short (under 2 sentences). 
        Goal: Be charming and knowledgeable, and if they want a deep tour, encourage them to add you on WeChat: ${CONFIG.social.wechat}.`,
      },
    });
    
    // Always use the .text property to extract output from GenerateContentResponse
    return response.text;
  } catch (error) {
    console.error("Gemini service error:", error);
    return "Lost signal in a Chongqing tunnel! Try again in a second.";
  }
};
