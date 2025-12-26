
import React, { useState, useEffect, useRef } from 'react';
import { FloorID, Unit, NavNode, Connection, VisualizationMode, MallState, NavigationStatus } from './types';
import { INITIAL_FLOORS, INITIAL_NODES, INITIAL_CONNECTIONS } from './constants';
import MapViewer from './components/MapViewer';
import Sidebar from './components/Sidebar';
import DestinationCard from './components/DestinationCard';
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
    if (mallState) setCurrentFloorID(mallState.kioskConfig.homeFloor);
  };

  const handleGetDirections = (unit: Unit) => {
    if (!mallState) return;
    setNavStatus('calculating');
    
    const kioskNode: NavNode = {
      id: 'KIOSK-ANCHOR',
      floor: mallState.kioskConfig.homeFloor,
      x: mallState.kioskConfig.homeX,
      y: mallState.kioskConfig.homeY,
      type: 'corridor'
    };

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
      setTimeout(() => setNavStatus('following'), 1500); // Cinematic delay
    } else {
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

  if (!mallState) return null;

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
        }}
        onOpenAI={() => setShowAI(true)}
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
          userLocation={{ x: mallState.kioskConfig.homeX, y: mallState.kioskConfig.homeY, floor: mallState.kioskConfig.homeFloor }} 
          onUnitClick={(u) => {
            if (navStatus !== 'idle') return;
            setSelectedDestination(u);
            setActivePath([]);
          }}
          isArabic={isArabic}
          mode={visMode}
          navStatus={navStatus}
          onNavComplete={() => setNavStatus('arrived')}
          onNavExit={handleExitNavigation}
          kioskConfig={mallState.kioskConfig}
          isEditMode={isEditMode}
          onUpdateUnit={(updatedUnit) => {
            handleUpdateMallState({
              units: mallState.units.map(u => u.id === updatedUnit.id ? updatedUnit : u)
            });
          }}
        />
        
        {selectedDestination && navStatus === 'idle' && !isEditMode && (
          <DestinationCard 
            unit={selectedDestination}
            isArabic={isArabic}
            onClose={() => setSelectedDestination(null)}
            onNavigate={() => handleGetDirections(selectedDestination)}
            categories={mallState.categories}
          />
        )}

        {navStatus === 'idle' && !isEditMode && (
          <div className={`absolute bottom-12 z-30 flex bg-black/95 backdrop-blur-3xl p-2 rounded-3xl border border-white/10 ${isArabic ? 'left-32' : 'right-32'}`}>
            {[VisualizationMode.VIEW_2D, VisualizationMode.VIEW_3D, VisualizationMode.VIEW_4D].map(mode => (
              <button 
                key={mode} 
                onClick={() => setVisMode(mode)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${visMode === mode ? 'bg-amber-500 text-white' : 'text-slate-500 hover:text-white'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        )}

        {isEditMode && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl flex items-center gap-4">
            <span className="text-xl">🛠️</span>
            Spatial Designer Active
            <button 
              onClick={() => setIsEditMode(false)}
              className="ml-4 bg-white/20 hover:bg-white/40 px-4 py-1 rounded-lg text-xs transition-colors"
            >
              Exit
            </button>
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
          onEnterEditMode={() => {
            setIsEditMode(true);
            setVisMode(VisualizationMode.VIEW_2D);
          }}
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
          }}
        />
      )}
    </div>
  );
};

export default App;
