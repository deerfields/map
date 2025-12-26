
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
      absolute top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-8
      ${isArabic ? 'left-12' : 'right-12'}
    `}>
      <div className="flex flex-col items-center gap-3">
        <p className={`text-[8px] font-black uppercase tracking-[0.5em] text-[#888888] ${isArabic ? 'rotate-180' : ''}`}>Spatial Tier</p>
        <div className="w-[1px] h-12 bg-slate-200" />
      </div>

      <div className="bg-white/90 backdrop-blur-3xl p-4 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] flex flex-col gap-4 border border-white">
        {INITIAL_FLOORS.slice().reverse().map(floor => {
          const isActive = currentFloor === floor.id;
          const isPathFloor = pathFloors.includes(floor.id);
          
          return (
            <button
              key={floor.id}
              onClick={() => onFloorChange(floor.id)}
              className={`
                w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-700 relative group
                ${isActive 
                  ? 'bg-[#0a0a0a] text-white shadow-[0_20px_40px_rgba(0,0,0,0.3)] scale-110 z-10' 
                  : 'bg-transparent text-slate-400 hover:bg-slate-50'}
              `}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-full border-2 border-[#d4af37] animate-[pulse_3s_infinite]" />
              )}
              
              <span className={`text-[11px] font-black tracking-tighter ${isActive ? 'text-[#d4af37]' : ''}`}>
                {floor.id}
              </span>

              {!isActive && (
                 <span className="text-[7px] font-bold opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2 text-slate-300">
                   {floor.id}
                 </span>
              )}

              {isPathFloor && !isActive && (
                <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#d4af37] rounded-full border-[3px] border-white shadow-xl" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FloorSelector;
