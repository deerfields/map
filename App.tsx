
import React, { useState, useEffect, useMemo } from 'react';
import { FloorID, Unit, NavNode, Connection, VisualizationMode, MallState, NavigationStatus, Point } from './types';
import { INITIAL_FLOORS, INITIAL_NODES, INITIAL_CONNECTIONS } from './constants';
import MapViewer from './components/MapViewer';
import Sidebar from './components/Sidebar';
import DestinationCard from './components/DestinationCard';
import AdminDashboard from './components/AdminDashboard';
import AIConcierge from './components/AIConcierge';
import VirtualKeyboard from './components/VirtualKeyboard';
import FloorSelector from './components/FloorSelector';
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
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const pathFloors = useMemo(() => Array.from(new Set(activePath.map(n => n.floor))), [activePath]);

  useEffect(() => {
    const boot = async () => {
      const state = await dbService.loadState();
      setMallState(state);
      setCurrentFloorID(state.kioskConfig.homeFloor);
    };
    boot();
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
    setIsEditMode(false);
    setIsSidebarOpen(true);
    if (mallState) setCurrentFloorID(mallState.kioskConfig.homeFloor);
  };

  const handleGetDirections = (unit: Unit) => {
    if (!mallState) return;
    setNavStatus('calculating');
    setIsSidebarOpen(false); 
    
    const kioskNode: NavNode = { id: 'KIOSK-ANCHOR', floor: mallState.kioskConfig.homeFloor, x: mallState.kioskConfig.homeX, y: mallState.kioskConfig.homeY, type: 'corridor' };
    const sameFloorNodes = INITIAL_NODES.filter(n => n.floor === kioskNode.floor);
    const nearestNode = sameFloorNodes.reduce((prev, curr) => {
      const distPrev = Math.sqrt(Math.pow(prev.x - kioskNode.x, 2) + Math.pow(prev.y - kioskNode.y, 2));
      const distCurr = Math.sqrt(Math.pow(curr.x - kioskNode.x, 2) + Math.pow(curr.y - kioskNode.y, 2));
      return distCurr < distPrev ? curr : prev;
    }, sameFloorNodes[0]);

    const tempConnections: Connection[] = [...INITIAL_CONNECTIONS, { from: kioskNode.id, to: nearestNode.id, accessible: true }];
    const path = findPath(kioskNode.id, unit.entryNodeId, [kioskNode, ...INITIAL_NODES], tempConnections, 'shortest');
    
    if (path.length > 0) {
      setActivePath(path);
      setTimeout(() => setNavStatus('following'), 1000);
    } else {
      setNavStatus('idle');
      setIsSidebarOpen(true);
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

  const handleFinishShape = (points: Point[]) => {
    if (!mallState) return;
    const newUnit: Unit = {
      id: `UNIT-${Date.now()}`,
      nameEn: 'New Shop',
      nameAr: 'محل جديد',
      type: 'store',
      category: 'cat-fashion',
      floor: currentFloorID,
      mallAddress: `${currentFloorID}-TBD`,
      polygon: points,
      entryNodeId: 'ML-NODE-ATRIUM', // default anchor
      status: 'open',
      tags: [],
      attributes: [],
      storeNumber: '000',
      openingTime: '10:00',
      closingTime: '22:00'
    };
    handleUpdateMallState({ units: [...mallState.units, newUnit] });
    setSelectedDestination(newUnit);
  };

  if (!mallState) return null;

  return (
    <div className={`flex h-full w-full overflow-hidden bg-[#0a0a0a] ${isArabic ? 'flex-row-reverse' : 'flex-row'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      
      <div className={`${isSidebarOpen ? 'flex' : 'hidden'} w-full lg:w-[600px] h-full shrink-0 z-40 transition-all duration-700`}>
        <Sidebar 
          isOpen={!isEditMode && navStatus === 'idle'} isArabic={isArabic} query={searchQuery} onSearch={executeSearch}
          onOpenKeyboard={() => setShowKeyboard(true)} selectedStore={selectedDestination} activePath={activePath}
          onReset={handleExitNavigation} onToggleLang={() => setIsArabic(!isArabic)} onOpenAdmin={() => setShowAdmin(true)}
          categories={mallState.categories} events={mallState.events} units={mallState.units}
          onSelectStore={(u) => { setSelectedDestination(u); setCurrentFloorID(u.floor); setSearchQuery(isArabic ? u.nameAr : u.nameEn); setActivePath([]); }}
          onOpenAI={() => setShowAI(true)} currentFloor={currentFloorID} onFloorChange={setCurrentFloorID}
        />
      </div>

      <main className="flex-1 relative h-full">
        <MapViewer 
          floor={INITIAL_FLOORS.find(f => f.id === currentFloorID)!} units={mallState.units} nodes={INITIAL_NODES} activePath={activePath} 
          selectedUnit={selectedDestination} userLocation={{ x: mallState.kioskConfig.homeX, y: mallState.kioskConfig.homeY, floor: mallState.kioskConfig.homeFloor }} 
          onUnitClick={(u) => setSelectedDestination(u)}
          isArabic={isArabic} mode={visMode} navStatus={navStatus} onNavComplete={() => setNavStatus('arrived')} onNavExit={handleExitNavigation}
          kioskConfig={mallState.kioskConfig} isEditMode={isEditMode}
          onUpdateUnit={(u) => handleUpdateMallState({ units: mallState.units.map(unit => unit.id === u.id ? u : unit) })}
          onFinishShape={handleFinishShape}
        />

        <FloorSelector currentFloor={currentFloorID} onFloorChange={setCurrentFloorID} isArabic={isArabic} pathFloors={pathFloors} />

        {selectedDestination && navStatus === 'idle' && !isEditMode && (
          <DestinationCard unit={selectedDestination} isArabic={isArabic} onClose={() => setSelectedDestination(null)} onNavigate={() => handleGetDirections(selectedDestination)} categories={mallState.categories} />
        )}

        {navStatus === 'idle' && !isEditMode && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:right-24 lg:left-auto z-40">
            <div className="bg-[#111111] backdrop-blur-3xl p-2 rounded-full border border-white/5 shadow-2xl flex gap-2">
              {[VisualizationMode.VIEW_2D, VisualizationMode.VIEW_3D, VisualizationMode.VIEW_4D].map(mode => (
                <button 
                  key={mode} 
                  onClick={() => setVisMode(mode)}
                  className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${visMode === mode ? 'bg-[#d4af37] text-black font-black' : 'text-white/40 hover:text-white'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {showAdmin && <AdminDashboard units={mallState.units} kioskConfig={mallState.kioskConfig} kiosksHealth={mallState.kiosksHealth || []} onClose={() => setShowAdmin(false)} isEmergency={mallState.isEmergency} onTriggerEmergency={() => handleUpdateMallState({ isEmergency: !mallState.isEmergency })} onEnterEditMode={() => { setIsEditMode(true); setVisMode(VisualizationMode.VIEW_2D); }} onUpdateKiosk={(config) => handleUpdateMallState({ kioskConfig: config })} onUpdateState={handleUpdateMallState} onAddUnit={(u) => handleUpdateMallState({ units: [...mallState.units, u] })} selectedUnit={selectedDestination} onSelectUnit={setSelectedDestination} />}
      {showAI && <AIConcierge isOpen={showAI} onClose={() => setShowAI(false)} units={mallState.units} isArabic={isArabic} onNavigate={(id) => { const u = mallState.units.find(unit => unit.id === id); if (u) { setSelectedDestination(u); handleGetDirections(u); } setShowAI(false); }} onOpenKeyboard={() => setShowKeyboard(true)} onClearInput={() => setSearchQuery('')} />}
      {showKeyboard && <VirtualKeyboard value={searchQuery} isArabic={isArabic} units={mallState.units} onChange={setSearchQuery} onEnter={() => executeSearch(searchQuery)} onClose={() => setShowKeyboard(false)} onSelectUnit={(u) => { setSelectedDestination(u); setCurrentFloorID(u.floor); setSearchQuery(isArabic ? u.nameAr : u.nameEn); setShowKeyboard(false); }} />}
    </div>
  );
};

export default App;
