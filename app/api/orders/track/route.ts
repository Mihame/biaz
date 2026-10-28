import { NextRequest, NextResponse } from 'next/server';
import { trackOrder } from '@/lib/ordersStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, phone } = body || {};

    if (!orderId || typeof orderId !== 'string' || !phone || typeof phone !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'يرجى إدخال رقم الطلب ورقم الهاتف المرتبط به.',
          errorFr: 'Veuillez renseigner le numéro de commande et le numéro de téléphone associé.',
        },
        { status: 400 }
      );
    }

    const order = trackOrder(orderId, phone);

    // Secure generic message if not found to prevent user/order enumeration
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'تعذر العثور على طلب مطابق للبيانات المدخلة. يرجى التأكد من صحة رقم الطلب ورقم الهاتف والمحاولة مجدداً.',
          errorFr: 'Aucune commande ne correspond aux informations saisies. Veuillez vérifier votre numéro de commande et votre numéro de téléphone.',
        },
        { status: 404 }
      );
    }

    // Mask phone number for customer privacy: e.g. 06 12 34 56 78 -> 06 •• •• •• 78
    const rawPhone = (order.customer.phone || '').trim();
    const cleanDigits = rawPhone.replace(/\D/g, '');
    const maskedPhone = cleanDigits.length >= 8
      ? `${cleanDigits.slice(0, 2)} •••• ${cleanDigits.slice(-2)}`
      : '••••••';

    // Mask full name: e.g. "Karim Bennis" -> "Karim B."
    const nameParts = (order.customer.fullName || '').trim().split(/\s+/);
    const maskedName = nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
      : nameParts[0] || 'الزبون المحترم';

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        status: order.status,
        customerCity: order.customer.city,
        maskedCustomerName: maskedName,
        maskedPhone,
        item: {
          productId: order.item.productId,
          modelName: order.item.modelName,
          shoeTypeFr: order.item.shoeTypeFr,
          shoeTypeAr: order.item.shoeTypeAr,
          colorNameFr: order.item.colorNameFr,
          colorNameAr: order.item.colorNameAr,
          colorHex: order.item.colorHex,
          size: order.item.size,
          quantity: order.item.quantity,
          unitPriceMAD: order.item.unitPriceMAD,
          totalMAD: order.item.totalMAD,
        },
        pricing: {
          subtotalMAD: order.pricing.subtotalMAD,
          deliveryFeeMAD: order.pricing.deliveryFeeMAD,
          totalMAD: order.pricing.totalMAD,
          currency: order.pricing.currency || 'MAD',
        },
      },
    });
  } catch (err: any) {
    console.error('[BIAZ] Error during order tracking:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ مؤقت أثناء معالجة طلبك. يرجى المحاولة لاحقاً.',
        errorFr: 'Une erreur temporaire est survenue lors du traitement. Veuillez réessayer.',
      },
      { status: 500 }
    );
  }
}
