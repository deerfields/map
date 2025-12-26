
import React, { useState, useEffect, useRef } from 'react';
import { FloorID, Unit, NavNode, Connection, MallCategory, VisualizationMode, MallState, KioskHealth, NavigationStatus } from './types';
import { INITIAL_FLOORS, INITIAL_NODES, INITIAL_CONNECTIONS } from './constants';
import MapViewer from './components/MapViewer';
import Sidebar from './components/Sidebar';
import DestinationCard from './components/DestinationCard';
import FloorSelector from './components/FloorSelector';
import AdminDashboard from './components/AdminDashboard';
import AIConcierge from './components/AIConcierge';
import VirtualKeyboard from './components/VirtualKeyboard';
import { dbService } from './services/dbService';
import { searchMall } from './services/geminiService';
import { findPath } from './services/routingService';

const App: React.FC = () => {
  const [mallState, setMallState] = useState<MallState | null>(null);
  const [isArabic, setIsArabic] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [visMode, setVisMode] = useState<VisualizationMode>(VisualizationMode.VIEW_2D);
  const [navStatus, setNavStatus] = useState<NavigationStatus>('idle');

  const [currentFloorID, setCurrentFloorID] = useState<FloorID>(FloorID.ML);
  const [selectedDestination, setSelectedDestination] = useState<Unit | null>(null);
  const [activePath, setActivePath] = useState<NavNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const monitorIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const boot = async () => {
      const state = await dbService.loadState();
      
      if (!state.kiosksHealth || state.kiosksHealth.length === 0) {
        state.kiosksHealth = [{
          kioskId: state.kioskConfig.id,
          status: 'online',
          uptimeSeconds: 0,
          cpuLoad: 12,
          memoryUsage: 45,
          lastHeartbeat: Date.now(),
          networkLatency: 8,
          issues: []
        }];
      }
      
      setMallState(state);
      setCurrentFloorID(state.kioskConfig.homeFloor);
      
      monitorIntervalRef.current = window.setInterval(() => {
        setMallState(prev => {
          if (!prev) return null;
          const updatedHealth = (prev.kiosksHealth || []).map(h => {
            if (h.kioskId === prev.kioskConfig.id) {
              const cpuBase = Math.max(5, Math.min(95, h.cpuLoad + (Math.random() * 10 - 5)));
              const memBase = Math.max(20, Math.min(90, h.memoryUsage + (Math.random() * 4 - 2)));
              const latBase = Math.max(2, Math.min(100, h.networkLatency + (Math.random() * 6 - 3)));
              
              const issues = [];
              if (cpuBase > 85) issues.push('Critical CPU Spike Detected');
              if (latBase > 70) issues.push('Network Latency Degraded');
              
              return {
                ...h,
                uptimeSeconds: h.uptimeSeconds + 5,
                cpuLoad: Math.round(cpuBase),
                memoryUsage: Math.round(memBase),
                networkLatency: Math.round(latBase),
                lastHeartbeat: Date.now(),
                status: issues.length > 1 ? 'warning' : 'online',
                issues
              };
            }
            return h;
          });
          return { ...prev, kiosksHealth: updatedHealth };
        });
      }, 5000);
    };
    boot();
    
    return () => {
      if (monitorIntervalRef.current) clearInterval(monitorIntervalRef.current);
    };
  }, []);

  const handleUpdateMallState = async (updates: Partial<MallState>) => {
    if (!mallState) return;
    const newState = { ...mallState, ...updates };
    setMallState(newState);
    await dbService.saveState(newState);
  };

  const handleExitNavigation = () => {
    setNavStatus('idle');
    setActivePath([]);
    setSelectedDestination(null);
    setSearchQuery('');
    setVisMode(VisualizationMode.VIEW_2D);
    if (mallState) {
        setCurrentFloorID(mallState.kioskConfig.homeFloor);
    }
  };

  const handleGetDirections = (unit: Unit) => {
    if (!mallState) return;
    
    setNavStatus('calculating');
    
    // Create the Kiosk Start Node
    const kioskNode: NavNode = {
      id: 'KIOSK-ANCHOR',
      floor: mallState.kioskConfig.homeFloor,
      x: mallState.kioskConfig.homeX,
      y: mallState.kioskConfig.homeY,
      type: 'corridor'
    };

    // Find nearest physical node on the same floor to bridge the kiosk to the grid
    const sameFloorNodes = INITIAL_NODES.filter(n => n.floor === kioskNode.floor);
    const nearestNode = sameFloorNodes.reduce((prev, curr) => {
      const distPrev = Math.sqrt(Math.pow(prev.x - kioskNode.x, 2) + Math.pow(prev.y - kioskNode.y, 2));
      const distCurr = Math.sqrt(Math.pow(curr.x - kioskNode.x, 2) + Math.pow(curr.y - kioskNode.y, 2));
      return distCurr < distPrev ? curr : prev;
    }, sameFloorNodes[0]);

    const tempConnections: Connection[] = [
      ...INITIAL_CONNECTIONS,
      { from: kioskNode.id, to: nearestNode.id, accessible: true }
    ];
    
    const path = findPath(kioskNode.id, unit.entryNodeId, [kioskNode, ...INITIAL_NODES], tempConnections, 'shortest');
    
    if (path.length > 0) {
      setActivePath(path);
      // Brief delay to allow the "calculating" UI to breathe before snapping to the cinematic view
      setTimeout(() => {
        setNavStatus('following');   // Start Cinematic Move
      }, 1000);
    } else {
      console.warn("Navigation Engine: No path found to unit " + unit.id);
      setNavStatus('idle');
    }
  };

  const executeSearch = async (q: string) => {
    if (!mallState) return;
    const res = await searchMall(q, mallState.units);
    if (res.found) {
      const foundUnit = mallState.units.find(u => u.id === res.storeId);
      if (foundUnit) {
        setSelectedDestination(foundUnit);
        setCurrentFloorID(foundUnit.floor);
      }
    }
    setShowKeyboard(false);
  };

  if (!mallState) return (
    <div className="h-full w-full bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
      <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-8" />
      <p className="text-xs font-black uppercase tracking-[0.5em] opacity-40">Spatial Database Initializing...</p>
    </div>
  );

  return (
    <div className={`flex h-full w-full overflow-hidden bg-[#fcfcfc] ${isArabic ? 'flex-row-reverse text-right' : 'flex-row text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <Sidebar 
        isOpen={!isEditMode && navStatus === 'idle'}
        isArabic={isArabic}
        query={searchQuery}
        onSearch={executeSearch}
        onOpenKeyboard={() => setShowKeyboard(true)}
        selectedStore={selectedDestination}
        activePath={activePath}
        onReset={handleExitNavigation}
        onToggleLang={() => setIsArabic(!isArabic)}
        onOpenAdmin={() => setShowAdmin(true)}
        categories={mallState.categories}
        events={mallState.events}
        units={mallState.units}
        onSelectStore={(u) => {
          setSelectedDestination(u);
          setCurrentFloorID(u.floor);
          setSearchQuery(isArabic ? u.nameAr : u.nameEn);
          setActivePath([]);
          setNavStatus('idle');
        }}
        routeMode="shortest"
        onSetRouteMode={() => {}}
        onOpenAI={() => setShowAI(true)}
        isOnline={true}
        isEmergency={mallState.isEmergency}
        onGetDirections={handleGetDirections}
        currentFloor={currentFloorID}
        onFloorChange={setCurrentFloorID}
      />

      <main className="flex-1 relative h-full">
        <MapViewer 
          floor={INITIAL_FLOORS.find(f => f.id === currentFloorID)!} 
          units={mallState.units} 
          nodes={INITIAL_NODES} 
          activePath={activePath} 
          selectedUnit={selectedDestination} 
          userLocation={{ x: mallState.kioskConfig.homeX, y: mallState.kioskConfig.homeY, floor: mallState.kioskConfig.homeFloor, accuracy: 0 }} 
          onUnitClick={(u) => {
            if (navStatus !== 'idle') return;
            setSelectedDestination(u);
            setActivePath([]);
            setNavStatus('idle');
          }}
          isArabic={isArabic}
          mode={visMode}
          isEditMode={isEditMode}
          onUpdateUnit={(updatedUnit) => {
            const nextUnits = mallState.units.map(u => u.id === updatedUnit.id ? updatedUnit : u);
            handleUpdateMallState({ units: nextUnits });
          }}
          onAddUnitAtPoint={() => {}}
          navStatus={navStatus}
          onNavComplete={() => setNavStatus('arrived')}
          onNavExit={handleExitNavigation}
          kioskConfig={mallState.kioskConfig}
        />
        
        {selectedDestination && !isEditMode && navStatus === 'idle' && (
          <DestinationCard 
            unit={selectedDestination}
            isArabic={isArabic}
            onClose={() => setSelectedDestination(null)}
            onNavigate={() => handleGetDirections(selectedDestination)}
            categories={mallState.categories}
          />
        )}

        {navStatus === 'calculating' && (
          <div className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-black/50 backdrop-blur-2xl animate-in fade-in duration-500">
             <div className="w-24 h-24 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-12 shadow-[0_0_50px_rgba(212,175,55,0.4)]" />
             <p className="text-xl font-black uppercase tracking-[0.6em] text-white">Synthesizing Splines...</p>
          </div>
        )}

        {navStatus === 'idle' && (
          <div className={`absolute bottom-12 z-30 flex bg-black/95 backdrop-blur-3xl p-2 rounded-3xl border border-white/10 ${isArabic ? 'left-32' : 'right-32'}`}>
            {Object.values(VisualizationMode).filter(m => m !== VisualizationMode.VIEW_CINEMATIC).map(mode => (
              <button 
                key={mode} 
                onClick={() => setVisMode(mode)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${visMode === mode ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-white'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        )}
      </main>

      {showAdmin && (
        <AdminDashboard 
          units={mallState.units} 
          kioskConfig={mallState.kioskConfig}
          kiosksHealth={mallState.kiosksHealth || []}
          onClose={() => setShowAdmin(false)} 
          isEmergency={mallState.isEmergency}
          onTriggerEmergency={() => handleUpdateMallState({ isEmergency: !mallState.isEmergency })}
          onEnterEditMode={() => setIsEditMode(true)}
          onUpdateKiosk={(config) => handleUpdateMallState({ kioskConfig: config })}
          onUpdateState={handleUpdateMallState}
          onAddUnit={(u) => handleUpdateMallState({ units: [...mallState.units, u] })}
        />
      )}

      {showAI && (
        <AIConcierge 
          isOpen={showAI} 
          onClose={() => setShowAI(false)} 
          units={mallState.units} 
          isArabic={isArabic} 
          onNavigate={(id) => { 
            const u = mallState.units.find(unit => unit.id === id);
            if (u) {
              setSelectedDestination(u);
              setCurrentFloorID(u.floor);
              handleGetDirections(u);
            }
            setShowAI(false); 
          }} 
          onOpenKeyboard={() => setShowKeyboard(true)} 
          onClearInput={() => setSearchQuery('')} 
        />
      )}

      {showKeyboard && (
        <VirtualKeyboard 
          value={searchQuery}
          isArabic={isArabic}
          units={mallState.units}
          onChange={setSearchQuery}
          onEnter={() => executeSearch(searchQuery)}
          onClose={() => setShowKeyboard(false)}
          onSelectUnit={(u) => {
            setSelectedDestination(u);
            setCurrentFloorID(u.floor);
            setSearchQuery(isArabic ? u.nameAr : u.nameEn);
            setShowKeyboard(false);
            setActivePath([]);
            setNavStatus('idle');
          }}
        />
      )}
    </div>
  );
};

export default App;
