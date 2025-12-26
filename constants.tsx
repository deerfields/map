import { FloorID, Floor, Unit, NavNode, Connection, MallCategory, MallEvent } from './types';

export const INITIAL_FLOORS: Floor[] = [
  { id: FloorID.GL, nameEn: 'Garden Level', nameAr: 'طابق الحديقة', order: 0, color: '#90C9B1' },
  { id: FloorID.SL, nameEn: 'Service Level', nameAr: 'طابق الخدمة', order: 1, color: '#CBD5E1' },
  { id: FloorID.ML, nameEn: 'Main Level', nameAr: 'الطابق الرئيسي', order: 2, color: '#F9F1E7' },
  { id: FloorID.L1, nameEn: 'Level 1', nameAr: 'الطابق الأول', order: 3, color: '#A5D8EB' },
  { id: FloorID.L2, nameEn: 'Level 2', nameAr: 'الطابق الثاني', order: 4, color: '#F9B4BD' },
];

export const INITIAL_CATEGORIES: MallCategory[] = [
  // Taste & Gather
  { id: 'cat-dining', nameEn: 'Restaurants', nameAr: 'المطاعم', subcategories: [], iconKey: 'dining' },
  { id: 'cat-cafes', nameEn: 'Cafés & Coffee', nameAr: 'المقاهي', subcategories: [], iconKey: 'cafes' },
  { id: 'cat-food-court', nameEn: 'Food Court', nameAr: 'ردهة المطاعم', subcategories: [], iconKey: 'food-court' },
  { id: 'cat-specialty-food', nameEn: 'Specialty Food', nameAr: 'أغذية متخصصة', subcategories: [], iconKey: 'specialty-food' },
  { id: 'cat-hypermarket', nameEn: 'Hypermarket', nameAr: 'الهايبرمارکت', subcategories: [], iconKey: 'hypermarket' },

  // Elite Fashion
  { id: 'cat-fashion', nameEn: 'Luxury Fashion', nameAr: 'أزياء فاخرة', subcategories: [], iconKey: 'fashion' },
  { id: 'cat-women-fashion', nameEn: "Women's Fashion", nameAr: 'الأزياء النسائية', subcategories: [], iconKey: 'women-fashion' },
  { id: 'cat-men-fashion', nameEn: "Men's Fashion", nameAr: 'الأزياء الرجالية', subcategories: [], iconKey: 'men-fashion' },
  { id: 'cat-kids-fashion', nameEn: 'Kids Fashion', nameAr: 'الأزياء الأطفال', subcategories: [], iconKey: 'kids-fashion' },
  { id: 'cat-lingerie', nameEn: 'Lingerie', nameAr: 'الملابس الداخلية', subcategories: [], iconKey: 'lingerie' },
  { id: 'cat-sportswear', nameEn: 'Sportswear', nameAr: 'الملابس الرياضية', subcategories: [], iconKey: 'sportswear' },
  { id: 'cat-jewelry', nameEn: 'Jewellery & Watches', nameAr: 'المجوهرات / الساعات', subcategories: [], iconKey: 'jewelry' },
  { id: 'cat-beauty', nameEn: 'Perfumes & Cosmetics', nameAr: 'العطور / مستحضرات التجميل', subcategories: [], iconKey: 'beauty' },
  { id: 'cat-optics', nameEn: 'Optics & Sunglasses', nameAr: 'البصريات', subcategories: [], iconKey: 'optics' },
  { id: 'cat-bags', nameEn: 'Footwear & Bags', nameAr: 'الأحذية / الحقائب', subcategories: [], iconKey: 'bags' },

  // Family Fun
  { id: 'cat-entertainment', nameEn: 'Entertainment', nameAr: 'الترفيه', subcategories: [], iconKey: 'entertainment' },
  { id: 'cat-kids-salon', nameEn: 'Kids Salon', nameAr: 'صالون الأطفال', subcategories: [], iconKey: 'kids-salon' },
  { id: 'cat-toys', nameEn: 'Books & Toys', nameAr: 'الكتب / الألعاب', subcategories: [], iconKey: 'toys' },
  { id: 'cat-museum', nameEn: 'Museum', nameAr: 'المتحف', subcategories: [], iconKey: 'museum' },

  // Community Hub
  { id: 'cat-salons', nameEn: 'Salons', nameAr: 'صالونات التجميل', subcategories: [], iconKey: 'salons' },
  { id: 'cat-men-salon', nameEn: "Men's Salon", nameAr: 'صالون الرجالي', subcategories: [], iconKey: 'men-salon' },
  { id: 'cat-medical', nameEn: 'Medical & Pharmacies', nameAr: 'المراكز الطبية و الصيدليات', subcategories: [], iconKey: 'medical' },
  { id: 'cat-electronics', nameEn: 'Electronics & Tech', nameAr: 'الاتصالات و الإلكترونيات', subcategories: [], iconKey: 'electronics' },
  { id: 'cat-banks', nameEn: 'Banks & Financial Services', nameAr: 'البنوك والخدمات المالية', subcategories: [], iconKey: 'banks' },
  { id: 'cat-gov', nameEn: 'Government Services', nameAr: 'الخدمات الحكومية', subcategories: [], iconKey: 'gov' },
  { id: 'cat-furnishing', nameEn: 'Furnishing', nameAr: 'المفروشات', subcategories: [], iconKey: 'furnishing' },
  { id: 'cat-specialty-stores', nameEn: 'Specialty Stores', nameAr: 'المتاجر المتخصصة', subcategories: [], iconKey: 'specialty-stores' },
];

export const INITIAL_EVENTS: MallEvent[] = [
  {
    id: 'evt-sale-1',
    titleEn: 'Winter Gala Sale',
    titleAr: 'مهرجان تنزيلات الشتاء',
    descEn: 'Exclusive seasonal offers up to 60% off across major brands.',
    descAr: 'عروض موسمية حصرية بخصومات تصل إلى 60% في أرقى المتاجر.',
    dateEn: 'Oct 20 - Nov 20',
    dateAr: '20 أكتوبر - 20 نوفمبر',
    tags: ['Luxury', 'Sale', 'Fashion'],
  }
];

const gr = (cx: number, cy: number, w: number, h: number): [number, number][] => {
  const x = cx - w / 2, y = cy - h / 2;
  return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
};

export const INITIAL_UNITS: Unit[] = [
  // --- TASTE & GATHER ---
  // Hypermarket
  { id: 'ML-CARREFOUR', nameEn: 'Carrefour', nameAr: 'كارفور', type: 'store', category: 'cat-hypermarket', floor: FloorID.ML, mallAddress: 'ML-72', polygon: gr(2800, 750, 500, 850), entryNodeId: 'ML-NODE-R3', status: 'open', tags: ['Hypermarket', 'Grocery'], attributes: [], storeNumber: '72', openingTime: '09:00', closingTime: '00:00', taglineEn: 'Quality and variety for your home.', taglineAr: 'الجودة والتنوع لمنزلك.', bannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800' },
  
  // Dining / Restaurants
  { id: 'GL-BURSA', nameEn: 'Bursa Kebap Evi', nameAr: 'بورصة كباب إيفي', type: 'restaurant', category: 'cat-dining', floor: FloorID.GL, mallAddress: 'GL-5', polygon: gr(1600, 450, 180, 150), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Dining', 'Turkish'], attributes: [], storeNumber: '5', openingTime: '12:00', closingTime: '23:00', taglineEn: 'Authentic flavors of Anatolia.', taglineAr: 'نكهات الأناضول الأصيلة.', bannerUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800', isPromoted: true },
  { id: 'GL-LABRIOCHE', nameEn: 'La Brioche', nameAr: 'لا بريوش', type: 'restaurant', category: 'cat-dining', floor: FloorID.GL, mallAddress: 'GL-1', polygon: gr(1800, 450, 150, 150), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Dining', 'French'], attributes: [], storeNumber: '1', openingTime: '08:00', closingTime: '23:00' },
  { id: 'GL-INDIAPALACE', nameEn: 'India Palace Restaurant', nameAr: 'مطعم قصر الهند', type: 'restaurant', category: 'cat-dining', floor: FloorID.GL, mallAddress: 'GL-13', polygon: gr(2000, 450, 180, 150), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Dining', 'Indian'], attributes: [], storeNumber: '13', openingTime: '12:00', closingTime: '23:00' },
  
  // Food Court
  { id: 'L2-ALBAIK', nameEn: 'Al Baik', nameAr: 'البيك', type: 'restaurant', category: 'cat-food-court', floor: FloorID.L2, mallAddress: 'L2-215', polygon: gr(1500, 650, 120, 120), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Fast Food', 'Chicken'], attributes: [], storeNumber: '215', openingTime: '10:00', closingTime: '23:00', isPromoted: true },
  { id: 'L2-BURGERKING', nameEn: 'Burger King', nameAr: 'برجر كنج', type: 'restaurant', category: 'cat-food-court', floor: FloorID.L2, mallAddress: 'L2-210', polygon: gr(1650, 650, 120, 120), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Fast Food', 'Burger'], attributes: [], storeNumber: '210', openingTime: '10:00', closingTime: '23:00' },
  { id: 'L2-MCDONALDS', nameEn: "McDonald's", nameAr: 'ماكدونالدز', type: 'restaurant', category: 'cat-food-court', floor: FloorID.L2, mallAddress: 'L2-207', polygon: gr(1800, 650, 120, 120), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Fast Food', 'Burger'], attributes: [], storeNumber: '207', openingTime: '10:00', closingTime: '23:00' },
  { id: 'L2-KFC', nameEn: "KFC", nameAr: 'دجاج كنتاكي', type: 'restaurant', category: 'cat-food-court', floor: FloorID.L2, mallAddress: 'L2-209', polygon: gr(1950, 650, 120, 120), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Fast Food', 'Chicken'], attributes: [], storeNumber: '209', openingTime: '10:00', closingTime: '23:00' },

  // Cafes
  { id: 'ML-STARBUCKS', nameEn: 'Starbucks Coffee', nameAr: 'ستارباكس', type: 'coffee', category: 'cat-cafes', floor: FloorID.ML, mallAddress: 'ML-58', polygon: gr(1000, 1100, 100, 100), entryNodeId: 'ML-NODE-L1', status: 'open', tags: ['Coffee'], attributes: [], storeNumber: '58', openingTime: '08:00', closingTime: '23:00', isPromoted: true },
  { id: 'L2-TIMHORTONS', nameEn: 'Tim Hortons', nameAr: 'تيم هورتنز', type: 'coffee', category: 'cat-cafes', floor: FloorID.L2, mallAddress: 'ML-81', polygon: gr(1150, 1100, 100, 100), entryNodeId: 'ML-NODE-L1', status: 'open', tags: ['Coffee'], attributes: [], storeNumber: '81', openingTime: '08:00', closingTime: '23:00' },

  // --- ELITE FASHION ---
  { id: 'ML-HM', nameEn: 'H&M', nameAr: 'اتش آند ام', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-79', polygon: gr(2200, 800, 300, 300), entryNodeId: 'ML-NODE-R3', status: 'open', tags: ['Fashion', 'Clothing'], attributes: [], storeNumber: '79', openingTime: '10:00', closingTime: '22:00', isPromoted: true },
  { id: 'ML-CENTREPOINT', nameEn: 'Centrepoint', nameAr: 'سنتربوينت', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-47', polygon: gr(450, 450, 400, 400), entryNodeId: 'ML-NODE-L1', status: 'open', tags: ['Fashion', 'Family'], attributes: [], storeNumber: '47', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-MAX', nameEn: 'Max', nameAr: 'ماكس', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-92', polygon: gr(2600, 1100, 150, 150), entryNodeId: 'ML-NODE-R3', status: 'open', tags: ['Fashion'], attributes: [], storeNumber: '92', openingTime: '10:00', closingTime: '22:00' },
  
  // Jewellery
  { id: 'ML-DAMAS', nameEn: 'Damas Jewellery', nameAr: 'مجوهرات داماس', type: 'store', category: 'cat-jewelry', floor: FloorID.ML, mallAddress: 'ML-56', polygon: gr(1200, 500, 100, 100), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Jewelry'], attributes: [], storeNumber: '56', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-RIVOLI', nameEn: 'Rivoli', nameAr: 'ريفولي', type: 'store', category: 'cat-jewelry', floor: FloorID.ML, mallAddress: 'ML-86', polygon: gr(1350, 1100, 100, 100), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Watches'], attributes: [], storeNumber: '86', openingTime: '10:00', closingTime: '22:00' },
  
  // Footwear
  { id: 'ML-ALDO', nameEn: 'Aldo', nameAr: 'ألدو', type: 'store', category: 'cat-bags', floor: FloorID.ML, mallAddress: 'ML-57', polygon: gr(1350, 500, 100, 100), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Footwear', 'Bags'], attributes: [], storeNumber: '57', openingTime: '10:00', closingTime: '22:00' },
  { id: 'L1-ALMANDOOS', nameEn: 'Al Mandoos', nameAr: 'المندوس', type: 'store', category: 'cat-bags', floor: FloorID.L1, mallAddress: 'L1-129', polygon: gr(1500, 500, 100, 100), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Traditional', 'Footwear'], attributes: [], storeNumber: '129', openingTime: '10:00', closingTime: '22:00' },

  // --- FAMILY FUN ---
  { id: 'L2-CINEMA', nameEn: 'Cinema Royal', nameAr: 'رويال سينما', type: 'cinema', category: 'cat-entertainment', floor: FloorID.L2, mallAddress: 'L2-174', polygon: gr(2500, 400, 600, 300), entryNodeId: 'ML-NODE-R3', status: 'open', tags: ['Movies', 'Entertainment'], attributes: [], storeNumber: '174', openingTime: '10:00', closingTime: '02:00', isPromoted: true },
  { id: 'L2-FABYLAND', nameEn: 'Fabyland', nameAr: 'فابي لاند', type: 'cinema', category: 'cat-entertainment', floor: FloorID.L2, mallAddress: 'L2-208', polygon: gr(3000, 400, 200, 300), entryNodeId: 'ML-NODE-R3', status: 'open', tags: ['Games', 'Kids'], attributes: [], storeNumber: '208', openingTime: '10:00', closingTime: '23:00' },
  { id: 'L2-TOYSRUS', nameEn: 'Toys R Us', nameAr: 'تويز آر أص', type: 'store', category: 'cat-toys', floor: FloorID.L2, mallAddress: 'L2-219', polygon: gr(800, 800, 300, 300), entryNodeId: 'ML-NODE-L1', status: 'open', tags: ['Toys'], attributes: [], storeNumber: '219', openingTime: '10:00', closingTime: '22:00' },

  // --- COMMUNITY HUB ---
  { id: 'ML-ETISALAT', nameEn: 'Etisalat', nameAr: 'اتصالات', type: 'store', category: 'cat-electronics', floor: FloorID.ML, mallAddress: 'ML-217', polygon: gr(1900, 1100, 120, 120), entryNodeId: 'ML-NODE-R3', status: 'open', tags: ['Telecom', 'Tech'], attributes: [], storeNumber: '217', openingTime: '10:00', closingTime: '22:00', isPromoted: true },
  { id: 'ML-DU', nameEn: 'DU', nameAr: 'دو', type: 'store', category: 'cat-electronics', floor: FloorID.ML, mallAddress: 'ML-89', polygon: gr(2050, 1100, 100, 100), entryNodeId: 'ML-NODE-R3', status: 'open', tags: ['Telecom', 'Tech'], attributes: [], storeNumber: '89', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-ALANSARI', nameEn: 'Al Ansari Exchange', nameAr: 'الأنصاري للصرافة', type: 'store', category: 'cat-banks', floor: FloorID.ML, mallAddress: 'ML-70', polygon: gr(1600, 1100, 100, 100), entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Exchange', 'Money'], attributes: [], storeNumber: '70', openingTime: '08:00', closingTime: '23:00' },
  { id: 'GL-BUSTANMEDICAL', nameEn: 'Al Bustan Medical Center', nameAr: 'مركز البستان الطبي', type: 'medical', category: 'cat-medical', floor: FloorID.GL, mallAddress: 'GL-13', polygon: gr(500, 200, 150, 150), entryNodeId: 'ML-NODE-L1', status: 'open', tags: ['Clinic', 'Doctor'], attributes: [], storeNumber: '13', openingTime: '09:00', closingTime: '21:00' },
  { id: 'ML-BOOTS', nameEn: 'Boots Pharmacy', nameAr: 'صيدلية بوتس', type: 'medical', category: 'cat-medical', floor: FloorID.ML, mallAddress: 'ML-62', polygon: gr(650, 200, 100, 150), entryNodeId: 'ML-NODE-L1', status: 'open', tags: ['Pharmacy'], attributes: [], storeNumber: '62', openingTime: '10:00', closingTime: '22:00' },
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
