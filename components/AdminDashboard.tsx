
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
  units, kioskConfig, kiosksHealth, onClose, onTriggerEmergency, isEmergency, onEnterEditMode, onUpdateKiosk, onUpdateState, onAddUnit
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'status' | 'calibration' | 'content' | 'health'>('content');
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unitSearchTerm, setUnitSearchTerm] = useState('');

  const [draftUnit, setDraftUnit] = useState<Partial<Unit>>({
    nameEn: 'New Concept Store',
    nameAr: 'متجر جديد',
    type: 'store',
    category: 'cat-fashion',
    floor: FloorID.ML,
    status: 'open'
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

  const editingUnit = useMemo(() => units.find(u => u.id === editingUnitId) || null, [editingUnitId, units]);

  const handleDragStart = (e: React.DragEvent) => {
    const payload = { type: 'new-store', unit: draftUnit };
    e.dataTransfer.setData('application/mall-unit', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
  };

  const deleteUnit = (id: string) => {
    if (confirm('Are you sure you want to delete this property? This cannot be undone.')) {
      onUpdateState({ units: units.filter(u => u.id !== id) });
      setEditingUnitId(null);
    }
  };

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
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
      <div className="fixed top-12 right-12 z-[900] w-96 flex flex-col gap-6 animate-in slide-in-from-right-10 duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border p-8 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest">Spatial Toolbox</h3>
            <button onClick={() => setIsMinimized(false)} className="text-[10px] font-black uppercase text-amber-600">Full Panel</button>
          </div>
          <div className="space-y-4">
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black uppercase text-slate-400 mb-2">Draft: {draftUnit.nameEn}</p>
                <div draggable onDragStart={handleDragStart} className="h-24 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:bg-amber-50 hover:border-amber-300 transition-all group">
                  <span className="text-3xl mb-1 group-hover:scale-125 transition-transform">
                    {UNIT_TYPES.find(t => t.value === draftUnit.type)?.icon || '🏪'}
                  </span>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-amber-600">Drop on Map</p>
                </div>
             </div>
          </div>
          {editingUnit && (
            <div className="p-6 bg-slate-900 rounded-2xl text-white">
               <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Editing Position</p>
               <p className="text-sm font-black uppercase truncate">{editingUnit.nameEn}</p>
               <div className="flex gap-2 mt-4">
                 <button onClick={() => setEditingUnitId(null)} className="flex-1 py-2 bg-white/10 rounded-lg text-[9px] font-black uppercase">Deselect</button>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[900] flex flex-col animate-in slide-in-from-bottom-10 duration-500">
      <div className="h-24 border-b px-12 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-12">
          <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900">Kiosk Deployment Panel <span className="text-amber-600 ml-2">PRO</span></h1>
          <nav className="flex gap-4">
            {['status', 'calibration', 'content', 'health'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-black hover:bg-slate-100'}`}
              >
                {tab === 'health' ? 'Network & Health' : tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { onEnterEditMode(); setIsMinimized(true); }} className="px-6 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg active:scale-95">
            Spatial Designer
          </button>
          <button onClick={onClose} className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-bold hover:bg-slate-800 transition-colors">✕</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-96 border-r flex flex-col bg-slate-50">
          <div className="p-8 border-b space-y-6 bg-white shadow-sm shrink-0">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Property Config</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Store Name (EN)</label>
                <input type="text" placeholder="e.g. Apple Store" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 ring-amber-500/20" value={draftUnit.nameEn} onChange={e => setDraftUnit({...draftUnit, nameEn: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Store Name (AR)</label>
                <input type="text" dir="rtl" placeholder="مثال: متجر آبل" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 font-bold text-lg outline-none focus:ring-2 ring-amber-500/20" value={draftUnit.nameAr} onChange={e => setDraftUnit({...draftUnit, nameAr: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Floor</label>
                  <select className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs outline-none" value={draftUnit.floor} onChange={e => setDraftUnit({...draftUnit, floor: e.target.value as FloorID})}>
                    {Object.values(FloorID).map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Unit Type</label>
                  <select className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs outline-none" value={draftUnit.type} onChange={e => setDraftUnit({...draftUnit, type: e.target.value as UnitType})}>
                    {UNIT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div draggable onDragStart={handleDragStart} className="w-full h-28 bg-[#0a0a0a] text-white border-4 border-[#d4af37]/20 rounded-[2.5rem] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-2xl hover:scale-[1.02] transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              <span className="text-3xl mb-1 group-hover:scale-125 group-hover:rotate-12 transition-transform">
                {UNIT_TYPES.find(t => t.value === draftUnit.type)?.icon || '🏪'}
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af37]">Drag onto Map</p>
            </div>
          </div>
          
          <div className="px-6 py-5 bg-white border-b sticky top-0 z-10 shadow-sm">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search by name, ID or address..." 
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-100 border-2 border-transparent focus:bg-white focus:border-amber-500/20 font-bold text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400"
                value={unitSearchTerm}
                onChange={e => setUnitSearchTerm(e.target.value)}
              />
              {unitSearchTerm && (
                <button 
                  onClick={() => setUnitSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
            <div className="px-4 py-3 flex justify-between items-center bg-white/40 rounded-xl mb-4 border border-slate-200/50">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Property Directory</span>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[10px] font-black">{filteredUnits.length} Total</span>
            </div>
            {filteredUnits.length > 0 ? filteredUnits.map(u => (
              <button key={u.id} onClick={() => setEditingUnitId(u.id)} className={`w-full p-6 rounded-[2rem] text-left transition-all border group ${editingUnitId === u.id ? 'bg-white border-amber-500 shadow-xl scale-[1.02] ring-4 ring-amber-500/5' : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200 hover:shadow-lg'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-amber-600/60 transition-colors">{u.id}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${editingUnitId === u.id ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-600'}`}>{u.floor}</span>
                </div>
                <p className="text-xl font-black text-slate-900 truncate uppercase tracking-tighter">{u.nameEn}</p>
                <p className="text-xs font-bold text-slate-400 truncate opacity-60 mt-1" dir="rtl">{u.nameAr}</p>
                <div className="flex gap-2 mt-3 items-center">
                   <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{u.mallAddress}</span>
                </div>
              </button>
            )) : (
              <div className="p-16 text-center">
                <div className="text-5xl mb-6 opacity-20">🔎</div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">No properties found matching your search</p>
                <button onClick={() => setUnitSearchTerm('')} className="mt-4 text-[10px] font-black text-amber-600 uppercase tracking-widest underline decoration-2 underline-offset-4">Reset Filter</button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-12 overflow-y-auto bg-white no-scrollbar">
          {activeTab === 'content' && editingUnit ? (
            <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-right-10 duration-500 pb-24">
               <div className="flex justify-between items-end border-b pb-12">
                 <div>
                   <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 mb-4">Property Profile</h2>
                   <p className="text-slate-500 font-medium text-lg">Synchronize physical store data with spatial coordinates for <span className="text-amber-600 font-black">{editingUnit.id}</span>.</p>
                 </div>
                 <div className="flex gap-4">
                   <button onClick={() => deleteUnit(editingUnit.id)} className="h-20 px-10 border-2 border-red-100 text-red-500 rounded-3xl font-black uppercase tracking-widest text-[11px] hover:bg-red-50 transition-all active:scale-95">Delete Property</button>
                   <button onClick={() => { onEnterEditMode(); setIsMinimized(true); }} className="h-20 px-10 bg-black text-white rounded-3xl font-black uppercase tracking-widest text-[11px] hover:bg-amber-500 transition-all flex items-center gap-4 shadow-xl active:scale-95">
                     <span className="text-2xl">📍</span> Adjust Position
                   </button>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-12 pt-4">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block ml-2">Property Name (EN)</label>
                    <input type="text" value={editingUnit.nameEn} onChange={e => onUpdateState({ units: units.map(u => u.id === editingUnit.id ? { ...u, nameEn: e.target.value } : u) })} className="w-full p-8 rounded-3xl border bg-slate-50 font-black text-2xl text-slate-900 outline-none focus:ring-4 ring-amber-500/10 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block ml-2">Property Name (AR)</label>
                    <input type="text" dir="rtl" value={editingUnit.nameAr} onChange={e => onUpdateState({ units: units.map(u => u.id === editingUnit.id ? { ...u, nameAr: e.target.value } : u) })} className="w-full p-8 rounded-3xl border bg-slate-50 font-black text-3xl text-slate-900 outline-none focus:ring-4 ring-amber-500/10 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block ml-2">Global Category</label>
                    <div className="relative">
                      <select value={editingUnit.category} onChange={e => onUpdateState({ units: units.map(u => u.id === editingUnit.id ? { ...u, category: e.target.value } : u) })} className="w-full p-8 rounded-3xl border bg-slate-50 font-black text-xl text-slate-900 outline-none focus:ring-4 ring-amber-500/10 focus:bg-white transition-all appearance-none">
                        {INITIAL_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.nameEn}</option>)}
                      </select>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block ml-2">Operational Status</label>
                    <div className="relative">
                      <select value={editingUnit.status} onChange={e => onUpdateState({ units: units.map(u => u.id === editingUnit.id ? { ...u, status: e.target.value as any } : u) })} className="w-full p-8 rounded-3xl border bg-slate-50 font-black text-xl text-slate-900 outline-none focus:ring-4 ring-amber-500/10 focus:bg-white transition-all appearance-none">
                        <option value="open">🟢 ACTIVE / OPEN</option>
                        <option value="closed">🔴 TEMPORARY CLOSED</option>
                        <option value="coming_soon">🟡 COMING SOON</option>
                        <option value="maintenance">🟠 MAINTENANCE</option>
                      </select>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round"/></svg>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          ) : activeTab === 'calibration' ? (
            <div className="max-w-3xl space-y-12 animate-in fade-in slide-in-from-right-10 duration-500">
              <header className="border-b pb-12"><h2 className="text-6xl font-black tracking-tighter uppercase mb-6 text-black">Spatial Calibration</h2><p className="text-slate-500 text-xl font-medium">Calibrate the exact physical position of this kiosk hardware in the mall's coordinate system.</p></header>
              <div className="grid grid-cols-2 gap-12 bg-slate-50 p-16 rounded-[4rem] border border-slate-200 shadow-inner">
                 <div className="space-y-4"><label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block ml-2">Assigned Floor</label><select value={kioskConfig.homeFloor} onChange={e => onUpdateKiosk({ ...kioskConfig, homeFloor: e.target.value as FloorID })} className="w-full p-8 rounded-3xl border bg-white font-black text-2xl outline-none focus:ring-4 ring-amber-500/10 appearance-none shadow-sm">{Object.values(FloorID).map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                 <div className="space-y-4"><label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block ml-2">Hardware ID</label><input type="text" value={kioskConfig.name} onChange={e => onUpdateKiosk({ ...kioskConfig, name: e.target.value })} className="w-full p-8 rounded-3xl border bg-white font-black text-2xl outline-none focus:ring-4 ring-amber-500/10 shadow-sm" /></div>
                 <div className="space-y-4"><label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block ml-2">X Coordinate (Nodes)</label><input type="number" value={kioskConfig.homeX} onChange={e => onUpdateKiosk({ ...kioskConfig, homeX: Number(e.target.value) })} className="w-full p-8 rounded-3xl border bg-white font-black text-2xl outline-none focus:ring-4 ring-amber-500/10 shadow-sm" /></div>
                 <div className="space-y-4"><label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block ml-2">Y Coordinate (Nodes)</label><input type="number" value={kioskConfig.homeY} onChange={e => onUpdateKiosk({ ...kioskConfig, homeY: Number(e.target.value) })} className="w-full p-8 rounded-3xl border bg-white font-black text-2xl outline-none focus:ring-4 ring-amber-500/10 shadow-sm" /></div>
              </div>
              <div className="p-10 bg-amber-50 rounded-3xl border border-amber-200 flex gap-8 items-center">
                 <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center text-white text-4xl shadow-lg">⚠️</div>
                 <div>
                   <h4 className="text-xl font-black text-amber-900 uppercase">Warning: Spatial Anchor Adjustment</h4>
                   <p className="text-amber-700/80 font-medium">Changing these values shifts the "You Are Here" marker globally. Ensure the hardware is physically located at these coordinates before confirming.</p>
                 </div>
              </div>
            </div>
          ) : activeTab === 'health' ? (
            <div className="max-w-5xl space-y-12 animate-in fade-in slide-in-from-right-10 duration-500 pb-24">
               <header className="border-b pb-12">
                 <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 mb-4">Fleet Intelligence</h2>
                 <p className="text-slate-500 font-medium text-xl">Real-time health, thermal, and connectivity metrics for all kiosk assets in the network.</p>
               </header>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {kiosksHealth.map(health => (
                   <div key={health.kioskId} className="bg-slate-50 rounded-[3.5rem] border border-slate-200 p-12 space-y-8 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all">
                     <div className={`absolute top-0 right-0 w-2 h-2 m-10 rounded-full animate-pulse ${health.status === 'online' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : health.status === 'warning' ? 'bg-amber-500 shadow-[0_0_15px_#f59e0b]' : 'bg-red-500'}`} />
                     
                     <div className="flex justify-between items-start">
                       <div className="space-y-1">
                         <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{health.kioskId}</p>
                         <h3 className="text-3xl font-black uppercase text-slate-900 tracking-tighter">{health.kioskId === kioskConfig.id ? 'LOCAL SYSTEM NODE' : 'REMOTE FLEET ASSET'}</h3>
                       </div>
                       <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${health.status === 'online' ? 'bg-emerald-100 text-emerald-700' : health.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                         {health.status}
                       </span>
                     </div>

                     <div className="grid grid-cols-3 gap-10 pt-4">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Compute</p>
                          <p className="text-3xl font-black text-slate-900">{health.cpuLoad}%</p>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${health.cpuLoad > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${health.cpuLoad}%` }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Memory</p>
                          <p className="text-3xl font-black text-slate-900">{health.memoryUsage}%</p>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 bg-blue-500`} style={{ width: `${health.memoryUsage}%` }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Latency</p>
                          <p className="text-3xl font-black text-slate-900">{health.networkLatency}ms</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Jitter 2ms</p>
                        </div>
                     </div>

                     <div className="flex justify-between items-center pt-8 border-t border-slate-200">
                       <div className="space-y-1">
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Asset Uptime</p>
                         <p className="text-2xl font-black text-slate-900">{formatUptime(health.uptimeSeconds)}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Last Heartbeat</p>
                         <p className="text-sm font-bold text-slate-600">Active Now</p>
                       </div>
                     </div>

                     {health.issues.length > 0 && (
                       <div className="p-8 bg-red-50 rounded-[2rem] border border-red-100 animate-in slide-in-from-top-4">
                          <p className="text-[11px] font-black uppercase text-red-500 tracking-[0.2em] mb-4">CRITICAL SYSTEM EXCEPTIONS</p>
                          <ul className="space-y-2">
                            {health.issues.map((issue, idx) => (
                              <li key={idx} className="text-sm font-black text-red-900 flex items-center gap-4">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> {issue}
                              </li>
                            ))}
                          </ul>
                       </div>
                     )}
                   </div>
                 ))}
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
