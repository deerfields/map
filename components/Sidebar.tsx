
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Unit, NavNode, MallCategory, RouteMode, FloorID, MallEvent } from '../types';

interface SidebarProps {
  isOpen: boolean;
  isArabic: boolean;
  query: string;
  onSearch: (q: string) => void;
  onOpenKeyboard: () => void;
  selectedStore: Unit | null;
  activePath: NavNode[];
  onReset: () => void;
  onToggleLang: () => void;
  onOpenAdmin: () => void;
  categories: MallCategory[];
  events: MallEvent[];
  units: Unit[];
  onSelectStore: (u: Unit) => void;
  routeMode: RouteMode;
  onSetRouteMode: (m: RouteMode) => void;
  onOpenAI: () => void;
  isOnline: boolean;
  isEmergency: boolean;
  onGetDirections?: (unit: Unit) => void;
  currentFloor: FloorID;
  onFloorChange: (f: FloorID) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, isArabic, query, onSearch, onOpenKeyboard, selectedStore, activePath, onReset, onToggleLang,
  onOpenAdmin, onOpenAI, isOnline, isEmergency, categories, events, units, onSelectStore, onGetDirections,
  currentFloor, onFloorChange
}) => {
  const [isGatewayVisible, setIsGatewayVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'events'>('browse');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (isGatewayVisible) {
      setSelectedCategoryId(null);
      setActiveTab('browse');
    }
  }, [isGatewayVisible]);

  const pillars = [
    { 
      id: 'p1', 
      nameEn: 'GARDEN DINING', 
      nameAr: 'مطاعم الحديقة', 
      descEn: 'Exceptional al fresco culinary experiences.',
      descAr: 'تجارب طهي استثنائية في الهواء الطلق.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800',
      cats: ['cat-dining', 'cat-cafes'] 
    },
    { 
      id: 'p2', 
      nameEn: 'ELITE FASHION', 
      nameAr: 'أزياء النخبة', 
      descEn: 'Curated luxury and timeless elegance.',
      descAr: 'فخامة منسقة وأناقة خالدة.',
      image: 'https://images.unsplash.com/photo-1539109132381-31a1ec974373?q=80&w=800',
      cats: ['cat-fashion', 'cat-jewelry'] 
    },
    { 
      id: 'p3', 
      nameEn: 'FAMILY FUN', 
      nameAr: 'مرح عائلي', 
      descEn: 'Joyful moments for every generation.',
      descAr: 'لحظات سعيدة لكل الأجيال.',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800',
      cats: ['cat-entertainment', 'cat-museum'] 
    },
    { 
      id: 'p4', 
      nameEn: 'COMMUNITY HUB', 
      nameAr: 'مركز المجتمع', 
      descEn: 'Wellness and essential neighborhood services.',
      descAr: 'العافية والخدمات الأساسية للحي.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800',
      cats: ['cat-medical', 'cat-services'] 
    },
  ];

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    units.forEach(u => {
      counts[u.category] = (counts[u.category] || 0) + 1;
    });
    return counts;
  }, [units]);

  const filteredUnits = useMemo(() => {
    let result = units.filter(u => u.status !== 'closed');
    if (selectedCategoryId) result = result.filter(u => u.category === selectedCategoryId);
    const search = query.toLowerCase().trim();
    if (search) {
      result = result.filter(u => 
        u.nameEn.toLowerCase().includes(search) || 
        u.nameAr.toLowerCase().includes(search) ||
        u.tags.some(t => t.toLowerCase().includes(search))
      );
    }
    return result;
  }, [query, units, selectedCategoryId]);

  const handlePillarClick = (catIds: string[]) => {
    setSelectedCategoryId(catIds[0]);
    setIsGatewayVisible(false);
  };

  const handleReset = () => {
    setIsGatewayVisible(true);
    setSelectedCategoryId(null);
    onReset();
  };

  const floorDots = [FloorID.L2, FloorID.L1, FloorID.ML, FloorID.SL, FloorID.GL];

  if (selectedStore) {
    return (
      <aside className={`relative z-30 w-full lg:w-[540px] h-full bg-[#0a0a0a] flex flex-col overflow-hidden shadow-[40px_0_100px_rgba(0,0,0,0.5)] ${isArabic ? 'order-last' : 'order-first'}`}>
         <div className="p-12 lg:p-16 flex flex-col h-full relative z-10">
            <div className="flex items-center justify-between mb-16 shrink-0">
              <div onClick={handleReset} className="cursor-pointer">
                <h1 className="text-sm font-light tracking-[0.5em] text-white opacity-60 uppercase">DEERFIELDS <span className="text-[#d4af37] font-bold">MALL</span></h1>
              </div>
              <button onClick={onToggleLang} className="text-[10px] font-black tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                {isArabic ? 'ENGLISH' : 'العربية'}
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center text-center opacity-20">
               <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4">Focus Mode</p>
               <p className="text-sm font-light uppercase tracking-widest leading-relaxed">Destination Details<br/>on Interactive Map</p>
            </div>
            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between shrink-0">
               <button onClick={handleReset} className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all">
                 {isArabic ? 'العودة للاكتشاف' : 'Back to Discovery'}
               </button>
            </div>
         </div>
      </aside>
    );
  }

  return (
    <aside className={`relative z-30 w-full lg:w-[600px] h-full concierge-bg flex flex-col overflow-hidden shadow-[40px_0_100px_rgba(0,0,0,0.5)] ${isArabic ? 'order-last' : 'order-first'}`}>
      {isGatewayVisible && (
        <>
          <div className="hero-glow top-[-300px] left-[-200px]" />
          <div className="hero-glow bottom-[-300px] right-[-200px]" />
        </>
      )}

      <div className="p-12 lg:p-16 flex flex-col h-full relative z-10">
        <div className="flex items-center justify-between mb-12 shrink-0">
          <div onClick={onOpenAdmin} className="cursor-pointer">
            <h1 className="text-xs font-light tracking-[0.6em] text-white/40 uppercase">DEERFIELDS <span className="text-[#d4af37] font-bold">MALL</span></h1>
          </div>
          <div className="flex gap-8 items-center">
            <button onClick={onOpenAI} className="w-10 h-10 flex items-center justify-center text-[#d4af37] hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 11V7M12 17v-4" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <button onClick={onToggleLang} className="text-[10px] font-black tracking-[0.3em] text-white/30 hover:text-white transition-colors">{isArabic ? 'ENGLISH' : 'العربية'}</button>
          </div>
        </div>

        {isGatewayVisible ? (
          <div className="flex-1 flex flex-col justify-center space-y-12 lg:space-y-16 animate-fade-in-up">
             <div className="space-y-4 text-center">
                <h2 className="text-6xl lg:text-[6.5rem] font-thin tracking-tighter text-white leading-[0.9]">
                  The <span className="font-serif-elegant italic text-[#d4af37]">Concierge</span>
                </h2>
                <p className="text-base lg:text-lg text-white/40 font-light tracking-[0.2em] uppercase max-w-sm mx-auto">
                  {isArabic ? 'وجهتك المنسقة للاكتشاف والتميز.' : 'Your curated gateway to discovery and excellence.'}
                </p>
             </div>

             <div className="flex flex-col items-center gap-10">
                <div className="grid grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
                  {pillars.map((pillar) => (
                    <button 
                      key={pillar.id} 
                      onClick={() => handlePillarClick(pillar.cats)}
                      className="portal-card group"
                    >
                      <img src={pillar.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute inset-x-6 bottom-8 text-left">
                         <p className="text-xl lg:text-2xl font-semibold text-white group-hover:text-[#d4af37] transition-colors tracking-tight">
                           {isArabic ? pillar.nameAr : pillar.nameEn}
                         </p>
                         <p className="text-[9px] text-white/50 font-light uppercase tracking-widest mt-2 line-clamp-1">
                           {isArabic ? pillar.descAr : pillar.descEn}
                         </p>
                      </div>
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setIsGatewayVisible(false)}
                  className="gold-pill-button h-24 lg:h-28 w-full max-w-md rounded-full flex items-center justify-center gap-6 group"
                >
                  <span className="text-lg lg:text-xl font-black uppercase tracking-[0.5em] text-white">
                    {isArabic ? 'ابدأ الاستكشاف' : 'Begin Discovery'}
                  </span>
                  <svg className={`w-6 h-6 text-white group-hover:translate-x-2 transition-transform ${isArabic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden animate-fade-in-up">
            <div className="flex gap-10 mb-8 border-b border-white/5 shrink-0">
               <button onClick={() => setActiveTab('browse')} className={`pb-4 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'browse' ? 'text-[#d4af37] border-b-2 border-[#d4af37]' : 'text-white/40'}`}>
                 {isArabic ? 'تصفح المتاجر' : 'Browse Stores'}
               </button>
               <button onClick={() => setActiveTab('events')} className={`pb-4 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'events' ? 'text-[#d4af37] border-b-2 border-[#d4af37]' : 'text-white/40'}`}>
                 {isArabic ? 'فعاليات ديرفيلدز' : 'Mall Events'}
               </button>
            </div>

            {activeTab === 'browse' ? (
              <>
                <div className="mb-6 shrink-0">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.3em]">
                      {isArabic ? 'فئات التسوق' : 'SHOPPING CATEGORIES'}
                    </p>
                    {selectedCategoryId && (
                      <button 
                        onClick={() => setSelectedCategoryId(null)}
                        className="text-[9px] font-bold text-white/40 hover:text-[#d4af37] transition-colors uppercase tracking-widest"
                      >
                        {isArabic ? 'مسح التصفية' : 'CLEAR FILTER'}
                      </button>
                    )}
                  </div>
                  <div className="flex overflow-x-auto no-scrollbar gap-3">
                    <button 
                      onClick={() => setSelectedCategoryId(null)} 
                      className={`px-8 py-4 rounded-3xl text-[9px] font-black uppercase tracking-widest transition-all border shrink-0 ${!selectedCategoryId ? 'bg-[#d4af37] border-[#d4af37] text-white' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
                    >
                      {isArabic ? 'الكل' : 'ALL'}
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat.id} 
                        onClick={() => setSelectedCategoryId(cat.id)} 
                        className={`px-6 py-4 rounded-3xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-3 border group ${selectedCategoryId === cat.id ? 'bg-[#d4af37] border-[#d4af37] text-white shadow-lg shadow-[#d4af37]/20' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
                      >
                        {cat.iconKey && <span className={`text-sm transition-opacity ${selectedCategoryId === cat.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>{cat.iconKey}</span>}
                        <span>{isArabic ? cat.nameAr : cat.nameEn}</span>
                        <span className={`text-[8px] opacity-30 ${selectedCategoryId === cat.id ? 'text-white' : 'text-white/40'}`}>
                          ({categoryCounts[cat.id] || 0})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-20">
                  {filteredUnits.length > 0 ? (
                    filteredUnits.map((u) => (
                      <button 
                        key={u.id} 
                        onClick={() => onSelectStore(u)}
                        className="w-full p-6 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center gap-6 group hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shrink-0 shadow-inner">
                          {u.logoUrl ? <img src={u.logoUrl} className="w-full h-full object-contain" alt="" /> : <span className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity">🛍️</span>}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <h4 className="text-xl font-black text-white uppercase truncate group-hover:text-[#d4af37] transition-colors">{isArabic ? u.nameAr : u.nameEn}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-white/40 font-medium uppercase tracking-widest">{u.floor}</span>
                            <span className="w-1 h-1 bg-white/10 rounded-full" />
                            <span className="text-[10px] text-white/40 font-medium uppercase tracking-widest">{u.mallAddress}</span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0">
                          <svg className={`w-5 h-5 text-[#d4af37] ${isArabic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-center opacity-30">
                      <span className="text-4xl mb-4">🔍</span>
                      <p className="text-sm font-light uppercase tracking-widest leading-relaxed">
                        {isArabic ? 'لم يتم العثور على نتائج تطابق هذا الفلتر.' : 'No destinations match this filter.'}
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-20">
                 {events.map(event => (
                   <div key={event.id} className="group p-8 bg-white/5 border border-white/5 rounded-[3rem] space-y-6">
                      <div className="h-48 rounded-[2rem] overflow-hidden bg-slate-800">
                        {event.imageUrl && <img src={event.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />}
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-[#d4af37] uppercase tracking-widest">{isArabic ? event.dateAr : event.dateEn}</p>
                        <h4 className="text-2xl font-black text-white uppercase">{isArabic ? event.titleAr : event.titleEn}</h4>
                        <p className="text-sm text-white/50 leading-relaxed">{isArabic ? event.descAr : event.descEn}</p>
                      </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-4">
              {floorDots.map(l => (
                <button 
                  key={l} 
                  onClick={() => onFloorChange(l)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[9px] font-black transition-all border ${l === currentFloor ? 'bg-[#d4af37] border-[#d4af37] text-white shadow-lg' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                >
                  {l}
                </button>
              ))}
           </div>
           <button onClick={onOpenAI} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:border-[#d4af37] transition-all">
              <svg className="w-6 h-6 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth="2" strokeLinecap="round"/></svg>
           </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
