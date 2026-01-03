
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- 核心配置 ---
const CONFIG = {
  name: "Lisa",
  chineseName: "莉莎",
  wechat: "FZcday", // 确认这里是你真实的微信号
  heroImg: "https://images.unsplash.com/photo-1540648639573-8c848de23f0a?auto=format&fit=crop&q=90&w=2400",
  introImg: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&q=80&w=1000",
  qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=WECHAT_ID:Lisa_CQ_Guide`,
};

// --- AI 逻辑 ---
const getGeminiResponse = async (userInput: string, history: any[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const contents = [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: userInput }] }
    ];
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: `You are 'Lisa', a bold, spicy, and street-smart Chongqing native girl. 
        Context: You are chatting with a foreign traveler in a local coffee shop.
        Personality: Direct, slightly sassy, but very caring. You hate tourist traps.
        Knowledge: You know GPS is useless here. You suggest hidden spots, not crowded ones.
        Rules: 
        1. Max 2 sentences. English only.
        2. Be spicy! Use phrases like "Trust me" or "Listen".
        3. If they want a tour, say: "Add my WeChat: ${CONFIG.wechat}, let's talk real business."`,
      },
    });
    return response.text;
  } catch (e) { 
    console.error(e);
    return "Foggy signal in the tunnel... try again?"; 
  }
};

// --- 聊天组件 ---
const ChatWidget = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState([{ role: 'model', text: "Listen, if you're following Google Maps here, you're already lost. Want to find the real Chongqing soul?" }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages]);

  const handleSend = async (text?: string) => {
    const userMsg = text || input;
    if (!userMsg.trim() || isTyping) return;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    const res = await getGeminiResponse(userMsg, messages);
    setMessages(prev => [...prev, { role: 'model', text: res || "..." }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-end md:items-center justify-center p-0 md:p-6 transition-all duration-500">
      <div className="w-full max-w-lg bg-[#fcfaf7] h-[90vh] md:h-[650px] flex flex-col md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-reveal">
        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-serif italic">L</div>
            <div>
              <p className="font-black text-[10px] uppercase tracking-widest leading-none">Lisa | Native Insider</p>
              <p className="text-[8px] text-green-600 font-bold uppercase tracking-tighter mt-1 animate-pulse">● Online & Ready</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">✕</button>
        </div>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed ${
                m.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-stone-100 italic text-stone-800'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && <div className="text-[9px] tracking-[0.3em] animate-pulse text-stone-400 uppercase">Lisa is typing...</div>}
        </div>

        <div className="p-6 bg-white border-t border-stone-100">
          <div className="flex flex-wrap gap-2 mb-4">
            {["Best local food?", "Hidden rooftops?", "Book a tour?"].map((p, i) => (
              <button key={i} onClick={() => handleSend(p)} className="text-[9px] border border-stone-200 px-3 py-1.5 rounded-full hover:bg-black hover:text-white transition-all uppercase font-bold">
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-3 bg-stone-50 p-2 rounded-full border border-stone-200">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none" placeholder="Ask Lisa..." />
            <button onClick={() => handleSend()} className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 主页面 ---
export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-yellow-400 selection:text-black">
      <nav className="fixed top-0 w-full z-50 p-8 flex justify-between items-center mix-blend-difference">
        <div className="flex flex-col">
          <span className="font-black tracking-[0.5em] uppercase text-xl">LISA</span>
          <span className="text-[8px] tracking-[0.3em] uppercase opacity-50 italic">Chongqing native</span>
        </div>
        <button onClick={() => setIsChatOpen(true)} className="bg-white text-black px-8 py-3 text-[10px] font-black tracking-[0.4em] uppercase hover:bg-yellow-400 transition-all">
          Consult
        </button>
      </nav>

      <header className="relative h-screen flex flex-col justify-end p-8 overflow-hidden">
        <img src={CONFIG.heroImg} className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale scale-110" alt="CQ" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-5xl animate-reveal">
          <h1 className="text-[16vw] md:text-[11vw] serif italic leading-[0.85] mb-10 tracking-tighter">
            Your GPS is<br /><span className="text-white/20">Lying To You.</span>
          </h1>
          <div className="flex flex-col md:flex-row md:items-end gap-12">
            <p className="max-w-md text-sm text-white/60 italic leading-relaxed border-l border-white/10 pl-8">
              "In a city where the ground floor is on the 22nd story, maps are useless. I'll be your human compass."
            </p>
            <button onClick={() => setIsChatOpen(true)} className="bg-yellow-400 text-black px-10 py-6 text-[11px] font-black tracking-[0.4em] uppercase hover:scale-105 transition-all shadow-xl">
              Start Conversation
            </button>
          </div>
        </div>
      </header>

      <section className="bg-white text-black py-40 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <img src={CONFIG.introImg} className="w-full grayscale shadow-2xl" alt="Lisa" />
          <div>
            <h2 className="text-6xl md:text-7xl serif italic mb-12 tracking-tight">Real Flavor.<br />Zero Traps.</h2>
            <p className="text-stone-500 text-lg mb-12 italic leading-relaxed">
              Skip the TikTok crowds. I'll take you to the basement noodle shops where soul meets spice.
            </p>
            <div className="p-10 border-2 border-stone-100 bg-stone-50 flex flex-col items-center text-center rounded-2xl">
              <img src={CONFIG.qrCodeUrl} className="w-48 h-48 mix-blend-multiply grayscale mb-6" alt="QR" />
              <p className="text-[10px] tracking-[0.5em] font-black uppercase">Scan to Book Lisa</p>
              <p className="text-[9px] text-stone-400 mt-2 uppercase">ID: {CONFIG.wechat}</p>
            </div>
          </div>
        </div>
      </section>

      {!isChatOpen && (
        <button onClick={() => setIsChatOpen(true)} className="fixed bottom-10 right-10 w-20 h-20 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:bg-yellow-400 transition-all z-50">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        </button>
      )}

      {isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
