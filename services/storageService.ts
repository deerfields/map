import { Unit, MallCategory, Kiosk, SearchLog } from '../types';
import { INITIAL_UNITS, INITIAL_CATEGORIES, INITIAL_KIOSKS } from '../constants';

const STORAGE_KEY = 'Data2st_Mall_State';

interface MallState {
  units: Unit[];
  categories: MallCategory[];
  kiosks: Kiosk[];
  searchLogs: SearchLog[];
}

export const loadMallData = (): MallState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse storage", e);
    }
  }
  
  const initialState: MallState = {
    units: INITIAL_UNITS,
    categories: INITIAL_CATEGORIES,
    kiosks: INITIAL_KIOSKS,
    searchLogs: [],
  };
  saveMallData(initialState);
  return initialState;
};

export const saveMallData = (state: MallState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};