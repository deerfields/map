
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FloorID, NavNode, Unit, Floor, Point, VisualizationMode, NavigationStatus, KioskDevice } from '../types';
import { INITIAL_FLOORS } from '../constants';
import { MallLocation } from '../services/gpsService';

interface MapViewerProps {
  floor: Floor;
  units: Unit[];
  nodes: NavNode[];
  activePath: NavNode[];
  selectedUnit: Unit | null;
  userLocation: MallLocation | null;
  onUnitClick: (u: Unit) => void;
  isEmergency?: boolean;
  isEditMode?: boolean;
  onUpdateUnit?: (u: Unit) => void;
  isArabic: boolean;
  isDrawingMode?: boolean;
  onCompleteDrawing?: (poly: Point[]) => void;
  mode?: VisualizationMode;
  onAddUnitAtPoint?: (x: number, y: number, draft?: Partial<Unit>) => void;
  navStatus?: NavigationStatus;
  onNavComplete?: () => void;
  onNavExit?: () => void;
  kioskConfig?: KioskDevice;
}

const FLOOR_SPACING = 1200; 

const MapViewer: React.FC<MapViewerProps> = ({ 
  floor, units, nodes, activePath, selectedUnit, userLocation, onUnitClick, isEmergency, isEditMode, onUpdateUnit, isArabic, isDrawingMode, onCompleteDrawing,
  mode = VisualizationMode.VIEW_2D, onAddUnitAtPoint, navStatus = 'idle', onNavComplete, onNavExit, kioskConfig
}) => {
  const mapWidth = 3200; 
  const mapHeight = 1536;
  
  const [view, setView] = useState({ scale: 0.3, translateX: 0, translateY: 0 });
  const [navProgress, setNavProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isCinematic = mode === VisualizationMode.VIEW_CINEMATIC || navStatus === 'following';

  const mallSlabPoints = [
    [50, 250], [800, 250], [800, 450], [2400, 450], [2400, 250], [3150, 250], 
    [3150, 1250], [2400, 1250], [2400, 1050], [1850, 1050], [1800, 1200], 
    [1400, 1200], [1350, 1050], [800, 1050], [800, 1250], [50, 1250]
  ].map(p => p.join(',')).join(' ');

  const fitToScreen = useCallback(() => {
    if (!containerRef.current || isCinematic) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const initialScale = Math.min(clientWidth / mapWidth, clientHeight / mapHeight) * 0.85;
    setView({ scale: initialScale, translateX: (clientWidth - mapWidth * initialScale) / 2, translateY: (clientHeight - mapHeight * initialScale) / 2 });
  }, [mapWidth, mapHeight, isCinematic]);

  useEffect(() => {
    fitToScreen();
    const observer = new ResizeObserver(() => fitToScreen());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [fitToScreen]);

  useEffect(() => {
    if (navStatus === 'following' && activePath.length > 0) {
      let progress = 0;
      const step = 0.005; 
      let cancelled = false;
      
      const animate = () => {
        if (cancelled) return;
        progress += step;
        if (progress >= 1) {
          setNavProgress(1);
          if (onNavComplete) onNavComplete();
          return;
        }
        
        setNavProgress(progress);
        
        const pathIndex = Math.floor(progress * (activePath.length - 1));
        const currentNode = activePath[pathIndex];
        const nextNode = activePath[pathIndex + 1] || currentNode;
        
        const partial = (progress * (activePath.length - 1)) % 1;
        const curX = currentNode.x + (nextNode.x - currentNode.x) * partial;
        const curY = currentNode.y + (nextNode.y - currentNode.y) * partial;
        
        const floorObj = INITIAL_FLOORS.find(f => f.id === currentNode.floor);
        const nextFloorObj = INITIAL_FLOORS.find(f => f.id === nextNode.floor);
        const floorZ = ((floorObj?.order || 0) * FLOOR_SPACING) + (((nextFloorObj?.order || 0) - (floorObj?.order || 0)) * FLOOR_SPACING * partial);

        if (containerRef.current) {
          const { clientWidth, clientHeight } = containerRef.current;
          setView({
            scale: 0.85, 
            translateX: (clientWidth / 2) - (curX * 0.85),
            translateY: (clientHeight / 2) - ((curY + floorZ) * 0.45)
          });
        }
        
        requestAnimationFrame(animate);
      };
      
      const handle = requestAnimationFrame(animate);
      return () => {
        cancelled = true;
        cancelAnimationFrame(handle);
      };
    } else {
        setNavProgress(0);
    }
  }, [navStatus, activePath, onNavComplete]);

  const viewportTransform = useMemo(() => {
    const base = `translate(${view.translateX}px, ${view.translateY}px) scale(${view.scale})`;
    if (isCinematic || mode === VisualizationMode.VIEW_3D || mode === VisualizationMode.VIEW_4D) {
      return `${base} perspective(3000px) rotateX(48deg) rotateZ(-12deg)`;
    }
    return base;
  }, [view, mode, isCinematic]);

  const renderFloorSlab = (f: Floor) => {
    const isActive = isCinematic ? true : f.id === floor.id;
    const floorUnits = units.filter(u => u.floor === f.id);
    const isStackedMode = mode === VisualizationMode.VIEW_4D || isCinematic;
    const zOffset = isCinematic ? (f.order * -FLOOR_SPACING) : 0;

    return (
      <g 
        key={f.id} 
        opacity={isActive ? 1 : 0.04} 
        transform={`translate(0, ${zOffset})`}
        style={{ transition: 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s' }}
      >
        <polygon 
          points={mallSlabPoints} 
          fill={isStackedMode ? "#111111" : "#ffffff"} 
          stroke={isStackedMode ? "rgba(212, 175, 55, 0.2)" : "rgba(203, 213, 225, 0.5)"} 
          strokeWidth="3" 
          pointerEvents="none" 
        />

        {(mode !== VisualizationMode.VIEW_2D || isActive) && (
          <text 
            x="100" y="350" 
            fill={isStackedMode ? "#d4af37" : "#cbd5e1"} 
            fontSize="48" 
            fontWeight="900" 
            className="uppercase tracking-[0.2em] opacity-30 select-none pointer-events-none"
          >
            {isArabic ? f.nameAr : f.nameEn}
          </text>
        )}

        {floorUnits.map(unit => {
          const isSelected = selectedUnit?.id === unit.id;
          const polyStr = unit.polygon.map(p => p.join(',')).join(' ');
          
          return (
            <g key={unit.id} className="cursor-pointer group" onClick={(e) => { e.stopPropagation(); onUnitClick(unit); }}>
              <polygon 
                points={polyStr} 
                fill={isSelected ? "rgba(212, 175, 55, 0.15)" : (isStackedMode ? "#1c1c1c" : "#ffffff")} 
                stroke={isSelected ? "#d4af37" : (isStackedMode ? "#2a2a2a" : "#cbd5e1")} 
                strokeWidth={isSelected ? 5 : 1.5} 
                className="transition-all duration-300 hover:fill-[#d4af3708]"
              />
              
              {!isSelected && !isEditMode && (
                <text 
                  x={unit.polygon[0][0] + (unit.polygon[1][0] - unit.polygon[0][0]) / 2} 
                  y={unit.polygon[0][1] + (unit.polygon[2][1] - unit.polygon[1][1]) / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isStackedMode ? "#444" : "#94a3b8"}
                  fontSize="22"
                  fontWeight="bold"
                  className="pointer-events-none select-none opacity-40 uppercase tracking-tighter"
                >
                  {isArabic ? unit.nameAr : unit.nameEn}
                </text>
              )}
            </g>
          );
        })}

        {kioskConfig && kioskConfig.homeFloor === f.id && (
          <g transform={`translate(${kioskConfig.homeX}, ${kioskConfig.homeY})`}>
            <circle r="40" fill="#3b82f6" opacity="0.15" className="animate-ping" />
            <circle r="16" fill="white" stroke="#3b82f6" strokeWidth="6" />
            <circle r="6" fill="#3b82f6" />
          </g>
        )}
      </g>
    );
  };

  const currentPathNode = activePath[Math.floor(navProgress * (activePath.length - 1))];

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full relative overflow-hidden transition-colors duration-1000 bg-[#f8fafc] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} 
      onMouseDown={(e) => {
        if (isCinematic) return; 
        const isTouchEvent = 'touches' in e;
        const clientX = isTouchEvent ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = isTouchEvent ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
        setIsDragging(true);
        dragStart.current = { x: clientX, y: clientY, tx: view.translateX, ty: view.translateY };
      }}
      onWheel={(e) => {
        if (isCinematic) return;
        const delta = -e.deltaY;
        const zoomFactor = Math.pow(1.1, delta / 100);
        const newScale = Math.max(0.05, Math.min(5, view.scale * zoomFactor));
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const dx = (mouseX - view.translateX) / view.scale;
        const dy = (mouseY - view.translateY) / view.scale;
        setView({ scale: newScale, translateX: mouseX - dx * newScale, translateY: mouseY - dy * newScale });
      }}
    >
      {isCinematic && (
        <div className="absolute inset-0 pointer-events-none z-[100] flex flex-col justify-between p-16">
          <div className="animate-in slide-in-from-top-12 duration-1000 flex justify-between items-start">
            <div className="bg-black/85 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Cinematic Navigation</span>
              </div>
              <p className="text-3xl font-light text-white mt-4 tracking-tighter uppercase">
                {currentPathNode ? (isArabic ? INITIAL_FLOORS.find(f => f.id === currentPathNode.floor)?.nameAr : INITIAL_FLOORS.find(f => f.id === currentPathNode.floor)?.nameEn) : ''}
              </p>
            </div>
            
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if(onNavExit) onNavExit(); 
              }} 
              className="pointer-events-auto w-24 h-24 bg-white/10 hover:bg-white/20 backdrop-blur-3xl rounded-full flex flex-col items-center justify-center text-white transition-all border border-white/10 group shadow-2xl"
            >
              <svg className="w-10 h-10 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/></svg>
              <span className="text-[8px] font-black uppercase mt-1 tracking-tighter opacity-60">Exit</span>
            </button>
          </div>

          <div className="animate-in slide-in-from-bottom-12 duration-1000 w-full max-w-xl self-center bg-black/85 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
            <div className="flex justify-between items-end mb-6">
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37]">Journey Progress</p>
               <p className="text-[10px] font-black text-white/40 uppercase">{Math.round(navProgress * 100)}%</p>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-[#d4af37] shadow-[0_0_25px_#d4af37] transition-all duration-300" style={{ width: `${navProgress * 100}%` }} />
            </div>
            <p className="text-sm text-white/50 mt-8 font-medium tracking-wide">
               {isArabic ? 'اتبع المسار الذهبي للوصول إلى وجهتك.' : 'Follow the golden spline to your destination.'}
            </p>
          </div>
        </div>
      )}

      {!isCinematic && (
        <div className="absolute right-12 bottom-32 z-50 flex flex-col gap-4">
          <button onClick={() => setView(v => ({ ...v, scale: Math.min(5, v.scale * 1.3) }))} className="w-16 h-16 bg-white shadow-2xl rounded-2xl flex items-center justify-center text-slate-900 active:scale-90 transition-all border border-slate-200">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" strokeLinecap="round"/></svg>
          </button>
          <button onClick={() => setView(v => ({ ...v, scale: Math.max(0.05, v.scale / 1.3) }))} className="w-16 h-16 bg-white shadow-2xl rounded-2xl flex items-center justify-center text-slate-900 active:scale-90 transition-all border border-slate-200">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 12H4" strokeWidth="3" strokeLinecap="round"/></svg>
          </button>
        </div>
      )}

      <div style={{ transform: viewportTransform }} className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out origin-center">
        <svg ref={svgRef} viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="overflow-visible w-full h-full">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {INITIAL_FLOORS.map(f => renderFloorSlab(f))}
          
          {activePath.length > 1 && (
            <g filter="url(#glow)">
              {activePath.map((node, i) => {
                if (i === 0) return null;
                const prev = activePath[i-1];
                const f = INITIAL_FLOORS.find(fl => fl.id === node.floor);
                const pf = INITIAL_FLOORS.find(fl => fl.id === prev.floor);
                const z = isCinematic ? (f?.order || 0) * -FLOOR_SPACING : 0;
                const pz = isCinematic ? (pf?.order || 0) * -FLOOR_SPACING : 0;
                return (
                  <line 
                    key={`path-${i}`}
                    x1={prev.x} y1={prev.y + pz}
                    x2={node.x} y2={node.y + z}
                    stroke="#d4af37"
                    strokeWidth={isCinematic ? "28" : "14"}
                    strokeLinecap="round"
                    opacity={0.4}
                  />
                );
              })}
              <polyline 
                points={activePath.map(n => {
                  const f = INITIAL_FLOORS.find(fl => fl.id === n.floor);
                  const z = isCinematic ? (f?.order || 0) * -FLOOR_SPACING : 0;
                  return `${n.x},${n.y + z}`;
                }).join(' ')} 
                fill="none" 
                stroke="white" 
                strokeWidth={isCinematic ? "8" : "4"} 
                strokeLinecap="round" 
                strokeLinejoin="round"
                strokeDasharray="1,20"
                className="animate-path-flow"
              />
              <polyline 
                points={activePath.map(n => {
                  const f = INITIAL_FLOORS.find(fl => fl.id === n.floor);
                  const z = isCinematic ? (f?.order || 0) * -FLOOR_SPACING : 0;
                  return `${n.x},${n.y + z}`;
                }).join(' ')} 
                fill="none" 
                stroke="#d4af37" 
                strokeWidth={isCinematic ? "12" : "6"} 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </g>
          )}

          {activePath.length > 0 && (
            <g transform={`translate(${activePath[activePath.length-1].x}, ${activePath[activePath.length-1].y + (isCinematic ? (INITIAL_FLOORS.find(f => f.id === activePath[activePath.length-1].floor)?.order || 0) * -FLOOR_SPACING : 0)})`}>
               <circle r="45" fill="#d4af37" opacity="0.3" className="animate-ping" />
               <circle r="15" fill="white" stroke="#d4af37" strokeWidth="5" />
            </g>
          )}
        </svg>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes path-flow {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        .animate-path-flow {
          animation: path-flow 2s linear infinite;
        }
      `}} />
    </div>
  );
};

export default MapViewer;
