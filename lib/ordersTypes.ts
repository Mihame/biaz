export type OrderStatus =
  | 'new'          // جديد
  | 'reviewed'     // تمت مراجعة الطلب
  | 'confirmed'    // تم تأكيد الطلب
  | 'processing'   // قيد التجهيز
  | 'shipped'      // تم الشحن
  | 'delivered'    // تم التسليم
  | 'cancelled';   // ملغى

export interface OrderItem {
  productId: string;
  modelName: string;
  shoeTypeFr: string;
  shoeTypeAr: string;
  colorNameFr: string;
  colorNameAr: string;
  colorHex?: string;
  colorId?: string;
  unitPriceMAD: number;
  size: number;
  quantity: number;
  totalMAD: number;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  updatedAt?: string;
  status: OrderStatus;
  item: OrderItem;
  pricing: {
    subtotalMAD: number;
    deliveryFeeMAD: number;
    totalMAD: number;
    currency: string;
  };
  customer: OrderCustomer;
  language: 'ar' | 'fr';
}

export interface CreateOrderInput {
  productId: string;
  size: number;
  quantity: number;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  colorId?: string;
  colorNameFr?: string;
  colorNameAr?: string;
  colorHex?: string;
  notes?: string;
  language?: 'ar' | 'fr';
}

export const ORDER_STATUS_META: Record<
  OrderStatus,
  {
    labelAr: string;
    labelFr: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    dotClass: string;
  }
> = {
  new: {
    labelAr: 'جديد',
    labelFr: 'Nouveau',
    colorClass: 'text-amber-800',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-300',
    dotClass: 'bg-amber-500',
  },
  reviewed: {
    labelAr: 'تمت مراجعة الطلب',
    labelFr: 'Commande révisée',
    colorClass: 'text-sky-800',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-300',
    dotClass: 'bg-sky-500',
  },
  confirmed: {
    labelAr: 'تم تأكيد الطلب',
    labelFr: 'Commande confirmée',
    colorClass: 'text-emerald-800',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
    dotClass: 'bg-emerald-500',
  },
  processing: {
    labelAr: 'قيد التجهيز',
    labelFr: 'En préparation',
    colorClass: 'text-purple-800',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-300',
    dotClass: 'bg-purple-500',
  },
  shipped: {
    labelAr: 'تم الشحن',
    labelFr: 'Expédiée',
    colorClass: 'text-indigo-800',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-300',
    dotClass: 'bg-indigo-500',
  },
  delivered: {
    labelAr: 'تم التسليم',
    labelFr: 'Livrée avec succès',
    colorClass: 'text-green-900',
    bgClass: 'bg-green-100',
    borderClass: 'border-green-400',
    dotClass: 'bg-green-600',
  },
  cancelled: {
    labelAr: 'ملغى',
    labelFr: 'Annulée',
    colorClass: 'text-rose-800',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-300',
    dotClass: 'bg-rose-500',
  },
};

/**
 * Formats a clean international phone number for Morocco (e.g. 0661... -> 212661...)
 */
export function formatMoroccanPhoneForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('00212')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '212' + cleaned.substring(1);
  } else if (!cleaned.startsWith('212') && cleaned.length === 9) {
    cleaned = '212' + cleaned;
  }
  return cleaned;
}

/**
 * Generates an optional manual WhatsApp conversation URL targeting the CUSTOMER's phone
 */
export function formatCustomerManualWhatsAppUrl(order: OrderRecord): string {
  const customerPhoneClean = formatMoroccanPhoneForWhatsApp(order.customer.phone);

  let message = '';
  if (order.language === 'fr') {
    message = `Bonjour ${order.customer.fullName},\n\n` +
      `C'est le service client *BIAZ Shoes* concernant votre commande n° *${order.orderId}*.\n\n` +
      `📦 Soulier : *${order.item.modelName}* (${order.item.shoeTypeFr})\n` +
      `• Pointure : *${order.item.size}*\n` +
      `• Quantité : ${order.item.quantity}\n` +
      `• Total à régler à la livraison : *${order.pricing.totalMAD.toLocaleString()} MAD* (Livraison gratuite et essayage avant paiement)\n` +
      `📍 Ville & Adresse : ${order.customer.city} - ${order.customer.address}\n\n` +
      `Nous préparons votre colis. Merci de nous confirmer votre disponibilité pour la réception.\n\n` +
      `Bien cordialement,\n*BIAZ Shoes*`;
  } else {
    message = `السلام عليكم ورحمة الله، أستاذ ${order.customer.fullName}\n\n` +
      `معكم خدمة عملاء *BIAZ Shoes* بخصوص طلبكم المسجل برقم: *${order.orderId}*\n\n` +
      `👞 *تفاصيل الحذاء:* ${order.item.modelName} (${order.item.shoeTypeAr})\n` +
      `• المقاس: *${order.item.size}*\n` +
      `• الكمية: ${order.item.quantity}\n` +
      `• المبلغ الإجمالي عند الاستلام: *${order.pricing.totalMAD.toLocaleString()} د.م.* (التوصيل مجاني والمعاينة والقياس عند الاستلام)\n` +
      `📍 *عنوان التوصيل:* ${order.customer.city} - ${order.customer.address}\n\n` +
      `نود تأكيد موعد وخطة الشحن المناسبة لكم لنقوم بإرسال الطرد مع الموزع.\n\n` +
      `مع خالص التقدير،\n*BIAZ Shoes*`;
  }

  return `https://wa.me/${customerPhoneClean}?text=${encodeURIComponent(message)}`;
}
