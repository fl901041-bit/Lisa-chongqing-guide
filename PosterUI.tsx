
import React, { useEffect, useRef } from 'react';
import { EXPERIENCES, TESTIMONIALS, CONFIG } from '../constants';

interface PosterUIProps {
  onChatClick: () => void;
}

const PosterUI: React.FC<PosterUIProps> = ({ onChatClick }) => {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full">
      {/* Navigation - Minimalist */}
      <nav className="fixed top-0 left-0 w-full z-40 px-10 py-8 flex justify-between items-center mix-blend-difference">
        <div className="flex flex-col">
          <span className="text-white text-[10px] tracking-[0.6em] font-black uppercase">{CONFIG.name}</span>
          <span className="text-white/40 text-[8px] tracking-[0.4em] uppercase">Native Storyteller</span>
        </div>
        <button 
          onClick={onChatClick}
          className="text-white text-[10px] tracking-[0.4em] font-bold uppercase border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all"
        >
          Consult Now
        </button>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src={CONFIG.heroImg} 
            alt="Chongqing Maze" 
            className="w-full h-full object-cover opacity-60 grayscale-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
        </div>

        <div className="relative z-10 text-center px-6">
          <p className="text-white/60 uppercase tracking-[1.2em] text-[10px] mb-6 font-light">Deep Inside the 8D Matrix</p>
          <h1 className="text-white text-[16vw] md:text-[12vw] serif italic tracking-tighter leading-[0.85] mb-12 drop-shadow-2xl">
            Unseen<br />
            <span className="ml-[2vw]">Chongqing</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <button 
              onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-14 py-5 bg-white text-black text-[10px] tracking-[0.6em] uppercase hover:bg-stone-200 transition-all font-bold"
            >
              Start Your Odyssey
            </button>
          </div>
        </div>

        {/* Vertical Signature */}
        <div className="absolute right-10 bottom-12 hidden md:block">
           <span className="vertical-text text-white/10 text-8xl font-black serif tracking-widest leading-none">{CONFIG.chineseName}</span>
        </div>
      </header>

      {/* Intro - The Manifesto */}
      <section 
        id="explore"
        ref={el => sectionRefs.current[0] = el}
        className="reveal-section py-60 px-6 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-7 space-y-12">
            <span className="text-[10px] tracking-[0.8em] text-stone-300 uppercase font-bold block">The Philosophy</span>
            <h2 className="text-7xl md:text-8xl serif italic leading-none text-stone-900 tracking-tighter">
              Chongqing is not a city.<br />It is a <span className="underline decoration-1 underline-offset-8">feeling</span>.
            </h2>
            <div className="max-w-xl">
              <p className="text-stone-500 leading-relaxed font-light text-xl mb-8">
                The world sees the neon of Hongyadong. But the soul of this place lives in the damp alleyways, the creaking public lifts, and the steam rising from a morning bowl of noodles.
              </p>
              <p className="text-stone-400 leading-relaxed font-light text-lg">
                I am not a tourist guide. I am a bridge. I don't show you landmarks; I show you my home—the version that hasn't been polished for social media.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="image-zoom-container aspect-[3/4] shadow-2xl">
              <img 
                src={CONFIG.introImg} 
                alt="Native Perspective" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-12 -left-12 bg-stone-900 p-10 hidden md:block w-64 shadow-2xl">
              <p className="text-white/40 text-[8px] uppercase tracking-[0.5em] mb-4">Certified Local</p>
              <p className="text-white text-xl serif italic leading-snug">"Authenticity is the only luxury we have left."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Tracks */}
      <section className="bg-[#111] py-60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-40 flex flex-col md:flex-row justify-between items-end gap-10">
             <div>
               <p className="text-white/20 tracking-[0.6em] uppercase text-[10px] mb-4">Bespoke Journeys</p>
               <h2 className="text-white text-8xl md:text-9xl serif italic tracking-tighter leading-none">The Tracks</h2>
             </div>
             <p className="text-white/40 max-w-sm text-sm font-light leading-relaxed">
               Each path is designed around your specific curiosity. We don't do schedules; we do moments.
             </p>
          </div>
          
          <div className="space-y-80">
            {EXPERIENCES.map((exp, idx) => (
              <div 
                key={exp.id} 
                ref={el => sectionRefs.current[idx+1] = el}
                className={`reveal-section flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-20 md:gap-40 items-center`}
              >
                <div className="flex-1 w-full aspect-[4/5] image-zoom-container bg-stone-800">
                  <img src={exp.img} alt={exp.title} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex-1 space-y-10">
                  <div className="flex items-center gap-6">
                    <span className="text-white/10 text-8xl font-serif italic">{exp.id}</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                  </div>
                  <div className="space-y-4">
                    <span className="text-stone-500 text-[10px] tracking-[0.6em] font-bold uppercase block">{exp.subtitle}</span>
                    <h3 className="text-white text-5xl serif leading-tight tracking-tight">{exp.title}</h3>
                  </div>
                  <p className="text-stone-400 font-light leading-relaxed text-xl max-w-md">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coffee Shop Lead Generation - The BIG PULL */}
      <section className="py-40 bg-white relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-stone-50 border border-stone-100 p-12 md:p-32 relative overflow-hidden flex flex-col md:grid md:grid-cols-2 gap-20 items-center">
            <div className="absolute top-0 right-0 p-8 text-stone-100 text-[15rem] leading-none select-none font-serif italic pointer-events-none">
              CQ
            </div>
            
            <div className="relative z-10 space-y-10">
              <h2 className="text-6xl serif italic text-stone-900 leading-tight">Enjoying your coffee?</h2>
              <p className="text-stone-500 text-2xl font-light italic leading-snug">
                The city is calling. Don't waste your afternoon in a tourist trap. Let's design your next few hours right now.
              </p>
              <div className="space-y-6 pt-6">
                <div className="flex gap-6 items-center">
                  <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white text-xs font-bold">1</div>
                  <span className="text-stone-400 text-[11px] tracking-widest uppercase font-bold">Free Consult via Chat</span>
                </div>
                <div className="flex gap-6 items-center">
                  <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white text-xs font-bold">2</div>
                  <span className="text-stone-400 text-[11px] tracking-widest uppercase font-bold">Custom 'Fly Restaurant' Itinerary</span>
                </div>
                <div className="flex gap-6 items-center">
                  <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white text-xs font-bold">3</div>
                  <span className="text-stone-400 text-[11px] tracking-widest uppercase font-bold">Guaranteed Insider Access</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="bg-white p-10 shadow-2xl border border-stone-50 rounded-lg w-full max-w-sm text-center">
                <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-stone-400 mb-8 italic">Meet your Insider</p>
                <div className="w-full aspect-square bg-stone-50 mb-8 border-4 border-stone-50 overflow-hidden">
                   <img src={CONFIG.qrCodeUrl} alt="Connect with Alex" className="w-full h-full" />
                </div>
                <button 
                  onClick={onChatClick}
                  className="w-full py-5 bg-black text-white text-[10px] tracking-[0.5em] font-bold uppercase hover:bg-stone-800 transition-all shadow-xl"
                >
                  Talk to Alex Live
                </button>
                <p className="mt-6 text-[8px] text-stone-300 uppercase tracking-widest">Available now for 1-on-1 chats</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Boutique feel */}
      <footer className="py-32 px-10 border-t border-stone-100 bg-[#f9f9f9]">
        <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-3 gap-24 items-start">
           <div className="space-y-8">
              <h4 className="text-[12px] font-black tracking-[0.8em] uppercase text-stone-900">ALEX / INSIDER</h4>
              <p className="text-stone-400 text-sm font-light italic leading-relaxed max-w-xs">{CONFIG.tagline}</p>
           </div>
           <div className="space-y-6">
              <p className="text-[10px] uppercase tracking-[0.6em] font-bold text-stone-300">Channels</p>
              <div className="flex flex-col gap-4 text-stone-800 text-sm font-light tracking-wide">
                 <span className="flex items-center gap-3"><span className="w-1 h-1 bg-black rounded-full"></span> WeChat: {CONFIG.social.wechat}</span>
                 <span className="flex items-center gap-3"><span className="w-1 h-1 bg-black rounded-full"></span> WhatsApp: {CONFIG.social.whatsapp}</span>
              </div>
           </div>
           <div className="space-y-6 md:text-right w-full">
              <p className="text-[10px] uppercase tracking-[0.6em] font-bold text-stone-300">Follow the Fog</p>
              <p className="text-stone-800 text-sm font-light italic">{CONFIG.social.instagram}</p>
           </div>
        </div>
        <div className="mt-32 pt-12 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-[9px] uppercase tracking-[0.8em] text-stone-200">© 2024 Native Soul Journeys</p>
           <p className="text-[9px] uppercase tracking-[0.8em] text-stone-200">Crafted in Chongqing</p>
        </div>
      </footer>
    </div>
  );
};

export default PosterUI;
