
import React, { useState, useEffect, useCallback } from 'react';
import { FloorID, Unit, NavNode, Connection, Floor, MallCategory, RouteMode, Point, VisualizationMode } from './types';
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
  const [floors] = useState<Floor[]>(INITIAL_FLOORS);
  const [nodes] = useState<NavNode[]>(INITIAL_NODES);
  const [connections] = useState<Connection[]>(INITIAL_CONNECTIONS);
  
  const [units, setUnits] = useState<Unit[]>([]);
  const [categories, setCategories] = useState<MallCategory[]>([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
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
    const savedData = loadMallData();
    setUnits(savedData.units);
    setCategories(savedData.categories);
    setIsDataReady(true);
  }, []);

  const handleUpdateUnit = useCallback((updatedUnit: Unit) => {
    setUnits(prev => {
      const next = prev.map(u => u.id === updatedUnit.id ? updatedUnit : u);
      saveMallData({ ...loadMallData(), units: next });
      return next;
    });
  }, []);

  const handleCompleteDrawing = (poly: Point[]) => {
    const newUnit: Unit = {
      id: `UNIT-${Date.now()}`,
      nameEn: 'Implemented Canvas Asset',
      nameAr: 'أصل جديد',
      type: 'store',
      category: 'cat-fashion',
      floor: currentFloorID,
      mallAddress: 'DESIGN-001',
      polygon: poly,
      status: 'coming_soon',
      tags: [],
      attributes: [],
      storeNumber: '00',
      openingTime: '10:00',
      closingTime: '22:00',
      entryNodeId: 'ML-NODE-ATRIUM',
      areaSqm: 0, 
      heightMeters: 4,
      volumeCum: 0
    };
    const nextUnits = [newUnit, ...units];
    setUnits(nextUnits);
    saveMallData({ ...loadMallData(), units: nextUnits });
    setSelectedDestination(newUnit);
    setIsDrawingMode(false);
    setIsEditMode(true);
    setShowAdmin(true); 
  };

  const handleGetDirections = (unit: Unit) => {
    // Defaulting starting point to the Grand Atrium for kiosk simulation
    const startNodeId = 'ML-NODE-ATRIUM';
    const path = findPath(startNodeId, unit.entryNodeId, nodes, connections, 'shortest');
    if (path.length > 0) {
      setActivePath(path);
      // Ensure we switch to the floor where the path starts
      setCurrentFloorID(path[0].floor);
    }
  };

  const executeSearch = async (q: string) => {
    const res = await searchMall(q, units);
    if (res.found) {
      const foundUnit = units.find(u => u.id === res.storeId);
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
        }}
        onToggleLang={() => setIsArabic(!isArabic)}
        onOpenAdmin={() => setShowAdmin(true)}
        categories={categories}
        units={units}
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
        isEmergency={isEmergency}
        onGetDirections={handleGetDirections}
      />

      <main className="flex-1 relative h-full">
        <MapViewer 
          floor={floors.find(f => f.id === currentFloorID)!} 
          units={units} 
          nodes={nodes} 
          activePath={activePath} 
          selectedUnit={selectedDestination} 
          userLocation={null} 
          onUnitClick={(u) => {
            setSelectedDestination(u);
            setActivePath([]);
          }}
          isEditMode={isEditMode}
          isDrawingMode={isDrawingMode}
          onUpdateUnit={handleUpdateUnit}
          onCompleteDrawing={handleCompleteDrawing}
          isArabic={isArabic}
          mode={visMode}
        />
        
        {/* Visualization Mode Switcher */}
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
          units={units} 
          onClose={() => setShowAdmin(false)} 
          isEmergency={isEmergency}
          onTriggerEmergency={() => setIsEmergency(!isEmergency)}
          onEnterEditMode={() => { setShowAdmin(false); setIsEditMode(true); }}
          onEnterDrawingMode={() => { setShowAdmin(false); setIsDrawingMode(true); }}
          onUpdateUnit={handleUpdateUnit}
        />
      )}

      {showAI && (
        <AIConcierge 
          isOpen={showAI} 
          onClose={() => setShowAI(false)} 
          units={units} 
          isArabic={isArabic} 
          onNavigate={(id) => { 
            const u = units.find(unit => unit.id === id);
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
          units={units}
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
