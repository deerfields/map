
import React, { useState, useEffect, useRef } from 'react';
import { Unit } from '../types';
import { getConciergeResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: { uri: string; title: string }[];
  suggestions?: string[];
}

interface AIConciergeProps {
  isOpen: boolean;
  onClose: () => void;
  units: Unit[];
  isArabic: boolean;
  onNavigate: (unitId: string) => void;
  userPos?: { x: number, y: number } | null;
  externalInput?: string;
  onOpenKeyboard: () => void;
  onClearInput: () => void;
}

const RECENT_SEARCHES_KEY = 'Mall_AI_Recent_Searches';

const AIConcierge: React.FC<AIConciergeProps> = ({ 
  isOpen, onClose, units, isArabic, onNavigate, userPos, 
  externalInput = '', onOpenKeyboard, onClearInput 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<{role: 'user' | 'model', parts: {text: string}[]}[]>([]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialGreeting = isArabic 
        ? "مرحباً بكم. أنا المساعد الشخصي لخدمتكم. كيف يمكنني جعل زيارتكم استثنائية اليوم؟"
        : "Welcome. I am your personal Concierge. How may I elevate your visit to Deerfields Mall today?";
      const initialSuggestions = isArabic 
        ? ["مطاعم فاخرة", "أحدث عروض الأزياء", "أين أجد كارفور؟"]
        : ["Recommend fine dining", "Luxury boutiques", "Where is Carrefour?"];
      
      setMessages([{ role: 'model', text: initialGreeting, suggestions: initialSuggestions }]);
      historyRef.current = [{ role: 'model', parts: [{ text: initialGreeting }] }];
    }
  }, [isOpen, isArabic, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (overrideText?: string) => {
    const userMsg = (overrideText || externalInput).trim();
    if (!userMsg || isTyping) return;

    onClearInput();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await getConciergeResponse(userMsg, historyRef.current, {
        units,
        isArabic,
        currentX: userPos?.x,
        currentY: userPos?.y
      });

      const candidate = response.candidates?.[0];
      const modelText = response.text || "";
      
      const sources: { uri: string; title: string }[] = [];
      candidate?.groundingMetadata?.groundingChunks?.forEach((chunk: any) => {
        if (chunk.maps) {
          sources.push({ uri: chunk.maps.uri, title: chunk.maps.title || "View on Maps" });
        }
      });

      if (response.functionCalls) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'setDestination') {
            onNavigate((fc.args as any).storeId);
          }
        }
      }

      const suggestions = isArabic 
        ? ["مواعيد العمل", "أقرب صراف آلي"]
        : ["Opening hours", "Nearest ATM"];

      setMessages(prev => [...prev, { role: 'model', text: modelText, sources, suggestions }]);
      historyRef.current.push({ role: 'user', parts: [{ text: userMsg }] });
      historyRef.current.push({ role: 'model', parts: [{ text: modelText }] });

    } catch (error) {
      const errorMsg = isArabic ? "عذراً، حدث خطأ." : "I apologize, but I encountered an error. Please try again.";
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-8 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl h-[85vh] bg-[#fcfcfc] rounded-[4rem] shadow-[0_60px_120px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-in zoom-in duration-700 border border-white/20">
        {/* Header */}
        <div className="px-12 py-10 bg-[#0a0a0a] text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#d4af37]/10 to-transparent" />
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-16 h-16 bg-[#d4af37] rounded-[1.5rem] flex items-center justify-center text-3xl shadow-2xl border border-white/10">🤵</div>
            <div>
              <h2 className="text-3xl font-thin tracking-widest uppercase">The <span className="font-serif-elegant italic text-[#d4af37]">Concierge</span></h2>
              <p className="text-[9px] text-[#d4af37] font-black uppercase tracking-[0.5em] mt-2">Elite Protocol Active</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition-all relative z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar bg-slate-50/30">
          {messages.map((msg, i) => (
            <div key={i} className="space-y-6">
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-8 rounded-[3rem] text-lg font-medium shadow-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#0a0a0a] text-white rounded-tr-none' 
                    : 'bg-white text-slate-900 rounded-tl-none border border-slate-100'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                      {msg.sources.map((src, idx) => (
                        <a key={idx} href={src.uri} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-slate-50 text-slate-800 rounded-2xl text-[10px] font-black border border-slate-200 hover:bg-[#d4af37] hover:text-white transition-all flex items-center gap-3">
                          <span className="opacity-40 text-sm">📍</span> {src.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {msg.role === 'model' && msg.suggestions && i === messages.length - 1 && (
                <div className="flex flex-wrap gap-4 justify-start animate-in fade-in slide-in-from-left-6 duration-1000">
                  {msg.suggestions.map((sug, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleSend(sug)}
                      className="px-8 py-4 bg-white border border-slate-200 hover:border-[#d4af37] text-[#0a0a0a] text-[11px] font-black uppercase tracking-widest rounded-3xl shadow-xl transition-all active:scale-95"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-8 py-5 rounded-[2rem] rounded-tl-none border border-slate-100 flex gap-2 shadow-sm items-center">
                <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce [animation-delay:-0.2s]" />
                <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce [animation-delay:-0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-12 pt-8 border-t border-slate-100 bg-white">
          <div className="flex gap-6">
            <div 
              onClick={onOpenKeyboard}
              className="flex-1 h-24 bg-slate-50 border border-slate-200 rounded-[2.5rem] px-12 flex items-center text-xl font-medium cursor-pointer shadow-inner hover:border-[#d4af37]/30 transition-all overflow-hidden"
            >
              <span className={`truncate ${externalInput ? 'text-[#0a0a0a]' : 'text-slate-400 font-light italic'}`}>
                {externalInput || (isArabic ? "بماذا يمكنني مساعدتكم؟" : "How may I assist you today?")}
              </span>
            </div>
            <button 
              onClick={() => handleSend()}
              disabled={isTyping || !externalInput.trim()}
              className="w-24 h-24 bg-[#0a0a0a] text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl active:scale-90 transition-all disabled:opacity-20 border-b-4 border-[#d4af37]"
            >
              <svg className={`w-10 h-10 ${isArabic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConcierge;
