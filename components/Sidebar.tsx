
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Unit, NavNode, MallCategory, RouteMode } from '../types';

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
  units: Unit[];
  onSelectStore: (u: Unit) => void;
  routeMode: RouteMode;
  onSetRouteMode: (m: RouteMode) => void;
  onOpenAI: () => void;
  isOnline: boolean;
  isEmergency: boolean;
  onGetDirections?: (unit: Unit) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, isArabic, query, onSearch, onOpenKeyboard, selectedStore, activePath, onReset, onToggleLang,
  onOpenAdmin, onOpenAI, isOnline, isEmergency, categories, units, onSelectStore, onGetDirections
}) => {
  const [isGatewayVisible, setIsGatewayVisible] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Reset category filter when gateway is shown or store is selected
  useEffect(() => {
    if (isGatewayVisible || selectedStore) {
      setSelectedCategoryId(null);
    }
  }, [isGatewayVisible, selectedStore]);

  const pillars = [
    { 
      id: 'p1', 
      nameEn: 'Dine & Delight', 
      nameAr: 'المطاعم والمقاهي', 
      descEn: 'Artisan coffee to signature dining.',
      descAr: 'من القهوة المختصة إلى المطاعم الفاخرة.',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M3 2v7c0 1.1.9 2 2 2h4v10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V11h4c1.1 0 2-.9 2-2V2M12 2v9M8 2v5M16 2v5" strokeLinecap="round"/>
        </svg>
      ),
      cats: ['cat-food-court', 'cat-dining-restaurants', 'cat-cafes', 'cat-specialty-food'] 
    },
    { 
      id: 'p2', 
      nameEn: 'Discover & Unwind', 
      nameAr: 'الاكتشاف والترفيه', 
      descEn: 'Boutique shopping & entertainment.',
      descAr: 'تسوق فاخر وترفيه.',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6M7 10h6" strokeLinecap="round"/>
        </svg>
      ),
      cats: ['cat-fashion', 'cat-womens-fashion', 'cat-mens-fashion', 'cat-kids-fashion', 'cat-jewelry-watches', 'cat-entertainment'] 
    },
    { 
      id: 'p3', 
      nameEn: 'Services & Care', 
      nameAr: 'الخدمات والرعاية', 
      descEn: 'Health, wellness, and convenience.',
      descAr: 'خدمات أساسية لراحتكم وعافيتكم.',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 8v8M8 12h8" strokeLinecap="round"/>
        </svg>
      ),
      cats: ['cat-medical-pharmacies', 'cat-hypermarket', 'cat-salons', 'cat-financial-services'] 
    },
    { 
      id: 'p4', 
      nameEn: 'Beyond', 
      nameAr: 'أبعد من ذلك', 
      descEn: 'Home, lifestyle, and logistics.',
      descAr: 'المفروشات والخدمات اللوجستية.',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round"/>
        </svg>
      ),
      cats: ['cat-furnishing', 'cat-specialty-stores', 'cat-museum'] 
    },
  ];

  const filteredUnits = useMemo(() => {
    let result = units.filter(u => ['store', 'restaurant', 'coffee', 'kiosk', 'pop_up'].includes(u.type) && u.status !== 'closed');
    
    if (selectedCategoryId) {
      result = result.filter(u => u.category === selectedCategoryId);
    }
    
    const search = query.toLowerCase().trim();
    if (search) {
      const startsWith = result.filter(u => u.nameEn.toLowerCase().startsWith(search) || u.nameAr.toLowerCase().startsWith(search));
      const contains = result.filter(u => !startsWith.includes(u) && (u.nameEn.toLowerCase().includes(search) || u.nameAr.toLowerCase().includes(search)));
      return [...startsWith, ...contains];
    }
    
    return result;
  }, [query, units, selectedCategoryId]);

  const handlePillarClick = (catIds: string[]) => {
    if (catIds.length > 0) {
      setSelectedCategoryId(catIds[0]);
      setIsGatewayVisible(false);
    }
  };

  const handleBeginDiscovery = () => {
    setIsGatewayVisible(false);
    onOpenKeyboard();
  };

  const handleReset = () => {
    setIsGatewayVisible(true);
    setSelectedCategoryId(null);
    onReset();
  };

  const handleCategorySelect = (id: string | null) => {
    setSelectedCategoryId(id);
  };

  if (selectedStore) {
    return (
      <aside className={`relative z-30 w-full lg:w-[540px] h-full bg-white flex flex-col overflow-hidden animate-in slide-in-from-right duration-700 shadow-[-80px_0_100px_rgba(0,0,0,0.2)] ${isArabic ? 'order-last' : 'order-first'}`}>
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-50">
          <button onClick={handleReset} className="w-14 h-14 bg-white/60 backdrop-blur-2xl rounded-[1.5rem] flex items-center justify-center shadow-2xl border border-white/40 hover:scale-110 active:scale-90 transition-all">
            <svg className={`w-7 h-7 text-[#111111] ${isArabic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={onToggleLang} className="px-6 py-3 bg-white/60 backdrop-blur-2xl rounded-2xl text-[10px] font-black tracking-[0.2em] shadow-2xl border border-white/40 text-[#111111]">
            {isArabic ? 'ENGLISH' : 'العربية'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="relative h-[500px] w-full bg-[#0a0a0a] overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-white z-10" />
             {selectedStore.bannerUrl ? (
               <img src={selectedStore.bannerUrl} className="w-full h-full object-cover opacity-80" alt="" />
             ) : (
               <div className="w-full h-full flex items-center justify-center opacity-10">
                  <span className="text-[120px]">🛍️</span>
               </div>
             )}
             <div className="absolute bottom-[-20px] left-12 w-32 h-32 bg-white rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.3)] z-20 flex items-center justify-center p-8 border border-white/50">
               {selectedStore.logoUrl ? <img src={selectedStore.logoUrl} className="w-full h-full object-contain" alt="" /> : <span className="text-5xl">🛍️</span>}
             </div>
          </div>

          <div className="px-14 pt-24 pb-12 space-y-8">
            <div className="flex items-center gap-5">
               <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.4em] bg-[#d4af37]/10 px-5 py-2 rounded-full border border-[#d4af37]/20">
                 {isArabic ? categories.find(c => c.id === selectedStore.category)?.nameAr : categories.find(c => c.id === selectedStore.category)?.nameEn}
               </span>
               <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedStore.floor} • {selectedStore.mallAddress}</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-6xl font-black text-[#111111] tracking-tighter uppercase leading-[0.85] break-words">
                {isArabic ? selectedStore.nameAr : selectedStore.nameEn}
              </h2>
              <p className="text-3xl font-light italic text-slate-400 leading-tight font-serif-elegant border-l-4 border-[#d4af37] pl-8 py-2">
                {isArabic ? (selectedStore.taglineAr || "اكتشف الأناقة") : (selectedStore.taglineEn || "Experience the exceptional.")}
              </p>
            </div>
          </div>

          <div className="px-14 py-14 bg-slate-50/50 space-y-12">
             <div className="grid grid-cols-1 gap-10">
                <div className="flex items-start gap-8">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl text-[#d4af37] border border-slate-100 shrink-0">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Operation Status</p>
                    <div className="flex items-center gap-4">
                      <span className={`text-xl font-black ${selectedStore.status === 'open' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {selectedStore.status === 'open' ? (isArabic ? 'مفتوح الآن' : 'OPEN NOW') : (isArabic ? 'مغلق حالياً' : 'CLOSED NOW')}
                      </span>
                      <span className="text-sm text-slate-500 font-medium tracking-tight">({selectedStore.openingTime} — {selectedStore.closingTime})</span>
                    </div>
                  </div>
                </div>

                {selectedStore.phoneNumber && (
                   <div className="flex items-start gap-8">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl text-[#d4af37] border border-slate-100 shrink-0">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2"/></svg>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Concierge Direct</p>
                      <p className="text-2xl font-black text-[#111111]">{selectedStore.phoneNumber}</p>
                    </div>
                  </div>
                )}
             </div>

             <div className="pt-10 border-t border-slate-200">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Maison Biography</p>
                <p className="text-lg text-slate-600 font-medium leading-relaxed italic">
                  {isArabic ? selectedStore.descriptionAr : selectedStore.descriptionEn}
                </p>
             </div>
          </div>

          <div className="p-14 pb-24 space-y-6">
             <button 
               onClick={() => onGetDirections?.(selectedStore)}
               className="w-full h-32 bg-[#d4af37] hover:bg-[#b08d57] text-white rounded-[4rem] flex items-center justify-center gap-8 shadow-[0_40px_80px_rgba(212,175,55,0.35)] active:scale-95 transition-all group relative overflow-hidden"
             >
               <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
               <div className="w-14 h-14 bg-white/20 rounded-3xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2.5"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2.5"/></svg>
               </div>
               <span className="text-3xl font-black uppercase tracking-[0.1em]">{isArabic ? 'بدء الملاحة' : 'NAVIGATE NOW'}</span>
             </button>
             
             <div className="grid grid-cols-2 gap-6">
                <button className="h-24 border-2 border-slate-200 rounded-[2.5rem] flex items-center justify-center gap-4 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-slate-50 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeWidth="2.5"/></svg>
                  Bookmark
                </button>
                <button className="h-24 border-2 border-slate-200 rounded-[2.5rem] flex items-center justify-center gap-4 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-slate-50 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeWidth="2.5"/></svg>
                  Send
                </button>
             </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`relative z-30 w-full lg:w-[540px] h-full bg-[#0a0a0a] flex flex-col overflow-hidden shadow-[40px_0_100px_rgba(0,0,0,0.5)] ${isArabic ? 'order-last' : 'order-first'}`}>
      {isGatewayVisible && (
        <>
          <div className="hero-glow top-[-200px] left-[-200px]" />
          <div className="hero-glow bottom-[-200px] right-[-200px]" />
        </>
      )}

      <div className="p-12 lg:p-16 flex flex-col h-full relative z-10">
        {/* Header - Masterbrand */}
        <div className="flex items-center justify-between mb-16 shrink-0">
          <div onClick={onOpenAdmin} className="cursor-pointer">
            <h1 className="text-sm font-light tracking-[0.5em] text-white opacity-60 uppercase">DEERFIELDS <span className="text-[#d4af37] font-bold">MALL</span></h1>
          </div>
          <div className="flex gap-6 items-center">
            {!isGatewayVisible && (
              <button onClick={handleReset} className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                <svg className={`w-6 h-6 ${isArabic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            )}
            <button onClick={onOpenAI} className="w-10 h-10 flex items-center justify-center text-[#d4af37] hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 11V7M12 17v-4" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <button onClick={onToggleLang} className="text-[10px] font-black tracking-[0.2em] text-white/40 hover:text-white transition-colors">{isArabic ? 'ENGLISH' : 'العربية'}</button>
          </div>
        </div>

        {isGatewayVisible ? (
          <div className="flex-1 flex flex-col justify-center space-y-20 animate-fade-in-up">
             <div className="space-y-6 text-center lg:text-left">
                <h2 className="text-7xl lg:text-8xl font-thin tracking-tighter text-white leading-none">
                  The <span className="font-serif-elegant italic text-[#d4af37]">Concierge</span>
                </h2>
                <p className="text-lg lg:text-xl text-white/50 font-light tracking-wide max-w-sm mx-auto lg:mx-0">
                  {isArabic ? 'دليلك المختار للاستكشاف.' : 'Your curated guide to discovery.'}
                </p>
             </div>

             <div className="flex flex-col items-center lg:items-start gap-12">
                <button 
                  onClick={handleBeginDiscovery}
                  className="group relative h-28 px-16 bg-[#d4af37] rounded-full flex items-center justify-center gap-6 shadow-[0_30px_60px_rgba(212,175,55,0.2)] active:scale-95 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xl font-black uppercase tracking-[0.3em] text-white relative z-10">
                    {isArabic ? 'ابدأ الاستكشاف' : 'Begin Discovery'}
                  </span>
                  <svg className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="3" strokeLinecap="round"/></svg>
                </button>

                <div className="grid grid-cols-2 gap-4 w-full">
                  {pillars.map((pillar, idx) => (
                    <button 
                      key={pillar.id} 
                      onClick={() => handlePillarClick(pillar.cats)}
                      className="pillar-card p-8 bg-white/5 rounded-[2.5rem] flex flex-col items-start text-left gap-6 group hover:bg-white/10"
                      style={{ animationDelay: `${idx * 150}ms` }}
                    >
                      <div className="text-[#d4af37] group-hover:scale-110 transition-transform duration-500">
                        {pillar.icon}
                      </div>
                      <div className="space-y-2">
                         <p className="text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors">
                           {isArabic ? pillar.nameAr : pillar.nameEn}
                         </p>
                         <p className="text-[10px] text-white/40 font-medium leading-relaxed uppercase tracking-widest">
                           {isArabic ? pillar.descAr : pillar.descEn}
                         </p>
                      </div>
                    </button>
                  ))}
                </div>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden animate-fade-in-up">
            <div className="space-y-10 mb-8 shrink-0">
               <div className="flex items-center justify-between">
                 <h2 className="text-4xl font-thin tracking-tighter text-white uppercase">
                   Browse <span className="font-serif-elegant italic text-[#d4af37]">Collection</span>
                 </h2>
                 <button onClick={onOpenKeyboard} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37] hover:scale-110 transition-all">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2.5"/></svg>
                 </button>
               </div>

               {/* High-Fidelity Category Filter */}
               <div className="relative group/cats">
                 <div 
                   ref={categoryScrollRef}
                   className="flex overflow-x-auto no-scrollbar gap-4 pb-2 scroll-smooth"
                 >
                   <button 
                     onClick={() => handleCategorySelect(null)}
                     className={`flex flex-col items-center gap-3 px-6 py-5 rounded-[2rem] min-w-[100px] transition-all border shrink-0 ${!selectedCategoryId ? 'bg-[#d4af37] border-[#d4af37] text-white shadow-[0_15px_30px_rgba(212,175,55,0.2)]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                   >
                     <span className="text-2xl mb-1">🔍</span>
                     <span className="text-[9px] font-black uppercase tracking-widest">
                       {isArabic ? 'الكل' : 'ALL'}
                     </span>
                   </button>
                   {categories.map(cat => (
                     <button 
                       key={cat.id}
                       onClick={() => handleCategorySelect(cat.id)}
                       className={`flex flex-col items-center gap-3 px-6 py-5 rounded-[2rem] min-w-[100px] transition-all border shrink-0 ${selectedCategoryId === cat.id ? 'bg-[#d4af37] border-[#d4af37] text-white shadow-[0_15px_30px_rgba(212,175,55,0.2)]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                     >
                       <span className="text-2xl mb-1">{cat.iconKey || '🛍️'}</span>
                       <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight max-w-[80px]">
                         {isArabic ? cat.nameAr : cat.nameEn}
                       </span>
                     </button>
                   ))}
                 </div>
                 
                 {/* Decorative Shadows for Scroll */}
                 <div className={`absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none transition-opacity duration-500 opacity-100 group-hover/cats:opacity-0 ${isArabic ? 'hidden' : 'block'}`} />
                 <div className={`absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none transition-opacity duration-500 opacity-100 group-hover/cats:opacity-0 ${isArabic ? 'block' : 'hidden'}`} />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-20">
               <div className="flex justify-between items-center mb-4 px-2">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                    {filteredUnits.length} {isArabic ? 'نتائج وجدت' : 'Properties Found'}
                 </p>
                 {selectedCategoryId && (
                   <button onClick={() => setSelectedCategoryId(null)} className="text-[8px] font-bold text-[#d4af37] uppercase tracking-widest">Clear Filter</button>
                 )}
               </div>

               {filteredUnits.length > 0 ? (
                 filteredUnits.map((u, idx) => (
                   <button 
                    key={u.id} 
                    onClick={() => onSelectStore(u)}
                    className="w-full p-6 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center gap-6 group hover:bg-white/10 hover:border-[#d4af37]/30 transition-all text-left"
                    style={{ animationDelay: `${idx * 80}ms` }}
                   >
                     <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center p-4 shadow-xl shrink-0 group-hover:scale-110 transition-transform duration-500">
                        {u.logoUrl ? <img src={u.logoUrl} className="w-full h-full object-contain" alt="" /> : <span className="text-3xl">🛍️</span>}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                           <span className="text-[8px] font-black text-[#d4af37] uppercase tracking-widest bg-[#d4af37]/10 px-2 py-1 rounded-lg">
                             {isArabic ? categories.find(c => c.id === u.category)?.nameAr : categories.find(c => c.id === u.category)?.nameEn}
                           </span>
                           <span className="text-[8px] text-white/30 font-bold uppercase tracking-widest">{u.floor}</span>
                        </div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight truncate">
                          {isArabic ? u.nameAr : u.nameEn}
                        </h4>
                        <p className="text-[10px] text-white/40 font-medium truncate italic mt-1 font-serif-elegant">
                          {isArabic ? (u.taglineAr || "اكتشف الأناقة") : (u.taglineEn || "Experience elegance.")}
                        </p>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#d4af37] transition-all">
                       <svg className={`w-5 h-5 text-white/20 group-hover:text-white ${isArabic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                     </div>
                   </button>
                 ))
               ) : (
                 <div className="py-20 text-center space-y-6 opacity-30">
                   <div className="text-8xl mb-4">📭</div>
                   <p className="text-xl font-light uppercase tracking-[0.3em] text-white">No items found</p>
                   <button onClick={() => setSelectedCategoryId(null)} className="px-8 py-3 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white">Reset View</button>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Footer - Levels & Live Assistant */}
        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between shrink-0 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
           <div className="flex items-center gap-6">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Tier</p>
              <div className="flex gap-2">
                 {['L2', 'L1', 'ML', 'SL', 'GL', 'B'].map(l => (
                   <button key={l} className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${l === 'ML' ? 'bg-[#d4af37] text-white shadow-lg' : 'border border-white/10 text-white/40 hover:border-white/30'}`}>{l}</button>
                 ))}
              </div>
           </div>
           <button onClick={onOpenAI} className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:border-[#d4af37] transition-all shadow-xl">
                 <svg className="w-6 h-6 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af37]">Live Concierge</p>
                 <p className="text-[8px] text-white/30 uppercase tracking-[0.1em]">Protocol Active</p>
              </div>
           </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
