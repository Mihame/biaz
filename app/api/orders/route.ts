import { NextRequest, NextResponse } from 'next/server';
import {
  createOrder,
  getOrderById,
  getAllOrders,
  getOrdersStats,
  OrderStatus,
} from '@/lib/ordersStore';
import { checkAdminAuth } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      productId,
      size,
      quantity,
      fullName,
      phone,
      city,
      address,
      colorId,
      colorNameFr,
      colorNameAr,
      colorHex,
      notes,
      language,
    } = body;

    // 1. Basic payload sanity check
    if (!productId || !size || !fullName || !phone || !city || !address) {
      return NextResponse.json(
        {
          success: false,
          error:
            language === 'fr'
              ? 'Veuillez remplir tous les champs obligatoires (pointure, nom, téléphone, ville, adresse).'
              : 'يرجى ملء كافة الحقول الإلزامية (المقاس، الاسم، رقم الهاتف، المدينة، والعنوان).',
        },
        { status: 400 }
      );
    }

    // 2. Validate, calculate pricing server-side, and persist order in database
    const { order, error: orderError } = createOrder({
      productId: String(productId),
      size: Number(size),
      quantity: Number(quantity) || 1,
      fullName: String(fullName),
      phone: String(phone),
      city: String(city),
      address: String(address),
      colorId: colorId ? String(colorId) : undefined,
      colorNameFr: colorNameFr ? String(colorNameFr) : undefined,
      colorNameAr: colorNameAr ? String(colorNameAr) : undefined,
      colorHex: colorHex ? String(colorHex) : undefined,
      notes: notes ? String(notes) : undefined,
      language: language === 'ar' ? 'ar' : 'fr',
    });

    if (orderError || !order) {
      return NextResponse.json(
        {
          success: false,
          error: orderError || 'Impossible d’enregistrer la commande.',
        },
        { status: 400 }
      );
    }

    // 3. Return success response to the client with the real generated Order ID
    return NextResponse.json(
      {
        success: true,
        orderId: order.orderId,
        orderStatus: order.status,
        order: {
          orderId: order.orderId,
          createdAt: order.createdAt,
          item: order.item,
          pricing: order.pricing,
          customer: order.customer,
          language: order.language,
          status: order.status,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[API /api/orders] Unhandled error creating order:', err);
    return NextResponse.json(
      {
        success: false,
        error:
          'حدث خطأ غير متوقع أثناء تسجيل طلبكم. يرجى التأكد من البيانات والمحاولة مجدداً.',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    // 1. Single order lookup (e.g. customer checking their order reference)
    if (orderId) {
      const order = getOrderById(orderId);
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'الطلب غير موجود / Commande introuvable' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        order: {
          orderId: order.orderId,
          createdAt: order.createdAt,
          status: order.status,
          item: order.item,
          pricing: order.pricing,
          customer: {
            fullName: order.customer.fullName,
            city: order.customer.city,
          },
        },
      });
    }

    // 2. Listing all orders: STRICTLY RESERVED FOR AUTHENTICATED ADMIN
    const isAdmin = checkAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'غير مصرح لك بالوصول إلى بيانات الطلبات. يرجى تسجيل الدخول كمسؤول.',
        },
        { status: 401 }
      );
    }

    let orders = getAllOrders();

    // Optional query filters for the admin dashboard
    const statusFilter = searchParams.get('status') as OrderStatus | null;
    const query = searchParams.get('q')?.trim().toLowerCase();
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    if (statusFilter && statusFilter !== ('all' as any)) {
      orders = orders.filter((o) => o.status === statusFilter);
    }

    if (query) {
      orders = orders.filter((o) => {
        return (
          o.orderId.toLowerCase().includes(query) ||
          o.customer.fullName.toLowerCase().includes(query) ||
          o.customer.phone.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
          o.customer.city.toLowerCase().includes(query) ||
          o.item.modelName.toLowerCase().includes(query)
        );
      });
    }

    if (dateFrom) {
      const fromTime = new Date(dateFrom).getTime();
      orders = orders.filter((o) => new Date(o.createdAt).getTime() >= fromTime);
    }

    if (dateTo) {
      const toTime = new Date(dateTo).setHours(23, 59, 59, 999);
      orders = orders.filter((o) => new Date(o.createdAt).getTime() <= toTime);
    }

    const stats = getOrdersStats();

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
      stats,
    });
  } catch (err: any) {
    console.error('[API /api/orders GET] Error fetching orders:', err);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}
