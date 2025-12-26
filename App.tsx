
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FloorID, Unit, NavNode, Connection, Floor, MallCategory, VisualizationMode, KioskDevice } from './types';
import { INITIAL_FLOORS, INITIAL_NODES, INITIAL_CONNECTIONS } from './constants';
import MapViewer from './components/MapViewer';
import Sidebar from './components/Sidebar';
import FloorSelector from './components/FloorSelector';
import AdminDashboard from './components/AdminDashboard';
import AIConcierge from './components/AIConcierge';
import VirtualKeyboard from './components/VirtualKeyboard';
import { loadMallData, saveMallData } from './services/storageService';
import { searchMall } from './services/geminiService';
import { findPath } from './services/routingService';

const App: React.FC = () => {
  const [mallState, setMallState] = useState(() => loadMallData());
  const [isDataReady, setIsDataReady] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [visMode, setVisMode] = useState<VisualizationMode>(VisualizationMode.VIEW_2D);

  const [currentFloorID, setCurrentFloorID] = useState<FloorID>(FloorID.ML);
  const [selectedDestination, setSelectedDestination] = useState<Unit | null>(null);
  const [activePath, setActivePath] = useState<NavNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsDataReady(true);
    setCurrentFloorID(mallState.kioskConfig.homeFloor);
  }, [mallState.kioskConfig.homeFloor]);

  const handleUpdateMallState = (updates: Partial<typeof mallState>) => {
    const newState = { ...mallState, ...updates };
    setMallState(newState);
    saveMallData(newState);
  };

  const handleGetDirections = (unit: Unit) => {
    // Determine the closest navigation node to the Kiosk's home position
    const kioskNode: NavNode = {
      id: 'KIOSK-START',
      floor: mallState.kioskConfig.homeFloor,
      x: mallState.kioskConfig.homeX,
      y: mallState.kioskConfig.homeY,
      type: 'corridor'
    };

    const path = findPath(kioskNode.id, unit.entryNodeId, [kioskNode, ...INITIAL_NODES], INITIAL_CONNECTIONS, 'shortest');
    if (path.length > 0) {
      setActivePath(path);
      setCurrentFloorID(path[0].floor);
    }
  };

  const executeSearch = async (q: string) => {
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

  if (!isDataReady) return null;

  return (
    <div className={`flex h-[100dvh] w-full overflow-hidden bg-[#fcfcfc] ${isArabic ? 'flex-row-reverse' : 'flex-row'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <Sidebar 
        isOpen={!isEditMode && !isDrawingMode}
        isArabic={isArabic}
        query={searchQuery}
        onSearch={executeSearch}
        onOpenKeyboard={() => setShowKeyboard(true)}
        selectedStore={selectedDestination}
        activePath={activePath}
        onReset={() => {
          setSelectedDestination(null);
          setSearchQuery('');
          setActivePath([]);
          setCurrentFloorID(mallState.kioskConfig.homeFloor);
        }}
        onToggleLang={() => setIsArabic(!isArabic)}
        onOpenAdmin={() => setShowAdmin(true)}
        categories={mallState.categories}
        units={mallState.units}
        onSelectStore={(u) => {
          setSelectedDestination(u);
          setCurrentFloorID(u.floor);
          setSearchQuery(isArabic ? u.nameAr : u.nameEn);
          setActivePath([]);
        }}
        routeMode="shortest"
        onSetRouteMode={() => {}}
        onOpenAI={() => setShowAI(true)}
        isOnline={true}
        isEmergency={mallState.isEmergency}
        onGetDirections={handleGetDirections}
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
            setSelectedDestination(u);
            setActivePath([]);
          }}
          isEditMode={isEditMode}
          isDrawingMode={isDrawingMode}
          onUpdateUnit={(u) => {
            const nextUnits = mallState.units.map(unit => unit.id === u.id ? u : unit);
            handleUpdateMallState({ units: nextUnits });
          }}
          isArabic={isArabic}
          mode={visMode}
        />
        
        {/* You Are Here Indicator (Kiosk Specific) */}
        {currentFloorID === mallState.kioskConfig.homeFloor && (
          <div 
            className="absolute z-40 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${mallState.kioskConfig.homeX}px`, 
              top: `${mallState.kioskConfig.homeY}px`,
              display: visMode === VisualizationMode.VIEW_2D ? 'block' : 'none' 
            }}
          >
            <div className="w-10 h-10 bg-blue-500 rounded-full border-4 border-white shadow-2xl animate-pulse" />
            <div className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full mt-2 uppercase text-center shadow-lg">YOU</div>
          </div>
        )}

        <div className={`absolute bottom-10 z-30 flex bg-[#111111] p-1.5 rounded-full shadow-2xl border border-white/10 ${isArabic ? 'left-32' : 'right-32'}`}>
           {Object.values(VisualizationMode).map(mode => (
             <button 
               key={mode} 
               onClick={() => setVisMode(mode)}
               className={`px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all ${visMode === mode ? 'bg-[#d4af37] text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
               {mode}
             </button>
           ))}
        </div>

        <FloorSelector currentFloor={currentFloorID} onFloorChange={setCurrentFloorID} isArabic={isArabic} pathFloors={activePath.map(n => n.floor)} />
      </main>

      {showAdmin && (
        <AdminDashboard 
          units={mallState.units} 
          kioskConfig={mallState.kioskConfig}
          onClose={() => setShowAdmin(false)} 
          isEmergency={mallState.isEmergency}
          onTriggerEmergency={() => handleUpdateMallState({ isEmergency: !mallState.isEmergency })}
          onEnterEditMode={() => { setShowAdmin(false); setIsEditMode(true); }}
          onEnterDrawingMode={() => { setShowAdmin(false); setIsDrawingMode(true); }}
          onUpdateUnit={(u) => {
             const nextUnits = mallState.units.map(unit => unit.id === u.id ? u : unit);
             handleUpdateMallState({ units: nextUnits });
          }}
          onUpdateKiosk={(config) => handleUpdateMallState({ kioskConfig: config })}
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
          }}
        />
      )}

      {(isEditMode || isDrawingMode) && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300]">
          <button 
            onClick={() => { setIsEditMode(false); setIsDrawingMode(false); setSelectedDestination(null); }} 
            className="bg-[#111111] text-white h-20 px-12 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] shadow-2xl active:scale-95 transition-all border border-[#d4af37]"
          >
            Commit Design
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
