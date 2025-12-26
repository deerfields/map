
export enum FloorID {
  GL = 'GL', // Garden Level
  SL = 'SL', // Service Level
  ML = 'ML', // Main Level
  L1 = 'L1', // Level 1
  L2 = 'L2'  // Level 2
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
  | 'coffee'
  | 'restaurant'
  | 'cinema'
  | 'gym'
  | 'museum'
  | 'atrium'
  | 'kiosk'
  | 'pop_up'
  | 'emergency_exit';

export enum VisualizationMode {
  VIEW_2D = '2D',
  VIEW_3D = '3D',
  VIEW_4D = '4D',
  VIEW_CINEMATIC = 'CINEMATIC'
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

export interface MallEvent {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  dateEn: string;
  dateAr: string;
  tags: string[];
  imageUrl?: string;
}

export interface KioskHealth {
  kioskId: string;
  status: 'online' | 'offline' | 'warning';
  uptimeSeconds: number;
  cpuLoad: number;
  memoryUsage: number;
  lastHeartbeat: number;
  networkLatency: number;
  issues: string[];
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
  mallAddress: string; 
  polygon: Point[]; 
  entryNodeId: string;
  status: 'open' | 'closed' | 'coming_soon' | 'maintenance';
  isPromoted?: boolean;
  rentTier?: 1 | 2 | 3 | 4 | 5; 
  tags: string[];
  attributes: string[]; 
  storeNumber: string;
  openingTime: string;
  closingTime: string;
  logoUrl?: string; 
  bannerUrl?: string;
  phoneNumber?: string;
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
  isRestricted?: boolean; 
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
  events: MallEvent[];
  kioskConfig: KioskDevice;
  kiosksHealth: KioskHealth[];
  isEmergency: boolean;
}

export type NavigationStatus = 'idle' | 'calculating' | 'following' | 'arrived';
