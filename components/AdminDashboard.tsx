
import React, { useState, useMemo, useRef } from 'react';
import { Unit, FloorID, UnitType, Point } from '../types';
import { saveMallData, loadMallData } from '../services/storageService';

interface AdminDashboardProps {
  units: Unit[];
  onClose: () => void;
  isEmergency: boolean;
  onTriggerEmergency: () => void;
  onEnterEditMode: () => void;
  onEnterDrawingMode: () => void;
  onUpdateUnit: (u: Unit) => void;
}

const UNIT_TYPES: { value: UnitType; label: string; icon: string }[] = [
  { value: 'store', label: 'Retail Store', icon: '🛍️' },
  { value: 'coffee', label: 'Cafe / Coffee', icon: '☕' },
  { value: 'restaurant', label: 'Dining', icon: '🍴' },
  { value: 'parking', label: 'Parking Area', icon: '🚗' },
  { value: 'elevator', label: 'Elevator', icon: '🛗' },
  { value: 'escalator', label: 'Escalator', icon: '🪜' },
  { value: 'atm', label: 'ATM', icon: '🏧' },
  { value: 'restroom_men', label: 'Men Restroom', icon: '🚻' },
  { value: 'restroom_women', label: 'Women Restroom', icon: '🚺' },
  { value: 'kiosk', label: 'Kiosk', icon: '📍' },
  { value: 'pop_up', label: 'Pop-up Shop', icon: '✨' },
  { value: 'emergency_exit', label: 'Emergency Exit', icon: '🚨' },
  { value: 'walkway', label: 'Walkway/Atrium', icon: '🚶' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  units: initialUnits, onClose, onTriggerEmergency, isEmergency, onEnterEditMode, onEnterDrawingMode, onUpdateUnit
}) => {
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [tab, setTab] = useState<'ops' | 'units'>('units');
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '2025') setIsAuthenticated(true);
  };

  const editingUnit = useMemo(() => units.find(u => u.id === editingUnitId) || null, [editingUnitId, units]);

  const handleAddNewUnit = () => {
    const newId = `UNIT-${Date.now()}`;
    const newUnit: Unit = {
      id: newId,
      nameEn: 'New Canvas Property',
      nameAr: 'موقع متجر جديد',
      type: 'store',
      category: 'cat-fashion',
      floor: FloorID.ML,
      mallAddress: 'UNIT-000',
      polygon: [[1500, 700], [1700, 700], [1700, 900], [1500, 900]],
      width: 200,
      height: 200,
      heightMeters: 4,
      areaSqm: 40,
      volumeCum: 160,
      entryNodeId: 'ML-NODE-ATRIUM',
      status: 'coming_soon',
      tags: [],
      attributes: [],
      storeNumber: '00',
      openingTime: '10:00',
      closingTime: '22:00',
      conversionCount: 0
    };
    const updatedUnits = [newUnit, ...units];
    setUnits(updatedUnits);
    saveMallData({ ...loadMallData(), units: updatedUnits });
    setEditingUnitId(newId);
  };

  const updateUnitDetails = (unitId: string, field: string, value: any) => {
    const updatedUnits = units.map(u => u.id === unitId ? { ...u, [field]: value } : u);
    setUnits(updatedUnits);
    const updated = updatedUnits.find(u => u.id === unitId)!;
    
    // Auto-update volume if area or heightMeters changes
    if (field === 'areaSqm' || field === 'heightMeters') {
      const h = field === 'heightMeters' ? value : (updated.heightMeters || 4);
      const a = field === 'areaSqm' ? value : (updated.areaSqm || 0);
      updated.volumeCum = Math.round(a * h);
    }
    
    onUpdateUnit(updated);
    saveMallData({ ...loadMallData(), units: updatedUnits });
  };

  const optimizeAndSetLogo = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300; // Optimal size for high-end web icons
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to PNG to preserve transparency
          const optimizedBase64 = canvas.toDataURL('image/png', 0.8);
          if (editingUnitId) {
            updateUnitDetails(editingUnitId, 'logoUrl', optimizedBase64);
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) optimizeAndSetLogo(file);
  };

  const handleAnchorMove = (unitId: string, newX: number, newY: number) => {
    const unit = units.find(u => u.id === unitId);
    if (!unit) return;

    const minX = Math.min(...unit.polygon.map(p => p[0]));
    const minY = Math.min(...unit.polygon.map(p => p[1]));
    const maxX = Math.max(...unit.polygon.map(p => p[0]));
    const maxY = Math.max(...unit.polygon.map(p => p[1]));
    const curX = (minX + maxX) / 2;
    const curY = (minY + maxY) / 2;

    const dx = newX - curX;
    const dy = newY - curY;

    const newPolygon = unit.polygon.map(p => [p[0] + dx, p[1] + dy] as Point);
    updateUnitDetails(unitId, 'polygon', newPolygon);
  };

  const deleteUnit = (unitId: string) => {
    if (!window.confirm("Delete this property asset?")) return;
    const updatedUnits = units.filter(u => u.id !== unitId);
    setUnits(updatedUnits);
    saveMallData({ ...loadMallData(), units: updatedUnits });
    if (editingUnitId === unitId) setEditingUnitId(null);
  };

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
           </div>
        </div>
        <button onClick={onClose} className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black shadow-xl active:scale-90 transition-all">✕</button>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {tab === 'units' && (
          <div className="w-96 border-r flex flex-col bg-slate-50/50">
            <div className="p-6 border-b flex flex-col gap-3">
              <button onClick={onEnterDrawingMode} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3">
                <span className="text-xl">🖌️</span> Design Canvas Mode
              </button>
              <button onClick={handleAddNewUnit} className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-slate-800 transition-all">
                + Add Manual Property
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
              {units.map(unit => (
                <div 
                  key={unit.id} 
                  onClick={() => setEditingUnitId(unit.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer group ${editingUnitId === unit.id ? 'bg-white border-amber-500 shadow-xl' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black uppercase text-slate-400">{unit.type} • {unit.floor}</span>
                    <button onClick={(e) => { e.stopPropagation(); deleteUnit(unit.id); }} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600">✕</button>
                  </div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tight truncate">{unit.nameEn}</h4>
                  <p className="text-[10px] text-slate-500 font-bold">{unit.mallAddress}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
          ) : editingUnit ? (
            <div className="max-w-5xl space-y-12 pb-24">
              <div className="flex justify-between items-end border-b pb-8">
                <div>
                  <h3 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">{editingUnit.nameEn}</h3>
                  <p className="text-slate-400 font-bold uppercase text-xs mt-4 tracking-widest">{editingUnit.id} • {editingUnit.status}</p>
                </div>
                <button 
                  onClick={() => { onEnterEditMode(); onUpdateUnit(editingUnit); }}
                  className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all flex items-center gap-4"
                >
                  📐 Free-Draw Layout
                </button>
              </div>

              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Asset Inspector</h4>
                    <div className="space-y-6">
                       <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase">Property Name (English)</label>
                        <input 
                          type="text" 
                          value={editingUnit.nameEn}
                          onChange={(e) => updateUnitDetails(editingUnit.id, 'nameEn', e.target.value)}
                          className="w-full bg-slate-50 border p-4 rounded-xl font-bold"
                        />
                      </div>
                      
                      {/* Logo Upload & Optimization Field */}
                      <div className="flex flex-col gap-3">
                        <label className="text-[9px] font-black text-slate-500 uppercase">Brand Identity (Logo Asset)</label>
                        <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 transition-colors hover:border-blue-400">
                          <div className="w-24 h-24 bg-white rounded-xl border flex items-center justify-center overflow-hidden shadow-inner relative group">
                            {editingUnit.logoUrl ? (
                              <img src={editingUnit.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-4xl">🖼️</span>
                            )}
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            >
                              <span className="font-black text-[9px] uppercase">Update</span>
                            </button>
                          </div>
                          <div className="flex-1 space-y-2">
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handleLogoFileChange}
                              className="hidden"
                            />
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-slate-900 text-white px-4 py-2 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-slate-800 transition-all"
                            >
                              Upload Image
                            </button>
                            <p className="text-[8px] text-slate-400 font-bold uppercase leading-tight">
                              PNG or SVG recommended.<br/>Automatic optimization enabled.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Spatial Metrics (Real-Time)</h4>
                    <div className="grid grid-cols-2 gap-4 bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-blue-500 uppercase">Total Area (m²)</label>
                        <input 
                          type="number" 
                          value={editingUnit.areaSqm || 0}
                          onChange={(e) => updateUnitDetails(editingUnit.id, 'areaSqm', Number(e.target.value))}
                          className="w-full bg-white border p-4 rounded-xl font-black text-xl"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-blue-500 uppercase">Volume (m³)</label>
                        <input 
                          type="number" 
                          readOnly
                          value={editingUnit.volumeCum || 0}
                          className="w-full bg-white border p-4 rounded-xl font-black text-xl opacity-50"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <label className="text-[9px] font-black text-slate-500 uppercase">Property Height (Meters)</label>
                        <input 
                          type="number" 
                          step="0.5"
                          value={editingUnit.heightMeters || 4}
                          onChange={(e) => updateUnitDetails(editingUnit.id, 'heightMeters', Number(e.target.value))}
                          className="w-full bg-white border p-4 rounded-xl font-black text-xl"
                        />
                      </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Anchoring & Addressing</h4>
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase">Global X Anchor</label>
                        <input 
                          type="number" 
                          value={Math.round((Math.min(...editingUnit.polygon.map(p => p[0])) + Math.max(...editingUnit.polygon.map(p => p[0]))) / 2)}
                          onChange={(e) => handleAnchorMove(editingUnit.id, Number(e.target.value), (Math.min(...editingUnit.polygon.map(p => p[1])) + Math.max(...editingUnit.polygon.map(p => p[1]))) / 2)}
                          className="w-full bg-white border p-4 rounded-xl font-black text-lg"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase">Global Y Anchor</label>
                        <input 
                          type="number" 
                          value={Math.round((Math.min(...editingUnit.polygon.map(p => p[1])) + Math.max(...editingUnit.polygon.map(p => p[1]))) / 2)}
                          onChange={(e) => handleAnchorMove(editingUnit.id, (Math.min(...editingUnit.polygon.map(p => p[0])) + Math.max(...editingUnit.polygon.map(p => p[0]))) / 2, Number(e.target.value))}
                          className="w-full bg-white border p-4 rounded-xl font-black text-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Property Metadata</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase">Type</label>
                            <select 
                              value={editingUnit.type}
                              onChange={(e) => updateUnitDetails(editingUnit.id, 'type', e.target.value)}
                              className="w-full bg-slate-50 border p-4 rounded-xl font-bold"
                            >
                              {UNIT_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                            </select>
                         </div>
                         <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase">Floor</label>
                            <select 
                              value={editingUnit.floor}
                              onChange={(e) => updateUnitDetails(editingUnit.id, 'floor', e.target.value)}
                              className="w-full bg-slate-50 border p-4 rounded-xl font-bold"
                            >
                              {Object.values(FloorID).map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                         </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase">Official Mall Address (Suite #)</label>
                        <input 
                          type="text" 
                          value={editingUnit.mallAddress}
                          onChange={(e) => updateUnitDetails(editingUnit.id, 'mallAddress', e.target.value)}
                          className="w-full bg-slate-50 border p-4 rounded-xl font-bold"
                          placeholder="e.g. SUITE-402"
                        />
                      </div>
                    </div>
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
    </div>
  );
};

export default AdminDashboard;
