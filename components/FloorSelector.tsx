import React from 'react';
import { FloorID } from '../types';
import { INITIAL_FLOORS } from '../constants';

interface FloorSelectorProps {
  currentFloor: FloorID;
  onFloorChange: (f: FloorID) => void;
  isArabic: boolean;
  pathFloors: FloorID[];
}

const FloorSelector: React.FC<FloorSelectorProps> = ({ 
  currentFloor, onFloorChange, isArabic, pathFloors 
}) => {
  return (
    <div className={`
      absolute z-40 flex flex-col items-center gap-4
      bottom-1/2 translate-y-1/2
      ${isArabic ? 'left-8' : 'right-8'}
    `}>
      <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 rotate-180 mb-2" style={{ writingMode: 'vertical-lr' }}>
        {isArabic ? 'المستويات' : 'SPATIAL TIER'}
      </p>
      
      <div className="bg-[#111111] backdrop-blur-xl p-2 rounded-full shadow-2xl flex flex-col gap-3 border border-white/5 transition-all duration-700">
        {INITIAL_FLOORS.slice().reverse().map(floor => {
          const isActive = currentFloor === floor.id;
          const isPathFloor = pathFloors.includes(floor.id);
          
          return (
            <button
              key={floor.id}
              onClick={() => onFloorChange(floor.id)}
              className={`
                w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-500 relative group
                ${isActive 
                  ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 scale-110 z-10 font-black' 
                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}
              `}
            >
              <span className={`text-[10px] lg:text-[11px] font-black tracking-tighter ${isActive ? 'text-slate-900' : ''}`}>
                {floor.id}
              </span>

              {/* Floor Label Tooltip */}
              <span className={`
                absolute ${isArabic ? 'right-20' : 'left-20'} whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300
                bg-black/90 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#d4af37] pointer-events-none
                ${isArabic ? 'translate-x-4 group-hover:translate-x-0' : '-translate-x-4 group-hover:translate-x-0'}
              `}>
                {isArabic ? floor.nameAr : floor.nameEn}
              </span>

              {/* Path Awareness Indicator */}
              {isPathFloor && !isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#d4af37] rounded-full border-2 border-black animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FloorSelector;