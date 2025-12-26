import React from 'react';
import { Unit, MallCategory } from '../types';

interface DestinationCardProps {
  unit: Unit;
  isArabic: boolean;
  onClose: () => void;
  onNavigate: () => void;
  categories: MallCategory[];
}

const DestinationCard: React.FC<DestinationCardProps> = ({ 
  unit, isArabic, onClose, onNavigate, categories 
}) => {
  const category = categories.find(c => c.id === unit.category);

  return (
    <div className={`
      fixed lg:absolute z-50 
      inset-x-0 bottom-0 h-[85vh] lg:h-auto lg:top-12 lg:bottom-12 lg:inset-x-auto
      w-full lg:max-w-[480px] bg-white lg:rounded-[3.5rem] rounded-t-[3.5rem]
      shadow-[0_60px_120px_rgba(0,0,0,0.3)] 
      flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom lg:slide-in-from-right-20 duration-700
      ${isArabic ? 'lg:left-12' : 'lg:right-12'}
    `}>
      {/* Visual Ambiance Header */}
      <div className="relative h-48 lg:h-64 shrink-0 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white z-10" />
        {unit.bannerUrl ? (
          <img src={unit.bannerUrl} className="w-full h-full object-cover opacity-90 scale-105 transition-transform duration-1000" alt="" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-5">
            <span className="text-7xl lg:text-9xl">🛍️</span>
          </div>
        )}
        
        {/* Floating Brand Mark */}
        <div className="absolute bottom-[-10px] lg:bottom-[-15px] left-8 lg:left-10 w-24 h-24 lg:w-28 lg:h-28 bg-white rounded-[1.5rem] lg:rounded-[2rem] shadow-2xl z-20 flex items-center justify-center p-4 lg:p-6 border border-slate-100">
           {unit.logoUrl ? (
             <img src={unit.logoUrl} className="w-full h-full object-contain" alt="" />
           ) : (
             <span className="text-3xl lg:text-4xl">🛍️</span>
           )}
        </div>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 lg:top-8 right-6 lg:right-8 z-30 w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-xl rounded-xl lg:rounded-2xl flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/20"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Brand Identity Panel */}
      <div className="px-8 lg:px-10 pt-16 lg:pt-20 pb-6 lg:pb-8 space-y-6 lg:space-y-8">
        <div className="flex items-center gap-3 lg:gap-4 overflow-x-auto no-scrollbar">
          <span className="text-[8px] lg:text-[9px] font-black text-[#d4af37] uppercase tracking-[0.2em] lg:tracking-[0.4em] bg-[#d4af37]/10 px-3 lg:px-4 py-1.5 rounded-full border border-[#d4af37]/20 flex items-center whitespace-nowrap">
            {isArabic ? category?.nameAr : category?.nameEn}
          </span>
          <div className="w-1 h-1 bg-slate-200 rounded-full shrink-0" />
          <span className="text-[8px] lg:text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{unit.floor} • {unit.mallAddress}</span>
        </div>

        <div className="space-y-2 lg:space-y-3">
          <h2 className="text-3xl lg:text-5xl font-black text-[#111111] tracking-tighter uppercase leading-[0.9] break-words">
            {isArabic ? unit.nameAr : unit.nameEn}
          </h2>
          <p className="text-xl lg:text-2xl font-light italic text-slate-400 leading-tight font-serif-elegant border-l-2 lg:border-l-3 border-[#d4af37] pl-4 lg:pl-6 py-1">
            {isArabic ? (unit.taglineAr || "اكتشف الأناقة") : (unit.taglineEn || "Experience the exceptional.")}
          </p>
        </div>
      </div>

      {/* Details Scroll Area */}
      <div className="flex-1 overflow-y-auto px-8 lg:px-10 pb-8 space-y-8 lg:space-y-10 no-scrollbar">
        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          <div className="flex items-start gap-4 lg:gap-6 bg-slate-50 p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-lg lg:rounded-xl flex items-center justify-center shadow-md text-[#d4af37] shrink-0">
               <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <p className="text-[7px] lg:text-[8px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] text-slate-400 mb-0.5 lg:mb-1">Store Status</p>
              <div className="flex flex-wrap items-baseline gap-2 lg:gap-3">
                <span className={`text-base lg:text-lg font-black ${unit.status === 'open' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {unit.status === 'open' ? (isArabic ? 'مفتوح' : 'OPEN') : (isArabic ? 'مغلق' : 'CLOSED')}
                </span>
                <span className="text-[9px] lg:text-[10px] text-slate-400 font-bold">({unit.openingTime} — {unit.closingTime})</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 space-y-3 lg:space-y-4">
             <p className="text-[7px] lg:text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">About the Brand</p>
             <p className="text-xs lg:text-sm text-slate-600 font-medium leading-relaxed italic">
                {isArabic ? (unit.descriptionAr || "وصف العلامة التجارية قيد التحديث.") : (unit.descriptionEn || "Brand story currently being curated.")}
             </p>
          </div>
        </div>

        {/* Primary CTA - Extra large touch area */}
        <button 
          onClick={onNavigate}
          className="w-full h-24 lg:h-28 bg-[#d4af37] hover:bg-[#b08d57] text-white rounded-[2rem] lg:rounded-[2.5rem] flex items-center justify-center gap-4 lg:gap-6 shadow-[0_20px_50px_rgba(212,175,55,0.3)] active:scale-95 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2.5"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2.5"/></svg>
          </div>
          <span className="text-lg lg:text-xl font-black uppercase tracking-[0.2em]">{isArabic ? 'ابدأ الملاحة' : 'NAVIGATE NOW'}</span>
        </button>
      </div>

      <div className="h-4 bg-gradient-to-t from-slate-50 to-transparent shrink-0" />
    </div>
  );
};

export default DestinationCard;