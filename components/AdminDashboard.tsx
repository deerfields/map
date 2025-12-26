
import React, { useState, useMemo, useRef } from 'react';
import { Unit, FloorID, UnitType, Point, KioskDevice } from '../types';

interface AdminDashboardProps {
  units: Unit[];
  kioskConfig: KioskDevice;
  onClose: () => void;
  isEmergency: boolean;
  onTriggerEmergency: () => void;
  onEnterEditMode: () => void;
  onEnterDrawingMode: () => void;
  onUpdateUnit: (u: Unit) => void;
  onUpdateKiosk: (config: KioskDevice) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  units: initialUnits, kioskConfig, onClose, onTriggerEmergency, isEmergency, onEnterEditMode, onEnterDrawingMode, onUpdateUnit, onUpdateKiosk
}) => {
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [tab, setTab] = useState<'ops' | 'units' | 'device'>('units');
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '2025') setIsAuthenticated(true);
  };

  const editingUnit = useMemo(() => units.find(u => u.id === editingUnitId) || null, [editingUnitId, units]);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-[600] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl text-center border border-white/10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-xl">🛡️</div>
          <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter text-slate-900 leading-none">Deerfields Spatial</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              value={passcode} 
              onChange={e => setPasscode(e.target.value)} 
              placeholder="PIN: 2025" 
              className="w-full bg-slate-100 rounded-2xl p-6 text-center text-4xl font-mono outline-none border-4 border-transparent focus:border-amber-500 transition-all text-slate-900 shadow-inner" 
              autoFocus 
            />
            <button className="w-full h-20 bg-slate-900 text-white font-black rounded-3xl text-xl shadow-xl hover:bg-slate-800 transition-all">Unlock Assets</button>
          </form>
          <button onClick={onClose} className="w-full mt-6 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-slate-600">Exit Admin</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[600] flex flex-col animate-in slide-in-from-bottom-5 duration-300 overflow-hidden text-slate-900">
      <div className="p-10 border-b flex justify-between items-center bg-slate-50 shadow-sm relative z-10">
        <div className="flex items-center gap-12">
           <div className="flex flex-col">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">Property Inspector</h2>
              <p className="text-[10px] font-bold text-amber-600 tracking-widest uppercase mt-1">Design & Meta Synchronization</p>
           </div>
           <div className="flex bg-slate-200/50 p-1.5 rounded-2xl gap-2 border border-slate-200 shadow-inner">
              <button onClick={() => setTab('ops')} className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] transition-all ${tab === 'ops' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Operations</button>
              <button onClick={() => setTab('units')} className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] transition-all ${tab === 'units' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Design Canvas</button>
              <button onClick={() => setTab('device')} className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] transition-all ${tab === 'device' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Device Setup</button>
           </div>
        </div>
        <button onClick={onClose} className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black shadow-xl active:scale-90 transition-all">✕</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-12 bg-white">
        {tab === 'ops' ? (
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Safety Control</h3>
              <button onClick={onTriggerEmergency} className={`w-full p-16 rounded-[4rem] border-8 flex flex-col items-center gap-8 transition-all ${isEmergency ? 'bg-white border-red-600 text-red-600' : 'bg-red-600 border-red-900 text-white shadow-3xl'}`}>
                <span className="text-8xl">{isEmergency ? '✅' : '🚨'}</span>
                <p className="text-4xl font-black uppercase tracking-tighter">{isEmergency ? 'End Protocol' : 'Evacuate Mall'}</p>
              </button>
            </div>
          </div>
        ) : tab === 'device' ? (
           <div className="max-w-2xl space-y-12">
              <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Kiosk Calibration</h3>
              <div className="space-y-8 bg-slate-50 p-10 rounded-[3rem] border border-slate-200">
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Device Identifier</label>
                  <input 
                    type="text" 
                    value={kioskConfig.name}
                    onChange={(e) => onUpdateKiosk({ ...kioskConfig, name: e.target.value })}
                    className="bg-white border p-6 rounded-2xl font-bold text-2xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Home Floor</label>
                    <select 
                      value={kioskConfig.homeFloor}
                      onChange={(e) => onUpdateKiosk({ ...kioskConfig, homeFloor: e.target.value as FloorID })}
                      className="bg-white border p-6 rounded-2xl font-bold text-xl"
                    >
                      {Object.values(FloorID).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-4 text-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Check</label>
                    <div className="bg-white border p-6 rounded-2xl font-black text-slate-300">
                       {new Date(kioskConfig.lastMaintenance).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Home X Anchor</label>
                    <input 
                      type="number" 
                      value={kioskConfig.homeX}
                      onChange={(e) => onUpdateKiosk({ ...kioskConfig, homeX: Number(e.target.value) })}
                      className="bg-white border p-6 rounded-2xl font-bold text-xl"
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Home Y Anchor</label>
                    <input 
                      type="number" 
                      value={kioskConfig.homeY}
                      onChange={(e) => onUpdateKiosk({ ...kioskConfig, homeY: Number(e.target.value) })}
                      className="bg-white border p-6 rounded-2xl font-bold text-xl"
                    />
                  </div>
                </div>
              </div>
           </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20">
            <span className="text-9xl">🏛️</span>
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Deerfields Spatial Designer<br/>Select a property to inspect</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
