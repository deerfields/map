
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FloorID, NavNode, Unit, Floor, Point, VisualizationMode, NavigationStatus, KioskDevice } from '../types';
import { INITIAL_FLOORS } from '../constants';

interface MapViewerProps {
  floor: Floor;
  units: Unit[];
  nodes: NavNode[];
  activePath: NavNode[];
  selectedUnit: Unit | null;
  userLocation: { x: number; y: number; floor: FloorID } | null;
  onUnitClick: (u: Unit) => void;
  isEmergency?: boolean;
  isEditMode?: boolean;
  onUpdateUnit?: (u: Unit) => void;
  isArabic: boolean;
  mode?: VisualizationMode;
  navStatus?: NavigationStatus;
  onNavComplete?: () => void;
  onNavExit?: () => void;
  kioskConfig?: KioskDevice;
}

const FLOOR_SPACING = 1400; 

const MapViewer: React.FC<MapViewerProps> = ({ 
  floor, units, nodes, activePath, selectedUnit, userLocation, onUnitClick, isEmergency, isEditMode, onUpdateUnit, isArabic,
  mode = VisualizationMode.VIEW_2D, navStatus = 'idle', onNavComplete, onNavExit, kioskConfig
}) => {
  const mapWidth = 3200; 
  const mapHeight = 1536;
  
  const [view, setView] = useState({ scale: 0.3, translateX: 0, translateY: 0 });
  const [navProgress, setNavProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Editing State
  const [editingPointIndex, setEditingPointIndex] = useState<number | null>(null);

  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const isCinematic = navStatus === 'following' || navStatus === 'calculating';
  const isStackedView = mode === VisualizationMode.VIEW_4D || isCinematic;

  const mallSlabPoints = [
    [50, 250], [800, 250], [800, 450], [2400, 450], [2400, 250], [3150, 250], 
    [3150, 1250], [2400, 1250], [2400, 1050], [1850, 1050], [1800, 1200], 
    [1400, 1200], [1350, 1050], [800, 1050], [800, 1250], [50, 1250]
  ].map(p => p.join(',')).join(' ');

  const fitToScreen = useCallback(() => {
    if (!containerRef.current || isCinematic) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const initialScale = Math.min(clientWidth / mapWidth, clientHeight / mapHeight) * 0.8;
    setView({ 
      scale: initialScale, 
      translateX: (clientWidth - mapWidth * initialScale) / 2, 
      translateY: (clientHeight - mapHeight * initialScale) / 2 
    });
  }, [mapWidth, mapHeight, isCinematic]);

  useEffect(() => {
    fitToScreen();
    const observer = new ResizeObserver(() => fitToScreen());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [fitToScreen]);

  const getSVGCoords = (clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = (clientX - rect.left - view.translateX) / view.scale;
    const y = (clientY - rect.top - view.translateY) / view.scale;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isCinematic) return;
    if (editingPointIndex !== null) return; // Prevent map drag while editing point

    setIsDragging(true);
    dragStart.current = { 
      x: e.clientX, 
      y: e.clientY, 
      tx: view.translateX, 
      ty: view.translateY 
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isCinematic) return;

    if (isEditMode && selectedUnit && editingPointIndex !== null && onUpdateUnit) {
      const coords = getSVGCoords(e.clientX, e.clientY);
      const newPolygon = [...selectedUnit.polygon];
      newPolygon[editingPointIndex] = [Math.round(coords.x), Math.round(coords.y)];
      onUpdateUnit({ ...selectedUnit, polygon: newPolygon });
      return;
    }

    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setView(prev => ({
      ...prev,
      translateX: dragStart.current.tx + dx,
      translateY: dragStart.current.ty + dy
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setEditingPointIndex(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isCinematic) return;
    const delta = -e.deltaY;
    const zoomFactor = Math.pow(1.1, delta / 100);
    
    setView(prev => {
      const newScale = Math.max(0.1, Math.min(3, prev.scale * zoomFactor));
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const dx = (mouseX - prev.translateX) / prev.scale;
        const dy = (mouseY - prev.translateY) / prev.scale;
        
        return {
          scale: newScale,
          translateX: mouseX - dx * newScale,
          translateY: mouseY - dy * newScale
        };
      }
      return { ...prev, scale: newScale };
    });
  };

  const handleAddVertex = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (!selectedUnit || !onUpdateUnit) return;
    
    const p1 = selectedUnit.polygon[index];
    const p2 = selectedUnit.polygon[(index + 1) % selectedUnit.polygon.length];
    const midPoint: Point = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    
    const newPolygon = [...selectedUnit.polygon];
    newPolygon.splice(index + 1, 0, midPoint);
    onUpdateUnit({ ...selectedUnit, polygon: newPolygon });
  };

  const handleDeleteVertex = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedUnit || !onUpdateUnit || selectedUnit.polygon.length <= 3) return;
    
    const newPolygon = [...selectedUnit.polygon];
    newPolygon.splice(index, 1);
    onUpdateUnit({ ...selectedUnit, polygon: newPolygon });
  };

  useEffect(() => {
    if (navStatus === 'following' && activePath.length > 0) {
      let progress = 0;
      const totalSteps = activePath.length - 1;
      const speed = 0.003; 
      let frameHandle: number;

      const animate = () => {
        progress += speed;
        if (progress >= 1) {
          setNavProgress(1);
          if (onNavComplete) onNavComplete();
          return;
        }

        setNavProgress(progress);
        
        const pathIndex = Math.floor(progress * totalSteps);
        const nextIndex = Math.min(pathIndex + 1, totalSteps);
        const currentNode = activePath[pathIndex];
        const nextNode = activePath[nextIndex];
        
        const lerp = (progress * totalSteps) % 1;
        
        const curX = currentNode.x + (nextNode.x - currentNode.x) * lerp;
        const curY = currentNode.y + (nextNode.y - currentNode.y) * lerp;
        
        const currentFloorObj = INITIAL_FLOORS.find(f => f.id === currentNode.floor)!;
        const nextFloorObj = INITIAL_FLOORS.find(f => f.id === nextNode.floor)!;
        const curZ = (currentFloorObj.order * -FLOOR_SPACING) + ((nextFloorObj.order - currentFloorObj.order) * -FLOOR_SPACING * lerp);

        if (containerRef.current) {
          const { clientWidth, clientHeight } = containerRef.current;
          setView({
            scale: 0.9, 
            translateX: (clientWidth / 2) - (curX * 0.9),
            translateY: (clientHeight / 2) - ((curY + curZ) * 0.45) 
          });
        }
        
        frameHandle = requestAnimationFrame(animate);
      };

      frameHandle = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frameHandle);
    }
  }, [navStatus, activePath, onNavComplete]);

  const viewportTransform = useMemo(() => {
    const base = `translate(${view.translateX}px, ${view.translateY}px) scale(${view.scale})`;
    if (isStackedView || mode === VisualizationMode.VIEW_3D) {
      return `${base} perspective(2500px) rotateX(45deg) rotateZ(-10deg)`;
    }
    return base;
  }, [view, isStackedView, mode]);

  const renderFloorSlab = (f: Floor) => {
    const isActive = isCinematic ? true : f.id === floor.id;
    const floorUnits = units.filter(u => u.floor === f.id);
    const zOffset = isStackedView ? (f.order * -FLOOR_SPACING) : 0;

    return (
      <g 
        key={f.id} 
        opacity={isActive ? 1 : 0.05} 
        transform={`translate(0, ${zOffset})`}
        style={{ transition: 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s' }}
      >
        <polygon 
          points={mallSlabPoints} 
          fill={isStackedView ? "#121212" : "#ffffff"} 
          stroke={isStackedView ? "rgba(212, 175, 55, 0.3)" : "rgba(203, 213, 225, 0.4)"} 
          strokeWidth="4" 
          pointerEvents="none" 
        />

        <g transform="translate(150, 450)">
           <text 
             fill="none"
             stroke={isStackedView ? "rgba(212, 175, 55, 0.15)" : "rgba(15, 23, 42, 0.08)"}
             strokeWidth="2"
             fontSize="360" 
             fontWeight="900" 
             className="uppercase select-none pointer-events-none font-black italic tracking-tighter"
           >
             {f.id}
           </text>
           <text 
             x="20" y="80"
             fill={isStackedView ? "#d4af37" : "#0f172a"} 
             fontSize="64" 
             fontWeight="900" 
             className="uppercase tracking-[0.4em] select-none pointer-events-none"
             style={{ filter: isStackedView ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))' : 'none' }}
           >
             {isArabic ? f.nameAr : f.nameEn}
           </text>
           <line x1="20" y1="120" x2="400" y2="120" stroke={isStackedView ? "#d4af37" : "#0f172a"} strokeWidth="8" strokeLinecap="round" opacity={isActive ? 0.8 : 0.2} />
        </g>

        {floorUnits.map(unit => {
          const isSelected = selectedUnit?.id === unit.id;
          const polyStr = unit.polygon.map(p => p.join(',')).join(' ');
          const isEscalator = unit.type === 'escalator';
          const isElevator = unit.type === 'elevator';
          
          return (
            <g key={unit.id} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onUnitClick(unit); }}>
              <polygon 
                points={polyStr} 
                fill={isSelected ? "rgba(212, 175, 55, 0.2)" : (isEscalator ? "url(#escalatorPattern)" : (isElevator ? (isStackedView ? "#2a2a2a" : "#e2e8f0") : (isStackedView ? "#1a1a1a" : "#ffffff")))} 
                stroke={isSelected ? "#d4af37" : (isEscalator ? "rgba(212, 175, 55, 0.4)" : (isElevator ? "rgba(212, 175, 55, 0.8)" : (isStackedView ? "#2a2a2a" : "#cbd5e1")))} 
                strokeWidth={isSelected ? 6 : (isEscalator || isElevator ? 2 : 1.5)} 
                className="transition-all duration-300 hover:fill-[#d4af3708]"
              />
              {/* Vertex Manipulation UI (Only in Edit Mode) */}
              {isEditMode && isSelected && unit.polygon.map((p, i) => {
                const nextP = unit.polygon[(i + 1) % unit.polygon.length];
                const midX = (p[0] + nextP[0]) / 2;
                const midY = (p[1] + nextP[1]) / 2;
                
                return (
                  <g key={`vertex-group-${i}`}>
                    {/* Main vertex handle */}
                    <circle 
                      cx={p[0]} cy={p[1]} r="12" 
                      fill="white" stroke="#d4af37" strokeWidth="4" 
                      className="cursor-move hover:scale-150 transition-transform"
                      onMouseDown={(e) => { e.stopPropagation(); setEditingPointIndex(i); }}
                      onContextMenu={(e) => handleDeleteVertex(e, i)}
                    />
                    {/* Edge mid-point handle for adding vertices */}
                    <circle 
                      cx={midX} cy={midY} r="8" 
                      fill="#d4af37" opacity="0.4"
                      className="cursor-pointer hover:opacity-100 transition-opacity"
                      onClick={(e) => handleAddVertex(e, i)}
                    />
                  </g>
                );
              })}
              {isElevator && (
                <text 
                  x={(unit.polygon[0][0] + unit.polygon[2][0]) / 2} 
                  y={(unit.polygon[0][1] + unit.polygon[2][1]) / 2 + 8}
                  textAnchor="middle" fill={isStackedView ? "#d4af37" : "#475569"} fontSize="20" fontWeight="black" className="pointer-events-none select-none"
                >
                  ELV
                </text>
              )}
              {!isSelected && !isEditMode && unit.type !== 'escalator' && unit.type !== 'elevator' && (
                <text 
                  x={unit.polygon[0][0] + 50} y={unit.polygon[0][1] + 50} fill={isStackedView ? "#555" : "#94a3b8"} fontSize="24" fontWeight="bold" className="pointer-events-none select-none opacity-40 uppercase tracking-tighter"
                >
                  {isArabic ? unit.nameAr : unit.nameEn}
                </text>
              )}
            </g>
          );
        })}

        {kioskConfig && kioskConfig.homeFloor === f.id && (
          <g transform={`translate(${kioskConfig.homeX}, ${kioskConfig.homeY})`}>
            <circle r="40" fill="#d4af37" opacity="0.1" className="animate-ping" />
            <circle r="12" fill="white" stroke="#d4af37" strokeWidth="4" />
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
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={(e) => isEditMode && e.preventDefault()}
    >
      {isCinematic && (
        <div className="absolute inset-0 pointer-events-none z-[200] flex flex-col justify-between p-16">
          <div className="flex justify-between items-start animate-in slide-in-from-top-12 duration-1000">
            <div className="bg-black/90 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl min-w-[400px]">
              <div className="flex items-center gap-6 mb-4">
                 <div className="w-3 h-3 bg-[#d4af37] rounded-full animate-pulse shadow-[0_0_15px_#d4af37]" />
                 <span className="text-[12px] font-black uppercase tracking-[0.5em] text-white/50">Elite Navigation</span>
              </div>
              <p className="text-4xl font-light text-white tracking-tighter uppercase mb-2">
                {selectedUnit ? (isArabic ? selectedUnit.nameAr : selectedUnit.nameEn) : 'Pathfinding...'}
              </p>
              <div className="flex items-center gap-4">
                 <span className="text-sm font-bold text-[#d4af37] uppercase tracking-widest">{currentPathNode?.floor || ''}</span>
                 <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                 <span className="text-sm text-white/40 font-medium uppercase tracking-widest">
                   {isArabic ? 'اتبع المسار الذهبي' : 'Following Golden Path'}
                 </span>
              </div>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); if(onNavExit) onNavExit(); }} 
              className="pointer-events-auto w-24 h-24 bg-white/10 hover:bg-white/20 backdrop-blur-3xl rounded-full flex flex-col items-center justify-center text-white transition-all border border-white/10 group shadow-2xl active:scale-90"
            >
              <svg className="w-10 h-10 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round"/></svg>
              <span className="text-[10px] font-black uppercase mt-2 tracking-widest opacity-60">Cancel</span>
            </button>
          </div>

          <div className="self-center w-full max-w-2xl bg-black/90 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/10 shadow-2xl animate-in slide-in-from-bottom-12 duration-1000">
            <div className="flex justify-between items-end mb-6">
               <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#d4af37]">Progress to Destination</p>
               <p className="text-2xl font-black text-white/80">{Math.round(navProgress * 100)}%</p>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-[#d4af37] shadow-[0_0_20px_#d4af37] transition-all duration-300" style={{ width: `${navProgress * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      <div style={{ transform: viewportTransform }} className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out origin-center pointer-events-none">
        <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="overflow-visible w-full h-full pointer-events-auto">
          <defs>
            <filter id="navGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <pattern id="escalatorPattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
               <rect width="12" height="12" fill={isStackedView ? "#1a1a1a" : "#f1f5f9"} />
               <line x1="0" y1="0" x2="0" y2="12" stroke={isStackedView ? "rgba(212,175,55,0.4)" : "rgba(15,23,42,0.2)"} strokeWidth="6" />
            </pattern>
          </defs>

          {INITIAL_FLOORS.map(f => renderFloorSlab(f))}
          
          {activePath.length > 1 && (
            <g filter="url(#navGlow)">
              {activePath.map((node, i) => {
                if (i === 0) return null;
                const prev = activePath[i-1];
                const f = INITIAL_FLOORS.find(fl => fl.id === node.floor)!;
                const pf = INITIAL_FLOORS.find(fl => fl.id === prev.floor)!;
                const z = isStackedView ? f.order * -FLOOR_SPACING : 0;
                const pz = isStackedView ? pf.order * -FLOOR_SPACING : 0;
                
                return (
                  <line 
                    key={`path-base-${i}`}
                    x1={prev.x} y1={prev.y + pz}
                    x2={node.x} y2={node.y + z}
                    stroke="#d4af37"
                    strokeWidth={isCinematic ? "32" : "18"}
                    strokeLinecap="round"
                    opacity={0.3}
                  />
                );
              })}
              <polyline 
                points={activePath.map(n => {
                  const f = INITIAL_FLOORS.find(f => f.id === n.floor)!;
                  const z = isStackedView ? f.order * -FLOOR_SPACING : 0;
                  return `${n.x},${n.y + z}`;
                }).join(' ')} 
                fill="none" 
                stroke="#d4af37" 
                strokeWidth={isCinematic ? "12" : "6"} 
                strokeLinecap="round" 
                strokeLinejoin="round"
                strokeDasharray="1,20"
                className="animate-path-pulse"
              />
            </g>
          )}

          {activePath.length > 0 && (
            <g transform={`translate(${activePath[activePath.length-1].x}, ${activePath[activePath.length-1].y + (isStackedView ? (INITIAL_FLOORS.find(f => f.id === activePath[activePath.length-1].floor)?.order || 0) * -FLOOR_SPACING : 0)})`}>
               <circle r="60" fill="#d4af37" opacity="0.2" className="animate-ping" />
               <circle r="20" fill="white" stroke="#d4af37" strokeWidth="6" />
            </g>
          )}
        </svg>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes path-pulse {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        .animate-path-pulse {
          animation: path-pulse 4s linear infinite;
        }
      `}} />
    </div>
  );
};

export default MapViewer;
