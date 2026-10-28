import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, saveProduct } from '@/lib/productsStore';
import { checkAdminAuth } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('all') === 'true';
    const products = getAllProducts(includeInactive);

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (err: any) {
    console.error('[API Products GET] Error:', err);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تحميل المنتجات / Erreur de chargement.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check admin authorization
    const isAuth = checkAdminAuth(req);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: 'غير مسموح. يرجى تسجيل الدخول كمسؤول.' },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body || !body.modelName || typeof body.modelName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'يرجى كتابة اسم المنتج / Nom du modèle obligatoire.' },
        { status: 400 }
      );
    }

    const saved = saveProduct(body);

    return NextResponse.json({
      success: true,
      product: saved,
      message: 'تم حفظ المنتج بنجاح / Produit enregistré avec succès.',
    });
  } catch (err: any) {
    console.error('[API Products POST] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'حدث خطأ أثناء حفظ المنتج.' },
      { status: 500 }
    );
  }
}
