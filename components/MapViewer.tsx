
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
  // Designer specific props
  drawMode?: 'select' | 'polygon' | 'rectangle' | 'point';
  snapToGrid?: boolean;
  showGrid?: boolean;
  onFinishShape?: (points: Point[]) => void;
}

const FLOOR_SPACING = 1400; 
const GRID_SIZE = 50;

const MapViewer: React.FC<MapViewerProps> = ({ 
  floor, units, nodes, activePath, selectedUnit, userLocation, onUnitClick, isEmergency, isEditMode, onUpdateUnit, isArabic,
  mode = VisualizationMode.VIEW_2D, navStatus = 'idle', onNavComplete, onNavExit, kioskConfig,
  drawMode = 'select', snapToGrid = true, showGrid = true, onFinishShape
}) => {
  const mapWidth = 3200; 
  const mapHeight = 1536;
  
  const [view, setView] = useState({ scale: 0.3, translateX: 0, translateY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeDrawingPoints, setActiveDrawingPoints] = useState<Point[]>([]);
  const [draggedPointIndex, setDraggedPointIndex] = useState<{unitId: string, pointIndex: number} | null>(null);

  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const isCinematic = navStatus === 'following' || navStatus === 'calculating';
  const isStackedView = mode === VisualizationMode.VIEW_4D || isCinematic;

  const mallSlabPoints = [
    [50, 250], [800, 250], [800, 450], [2400, 450], [2400, 250], [3150, 250], 
    [3150, 1250], [2400, 1250], [2400, 1050], [1850, 1050], [1800, 1200], 
    [1400, 1200], [1350, 1050], [800, 1050], [800, 1250], [50, 1250]
  ].map(p => p.join(',')).join(' ');

  const getSVGCoords = (clientX: number, clientY: number): Point => {
    if (!svgRef.current) return [0, 0];
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const transformed = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    let x = transformed.x;
    let y = transformed.y;
    
    if (snapToGrid && isEditMode) {
      x = Math.round(x / GRID_SIZE) * GRID_SIZE;
      y = Math.round(y / GRID_SIZE) * GRID_SIZE;
    }
    return [x, y];
  };

  const fitToScreen = useCallback(() => {
    if (!containerRef.current || isCinematic) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const initialScale = Math.min(clientWidth / mapWidth, clientHeight / mapHeight) * 0.75;
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

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getSVGCoords(e.clientX, e.clientY);

    if (isEditMode && drawMode === 'polygon') {
      setActiveDrawingPoints(prev => [...prev, coords]);
      return;
    }

    if (!isCinematic) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, tx: view.translateX, ty: view.translateY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isCinematic) return;

    if (isEditMode && draggedPointIndex && onUpdateUnit) {
      const coords = getSVGCoords(e.clientX, e.clientY);
      const unit = units.find(u => u.id === draggedPointIndex.unitId);
      if (unit) {
        const newPolygon = [...unit.polygon];
        newPolygon[draggedPointIndex.pointIndex] = coords;
        onUpdateUnit({ ...unit, polygon: newPolygon });
      }
      return;
    }

    if (isDragging) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setView(prev => ({ ...prev, translateX: dragStart.current.tx + dx, translateY: dragStart.current.ty + dy }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedPointIndex(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isCinematic) return;
    const zoomFactor = Math.pow(1.1, -e.deltaY / 100);
    setView(prev => {
      const newScale = Math.max(0.1, Math.min(3, prev.scale * zoomFactor));
      return { ...prev, scale: newScale };
    });
  };

  const handlePointMouseDown = (e: React.MouseEvent, unitId: string, pointIndex: number) => {
    e.stopPropagation();
    if (isEditMode && drawMode === 'select') {
      setDraggedPointIndex({ unitId, pointIndex });
    }
  };

  const viewportTransform = useMemo(() => {
    const base = `translate(${view.translateX}px, ${view.translateY}px) scale(${view.scale})`;
    if (isStackedView || mode === VisualizationMode.VIEW_3D) {
      return `${base} perspective(2000px) rotateX(40deg) rotateZ(-5deg)`;
    }
    return base;
  }, [view, isStackedView, mode]);

  const renderFloorSlab = (f: Floor) => {
    const isActive = isCinematic ? true : f.id === floor.id;
    const zOffset = isStackedView ? (f.order * -FLOOR_SPACING) : 0;
    const floorUnits = units.filter(u => u.floor === f.id);

    return (
      <g key={f.id} transform={`translate(0, ${zOffset})`} opacity={isActive ? 1 : 0.05} style={{ transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {/* Floor Base */}
        <polygon points={mallSlabPoints} fill="#ffffff" stroke="rgba(0,0,0,0.05)" strokeWidth="2" />
        
        {/* Grid Overlay */}
        {showGrid && isEditMode && f.id === floor.id && (
          <defs>
            <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
              <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1"/>
            </pattern>
          </defs>
        )}
        {showGrid && isEditMode && f.id === floor.id && (
          <polygon points={mallSlabPoints} fill="url(#grid)" pointerEvents="none" />
        )}

        {floorUnits.map(unit => {
          const isSelected = selectedUnit?.id === unit.id;
          const polyStr = unit.polygon.map(p => p.join(',')).join(' ');
          
          return (
            <g key={unit.id} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onUnitClick(unit); }}>
              <polygon 
                points={polyStr} 
                fill={isSelected ? "rgba(212, 175, 55, 0.15)" : "#ffffff"} 
                stroke={isSelected ? "#d4af37" : "rgba(0,0,0,0.08)"} 
                strokeWidth={isSelected ? 6 : 2} 
                className="transition-all duration-300"
              />
              {isSelected && isEditMode && unit.polygon.map((p, idx) => (
                <circle 
                  key={idx} cx={p[0]} cy={p[1]} r={isSelected ? 10 : 0} 
                  fill="#d4af37" stroke="white" strokeWidth="2"
                  onMouseDown={(e) => handlePointMouseDown(e, unit.id, idx)}
                  className="cursor-move hover:scale-125 transition-transform"
                />
              ))}
              {!isSelected && unit.type !== 'escalator' && unit.type !== 'elevator' && (
                <text 
                  x={unit.polygon[0][0] + 10} y={unit.polygon[0][1] + 30} 
                  fill="rgba(0,0,0,0.15)" fontSize="14" fontWeight="black" className="uppercase tracking-tighter select-none pointer-events-none"
                >
                  {isArabic ? unit.nameAr : unit.nameEn}
                </text>
              )}
            </g>
          );
        })}

        {/* Active Drawing Preview */}
        {isActive && activeDrawingPoints.length > 0 && (
          <g pointerEvents="none">
            <polyline 
              points={activeDrawingPoints.map(p => p.join(',')).join(' ')} 
              fill="none" stroke="#d4af37" strokeWidth="4" strokeDasharray="10,5"
            />
            {activeDrawingPoints.map((p, idx) => (
              <circle key={idx} cx={p[0]} cy={p[1]} r={6} fill="#d4af37" />
            ))}
          </g>
        )}
      </g>
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-[#f8f8f8] overflow-hidden relative" 
      onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onWheel={handleWheel}
      onDoubleClick={() => {
        if (activeDrawingPoints.length > 2 && onFinishShape) {
          onFinishShape(activeDrawingPoints);
          setActiveDrawingPoints([]);
        }
      }}>
      
      {/* Floor Header Overlay */}
      <div className={`absolute top-12 ${isArabic ? 'right-12 text-right' : 'left-12 text-left'} z-20 pointer-events-none select-none animate-fade-in-up`}>
        <div className="relative">
          <span className={`absolute -top-16 ${isArabic ? '-right-6' : '-left-6'} text-[160px] font-black text-black/[0.04] italic tracking-tighter`}>
            {floor.id}
          </span>
          <div className="relative pt-8">
            <h1 className="text-4xl lg:text-5xl font-black text-black uppercase tracking-[0.4em] mb-4 drop-shadow-sm">
              {isArabic ? floor.nameAr : floor.nameEn}
            </h1>
            <div className={`w-32 h-2 bg-black rounded-full ${isArabic ? 'mr-1' : 'ml-1'}`} />
          </div>
        </div>
      </div>

      <div style={{ transform: viewportTransform }} className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out origin-center">
        <svg ref={svgRef} viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="overflow-visible w-full h-full">
          {INITIAL_FLOORS.map(f => renderFloorSlab(f))}
          {activePath.length > 1 && (
            <polyline 
              points={activePath.map(n => {
                const f = INITIAL_FLOORS.find(fl => fl.id === n.floor)!;
                const z = isStackedView ? f.order * -FLOOR_SPACING : 0;
                return `${n.x},${n.y + z}`;
              }).join(' ')} 
              fill="none" stroke="#d4af37" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" 
              className="animate-path-pulse" strokeDasharray="1, 15"
            />
          )}
        </svg>
      </div>

      {isEditMode && (
        <div className="absolute bottom-12 left-12 z-50 bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-black/5 shadow-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cursor Coordinates</p>
          <p className="text-sm font-mono font-bold text-slate-900 tracking-tighter">DESIGNER VIEWPORT ACTIVE</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes path-pulse { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
        .animate-path-pulse { animation: path-pulse 3s linear infinite; }
      `}} />
    </div>
  );
};

export default MapViewer;
