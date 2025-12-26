
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
          <h1 className="text-xl font-black uppercase tracking-tighter">Kiosk Deployment Panel <span className="text-amber-600 ml-2">PRO</span></h1>
          <nav className="flex gap-4">
            {['status', 'calibration', 'content', 'health'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-black text-white' : 'text-slate-400 hover:text-black'}`}
              >
                {tab === 'health' ? 'Network & Health' : tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { onEnterEditMode(); setIsMinimized(true); }} className="px-6 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-colors">
            Spatial Designer
          </button>
          <button onClick={onClose} className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-bold">✕</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-96 border-r flex flex-col bg-slate-50">
          <div className="p-8 border-b space-y-6 bg-white shadow-sm overflow-y-auto no-scrollbar">
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
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <p className="px-4 py-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">Existing Properties</p>
            {units.map(u => (
              <button key={u.id} onClick={() => setEditingUnitId(u.id)} className={`w-full p-6 rounded-2xl text-left transition-all border ${editingUnitId === u.id ? 'bg-white border-amber-500 shadow-md scale-[1.02]' : 'bg-transparent border-transparent hover:bg-white/50'}`}>
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{u.id}</p>
                  <p className="text-[10px] font-bold text-amber-600">{u.floor}</p>
                </div>
                <p className="text-lg font-black text-slate-900 truncate uppercase">{u.nameEn}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-12 overflow-y-auto bg-white">
          {activeTab === 'content' && editingUnit ? (
            <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-right-10 duration-500">
               <div className="flex justify-between items-end">
                 <div>
                   <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 mb-2">Property Profile</h2>
                   <p className="text-slate-500 font-medium">Synchronize physical store data with spatial coordinates.</p>
                 </div>
                 <div className="flex gap-4">
                   <button onClick={() => deleteUnit(editingUnit.id)} className="h-16 px-10 border-2 border-red-100 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-50 transition-all">Delete</button>
                   <button onClick={() => { onEnterEditMode(); setIsMinimized(true); }} className="h-16 px-10 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-500 transition-all flex items-center gap-4">
                     <span className="text-xl">📍</span> Adjust on Map
                   </button>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Property Name (EN)</label>
                    <input type="text" value={editingUnit.nameEn} onChange={e => onUpdateState({ units: units.map(u => u.id === editingUnit.id ? { ...u, nameEn: e.target.value } : u) })} className="w-full p-6 rounded-2xl border bg-slate-50 font-bold text-xl outline-none focus:ring-4 ring-amber-500/10" />
                  </div>
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Property Name (AR)</label>
                    <input type="text" dir="rtl" value={editingUnit.nameAr} onChange={e => onUpdateState({ units: units.map(u => u.id === editingUnit.id ? { ...u, nameAr: e.target.value } : u) })} className="w-full p-6 rounded-2xl border bg-slate-50 font-bold text-2xl outline-none focus:ring-4 ring-amber-500/10" />
                  </div>
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Global Category</label>
                    <select value={editingUnit.category} onChange={e => onUpdateState({ units: units.map(u => u.id === editingUnit.id ? { ...u, category: e.target.value } : u) })} className="w-full p-6 rounded-2xl border bg-slate-50 font-bold text-lg outline-none focus:ring-4 ring-amber-500/10 appearance-none">
                      {INITIAL_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.nameEn}</option>)}
                    </select>
                  </div>
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Operational Status</label>
                    <select value={editingUnit.status} onChange={e => onUpdateState({ units: units.map(u => u.id === editingUnit.id ? { ...u, status: e.target.value as any } : u) })} className="w-full p-6 rounded-2xl border bg-slate-50 font-bold text-lg outline-none focus:ring-4 ring-amber-500/10 appearance-none">
                      <option value="open">ACTIVE / OPEN</option>
                      <option value="closed">TEMPORARY CLOSED</option>
                      <option value="coming_soon">COMING SOON</option>
                      <option value="maintenance">MAINTENANCE</option>
                    </select>
                  </div>
               </div>
            </div>
          ) : activeTab === 'calibration' ? (
            <div className="max-w-3xl space-y-12">
              <header><h2 className="text-5xl font-black tracking-tighter uppercase mb-4 text-black">Spatial Calibration</h2><p className="text-slate-500 text-lg">Set the exact physical location of this kiosk hardware in the mall's coordinate system.</p></header>
              <div className="grid grid-cols-2 gap-12 bg-slate-50 p-12 rounded-[3rem] border border-slate-200">
                 <div className="space-y-6"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Assigned Floor</label><select value={kioskConfig.homeFloor} onChange={e => onUpdateKiosk({ ...kioskConfig, homeFloor: e.target.value as FloorID })} className="w-full p-6 rounded-2xl border bg-white font-bold text-xl appearance-none">{Object.values(FloorID).map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                 <div className="space-y-6"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Kiosk ID</label><input type="text" value={kioskConfig.name} onChange={e => onUpdateKiosk({ ...kioskConfig, name: e.target.value })} className="w-full p-6 rounded-2xl border bg-white font-bold text-xl" /></div>
                 <div className="space-y-6"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">X Coordinate</label><input type="number" value={kioskConfig.homeX} onChange={e => onUpdateKiosk({ ...kioskConfig, homeX: Number(e.target.value) })} className="w-full p-6 rounded-2xl border bg-white font-bold text-xl" /></div>
                 <div className="space-y-6"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Y Coordinate</label><input type="number" value={kioskConfig.homeY} onChange={e => onUpdateKiosk({ ...kioskConfig, homeY: Number(e.target.value) })} className="w-full p-6 rounded-2xl border bg-white font-bold text-xl" /></div>
              </div>
            </div>
          ) : activeTab === 'health' ? (
            <div className="max-w-5xl space-y-12 animate-in fade-in slide-in-from-right-10 duration-500">
               <header>
                 <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 mb-2">Fleet Monitoring</h2>
                 <p className="text-slate-500 font-medium">Real-time health and connectivity metrics for all deployed kiosk hardware.</p>
               </header>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {kiosksHealth.map(health => (
                   <div key={health.kioskId} className="bg-slate-50 rounded-[2.5rem] border border-slate-200 p-10 space-y-6 relative overflow-hidden group">
                     {health.status === 'online' && <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 m-8 rounded-full animate-pulse" />}
                     {health.status === 'warning' && <div className="absolute top-0 right-0 w-2 h-2 bg-amber-500 m-8 rounded-full animate-pulse" />}
                     {health.status === 'offline' && <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 m-8 rounded-full" />}
                     
                     <div className="flex justify-between items-start">
                       <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{health.kioskId}</p>
                         <h3 className="text-2xl font-black uppercase text-slate-900">{health.kioskId === kioskConfig.id ? 'LOCAL KIOSK (This Device)' : 'REMOTE KIOSK'}</h3>
                       </div>
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${health.status === 'online' ? 'bg-emerald-100 text-emerald-700' : health.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                         {health.status}
                       </span>
                     </div>

                     <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">CPU LOAD</p>
                          <p className="text-xl font-black text-slate-900">{health.cpuLoad}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">MEM USAGE</p>
                          <p className="text-xl font-black text-slate-900">{health.memoryUsage}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">LATENCY</p>
                          <p className="text-xl font-black text-slate-900">{health.networkLatency}ms</p>
                        </div>
                     </div>

                     <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">UPTIME</p>
                       <p className="text-xl font-black text-slate-900">{formatUptime(health.uptimeSeconds)}</p>
                     </div>

                     {health.issues.length > 0 && (
                       <div className="pt-6 border-t border-slate-200">
                          <p className="text-[9px] font-black uppercase text-red-500 tracking-widest mb-2">ACTIVE ISSUES</p>
                          <ul className="space-y-1">
                            {health.issues.map((issue, idx) => (
                              <li key={idx} className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {issue}
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
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20">
              <span className="text-9xl">🏛️</span>
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Deerfields Spatial Designer<br/>Select a property or calibrator</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
