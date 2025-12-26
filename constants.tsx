import { FloorID, Floor, Unit, NavNode, Connection, MallCategory, MallEvent } from './types';

export const INITIAL_FLOORS: Floor[] = [
  { id: FloorID.GL, nameEn: 'Garden Level', nameAr: 'طابق الحديقة', order: 0, color: '#90C9B1' },
  { id: FloorID.SL, nameEn: 'Service Level', nameAr: 'طابق الخدمة', order: 1, color: '#CBD5E1' },
  { id: FloorID.ML, nameEn: 'Main Level', nameAr: 'الطابق الرئيسي', order: 2, color: '#F9F1E7' },
  { id: FloorID.L1, nameEn: 'Level 1', nameAr: 'الطابق الأول', order: 3, color: '#A5D8EB' },
  { id: FloorID.L2, nameEn: 'Level 2', nameAr: 'الطابق الثاني', order: 4, color: '#F9B4BD' },
];

export const INITIAL_CATEGORIES: MallCategory[] = [
  // TASTE & GATHER
  { id: 'cat-dining', nameEn: 'Fine Dining', nameAr: 'المطاعم الراقية', subcategories: [], iconKey: 'dining' },
  { id: 'cat-cafes', nameEn: 'Cafés & Coffee', nameAr: 'المقاهي', subcategories: [], iconKey: 'cafes' },
  { id: 'cat-food-court', nameEn: 'Food Court', nameAr: 'ردهة المطاعم', subcategories: [], iconKey: 'food-court' },
  { id: 'cat-specialty-food', nameEn: 'Specialty Food', nameAr: 'أطعمة مختصة', subcategories: [], iconKey: 'specialty-food' },
  { id: 'cat-hypermarket', nameEn: 'Hypermarket', nameAr: 'الهايبرماركت', subcategories: [], iconKey: 'hypermarket' },
  
  // ELITE FASHION
  { id: 'cat-fashion', nameEn: 'Elite Fashion', nameAr: 'أزياء النخبة', subcategories: [], iconKey: 'fashion' },
  { id: 'cat-women-fashion', nameEn: 'Women\'s Fashion', nameAr: 'أزياء نسائية', subcategories: [], iconKey: 'women-fashion' },
  { id: 'cat-men-fashion', nameEn: 'Men\'s Fashion', nameAr: 'أزياء رجالية', subcategories: [], iconKey: 'men-fashion' },
  { id: 'cat-kids-fashion', nameEn: 'Kids\' Fashion', nameAr: 'أزياء الأطفال', subcategories: [], iconKey: 'kids-fashion' },
  { id: 'cat-lingerie', nameEn: 'Lingerie', nameAr: 'ملابس داخلية', subcategories: [], iconKey: 'lingerie' },
  { id: 'cat-sportswear', nameEn: 'Sportswear', nameAr: 'ملابس رياضية', subcategories: [], iconKey: 'sportswear' },
  { id: 'cat-jewelry', nameEn: 'Jewellery & Watches', nameAr: 'المجوهرات / الساعات', subcategories: [], iconKey: 'jewelry' },
  { id: 'cat-beauty', nameEn: 'Perfumes & Beauty', nameAr: 'العطور / الجمال', subcategories: [], iconKey: 'beauty' },
  { id: 'cat-optics', nameEn: 'Optics', nameAr: 'البصريات', subcategories: [], iconKey: 'optics' },
  { id: 'cat-bags', nameEn: 'Bags & Accessories', nameAr: 'حقائب / اكسسوارات', subcategories: [], iconKey: 'bags' },

  // FAMILY FUN
  { id: 'cat-entertainment', nameEn: 'Entertainment', nameAr: 'الترفيه', subcategories: [], iconKey: 'entertainment' },
  { id: 'cat-kids-salon', nameEn: 'Kids\' Salon', nameAr: 'صالون أطفال', subcategories: [], iconKey: 'kids-salon' },
  { id: 'cat-toys', nameEn: 'Toys & Hobbies', nameAr: 'ألعاب وهوايات', subcategories: [], iconKey: 'toys' },
  { id: 'cat-museum', nameEn: 'Cultural Museum', nameAr: 'متحف ثقافي', subcategories: [], iconKey: 'museum' },

  // COMMUNITY HUB
  { id: 'cat-salons', nameEn: 'Salons & Spas', nameAr: 'صالونات وسبا', subcategories: [], iconKey: 'salons' },
  { id: 'cat-men-salon', nameEn: 'Men\'s Salon', nameAr: 'صالون رجالي', subcategories: [], iconKey: 'men-salon' },
  { id: 'cat-medical', nameEn: 'Medical & Health', nameAr: 'الطب والصحة', subcategories: [], iconKey: 'medical' },
  { id: 'cat-electronics', nameEn: 'Electronics & Tech', nameAr: 'الإلكترونيات والتقنية', subcategories: [], iconKey: 'electronics' },
  { id: 'cat-banks', nameEn: 'Banks & ATM', nameAr: 'بنوك وصراف آلي', subcategories: [], iconKey: 'banks' },
  { id: 'cat-gov', nameEn: 'Government Services', nameAr: 'الخدمات الحكومية', subcategories: [], iconKey: 'gov' },
  { id: 'cat-furnishing', nameEn: 'Home Furnishing', nameAr: 'أثاث منزلي', subcategories: [], iconKey: 'furnishing' },
  { id: 'cat-specialty-stores', nameEn: 'Specialty Stores', nameAr: 'متاجر مختصة', subcategories: [], iconKey: 'specialty-stores' },
];

export const INITIAL_EVENTS: MallEvent[] = [
  {
    id: 'evt-sale-1',
    titleEn: 'Winter Gala Sale',
    titleAr: 'مهرجان تنزيلات الشتاء',
    descEn: 'Exclusive seasonal offers up to 60% off.',
    descAr: 'عروض موسمية حصرية بخصومات تصل إلى 60%.',
    dateEn: 'Oct 20 - Nov 20',
    dateAr: '20 أكتوبر - 20 نوفمبر',
    tags: ['Luxury', 'Sale'],
  }
];

const gr = (cx: number, cy: number, w: number, h: number): [number, number][] => {
  const x = cx - w / 2, y = cy - h / 2;
  return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
};

export const INITIAL_UNITS: Unit[] = [
  // GARDEN LEVEL (GL)
  { id: 'GL-BURSA', nameEn: 'Bursa Kebap Evi', nameAr: 'بورصة كباب إيفي', type: 'restaurant', category: 'cat-dining', floor: FloorID.GL, mallAddress: 'GL-5', polygon: gr(1600, 450, 180, 150), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Dining', 'Turkish'], attributes: [], storeNumber: '5', openingTime: '12:00', closingTime: '23:00', taglineEn: 'Authentic flavors of Anatolia.', taglineAr: 'نكهات الأناضول الأصيلة.', bannerUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800', isPromoted: true },
  { id: 'GL-BUSTAN', nameEn: 'Al Bustan Medical', nameAr: 'مركز البستان الطبي', type: 'medical', category: 'cat-medical', floor: FloorID.GL, mallAddress: 'GL-13', polygon: gr(500, 200, 200, 150), entryNodeId: 'ML-NODE-L1', status: 'open', tags: ['Clinic'], attributes: [], storeNumber: '13', openingTime: '09:00', closingTime: '21:00' },

  // SERVICE LEVEL (SL)
  { id: 'SL-ATM-1', nameEn: 'ADCB ATM', nameAr: 'جهاز صراف آلي', type: 'atm', category: 'cat-banks', floor: FloorID.SL, mallAddress: 'SL-ATM-01', polygon: gr(1000, 400, 60, 60), entryNodeId: 'ML-NODE-ESC-W', status: 'open', tags: ['Banking'], attributes: [], storeNumber: 'ATM-1', openingTime: '00:00', closingTime: '23:59' },
  { id: 'SL-MGT', nameEn: 'Mall Management', nameAr: 'إدارة المول', type: 'info', category: 'cat-banks', floor: FloorID.SL, mallAddress: 'SL-10', polygon: gr(2200, 1100, 200, 150), entryNodeId: 'ML-NODE-R3', status: 'open', tags: ['Service'], attributes: [], storeNumber: '10', openingTime: '09:00', closingTime: '18:00' },

  // MAIN LEVEL (ML)
  { id: 'ML-CARREFOUR', nameEn: 'Carrefour', nameAr: 'كارفور', type: 'store', category: 'cat-hypermarket', floor: FloorID.ML, mallAddress: 'ML-72', polygon: gr(2800, 750, 500, 850), entryNodeId: 'ML-NODE-R3', status: 'open', tags: ['Hypermarket'], attributes: [], storeNumber: '72', openingTime: '09:00', closingTime: '00:00', taglineEn: 'Quality for your home.', taglineAr: 'الجودة لمنزلك.', bannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800' },
  { id: 'ML-STARBUCKS', nameEn: 'Starbucks Coffee', nameAr: 'ستارباكس', type: 'coffee', category: 'cat-cafes', floor: FloorID.ML, mallAddress: 'ML-58', polygon: gr(1000, 1100, 100, 100), entryNodeId: 'ML-NODE-L1', status: 'open', tags: ['Coffee'], attributes: [], storeNumber: '58', openingTime: '08:00', closingTime: '23:00', isPromoted: true },

  // LEVEL 1 (L1)
  { id: 'L1-HM', nameEn: 'H&M', nameAr: 'اتش آند ام', type: 'store', category: 'cat-fashion', floor: FloorID.L1, mallAddress: 'L1-79', polygon: gr(2200, 800, 300, 300), entryNodeId: 'ML-NODE-R3', status: 'open', tags: ['Fashion'], attributes: [], storeNumber: '79', openingTime: '10:00', closingTime: '22:00', isPromoted: true },
  { id: 'L1-ADIDAS', nameEn: 'Adidas Outlet', nameAr: 'أديداس أوتليت', type: 'store', category: 'cat-sportswear', floor: FloorID.L1, mallAddress: 'L1-88', polygon: gr(1400, 900, 150, 150), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Sportswear'], attributes: [], storeNumber: '88', openingTime: '10:00', closingTime: '22:00' },

  // LEVEL 2 (L2)
  { id: 'L2-CINEMA', nameEn: 'Cinema Royal', nameAr: 'رويال سينما', type: 'cinema', category: 'cat-entertainment', floor: FloorID.L2, mallAddress: 'L2-174', polygon: gr(2500, 400, 600, 300), entryNodeId: 'ML-NODE-R3', status: 'open', tags: ['Movies'], attributes: [], storeNumber: '174', openingTime: '10:00', closingTime: '02:00', taglineEn: 'Cinematic storytelling.', taglineAr: 'سرد قصصي سينمائي.', bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800', isPromoted: true },
  { id: 'L2-ALBAIK', nameEn: 'Al Baik', nameAr: 'البيك', type: 'restaurant', category: 'cat-food-court', floor: FloorID.L2, mallAddress: 'L2-215', polygon: gr(1800, 650, 150, 150), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Fast Food'], attributes: [], storeNumber: '215', openingTime: '10:00', closingTime: '23:00' },
];

export const INITIAL_NODES: NavNode[] = [
  { id: 'ML-NODE-L1', floor: FloorID.ML, x: 600, y: 750, type: 'corridor' },
  { id: 'ML-NODE-ELV-FW', floor: FloorID.ML, x: 450, y: 1120, type: 'elevator' },
  { id: 'ML-NODE-ESC-W', floor: FloorID.ML, x: 1100, y: 750, type: 'escalator' },
  { id: 'ML-NODE-ATRIUM', labelEn: 'Grand Atrium', floor: FloorID.ML, x: 1600, y: 750, type: 'atrium', isLandmark: true, landmarkIcon: '🏛️' },
  { id: 'ML-NODE-R3', floor: FloorID.ML, x: 3000, y: 750, type: 'corridor' },
];

export const INITIAL_CONNECTIONS: Connection[] = [
  { from: 'ML-NODE-L1', to: 'ML-NODE-ELV-FW', accessible: true },
  { from: 'ML-NODE-L1', to: 'ML-NODE-ESC-W', accessible: true },
  { from: 'ML-NODE-ESC-W', to: 'ML-NODE-ATRIUM', accessible: true },
  { from: 'ML-NODE-ATRIUM', to: 'ML-NODE-R3', accessible: true },
];