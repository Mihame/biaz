import fs from 'fs';
import path from 'path';
import { PRODUCTS } from '@/data/products';
import {
  OrderStatus,
  OrderRecord,
  CreateOrderInput,
} from './ordersTypes';

export * from './ordersTypes';

// In-memory cache for fast lookups & serverless resilience
const ordersMemoryStore: Map<string, OrderRecord> = new Map();

// Recent submission cache for idempotency (prevents rapid double-clicks)
const recentSubmissionsCache: Map<string, { timestamp: number; orderId: string }> = new Map();

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'orders-db.json');

// Helper to ensure file store exists and load initial records
function loadFileStore(): void {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      if (content.trim()) {
        const parsed: OrderRecord[] = JSON.parse(content);
        if (Array.isArray(parsed)) {
          parsed.forEach((order) => {
            if (order && order.orderId) {
              if ((order.status as any) === 'received') {
                order.status = 'new';
              }
              ordersMemoryStore.set(order.orderId, order);
            }
          });
        }
      }
    }
  } catch (err) {
    console.warn('[BIAZ Orders Store] Could not read orders database file, using in-memory store:', err);
  }
}

// Save in-memory store to file (fail-safe for read-only environments)
function persistToFileStore(): void {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const ordersArray = Array.from(ordersMemoryStore.values());
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(ordersArray, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[BIAZ Orders Store] Could not write to orders database file, state kept in memory:', err);
  }
}

// Initialize on module load
loadFileStore();

/**
 * Generate a unique and prestigious BIAZ order reference
 * Format: BZ-YYYYMMDD-XXXX (e.g. BZ-20261026-4821)
 */
export function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `BZ-${year}${month}${day}-${randomSuffix}`;
}

export interface OrderCreationInput {
  productId: string;
  size: number;
  quantity: number;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  language?: 'ar' | 'fr';
}

/**
 * Validates, calculates and saves a new order server-side with idempotency protection
 */
export function createOrder(input: OrderCreationInput): { order?: OrderRecord; error?: string } {
  // 1. Validate Product
  const product = PRODUCTS.find((p) => p.id === input.productId);
  if (!product) {
    return { error: 'المنتج المطلوب غير موجود / Produit introuvable.' };
  }

  // 2. Validate Size
  const sizeNum = Number(input.size);
  const isValidSize = product.availableSizes.some((s) => s.eu === sizeNum);
  if (!isValidSize) {
    return { error: `المقاس ${input.size} غير متوفر لهذا الموديل / Pointure non disponible pour ce modèle.` };
  }

  // 3. Validate Quantity
  const qty = Math.max(1, Math.min(10, Math.floor(Number(input.quantity) || 1)));

  // 4. Validate Customer Details
  const cleanName = (input.fullName || '').trim();
  const cleanPhone = (input.phone || '').trim();
  const cleanCity = (input.city || '').trim();
  const cleanAddress = (input.address || '').trim();

  if (!cleanName) {
    return { error: 'يرجى كتابة الاسم الكامل / Veuillez renseigner votre nom complet.' };
  }
  if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 8) {
    return { error: 'يرجى إدخال رقم هاتف صحيح للتواصل في المغرب / Numéro de téléphone invalide.' };
  }
  if (!cleanCity) {
    return { error: 'يرجى تحديد مدينة التوصيل / Veuillez indiquer votre ville de livraison.' };
  }
  if (!cleanAddress) {
    return { error: 'يرجى كتابة عنوان التوصيل بالتفصيل / Veuillez renseigner votre adresse de livraison.' };
  }

  // Idempotency check: hash customer phone + product + size within 15 seconds
  const idempotencyKey = `${cleanPhone}_${product.id}_${sizeNum}_${qty}`;
  const now = Date.now();
  const existingSub = recentSubmissionsCache.get(idempotencyKey);
  if (existingSub && now - existingSub.timestamp < 15000) {
    const cachedOrder = ordersMemoryStore.get(existingSub.orderId);
    if (cachedOrder) {
      return { order: cachedOrder };
    }
  }

  // 5. Server-side calculation (guaranteed pricing integrity)
  const unitPrice = product.priceMAD;
  const subtotal = unitPrice * qty;
  const deliveryFee = 0; // Free delivery everywhere in Morocco
  const total = subtotal + deliveryFee;

  // 6. Generate unique reference and timestamp
  const orderId = generateOrderId();
  const createdAt = new Date().toISOString();

  const newOrder: OrderRecord = {
    orderId,
    createdAt,
    status: 'new',
    item: {
      productId: product.id,
      modelName: product.modelName,
      shoeTypeFr: product.shoeTypeFr,
      shoeTypeAr: product.shoeTypeAr,
      colorNameFr: product.colorNameFr,
      colorNameAr: product.colorNameAr,
      unitPriceMAD: unitPrice,
      size: sizeNum,
      quantity: qty,
      totalMAD: total,
    },
    pricing: {
      subtotalMAD: subtotal,
      deliveryFeeMAD: deliveryFee,
      totalMAD: total,
      currency: 'MAD',
    },
    customer: {
      fullName: cleanName,
      phone: cleanPhone,
      city: cleanCity,
      address: cleanAddress,
      notes: input.notes?.trim() || undefined,
    },
    language: input.language === 'ar' ? 'ar' : 'fr',
  };

  ordersMemoryStore.set(orderId, newOrder);
  recentSubmissionsCache.set(idempotencyKey, { timestamp: now, orderId });
  persistToFileStore();

  return { order: newOrder };
}

/**
 * Updates order status and saves to database
 */
export function updateOrderStatus(orderId: string, newStatus: OrderStatus): OrderRecord | undefined {
  const order = ordersMemoryStore.get(orderId);
  if (!order) return undefined;

  order.status = newStatus;
  order.updatedAt = new Date().toISOString();

  ordersMemoryStore.set(orderId, order);
  persistToFileStore();

  return order;
}

/**
 * Deletes an order permanently from database
 */
export function deleteOrder(orderId: string): boolean {
  if (!ordersMemoryStore.has(orderId)) {
    return false;
  }
  ordersMemoryStore.delete(orderId);
  persistToFileStore();
  return true;
}

export function getOrderById(orderId: string): OrderRecord | undefined {
  return ordersMemoryStore.get(orderId);
}

export function getAllOrders(): OrderRecord[] {
  return Array.from(ordersMemoryStore.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Calculate live statistics from actual real database orders
 */
export function getOrdersStats() {
  const orders = getAllOrders();
  const total = orders.length;
  const newOrders = orders.filter((o) => o.status === 'new').length;
  const reviewed = orders.filter((o) => o.status === 'reviewed').length;
  const confirmed = orders.filter((o) => o.status === 'confirmed').length;
  const processing = orders.filter((o) => o.status === 'processing').length;
  const shipped = orders.filter((o) => o.status === 'shipped').length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const cancelled = orders.filter((o) => o.status === 'cancelled').length;

  // Total revenue of confirmed and delivered orders
  const confirmedRevenueMAD = orders
    .filter((o) => o.status === 'confirmed' || o.status === 'delivered' || o.status === 'shipped')
    .reduce((sum, o) => sum + o.pricing.totalMAD, 0);

  const totalAllRevenueMAD = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.pricing.totalMAD, 0);

  return {
    total,
    newOrders,
    reviewed,
    confirmed,
    processing,
    shipped,
    delivered,
    cancelled,
    confirmedRevenueMAD,
    totalAllRevenueMAD,
  };
}
