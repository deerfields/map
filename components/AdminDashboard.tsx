
import React, { useState, useMemo } from 'react';
import { Unit, FloorID, KioskDevice, MallState, Point, UnitType, KioskHealth } from '../types';
import { INITIAL_CATEGORIES } from '../constants';

interface AdminDashboardProps {
  units: Unit[];
  kioskConfig: KioskDevice;
  kiosksHealth: KioskHealth[];
  onClose: () => void;
  isEmergency: boolean;
  onTriggerEmergency: () => void;
  onEnterEditMode: () => void;
  onUpdateKiosk: (config: KioskDevice) => void;
  onUpdateState: (state: Partial<MallState>) => void;
  onAddUnit: (u: Unit) => void;
  selectedUnit?: Unit | null;
  onSelectUnit?: (u: Unit | null) => void;
}

const UNIT_TYPES: { value: UnitType; label: string; icon: string }[] = [
  { value: 'store', label: 'Retail Store', icon: '🛍️' },
  { value: 'restaurant', label: 'Restaurant', icon: '🍴' },
  { value: 'coffee', label: 'Café', icon: '☕' },
  { value: 'kiosk', label: 'Kiosk', icon: '🏪' },
  { value: 'pop_up', label: 'Pop-up Shop', icon: '✨' },
  { value: 'atm', label: 'ATM', icon: '💳' },
  { value: 'info', label: 'Information', icon: 'ℹ️' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  units, kioskConfig, kiosksHealth, onClose, onTriggerEmergency, isEmergency, onEnterEditMode, onUpdateKiosk, onUpdateState, onAddUnit, selectedUnit, onSelectUnit
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'status' | 'calibration' | 'content' | 'health'>('content');
  const [isMinimized, setIsMinimized] = useState(false);
  const [unitSearchTerm, setUnitSearchTerm] = useState('');
  const [drawMode, setDrawMode] = useState<'select' | 'polygon'>('select');

  const [draftUnit, setDraftUnit] = useState<Partial<Unit>>({
    nameEn: 'New Concept Store',
    nameAr: 'متجر جديد',
    type: 'store',
    category: 'cat-fashion',
    floor: FloorID.ML,
    status: 'open',
    tags: [],
    attributes: []
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '2025') setIsAuthenticated(true);
  };

  const filteredUnits = useMemo(() => {
    const term = unitSearchTerm.toLowerCase().trim();
    if (!term) return units;
    return units.filter(u => 
      u.nameEn.toLowerCase().includes(term) || 
      u.nameAr.toLowerCase().includes(term) ||
      u.id.toLowerCase().includes(term) ||
      u.mallAddress.toLowerCase().includes(term)
    );
  }, [units, unitSearchTerm]);

  const deleteUnit = (id: string) => {
    if (confirm('Are you sure you want to delete this property? This cannot be undone.')) {
      onUpdateState({ units: units.filter(u => u.id !== id) });
      if (onSelectUnit) onSelectUnit(null);
    }
  };

  const handleDuplicate = (u: Unit) => {
    const newId = `${u.id}-COPY-${Date.now()}`;
    const newUnit: Unit = { ...u, id: newId, nameEn: `${u.nameEn} (Copy)` };
    onAddUnit(newUnit);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-3xl z-[900] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[3rem] p-12 text-center shadow-2xl">
          <div className="w-20 h-20 bg-black rounded-3xl mx-auto mb-8 flex items-center justify-center text-white text-3xl">🔐</div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-black mb-8">Spatial Access</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              value={passcode} 
              onChange={e => setPasscode(e.target.value)}
              placeholder="System PIN"
              className="w-full h-20 bg-slate-100 rounded-2xl text-center text-4xl font-mono focus:ring-4 ring-amber-500/20 outline-none transition-all"
              autoFocus
            />
            <button className="w-full h-20 bg-black text-white rounded-3xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all">Authorize Device</button>
          </form>
          <button onClick={onClose} className="mt-8 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Return to Concierge</button>
        </div>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed top-12 right-12 z-[900] w-[400px] flex flex-col gap-6 animate-in slide-in-from-right-10 duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border p-8 flex flex-col gap-8">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs">🛠️</div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Spatial Toolbox</h3>
             </div>
             <button onClick={() => setIsMinimized(false)} className="text-[10px] font-black uppercase text-amber-600 px-4 py-2 bg-amber-50 rounded-full hover:bg-amber-100 transition-colors">Full Panel</button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setDrawMode('select')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${drawMode === 'select' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                <span className="text-xl">↖️</span>
                <span className="text-[9px] font-black uppercase">Select/Edit</span>
              </button>
              <button 
                onClick={() => setDrawMode('polygon')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${drawMode === 'polygon' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                <span className="text-xl">🖋️</span>
                <span className="text-[9px] font-black uppercase">Draw Polygon</span>
              </button>
            </div>
            
            {drawMode === 'polygon' && (
              <div className="p-4 bg-amber-500 text-white rounded-2xl text-center">
                <p className="text-[10px] font-black uppercase tracking-widest">Drawing Active</p>
                <p className="text-[8px] opacity-80 uppercase mt-1">Double click map to close shape</p>
              </div>
            )}
          </div>

          {selectedUnit ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">🏷️</div>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Selected Property</p>
                <p className="text-lg font-black uppercase truncate tracking-tight">{selectedUnit.nameEn}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleDuplicate(selectedUnit)} className="flex-1 py-3 bg-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/20">Duplicate</button>
                  <button onClick={() => deleteUnit(selectedUnit.id)} className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-xl text-[9px] font-black uppercase hover:bg-red-500/30">Delete</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-50 p-4 rounded-2xl border text-center">
                    <p className="text-[8px] font-black uppercase text-slate-400">Nodes</p>
                    <p className="text-sm font-black text-slate-900">{selectedUnit.polygon.length}</p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border text-center">
                    <p className="text-[8px] font-black uppercase text-slate-400">Floor</p>
                    <p className="text-sm font-black text-slate-900">{selectedUnit.floor}</p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="py-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300">
               <span className="text-4xl mb-4">🖱️</span>
               <p className="text-[10px] font-black uppercase tracking-widest">Select a shop to edit</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[900] flex flex-col animate-in slide-in-from-bottom-10 duration-500">
      <div className="h-24 border-b px-12 flex items-center justify-between bg-white shadow-sm shrink-0">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white text-xl">🏛️</div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900">Deerfields Spatial <span className="text-amber-600">Pro</span></h1>
          </div>
          <nav className="flex gap-2">
            {['status', 'calibration', 'content', 'health'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-black hover:bg-slate-100'}`}
              >
                {tab === 'health' ? 'Network & Fleet' : tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { onEnterEditMode(); setIsMinimized(true); }} 
            className="group px-8 py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl active:scale-95 flex items-center gap-3"
          >
            <span>Launch Spatial Designer</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="3" strokeLinecap="round"/></svg>
          </button>
          <button onClick={onClose} className="w-12 h-12 border-2 border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center font-bold hover:bg-red-50 hover:text-red-500 transition-all">✕</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[450px] border-r flex flex-col bg-slate-50">
          {/* Quick Search */}
          <div className="px-8 py-6 bg-white border-b shrink-0">
             <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</div>
                <input 
                  type="text" 
                  placeholder="Filter directory..." 
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 rounded-2xl border-2 border-transparent focus:border-amber-500/20 focus:bg-white outline-none transition-all font-bold text-sm"
                  value={unitSearchTerm}
                  onChange={e => setUnitSearchTerm(e.target.value)}
                />
             </div>
          </div>

          {/* Unit List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
            {filteredUnits.map(u => (
              <button 
                key={u.id} 
                onClick={() => onSelectUnit?.(u)} 
                className={`w-full p-6 rounded-[2.5rem] text-left transition-all border-2 group relative overflow-hidden ${selectedUnit?.id === u.id ? 'bg-white border-amber-500 shadow-xl' : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">{u.id}</span>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${selectedUnit?.id === u.id ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{u.floor}</span>
                </div>
                <p className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">{u.nameEn}</p>
                <p className="text-xs font-bold text-slate-400 mt-2 opacity-60" dir="rtl">{u.nameAr}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-16 overflow-y-auto bg-white no-scrollbar">
           {selectedUnit && activeTab === 'content' ? (
             <div className="max-w-4xl space-y-16 animate-in fade-in slide-in-from-right-8">
               <div className="flex justify-between items-end border-b pb-12">
                 <div>
                   <h2 className="text-6xl font-black uppercase tracking-tighter text-slate-900 mb-2">Property Inspector</h2>
                   <p className="text-slate-400 text-xl font-medium">Synchronize physical store data with spatial coordinates.</p>
                 </div>
                 <div className="flex gap-4">
                   <button onClick={() => handleDuplicate(selectedUnit)} className="h-16 px-8 border-2 border-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">Duplicate</button>
                   <button onClick={() => deleteUnit(selectedUnit.id)} className="h-16 px-8 border-2 border-red-50 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-50 transition-all">Delete</button>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest block ml-2">Name (English)</label>
                    <input type="text" value={selectedUnit.nameEn} onChange={e => onUpdateState({ units: units.map(u => u.id === selectedUnit.id ? { ...u, nameEn: e.target.value } : u) })} className="w-full p-8 bg-slate-50 rounded-3xl border focus:bg-white focus:ring-4 ring-amber-500/10 outline-none transition-all text-2xl font-black text-slate-900" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest block ml-2">Name (Arabic)</label>
                    <input type="text" dir="rtl" value={selectedUnit.nameAr} onChange={e => onUpdateState({ units: units.map(u => u.id === selectedUnit.id ? { ...u, nameAr: e.target.value } : u) })} className="w-full p-8 bg-slate-50 rounded-3xl border focus:bg-white focus:ring-4 ring-amber-500/10 outline-none transition-all text-3xl font-black text-slate-900" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest block ml-2">Global Category</label>
                    <select value={selectedUnit.category} onChange={e => onUpdateState({ units: units.map(u => u.id === selectedUnit.id ? { ...u, category: e.target.value } : u) })} className="w-full p-8 bg-slate-50 rounded-3xl border font-black text-xl appearance-none outline-none focus:ring-4 ring-amber-500/10 transition-all">
                      {INITIAL_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.nameEn}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest block ml-2">Unit Type</label>
                    <select value={selectedUnit.type} onChange={e => onUpdateState({ units: units.map(u => u.id === selectedUnit.id ? { ...u, type: e.target.value as UnitType } : u) })} className="w-full p-8 bg-slate-50 rounded-3xl border font-black text-xl appearance-none outline-none focus:ring-4 ring-amber-500/10 transition-all">
                      {UNIT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2 space-y-4">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest block ml-2">Brand Tagline (English)</label>
                    <textarea value={selectedUnit.taglineEn || ''} onChange={e => onUpdateState({ units: units.map(u => u.id === selectedUnit.id ? { ...u, taglineEn: e.target.value } : u) })} className="w-full p-8 bg-slate-50 rounded-3xl border focus:bg-white outline-none transition-all h-32 font-medium italic text-slate-600" />
                  </div>
               </div>
               
               <div className="pt-12 border-t">
                  <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] mb-8">Spatial Coordinates (Nodes)</h3>
                  <div className="bg-slate-50 p-8 rounded-[3rem] border shadow-inner">
                    <div className="grid grid-cols-4 gap-4">
                      {selectedUnit.polygon.map((p, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-2xl border shadow-sm">
                           <p className="text-[8px] font-black uppercase text-slate-300 mb-1">Node {idx + 1}</p>
                           <p className="text-sm font-mono font-bold text-amber-600">{Math.round(p[0])}, {Math.round(p[1])}</p>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in duration-1000">
               <div className="relative">
                 <div className="absolute inset-0 bg-amber-500/10 blur-[120px] rounded-full scale-150" />
                 <span className="text-9xl relative z-10 block animate-bounce duration-[3000ms]">🏛️</span>
               </div>
               <div className="space-y-4 relative z-10">
                 <h2 className="text-6xl font-black uppercase tracking-tighter text-slate-900 leading-none">Deerfields Spatial Designer</h2>
                 <p className="text-slate-400 text-xl font-medium tracking-wide">Select a property from the directory to begin editing or calibrate local kiosk hardware.</p>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
