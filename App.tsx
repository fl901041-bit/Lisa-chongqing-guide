
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- CONSTANTS ---
const CONFIG = {
  name: "Lisa",
  chineseName: "莉莎",
  wechat: "FZcday",
  heroImg: "https://images.unsplash.com/photo-1540648639573-8c848de23f0a?auto=format&fit=crop&q=90&w=2400",
  introImg: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&q=80&w=1000",
  qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=WECHAT_ID:Lisa_CQ_Guide",
};

// --- AI SERVICE ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const getGeminiResponse = async (userInput: string, history: any[]) => {
  try {
    const contents = [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: userInput }] }
    ];
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: `You are 'Lisa', a bold Chongqing native guide. Short replies (max 2 sentences). English only. Mention WeChat: ${CONFIG.wechat} if they want a tour.`,
      },
    });
    return response.text;
  } catch (e) { return "Foggy signal... try again?"; }
};

// --- COMPONENTS ---

const ChatWidget = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState([{ role: 'model', text: "Hi, I'm Lisa. Ready to see the real Chongqing?" }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    const res = await getGeminiResponse(userMsg, messages);
    setMessages(prev => [...prev, { role: 'model', text: res || "..." }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="w-full max-w-lg bg-white h-[85vh] md:h-[600px] flex flex-col md:rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center bg-stone-50">
          <div className="font-black tracking-tighter uppercase text-sm">Lisa Insider Chat</div>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full">✕</button>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-black text-white' : 'bg-stone-100 italic text-stone-700'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && <div className="text-[10px] animate-pulse text-stone-400">LISA IS TYPING...</div>}
        </div>
        <div className="p-6 border-t flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} className="flex-1 bg-stone-100 rounded-full px-5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black" placeholder="Ask anything..." />
          <button onClick={handleSend} className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase">Send</button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-yellow-400 selection:text-black">
      {/* Poster UI */}
      <nav className="fixed top-0 w-full z-50 p-8 flex justify-between items-center mix-blend-difference">
        <div className="font-black tracking-[0.4em] uppercase text-lg">Lisa Guide</div>
        <button onClick={() => setIsChatOpen(true)} className="border border-white/30 px-6 py-2 text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all">Chat</button>
      </nav>

      <header className="relative h-screen flex flex-col justify-end p-8 overflow-hidden">
        <img src={CONFIG.heroImg} className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale contrast-125 scale-110" alt="CQ" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-[15vw] md:text-[10vw] font-serif italic leading-none mb-8 tracking-tighter">Your GPS is<br /><span className="text-white/20">Lying To You.</span></h1>
          <p className="max-w-md text-sm text-white/60 italic leading-relaxed border-l border-white/20 pl-6 mb-12">
            "In Chongqing, the 10th floor is also the street. You don't need a map, you need a local friend. I was born in this maze."
          </p>
          <button onClick={() => setIsChatOpen(true)} className="bg-white text-black px-12 py-5 text-[10px] font-black tracking-[0.4em] uppercase hover:bg-yellow-400 transition-all">Start Consultation</button>
        </div>
      </header>

      <section className="bg-white text-black py-32 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <img src={CONFIG.introImg} className="w-full grayscale shadow-2xl" alt="Lisa" />
          <div>
            <h2 className="text-5xl font-serif italic mb-8">Forget TripAdvisor.</h2>
            <p className="text-stone-500 mb-10 leading-relaxed">I'll take you to the basement noodle shops where the soul of the city lives. No tourist traps. Only authentic 8D experiences.</p>
            <div className="p-8 border-stone-200 border bg-stone-50 text-center">
              <img src={CONFIG.qrCodeUrl} className="w-40 h-40 mx-auto grayscale mb-4" alt="QR" />
              <p className="text-[10px] tracking-widest text-stone-400 uppercase">WeChat ID: {CONFIG.wechat}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button onClick={() => setIsChatOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        </button>
      )}

      {isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
