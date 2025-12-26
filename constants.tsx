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
  // MAIN LEVEL (ML) - Digitized from actual floor plan

  // LEFT WING - BBY & max
  { id: 'ML-93', nameEn: 'BBY', nameAr: 'بي بي واي', type: 'store', category: 'cat-electronics', floor: FloorID.ML, mallAddress: 'ML-93', polygon: [[100,330],[200,330],[200,650],[100,650]], entryNodeId: 'ML-NODE-W1', status: 'open', tags: ['Electronics'], attributes: [], storeNumber: '93', openingTime: '10:00', closingTime: '22:00', isPromoted: true },
  { id: 'ML-92', nameEn: 'max', nameAr: 'ماكس', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-92', polygon: [[270,550],[480,550],[480,750],[270,750]], entryNodeId: 'ML-NODE-W1', status: 'open', tags: ['Fashion', 'Value'], attributes: [], storeNumber: '92', openingTime: '10:00', closingTime: '22:00', isPromoted: true },

  // LEFT CORRIDOR STORES
  { id: 'ML-91', nameEn: 'Crocs', nameAr: 'كروكس', type: 'store', category: 'cat-bags', floor: FloorID.ML, mallAddress: 'ML-91', polygon: [[630,560],[730,560],[730,620],[630,620]], entryNodeId: 'ML-NODE-W2', status: 'open', tags: ['Footwear'], attributes: [], storeNumber: '91', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-89', nameEn: 'Dunkin Donuts', nameAr: 'دانكن دونتس', type: 'coffee', category: 'cat-cafes', floor: FloorID.ML, mallAddress: 'ML-89', polygon: [[630,640],[730,640],[730,700],[630,700]], entryNodeId: 'ML-NODE-W2', status: 'open', tags: ['Coffee', 'Donuts'], attributes: [], storeNumber: '89', openingTime: '07:00', closingTime: '23:00', isPromoted: true },
  { id: 'ML-88', nameEn: 'Adidas', nameAr: 'أديداس', type: 'store', category: 'cat-sportswear', floor: FloorID.ML, mallAddress: 'ML-88', polygon: [[750,640],[870,640],[870,720],[750,720]], entryNodeId: 'ML-NODE-W2', status: 'open', tags: ['Sportswear'], attributes: [], storeNumber: '88', openingTime: '10:00', closingTime: '22:00', isPromoted: true },
  { id: 'ML-87', nameEn: 'Store 87', nameAr: 'متجر 87', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-87', polygon: [[890,640],[990,640],[990,710],[890,710]], entryNodeId: 'ML-NODE-W2', status: 'open', tags: [], attributes: [], storeNumber: '87', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-86', nameEn: 'Store 86', nameAr: 'متجر 86', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-86', polygon: [[890,560],[990,560],[990,620],[890,620]], entryNodeId: 'ML-NODE-W2', status: 'open', tags: [], attributes: [], storeNumber: '86', openingTime: '10:00', closingTime: '22:00' },

  // TOP SECTION - Centrepoint
  { id: 'ML-47', nameEn: 'Centrepoint', nameAr: 'سنتربوينت', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-47', polygon: [[200,200],[600,200],[600,500],[200,500]], entryNodeId: 'ML-NODE-W1', status: 'open', tags: ['Fashion', 'Department Store'], attributes: [], storeNumber: '47', openingTime: '10:00', closingTime: '22:00', isPromoted: true },

  // CENTRAL TOP CORRIDOR
  { id: 'ML-48', nameEn: 'Store 48', nameAr: 'متجر 48', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-48', polygon: [[630,540],[730,540],[730,480],[630,480]], entryNodeId: 'ML-NODE-C1', status: 'open', tags: [], attributes: [], storeNumber: '48', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-49', nameEn: 'Store 49', nameAr: 'متجر 49', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-49', polygon: [[750,540],[850,540],[850,480],[750,480]], entryNodeId: 'ML-NODE-C1', status: 'open', tags: [], attributes: [], storeNumber: '49', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-51', nameEn: 'Store 51', nameAr: 'متجر 51', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-51', polygon: [[870,540],[970,540],[970,480],[870,480]], entryNodeId: 'ML-NODE-C1', status: 'open', tags: [], attributes: [], storeNumber: '51', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-52', nameEn: 'Store 52', nameAr: 'متجر 52', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-52', polygon: [[990,540],[1090,540],[1090,480],[990,480]], entryNodeId: 'ML-NODE-C1', status: 'open', tags: [], attributes: [], storeNumber: '52', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-53', nameEn: 'Store 53', nameAr: 'متجر 53', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-53', polygon: [[1110,540],[1210,540],[1210,480],[1110,480]], entryNodeId: 'ML-NODE-C2', status: 'open', tags: [], attributes: [], storeNumber: '53', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-54', nameEn: 'Store 54', nameAr: 'متجر 54', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-54', polygon: [[1230,540],[1330,540],[1330,480],[1230,480]], entryNodeId: 'ML-NODE-C2', status: 'open', tags: [], attributes: [], storeNumber: '54', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-55', nameEn: 'Store 55', nameAr: 'متجر 55', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-55', polygon: [[1350,540],[1450,540],[1450,480],[1350,480]], entryNodeId: 'ML-NODE-C2', status: 'open', tags: [], attributes: [], storeNumber: '55', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-56', nameEn: 'Store 56', nameAr: 'متجر 56', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-56', polygon: [[1470,540],[1570,540],[1570,480],[1470,480]], entryNodeId: 'ML-NODE-C2', status: 'open', tags: [], attributes: [], storeNumber: '56', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-57', nameEn: 'ALDO', nameAr: 'ألدو', type: 'store', category: 'cat-bags', floor: FloorID.ML, mallAddress: 'ML-57', polygon: [[1590,540],[1690,540],[1690,480],[1590,480]], entryNodeId: 'ML-NODE-C2', status: 'open', tags: ['Shoes', 'Accessories'], attributes: [], storeNumber: '57', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-58', nameEn: 'Starbucks', nameAr: 'ستاربكس', type: 'coffee', category: 'cat-cafes', floor: FloorID.ML, mallAddress: 'ML-58', polygon: [[1710,540],[1810,540],[1810,480],[1710,480]], entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Coffee'], attributes: [], storeNumber: '58', openingTime: '07:00', closingTime: '23:00', isPromoted: true },
  { id: 'ML-59', nameEn: 'Store 59', nameAr: 'متجر 59', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-59', polygon: [[1280,540],[1380,540],[1380,480],[1280,480]], entryNodeId: 'ML-NODE-C3', status: 'open', tags: [], attributes: [], storeNumber: '59', openingTime: '10:00', closingTime: '22:00' },

  // ATRIUM AREA
  { id: 'ML-ATRIUM', nameEn: 'Grand Atrium', nameAr: 'الردهة الكبرى', type: 'atrium', category: 'cat-specialty-stores', floor: FloorID.ML, mallAddress: 'ML-ATRIUM', polygon: [[1250,650],[1550,650],[1550,850],[1250,850]], entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Landmark'], attributes: [], storeNumber: 'ATRIUM', openingTime: '00:00', closingTime: '23:59' },

  // RIGHT SIDE TOP CORRIDOR
  { id: 'ML-60', nameEn: 'Store 60', nameAr: 'متجر 60', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-60', polygon: [[1380,540],[1480,540],[1480,480],[1380,480]], entryNodeId: 'ML-NODE-C3', status: 'open', tags: [], attributes: [], storeNumber: '60', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-61', nameEn: 'KARU', nameAr: 'كارو', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-61', polygon: [[1420,540],[1520,540],[1520,480],[1420,480]], entryNodeId: 'ML-NODE-C3', status: 'open', tags: [], attributes: [], storeNumber: '61', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-62', nameEn: 'Store 62', nameAr: 'متجر 62', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-62', polygon: [[1540,540],[1640,540],[1640,480],[1540,480]], entryNodeId: 'ML-NODE-C3', status: 'open', tags: [], attributes: [], storeNumber: '62', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-63', nameEn: 'Store 63', nameAr: 'متجر 63', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-63', polygon: [[1660,540],[1760,540],[1760,480],[1660,480]], entryNodeId: 'ML-NODE-C3', status: 'open', tags: [], attributes: [], storeNumber: '63', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-64', nameEn: 'Store 64', nameAr: 'متجر 64', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-64', polygon: [[1540,540],[1640,540],[1640,480],[1540,480]], entryNodeId: 'ML-NODE-C3', status: 'open', tags: [], attributes: [], storeNumber: '64', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-65', nameEn: 'Store 65', nameAr: 'متجر 65', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-65', polygon: [[1780,540],[1880,540],[1880,480],[1780,480]], entryNodeId: 'ML-NODE-E1', status: 'open', tags: [], attributes: [], storeNumber: '65', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-66', nameEn: 'Store 66', nameAr: 'متجر 66', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-66', polygon: [[1900,540],[2000,540],[2000,480],[1900,480]], entryNodeId: 'ML-NODE-E1', status: 'open', tags: [], attributes: [], storeNumber: '66', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-67', nameEn: 'Store 67', nameAr: 'متجر 67', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-67', polygon: [[2020,540],[2120,540],[2120,480],[2020,480]], entryNodeId: 'ML-NODE-E1', status: 'open', tags: [], attributes: [], storeNumber: '67', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-68', nameEn: 'Store 68', nameAr: 'متجر 68', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-68', polygon: [[2140,540],[2240,540],[2240,480],[2140,480]], entryNodeId: 'ML-NODE-E1', status: 'open', tags: [], attributes: [], storeNumber: '68', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-69', nameEn: 'Store 69', nameAr: 'متجر 69', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-69', polygon: [[2260,540],[2360,540],[2360,480],[2260,480]], entryNodeId: 'ML-NODE-E1', status: 'open', tags: [], attributes: [], storeNumber: '69', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-70', nameEn: 'KIKO', nameAr: 'كيكو', type: 'store', category: 'cat-beauty', floor: FloorID.ML, mallAddress: 'ML-70', polygon: [[2200,540],[2300,540],[2300,480],[2200,480]], entryNodeId: 'ML-NODE-E2', status: 'open', tags: ['Cosmetics'], attributes: [], storeNumber: '70', openingTime: '10:00', closingTime: '22:00' },

  // H&M ANCHOR
  { id: 'ML-79', nameEn: 'H&M', nameAr: 'اتش آند ام', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-79', polygon: [[1570,780],[1950,780],[1950,1100],[1570,1100]], entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: ['Fashion'], attributes: [], storeNumber: '79', openingTime: '10:00', closingTime: '22:00', isPromoted: true },

  // BOTTOM CORRIDOR
  { id: 'ML-85', nameEn: 'Moda', nameAr: 'مودا', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-85', polygon: [[950,770],[1100,770],[1100,850],[950,850]], entryNodeId: 'ML-NODE-W2', status: 'open', tags: ['Fashion'], attributes: [], storeNumber: '85', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-84', nameEn: 'Store 84', nameAr: 'متجر 84', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-84', polygon: [[1030,640],[1130,640],[1130,700],[1030,700]], entryNodeId: 'ML-NODE-C1', status: 'open', tags: [], attributes: [], storeNumber: '84', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-83', nameEn: 'Store 83', nameAr: 'متجر 83', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-83', polygon: [[1150,640],[1230,640],[1230,700],[1150,700]], entryNodeId: 'ML-NODE-C1', status: 'open', tags: [], attributes: [], storeNumber: '83', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-82', nameEn: 'Store 82', nameAr: 'متجر 82', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-82', polygon: [[1370,640],[1450,640],[1450,700],[1370,700]], entryNodeId: 'ML-NODE-C2', status: 'open', tags: [], attributes: [], storeNumber: '82', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-81', nameEn: 'Store 81', nameAr: 'متجر 81', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-81', polygon: [[1250,790],[1320,790],[1320,850],[1250,850]], entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: [], attributes: [], storeNumber: '81', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-80', nameEn: 'Store 80', nameAr: 'متجر 80', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-80', polygon: [[1250,870],[1350,870],[1350,950],[1250,950]], entryNodeId: 'ML-NODE-ATRIUM', status: 'open', tags: [], attributes: [], storeNumber: '80', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-78', nameEn: 'Store 78', nameAr: 'متجر 78', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-78', polygon: [[1970,780],[2070,780],[2070,850],[1970,850]], entryNodeId: 'ML-NODE-E1', status: 'open', tags: [], attributes: [], storeNumber: '78', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-77', nameEn: 'Store 77', nameAr: 'متجر 77', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-77', polygon: [[2070,870],[2150,870],[2150,940],[2070,940]], entryNodeId: 'ML-NODE-E1', status: 'open', tags: [], attributes: [], storeNumber: '77', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-76', nameEn: 'Store 76', nameAr: 'متجر 76', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-76', polygon: [[2170,780],[2250,780],[2250,850],[2170,850]], entryNodeId: 'ML-NODE-E1', status: 'open', tags: [], attributes: [], storeNumber: '76', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-75', nameEn: 'Store 75', nameAr: 'متجر 75', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-75', polygon: [[2170,870],[2250,870],[2250,940],[2170,940]], entryNodeId: 'ML-NODE-E1', status: 'open', tags: [], attributes: [], storeNumber: '75', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-74', nameEn: 'Store 74', nameAr: 'متجر 74', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-74', polygon: [[2270,780],[2350,780],[2350,850],[2270,850]], entryNodeId: 'ML-NODE-E2', status: 'open', tags: [], attributes: [], storeNumber: '74', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-73', nameEn: 'Store 73', nameAr: 'متجر 73', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-73', polygon: [[2270,870],[2350,870],[2350,940],[2270,940]], entryNodeId: 'ML-NODE-E2', status: 'open', tags: [], attributes: [], storeNumber: '73', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-72A', nameEn: 'Store 72A', nameAr: 'متجر 72أ', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-72A', polygon: [[2370,540],[2470,540],[2470,480],[2370,480]], entryNodeId: 'ML-NODE-E2', status: 'open', tags: [], attributes: [], storeNumber: '72A', openingTime: '10:00', closingTime: '22:00' },
  { id: 'ML-71B', nameEn: 'Store 71B', nameAr: 'متجر 71ب', type: 'store', category: 'cat-fashion', floor: FloorID.ML, mallAddress: 'ML-71B', polygon: [[2370,540],[2470,540],[2470,480],[2370,480]], entryNodeId: 'ML-NODE-E2', status: 'open', tags: [], attributes: [], storeNumber: '71B', openingTime: '10:00', closingTime: '22:00' },

  // CARREFOUR ANCHOR
  { id: 'ML-72', nameEn: 'Carrefour', nameAr: 'كارفور', type: 'store', category: 'cat-hypermarket', floor: FloorID.ML, mallAddress: 'ML-72', polygon: [[2400,200],[3100,200],[3100,1000],[2400,1000]], entryNodeId: 'ML-NODE-E2', status: 'open', tags: ['Hypermarket', 'Groceries'], attributes: [], storeNumber: '72', openingTime: '08:00', closingTime: '00:00', taglineEn: 'Everything you need.', taglineAr: 'كل ما تحتاجه.', isPromoted: true },
];

export const INITIAL_NODES: NavNode[] = [
  // West Wing
  { id: 'ML-NODE-W1', floor: FloorID.ML, x: 300, y: 500, type: 'corridor' },
  { id: 'ML-NODE-W2', floor: FloorID.ML, x: 800, y: 680, type: 'corridor' },

  // Central Corridor
  { id: 'ML-NODE-C1', floor: FloorID.ML, x: 1000, y: 510, type: 'corridor' },
  { id: 'ML-NODE-C2', floor: FloorID.ML, x: 1400, y: 510, type: 'corridor' },
  { id: 'ML-NODE-C3', floor: FloorID.ML, x: 1700, y: 510, type: 'corridor' },

  // Atrium
  { id: 'ML-NODE-ATRIUM', labelEn: 'Grand Atrium', labelAr: 'الردهة الكبرى', floor: FloorID.ML, x: 1400, y: 750, type: 'atrium', isLandmark: true, landmarkIcon: '🏛️' },

  // East Wing
  { id: 'ML-NODE-E1', floor: FloorID.ML, x: 2000, y: 600, type: 'corridor' },
  { id: 'ML-NODE-E2', floor: FloorID.ML, x: 2400, y: 600, type: 'corridor' },
];

export const INITIAL_CONNECTIONS: Connection[] = [
  // West Wing connections
  { from: 'ML-NODE-W1', to: 'ML-NODE-W2', accessible: true },
  { from: 'ML-NODE-W2', to: 'ML-NODE-C1', accessible: true },

  // Central corridor connections
  { from: 'ML-NODE-C1', to: 'ML-NODE-C2', accessible: true },
  { from: 'ML-NODE-C2', to: 'ML-NODE-C3', accessible: true },
  { from: 'ML-NODE-C2', to: 'ML-NODE-ATRIUM', accessible: true },
  { from: 'ML-NODE-C3', to: 'ML-NODE-E1', accessible: true },

  // East Wing connections
  { from: 'ML-NODE-E1', to: 'ML-NODE-E2', accessible: true },
  { from: 'ML-NODE-ATRIUM', to: 'ML-NODE-E1', accessible: true },
];