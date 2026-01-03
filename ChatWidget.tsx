
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { Message } from '../types';

interface ChatWidgetProps {
  onClose: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome. I'm Alex. Are you looking for the hidden side of Chongqing? Tell me what interests you most—food, architecture, or the stories between the alleys." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    const aiResponse = await getGeminiResponse(input, messages);
    setMessages(prev => [...prev, { role: 'model', text: aiResponse || 'The connection got lost in the city fog.' }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-stone-900/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#fcfaf7] shadow-[0_100px_100px_rgba(0,0,0,0.3)] flex flex-col h-[650px] border border-white/20 relative">
        {/* Header */}
        <div className="px-10 py-8 border-b border-stone-200 flex justify-between items-center bg-white/50">
          <div>
            <h3 className="font-bold text-stone-800 text-lg serif italic tracking-tight">Consult with Alex</h3>
            <p className="text-[9px] text-stone-400 uppercase tracking-[0.4em] font-bold mt-1">Native Perspective • Private Guide</p>
          </div>
          <button onClick={onClose} className="text-stone-300 hover:text-stone-800 transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] text-sm leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-stone-900 text-white px-6 py-4 rounded-sm shadow-xl' 
                : 'text-stone-600 font-light italic border-l-2 border-stone-200 pl-6'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && <div className="text-[10px] text-stone-300 uppercase tracking-[0.3em] animate-pulse">Alex is reflecting...</div>}
        </div>

        {/* Input */}
        <div className="p-10 bg-white/80 border-t border-stone-100">
          <div className="flex gap-6 items-end">
            <textarea 
              rows={1}
              autoFocus
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="What's your vision of Chongqing?"
              className="flex-1 bg-transparent border-b border-stone-200 py-2 focus:outline-none focus:border-stone-800 transition-all font-light text-sm resize-none"
            />
            <button 
              onClick={handleSend} 
              className="text-stone-800 uppercase text-[10px] font-black tracking-widest pb-2 hover:text-stone-400 transition-colors"
            >
              SEND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
