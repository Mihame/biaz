export type Language = 'fr' | 'ar';
export type Direction = 'ltr' | 'rtl';

export type ShoeStyle = 'oxford' | 'derby' | 'loafer' | 'boot';
export type Occasion = 'work' | 'wedding' | 'evening';
export type ShoeWidth = 'standard' | 'wide';

export type SizeAvailability = 'in_stock' | 'low_stock' | 'made_to_order';

export interface ShoeSize {
  eu: number;
  cm?: number;
  status: SizeAvailability;
  stock?: number;
}

export interface ProductImageAngle {
  label: string;
  angle: 'side' | 'top' | 'threeQuarter' | 'sole' | 'stitching' | 'lining' | 'onFoot' | 'scale';
  url: string;
  alt: string;
}

export interface ProductColorVariant {
  id: string;
  colorNameFr: string;
  colorNameAr: string;
  colorHex: string;
  images: ProductImageAngle[];
  availableSizes?: ShoeSize[];
  inStock?: boolean;
}

export interface ProductSpecs {
  leatherType: string;
  leatherOrigin: string;
  construction: string;
  lining: string;
  sole: string;
  lastWidth: string;
  finish: string;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  date: string;
  rating: number;
  title: string;
  content: string;
  verifiedBuyer: boolean;
  isIncentivized: boolean;
  sampleNotice: string;
  photoUrl?: string;
}

export interface AddonProduct {
  id: string;
  nameFr: string;
  nameAr: string;
  priceMAD: number;
  image: string;
  descriptionFr: string;
  descriptionAr: string;
}

export interface Product {
  id: string;
  slug: string;
  modelName: string;
  shoeTypeFr: string;
  shoeTypeAr: string;
  style: ShoeStyle;
  occasion: Occasion;
  colorNameFr: string;
  colorNameAr: string;
  colorHex: string;
  colors?: ProductColorVariant[];
  priceMAD: number;
  isBestSeller?: boolean;
  isActive?: boolean;
  width: ShoeWidth;
  images: ProductImageAngle[];
  availableSizes: ShoeSize[];
  betweenSizesAdviceFr: string;
  betweenSizesAdviceAr: string;
  descriptionFr: string;
  descriptionAr: string;
  specs: ProductSpecs;
  careGuideFr: string[];
  careGuideAr: string[];
  shippingAdviceFr: string;
  shippingAdviceAr: string;
  reviews: Review[];
  complementaryAddons: AddonProduct[];
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  product: Product;
  selectedSize: number;
  selectedWidth: ShoeWidth;
  quantity: number;
}

export interface MoroccanCity {
  id: string;
  nameFr: string;
  nameAr: string;
  deliveryDays: string;
  deliveryFeeMAD: number;
  isHub: boolean;
}

export interface CheckoutForm {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
  paymentMethod: 'cod' | 'card';
}

export interface Order {
  orderNumber: string;
  createdAt: string;
  customer: CheckoutForm;
  items: CartItem[];
  subtotalMAD: number;
  shippingMAD: number;
  totalMAD: number;
  status: 'pending_confirmation';
}

export type ViewState = 'home' | 'products' | 'about' | 'contact' | 'track-order';
