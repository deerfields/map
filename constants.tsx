
import { FloorID, Floor, Unit, NavNode, Connection, MallCategory, ZoneLabel, Kiosk } from './types';

export const INITIAL_FLOORS: Floor[] = [
  { id: FloorID.B, nameEn: 'Basement Parking', nameAr: 'مواقف القبو', order: 0, color: '#475569' },
  { id: FloorID.GL, nameEn: 'Garden Level', nameAr: 'طابق الحديقة', order: 1, color: '#90C9B1' },
  { id: FloorID.SL, nameEn: 'Street Level', nameAr: 'طابق الشارع', order: 2, color: '#F7F9FB' },
  { id: FloorID.ML, nameEn: 'Main Level', nameAr: 'الطابق الرئيسي', order: 3, color: '#F9F1E7' },
  { id: FloorID.L1, nameEn: 'Level 1', nameAr: 'الطابق الأول', order: 4, color: '#A5D8EB' },
  { id: FloorID.L2, nameEn: 'Level 2', nameAr: 'الطابق الثاني', order: 5, color: '#F9B4BD' },
];

export const MALL_ZONES: ZoneLabel[] = [
  { id: 'zone-nw', floor: FloorID.ML, x: 2500, y: 768, nameEn: 'North Wing', nameAr: 'الجناح الشمالي' },
  { id: 'zone-sw', floor: FloorID.ML, x: 500, y: 768, nameEn: 'South Wing', nameAr: 'الجناح الجنوبي' },
  { id: 'zone-ga', floor: FloorID.ML, x: 1600, y: 750, nameEn: 'Grand Atrium', nameAr: 'الردهة الكبرى' },
];

export const INITIAL_CATEGORIES: MallCategory[] = [
  { id: 'cat-fashion', nameEn: 'FASHION', nameAr: 'أزياء', subcategories: [], iconKey: '👗' },
  { id: 'cat-womens-fashion', nameEn: "WOMEN'S FASHION", nameAr: 'الأزياء النسائية', subcategories: [], iconKey: '👗' },
  { id: 'cat-mens-fashion', nameEn: "MEN'S FASHION", nameAr: 'الأزياء الرجالية', subcategories: [], iconKey: '👔' },
  { id: 'cat-kids-fashion', nameEn: 'KIDS FASHION', nameAr: 'الأزياء الأطفال', subcategories: [], iconKey: '👶' },
  { id: 'cat-lingerie', nameEn: 'LINGERIE', nameAr: 'الملابس الداخلية', subcategories: [], iconKey: '👙' },
  { id: 'cat-sportswear', nameEn: 'SPORTSWEAR', nameAr: 'الملابس الرياضة', subcategories: [], iconKey: '👟' },
  { id: 'cat-jewelry-watches', nameEn: 'JEWELLERY / WATCHES / ACCESSORIES', nameAr: 'المجوهرات / الساعات/ الأكسسوارات', subcategories: [], iconKey: '💎' },
  { id: 'cat-perfumes-cosmetics', nameEn: 'PERFUMES/COSMETICS', nameAr: 'العطور/ مستحضرات التجميل', subcategories: [], iconKey: '💄' },
  { id: 'cat-optics-sunglasses', nameEn: 'OPTICS & SUNGLASSES', nameAr: 'البصريات والنظارات الشمسية', subcategories: [], iconKey: '👓' },
  { id: 'cat-footwear-bags', nameEn: 'FOOTWEAR/BAGS', nameAr: 'الأحذية / الحقائب', subcategories: [], iconKey: '👜' },
  { id: 'cat-furnishing', nameEn: 'FURNISHING', nameAr: 'المفروشات', subcategories: [], iconKey: '🛋️' },
  { id: 'cat-books-toys', nameEn: 'BOOKS/STATIONERY/TOYS/GIFTS/GAMES', nameAr: 'الكتب/ القرطاسية/ الألعاب/ الهدايا/ الهوايات', subcategories: [], iconKey: '🧸' },
  { id: 'cat-specialty-stores', nameEn: 'SPECIALTY STORES', nameAr: 'المتاجر المتخصصة', subcategories: [], iconKey: '✨' },
  { id: 'cat-food-court', nameEn: 'FOOD COURT', nameAr: 'ردهة المطاعم', subcategories: [], iconKey: '🍔' },
  { id: 'cat-dining-restaurants', nameEn: 'DINING / RESTAURANTS', nameAr: 'المطاعم', subcategories: [], iconKey: '🍴' },
  { id: 'cat-cafes', nameEn: 'CAFÉS', nameAr: 'المقاهي', subcategories: [], iconKey: '☕' },
  { id: 'cat-hypermarket', nameEn: 'HYPERMARKET', nameAr: 'الهايبرماركت', subcategories: [], iconKey: '🛒' },
  { id: 'cat-specialty-food', nameEn: 'SPECIALTY FOOD', nameAr: 'أغذية متخصصة', subcategories: [], iconKey: '🍯' },
  { id: 'cat-salons', nameEn: 'SALONS', nameAr: 'صالونات التجميل', subcategories: [], iconKey: '💇‍♀️' },
  { id: 'cat-mens-salon', nameEn: "MEN'S SALON", nameAr: 'صالون الرجالي', subcategories: [], iconKey: '💇‍♂️' },
  { id: 'cat-kids-salon', nameEn: 'KIDS SALON', nameAr: 'صالون الأطفال', subcategories: [], iconKey: '🧒' },
  { id: 'cat-entertainment', nameEn: 'ENTERTAINMENT', nameAr: 'الترفيه', subcategories: [], iconKey: '🎡' },
  { id: 'cat-medical-pharmacies', nameEn: 'MEDICAL & PHARMACIES', nameAr: 'المراكز الطبية و الصيدليات', subcategories: [], iconKey: '🏥' },
  { id: 'cat-electronics', nameEn: 'TELECOMMUNICATIONS/ELECTRONICS', nameAr: 'الاتصالات و الإلكترونيات', subcategories: [], iconKey: '📱' },
  { id: 'cat-financial-services', nameEn: 'BANKS & FINANCIAL SERVICES', nameAr: 'البنوك والخدمات المالية', subcategories: [], iconKey: '🏦' },
  { id: 'cat-government-services', nameEn: 'GOVERNMENT SERVICES', nameAr: 'الخدمات / المعاملات الحكومية', subcategories: [], iconKey: '🏛️' },
  { id: 'cat-museum', nameEn: 'MUSEUM', nameAr: 'المتحف', subcategories: [], iconKey: '🖼️' },
];

const gr = (cx: number, cy: number, w: number, h: number): [number, number][] => {
  const x = cx - w / 2, y = cy - h / 2;
  return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
};

const circle = (cx: number, cy: number, r: number, segments: number = 24): [number, number][] => {
  const pts: [number, number][] = [];
  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    pts.push([
      Math.round(cx + r * Math.cos(theta)),
      Math.round(cy + r * Math.sin(theta))
    ]);
  }
  return pts;
};

export const INITIAL_UNITS: Unit[] = [
  // --- LEFT WING (South Wing) ---
  { 
    id: 'ML-47', 
    nameEn: 'Centrepoint', 
    nameAr: 'سنتر بوینت', 
    taglineEn: 'The Ultimate Family Fashion Destination',
    taglineAr: 'وجهة الموضة العائلية المثالية',
    descriptionEn: 'Centrepoint represents the Landmark Group’s strategy to synergize its core retail concepts.',
    type: 'store', 
    category: 'cat-fashion', 
    floor: FloorID.ML, 
    mallAddress: '47', 
    polygon: gr(450, 475, 500, 450), 
    entryNodeId: 'ML-NODE-L1', 
    status: 'open', 
    isPromoted: true, 
    tags: ['department-store', 'fashion'], 
    attributes: ['family-brand'], 
    storeNumber: '47', 
    openingTime: '10:00', 
    closingTime: '22:00', 
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Centrepoint_Logo.png/1200px-Centrepoint_Logo.png',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
    phoneNumber: '+971 2 501 0800'
  },
  { id: 'ML-93', nameEn: 'BBZ', nameAr: 'بي بي زي', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: '93', polygon: gr(180, 850, 160, 300), entryNodeId: 'ML-NODE-L2', status: 'open', tags: ['fashion', 'outlet'], attributes: [], storeNumber: '93', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-92', nameEn: 'Max', nameAr: 'ماكس', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: '92', polygon: gr(480, 850, 440, 300), entryNodeId: 'ML-NODE-L1', status: 'open', tags: ['fashion', 'value'], attributes: [], storeNumber: '92', openingTime: '10:00', closingTime: '22:00', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Max_Fashion_logo.svg/1200px-Max_Fashion_logo.svg.png' },

  // --- TOP CORRIDOR (Left to Right) ---
  { id: 'ML-48', nameEn: 'Classy YM', nameAr: 'كلاسي واي إم', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: '48', polygon: gr(830, 550, 60, 100), entryNodeId: 'ML-NODE-M1', status: 'open', tags: [], attributes: [], storeNumber: '48', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-49', nameEn: 'Beverly Hills Polo Club', nameAr: 'بيفرلي هيلز بولو كلوب', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: '49', polygon: gr(895, 550, 70, 100), entryNodeId: 'ML-NODE-M1', status: 'open', tags: [], attributes: [], storeNumber: '49', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-51', nameEn: "Athlete's Co", nameAr: 'أثليتس كو', type: 'store', category: 'cat-sportswear', floor: FloorID.ML, mallAddress: '51', polygon: gr(1000, 550, 50, 100), entryNodeId: 'ML-NODE-M1', status: 'open', tags: ['sports'], attributes: [], storeNumber: '51', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-52', nameEn: 'Skechers', nameAr: 'سكيتشرز', type: 'store', category: 'cat-footwear-bags', floor: FloorID.ML, mallAddress: '52', polygon: gr(1055, 550, 60, 100), entryNodeId: 'ML-NODE-M1', status: 'open', tags: ['shoes'], attributes: [], storeNumber: '52', openingTime: '10:00', closingTime: '22:00' },
  { 
    id: 'ML-58', 
    nameEn: 'Starbucks', 
    nameAr: 'ستاربكس', 
    taglineEn: 'Expect More Than Just Coffee',
    type: 'coffee', 
    category: 'cat-cafes', 
    floor: FloorID.ML, 
    mallAddress: '58', 
    polygon: gr(1400, 550, 80, 100), 
    entryNodeId: 'ML-NODE-ATRIUM', 
    status: 'open', 
    tags: ['coffee'], 
    attributes: [], 
    storeNumber: '58', 
    openingTime: '07:00', 
    closingTime: '23:00',
    bannerUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab752?auto=format&fit=crop&q=80&w=1200'
  },

  // --- CENTRAL ATRIUM ---
  { id: 'ML-ATRIUM', nameEn: 'Atrium', nameAr: 'الردهة', type: 'atrium', category: 'cat-specialty-stores', floor: FloorID.ML, mallAddress: 'ATRIUM', polygon: circle(1600, 750, 120, 8), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: [], attributes: [], storeNumber: 'ATRIUM', openingTime: '00:00', closingTime: '23:59' },

  // --- BOTTOM CORRIDOR (Left to Right) ---
  { id: 'ML-91', nameEn: 'Crocs', nameAr: 'كروكس', type: 'store', category: 'cat-footwear-bags', floor: FloorID.ML, mallAddress: '91', polygon: gr(830, 950, 60, 100), entryNodeId: 'ML-NODE-M1', status: 'open', tags: ['shoes'], attributes: [], storeNumber: '91', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-81', nameEn: 'Tim Hortons', nameAr: 'تيم هورتنز', type: 'coffee', category: 'cat-cafes', floor: FloorID.ML, mallAddress: '81', polygon: gr(1420, 950, 100, 100), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['coffee'], attributes: [], storeNumber: '81', openingTime: '07:00', closingTime: '23:00' },
  { id: 'ML-80', nameEn: 'Jawhara', nameAr: 'جوهرة', type: 'store', category: 'cat-jewelry-watches', floor: FloorID.ML, mallAddress: '80', polygon: gr(1780, 950, 100, 100), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['gold'], attributes: [], storeNumber: '80', openingTime: '10:00', closingTime: '22:00' },
  { 
    id: 'ML-79', 
    nameEn: 'H&M', 
    nameAr: 'اتش اند ام', 
    taglineEn: 'Fashion and Quality at the Best Price',
    type: 'store', 
    category: 'cat-fashion', 
    floor: FloorID.ML, 
    mallAddress: '79', 
    polygon: gr(2050, 950, 250, 100), 
    entryNodeId: 'ML-NODE-R1', 
    status: 'open', 
    tags: ['fashion'], 
    attributes: [], 
    storeNumber: '79', 
    openingTime: '10:00', 
    closingTime: '22:00',
    bannerUrl: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=1200'
  },

  // --- RIGHT WING (North Wing) ---
  { 
    id: 'ML-72', 
    nameEn: 'Carrefour', 
    nameAr: 'كارفور', 
    taglineEn: 'Your Daily Shopping Destination',
    type: 'store', 
    category: 'cat-hypermarket', 
    floor: FloorID.ML, 
    mallAddress: '72', 
    polygon: gr(2800, 750, 600, 900), 
    entryNodeId: 'ML-NODE-R3', 
    status: 'open', 
    isPromoted: true, 
    tags: ['grocery', 'hypermarket'], 
    attributes: [], 
    storeNumber: '72', 
    openingTime: '08:00', 
    closingTime: '00:00', 
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Carrefour_logo.svg/1200px-Carrefour_logo.svg.png',
    bannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
    phoneNumber: '+971 800 73232'
  },

  // Services
  { id: 'ML-RESTROOMS-L', nameEn: 'Restrooms', nameAr: 'دوارات مياه', type: 'restroom_men', category: 'cat-government-services', floor: FloorID.ML, mallAddress: '91-RR', polygon: gr(830, 1100, 80, 80), entryNodeId: 'ML-NODE-M1', status: 'open', tags: [], attributes: [], storeNumber: 'RR-L', openingTime: '00:00', closingTime: '23:59' },
];

export const INITIAL_NODES: NavNode[] = [
  { id: 'ML-NODE-L2', floor: FloorID.ML, x: 200, y: 750, type: 'corridor' },
  { id: 'ML-NODE-L1', floor: FloorID.ML, x: 600, y: 750, type: 'corridor' },
  { id: 'ML-NODE-M1', floor: FloorID.ML, x: 1000, y: 750, type: 'corridor' },
  { id: 'ML-NODE-ATRIUM', labelEn: 'Grand Atrium', floor: FloorID.ML, x: 1600, y: 750, type: 'atrium', isLandmark: true, landmarkIcon: '🏛️' },
  { id: 'ML-NODE-R1', floor: FloorID.ML, x: 2100, y: 750, type: 'corridor' },
  { id: 'ML-NODE-R2', floor: FloorID.ML, x: 2500, y: 750, type: 'corridor' },
  { id: 'ML-NODE-R3', floor: FloorID.ML, x: 3000, y: 750, type: 'corridor' },
];

export const INITIAL_CONNECTIONS: Connection[] = [
  { from: 'ML-NODE-L2', to: 'ML-NODE-L1', accessible: true },
  { from: 'ML-NODE-L1', to: 'ML-NODE-M1', accessible: true },
  { from: 'ML-NODE-M1', to: 'ML-NODE-ATRIUM', accessible: true },
  { from: 'ML-NODE-ATRIUM', to: 'ML-NODE-R1', accessible: true },
  { from: 'ML-NODE-R1', to: 'ML-NODE-R2', accessible: true },
  { from: 'ML-NODE-R2', to: 'ML-NODE-R3', accessible: true },
];

export const INITIAL_KIOSKS: Kiosk[] = [
  { id: 'K1', floor: FloorID.ML, x: 1600, y: 850, name: 'Main Information Station' }
];
