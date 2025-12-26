
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FloorID, NavNode, Unit, Floor, Point, VisualizationMode } from '../types';
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
}

const MapViewer: React.FC<MapViewerProps> = ({ 
  floor, units, nodes, activePath, selectedUnit, userLocation, onUnitClick, isEmergency, isEditMode, onUpdateUnit, isArabic, isDrawingMode, onCompleteDrawing,
  mode = VisualizationMode.VIEW_2D
}) => {
  const mapWidth = 3200; 
  const mapHeight = 1536;
  const GRID_SIZE = 20; 
  
  const [view, setView] = useState({ scale: 0.3, translateX: 0, translateY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggingVertexIndex, setDraggingVertexIndex] = useState<number | null>(null);
  
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [liveTicks, setLiveTicks] = useState(0);
  useEffect(() => {
    if (mode === VisualizationMode.VIEW_4D) {
      const interval = setInterval(() => setLiveTicks(t => t + 1), 2000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  const mallSlabPoints = [
    [50, 250], [800, 250], [800, 450], [2400, 450], [2400, 250], [3150, 250], 
    [3150, 1250], [2400, 1250], [2400, 1050], [1850, 1050], [1800, 1200], 
    [1400, 1200], [1350, 1050], [800, 1050], [800, 1250], [50, 1250]
  ].map(p => p.join(',')).join(' ');

  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const initialScale = Math.min(clientWidth / mapWidth, clientHeight / mapHeight, 0.6);
    setView(prev => ({ ...prev, scale: initialScale, translateX: 0, translateY: 0 }));
  }, [mapWidth, mapHeight]);

  useEffect(() => {
    fitToScreen();
    const observer = new ResizeObserver(() => fitToScreen());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [fitToScreen]);

  const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDrawingMode) return;
    const isTouchEvent = 'touches' in e;
    const clientX = isTouchEvent ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = isTouchEvent ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;

    if (draggingVertexIndex !== null) return;
    setIsDragging(true);
    dragStart.current = { x: clientX, y: clientY, tx: view.translateX, ty: view.translateY };
  };

  const onGlobalMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const isTouchEvent = 'touches' in e;
    const clientX = isTouchEvent ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = isTouchEvent ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    setView(prev => ({ ...prev, translateX: dragStart.current.tx + dx, translateY: dragStart.current.ty + dy }));
  }, [isDragging]);

  useEffect(() => {
    window.addEventListener('mousemove', onGlobalMouseMove);
    window.addEventListener('mouseup', () => { setIsDragging(false); setDraggingVertexIndex(null); });
    return () => { window.removeEventListener('mousemove', onGlobalMouseMove); };
  }, [onGlobalMouseMove]);

  const viewportTransform = useMemo(() => {
    const base = `translate(${view.translateX}px, ${view.translateY}px) scale(${view.scale})`;
    if (mode === VisualizationMode.VIEW_3D || mode === VisualizationMode.VIEW_4D) {
      return `${base} perspective(2000px) rotateX(48deg) rotateZ(-12deg)`;
    }
    return base;
  }, [view, mode]);

  const renderFloorSlab = (f: Floor) => {
    const isActive = f.id === floor.id;
    const floorUnits = units.filter(u => u.floor === f.id);
    const isDark = mode === VisualizationMode.VIEW_4D;
    
    return (
      <g key={f.id} opacity={isActive ? 1 : 0.03} style={{ transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {isActive && (isEditMode || isDrawingMode) && (
          <g pointerEvents="none">
            <defs>
              <pattern id="gridCAD" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            <rect x="-2000" y="-2000" width={mapWidth + 4000} height={mapHeight + 4000} fill="url(#gridCAD)" />
          </g>
        )}

        {(mode === VisualizationMode.VIEW_3D || mode === VisualizationMode.VIEW_4D) && (
           <polygon points={mallSlabPoints} fill="black" opacity="0.15" transform="translate(15, 30)" pointerEvents="none" />
        )}

        <polygon points={mallSlabPoints} fill={isDark ? "#111" : "#fcfcfc"} opacity="0.95" stroke={isDark ? "#333" : "#e2e8f0"} strokeWidth="1" pointerEvents="none" />

        {floorUnits.map(unit => {
          const isSelected = selectedUnit?.id === unit.id;
          const polyStr = unit.polygon.map(p => p.join(',')).join(' ');
          
          return (
            <g key={unit.id} onClick={(e) => { e.stopPropagation(); onUnitClick(unit); }} className="cursor-pointer group">
              {(mode === VisualizationMode.VIEW_3D || mode === VisualizationMode.VIEW_4D) && (
                <polygon points={polyStr} fill={isDark ? "#222" : "#eee"} opacity="0.3" transform="translate(0, 15)" />
              )}

              <polygon 
                points={polyStr} 
                fill={isSelected ? (isDark ? "#d4af37" : "#d4af3722") : (isDark ? "#1a1a1a" : "white")} 
                stroke={isSelected ? "#d4af37" : (isDark ? "#2a2a2a" : "#f1f5f9")} 
                strokeWidth={isSelected ? 3 : 1} 
                className="transition-all duration-500"
              />
              
              {isDark && !isSelected && Math.random() > 0.7 && (
                <circle 
                  cx={unit.polygon[0][0] + 15} 
                  cy={unit.polygon[0][1] + 15} 
                  r={3 + Math.sin(liveTicks + unit.id.length) * 2} 
                  fill="#d4af37" 
                  className="animate-pulse"
                  opacity="0.3"
                />
              )}

              {unit.logoUrl && !isSelected && !isEditMode && !isDrawingMode && !isDark && (
                <image 
                  href={unit.logoUrl} 
                  x={unit.polygon[0][0] + 8} 
                  y={unit.polygon[0][1] + 8} 
                  width={Math.abs(unit.polygon[1][0] - unit.polygon[0][0]) - 16} 
                  height={Math.abs(unit.polygon[2][1] - unit.polygon[1][1]) - 16} 
                  preserveAspectRatio="xMidYMid meet"
                  opacity="0.7"
                  pointerEvents="none"
                />
              )}
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#f8fafc]" onMouseDown={onMouseDown}>
      {mode === VisualizationMode.VIEW_4D && (
        <div className="absolute top-12 left-12 z-40 bg-black/90 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 text-white animate-in slide-in-from-left-6 duration-1000 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Temporal Intelligence Active</span>
          </div>
          <p className="text-4xl font-light mt-4 tracking-tighter">{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</p>
          <div className="mt-6 flex items-center justify-between gap-10">
             <div className="flex flex-col">
               <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Live Traffic</span>
               <span className="text-[10px] text-[#d4af37] font-black">OPTIMAL</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Environment</span>
               <span className="text-[10px] text-white/60 font-black">24°C</span>
             </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-12 right-12 z-50 flex flex-col gap-6">
        <button onClick={() => setView(v => ({...v, scale: v.scale + 0.1}))} className="w-14 h-14 bg-[#111] text-white shadow-2xl rounded-2xl flex items-center justify-center border border-white/10 hover:bg-black transition-all">+</button>
        <button onClick={() => setView(v => ({...v, scale: v.scale - 0.1}))} className="w-14 h-14 bg-[#111] text-white shadow-2xl rounded-2xl flex items-center justify-center border border-white/10 hover:bg-black transition-all">-</button>
      </div>

      <div style={{ transform: viewportTransform }} className="w-full h-full flex items-center justify-center transition-all duration-1000 ease-in-out origin-center">
        <svg ref={svgRef} viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="overflow-visible w-full h-full">
          {INITIAL_FLOORS.map(f => renderFloorSlab(f))}
          
          {activePath.length > 1 && floor.id === activePath[0].floor && (
            <polyline 
              points={activePath.map(n => `${n.x},${n.y}`).join(' ')} 
              fill="none" 
              stroke="#d4af37" 
              strokeWidth={mode === VisualizationMode.VIEW_2D ? "6" : "16"} 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="animate-pulse"
              style={{ filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.4))' }}
            />
          )}
        </svg>
      </div>
    </div>
  );
};

export default MapViewer;
