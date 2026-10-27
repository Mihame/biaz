import { NextRequest, NextResponse } from 'next/server';
import {
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  OrderStatus,
  ORDER_STATUS_META,
} from '@/lib/ordersStore';
import { checkAdminAuth } from '@/lib/adminAuth';

interface RouteContext {
  params: Promise<{
    orderId: string;
  }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { orderId } = await context.params;

    // Admin authentication required for viewing full private customer details
    const isAdmin = checkAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بالوصول.' },
        { status: 401 }
      );
    }

    const order = getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'الطلب غير موجود.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error('[API /api/orders/[orderId] GET] Error:', err);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب تفاصيل الطلب.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const isAdmin = checkAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بتعديل حالة الطلب.' },
        { status: 401 }
      );
    }

    const { orderId } = await context.params;
    const body = await req.json();
    const { status } = body;

    if (!status || !(status in ORDER_STATUS_META)) {
      return NextResponse.json(
        {
          success: false,
          error: `حالة غير صحيحة. الحالات المقبولة: ${Object.keys(ORDER_STATUS_META).join(', ')}`,
        },
        { status: 400 }
      );
    }

    const updatedOrder = updateOrderStatus(orderId, status as OrderStatus);

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'الطلب غير موجود.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الطلب بنجاح.',
      order: updatedOrder,
    });
  } catch (err: any) {
    console.error('[API /api/orders/[orderId] PATCH] Error:', err);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تحديث حالة الطلب.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const isAdmin = checkAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بحذف الطلبات.' },
        { status: 401 }
      );
    }

    const { orderId } = await context.params;
    const deleted = deleteOrder(orderId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'الطلب غير موجود أو تم حذفه مسبقاً.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `تم حذف الطلب ${orderId} نهائياً بنجاح.`,
    });
  } catch (err: any) {
    console.error('[API /api/orders/[orderId] DELETE] Error:', err);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء حذف الطلب.' },
      { status: 500 }
    );
  }
}
