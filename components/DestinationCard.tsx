
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
      absolute top-12 bottom-12 z-50 w-full max-w-[480px] bg-white rounded-[3.5rem] shadow-[0_60px_120px_rgba(0,0,0,0.3)] 
      flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-20 duration-700
      ${isArabic ? 'left-12' : 'right-12'}
    `}>
      {/* Visual Ambiance Header */}
      <div className="relative h-64 shrink-0 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white z-10" />
        {unit.bannerUrl ? (
          <img src={unit.bannerUrl} className="w-full h-full object-cover opacity-90 scale-105 group-hover:scale-100 transition-transform duration-1000" alt="" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-5">
            <span className="text-9xl">🛍️</span>
          </div>
        )}
        
        {/* Floating Brand Mark */}
        <div className="absolute bottom-[-15px] left-10 w-28 h-28 bg-white rounded-[2rem] shadow-2xl z-20 flex items-center justify-center p-6 border border-slate-100">
           {unit.logoUrl ? (
             <img src={unit.logoUrl} className="w-full h-full object-contain" alt="" />
           ) : (
             <span className="text-4xl">🛍️</span>
           )}
        </div>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-30 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Brand Identity Panel */}
      <div className="px-10 pt-20 pb-8 space-y-8">
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-black text-[#d4af37] uppercase tracking-[0.4em] bg-[#d4af37]/10 px-4 py-1.5 rounded-full border border-[#d4af37]/20 flex items-center">
            {category?.iconKey && <span className="mr-2 text-xs">{category.iconKey}</span>}
            {isArabic ? category?.nameAr : category?.nameEn}
          </span>
          <div className="w-1 h-1 bg-slate-200 rounded-full" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{unit.floor} • {unit.mallAddress}</span>
        </div>

        <div className="space-y-3">
          <h2 className="text-5xl font-black text-[#111111] tracking-tighter uppercase leading-[0.9] break-words">
            {isArabic ? unit.nameAr : unit.nameEn}
          </h2>
          <p className="text-2xl font-light italic text-slate-400 leading-tight font-serif-elegant border-l-3 border-[#d4af37] pl-6 py-1">
            {isArabic ? (unit.taglineAr || "اكتشف الأناقة") : (unit.taglineEn || "Experience the exceptional.")}
          </p>
        </div>
      </div>

      {/* Details Scroll Area */}
      <div className="flex-1 overflow-y-auto px-10 pb-8 space-y-10 no-scrollbar">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-start gap-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md text-[#d4af37] shrink-0">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Store Status</p>
              <div className="flex items-baseline gap-3">
                <span className={`text-lg font-black ${unit.status === 'open' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {unit.status === 'open' ? (isArabic ? 'مفتوح' : 'OPEN') : (isArabic ? 'مغلق' : 'CLOSED')}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">({unit.openingTime} — {unit.closingTime})</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">About the Brand</p>
             <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                {isArabic ? unit.descriptionAr : unit.descriptionEn}
             </p>
          </div>
        </div>

        {/* Primary CTA */}
        <button 
          onClick={onNavigate}
          className="w-full h-28 bg-[#d4af37] hover:bg-[#b08d57] text-white rounded-[2.5rem] flex items-center justify-center gap-6 shadow-[0_20px_50px_rgba(212,175,55,0.3)] active:scale-95 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2.5"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2.5"/></svg>
          </div>
          <span className="text-xl font-black uppercase tracking-[0.2em]">{isArabic ? 'ابدأ الملاحة' : 'NAVIGATE NOW'}</span>
        </button>
      </div>

      <div className="h-4 bg-gradient-to-t from-slate-50 to-transparent shrink-0" />
    </div>
  );
};

export default DestinationCard;
