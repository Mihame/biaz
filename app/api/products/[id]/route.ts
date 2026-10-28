import { NextRequest, NextResponse } from 'next/server';
import { getProductById, deleteProduct } from '@/lib/productsStore';
import { checkAdminAuth } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = getProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'المنتج غير موجود / Produit non trouvé.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'خطأ في جلب بيانات المنتج.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = checkAdminAuth(req);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: 'غير مسموح. يرجى تسجيل الدخول كمسؤول.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = deleteProduct(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'المنتج غير موجود أو تم حذفه مسبقاً.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف المنتج بنجاح.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'خطأ أثناء حذف المنتج.' },
      { status: 500 }
    );
  }
}
