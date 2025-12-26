
import { FloorID, Floor, Unit, NavNode, Connection, MallCategory, MallEvent } from './types';

export const INITIAL_FLOORS: Floor[] = [
  { id: FloorID.GL, nameEn: 'Garden Level', nameAr: 'طابق الحديقة', order: 0, color: '#90C9B1' },
  { id: FloorID.SL, nameEn: 'Service Level', nameAr: 'طابق الخدمة', order: 1, color: '#CBD5E1' },
  { id: FloorID.ML, nameEn: 'Main Level', nameAr: 'الطابق الرئيسي', order: 2, color: '#F9F1E7' },
  { id: FloorID.L1, nameEn: 'Level 1', nameAr: 'الطابق الأول', order: 3, color: '#A5D8EB' },
  { id: FloorID.L2, nameEn: 'Level 2', nameAr: 'الطابق الثاني', order: 4, color: '#F9B4BD' },
];

export const INITIAL_CATEGORIES: MallCategory[] = [
  { id: 'cat-fashion', nameEn: 'FASHION', nameAr: 'الأزياء', subcategories: [], iconKey: '👔' },
  { id: 'cat-jewelry', nameEn: 'JEWELLERY & WATCHES', nameAr: 'المجوهرات والساعات', subcategories: [], iconKey: '💍' },
  { id: 'cat-optics', nameEn: 'OPTICS & SUNGLASSES', nameAr: 'البصريات والنظارات', subcategories: [], iconKey: '🕶️' },
  { id: 'cat-dining', nameEn: 'DINING & RESTAURANTS', nameAr: 'المطاعم', subcategories: [], iconKey: '🍽️' },
  { id: 'cat-cafes', nameEn: 'CAFÉS', nameAr: 'المقاهي', subcategories: [], iconKey: '☕' },
  { id: 'cat-entertainment', nameEn: 'ENTERTAINMENT', nameAr: 'الترفيه', subcategories: [], iconKey: '🎭' },
  { id: 'cat-hypermarket', nameEn: 'HYPERMARKET', nameAr: 'هايبر مارکت', subcategories: [], iconKey: '🛍️' },
  { id: 'cat-medical', nameEn: 'MEDICAL & PHARMACIES', nameAr: 'المراکز الطبیة والصیدلیات', subcategories: [], iconKey: '💊' },
  { id: 'cat-electronics', nameEn: 'ELECTRONICS', nameAr: 'الإلکترونیات', subcategories: [], iconKey: '💻' },
  { id: 'cat-furniture', nameEn: 'FURNITURE & HOME', nameAr: 'الأثاث والمفروشات', subcategories: [], iconKey: '🛋️' },
  { id: 'cat-museum', nameEn: 'MUSEUM & EXHIBITIONS', nameAr: 'المتحف والمعارض', subcategories: [], iconKey: '🏛️' },
  { id: 'cat-services', nameEn: 'BANKS & SERVICES', nameAr: 'البنوک والخدمات', subcategories: [], iconKey: '💳' },
];

export const INITIAL_EVENTS: MallEvent[] = [
  {
    id: 'evt-winterfields',
    titleEn: 'Winterfields Seasonal Event',
    titleAr: 'فعالية وينترفيلدز الموسمية',
    descEn: 'Experience the magic of winter with family activities, seasonal treats, and festive decor.',
    descAr: 'استمتع بسحر الشتاء مع الأنشطة العائلية، والمأكولات الموسمية، والديكورات الاحتفالية.',
    dateEn: 'Nov 20 - Jan 15',
    dateAr: '20 نوفمبر - 15 يناير',
    tags: ['Family', 'Seasonal'],
    imageUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=1200'
  },
  {
    id: 'evt-petting-zoo',
    titleEn: 'Indoor Petting Zoo',
    titleAr: 'حديقة الحيوانات الأليفة الداخلية',
    descEn: 'A unique experience for kids to interact with friendly animals in a safe, indoor environment.',
    descAr: 'تجربة فريدة للأطفال للتفاعل مع الحيوانات الأليفة في بيئة داخلية آمنة.',
    dateEn: 'Dec 1 - Jan 30',
    dateAr: '1 ديسمبر - 30 يناير',
    tags: ['Kids', 'Educational'],
    imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200'
  }
];

const gr = (cx: number, cy: number, w: number, h: number): [number, number][] => {
  const x = cx - w / 2, y = cy - h / 2;
  return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
};

export const INITIAL_UNITS: Unit[] = [
  { 
    id: 'ML-MIKNAN', 
    nameEn: 'Miknan', 
    nameAr: 'ميكنان', 
    taglineEn: 'Timeless Fashion & Elegance',
    taglineAr: 'أناقة وتصاميم خالدة',
    descriptionEn: 'Modern apparel and traditional elegance.',
    type: 'store', 
    category: 'cat-fashion', 
    floor: FloorID.ML, 
    mallAddress: 'ML-01', 
    polygon: gr(450, 475, 400, 350), 
    entryNodeId: 'ML-NODE-L1', 
    status: 'open', 
    isPromoted: true, 
    tags: ['Fashion'], 
    attributes: ['Luxury'], 
    storeNumber: '01', 
    openingTime: '10:00', 
    closingTime: '22:00'
  },
  { 
    id: 'ML-CARREFOUR', 
    nameEn: 'Carrefour', 
    nameAr: 'كارفور', 
    taglineEn: 'Great Moments for Everyone, Everyday',
    type: 'store', 
    category: 'cat-hypermarket', 
    floor: FloorID.ML, 
    mallAddress: 'ML-Hyper', 
    polygon: gr(2800, 750, 600, 800), 
    entryNodeId: 'ML-NODE-R3', 
    status: 'open', 
    tags: ['Grocery'], 
    attributes: ['Daily Essentials'], 
    storeNumber: 'HYPER', 
    openingTime: '09:00', 
    closingTime: '00:00',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Carrefour_logo.svg/1200px-Carrefour_logo.svg.png'
  },
  { 
    id: 'L2-CINEMA', 
    nameEn: 'Royal Cinemas', 
    nameAr: 'رويال سينما', 
    taglineEn: 'The Ultimate Movie Experience',
    type: 'cinema', 
    category: 'cat-entertainment', 
    floor: FloorID.L2, 
    mallAddress: 'L2-01', 
    polygon: gr(1600, 400, 800, 400), 
    entryNodeId: 'L2-NODE-CENTRAL', 
    status: 'open', 
    tags: ['Movies'], 
    attributes: ['VIP'], 
    storeNumber: 'C1', 
    openingTime: '10:00', 
    closingTime: '03:00'
  },
  { 
    id: 'GL-FAMOUS-DAVES', 
    nameEn: "Famous Dave's", 
    nameAr: 'فيمس دايفز', 
    type: 'restaurant', 
    category: 'cat-dining', 
    floor: FloorID.GL, 
    mallAddress: 'GL-15', 
    polygon: gr(1200, 1100, 250, 180), 
    entryNodeId: 'GL-NODE-GARDEN', 
    status: 'open', 
    tags: ['BBQ'], 
    attributes: ['Outdoor Seating'], 
    storeNumber: '15', 
    openingTime: '11:00', 
    closingTime: '23:00'
  }
];

export const INITIAL_NODES: NavNode[] = [
  { id: 'ML-NODE-L1', floor: FloorID.ML, x: 600, y: 750, type: 'corridor' },
  { id: 'ML-NODE-ATRIUM', labelEn: 'Grand Atrium', floor: FloorID.ML, x: 1600, y: 750, type: 'atrium', isLandmark: true, landmarkIcon: '🏛️' },
  { id: 'ML-NODE-R1', floor: FloorID.ML, x: 2100, y: 750, type: 'corridor' },
  { id: 'ML-NODE-R3', floor: FloorID.ML, x: 3000, y: 750, type: 'corridor' },
  { id: 'L1-NODE-R1', floor: FloorID.L1, x: 2100, y: 750, type: 'corridor' },
  { id: 'L2-NODE-CENTRAL', floor: FloorID.L2, x: 1600, y: 750, type: 'corridor' },
  { id: 'GL-NODE-GARDEN', floor: FloorID.GL, x: 1200, y: 750, type: 'atrium' },
];

export const INITIAL_CONNECTIONS: Connection[] = [
  { from: 'ML-NODE-L1', to: 'ML-NODE-ATRIUM', accessible: true },
  { from: 'ML-NODE-ATRIUM', to: 'ML-NODE-R1', accessible: true },
  { from: 'ML-NODE-R1', to: 'ML-NODE-R3', accessible: true },
  { from: 'ML-NODE-ATRIUM', to: 'L2-NODE-CENTRAL', accessible: true },
  { from: 'ML-NODE-R1', to: 'L1-NODE-R1', accessible: true },
  { from: 'ML-NODE-ATRIUM', to: 'GL-NODE-GARDEN', accessible: true },
];
