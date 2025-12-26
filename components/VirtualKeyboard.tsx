import React, { useMemo } from 'react';
import { Unit } from '../types';

interface VirtualKeyboardProps {
  value: string;
  isArabic: boolean;
  units: Unit[];
  onChange: (val: string) => void;
  onEnter: () => void;
  onClose: () => void;
  onSelectUnit: (unit: Unit) => void;
}

const EN_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const AR_LAYOUT = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
  ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
  ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ'],
];

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ 
  value, isArabic, units, onChange, onEnter, onClose, onSelectUnit 
}) => {
  const layout = isArabic ? AR_LAYOUT : EN_LAYOUT;

  const suggestions = useMemo(() => {
    const search = value.toLowerCase().trim();
    if (!search) return [];

    // Filter commercial units that are active
    const candidates = units.filter(u => 
      ['store', 'restaurant', 'coffee', 'kiosk', 'pop_up'].includes(u.type) && u.status !== 'closed'
    );

    // 1. Exact match (case insensitive)
    const exactMatch = candidates.filter(u => 
      u.nameEn.toLowerCase() === search || 
      u.nameAr.toLowerCase() === search
    );

    // 2. Starts with (Prefix prioritization)
    const startsWith = candidates.filter(u => 
      !exactMatch.includes(u) && (
        u.nameEn.toLowerCase().startsWith(search) || 
        u.nameAr.toLowerCase().startsWith(search)
      )
    );

    // 3. Contains elsewhere
    const contains = candidates.filter(u => 
      !exactMatch.includes(u) && 
      !startsWith.includes(u) && (
        u.nameEn.toLowerCase().includes(search) || 
        u.nameAr.toLowerCase().includes(search)
      )
    );

    // 4. Metadata match (tags/categories)
    const metaMatches = candidates.filter(u => 
      !exactMatch.includes(u) && 
      !startsWith.includes(u) && 
      !contains.includes(u) && (
        u.tags.some(t => t.toLowerCase().includes(search)) ||
        u.category.toLowerCase().includes(search)
      )
    );

    return [...exactMatch, ...startsWith, ...contains, ...metaMatches].slice(0, 5);
  }, [value, units]);

  return (
    <div className="fixed inset-0 z-[450] flex flex-col justify-end pointer-events-none">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl pointer-events-auto" onClick={onClose} />
      
      <div className="relative w-full bg-[#0a0f1d] p-6 lg:p-10 rounded-t-[4rem] border-t border-white/10 pointer-events-auto animate-keyboard shadow-[0_-25px_60px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh]">
        <div className="max-w-6xl mx-auto w-full flex flex-col h-full space-y-6 lg:space-y-8">
          
          {/* Input Area */}
          <div className="bg-white/5 rounded-[3rem] p-6 lg:p-10 border border-white/10 flex items-center justify-between shadow-inner relative overflow-hidden flex-shrink-0">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 opacity-80" />
            <div className="text-3xl lg:text-6xl font-black text-white min-h-[40px] lg:min-h-[70px] flex items-center tracking-tighter uppercase truncate pr-10">
              {value || <span className="text-white/10">{isArabic ? "ابدأ الكتابة للبحث..." : "Start typing to search..."}</span>}
              {value && <span className="w-1.5 h-8 lg:h-14 bg-amber-500 ml-4 animate-pulse rounded-full" />}
            </div>
            {value && (
              <button 
                onClick={() => onChange('')} 
                className="w-12 h-12 lg:w-16 lg:h-16 bg-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all hover:bg-white/20"
              >
                 <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {/* Vertical Dropdown Suggestions */}
          <div className={`transition-all duration-300 ${value ? 'opacity-100 flex-1' : 'opacity-0 h-0 overflow-hidden'} overflow-y-auto no-scrollbar`}>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-4 mb-2">
                <p className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  {isArabic ? 'النتائج الذكية' : 'Smart Suggestions'}
                </p>
                <span className="text-[8px] lg:text-[9px] font-bold text-amber-500/40 uppercase">Top {suggestions.length} Matches</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pb-4">
                {suggestions.map((unit, idx) => (
                  <button 
                    key={unit.id} 
                    onClick={() => onSelectUnit(unit)} 
                    className={`flex items-center gap-5 p-4 lg:p-6 bg-white/5 border border-white/5 hover:border-amber-500/50 hover:bg-white/10 text-white rounded-[2rem] font-black uppercase tracking-tight shadow-xl transition-all active:scale-98 text-left group animate-in slide-in-from-bottom-${idx + 1}`}
                  >
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform flex-shrink-0 p-2 shadow-inner">
                      {unit.logoUrl ? (
                        <img src={unit.logoUrl} className="w-full h-full object-contain" alt="" />
                      ) : (
                        <span className="text-slate-900">{unit.type === 'coffee' ? '☕' : (unit.type === 'restaurant' ? '🍴' : '🛍️')}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base lg:text-2xl leading-none truncate">{isArabic ? unit.nameAr : unit.nameEn}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[8px] lg:text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md uppercase">{unit.mallAddress}</span>
                        <span className="text-[8px] lg:text-[10px] text-white/40 font-bold uppercase tracking-widest">{unit.floor}</span>
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-white/20 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Keyboard Keys */}
          <div className="space-y-3 lg:space-y-4 pb-8 flex-shrink-0">
            {layout.map((row, i) => (
              <div key={i} className="flex justify-center gap-2 lg:gap-3">
                {row.map(key => (
                  <button 
                    key={key} 
                    onClick={() => onChange(value + key)} 
                    className="flex-1 max-w-[100px] h-14 lg:h-20 bg-white/5 hover:bg-white/15 rounded-2xl lg:rounded-3xl text-white text-xl lg:text-3xl font-black flex items-center justify-center border border-white/5 shadow-xl active:bg-amber-600 active:scale-90 transition-all"
                  >
                    {key}
                  </button>
                ))}
              </div>
            ))}
            
            <div className="flex justify-center gap-2 lg:gap-3 pt-2 lg:pt-4">
              <button 
                onClick={() => onChange(value.slice(0, -1))} 
                className="w-24 lg:w-48 h-14 lg:h-20 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl lg:rounded-3xl font-black uppercase text-[10px] lg:text-xs border border-red-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>
                {isArabic ? 'حذف' : 'Del'}
              </button>
              
              <button 
                onClick={() => onChange(value + ' ')} 
                className="flex-1 h-14 lg:h-20 bg-white/5 hover:bg-white/10 rounded-2xl lg:rounded-3xl text-white font-black text-[9px] lg:text-[11px] uppercase tracking-[1em] border border-white/5 active:scale-95"
              >
                {isArabic ? 'مسافة' : 'Space'}
              </button>
              
              <button 
                onClick={onEnter} 
                disabled={!value.trim()}
                className="w-24 lg:w-48 h-14 lg:h-20 bg-amber-600 hover:bg-amber-500 disabled:opacity-20 text-white rounded-2xl lg:rounded-3xl font-black uppercase text-[10px] lg:text-xs shadow-2xl active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                {isArabic ? 'بحث' : 'Go'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;