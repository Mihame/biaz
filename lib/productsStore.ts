import fs from 'fs';
import path from 'path';
import { Product, ProductColorVariant, ShoeSize } from '@/data/types';
import { PRODUCTS } from '@/data/products';

const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'data', 'products-db.json');

// In-memory cache for fast lookups
let productsCache: Product[] | null = null;

/**
 * Standard default shoe sizes
 */
export const DEFAULT_SHOE_SIZES: ShoeSize[] = [
  { eu: 39, cm: 25.5, status: 'in_stock', stock: 5 },
  { eu: 40, cm: 26.0, status: 'in_stock', stock: 8 },
  { eu: 41, cm: 26.5, status: 'in_stock', stock: 12 },
  { eu: 42, cm: 27.0, status: 'in_stock', stock: 10 },
  { eu: 43, cm: 27.5, status: 'in_stock', stock: 6 },
  { eu: 44, cm: 28.0, status: 'in_stock', stock: 4 },
  { eu: 45, cm: 28.5, status: 'in_stock', stock: 3 },
];

/**
 * Load products from disk, or initialize with hardcoded PRODUCTS
 */
function loadProducts(): Product[] {
  if (productsCache !== null) {
    return productsCache;
  }

  try {
    if (fs.existsSync(PRODUCTS_FILE_PATH)) {
      const content = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf-8');
      if (content.trim()) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          productsCache = parsed;
          return productsCache!;
        }
      }
    }
  } catch (err) {
    console.warn('[BIAZ Products Store] Could not read products-db.json, falling back to default PRODUCTS:', err);
  }

  // Initialize with PRODUCTS from data/products.ts
  productsCache = JSON.parse(JSON.stringify(PRODUCTS));
  persistProducts();
  return productsCache!;
}

/**
 * Persist products cache to JSON file
 */
function persistProducts(): void {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (productsCache) {
      fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(productsCache, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[BIAZ Products Store] Could not write products-db.json:', err);
  }
}

/**
 * Get all products
 */
export function getAllProducts(includeInactive = false): Product[] {
  const list = loadProducts();
  if (includeInactive) {
    return list;
  }
  return list.filter((p) => p.isActive !== false);
}

/**
 * Find product by ID or Slug
 */
export function getProductById(idOrSlug: string): Product | undefined {
  const list = loadProducts();
  return list.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

/**
 * Generate a slug from model name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `soulier-${Date.now()}`;
}

/**
 * Create or update a product with full color variants, sizes, and stock
 */
export function saveProduct(input: Partial<Product> & { modelName: string }): Product {
  const list = loadProducts();
  const isUpdate = Boolean(input.id && list.some((p) => p.id === input.id));

  const productId = input.id || `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const slug = input.slug || generateSlug(input.modelName);

  // Normalize colors
  const rawColors: ProductColorVariant[] = (input.colors && input.colors.length > 0)
    ? input.colors
    : [
        {
          id: `c-${Date.now()}-1`,
          colorNameFr: input.colorNameFr || 'Noir Ébène',
          colorNameAr: input.colorNameAr || 'أسود أبنوسي',
          colorHex: input.colorHex || '#181716',
          inStock: true,
          images: input.images || [
            {
              label: 'Vue principale',
              angle: 'side',
              url: '/images/hero_oxford_leather_1792953837188.jpg',
              alt: input.modelName,
            },
          ],
          availableSizes: input.availableSizes || DEFAULT_SHOE_SIZES,
        },
      ];

  // Primary color is the first color in the list
  const primaryColor = rawColors[0];

  // Default images from primary color (max 3)
  const primaryImages = (primaryColor.images && primaryColor.images.length > 0)
    ? primaryColor.images.slice(0, 3)
    : [
        {
          label: 'Vue principale',
          angle: 'side' as const,
          url: '/images/hero_oxford_leather_1792953837188.jpg',
          alt: input.modelName,
        },
      ];

  // Default available sizes from primary color
  const primarySizes = (primaryColor.availableSizes && primaryColor.availableSizes.length > 0)
    ? primaryColor.availableSizes
    : (input.availableSizes || DEFAULT_SHOE_SIZES);

  const productRecord: Product = {
    id: productId,
    slug,
    modelName: input.modelName.trim(),
    shoeTypeFr: input.shoeTypeFr?.trim() || 'Soulier en cuir artisanal',
    shoeTypeAr: input.shoeTypeAr?.trim() || 'حذاء جلدي فاخر مصنوع يدوياً',
    style: input.style || 'oxford',
    occasion: input.occasion || 'work',
    priceMAD: Number(input.priceMAD) || 1850,
    isBestSeller: Boolean(input.isBestSeller),
    isActive: input.isActive !== false,
    width: input.width || 'standard',
    // Mirror primary color for legacy backwards compatibility
    colorNameFr: primaryColor.colorNameFr || 'Noir Ébène',
    colorNameAr: primaryColor.colorNameAr || 'أسود أبنوسي',
    colorHex: primaryColor.colorHex || '#181716',
    images: primaryImages,
    availableSizes: primarySizes,
    colors: rawColors.map((c, idx) => ({
      ...c,
      id: c.id || `c-${productId}-${idx + 1}`,
      images: (c.images && c.images.length > 0) ? c.images.slice(0, 3) : primaryImages,
      availableSizes: (c.availableSizes && c.availableSizes.length > 0) ? c.availableSizes : primarySizes,
      inStock: c.inStock !== false,
    })),
    betweenSizesAdviceFr:
      input.betweenSizesAdviceFr ||
      'Ce modèle chausse fidèlement. Si vous hésitez entre deux pointures, nous vous recommandons de choisir la plus petite.',
    betweenSizesAdviceAr:
      input.betweenSizesAdviceAr ||
      'هذا الموديل يأتي بمقاسات دقيقة ومريحة. إذا كنت متردداً بين مقاسين، ننصحك باختيار المقاس الأصغر.',
    descriptionFr:
      input.descriptionFr ||
      'Soulier d’exception taillé dans les cuirs de veau les plus nobles. Montage soigné garantissant souplesse et pérennité.',
    descriptionAr:
      input.descriptionAr ||
      'حذاء استثنائي مصنوع من أجود أنواع الجلود الطبيعية. خياطة وتجميع متقنان يضمنان راحة مشي استثنائية وأناقة تدوم لسنوات.',
    specs: input.specs || {
      leatherType: 'Cuir de veau pleine fleur sélectionné',
      leatherOrigin: 'Tannerie d’excellence',
      construction: 'Montage Blake cousu sur semelle cuir',
      lining: 'Doublure intégrale en cuir de veau respirant',
      sole: 'Semelle en cuir tannage végétal',
      lastWidth: 'Largeur standard équilibrée',
      finish: 'Patiné à la main, ciré naturel',
    },
    careGuideFr: input.careGuideFr || [
      'Insérer des embauchoirs en bois après chaque port.',
      'Dépoussiérer avec une brosse douce en crin de cheval.',
      'Nourrir le cuir tous les 15 jours avec un cirage adapté.',
    ],
    careGuideAr: input.careGuideAr || [
      'استخدام قوالب خشبية بعد كل ارتداء لامتصاص الرطوبة والحفاظ على شكل الحذاء.',
      'تنظيف الغبار بفرشاة ناعمة من شعر الخيل الطبيعي.',
      'تغذية الجلد بانتظام بكريم مغذٍ للحفاظ على ليونته وبريقه.',
    ],
    shippingAdviceFr: input.shippingAdviceFr || 'Livraison gratuite partout au Maroc avec essayage à domicile.',
    shippingAdviceAr: input.shippingAdviceAr || 'توصيل مجاني لكافة مدن المغرب مع إمكانية المعاينة والتجربة عند الاستلام.',
    reviews: input.reviews || [],
    complementaryAddons: input.complementaryAddons || [],
  };

  if (isUpdate) {
    const idx = list.findIndex((p) => p.id === productId);
    if (idx !== -1) {
      list[idx] = productRecord;
    }
  } else {
    list.unshift(productRecord);
  }

  productsCache = list;
  persistProducts();

  return productRecord;
}

/**
 * Delete a product by ID
 */
export function deleteProduct(productId: string): boolean {
  const list = loadProducts();
  const initialLength = list.length;
  const filtered = list.filter((p) => p.id !== productId);

  if (filtered.length !== initialLength) {
    productsCache = filtered;
    persistProducts();
    return true;
  }

  return false;
}
