

export enum FloorID {
  B = 'B',
  GL = 'GL',
  SL = 'SL',
  ML = 'ML',
  L1 = 'L1',
  L2 = 'L2'
}

export type Point = [number, number];

export type UnitType = 
  | 'store' 
  | 'elevator' 
  | 'escalator' 
  | 'atm' 
  | 'mosque' 
  | 'restroom_men' 
  | 'restroom_women' 
  | 'restroom_baby' 
  | 'info' 
  | 'parking'
  | 'laundry' 
  | 'coffee'
  | 'restaurant'
  | 'walkway'
  | 'atrium'
  | 'control_room'
  | 'admin_office'
  | 'garden'
  | 'kiosk'
  | 'pop_up'
  | 'emergency_exit'
  | 'parking_bay';

export enum VisualizationMode {
  VIEW_2D = '2D',
  VIEW_3D = '3D',
  VIEW_4D = '4D'
}

export interface Floor {
  id: FloorID;
  nameEn: string;
  nameAr: string;
  order: number;
  color: string;
}

export interface MallCategory {
  id: string;
  nameEn: string;
  nameAr: string;
  subcategories: string[]; 
  iconKey?: string;
}

export interface Unit {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  taglineEn?: string;
  taglineAr?: string;
  type: UnitType;
  category: string;
  floor: FloorID;
  zone?: string; 
  mallAddress: string; 
  polygon: Point[]; 
  width?: number;
  height?: number; 
  heightMeters?: number; 
  areaSqm?: number;     
  volumeCum?: number;   
  entryNodeId: string;
  status: 'open' | 'closed' | 'coming_soon' | 'maintenance';
  isRestricted?: boolean; 
  isPromoted?: boolean;
  rentTier?: 1 | 2 | 3 | 4 | 5; 
  promotionTextEn?: string;
  promotionTextAr?: string; 
  activeOfferEn?: string;
  activeOfferAr?: string;
  tags: string[];
  attributes: string[]; 
  storeNumber: string;
  openingTime: string;
  closingTime: string;
  logoUrl?: string; 
  bannerUrl?: string;
  phoneNumber?: string;
  conversionCount?: number;
  preOrderEnabled?: boolean;
  checkStockUrl?: string;
}

export interface NavNode {
  id: string;
  labelEn?: string; 
  labelAr?: string;
  floor: FloorID;
  x: number;
  y: number;
  type: 'corridor' | 'elevator' | 'escalator' | 'atrium' | 'exit' | 'parking';
  isLandmark?: boolean;
  landmarkIcon?: string;
}

export interface Connection {
  from: string;
  to: string;
  accessible: boolean;
  isBlocked?: boolean; 
  distanceWeight?: number; 
  // Fix: Added isRestricted to resolve error in services/routingService.ts on line 61
  isRestricted?: boolean; 
}

// Fix: Added ZoneLabel interface used in constants.tsx
export interface ZoneLabel {
  id: string;
  floor: FloorID;
  x: number;
  y: number;
  nameEn: string;
  nameAr: string;
}

// Fix: Added Kiosk interface used in constants.tsx
export interface Kiosk {
  id: string;
  floor: FloorID;
  x: number;
  y: number;
  name: string;
}

export interface KioskDevice {
  id: string;
  name: string;
  homeFloor: FloorID;
  homeX: number;
  homeY: number;
  lastMaintenance: number;
}

export type RouteMode = 'shortest' | 'accessible' | 'stroller' | 'emergency';

export interface MallState {
  units: Unit[];
  categories: MallCategory[];
  kioskConfig: KioskDevice;
  isEmergency: boolean;
}
