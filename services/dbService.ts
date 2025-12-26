import { MallState, Unit, KioskDevice, FloorID } from '../types';
import { INITIAL_UNITS, INITIAL_CATEGORIES, INITIAL_EVENTS } from '../constants';

const DB_NAME = 'DeerfieldsSpatialDB';
const DB_VERSION = 2; // Incremented version
const STORE_NAME = 'mallState';

class SpatialDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = (e) => {
        this.db = (e.target as IDBOpenDBRequest).result;
        resolve();
      };
      request.onerror = () => reject('IndexedDB Init Failed');
    });
  }

  async saveState(state: MallState): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(state, 'current');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject();
    });
  }

  async loadState(): Promise<MallState> {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const tx = this.db!.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get('current');
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result);
        } else {
          // Fix: Added kiosksHealth to default state to satisfy MallState interface
          resolve({
            units: INITIAL_UNITS,
            categories: INITIAL_CATEGORIES,
            events: INITIAL_EVENTS,
            kioskConfig: {
              id: 'KIOSK-DF-01',
              name: 'Deerfields Main Concierge',
              homeFloor: FloorID.ML,
              homeX: 1600,
              homeY: 850,
              lastMaintenance: Date.now()
            },
            kiosksHealth: [],
            isEmergency: false
          });
        }
      };
    });
  }
}

export const dbService = new SpatialDB();