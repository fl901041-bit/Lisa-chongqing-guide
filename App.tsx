
import React, { useState, useEffect, useRef } from 'react';
import { Category, ChatMessage, Location, GroundingChunk } from './types';
import { getGeminiResponse, getCategoryRecommendations } from './services/geminiService';
import GroundingLink from './components/GroundingLink';

// ============================================================
// 💡 莉莎，你只需要修改这里的配置：
// ============================================================
const CONFIG = {
  // 1. 顶部图片链接：你可以去网上找一张喜欢的图，把链接粘贴在这里
  heroImage: "https://images.unsplash.com/photo-1540648639573-8c848de23f0a?auto=format&fit=crop&q=80&w=2400",
  
  // 2. 网页的大标题
  title: "莉莎的重庆 AI 导游",
  
  // 3. 网页的副标题
  subtitle: "由人工智能驱动，带你探索 8D 魔幻山城的每一个角落。",
  
  // 4. 你的微信 ID (如果不想要，可以留空 "")
  wechat: "FZcday"
};

const CHONGQING_COORDS = { lat: 29.5628, lng: 106.5528 };

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "你好！我是你的重庆本地 AI 导游。不管是火锅推荐、交通路线还是打卡点建议，我都能帮你！你想去哪里逛逛？" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | undefined>();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(CHONGQING_COORDS)
      );
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await getGeminiResponse(userMsg, userLocation);
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: response.text, 
        groundingSources: response.grounding as GroundingChunk[] 
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "抱歉，刚刚信号有点雾，请再跟我说一遍？" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (category: Category) => {
    setActiveCategory(category);
    setLoading(true);
    const categoryName = category === Category.HOTPOT ? "火锅" : 
                        category === Category.SCENERY ? "风景" : 
                        category === Category.STREET_FOOD ? "小吃" : 
                        category === Category.CULTURE ? "文化" : "夜生活";
    
    setMessages(prev => [...prev, { role: 'user', content: `给我推荐一些重庆的${categoryName}好去处。` }]);
    
    try {
      const response = await getCategoryRecommendations(category, userLocation);
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: response.text, 
        groundingSources: response.grounding as GroundingChunk[]
      }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部区域 */}
      <header className="relative h-64 md:h-80 w-full overflow-hidden shadow-xl">
        <img 
          src={CONFIG.heroImage} 
          alt="Chongqing" 
          className="w-full h-full object-cover brightness-75"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1540648639573-8c848de23f0a?auto=format&fit=crop&q=80&w=2400";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 pb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{CONFIG.title}</h1>
          <p className="text-gray-200 text-lg max-w-2xl font-light">{CONFIG.subtitle}</p>
        </div>
      </header>

      {/* 主体区域 */}
      <main className="max-w-6xl mx-auto w-full flex flex-col md:flex-row flex-grow p-4 gap-6">
        
        {/* 左侧：快捷分类 */}
        <section className="md:w-1/3 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2 text-red-600">🗺️</span> 快速探索
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                { type: Category.HOTPOT, icon: '🥘', label: '正宗火锅' },
                { type: Category.SCENERY, icon: '⛰️', label: '绝美风景' },
                { type: Category.STREET_FOOD, icon: '🍜', label: '街头小吃' },
                { type: Category.CULTURE, icon: '🎭', label: '文化体验' },
                { type: Category.NIGHTLIFE, icon: '🏮', label: '夜色重庆' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => handleCategoryClick(item.type)}
                  disabled={loading}
                  className={`flex items-center p-4 rounded-xl text-left transition-all border-2 ${
                    activeCategory === item.type 
                      ? 'border-red-500 bg-red-50 text-red-700 shadow-md translate-x-1' 
                      : 'border-transparent bg-gray-50 hover:bg-gray-100 text-gray-700 hover:border-gray-200'
                  }`}
                >
                  <span className="text-2xl mr-3">{item.icon}</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-red-600 rounded-2xl shadow-lg p-6 text-white relative">
            <h3 className="font-bold text-lg mb-1 italic">"8D 城市" 趣闻</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              在重庆，导航说“请直行”，你可能得先坐电梯。虽然路难找，但我会一直为你指引。
            </p>
            {CONFIG.wechat && (
              <div className="mt-4 pt-4 border-t border-white/20 text-xs font-bold">
                联系作者微信: {CONFIG.wechat}
              </div>
            )}
          </div>
        </section>

        {/* 右侧：聊天窗口 */}
        <section className="md:w-2/3 flex flex-col h-[600px] md:h-[750px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">CQ</div>
            <div>
              <h3 className="font-bold text-gray-800">重庆 AI 助手</h3>
              <div className="flex items-center text-xs text-green-500 font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                在线
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-red-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                  {msg.groundingSources && <GroundingLink sources={msg.groundingSources} />}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="relative flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="问问我这里的餐厅、路线或打卡点..."
                className="flex-grow p-4 pr-14 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                disabled={loading}
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center">
        <p className="text-xs">© 2024 重庆探索者 | 本网页由 Gemini AI 提供支持</p>
      </footer>
    </div>
  );
};

export default App;
