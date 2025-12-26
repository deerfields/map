import React, { useMemo, useState } from 'react';
import { Unit, NavNode, MallCategory, FloorID, MallEvent } from '../types';

interface SidebarProps {
  isOpen: boolean;
  isArabic: boolean;
  query: string;
  onQueryChange?: (q: string) => void;
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
  onOpenAI: () => void;
  onGetDirections?: (unit: Unit) => void;
  currentFloor: FloorID;
  onFloorChange: (f: FloorID) => void;
}

interface Pillar {
  id: string;
  nameEn: string;
  nameAr: string;
  taglineEn: string;
  taglineAr: string;
  descEn: string;
  descAr: string;
  image: string;
  cats: string[];
  themeTexture?: string; 
}

const CategoryIcon: React.FC<{ iconKey?: string; className?: string }> = ({ iconKey, className = "w-6 h-6" }) => {
  const strokeColor = "currentColor";
  const strokeWidth = "1.5";
  const iconProps = { className, fill: "none", stroke: strokeColor, strokeWidth, viewBox: "0 0 24 24", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (iconKey) {
    case 'dining': return (
      <svg {...iconProps}>
        <path d="M18 2v10M18 20v2M18 12c-2.2 0-4-1.8-4-4V2M4 2v10c0 2.2 1.8 4 4 4h2M10 2v14M7 2v4M4 2v4M13 2v4" />
      </svg>
    );
    case 'cafes': return (
      <svg {...iconProps}>
        <path d="M17 8h1a4 4 0 110 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zM6 2v3M10 2v3M14 2v3" />
      </svg>
    );
    case 'food-court': return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="10" /><path d="M12 6c-3.3 0-6 2.7-6 6M12 18c3.3 0 6-2.7 6-6" />
      </svg>
    );
    case 'hypermarket': return (
      <svg {...iconProps}>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" />
      </svg>
    );
    case 'fashion': return (
      <svg {...iconProps}>
        <path d="M12 2v4M12 2a4 4 0 00-4 4v12a4 4 0 008 0V6a4 4 0 00-4-4z" />
      </svg>
    );
    case 'women-fashion': return (
      <svg {...iconProps}>
        <path d="M8 2h8l4 10H4L8 2zM12 12v10M4 12c0 4.4 3.6 8 8 8s8-3.6 8-8" />
      </svg>
    );
    case 'men-fashion': return (
      <svg {...iconProps}>
        <path d="M6 2l6 4 6-4M6 22h12M12 6v16" />
      </svg>
    );
    case 'jewelry': return (
      <svg {...iconProps}>
        <path d="M12 3l4 5-4 5-4-5 4-5zM12 13v8M16 8h5M3 8h5" />
      </svg>
    );
    case 'beauty': return (
      <svg {...iconProps}>
        <rect x="6" y="10" width="12" height="10" rx="2" /><path d="M9 10V6a3 3 0 016 0v4" />
      </svg>
    );
    case 'optics': return (
      <svg {...iconProps}>
        <path d="M2 12a5 5 0 015-5h1a5 5 0 015 5M22 12a5 5 0 00-5-5h-1a5 5 0 00-5 5" /><circle cx="7" cy="12" r="3" /><circle cx="17" cy="12" r="3" />
      </svg>
    );
    case 'bags': return (
      <svg {...iconProps}>
        <path d="M4 20h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2zM12 6V2" />
      </svg>
    );
    case 'entertainment': return (
      <svg {...iconProps}>
        <path d="M5 3l14 9-14 9V3z" />
      </svg>
    );
    case 'medical': return (
      <svg {...iconProps}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
    case 'electronics': return (
      <svg {...iconProps}>
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    );
    case 'furnishing': return (
      <svg {...iconProps}>
        <path d="M4 18v3M20 18v3M19 13v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4M2 13h20v5H2z" />
      </svg>
    );
    default: return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="2" /><path d="M12 2v2M12 20v2M20 12h2M2 12h2M17.6 6.4l-1.4 1.4M6.4 17.6l-1.4 1.4M17.6 17.6l-1.4-1.4M6.4 6.4l-1.4-1.4" />
      </svg>
    );
  }
};

const Sidebar: React.FC<SidebarProps> = ({ 
  isArabic, query, onQueryChange, onSearch, onReset, onToggleLang,
  onOpenAdmin, onOpenAI, categories, events, units, onSelectStore,
  currentFloor, onFloorChange, selectedStore, onOpenKeyboard
}) => {
  const [isGatewayVisible, setIsGatewayVisible] = useState(true);
  const [selectedPillarId, setSelectedPillarId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const pillars: Pillar[] = [
    { 
      id: 'pillar-taste', 
      nameEn: 'TASTE & GATHER', 
      nameAr: 'طعم واجتمع', 
      taglineEn: 'A guide to restaurants and cafés.',
      taglineAr: 'دليلك للمطاعم والمقاهي.',
      descEn: 'A curated culinary journey through global flavors.', 
      descAr: 'رحلة طهي مختارة بعناية عبر نكهات عالمية.', 
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800', 
      cats: ['cat-dining', 'cat-cafes', 'cat-food-court', 'cat-specialty-food', 'cat-hypermarket'],
      themeTexture: 'url("https://www.transparenttextures.com/patterns/gray-floral.png")'
    },
    { 
      id: 'pillar-fashion', 
      nameEn: 'ELITE FASHION', 
      nameAr: 'أزياء النخبة', 
      taglineEn: 'The pinnacle of style and luxury.',
      taglineAr: 'قمة الأناقة والفخامة.',
      descEn: 'Discover the world\'s most prestigious fashion houses.', 
      descAr: 'اكتشف أرقى دور الأزياء العالمية.', 
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800', 
      cats: ['cat-fashion', 'cat-women-fashion', 'cat-men-fashion', 'cat-kids-fashion', 'cat-lingerie', 'cat-sportswear', 'cat-jewelry', 'cat-beauty', 'cat-optics', 'cat-bags'],
      themeTexture: 'url("https://www.transparenttextures.com/patterns/black-linen.png")'
    },
    { 
      id: 'pillar-family', 
      nameEn: 'FAMILY FUN', 
      nameAr: 'مرح العائلة', 
      taglineEn: 'Joy and wonder for all ages.',
      taglineAr: 'الفرح والدهشة لجميع الأعمار.',
      descEn: 'Entertainment destinations for the whole family.', 
      descAr: 'وجهات ترفيهية لجميع أفراد الأسرة.', 
      image: 'https://images.unsplash.com/photo-1472162072142-d5af07a94195?q=80&w=800', 
      cats: ['cat-entertainment', 'cat-kids-salon', 'cat-toys', 'cat-museum'],
      themeTexture: 'url("https://www.transparenttextures.com/patterns/skulls.png")'
    },
    { 
      id: 'pillar-hub', 
      nameEn: 'COMMUNITY HUB', 
      nameAr: 'مركز المجتمع', 
      taglineEn: 'Essentials for modern living.',
      taglineAr: 'أساسيات الحياة العصرية.',
      descEn: 'Public services, clinics, and essential amenities.', 
      descAr: 'الخدمات العامة، والعيادات، والمرافق الأساسية.', 
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800', 
      cats: ['cat-salons', 'cat-men-salon', 'cat-medical', 'cat-electronics', 'cat-banks', 'cat-gov', 'cat-furnishing', 'cat-specialty-stores'],
      themeTexture: 'url("https://www.transparenttextures.com/patterns/cubes.png")'
    },
  ];

  const currentPillar = useMemo(() => pillars.find(p => p.id === selectedPillarId), [selectedPillarId]);
  
  const currentPillarCategories = useMemo(() => {
    if (!currentPillar) return [];
    return categories.filter(cat => currentPillar.cats.includes(cat.id));
  }, [currentPillar, categories]);

  const featuredUnits = useMemo(() => {
    if (!selectedPillarId) return [];
    const pillar = pillars.find(p => p.id === selectedPillarId);
    if (!pillar) return [];
    return units.filter(u => pillar.cats.includes(u.category) && u.isPromoted);
  }, [selectedPillarId, units]);

  const filteredUnits = useMemo(() => {
    let result = units.filter(u => u.status !== 'closed');
    
    if (selectedPillarId) {
      const pillar = pillars.find(p => p.id === selectedPillarId);
      if (pillar) {
        result = result.filter(u => pillar.cats.includes(u.category));
      }
    }

    if (selectedCategoryId) {
      result = result.filter(u => u.category === selectedCategoryId);
    }

    const search = query.toLowerCase().trim();
    if (search) {
      result = result.filter(u => 
        u.nameEn.toLowerCase().includes(search) || 
        u.nameAr.toLowerCase().includes(search) ||
        u.tags.some(t => t.toLowerCase().includes(search))
      );
    }
    return result;
  }, [query, units, selectedCategoryId, selectedPillarId]);

  const handlePillarClick = (pillarId: string) => {
    setSelectedPillarId(pillarId);
    setSelectedCategoryId(null);
    setIsGatewayVisible(false);
  };

  const handleReset = () => {
    setIsGatewayVisible(true);
    setSelectedPillarId(null);
    setSelectedCategoryId(null);
    onReset();
  };

  const handleCategoryToggle = (id: string) => {
    setSelectedCategoryId(prev => prev === id ? null : id);
  };

  if (selectedStore) {
    return (
      <aside className={`relative z-30 w-full h-full lg:h-full bg-[#0a0a0a] flex flex-col p-8 lg:p-16 shadow-2xl ${isArabic ? 'lg:order-last' : 'lg:order-first'}`}>
        <div className="flex-1 flex flex-col justify-center items-center text-center opacity-30">
           <div className="w-20 h-20 border border-[#d4af37]/40 rounded-full flex items-center justify-center mb-8">
             <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-ping" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Spatial Active</p>
           <p className="text-sm font-light uppercase tracking-widest text-white mt-4">Destination Insight<br/>is visible on map</p>
        </div>
        <button onClick={handleReset} className="w-full py-6 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-white hover:bg-white/10 transition-all">
          {isArabic ? 'العودة للاكتشاف' : 'Back to Discovery'}
        </button>
      </aside>
    );
  }

  return (
    <aside className={`relative z-30 w-full h-full lg:h-full concierge-bg flex flex-col overflow-hidden shadow-[40px_0_100px_rgba(0,0,0,0.5)] ${isArabic ? 'lg:order-last text-right' : 'lg:order-first text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="p-8 lg:p-16 flex flex-col h-full relative z-10 overflow-y-auto no-scrollbar">
        
        {/* Branding & Top Bar - Updated to match screenshot */}
        <div className="flex items-center justify-between mb-12 shrink-0">
          <div onClick={onOpenAdmin} className="cursor-pointer group flex items-center gap-2">
            <span className="text-sm font-black text-white uppercase tracking-tighter leading-none">Deerfields Mall</span>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2 opacity-40">•</span>
            <span className="text-[9px] font-black text-[#d4af37] uppercase tracking-[0.3em]">Concierge</span>
          </div>
          <button onClick={onToggleLang} className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[9px] font-black tracking-[0.2em] text-white/80 hover:border-[#d4af37] hover:text-white transition-all">
            {isArabic ? 'English' : 'العربية'}
          </button>
        </div>

        {isGatewayVisible ? (
          <div className="flex-1 flex flex-col justify-center space-y-12 animate-fade-in-up">
            <div className="space-y-4 text-center mb-8">
              <h2 className="text-[7.5rem] font-black tracking-tighter text-white leading-[0.85] uppercase">
                The <span className="font-serif-elegant italic text-[#d4af37] font-light lowercase">Concierge</span>
              </h2>
              <p className="text-xl text-white/50 font-light tracking-[0.3em] uppercase">
                {isArabic ? 'بوابتكم المنسقة للاكتشاف والتميز' : 'Your curated gateway to discovery'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {pillars.map(pillar => (
                <button 
                  key={pillar.id} 
                  onClick={() => handlePillarClick(pillar.id)}
                  className="portal-card group relative h-56"
                >
                  <img src={pillar.image} className="absolute inset-0 w-full h-full object-cover opacity-50 brightness-75 transition-all duration-700 group-hover:opacity-70 group-hover:scale-110" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-x-6 bottom-6 z-20">
                     <p className="text-2xl font-black text-white group-hover:text-[#d4af37] transition-colors tracking-tight uppercase">
                       {isArabic ? pillar.nameAr : pillar.nameEn}
                     </p>
                     <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-1">
                       {isArabic ? pillar.descAr : pillar.descEn}
                     </p>
                  </div>
                </button>
              ))}
            </div>

            <button 
              onClick={() => setIsGatewayVisible(false)}
              className="gold-pill-button h-24 w-full rounded-full flex items-center justify-center gap-8 group mt-6"
            >
              <span className="text-xl font-black uppercase tracking-[0.4em] text-white">
                {isArabic ? 'ابدأ الاستكشاف' : 'Begin Discovery'}
              </span>
              <svg className={`w-8 h-8 text-white group-hover:translate-x-3 transition-transform ${isArabic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col animate-fade-in-up">
            {/* Breadcrumb / Pillar Header - Updated matching screenshot */}
            <div className="mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
               <button onClick={handleReset} className="hover:text-white transition-colors">{isArabic ? 'الكونسيرج' : 'The Concierge'}</button>
               <span className="opacity-40">/</span>
               <span className="text-[#d4af37]">{isArabic ? currentPillar?.nameAr : currentPillar?.nameEn}</span>
            </div>

            <div className="mb-10 flex items-start justify-between relative group">
               {currentPillar?.themeTexture && (
                 <div className="absolute inset-0 -inset-x-12 -inset-y-12 opacity-5 pointer-events-none mix-blend-overlay" style={{ backgroundImage: currentPillar.themeTexture }} />
               )}
               
               <div className="flex-1 relative z-10">
                  <h3 className="text-7xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-4">
                    {isArabic ? currentPillar?.nameAr : currentPillar?.nameEn}
                  </h3>
                  <p className="text-2xl font-serif-elegant italic leading-tight text-white/90">
                    {isArabic ? currentPillar?.taglineAr : currentPillar?.taglineEn}
                  </p>
               </div>
               
               {/* Back Button matching screenshot (Circle with <) */}
               <button onClick={handleReset} className="relative z-10 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all shadow-xl">
                 <svg className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
               </button>
            </div>

            {/* Instruction & Search */}
            <div className="mb-10 shrink-0 space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 border-l border-[#d4af37] pl-4">
                {isArabic ? 'تصفح الفئات أو استكشف المختارات أدناه.' : 'Browse categories or discover featured picks below.'}
              </p>
              
              <div 
                onClick={onOpenKeyboard}
                className="w-full h-20 bg-white/5 border border-white/10 rounded-[2.5rem] px-8 flex items-center gap-6 cursor-pointer hover:bg-white/10 transition-all group shadow-inner"
              >
                <svg className="w-6 h-6 text-white/40 group-hover:text-[#d4af37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <span className={`text-lg font-medium tracking-tight ${query ? 'text-white' : 'text-white/20 italic'}`}>
                  {query || (isArabic ? (currentPillar ? `بحث في ${currentPillar.nameAr}...` : 'بحث...') : (currentPillar ? `Search within ${currentPillar.nameEn}...` : 'Search...'))}
                </span>
              </div>
            </div>

            {/* Category Portals Grid */}
            {!selectedCategoryId && !query && (
              <div className="mb-10 shrink-0">
                <div className="grid grid-cols-2 gap-4">
                  {currentPillarCategories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => handleCategoryToggle(cat.id)}
                      className="group p-6 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-4 transition-all hover:bg-[#d4af37]/5 hover:border-[#d4af37]/40 hover:scale-[1.02] shadow-xl text-left"
                    >
                      <div className="text-[#d4af37] group-hover:scale-110 transition-transform shrink-0">
                        <CategoryIcon iconKey={cat.iconKey} className="w-8 h-8" />
                      </div>
                      <p className="text-[10px] font-black text-white uppercase tracking-[0.1em] group-hover:text-[#d4af37] transition-colors leading-tight">
                        {isArabic ? cat.nameAr : cat.nameEn}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Picks Scroller */}
            {!selectedCategoryId && !query && featuredUnits.length > 0 && (
              <div className="mb-8 shrink-0 animate-fade-in-up">
                <div className="flex justify-between items-end mb-4 px-2">
                   <h4 className="text-[10px] font-black uppercase text-white tracking-[0.4em]">{isArabic ? 'مختاراتنا' : 'FEATURED DISCOVERY'}</h4>
                   <div className="w-12 h-0.5 bg-[#d4af37]/20 rounded-full" />
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                  {featuredUnits.map(unit => (
                    <button 
                      key={unit.id}
                      onClick={() => onSelectStore(unit)}
                      className="relative w-48 h-64 flex-shrink-0 bg-[#121212] rounded-[2.5rem] overflow-hidden group shadow-2xl border border-white/5"
                    >
                      <img src={unit.bannerUrl || unit.image} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      <div className="absolute inset-x-6 bottom-6">
                        <p className="text-sm font-black text-white uppercase tracking-tight truncate">{isArabic ? unit.nameAr : unit.nameEn}</p>
                        <p className="text-[8px] text-[#d4af37] font-serif-elegant italic mt-1 line-clamp-1">{isArabic ? unit.taglineAr : unit.taglineEn}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selection/Query Results Branding */}
            {(selectedCategoryId || query) && (
              <div className="flex-1 flex flex-col overflow-hidden animate-fade-in-up">
                {/* Active Filters Pill Bar */}
                <div className="mb-6 flex gap-3 overflow-x-auto no-scrollbar pb-2 shrink-0">
                  <button 
                    onClick={() => setSelectedCategoryId(null)}
                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border shrink-0 ${!selectedCategoryId ? 'bg-[#d4af37] border-[#d4af37] text-white shadow-xl shadow-[#d4af37]/20' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                  >
                    {isArabic ? 'الكل' : 'EXPLORE ALL'}
                  </button>
                  {currentPillarCategories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border flex items-center gap-3 shrink-0 ${selectedCategoryId === cat.id ? 'bg-[#d4af37] border-[#d4af37] text-white shadow-xl shadow-[#d4af37]/20' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                    >
                      <CategoryIcon iconKey={cat.iconKey} className="w-5 h-5" />
                      <span>{isArabic ? cat.nameAr : cat.nameEn}</span>
                    </button>
                  ))}
                </div>

                {/* Vertical Results List */}
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
                  {filteredUnits.length > 0 ? (
                    filteredUnits.map(unit => (
                      <button 
                        key={unit.id}
                        onClick={() => onSelectStore(unit)}
                        className="w-full p-8 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center gap-8 hover:bg-white/10 hover:border-white/10 transition-all text-left group relative overflow-hidden"
                      >
                        <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center text-3xl shrink-0 shadow-inner p-3">
                          {unit.logoUrl ? (
                            <img src={unit.logoUrl} className="w-full h-full object-contain" alt="" />
                          ) : (
                            <CategoryIcon iconKey={categories.find(c => c.id === unit.category)?.iconKey} className="w-full h-full text-slate-900" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-2xl font-black text-white truncate uppercase tracking-tight mb-1">
                            {isArabic ? unit.nameAr : unit.nameEn}
                          </p>
                          <p className="text-xs text-[#d4af37] font-serif-elegant italic opacity-70 mb-2 truncate">
                            {isArabic ? unit.taglineAr : unit.taglineEn || (isArabic ? 'اكتشف التمیز' : 'Experience the exceptional.')}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                              {unit.floor} • {unit.mallAddress}
                            </span>
                            <div className="w-1 h-1 bg-white/10 rounded-full" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{isArabic ? 'مفتوح' : 'OPEN'}</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-[#d4af37] group-hover:border-[#d4af37]/40 transition-all">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 opacity-20 text-center">
                       <div className="text-7xl mb-8">🔍</div>
                       <p className="text-2xl font-black uppercase tracking-widest">
                         {isArabic ? 'لا توجد نتائج' : 'No results found'}
                       </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sticky Sidebar Footer */}
            <div className="pt-8 border-t border-white/10 flex items-center justify-between mt-auto shrink-0">
              <button onClick={onOpenAI} className="flex items-center gap-5 group">
                <div className="w-14 h-14 bg-[#d4af37] rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">🤵</div>
                <div className="text-left">
                  <p className="text-[11px] font-black text-white uppercase tracking-widest">{isArabic ? 'المساعد الرقمي' : 'AI CONCIERGE'}</p>
                  <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{isArabic ? 'اسأل أي شيء' : 'ASK ANYTHING'}</p>
                </div>
              </button>
              
              <button onClick={handleReset} className="text-[11px] font-black text-[#d4af37] uppercase tracking-[0.2em] hover:text-white transition-colors">
                {isArabic ? 'الرئيسية' : 'HOME'}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;