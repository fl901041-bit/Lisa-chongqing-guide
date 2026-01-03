
import { GoogleGenAI } from "@google/genai";
import { CONFIG } from "../constants";

// 严格按照 SDK 规范初始化，直接引用环境变量
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiResponse = async (userInput: string, history: { role: 'user' | 'model', text: string }[]) => {
  try {
    // 使用指定的 gemini-3-flash-preview 模型处理对话
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.length > 0 
        ? history.map(h => ({ role: h.role, parts: [{ text: h.text }] })) 
        : [{ role: 'user', parts: [{ text: userInput }] }],
      config: {
        systemInstruction: `You are '${CONFIG.name}' (Chinese name: ${CONFIG.chineseName}), a native Chongqing independent guide. 
        Identity: You are an insider storyteller, not a salesperson. You represent the "Soul of the Mountain City."
        Tone: Calm, evocative, sophisticated, and deeply knowledgeable. 
        Rules:
        1. Keep responses very short (2-3 sentences).
        2. Speak in the first person. 
        3. Mention specific Chongqing nuances: the fog, the stairs, the hidden lifts, the 'fly restaurants'.
        4. Occasionally, you can use a single Chinese phrase like "重庆欢迎你" (Welcome to Chongqing) or "巴适" (Bashi - comfortable/cool).
        5. If asked about prices or booking, say: "Every journey I design is bespoke. Let's talk more about your interests, and I can craft a specific plan for you."
        6. Use a slightly poetic but grounded style.`,
      },
    });

    // 提取生成的文本内容
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The Yangtze fog is a bit thick for my connection. I'm here though—what do you want to discover?";
  }
};
