import { Unit, MallCategory, MallState, KioskDevice, FloorID } from '../types';
import { INITIAL_UNITS, INITIAL_CATEGORIES, INITIAL_EVENTS } from '../constants';

const STORAGE_KEY = 'Deerfields_Mall_State_v2';

const DEFAULT_KIOSK: KioskDevice = {
  id: 'KIOSK-01',
  name: 'Main Atrium Kiosk',
  homeFloor: FloorID.ML,
  homeX: 1600,
  homeY: 850,
  lastMaintenance: Date.now()
};

export const loadMallData = (): MallState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Storage corruption detected. Resetting to defaults.", e);
    }
  }
  
  // Fix: Added INITIAL_EVENTS and kiosksHealth to initialState to satisfy MallState interface
  const initialState: MallState = {
    units: INITIAL_UNITS,
    categories: INITIAL_CATEGORIES,
    events: INITIAL_EVENTS,
    kioskConfig: DEFAULT_KIOSK,
    kiosksHealth: [],
    isEmergency: false
  };
  saveMallData(initialState);
  return initialState;
};

export const saveMallData = (state: MallState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};